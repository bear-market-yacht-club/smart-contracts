/* global ethers */

import { ethers, network } from "hardhat";
import fs from "fs";
import { upgradeBMYC } from "./upgrade-bmyc";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const BMYC = await ethers.getContractFactory("BMYC");
  let addresses: { proxy: string; admin: string; implementation: string } =
    JSON.parse(
      fs.readFileSync(`bmyc-addresses-${network.name}.json`).toString()
    );
  const bmyc = await BMYC.attach(addresses.proxy);
  // add 30m
  let dueTime = "2022-11-11T14:55:00";
  console.log();
  while (new Date(dueTime).getTime() > Date.now()) {
    console.log(
      "\x1b[A\x1b[G\x1b[Jwaiting…",
      Date.now() - new Date(dueTime).getTime()
    );
    await delay(1000);
  }
  await upgradeBMYC().then(() =>
    bmyc.airdrop(["0xb6FAEfd65b19aD86755f3C6cB4c018945B8f1139"], [150])
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
