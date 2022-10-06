import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";

describe("Giveaways", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Giveaways = await ethers.getContractFactory("Giveaways");
    const giveaways = await Giveaways.deploy(
      "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693"
    );

    return { giveaways, owner, otherAccount };
  }

  it("should create a giveaway and run it", async function () {
    const { giveaways } = await loadFixture(deploy);

    const proof = keccak256("user1,5\nuser3,89\nuser2,82\nuser32,38");

    let giveaway_num: number = 0;
    const captureValue = (value: number) => {
      giveaway_num = value;
      return true;
    };

    // get giveaway number we just created
    await expect(giveaways.create_giveaway(proof, 4))
      .to.emit(giveaways, "GiveawayCreated")
      .withArgs(captureValue);

    await giveaways.run_giveaway(giveaway_num);
    console.log(
      "Winner:",
      await (await giveaways.get_winner(giveaway_num)).toNumber()
    );
  });
});
