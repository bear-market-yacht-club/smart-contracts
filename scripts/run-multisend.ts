import { ethers } from "hardhat";
import csvtojson from "csvtojson";

const run_multisend = async () => {
  let wallets: { address: string; amount: bigint }[] =
    await csvtojson().fromFile("scripts/data/returns-addresses.csv");
  wallets = wallets.map((w) => ({
    address: w.address,
    amount: ethers.utils.parseEther(w.amount.toString()).toBigInt(),
  }));

  const [deployer] = await ethers.getSigners();
  const contractAddr = "0x4bf172b0767C8BE861399dEF54AE165b85a5DeCC";
  const cheapMultiSend = await ethers.getContractAt(
    "CheapMultiSend",
    contractAddr
  );
  // console.log(wallets);
  // console.log(await cheapMultiSend.getBalance(deployer.address));
  const tx = await cheapMultiSend.multiSend(
    wallets.map((w) => w.address),
    wallets.map((w) => w.amount),
    {
      value: wallets.map((w) => w.amount).reduce((prev, cur) => cur + prev),
    }
  );
  console.log(tx);
};

run_multisend();
