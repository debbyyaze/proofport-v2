export type ServerEnv = {
  privateKey: string;
  etherscanApiKey: string;
  celoscanApiKey: string;
  celoMainnetRpcUrl: string;
  celoSepoliaRpcUrl: string;
  proofPortCeloContractAddressMainnet: string;
  proofPortCeloContractAddressSepolia: string;
};

function readServerVar(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

export function readServerEnv(): ServerEnv {
  return {
    privateKey: readServerVar("PRIVATE_KEY"),
    etherscanApiKey: readServerVar("ETHERSCAN_API_KEY"),
    celoscanApiKey: readServerVar("CELOSCAN_API_KEY"),
    celoMainnetRpcUrl: readServerVar("CELO_MAINNET_RPC_URL", "https://forno.celo.org"),
    celoSepoliaRpcUrl: readServerVar(
      "CELO_SEPOLIA_RPC_URL",
      "https://forno.celo-sepolia.celo-testnet.org"
    ),
    proofPortCeloContractAddressMainnet: readServerVar(
      "PROOFPORT_CELO_CONTRACT_ADDRESS_MAINNET"
    ),
    proofPortCeloContractAddressSepolia: readServerVar(
      "PROOFPORT_CELO_CONTRACT_ADDRESS_SEPOLIA"
    )
  };
}

export const serverEnv = readServerEnv();
