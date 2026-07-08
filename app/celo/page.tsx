import type { Metadata } from "next";
import { CeloConsole } from "@/components/celo-console";

export const metadata: Metadata = {
  title: "Publish with Celo",
  description:
    "Create public ProofPort entries on Celo with MiniPay-compatible wallet handling."
};

export default function CeloPage() {
  return <CeloConsole />;
}
