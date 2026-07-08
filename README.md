# ProofPort

ProofPort is a compact public proof log for shipped work. Builders can publish concise wallet-signed entries on Celo or Stacks, attach proof links, keep a public feed, and share explorer receipts.

## Product

- `/celo`: MiniPay-ready Celo flow backed by `ProofPortLog.sol`
- `/stacks`: Stacks Connect flow backed by `proofport-log.clar`
- `/`: product landing page with network selection

The app has no backend, no database, and no indexer. It reads the latest entries directly from the connected contracts, with sample entries shown until live contract environment values are set.

## Quick Start

Use Node `22.13.0` or newer.

```bash
nvm install 22.13.0
nvm use 22.13.0
npm install
cp .env.example .env
npm run dev
```

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
brew install clarinet
npm run check:stacks
npm run test:stacks
npm run deploy:stacks:mainnet
```

`npm run check:stacks` uses the Clarinet SDK bundled through npm. Use `npm run check:stacks:clarinet` when the standalone Clarinet CLI is installed.

See [docs/deploy.md](./docs/deploy.md) for precise deployment values and launch notes.

## Release Checks

```bash
npm run lint
npm run typecheck
npm run build
```

For production launch, create and save one live Celo mainnet entry transaction and one live Stacks mainnet entry transaction.
