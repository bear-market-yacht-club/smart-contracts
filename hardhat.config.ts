import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY2!],
    },
    polygon: {
      url: `https://polygon-rpc.com/`,
      accounts: [process.env.PRIVATE_KEY2!],
    },
  },
};

export default config;
