import { NextResponse } from "next/server";
import { Cl, cvToJSON, fetchCallReadOnlyFunction } from "@stacks/transactions";
import { getStacksApiUrl, publicEnv } from "@/lib/env";
import {
  extractUint,
  mapStacksLog,
  type StacksContractRef
} from "@/lib/stacks-log-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getConfiguredContract(): StacksContractRef | null {
  if (!publicEnv.stacksContractAddress || !publicEnv.stacksContractName) {
    return null;
  }

  return {
    address: publicEnv.stacksContractAddress,
    name: publicEnv.stacksContractName
  };
}

function normalizeSenderAddress(value: string | null, fallback: string) {
  const sender = value?.trim();
  return sender && sender.startsWith("S") ? sender : fallback;
}

function getReadOnlyOptions(contract: StacksContractRef, senderAddress: string) {
  return {
    contractAddress: contract.address,
    contractName: contract.name,
    senderAddress,
    network: publicEnv.stacksNetwork,
    client: {
      baseUrl: getStacksApiUrl()
    }
  };
}

export async function GET(request: Request) {
  const contract = getConfiguredContract();

  if (!contract) {
    return NextResponse.json(
      {
        configured: false,
        logs: [],
        source: getStacksApiUrl()
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  const url = new URL(request.url);
  const senderAddress = normalizeSenderAddress(
    url.searchParams.get("sender"),
    contract.address
  );

  try {
    const readOnlyOptions = getReadOnlyOptions(contract, senderAddress);
    const totalResponse = await fetchCallReadOnlyFunction({
      ...readOnlyOptions,
      functionName: "get-total-logs",
      functionArgs: []
    });
    const total = extractUint(cvToJSON(totalResponse));
    const ids = Array.from({ length: Math.min(total, 8) }, (_, index) => {
      return total - index;
    }).filter((logId) => logId > 0);

    const logs = await Promise.all(
      ids.map(async (logId) => {
        const response = await fetchCallReadOnlyFunction({
          ...readOnlyOptions,
          functionName: "get-log",
          functionArgs: [Cl.uint(logId)]
        });
        return mapStacksLog(cvToJSON(response));
      })
    );

    return NextResponse.json(
      {
        configured: true,
        logs: logs.filter((log) => Boolean(log)),
        source: getStacksApiUrl(),
        checkedAt: new Date().toISOString()
      },
      {
        headers: {
          "Cache-Control": "s-maxage=10, stale-while-revalidate=30"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        logs: [],
        source: getStacksApiUrl(),
        error:
          error instanceof Error
            ? error.message
            : "Could not load Stacks entries."
      },
      { status: 502 }
    );
  }
}
