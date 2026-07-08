import Link from "next/link";
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
  return (
    <div className="app-frame">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="ProofPort overview">
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
            <Link href={route.href} key={route.href}>
              {route.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
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
