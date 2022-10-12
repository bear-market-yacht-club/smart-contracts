import { ethers } from "hardhat";
import * as https from "https";
import keccak256 from "keccak256";
import { argv } from "process";

const get_giveaway = async (giveaway_num: number) => {
  const contractAddr = "0xfA47D71e2328358984B5226F21Cbd1a0a84fa927";

  const Giveaways = await ethers.getContractAt("Giveaways", contractAddr);

  const ga = await Giveaways.s_giveaways(giveaway_num);

  const link = await Giveaways.get_participants_list_link(
    giveaway_num.toString()
  );

  await https.get(link).on("response", (response) => {
    let body = "";
    response.on("data", function (chunk: Buffer) {
      body += chunk.toString();
    });
    response.on("end", function () {
      // verify the proof
      if (
        keccak256(body).toString("hex") !== ga.proof.toHexString().substring(2)
      ) {
        throw new Error("Proof is incorrect");
      }

      for (let line of body.split("\n")) {
        if (line.startsWith(ga.winner.toString())) {
          console.log("Winner:", line);
          break;
        }
      }
    });
  });
};

get_giveaway(parseInt(argv[2]));
