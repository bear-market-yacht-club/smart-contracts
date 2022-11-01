import { ethers } from "ethers";
import fs from "fs";

let res = "address,amount";
for (let i = 0; i < 500; ++i) {
  const w = ethers.Wallet.createRandom();
  const n = Math.random();
  res += `\n${w.address},${n}`;
}

fs.writeFileSync("addresses.csv", res);
