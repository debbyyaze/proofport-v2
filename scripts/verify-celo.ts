import hre from "hardhat";
import { serverEnv } from "../lib/server-env";

function getAddressForNetwork(networkName?: string) {
  if (networkName === "celo") {
    return serverEnv.proofPortCeloContractAddressMainnet;
  }

  if (networkName === "celoSepolia") {
    return serverEnv.proofPortCeloContractAddressSepolia;
  }

  throw new Error("Run with --network celo or --network celoSepolia.");
}

async function main() {
  const address = getAddressForNetwork(hre.globalOptions.network);

  if (!address) {
    throw new Error("Missing ProofPortLog address for the selected network.");
  }

  const runner = hre as unknown as {
    run(taskName: string, taskArgs: Record<string, unknown>): Promise<unknown>;
  };

  await runner.run("verify:verify", {
    address,
    constructorArguments: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
