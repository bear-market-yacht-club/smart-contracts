import { ethers } from "hardhat";
import { argv } from "process";

const run_giveaway = async (giveaway_num: number) => {
  const contractAddr = "0xfA47D71e2328358984B5226F21Cbd1a0a84fa927";

  const Giveaways = await ethers.getContractAt("Giveaways", contractAddr);
  const tx = await Giveaways.run_giveaway(giveaway_num, { gasLimit: 400000 });
  console.log(tx);

  // console.log(await Giveaways.s_giveaways(giveaway_num));
};

run_giveaway(parseInt(argv[2]));
