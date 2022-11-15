/* global ethers */

import { ethers, upgrades, run, network } from "hardhat";
import fs from "fs";

export async function upgradeBMYC() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const BMYC = await ethers.getContractFactory("BMYC");
  let addresses: { proxy: string; admin: string; implementation: string } =
    JSON.parse(
      fs.readFileSync(`bmyc-addresses-${network.name}.json`).toString()
    );
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

  fs.writeFileSync(
    `bmyc-addresses-${network.name}.json`,
    JSON.stringify(addresses)
  );

  //verify on etherscan
  try {
    await run("verify", { address: addresses.implementation });
  } catch (e) {}

  // new inits
  // const bmyc = await BMYC.attach(addresses.proxy);
  // await bmyc.initialize2({ gasLimit: 200000 });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
upgradeBMYC().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
