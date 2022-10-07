import { ethers } from "hardhat";
import * as fs from "fs";
import keccak256 from "keccak256";

const create_giveaway = async (
  giveaway_num: number,
  giveaway_description: string
) => {
  const contractAddr = "0xfA47D71e2328358984B5226F21Cbd1a0a84fa927";

  const participants: string = fs
    .readFileSync(`./scripts/giveaways/${giveaway_num}.txt`, {
      encoding: "utf-8",
    })
    .toString();

  const proof = keccak256(participants);
  // minus 1 for the header
  const num_participants = participants.split("\n").length - 1;

  console.log("Proof:", `${proof.toString("hex")}`);
  console.log("Number of participants:", num_participants);

  const Giveaways = await ethers.getContractAt("Giveaways", contractAddr);
  const tx = await Giveaways.create_giveaway(
    giveaway_description,
    ethers.BigNumber.from(proof),
    num_participants
  );
  console.log(tx);
  console.log(await Giveaways.s_giveaways(giveaway_num));
};

create_giveaway(0, "Space Riders #0");
