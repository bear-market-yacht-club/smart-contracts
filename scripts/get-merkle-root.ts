/* global ethers */

import { merkle } from "./merkle";
import { exit } from "process";

async function main() {
  console.log((await merkle).getHexRoot());
  exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
