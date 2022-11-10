/* global ethers */

import { ethers, upgrades, run, network } from "hardhat";
import { exit } from "process";
import fs from "fs";
import { merkle } from "./merkle";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BMYC = await ethers.getContractFactory("BMYC");
  const bmyc = await upgrades.deployProxy(
    BMYC,
    [
      (await merkle("whitelists_current_holders")).getHexRoot(),
      "ipfs://QmVhhan6qCkrnWeeBY9ebqrmohwT8C7SSLLLsJD9kKUiMF/",
    ],
    { initializer: "initialize" }
  );
  await bmyc.deployed();

  const addresses = {
    proxy: bmyc.address,
    admin: await upgrades.erc1967.getAdminAddress(bmyc.address),
    implementation: await upgrades.erc1967.getImplementationAddress(
      bmyc.address
    ),
  };
  console.log("Addresses:", addresses);

  //verify on etherscan
  try {
    await run("verify", { address: addresses.implementation });
  } catch (e) {}

  fs.writeFileSync(
    `bmyc-addresses-${network.name}.json`,
    JSON.stringify(addresses)
  );
  exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
