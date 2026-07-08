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
import { getCeloChainLabel, publicEnv } from "@/lib/env";

export const metadata: Metadata = {
  other: {
    "talentapp:project_verification":
      "642850b959bcb0dc353caa3757fff7dd8827558756deeb9f993428f4159b23e0fff0f77de5b7cf95e9072a3bde82509c8fe8176fa36832c5071c7d155b1d1298"
  }
};

export default function HomePage() {
  const stacksNetworkLabel =
    publicEnv.stacksNetwork === "mainnet" ? "Stacks Mainnet" : "Stacks Testnet";

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
          <div className="hero-actions">
            <Link className="primary-action" href="/celo">
              Publish with Celo <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="primary-action alt" href="/stacks">
              Publish with Stacks <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="signal-board proof-preview" aria-label="ProofPort preview">
          <div className="proof-preview-head">
            <span>Latest proof</span>
            <strong>Verified</strong>
          </div>
          <div className="ledger-preview">
            <span className="ledger-dot" />
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
        <article className="network-card network-card-celo">
          <div className="network-icon">
            <Smartphone size={22} aria-hidden="true" />
          </div>
          <div>
            <span>{getCeloChainLabel()}</span>
            <h3>Celo</h3>
            <p>
              A mobile-friendly path for MiniPay and Celo wallets, built for quick
              public proof entries.
            </p>
          </div>
          <Link className="primary-action" href="/celo">
            Publish with Celo <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
        <article className="network-card network-card-stacks">
          <div className="network-icon">
            <WalletCards size={22} aria-hidden="true" />
          </div>
          <div>
            <span>{stacksNetworkLabel}</span>
            <h3>Stacks</h3>
            <p>
              A Bitcoin-aligned path for Stacks wallets, with public entries and
              explorer receipts.
            </p>
          </div>
          <Link className="primary-action alt" href="/stacks">
            Publish with Stacks <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
      </section>

      <section className="how-it-works" aria-label="How ProofPort works">
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
