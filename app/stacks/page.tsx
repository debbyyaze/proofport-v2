import type { Metadata } from "next";
import { StacksConsole } from "@/components/stacks-console";

export const metadata: Metadata = {
  title: "Publish with Stacks",
  description:
    "Create public ProofPort entries on Stacks with Stacks Connect wallet signing, optional public HTTPS proof links, shareable explorer receipts, and no account required.",
  alternates: {
    canonical: "/stacks"
  },
  openGraph: {
    title: "Publish with Stacks | ProofPort",
    description:
      "Create public ProofPort entries on Stacks with Stacks Connect wallet signing, optional public HTTPS proof links, shareable explorer receipts, and no account required.",
    url: "/stacks",
    siteName: "ProofPort",
    type: "website",
    images: [
      {
        url: "/og.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
        alt: "ProofPort preview of the Stacks publishing path"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Publish with Stacks | ProofPort",
    description:
      "Create public ProofPort entries on Stacks with Stacks Connect wallet signing, optional public HTTPS proof links, shareable explorer receipts, and no account required.",
    images: [
      {
        url: "/og.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
        alt: "ProofPort preview of the Stacks publishing path"
      }
    ]
  }
};

export default function StacksPage() {
  return <StacksConsole />;
}
