import { initSimnet } from "@stacks/clarinet-sdk";

async function main() {
  const simnet = await initSimnet("./Clarinet.toml", true);
  const source = simnet.getContractSource("proofport-log");

  if (!source || !source.includes("define-public (create-log")) {
    throw new Error("proofport-log contract did not load from Clarinet.toml.");
  }

  console.log("Stacks contract check passed");
  console.log("contract: proofport-log");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
