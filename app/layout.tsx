import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "proof logs",
    "shipping log",
    "wallet-signed records",
    "Celo",
    "Stacks",
    "public verification"
  ],
  title: {
    default: "ProofPort",
    template: "%s | ProofPort"
  },
  description:
    "Public proof logs for shipped work, wallet-signed proof entries, and shareable explorer receipts.",
  applicationName: "ProofPort",
  appleWebApp: {
    capable: true,
    title: "ProofPort",
    statusBarStyle: "default"
  },
  category: "developer tools",
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    url: "/",
    siteName: "ProofPort",
    title: "ProofPort",
    description:
      "Public proof logs for shipped work, wallet-signed proof entries, and shareable explorer receipts.",
    type: "website",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofPort",
    description:
      "Public proof logs for shipped work, wallet-signed proof entries, and shareable explorer receipts.",
    images: [
      {
        url: "/og.svg",
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
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
