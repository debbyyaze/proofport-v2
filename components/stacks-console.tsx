"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, RefreshCcw, Send, WalletCards } from "lucide-react";
import { getStacksChainLabel, getStacksExplorerTxUrl, publicEnv } from "@/lib/env";
import {
  buildProofHashInput,
  getFeedNotice,
  normalizeOptionalUrl,
  sampleStacksLogs,
  safeTrim,
  shortAddress,
  type ShipLog
} from "@/lib/proofport";
import type { StacksContractRef } from "@/lib/stacks-log-parser";
import { Feed } from "./feed";

type StacksWalletState = {
  address: string;
  connected: boolean;
};

const emptyWallet: StacksWalletState = {
  address: "",
  connected: false
};

function isAlertMessage(message: string) {
  return /could not|rejected|before publishing|before submitting|must be https|not connected|install/i.test(
    message
  );
}

type StacksLogsResponse = {
  configured: boolean;
  logs: ShipLog[];
  source: string;
  error?: string;
};

function getStacksContract(): StacksContractRef | null {
  if (!publicEnv.stacksContractAddress || !publicEnv.stacksContractName) {
    return null;
  }

  return {
    address: publicEnv.stacksContractAddress,
    name: publicEnv.stacksContractName
  };
}

const configuredStacksContract = getStacksContract();
const initialStacksLogs = configuredStacksContract ? [] : sampleStacksLogs;

function getContractId(contract: StacksContractRef) {
  return `${contract.address}.${contract.name}` as `${string}.${string}`;
}

async function getConnectedAddress() {
  const { getLocalStorage, isConnected } = await import("@stacks/connect");

  if (!isConnected()) {
    return "";
  }

  const userData = getLocalStorage() as {
    addresses?: {
      stx?: Array<{ address: string }>;
    };
  } | null;

  return userData?.addresses?.stx?.[0]?.address || "";
}

export function StacksConsole() {
  const feedHeadingId = "stacks-feed-title";
  const feedListId = "stacks-feed-list";
  const publishNoticeId = "stacks-publish-notice";
  const publishHintId = "stacks-publish-hint";
  const walletStatusId = "stacks-wallet-status";
  const [wallet, setWallet] = useState<StacksWalletState>(emptyWallet);
  const [logs, setLogs] = useState<ShipLog[]>(initialStacksLogs);
  const [summary, setSummary] = useState("");
  const [proofUri, setProofUri] = useState("");
  const [tag, setTag] = useState("stacks");
  const [message, setMessage] = useState("");
  const [txUrl, setTxUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingApplauseId, setPendingApplauseId] = useState<number | null>(null);

  const contract = configuredStacksContract;
  const isConfigured = Boolean(contract);
  const walletLabel = wallet.address ? shortAddress(wallet.address) : "Not connected";
  const connectWalletLabel = "Connect Stacks wallet";
  const hasInvalidProofUrl = Boolean(proofUri.trim()) && !normalizeOptionalUrl(proofUri);
  const hasAlertStatus = isAlertMessage(message);
  const defaultNotice = getFeedNotice(isConfigured, "Stacks");
  const publishHint = !isConfigured
    ? "Live Stacks publishing stays disabled until a contract address is configured."
    : !summary.trim()
      ? "Add a short public summary to enable publishing."
      : hasInvalidProofUrl
        ? "Use a full HTTPS proof URL or clear the field to enable publishing."
        : !wallet.connected
          ? "A Stacks wallet connection will be requested when you publish."
        : "Ready to publish from your connected wallet.";

  const canSubmit = useMemo(() => {
    return Boolean(summary.trim()) && !hasInvalidProofUrl && !isSubmitting;
  }, [hasInvalidProofUrl, isSubmitting, summary]);
  const canPublish = canSubmit && isConfigured;

  const refreshWallet = useCallback(async () => {
    try {
      const address = await getConnectedAddress();
      setWallet({
        address,
        connected: Boolean(address)
      });
    } catch {
      setWallet(emptyWallet);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    const { connect } = await import("@stacks/connect");
    await connect();
    const address = await getConnectedAddress();
    setWallet({
      address,
      connected: Boolean(address)
    });
    return address;
  }, []);

  const disconnectWallet = useCallback(async () => {
    const { disconnect } = await import("@stacks/connect");
    disconnect();
    setWallet(emptyWallet);
    setMessage("");
    setTxUrl("");
  }, []);

  const loadLogs = useCallback(async (forceFresh = false) => {
    if (!contract) {
      setLogs(sampleStacksLogs);
      return;
    }

    setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (wallet.address) params.set("sender", wallet.address);
      if (forceFresh) params.set("refresh", Date.now().toString());
      const query = params.toString();
      const response = await fetch(`/api/stacks/logs${query ? `?${query}` : ""}`);
      const body = (await response.json()) as StacksLogsResponse;

      if (!response.ok || body.error) {
        throw new Error(body.error || "Could not load Stacks entries.");
      }

      setLogs(body.logs);
      setMessage(getFeedNotice(true, "Stacks"));
    } catch (error) {
      setLogs(sampleStacksLogs);
      setMessage(
        error instanceof Error
          ? `Could not load Stacks entries: ${error.message}`
          : "Could not load Stacks entries."
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [contract, wallet.address]);

  const submitLog = useCallback(async () => {
    const cleanSummary = safeTrim(summary, 160);
    const cleanProofUri = normalizeOptionalUrl(proofUri);
    const cleanTag = safeTrim(tag, 32).toLowerCase() || "proof";

    if (!cleanSummary) {
      setMessage("Add a short summary before submitting.");
      return;
    }

    if (proofUri.trim() && !cleanProofUri) {
      setMessage("Proof URLs must be HTTPS.");
      return;
    }

    if (!contract) {
      setMessage("Live Stacks publishing is not connected yet.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setTxUrl("");

    try {
      const { request } = await import("@stacks/connect");
      const { Cl } = await import("@stacks/transactions");
      const address = wallet.address || (await connectWallet());

      if (!address) {
        throw new Error("Connect a Stacks wallet before publishing.");
      }

      const contentHash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(
          buildProofHashInput({
            summary: cleanSummary,
            proofUri: cleanProofUri,
            tag: cleanTag
          })
        )
      );
      const hashHex = `0x${Array.from(new Uint8Array(contentHash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")}`;
      const response = await request("stx_callContract", {
        contract: getContractId(contract),
        functionName: "create-log",
        functionArgs: [
          Cl.stringAscii(cleanSummary),
          Cl.stringAscii(cleanProofUri),
          Cl.stringAscii(cleanTag),
          Cl.stringAscii(hashHex)
        ],
        network: publicEnv.stacksNetwork
      });
      const txId = response.txid;

      if (txId) {
        setTxUrl(getStacksExplorerTxUrl(txId));
      }
      setSummary("");
      setProofUri("");
      setTag("stacks");
      setMessage("Stacks entry submitted.");
      await refreshWallet();
      await loadLogs(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Stacks transaction was rejected."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    connectWallet,
    contract,
    loadLogs,
    proofUri,
    refreshWallet,
    summary,
    tag,
    wallet.address
  ]);

  const applaud = useCallback(
    async (logId: number) => {
      if (!contract) {
        setMessage("Live Stacks applause is not connected yet.");
        return;
      }

      setPendingApplauseId(logId);
      try {
        const { request } = await import("@stacks/connect");
        const { Cl } = await import("@stacks/transactions");
        await connectWallet();
        const response = await request("stx_callContract", {
          contract: getContractId(contract),
          functionName: "applaud",
          functionArgs: [Cl.uint(logId)],
          network: publicEnv.stacksNetwork
        });
        const txId = response.txid;

        if (txId) {
          setTxUrl(getStacksExplorerTxUrl(txId));
        }
        setMessage(`Submitted applause for log #${logId}.`);
        await loadLogs(true);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Could not send applause."
        );
      } finally {
        setPendingApplauseId(null);
      }
    },
    [connectWallet, contract, loadLogs]
  );

  useEffect(() => {
    const refreshId = window.setTimeout(() => {
      void refreshWallet();
      void loadLogs();
    }, 0);

    return () => window.clearTimeout(refreshId);
  }, [loadLogs, refreshWallet]);

  return (
    <section className="entry-layout" aria-labelledby="stacks-title">
      <div className="chain-panel primary-panel">
        <div className="panel-kicker">
          <WalletCards size={18} aria-hidden="true" />
          {getStacksChainLabel()}
        </div>
        <h1 id="stacks-title">Publish with Stacks</h1>
        <p>
          Use Stacks Connect to sign a public proof entry and keep an explorer
          receipt ready to share. No ProofPort account required. Your summary,
          tag, connected wallet address, explorer receipt, and any proof link
          you attach are all public.
        </p>
        <div className="wallet-strip">
          <span>Stacks wallet</span>
          <strong
            id={walletStatusId}
            aria-live="polite"
            aria-atomic="true"
            aria-label={
              wallet.address
                ? `Connected Stacks wallet ${wallet.address}`
                : "Stacks wallet not connected"
            }
            title={wallet.address || undefined}
          >
            {walletLabel}
          </strong>
          {wallet.connected ? (
            <button
              type="button"
              className="icon-text-button secondary"
              onClick={() => void disconnectWallet()}
              aria-describedby={walletStatusId}
              aria-label="Disconnect Stacks wallet"
            >
              Disconnect wallet
            </button>
          ) : (
            <button
              type="button"
              className="icon-text-button"
              onClick={() => {
                void connectWallet().catch((error) => {
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "Could not connect Stacks wallet."
                  );
                });
              }}
              aria-describedby={walletStatusId}
              aria-label="Connect Stacks wallet"
            >
              {connectWalletLabel}
            </button>
          )}
        </div>
        <form
          className="ship-form"
          onSubmit={(event) => {
            event.preventDefault();
            void submitLog();
          }}
        >
          <label>
            <span>Summary (required)</span>
            <textarea
              id="stacks-summary"
              name="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              maxLength={160}
              rows={4}
              required
              autoCapitalize="sentences"
              placeholder="Shipped the wallet connect fallback fix."
              aria-describedby="stacks-summary-hint"
            />
            <small
              className="field-hint"
              id="stacks-summary-hint"
              aria-live="polite"
              aria-atomic="true"
            >
              {summary.length}/160 characters. Name one shipped change people can
              verify, and keep private details out because this summary is public.
            </small>
          </label>
          <label>
            <span>Public HTTPS proof URL (optional)</span>
            <input
              id="stacks-proof-url"
              name="proofUrl"
              type="url"
              value={proofUri}
              onChange={(event) => setProofUri(event.target.value)}
              pattern="https://.*"
              autoComplete="url"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="https://example.com/posts/ship-log-proof"
              aria-describedby={
                hasInvalidProofUrl
                  ? "stacks-proof-url-hint stacks-proof-url-error"
                  : "stacks-proof-url-hint"
              }
              aria-errormessage={
                hasInvalidProofUrl ? "stacks-proof-url-error" : undefined
              }
              aria-invalid={hasInvalidProofUrl}
              title="Use an HTTPS URL starting with https://"
            />
            {hasInvalidProofUrl ? (
              <small className="field-hint" id="stacks-proof-url-error" role="alert">
                Enter a public HTTPS URL starting with https:// or leave this
                field empty.
              </small>
            ) : null}
            <small
              className="field-hint"
              id="stacks-proof-url-hint"
            >
              Optional. Leave this empty to publish without a proof link, or add a
              public HTTPS pull request, commit, release notes page, or live demo URL
              that opens without login, paywall, or VPN. Anyone viewing the feed
              can open this link.
            </small>
          </label>
          <label>
            <span>Tag (optional)</span>
            <input
              id="stacks-tag"
              name="tag"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="clarity"
              aria-describedby="stacks-tag-hint"
            />
            <small
              className="field-hint"
              id="stacks-tag-hint"
              aria-live="polite"
              aria-atomic="true"
            >
              {tag.length}/32 characters. Keep `stacks`, replace it, or clear it
              to fall back to the default `proof` tag. Tags are public too.
            </small>
          </label>
          <button
            type="submit"
            className="primary-action"
            disabled={!canPublish}
            aria-busy={isSubmitting}
            aria-describedby={`${publishHintId} ${publishNoticeId}`}
          >
            <Send size={18} aria-hidden="true" />
            {isSubmitting ? "Publishing..." : "Publish Stacks entry"}
          </button>
          <small
            className="field-hint"
            id={publishHintId}
            aria-live="polite"
            aria-atomic="true"
          >
            {publishHint}
          </small>
        </form>
        {message ? (
          <div
            id={publishNoticeId}
            className="message-line"
            role={hasAlertStatus ? "alert" : "status"}
            aria-live={hasAlertStatus ? "assertive" : "polite"}
            aria-atomic="true"
          >
            {message}
          </div>
        ) : (
          <p
            className="message-line"
            id={publishNoticeId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {defaultNotice}
          </p>
        )}
        {txUrl ? (
          <p className="message-line" role="status" aria-live="polite" aria-atomic="true">
            Latest Stacks explorer receipt ready:{" "}
            <a
              className="tx-link"
              href={txUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={txUrl}
              aria-label="Open the latest Stacks explorer receipt for your wallet action in a new tab"
            >
              Open latest Stacks explorer receipt (new tab)
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          </p>
        ) : null}
      </div>
      <div className="chain-panel feed-panel">
        <div className="feed-toolbar">
          <div>
            <span className="panel-kicker">Public feed</span>
            <h2 id={feedHeadingId}>Latest Stacks entries</h2>
            <p className="feed-note">
              Each applause click is a separate public wallet action tied to your
              connected address.
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={() => void loadLogs()}
            disabled={isRefreshing}
            aria-busy={isRefreshing}
            aria-controls={feedListId}
            aria-label={
              isRefreshing ? "Refreshing Stacks entries" : "Refresh Stacks entries"
            }
            title={isRefreshing ? "Refreshing Stacks entries" : "Refresh Stacks entries"}
          >
            <span className="sr-only">
              {isRefreshing ? "Refreshing Stacks entries" : "Refresh Stacks entries"}
            </span>
            <RefreshCcw size={18} aria-hidden="true" />
          </button>
        </div>
        {isRefreshing ? (
          <p
            className="loading-line"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            Refreshing Stacks entries...
          </p>
        ) : null}
        <Feed
          id={feedListId}
          logs={logs}
          emptyLabel="No Stacks entries yet. Publish the first proof entry to generate a shareable explorer receipt."
          labelledBy={feedHeadingId}
          onApplaud={applaud}
          pendingApplauseId={pendingApplauseId}
        />
      </div>
    </section>
  );
}
