/* global ethers */

import { ethers } from "hardhat";
import { BMYC } from "../typechain-types";
import { merkle } from "./merkle";
import { exit } from "process";

async function main() {
  const bmyc = (await ethers.getContractAt(
    "contracts/BMYC.sol:BMYC",
    "0x8e6F6a11E33375076FC76Bdb30FE218f588E5749"
  )) as BMYC;

  const newMerkleRoot = (await merkle).getHexRoot();
  console.log({ newMerkleRoot });

  console.log(await bmyc.changeMerkleRoot(newMerkleRoot));

  exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
