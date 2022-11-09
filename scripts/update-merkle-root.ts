/* global ethers */

import { ethers } from "hardhat";
import { merkle } from "./merkle";
import { exit } from "process";
import fs from "fs";

async function main() {
  const BMYC = await ethers.getContractFactory("BMYC");
  let addresses: { proxy: string; admin: string; implementation: string } =
    JSON.parse(fs.readFileSync("bmyc-addresses.json").toString());
  const bmyc = await BMYC.attach(addresses.proxy);

  const newMerkleRoot = (await merkle("whitelists")).getHexRoot();
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
