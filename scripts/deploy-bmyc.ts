/* global ethers */

import { ethers } from "hardhat";
import { merkle } from "./merkle";
import { exit } from "process";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BMYC = await ethers.getContractFactory("contracts/BMYC.sol:BMYC");
  const bmyc = await BMYC.deploy(
    (await merkle).getHexRoot(),
    "ipfs://QmVhhan6qCkrnWeeBY9ebqrmohwT8C7SSLLLsJD9kKUiMF/"
  );

  console.log("Token address:", bmyc.address);
  exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
