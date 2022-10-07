import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import * as fs from "fs";

describe("Giveaways", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Giveaways = await ethers.getContractFactory("Giveaways");
    const giveaways = await Giveaways.deploy(
      "https://bearmarketyachtclub.com/giveaways/",
      ".txt",
      "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693"
    );

    return { giveaways, owner, otherAccount };
  }

  it("should create a giveaway and run it", async function () {
    const { giveaways } = await loadFixture(deploy);

    const participants: string = fs
      .readFileSync("./test/giveaway.txt", {
        encoding: "utf-8",
      })
      .toString();
    const proof = keccak256(participants);

    let giveaway_num: number = 0;
    const captureValue = (value: number) => {
      giveaway_num = value;
      return true;
    };

    // get giveaway number we just created
    await expect(
      giveaways.create_giveaway(
        "Example giveaway description",
        proof,
        // minus 1 for the header
        participants.split("\n").length - 1
      )
    )
      .to.emit(giveaways, "GiveawayCreated")
      .withArgs(captureValue);

    let link = await giveaways.get_participants_list_link(
      giveaway_num.toString()
    );
    expect(link).to.equal(
      `https://bearmarketyachtclub.com/giveaways/${giveaway_num}.txt`,
      "Incorrect giveaway link"
    );

    await giveaways.run_giveaway(giveaway_num);
    console.log(
      "Winner:",
      (await giveaways.get_winner(giveaway_num)).toNumber()
    );
  });
});
