/* global ethers */

const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Giveaways = await ethers.getContractFactory("Giveaways");
  const giveaways = await Giveaways.deploy(
    "https://bearmarketyachtclub.com/giveaways/",
    ".txt",
    // "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    // "0x99aFAf084eBA697E584501b8Ed2c0B37Dd136693"
    "0xb0897686c545045aFc77CF20eC7A532E3120E0F1",
    "0x4e42f0adEB69203ef7AaA4B7c414e5b1331c14dc"
  );

  console.log("Token address:", giveaways.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
