import { ethers } from "hardhat";

const run_giveaway = async (giveaway_num: number) => {
  const contractAddr = "0xfA47D71e2328358984B5226F21Cbd1a0a84fa927";

  const Giveaways = await ethers.getContractAt("Giveaways", contractAddr);
  //console.log(await Giveaways.get_winner(giveaway_num));

  console.log(await Giveaways.s_giveaways(giveaway_num));
};

run_giveaway(0);
