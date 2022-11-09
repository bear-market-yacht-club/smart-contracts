/* global ethers */

import { ethers, upgrades, run } from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BMYC = await ethers.getContractFactory("BMYC");
  let addresses: { proxy: string; admin: string; implementation: string } =
    JSON.parse(fs.readFileSync("bmyc-addresses.json").toString());
  await upgrades.upgradeProxy(addresses.proxy, BMYC);
  console.log("Upgraded");

  addresses = {
    proxy: addresses.proxy,
    admin: await upgrades.erc1967.getAdminAddress(addresses.proxy),
    implementation: await upgrades.erc1967.getImplementationAddress(
      addresses.proxy
    ),
  };
  console.log("Addresses:", addresses);

  //verify on etherscan
  try {
    await run("verify", { address: addresses.implementation });
  } catch (e) {}

  fs.writeFileSync("bmyc-addresses.json", JSON.stringify(addresses));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
