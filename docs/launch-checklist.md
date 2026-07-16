# Launch Checklist

- Deploy `ProofPortLog.sol` on Celo mainnet.
- Save the Celo contract address, deployment block, deployment transaction hash, and explorer URL.
- Deploy `proofport-log.clar` on Stacks mainnet.
- Save the Stacks contract id, deployment transaction id, and explorer URL.
- Set the production `NEXT_PUBLIC_*` contract values before building the website.
- Confirm `NEXT_PUBLIC_APP_URL` matches the deployed HTTPS origin so canonical, robots, and sitemap metadata point to production.
- Run `npm run lint`, `npm run typecheck`, `npm run check:stacks`, and `npm run build`.
- Open `/`, `/celo`, and `/stacks` on the deployed HTTPS origin.
- Open `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` on the deployed HTTPS origin to confirm generated metadata points to production.
- Create one live Celo entry from `/celo` and save the explorer receipt.
- Create one live Stacks entry from `/stacks` and save the explorer receipt.
- Verify the public project website points to the deployed production origin.
- Keep the website, both publishing paths, both contract identifiers, and both live entry receipts with the release notes.
