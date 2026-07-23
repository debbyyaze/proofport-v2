import type { Metadata } from "next";
import { StacksConsole } from "@/components/stacks-console";

export const metadata: Metadata = {
  title: "Publish with Stacks",
  description:
    "Create public ProofPort entries on Stacks with Stacks Connect wallet signing, shareable explorer receipts, and no account required.",
  alternates: {
    canonical: "/stacks"
  },
  openGraph: {
    title: "Publish with Stacks | ProofPort",
    description:
      "Create public ProofPort entries on Stacks with Stacks Connect wallet signing, shareable explorer receipts, and no account required.",
    url: "/stacks",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview of the Stacks publishing flow"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Publish with Stacks | ProofPort",
    description:
      "Create public ProofPort entries on Stacks with Stacks Connect wallet signing, shareable explorer receipts, and no account required.",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview of the Stacks publishing flow"
      }
    ]
  }
};

export default function StacksPage() {
  return <StacksConsole />;
}
