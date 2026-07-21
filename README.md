# ProofPort

ProofPort is a compact public proof log for shipped work. Builders can publish concise wallet-signed entries on Celo or Stacks, attach proof links, keep a public feed, and share explorer receipts.

Proof links are optional. When included, the UI accepts HTTPS URLs only for
PRs, commits, release notes, demos, or similar public evidence.

Tags are optional too. The Celo and Stacks forms start with network-specific
defaults, and clearing the field falls back to the shared `proof` tag.

## Product

- `/celo`: MiniPay-ready Celo flow backed by `ProofPortLog.sol`
- `/stacks`: Stacks Connect flow backed by `proofport-log.clar`
- `/`: product landing page with network selection

The app has no persistent backend, no database, and no indexer. It uses wallet calls plus a lightweight Next route handler for live Stacks reads, with sample entries shown until live contract environment values are set.

## Quick Start

Use Node `22.13.0` or newer.

```bash
nvm install 22.13.0
nvm use 22.13.0
npm install
npm run dev
```

Use `npm run dev:mobile` when you need the Next dev server reachable from a
phone on the same network, such as testing the Celo flow in MiniPay.

The app boots locally with built-in testnet and localhost defaults. Only set
`NEXT_PUBLIC_*` values when you want to point the UI at a specific live
deployment. Set `NEXT_PUBLIC_APP_URL` before production builds so canonical
URLs, `robots.txt`, and the sitemap point at the live HTTPS origin; see
[docs/deploy.md](./docs/deploy.md) for the production values.

Skip copying `.env.example` for ordinary local UI work unless you are preparing
to deploy or run contract scripts with real keys.

Local routes:

- `http://localhost:3000`
- `http://localhost:3000/celo`
- `http://localhost:3000/stacks`

## Contracts

Celo:

```bash
npm run compile:celo
npm run test:celo
npm run deploy:celo:mainnet
```

Stacks:

```bash
npm run check:stacks
npm run test:stacks
npm run deploy:stacks:mainnet
```

`npm run check:stacks` uses the Clarinet SDK bundled through npm, so the
standalone Clarinet CLI is optional. Install it only when you want to run
`npm run check:stacks:clarinet`.

See [docs/deploy.md](./docs/deploy.md) for precise deployment values and launch notes.

## Release Checks

```bash
npm run lint
npm run typecheck
npm test
npm run check:stacks
npm run build
```

Open the deployed HTTPS origin and verify `/manifest.webmanifest`,
`/robots.txt`, and `/sitemap.xml` all resolve with production URLs before
announcing the release.

For production launch, create and save one live Celo mainnet entry transaction and one live Stacks mainnet entry transaction.
