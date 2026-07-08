import type { ShipLog } from "@/lib/proofport";

export type StacksContractRef = {
  address: string;
  name: string;
};

type ClarityJson = {
  type?: string;
  value?: unknown;
};

function unwrapResponse(value: unknown): unknown {
  const json = value as ClarityJson;
  if (json?.type?.toLowerCase().includes("response") && "value" in json) {
    return json.value;
  }
  if (json?.type === "ok" && "value" in json) {
    return json.value;
  }
  return value;
}

export function extractUint(value: unknown) {
  const unwrapped = unwrapResponse(value) as ClarityJson;
  const nested = unwrapResponse(unwrapped?.value) as ClarityJson;
  const candidate = nested?.value ?? unwrapped?.value ?? value;
  const numeric = typeof candidate === "bigint" ? candidate : Number(candidate);
  return Number.isFinite(numeric) ? Number(numeric) : 0;
}

function extractTuple(value: unknown): Record<string, unknown> | null {
  const unwrapped = unwrapResponse(value) as ClarityJson;
  const tuple = (unwrapped?.value ?? unwrapped) as {
    value?: Record<string, unknown>;
    data?: Record<string, unknown>;
  };
  const raw = tuple.value ?? tuple.data;
  if (!raw || typeof raw !== "object") return null;

  return raw;
}

function unwrapString(value: unknown) {
  const json = value as ClarityJson;
  if (typeof value === "string") return value;
  if (typeof json?.value === "string") return json.value;
  return "";
}

export function mapStacksLog(json: unknown): ShipLog | null {
  const tuple = extractTuple(json);
  if (!tuple) return null;

  return {
    id: extractUint(tuple.id),
    author: unwrapString(tuple.author),
    summary: unwrapString(tuple.summary),
    proofUri: unwrapString(tuple["proof-uri"]),
    tag: unwrapString(tuple.tag),
    contentHash: unwrapString(tuple["content-hash"]),
    createdAt: extractUint(tuple["created-at"]),
    applause: extractUint(tuple.applause),
    network: "stacks"
  };
}
