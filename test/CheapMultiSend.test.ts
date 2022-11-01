import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { CheapMultiSend__factory } from "../typechain-types/factories/contracts";
import csvtojson from "csvtojson";

describe("CheapMultiSend", function () {
  async function deploy() {
    const [owner, ...otherAccounts] = await ethers.getSigners();

    const CheapMultiSend = (await ethers.getContractFactory(
      "CheapMultiSend"
    )) as CheapMultiSend__factory;
    const cheapMultiSend = await CheapMultiSend.deploy();

    return { cheapMultiSend, owner, otherAccounts };
  }

  it("multi send", async function () {
    const { cheapMultiSend, owner, otherAccounts } = await loadFixture(deploy);

    const accountCount = 5;
    const accounts = otherAccounts
      .slice(0, accountCount)
      .map((account) => account.address);
    const amounts = [5, 4, 3, 6, 2];
    await cheapMultiSend.multiSend(accounts, amounts, {
      value: amounts.reduce((prev, cur) => cur + prev),
    });

    for (let i = 0; i < accountCount; ++i) {
      expect(
        (await otherAccounts[i].getBalance())
          .sub("10000000000000000000000")
          .toNumber()
      ).to.be.equal(amounts[i]);
    }
  });

  it("multi send 400 accounts", async function () {
    const { cheapMultiSend } = await loadFixture(deploy);

    // read in csv from desktop 10 and run through the steps. make it 500 accounts tho
    let wallets: { address: string; amount: bigint }[] =
      await csvtojson().fromFile("test/data/addresses.csv");
    wallets = wallets.map((w) => ({
      address: w.address,
      amount: ethers.BigNumber.from(
        (parseFloat(w.amount.toString()) * 10e17).toString()
      ).toBigInt(),
    }));

    wallets = wallets.slice(0, 400);

    await cheapMultiSend.multiSend(
      wallets.map((w) => w.address),
      wallets.map((w) => w.amount),
      {
        value: wallets.map((w) => w.amount).reduce((prev, cur) => cur + prev),
      }
    );

    for (let i = 0; i < wallets.length; ++i) {
      // console.log(
      //   await cheapMultiSend.getBalance(wallets[i].address),
      //   wallets[i].amount
      // );
      expect(await cheapMultiSend.getBalance(wallets[i].address)).to.be.equal(
        wallets[i].amount
      );
    }
  });
});
