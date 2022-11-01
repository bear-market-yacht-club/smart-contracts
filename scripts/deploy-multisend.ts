/* global ethers */

import { ethers } from "hardhat";
import { exit } from "process";
import { CheapMultiSend__factory } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CheapMultiSend = (await ethers.getContractFactory(
    "CheapMultiSend"
  )) as CheapMultiSend__factory;
  const cheapMultiSend = await CheapMultiSend.deploy();

  console.log("Token address:", cheapMultiSend.address);
  exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
