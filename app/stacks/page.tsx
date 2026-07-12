import type { Metadata } from "next";
import { StacksConsole } from "@/components/stacks-console";

export const metadata: Metadata = {
  title: "Publish with Stacks",
  description:
    "Create public ProofPort entries on Stacks with Stacks Connect wallet signing.",
  alternates: {
    canonical: "/stacks"
  }
};

export default function StacksPage() {
  return <StacksConsole />;
}
