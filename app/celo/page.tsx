import type { Metadata } from "next";
import { CeloConsole } from "@/components/celo-console";

export const metadata: Metadata = {
  title: "Publish with Celo",
  description:
    "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling.",
  alternates: {
    canonical: "/celo"
  },
  openGraph: {
    title: "Publish with Celo | ProofPort",
    description:
      "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling.",
    url: "/celo",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  },
  twitter: {
    title: "Publish with Celo | ProofPort",
    description:
      "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling.",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  }
};

export default function CeloPage() {
  return <CeloConsole />;
}
