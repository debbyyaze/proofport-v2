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
  description:
    "Capture what shipped, attach a proof link, and publish a wallet-signed record people can verify.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "ProofPort",
    description:
      "Capture what shipped, attach a proof link, and publish a wallet-signed record people can verify.",
    url: "/"
  },
  twitter: {
    title: "ProofPort",
    description:
      "Capture what shipped, attach a proof link, and publish a wallet-signed record people can verify."
  },
  other: {
    "talentapp:project_verification":
      "642850b959bcb0dc353caa3757fff7dd8827558756deeb9f993428f4159b23e0fff0f77de5b7cf95e9072a3bde82509c8fe8176fa36832c5071c7d155b1d1298"
  }
};

export default function HomePage() {
  return (
    <div className="home-grid">
      <section className="hero-workbench" aria-labelledby="home-title">
        <div className="hero-copy">
          <span className="panel-kicker">Public proof logs</span>
          <h1 id="home-title">ProofPort</h1>
          <p>
            Capture what shipped, attach a proof link, and publish a wallet-signed
            record people can verify.
          </p>
          <nav aria-label="Choose a publishing network" className="hero-actions">
            <Link className="primary-action" href="/celo">
              Publish with Celo <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="primary-action alt" href="/stacks">
              Publish with Stacks <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </nav>
        </div>
        <div
          aria-describedby="proof-preview-description"
          aria-labelledby="proof-preview-title"
          className="signal-board proof-preview"
        >
          <h2 className="sr-only" id="proof-preview-title">
            Example proof preview
          </h2>
          <p className="sr-only" id="proof-preview-description">
            Preview of an example published proof entry with its verification status.
          </p>
          <div className="proof-preview-head">
            <span>Example proof</span>
            <strong>Verification preview</strong>
          </div>
          <div className="ledger-preview">
            <span className="ledger-dot" aria-hidden="true" />
            <div>
              <strong>Published mobile release notes</strong>
              <p>Proof link attached. Explorer receipt ready to share.</p>
            </div>
          </div>
          <div className="mini-route-map" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="network-selector" aria-labelledby="network-title">
        <div className="section-heading">
          <span className="panel-kicker">Choose a network</span>
          <h2 id="network-title">Publish where your wallet already lives.</h2>
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
              A mobile-friendly path for MiniPay and Celo wallets, built for quick
              public proof entries.
            </p>
          </div>
          <Link className="primary-action" href="/celo">
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
              A Bitcoin-aligned path for Stacks wallets, with public entries and
              explorer receipts.
            </p>
          </div>
          <Link className="primary-action alt" href="/stacks">
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
          <p>Summarize what changed and attach the best proof link.</p>
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
          <h3>Keep a feed</h3>
          <p>Recent entries stay visible in a public proof log.</p>
        </article>
      </section>
    </div>
  );
}
