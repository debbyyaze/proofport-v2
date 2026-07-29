import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

export const metadata: Metadata = {
  ...(appUrl ? { metadataBase: new URL(appUrl) } : {}),
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/"
  },
  keywords: [
    "proof logs",
    "shipping log",
    "wallet-signed records",
    "explorer receipts",
    "Celo",
    "Stacks",
    "public verification",
    "no account required"
  ],
  title: {
    default: "ProofPort",
    template: "%s | ProofPort"
  },
  description:
    "Publish wallet-signed proof logs for shipped work, add optional public HTTPS proof links, and share explorer receipts with no account required.",
  applicationName: "ProofPort",
  creator: "ProofPort",
  publisher: "ProofPort",
  referrer: "strict-origin-when-cross-origin",
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
    locale: "en_US",
    title: "ProofPort",
    description:
      "Publish wallet-signed proof logs for shipped work, add optional public HTTPS proof links, and share explorer receipts with no account required.",
    type: "website",
    images: [
      {
        url: "/og.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
        alt: "ProofPort preview showing public proof logs for shipped work"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofPort",
    description:
      "Publish wallet-signed proof logs for shipped work, add optional public HTTPS proof links, and share explorer receipts with no account required.",
    images: [
      {
        url: "/og.svg",
        type: "image/svg+xml",
        width: 1200,
        height: 630,
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
