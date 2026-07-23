import type { Metadata } from "next";
import { CeloConsole } from "@/components/celo-console";

export const metadata: Metadata = {
  title: "Publish with Celo",
  description:
    "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling, shareable explorer receipts, and no account required.",
  alternates: {
    canonical: "/celo"
  },
  openGraph: {
    title: "Publish with Celo | ProofPort",
    description:
      "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling, shareable explorer receipts, and no account required.",
    url: "/celo",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview of the Celo publishing flow"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Publish with Celo | ProofPort",
    description:
      "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling, shareable explorer receipts, and no account required.",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview of the Celo publishing flow"
      }
    ]
  }
};

export default function CeloPage() {
  return <CeloConsole />;
}
