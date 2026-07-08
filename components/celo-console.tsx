"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider, Contract, id, JsonRpcProvider } from "ethers";
import { ExternalLink, RefreshCcw, Send, Smartphone } from "lucide-react";
import {
  getCeloAddChainParameters,
  getCeloChainId,
  getCeloChainLabel,
  getCeloExplorerTxUrl,
  getCeloRpcUrl,
  publicEnv
} from "@/lib/env";
import { proofPortCeloAbi } from "@/lib/celo-abi";
import {
  buildProofHashInput,
  getFeedNotice,
  normalizeOptionalUrl,
  sampleCeloLogs,
  safeTrim,
  shortAddress,
  type ShipLog
} from "@/lib/proofport";
import { Feed } from "./feed";

type WalletState = {
  account: string;
  chainId: number | null;
  isMiniPay: boolean;
  hasProvider: boolean;
};

const emptyWalletState: WalletState = {
  account: "",
  chainId: null,
  isMiniPay: false,
  hasProvider: false
};

function mapRawLog(raw: Record<string, unknown>): ShipLog {
  return {
    id: Number(raw.id),
    author: String(raw.author),
    summary: String(raw.summary),
    proofUri: String(raw.proofUri),
    tag: String(raw.tag),
    contentHash: String(raw.contentHash),
    createdAt: Number(raw.createdAt),
    applause: Number(raw.applause),
    network: "celo"
  };
}

async function ensureCeloChain() {
  if (!window.ethereum) {
    throw new Error("No injected Celo wallet was found.");
  }

  if (window.ethereum.isMiniPay) {
    return;
  }

  const targetChainId = getCeloChainId();
  const targetHex = `0x${targetChainId.toString(16)}`;
  const currentHex = await window.ethereum.request<string>({
    method: "eth_chainId"
  });

  if (currentHex?.toLowerCase() === targetHex.toLowerCase()) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetHex }]
    });
  } catch (error) {
    const maybeProviderError = error as { code?: number };

    if (maybeProviderError.code !== 4902) {
      throw error;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [getCeloAddChainParameters()]
    });
  }
}

export function CeloConsole() {
  const [wallet, setWallet] = useState<WalletState>(emptyWalletState);
  const [logs, setLogs] = useState<ShipLog[]>(sampleCeloLogs);
  const [summary, setSummary] = useState("");
  const [proofUri, setProofUri] = useState("");
  const [tag, setTag] = useState("celo");
  const [message, setMessage] = useState("");
  const [txUrl, setTxUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingApplauseId, setPendingApplauseId] = useState<number | null>(null);

  const contractAddress = publicEnv.celoContractAddress;
  const isConfigured = Boolean(contractAddress);

  const canSubmit = useMemo(() => {
    return Boolean(summary.trim()) && !isSubmitting;
  }, [isSubmitting, summary]);

  const refreshWallet = useCallback(async () => {
    if (!window.ethereum) {
      setWallet(emptyWalletState);
      return;
    }

    const [accounts, chainHex] = await Promise.all([
      window.ethereum.request<string[]>({
        method: "eth_accounts",
        params: []
      }),
      window.ethereum.request<string>({
        method: "eth_chainId"
      })
    ]);

    setWallet({
      account: accounts[0] || "",
      chainId: chainHex ? Number.parseInt(chainHex, 16) : null,
      isMiniPay: Boolean(window.ethereum.isMiniPay),
      hasProvider: true
    });
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setMessage("Install MiniPay or another Celo wallet to publish an entry.");
      return "";
    }

    const accounts = await window.ethereum.request<string[]>({
      method: "eth_requestAccounts",
      params: []
    });
    await refreshWallet();
    return accounts[0] || "";
  }, [refreshWallet]);

  const loadLogs = useCallback(async () => {
    if (!contractAddress) {
      setLogs(sampleCeloLogs);
      return;
    }

    setIsRefreshing(true);
    try {
      const provider = new JsonRpcProvider(getCeloRpcUrl());
      const contract = new Contract(contractAddress, proofPortCeloAbi, provider);
      const total = Number(await contract.totalLogs());
      const ids = Array.from({ length: Math.min(total, 8) }, (_, index) => {
        return total - index;
      }).filter((logId) => logId > 0);
      const nextLogs = await Promise.all(
        ids.map(async (logId) => {
          const raw = await contract.getLog(logId);
          return mapRawLog(raw);
        })
      );

      setLogs(nextLogs);
      setMessage(getFeedNotice(true, "Celo"));
    } catch (error) {
      setLogs(sampleCeloLogs);
      setMessage(
        error instanceof Error
          ? `Could not load Celo entries: ${error.message}`
          : "Could not load Celo entries."
      );
    } finally {
      setIsRefreshing(false);
    }
  }, [contractAddress]);

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

    if (!contractAddress) {
      setMessage("Live Celo publishing is not connected yet.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setTxUrl("");

    try {
      await ensureCeloChain();
      const account = wallet.account || (await connect());
      if (!account || !window.ethereum) {
        throw new Error("Connect a Celo wallet before publishing.");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, proofPortCeloAbi, signer);
      const contentHash = id(
        buildProofHashInput({
          summary: cleanSummary,
          proofUri: cleanProofUri,
          tag: cleanTag
        })
      );
      const tx = await contract.createLog(
        cleanSummary,
        cleanProofUri,
        cleanTag,
        contentHash
      );
      const receipt = await tx.wait();
      const explorerUrl = getCeloExplorerTxUrl(receipt.hash);

      setTxUrl(explorerUrl);
      setSummary("");
      setProofUri("");
      setTag("celo");
      setMessage("Celo entry confirmed.");
      await refreshWallet();
      await loadLogs();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Celo transaction was rejected."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    connect,
    contractAddress,
    loadLogs,
    proofUri,
    refreshWallet,
    summary,
    tag,
    wallet.account
  ]);

  const applaud = useCallback(
    async (logId: number) => {
      if (!contractAddress) {
        setMessage("Live Celo applause is not connected yet.");
        return;
      }

      setPendingApplauseId(logId);
      try {
        await ensureCeloChain();
        await connect();
        if (!window.ethereum) throw new Error("No Celo wallet available.");

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, proofPortCeloAbi, signer);
        const tx = await contract.applaud(logId);
        const receipt = await tx.wait();

        setTxUrl(getCeloExplorerTxUrl(receipt.hash));
        setMessage(`Applauded log #${logId}.`);
        await loadLogs();
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Could not send applause."
        );
      } finally {
        setPendingApplauseId(null);
      }
    },
    [connect, contractAddress, loadLogs]
  );

  useEffect(() => {
    const refreshId = window.setTimeout(() => {
      void refreshWallet();
      void loadLogs();
    }, 0);

    return () => window.clearTimeout(refreshId);
  }, [loadLogs, refreshWallet]);

  return (
    <section className="entry-layout" aria-labelledby="celo-title">
      <div className="chain-panel primary-panel">
        <div className="panel-kicker">
          <Smartphone size={18} aria-hidden="true" />
          {getCeloChainLabel()}
        </div>
        <h1 id="celo-title">Publish with Celo</h1>
        <p>
          Use MiniPay or any Celo wallet to write a public proof entry and share
          its explorer receipt.
        </p>
        <div className="wallet-strip">
          <span>{wallet.isMiniPay ? "MiniPay detected" : "Wallet"}</span>
          <strong>{shortAddress(wallet.account)}</strong>
          {!wallet.isMiniPay ? (
            <button type="button" className="icon-text-button" onClick={connect}>
              Connect
            </button>
          ) : null}
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
              placeholder="Published the mobile proof log."
            />
          </label>
          <label>
            <span>Proof URL</span>
            <input
              value={proofUri}
              onChange={(event) => setProofUri(event.target.value)}
              inputMode="url"
              placeholder="https://github.com/you/proofport/pull/1"
            />
          </label>
          <label>
            <span>Tag</span>
            <input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              maxLength={32}
              placeholder="minipay"
            />
          </label>
          <button type="submit" className="primary-action" disabled={!canSubmit}>
            <Send size={18} aria-hidden="true" />
            {isSubmitting ? "Confirming" : "Publish Celo entry"}
          </button>
        </form>
        <div className="message-line" role="status">
          {message || getFeedNotice(isConfigured, "Celo")}
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
            aria-label="Refresh Celo entries"
            title="Refresh Celo entries"
          >
            <RefreshCcw size={18} aria-hidden="true" />
          </button>
        </div>
        {isRefreshing ? <p className="loading-line">Refreshing Celo entries...</p> : null}
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
