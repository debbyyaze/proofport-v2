# Launch Checklist

- Deploy `ProofPortLog.sol` on Celo mainnet.
- Save the Celo contract address, deployment block, deployment transaction hash, and explorer URL.
- Deploy `proofport-log.clar` on Stacks mainnet.
- Save the Stacks contract id, deployment transaction id, and explorer URL.
- Set the production `NEXT_PUBLIC_*` contract values before building the website.
- Run `npm run lint`, `npm run typecheck`, and `npm run build`.
- Open `/`, `/celo`, and `/stacks` on the deployed HTTPS origin.
- Create one live Celo entry from `/celo` and save the explorer receipt.
- Create one live Stacks entry from `/stacks` and save the explorer receipt.
- Verify the public project website points to the deployed production origin.
- Keep the website, both publishing paths, both contract identifiers, and both live entry receipts with the release notes.
