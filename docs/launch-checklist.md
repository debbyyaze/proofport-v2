# Launch Checklist

- Deploy `ProofPortLog.sol` on Celo mainnet.
- Save the Celo contract address, deployment block, deployment transaction hash, and explorer URL.
- Deploy `proofport-log.clar` on Stacks mainnet.
- Save the Stacks contract id, deployment transaction id, and explorer URL.
- Set the production `NEXT_PUBLIC_*` app URL, network, contract, and RPC/API values before building the website.
- Confirm `NEXT_PUBLIC_APP_URL` matches the deployed HTTPS origin so canonical, manifest and social preview metadata, `robots.txt`, and `sitemap.xml` all point to production.
- Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:stacks`, and `npm run build`.
- Open `/`, `/celo`, and `/stacks` on the deployed HTTPS origin.
- Confirm keyboard-only navigation reaches the primary actions on `/`, `/celo`, and `/stacks`, and that the skip link moves focus to the main content.
- Open `/manifest.webmanifest`, `/robots.txt`, and `/sitemap.xml` on the deployed HTTPS origin to confirm generated metadata points to production.
- If you install the site from a supported browser, confirm the installed app keeps the ProofPort name and icon, then open the `Home`, `Celo`, and `Stacks` shortcuts and confirm each one lands on the correct route.
- Share the deployed homepage URL in a social preview debugger and confirm the title, description, and preview image match production.
- Create one live Celo entry from `/celo` and save the explorer receipt.
- Create one live Stacks entry from `/stacks` and save the explorer receipt.
- Submit at least one live applause reaction from a public wallet you are comfortable exposing, then save that explorer receipt too.
- Confirm at least one saved live receipt includes a public proof link and at least one omits it, so both public states are verified before release notes go out.
- Verify the public project website points to the deployed production origin.
- Keep the website, both publishing paths, both contract identifiers, and both saved explorer receipts with the release notes.
