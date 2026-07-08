"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, RefreshCcw, Send, WalletCards } from "lucide-react";
import {
  getStacksApiUrl,
  getStacksExplorerTxUrl,
  publicEnv
} from "@/lib/env";
import {
  buildProofHashInput,
  getFeedNotice,
  normalizeOptionalUrl,
  sampleStacksLogs,
  safeTrim,
  shortAddress,
  type ShipLog
} from "@/lib/proofport";
import { Feed } from "./feed";

type StacksWalletState = {
  address: string;
  connected: boolean;
};

type ClarityJson = {
  type?: string;
  value?: unknown;
};

const emptyWallet: StacksWalletState = {
  address: "",
  connected: false
};

function getStacksContract() {
  if (!publicEnv.stacksContractAddress || !publicEnv.stacksContractName) {
    return null;
  }

  return {
    address: publicEnv.stacksContractAddress,
    name: publicEnv.stacksContractName
  };
}

function getContractId(contract: { address: string; name: string }) {
  return `${contract.address}.${contract.name}` as `${string}.${string}`;
}

function unwrapResponse(value: unknown): unknown {
  const json = value as ClarityJson;
  if (json?.type?.toLowerCase().includes("response") && "value" in json) {
    return json.value;
  }
  if (json?.type === "ok" && "value" in json) {
    return json.value;
  }
  return value;
}

function extractUint(value: unknown) {
  const unwrapped = unwrapResponse(value) as ClarityJson;
  const nested = unwrapResponse(unwrapped?.value) as ClarityJson;
  const candidate = nested?.value ?? unwrapped?.value ?? value;
  const numeric = typeof candidate === "bigint" ? candidate : Number(candidate);
  return Number.isFinite(numeric) ? Number(numeric) : 0;
}

function extractTuple(value: unknown): Record<string, unknown> | null {
  const unwrapped = unwrapResponse(value) as ClarityJson;
  const tuple = (unwrapped?.value ?? unwrapped) as {
    value?: Record<string, unknown>;
    data?: Record<string, unknown>;
  };
  const raw = tuple.value ?? tuple.data;
  if (!raw || typeof raw !== "object") return null;

  return raw;
}

function unwrapString(value: unknown) {
  const json = value as ClarityJson;
  if (typeof value === "string") return value;
  if (typeof json?.value === "string") return json.value;
  return "";
}

function mapStacksLog(json: unknown): ShipLog | null {
  const tuple = extractTuple(json);
  if (!tuple) return null;

  return {
    id: extractUint(tuple.id),
    author: unwrapString(tuple.author),
    summary: unwrapString(tuple.summary),
    proofUri: unwrapString(tuple["proof-uri"]),
    tag: unwrapString(tuple.tag),
    contentHash: unwrapString(tuple["content-hash"]),
    createdAt: extractUint(tuple["created-at"]),
    applause: extractUint(tuple.applause),
    network: "stacks"
  };
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
  const [logs, setLogs] = useState<ShipLog[]>(sampleStacksLogs);
  const [summary, setSummary] = useState("");
  const [proofUri, setProofUri] = useState("");
  const [tag, setTag] = useState("stacks");
  const [message, setMessage] = useState("");
  const [txUrl, setTxUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingApplauseId, setPendingApplauseId] = useState<number | null>(null);

  const contract = getStacksContract();
  const isConfigured = Boolean(contract);

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
  }, []);

  const loadLogs = useCallback(async () => {
    if (!contract) {
      setLogs(sampleStacksLogs);
      return;
    }

    setIsRefreshing(true);
    try {
      const { Cl, cvToJSON, fetchCallReadOnlyFunction } = await import(
        "@stacks/transactions"
      );
      const senderAddress =
        wallet.address || contract.address || "ST000000000000000000002AMW42H";
      const totalResponse = await fetchCallReadOnlyFunction({
        contractAddress: contract.address,
        contractName: contract.name,
        functionName: "get-total-logs",
        functionArgs: [],
        senderAddress,
        network: publicEnv.stacksNetwork
      });
      const total = extractUint(cvToJSON(totalResponse));
      const ids = Array.from({ length: Math.min(total, 8) }, (_, index) => {
        return total - index;
      }).filter((logId) => logId > 0);

      const nextLogs = await Promise.all(
        ids.map(async (logId) => {
          const response = await fetchCallReadOnlyFunction({
            contractAddress: contract.address,
            contractName: contract.name,
            functionName: "get-log",
            functionArgs: [Cl.uint(logId)],
            senderAddress,
            network: publicEnv.stacksNetwork
          });
          return mapStacksLog(cvToJSON(response));
        })
      );

      setLogs(nextLogs.filter((log): log is ShipLog => Boolean(log)));
      setMessage(getFeedNotice(true, "Stacks"));
    } catch (error) {
      setLogs(sampleStacksLogs);
      setMessage(
        error instanceof Error
          ? `Could not load Stacks entries from ${getStacksApiUrl()}: ${error.message}`
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
      await loadLogs();
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
        await loadLogs();
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
          Stacks {publicEnv.stacksNetwork}
        </div>
        <h1 id="stacks-title">Publish with Stacks</h1>
        <p>
          Use Stacks Connect to sign a public proof entry and keep an explorer
          receipt ready to share.
        </p>
        <div className="wallet-strip">
          <span>Stacks wallet</span>
          <strong>{shortAddress(wallet.address)}</strong>
          {wallet.connected ? (
            <button
              type="button"
              className="icon-text-button secondary"
              onClick={() => void disconnectWallet()}
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              className="icon-text-button"
              onClick={() => void connectWallet()}
            >
              Connect
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
              placeholder="Published the Clarity-backed proof log."
            />
          </label>
          <label>
            <span>Proof URL</span>
            <input
              value={proofUri}
              onChange={(event) => setProofUri(event.target.value)}
              inputMode="url"
              placeholder="https://github.com/you/proofport/commit/abc"
            />
          </label>
          <label>
            <span>Tag</span>
            <input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              maxLength={32}
              placeholder="clarity"
            />
          </label>
          <button type="submit" className="primary-action" disabled={!canSubmit}>
            <Send size={18} aria-hidden="true" />
            {isSubmitting ? "Submitting" : "Publish Stacks entry"}
          </button>
        </form>
        <div className="message-line" role="status">
          {message || getFeedNotice(isConfigured, "Stacks")}
        </div>
        {txUrl ? (
          <a className="tx-link" href={txUrl} target="_blank" rel="noreferrer">
            Open explorer receipt <ExternalLink size={15} aria-hidden="true" />
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
            aria-label="Refresh Stacks entries"
            title="Refresh Stacks entries"
          >
            <RefreshCcw size={18} aria-hidden="true" />
          </button>
        </div>
        {isRefreshing ? (
          <p className="loading-line">Refreshing Stacks entries...</p>
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
