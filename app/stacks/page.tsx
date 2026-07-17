import type { Metadata } from "next";
import { StacksConsole } from "@/components/stacks-console";

export const metadata: Metadata = {
  title: "Publish with Stacks",
  description:
    "Create public ProofPort entries on Stacks with Stacks Connect wallet signing.",
  alternates: {
    canonical: "/stacks"
  },
  openGraph: {
    title: "Publish with Stacks | ProofPort",
    description:
      "Create public ProofPort entries on Stacks with Stacks Connect wallet signing.",
    url: "/stacks",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Publish with Stacks | ProofPort",
    description:
      "Create public ProofPort entries on Stacks with Stacks Connect wallet signing.",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  }
};

export default function StacksPage() {
  return <StacksConsole />;
}
