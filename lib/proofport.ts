export type ShipLog = {
  id: number;
  author: string;
  summary: string;
  proofUri: string;
  tag: string;
  contentHash: string;
  createdAt: number;
  applause: number;
  network: "celo" | "stacks";
  txUrl?: string;
};

export const sampleCeloLogs: ShipLog[] = [
  {
    id: 3,
    author: "0x4f7a...91c2",
    summary: "Published the mobile wallet handoff and proof link.",
    proofUri: "https://example.com/proof/minipay",
    tag: "minipay",
    contentHash:
      "0x9e96c1aa8ea37a58b6749a64aeb9bc4d1e047cdbf2a92c3610bd5132cc65c190",
    createdAt: 1769545500,
    applause: 7,
    network: "celo"
  },
  {
    id: 2,
    author: "0x02be...7ad4",
    summary: "Logged a public release note with an explorer receipt.",
    proofUri: "https://example.com/proof/feed",
    tag: "feed",
    contentHash:
      "0xa2a21fd7c723e5c4b2c62d7f1078c64388dc2a092a3b7bfd271a7074ce1d2d55",
    createdAt: 1769451000,
    applause: 3,
    network: "celo"
  }
];

export const sampleStacksLogs: ShipLog[] = [
  {
    id: 3,
    author: "SP2C...55F7",
    summary: "Published the Clarity-backed proof log.",
    proofUri: "https://example.com/proof/clarity",
    tag: "clarity",
    contentHash:
      "0x134d45445e43a35f44225ffd2b2607b87f6d07a3d660c28cc50296e7a6b6ad4e",
    createdAt: 1769545500,
    applause: 5,
    network: "stacks"
  },
  {
    id: 2,
    author: "ST19...6MZR",
    summary: "Verified wallet-signed entries from the web app.",
    proofUri: "https://example.com/proof/stacks-connect",
    tag: "wallet",
    contentHash:
      "0xf39f94b9a58166ee0e8acdf73d9a728851fbf5638140665669cd0d6d039185a4",
    createdAt: 1769451000,
    applause: 4,
    network: "stacks"
  }
];

export function shortAddress(address: string, visible = 6) {
  if (!address) return "Not connected";
  if (address.includes("...")) return address;
  if (address.length <= visible * 2 + 3) return address;
  return `${address.slice(0, visible)}...${address.slice(-visible)}`;
}

export function formatDate(timestamp: number) {
  if (!timestamp) return "Pending";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp * 1000));
}

export function safeTrim(value: string, maxLength: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function normalizeOptionalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

export function buildProofHashInput(params: {
  summary: string;
  proofUri: string;
  tag: string;
}) {
  return `${params.summary}|${params.proofUri}|${params.tag}`.toLowerCase();
}

export function getFeedNotice(isConfigured: boolean, network: string) {
  return isConfigured
    ? `Reading the latest ${network} entries from the live feed.`
    : "Sample entries are shown until a live contract is connected.";
}
