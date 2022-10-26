/* global ethers */

import { ethers } from "hardhat";
import { BMYC } from "../typechain-types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const bmyc = (await ethers.getContractAt(
    "contracts/BMYC.sol:BMYC",
    "0x8e6F6a11E33375076FC76Bdb30FE218f588E5749"
  )) as BMYC;

  // sleep until due time
  const dueTime = "2022-10-26T16:19:55";
  console.log("waiting…", Date.now() - new Date(dueTime).getTime());
  while (new Date(dueTime).getTime() > Date.now()) {
    await delay(1000);
  }
  await bmyc.startMint();
  console.log("Token address:", bmyc.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
