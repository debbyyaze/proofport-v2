import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "ProofPort",
    template: "%s | ProofPort"
  },
  description:
    "Public proof logs for shipped work, wallet-signed entries, and explorer-backed records.",
  applicationName: "ProofPort",
  openGraph: {
    title: "ProofPort",
    description:
      "Capture what shipped, attach a proof link, and publish a record people can verify.",
    type: "website",
    images: ["/og.svg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f2e8"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
