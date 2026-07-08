import type { Hex } from "viem";

export const CELO_MAINNET_CHAIN_ID = 42220;
export const CELO_SEPOLIA_CHAIN_ID = 11142220;

export type CeloNetwork = "celo" | "celoSepolia";
export type StacksNetwork = "mainnet" | "testnet";

function readPublicVar(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function normalizeCeloNetwork(value: string): CeloNetwork {
  return value === "celo" ? "celo" : "celoSepolia";
}

function normalizeStacksNetwork(value: string): StacksNetwork {
  return value === "mainnet" ? "mainnet" : "testnet";
}

export const publicEnv = {
  appUrl: readPublicVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  celoNetwork: normalizeCeloNetwork(
    readPublicVar("NEXT_PUBLIC_CELO_NETWORK", "celoSepolia")
  ),
  celoContractAddress: readPublicVar("NEXT_PUBLIC_CELO_CONTRACT_ADDRESS") as
    | Hex
    | "",
  celoDeploymentBlock: readPublicVar("NEXT_PUBLIC_CELO_DEPLOYMENT_BLOCK"),
  celoMainnetRpcUrl: readPublicVar(
    "NEXT_PUBLIC_CELO_MAINNET_RPC_URL",
    "https://forno.celo.org"
  ),
  celoSepoliaRpcUrl: readPublicVar(
    "NEXT_PUBLIC_CELO_SEPOLIA_RPC_URL",
    "https://forno.celo-sepolia.celo-testnet.org"
  ),
  stacksNetwork: normalizeStacksNetwork(
    readPublicVar("NEXT_PUBLIC_STACKS_NETWORK", "testnet")
  ),
  stacksContractAddress: readPublicVar("NEXT_PUBLIC_STACKS_CONTRACT_ADDRESS"),
  stacksContractName: readPublicVar(
    "NEXT_PUBLIC_STACKS_CONTRACT_NAME",
    "proofport-log"
  ),
  stacksApiMainnet: readPublicVar(
    "NEXT_PUBLIC_STACKS_API_MAINNET",
    "https://api.hiro.so"
  ),
  stacksApiTestnet: readPublicVar(
    "NEXT_PUBLIC_STACKS_API_TESTNET",
    "https://api.testnet.hiro.so"
  )
};

export function getCeloChainId(network = publicEnv.celoNetwork) {
  return network === "celo" ? CELO_MAINNET_CHAIN_ID : CELO_SEPOLIA_CHAIN_ID;
}

export function getCeloChainLabel(network = publicEnv.celoNetwork) {
  return network === "celo" ? "Celo Mainnet" : "Celo Sepolia";
}

export function getCeloRpcUrl(network = publicEnv.celoNetwork) {
  return network === "celo"
    ? publicEnv.celoMainnetRpcUrl
    : publicEnv.celoSepoliaRpcUrl;
}

export function getCeloExplorerBaseUrl(network = publicEnv.celoNetwork) {
  return network === "celo"
    ? "https://celoscan.io"
    : "https://celo-sepolia.blockscout.com";
}

export function getCeloAddChainParameters(network = publicEnv.celoNetwork) {
  const chainId = getCeloChainId(network);

  return {
    chainId: `0x${chainId.toString(16)}`,
    chainName: getCeloChainLabel(network),
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18
    },
    rpcUrls: [getCeloRpcUrl(network)],
    blockExplorerUrls: [getCeloExplorerBaseUrl(network)]
  };
}

export function getStacksApiUrl(network = publicEnv.stacksNetwork) {
  return network === "mainnet"
    ? publicEnv.stacksApiMainnet
    : publicEnv.stacksApiTestnet;
}

export function getStacksExplorerTxUrl(
  txId: string,
  network = publicEnv.stacksNetwork
) {
  const normalizedTxId = txId.startsWith("0x") ? txId : `0x${txId}`;
  return `https://explorer.stacks.co/txid/${normalizedTxId}?chain=${network}`;
}

export function getCeloExplorerTxUrl(
  txHash: string,
  network = publicEnv.celoNetwork
) {
  return `${getCeloExplorerBaseUrl(network)}/tx/${txHash}`;
}

export function hasCeloContract() {
  return Boolean(publicEnv.celoContractAddress);
}

export function hasStacksContract() {
  return Boolean(publicEnv.stacksContractAddress && publicEnv.stacksContractName);
}
