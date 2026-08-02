import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Link2,
  ShieldCheck,
  Smartphone,
  WalletCards
} from "lucide-react";
import { getCeloChainLabel, getStacksChainLabel } from "@/lib/env";

export const metadata: Metadata = {
  title: "Public proof logs for shipped work",
  description:
    "Publish wallet-signed proof entries, optionally attach a public proof link, and share explorer receipts anyone can verify.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Public proof logs for shipped work | ProofPort",
    description:
      "Publish wallet-signed proof entries, optionally attach a public proof link, and share explorer receipts anyone can verify.",
    url: "/",
    siteName: "ProofPort",
    type: "website",
    images: [
      {
        url: "/og.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Public proof logs for shipped work | ProofPort",
    description:
      "Publish wallet-signed proof entries, optionally attach a public proof link, and share explorer receipts anyone can verify.",
    images: [
      {
        url: "/og.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  }
};

export default function HomePage() {
  return (
    <div className="home-grid">
      <section className="hero-workbench" aria-labelledby="home-title">
        <div className="hero-copy">
          <span className="panel-kicker">ProofPort</span>
          <h1 id="home-title">Public proof logs for shipped work</h1>
          <p>
            Capture what shipped, optionally attach a public HTTPS proof link,
            and publish a wallet-signed record with a shareable explorer
            receipt anyone can verify. Proof links must open without login,
            paywall, or VPN. No ProofPort account required.
          </p>
          <nav
            aria-describedby="publish-visibility-note"
            aria-label="Choose a publishing network"
            className="hero-actions"
          >
            <Link
              aria-label="Start publishing with Celo"
              className="primary-action"
              href="/celo"
            >
              Publish with Celo <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              aria-label="Start publishing with Stacks"
              className="primary-action alt"
              href="/stacks"
            >
              Publish with Stacks <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              className="secondary-action"
              href="#choose-network"
              aria-label="Jump to the Celo and Stacks comparison section"
            >
              Compare Celo and Stacks first
            </a>
          </nav>
          <p className="hero-note" id="publish-visibility-note">
            <strong>Public by default.</strong> Every proof entry exposes the
            summary, tag, wallet address, explorer receipt, proof link if
            attached, and any applause sent from your wallet.
          </p>
        </div>
        <section
          aria-describedby="proof-preview-description proof-preview-caption"
          aria-labelledby="proof-preview-title"
          className="signal-board proof-preview"
        >
          <p className="sr-only" id="proof-preview-description">
            Preview of an example published proof entry and its shareable explorer receipt.
          </p>
          <div className="proof-preview-head">
            <span>Example proof</span>
            <h2 id="proof-preview-title">Explorer receipt preview</h2>
          </div>
          <p className="preview-caption" id="proof-preview-caption">
            Illustrative preview only. Live explorer receipts open from each
            published entry.
          </p>
          <div className="ledger-preview">
            <span className="ledger-dot" aria-hidden="true" />
            <div>
              <strong>Published mobile release notes</strong>
              <p>
                Public HTTPS proof link attached when it opens without login,
                paywall, or VPN. Explorer receipt ready to share either way.
              </p>
            </div>
          </div>
          <div className="mini-route-map" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>
      </section>

      <section
        id="choose-network"
        className="network-selector"
        aria-labelledby="network-title"
      >
        <div className="section-heading">
          <span className="panel-kicker">Choose a network</span>
          <h2 id="network-title">Start on the wallet network you already use.</h2>
          <p>
            Both paths publish public proof entries, optional public HTTPS
            proof links, and shareable explorer receipts. The difference is
            which wallet ecosystem you want to use to sign and publish them.
          </p>
        </div>
        <article
          aria-describedby="network-celo-description"
          aria-labelledby="network-celo-title"
          className="network-card network-card-celo"
        >
          <div className="network-icon">
            <Smartphone size={22} aria-hidden="true" />
          </div>
          <div>
            <span>{getCeloChainLabel()}</span>
            <h3 id="network-celo-title">Celo</h3>
            <p id="network-celo-description">
              A mobile-friendly path for MiniPay and Celo wallets, with public
              proof entries, optional public HTTPS proof links, shareable
              explorer receipts, and no account required.
            </p>
          </div>
          <Link
            aria-describedby="network-celo-description"
            className="primary-action"
            href="/celo"
          >
            Publish with Celo <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
        <article
          aria-describedby="network-stacks-description"
          aria-labelledby="network-stacks-title"
          className="network-card network-card-stacks"
        >
          <div className="network-icon">
            <WalletCards size={22} aria-hidden="true" />
          </div>
          <div>
            <span>{getStacksChainLabel()}</span>
            <h3 id="network-stacks-title">Stacks</h3>
            <p id="network-stacks-description">
              A Bitcoin-linked path for Stacks wallets, with public proof
              entries, optional public HTTPS proof links, shareable explorer
              receipts, and no account required.
            </p>
          </div>
          <Link
            aria-describedby="network-stacks-description"
            className="primary-action alt"
            href="/stacks"
          >
            Publish with Stacks <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
      </section>

      <section className="how-it-works" aria-labelledby="how-it-works-title">
        <div className="section-heading">
          <span className="panel-kicker">How it works</span>
          <h2 id="how-it-works-title">Turn shipped work into a public proof log.</h2>
        </div>
        <article>
          <FileText size={20} aria-hidden="true" />
          <h3>Write the entry</h3>
          <p>
            Summarize what changed and add a public HTTPS proof link when it
            opens without login, paywall, or VPN.
          </p>
        </article>
        <article>
          <ShieldCheck size={20} aria-hidden="true" />
          <h3>Sign with wallet</h3>
          <p>Publish a compact record from the network you choose.</p>
        </article>
        <article>
          <Link2 size={20} aria-hidden="true" />
          <h3>Share the receipt</h3>
          <p>Open the explorer receipt and let anyone verify the record.</p>
        </article>
        <article>
          <BadgeCheck size={20} aria-hidden="true" />
          <h3>Keep a public feed</h3>
          <p>Recent entries stay visible in a proof log others can review.</p>
        </article>
      </section>
    </div>
  );
}
