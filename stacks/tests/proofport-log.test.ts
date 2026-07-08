import { beforeEach, describe, expect, it } from "vitest";
import { initSimnet, type Simnet } from "@stacks/clarinet-sdk";
import { Cl } from "@stacks/transactions";

const HASH_ONE =
  "0x1111111111111111111111111111111111111111111111111111111111111111";
const HASH_TWO =
  "0x2222222222222222222222222222222222222222222222222222222222222222";

let simnet: Simnet;
let wallet1: string;
let wallet2: string;
let wallet3: string;

function createLog(summary = "Published the Stacks proof path", sender = wallet1) {
  return simnet.callPublicFn(
    "proofport-log",
    "create-log",
    [
      Cl.stringAscii(summary),
      Cl.stringAscii("https://example.com/proof/stacks"),
      Cl.stringAscii("stacks"),
      Cl.stringAscii(HASH_ONE)
    ],
    sender
  );
}

describe("proofport-log", () => {
  beforeEach(async () => {
    simnet = await initSimnet("./Clarinet.toml", true);
    const accounts = simnet.getAccounts();
    wallet1 = accounts.get("wallet_1")!;
    wallet2 = accounts.get("wallet_2")!;
    wallet3 = accounts.get("wallet_3")!;
  });

  it("creates a proof entry and updates the total count", () => {
    const result = createLog();

    expect(Cl.prettyPrint(result.result)).toBe("(ok u1)");
    expect(result.events).toHaveLength(1);
    expect(Cl.prettyPrint(simnet.getDataVar("proofport-log", "total-logs"))).toBe(
      "u1"
    );

    const stored = simnet.callReadOnlyFn(
      "proofport-log",
      "get-log",
      [Cl.uint(1)],
      wallet1
    );

    const printed = Cl.prettyPrint(stored.result);
    expect(printed).toContain("(ok {");
    expect(printed).toContain("Published the Stacks proof path");
    expect(printed).toContain(wallet1);
    expect(printed).toContain("applause: u0");
  });

  it("tracks applause on existing logs", () => {
    createLog();

    const applause = simnet.callPublicFn(
      "proofport-log",
      "applaud",
      [Cl.uint(1)],
      wallet2
    );
    expect(Cl.prettyPrint(applause.result)).toBe("(ok u1)");

    const secondApplause = simnet.callPublicFn(
      "proofport-log",
      "applaud",
      [Cl.uint(1)],
      wallet3
    );
    expect(Cl.prettyPrint(secondApplause.result)).toBe("(ok u2)");
  });

  it("rejects missing log reads and applause", () => {
    const missing = simnet.callReadOnlyFn(
      "proofport-log",
      "get-log",
      [Cl.uint(99)],
      wallet1
    );
    const applause = simnet.callPublicFn(
      "proofport-log",
      "applaud",
      [Cl.uint(99)],
      wallet1
    );

    expect(Cl.prettyPrint(missing.result)).toBe("(err u404)");
    expect(Cl.prettyPrint(applause.result)).toBe("(err u404)");
  });

  it("rejects empty summaries", () => {
    const result = createLog("", wallet1);

    expect(Cl.prettyPrint(result.result)).toBe("(err u400)");
  });

  it("stores multiple authors with stable ids", () => {
    const first = createLog("Stacks entry one", wallet1);
    const second = simnet.callPublicFn(
      "proofport-log",
      "create-log",
      [
        Cl.stringAscii("Stacks entry two"),
        Cl.stringAscii("https://example.com/proof/two"),
        Cl.stringAscii("clarity"),
        Cl.stringAscii(HASH_TWO)
      ],
      wallet2
    );

    expect(Cl.prettyPrint(first.result)).toBe("(ok u1)");
    expect(Cl.prettyPrint(second.result)).toBe("(ok u2)");
    expect(Cl.prettyPrint(simnet.getDataVar("proofport-log", "total-logs"))).toBe(
      "u2"
    );

    const stored = simnet.callReadOnlyFn(
      "proofport-log",
      "get-log",
      [Cl.uint(2)],
      wallet1
    );
    expect(Cl.prettyPrint(stored.result)).toContain("Stacks entry two");
  });
});
