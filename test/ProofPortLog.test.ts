import { expect } from "chai";
import { id } from "ethers";
import { network } from "hardhat";

type NetworkConnection = Awaited<ReturnType<typeof network.create>>;

describe("ProofPortLog", function () {
  let ethers: NetworkConnection["ethers"];

  async function deployFixture() {
    const [author, applauder, otherAuthor] = await ethers.getSigners();
    const ProofPortLog = await ethers.getContractFactory("ProofPortLog");
    // Hardhat generates runtime contract methods after compile; typechain is not used in this small app.
    const proofPort = (await ProofPortLog.deploy()) as any;
    await proofPort.waitForDeployment();

    return { author, applauder, otherAuthor, proofPort };
  }

  before(async function () {
    ({ ethers } = await network.create());
  });

  it("creates a proof entry and emits the created event", async function () {
    const { author, proofPort } = await deployFixture();
    const contentHash = id("ProofPort first Celo entry");

    await expect(
      proofPort
        .connect(author)
        .createLog(
          "Published the Celo proof path",
          "https://example.com/proof/celo",
          "celo",
          contentHash
        )
    )
      .to.emit(proofPort, "LogCreated")
      .withArgs(
        1n,
        author.address,
        "Published the Celo proof path",
        "https://example.com/proof/celo",
        "celo",
        contentHash
      );

    const proofEntry = await proofPort.getLog(1);
    expect(proofEntry.id).to.equal(1n);
    expect(proofEntry.author).to.equal(author.address);
    expect(proofEntry.summary).to.equal("Published the Celo proof path");
    expect(proofEntry.applause).to.equal(0);
    expect(await proofPort.totalLogs()).to.equal(1n);
  });

  it("tracks applause on existing logs", async function () {
    const { author, applauder, proofPort } = await deployFixture();

    await proofPort
      .connect(author)
      .createLog("Published tests", "https://example.com/tests", "tests", id("tests"));

    await expect(proofPort.connect(applauder).applaud(1))
      .to.emit(proofPort, "Applauded")
      .withArgs(1n, applauder.address, 1);

    await proofPort.connect(author).applaud(1);
    const proofEntry = await proofPort.getLog(1);
    expect(proofEntry.applause).to.equal(2);
  });

  it("rejects missing logs", async function () {
    const { proofPort } = await deployFixture();

    await expect(proofPort.getLog(1)).to.be.revertedWithCustomError(
      proofPort,
      "LogNotFound"
    );
    await expect(proofPort.applaud(1)).to.be.revertedWithCustomError(
      proofPort,
      "LogNotFound"
    );
  });

  it("rejects empty and overlong text fields", async function () {
    const { author, proofPort } = await deployFixture();

    await expect(
      proofPort.connect(author).createLog("", "", "proof", id("empty"))
    ).to.be.revertedWithCustomError(proofPort, "EmptySummary");

    await expect(
      proofPort
        .connect(author)
        .createLog("x".repeat(161), "", "proof", id("summary"))
    ).to.be.revertedWithCustomError(proofPort, "SummaryTooLong");

    await expect(
      proofPort
        .connect(author)
        .createLog("Valid summary", "x".repeat(221), "proof", id("proof"))
    ).to.be.revertedWithCustomError(proofPort, "ProofUriTooLong");

    await expect(
      proofPort
        .connect(author)
        .createLog("Valid summary", "", "x".repeat(33), id("tag"))
    ).to.be.revertedWithCustomError(proofPort, "TagTooLong");
  });

  it("stores multiple authors with stable ids", async function () {
    const { author, otherAuthor, proofPort } = await deployFixture();

    await proofPort
      .connect(author)
      .createLog("Celo entry one", "https://example.com/one", "celo", id("one"));
    await proofPort
      .connect(otherAuthor)
      .createLog("Celo entry two", "https://example.com/two", "stacks", id("two"));

    const first = await proofPort.getLog(1);
    const second = await proofPort.getLog(2);

    expect(first.author).to.equal(author.address);
    expect(second.author).to.equal(otherAuthor.address);
    expect(await proofPort.totalLogs()).to.equal(2n);
  });
});
