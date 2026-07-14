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

  const canSubmit = useMemo(() => {
    return Boolean(summary.trim()) && !isSubmitting;
  }, [isSubmitting, summary]);

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
    const cleanTag = safeTrim(tag || "proof", 32).toLowerCase();

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
          receipt ready to share.
        </p>
        <div className="wallet-strip">
          <span>Stacks wallet</span>
          <strong aria-live="polite" aria-atomic="true">
            {walletLabel}
          </strong>
          {wallet.connected ? (
            <button
              type="button"
              className="icon-text-button secondary"
              onClick={() => void disconnectWallet()}
            >
              Disconnect wallet
            </button>
          ) : (
            <button
              type="button"
              className="icon-text-button"
              onClick={() => void connectWallet()}
            >
              Connect wallet
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
            <span>Summary</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              maxLength={160}
              rows={4}
              required
              placeholder="Published the Clarity-backed proof log."
              aria-describedby="stacks-summary-hint"
            />
            <small className="field-hint" id="stacks-summary-hint">
              Keep it under 160 characters.
            </small>
          </label>
          <label>
            <span>Proof URL</span>
            <input
              type="url"
              value={proofUri}
              onChange={(event) => setProofUri(event.target.value)}
              autoComplete="url"
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="https://github.com/you/proofport/commit/abc"
              aria-describedby="stacks-proof-url-hint"
            />
            <small className="field-hint" id="stacks-proof-url-hint">
              Optional. HTTPS links only.
            </small>
          </label>
          <label>
            <span>Tag</span>
            <input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              maxLength={32}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="clarity"
              aria-describedby="stacks-tag-hint"
            />
            <small className="field-hint" id="stacks-tag-hint">
              Optional. Short labels only, up to 32 characters.
            </small>
          </label>
          <button
            type="submit"
            className="primary-action"
            disabled={!canSubmit}
            aria-busy={isSubmitting}
          >
            <Send size={18} aria-hidden="true" />
            {isSubmitting ? "Publishing..." : "Publish Stacks entry"}
          </button>
        </form>
        <div className="message-line" role="status" aria-live="polite" aria-atomic="true">
          {message || getFeedNotice(isConfigured, "Stacks")}
        </div>
        {txUrl ? (
          <a
            className="tx-link"
            href={txUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Stacks explorer receipt in a new tab"
          >
            Open explorer receipt
            <span className="sr-only"> (opens in a new tab)</span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <div className="chain-panel feed-panel">
        <div className="feed-toolbar">
          <div>
            <span className="panel-kicker">Public feed</span>
            <h2>Latest entries</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={() => void loadLogs()}
            disabled={isRefreshing}
            aria-label={
              isRefreshing ? "Refreshing Stacks entries" : "Refresh Stacks entries"
            }
            aria-busy={isRefreshing}
          >
            <span className="sr-only">Refresh Stacks entries</span>
            <RefreshCcw size={18} aria-hidden="true" />
          </button>
        </div>
        {isRefreshing ? (
          <p className="loading-line" role="status" aria-live="polite">
            Refreshing Stacks entries...
          </p>
        ) : null}
        <Feed
          logs={logs}
          emptyLabel="No entries yet on this network."
          onApplaud={applaud}
          pendingApplauseId={pendingApplauseId}
        />
      </div>
    </section>
  );
}
