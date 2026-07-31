# Deploy ProofPort

Use Node `22.13.0` or newer before running Hardhat or Next:

```bash
nvm install 22.13.0
nvm use 22.13.0
node -v
npm install
```

Create a local `.env` only when you are preparing to deploy contracts or run
scripts that need real keys:

```bash
touch .env
```

The local `.env` file will hold deployer keys. Keep it out of version control
and never reuse it as a hosted runtime config. For ordinary local UI work, skip
creating `.env` entirely.

## Celo Mainnet

1. Set these values in `.env`:

```bash
PRIVATE_KEY=0x<your-celo-deployer-private-key>
CELO_MAINNET_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_CELO_NETWORK=celo
```

2. Compile and deploy:

```bash
npm run compile:celo
npm run deploy:celo:mainnet
```

3. Copy the printed contract address, deployment transaction hash, deployment block, and explorer URL. Set:

```bash
NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=<mainnet-address>
NEXT_PUBLIC_CELO_DEPLOYMENT_BLOCK=<mainnet-deploy-block>
PROOFPORT_CELO_CONTRACT_ADDRESS_MAINNET=<mainnet-address>
```

4. Optional verification:

```bash
# set CELOSCAN_API_KEY or ETHERSCAN_API_KEY first
npm run verify:celo:mainnet
```

## Stacks Mainnet

1. Set these values in `.env`:

```bash
STACKS_PRIVATE_KEY=<your-stacks-private-key>
STACKS_NETWORK=mainnet
STACKS_DEPLOY_FEE_MICROSTX=300000
NEXT_PUBLIC_STACKS_NETWORK=mainnet
NEXT_PUBLIC_STACKS_CONTRACT_NAME=proofport-log
```

2. Check and deploy:

```bash
npm run check:stacks
npm run deploy:stacks:mainnet
```

3. Copy the printed contract id and transaction id. Set:

```bash
NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS=<mainnet-deployer-address>
PROOFPORT_STACKS_CONTRACT_ID_MAINNET=<mainnet-deployer-address>.proofport-log
```

## Vercel

Set these production environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.example
NEXT_PUBLIC_CELO_NETWORK=celo
NEXT_PUBLIC_CELO_CONTRACT_ADDRESS=<mainnet-address>
NEXT_PUBLIC_CELO_DEPLOYMENT_BLOCK=<mainnet-deploy-block>
NEXT_PUBLIC_CELO_MAINNET_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_STACKS_NETWORK=mainnet
NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS=<mainnet-deployer-address>
NEXT_PUBLIC_STACKS_CONTRACT_NAME=proofport-log
NEXT_PUBLIC_STACKS_API_MAINNET=https://api.hiro.so
```

`NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS` should be the Stacks deployer address
only. ProofPort combines that principal with
`NEXT_PUBLIC_STACKS_CONTRACT_NAME` to read the full contract id in the UI.

Set `NEXT_PUBLIC_APP_URL` to the canonical production HTTPS origin without a trailing slash, not a preview deployment URL, so canonical tags, manifest and social preview metadata, `robots.txt`, and `sitemap.xml` all point at the released site.
Leaving it unset during a production build leaves crawler hints and absolute site-origin metadata incomplete, which weakens release metadata and discovery.
After changing `NEXT_PUBLIC_APP_URL` or any other `NEXT_PUBLIC_*` value that affects release metadata, trigger a fresh production deployment before re-checking those generated endpoints.

Do not put deployer private keys in Vercel for normal app hosting.

## Final Checks

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm run check:stacks
```

Open the deployed HTTPS origin and confirm `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` all resolve with production URLs before announcing the release.

Share the deployed homepage URL in a social preview debugger and confirm the production title, description, and preview image all match the live release.

Check `/`, `/celo`, and `/stacks` with keyboard-only navigation and confirm the skip link moves focus to the main content on each route.

On `/celo` and `/stacks`, try an `http://` proof link and confirm both browser validation and that the inline guidance blocks publishing until the URL is corrected to `https://` or cleared.

If you install the site from a supported browser, confirm the installed app keeps the ProofPort name and icon, then open the `Home`, `Celo`, and `Stacks` shortcuts once to confirm each one lands on the correct ProofPort route.

Create one live entry from `/celo` and one live entry from `/stacks`, then save both explorer receipts with the release notes. Submit at least one live applause reaction from a public wallet you are comfortable exposing and save that explorer receipt too. Confirm at least one saved receipt includes a public proof link and at least one omits it so both public states are verified before launch.
