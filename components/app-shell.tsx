"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Anchor, BadgeCheck, RadioTower } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

const routes = [
  { href: "/", label: "Overview" },
  { href: "/celo", label: "Celo" },
  { href: "/stacks", label: "Stacks" }
] as const;

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Anchor size={22} strokeWidth={2.2} />
          </span>
          <span>
            <strong>ProofPort</strong>
            <small>Public proof logs for shipped work</small>
          </span>
        </Link>
        <nav className="nav-pills" aria-label="Primary navigation">
          {routes.map((route) => (
            <Link
              aria-current={pathname === route.href ? "page" : undefined}
              href={route.href}
              key={route.href}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="footer-strip">
        <span>
          <BadgeCheck size={16} aria-hidden="true" /> Wallet-signed entries
        </span>
        <span>
          <RadioTower size={16} aria-hidden="true" /> Explorer receipts
        </span>
      </footer>
    </div>
  );
}
