# ProofPort

ProofPort is a compact public proof log for shipped work. Builders can publish concise wallet-signed entries on Celo or Stacks, attach optional public HTTPS proof links, keep a public feed, and share explorer receipts.

Proof links are optional. When included, the UI accepts HTTPS URLs only for
PRs, commits, release notes, demos, or similar public evidence.

Tags are optional too. The Celo and Stacks forms start with network-specific
defaults, and clearing the field falls back to the shared `proof` tag.

## Product

- `/celo`: MiniPay-ready Celo flow backed by `ProofPortLog.sol`
- `/stacks`: Stacks Connect flow backed by `proofport-log.clar`
- `/`: product landing page with network selection

The app has no persistent backend, no database, and no indexer. It uses wallet calls plus a lightweight Next route handler for live Stacks reads, with sample entries shown until live contract environment values are set.

## Publishing Hygiene

Everything you publish through ProofPort is public, including the summary, tag,
wallet address, explorer receipt, and proof link when attached.

- Keep secrets, internal URLs, and private ticket names out of entry summaries.
- Use only public HTTPS proof links such as PRs, commits, release notes, or demos.
- Clear the tag field if you do not want to expose an internal shorthand.
- Applause reactions are public wallet actions too, so only applaud from an address you are comfortable exposing.

## Quick Start

Use Node `22.13.0` or newer.

```bash
nvm install 22.13.0
nvm use 22.13.0
npm install
npm run dev
```

Use `npm run dev:mobile` when you need the Next dev server reachable from a
phone on the same network, such as testing the Celo flow in MiniPay. That
script binds to `0.0.0.0`, so use it only on a trusted local network.

The app boots locally with built-in testnet and localhost defaults. Only set
`NEXT_PUBLIC_*` values when you want to point the UI at a specific live
deployment. Set `NEXT_PUBLIC_APP_URL` before production builds to the final
HTTPS site origin without a trailing slash so canonical URLs, manifest and
social metadata, `robots.txt`, and the sitemap point at production instead of
a preview or localhost URL; see [docs/deploy.md](./docs/deploy.md) for the
production values. Leaving it unset during a production build will keep those
generated URLs pointed at `http://localhost:3000`.

Skip creating a local `.env` for ordinary UI work unless you are preparing to
deploy or run contract scripts with real keys.

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

If you install the site from a supported browser, open the installed app
shortcuts for `Home`, `Celo`, and `Stacks` once to confirm each one lands on
the correct ProofPort route.

Check `/`, `/celo`, and `/stacks` with keyboard-only navigation and confirm
the skip link moves focus to the main content on each route.

On `/celo` and `/stacks`, try an `http://` proof link and confirm both browser
validation and the inline guidance block publishing until the URL is corrected
to `https://` or cleared.

For production launch, create and save one live Celo mainnet entry transaction
and one live Stacks mainnet entry transaction. Confirm at least one saved
receipt includes a public proof link and at least one omits it so both public
states are verified before release notes go out. Submit at least one live
applause reaction from a public wallet you are comfortable exposing and save
that explorer receipt with the release notes too.
