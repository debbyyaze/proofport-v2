"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Anchor, BadgeCheck, Link2, RadioTower } from "lucide-react";

type AppShellProps = {
  children: ReactNode;
};

const routes = [
  { href: "/", label: "Home" },
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
        <Link aria-label="ProofPort home" href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <Anchor size={22} strokeWidth={2.2} />
          </span>
          <span>
            <strong>ProofPort</strong>
            <small>Wallet-signed proof logs</small>
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
      <footer aria-label="Site footer">
        <h2 className="sr-only" id="footer-strip-title">
          ProofPort publishing basics
        </h2>
        <ul className="footer-strip" aria-labelledby="footer-strip-title">
          <li>
            <BadgeCheck size={16} aria-hidden="true" /> Wallet-signed proof entries
          </li>
          <li>
            <Link2 size={16} aria-hidden="true" /> Optional public HTTPS proof links
          </li>
          <li>
            <RadioTower size={16} aria-hidden="true" /> Shareable explorer receipts
          </li>
        </ul>
      </footer>
    </div>
  );
}
