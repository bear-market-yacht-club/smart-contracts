import { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ethereum: {
      url: "https://mainnet.infura.io/v3/b04d2052bb564fe1b7013bd024f9c8ba",
      accounts: [process.env.PRIVATE_KEY_ETH!],
    },
    goerli: {
      url: "https://goerli.infura.io/v3/b04d2052bb564fe1b7013bd024f9c8ba",
      accounts: [process.env.PRIVATE_KEY_ETH!],
    },
    mumbai: {
      url: `https://rpc-mumbai.matic.today`,
      accounts: [
        process.env.PRIVATE_KEY3!,
        process.env.PRIVATE_KEY!,
        process.env.PRIVATE_KEY2!,
      ],
    },
    polygon: {
      url: `https://polygon-rpc.com/`,
      accounts: [process.env.PRIVATE_KEY2!],
    },
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_KEY!,
      polygon: process.env.POLYGON_KEY!,
    },
  },
  gasReporter: {
    enabled: process.env.GAS_REPORT ? true : false,
  },
};

export default config;
