/* global ethers */

import { ethers, network } from "hardhat";
import fs from "fs";
import { merkle } from "./merkle";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const BMYC = await ethers.getContractFactory("BMYC");
  let addresses: { proxy: string; admin: string; implementation: string } =
    JSON.parse(
      fs.readFileSync(`bmyc-addresses-${network.name}.json`).toString()
    );
  const bmyc = await BMYC.attach(addresses.proxy);

  // sleep until due time
  let dueTime = "2022-11-10T15:49:45";
  console.log();
  while (new Date(dueTime).getTime() > Date.now()) {
    console.log(
      "\x1b[A\x1b[G\x1b[Jwaiting…",
      Date.now() - new Date(dueTime).getTime()
    );
    await delay(1000);
  }
  await bmyc.airdrop(
    [
      "0x8439f56fb3aae8abe0d47c8d276b5ba583ab32fc",
      "0x0ebde4dafe91e61e4c0b688efaee3610dbc2a722",
      "0x1ff0a95f49cb5e16fbd2dc484b54b48a621b0b9b",
      "0x165a4e31e484fd43ea9f71974d7d6953aae70718",
      "0x1e92b9028af8da3e7806ddc0762a074bef95d068",
      "0x34d190ef8c85810ca05c939b1403141df20c6489",
      "0xa3c15f80dcc7a8f55a3159199be411e976618e24",
      "0xb75628919b5530c9a4429c5329674239fd2b952f",
      "0xf775f89fa8e977d3e756e3f895afea96f7d64725",
      "0x9807ececa310e31ba8e71316432fe4836b45da32",
      "0x40f3daf7aee2529d3a4fba5ae85a6674421682e0",
      "0x38a2884d62f8e4aa538308a3db5f483ed5a9253c",
      "0x483ca9370064ba03200fade3b37603eb8cf464c6",
      "0x8f926cfa7fff4b2d17bcc49b48944b9be9b8fc98",
      "0xb7628ed8f24e3d9626453600dce62b68531fe49d",
      "0x2f2e822d0d47a0dfcf5d39e612fbff247351f054",
      "0x073a32fe1a40b0b290ebdfbf93d2f1c9db00ee45",
      "0x424a1088e10e7a1a190005f232bc46f67c63f10c",
      "0x42f0f2dfd722056a910630b97fd19174b25802e6",
      "0x43880899cc5093be2a773040e3631234fd9ea7f3",
      "0x46b230f9277ea279fbba94824aad9242f95b8182",
      "0x57d0a3f13e041113123a17796c3fc58c6eb9cc4b",
      "0x6691c02018c47a815bb0255a5963a1a9c653dadc",
      "0x67593a4f0c1e290eae66459ee160a82945a5886f",
      "0x759a63f481dc8d9b962c6b6115e27d2d0fd6a702",
      "0x76a6d7d4f8509440298182e48af3c38e82d47eed",
      "0x76b2ebbb9eacac1376575b4f77d81457b3489fae",
      "0x4a6aa398f119156d2d5c3d47abb038876bd7bc00",
      "0x84217606111dd6354d97c17f34b7e19502798605",
      "0x07efa31476e09920eb7e8df870af6fb9974a35fa",
      "0x087ed99eebf62c3424b106834bf424d44632dd59",
      "0x9261b0e89969106d493d2960ecb854ac1057ecc0",
      "0x96288df1058f7eb065fd60a53aad6ed78aead527",
      "0x0eca4897a897d9f3d0742a3a645ced3a7db74880",
      "0x78e17759a51620492b52273c6efdb702fb5b2cf7",
      "0x9b9cc63626692b73b65b315cb586a7b543d3391f",
      "0x9bc40a1d8d6c73f30cbe912808c15c1d1a5ebf9e",
      "0x9e165350dafde5fafa5ede15e52eb1a578227264",
      "0xa1818494e786bad0a87138eae292bd67b901b346",
      "0x24a666990ef29a2c2eefa92822659c3503db878b",
      "0xaed072bbd1e541102ad6173352cd72dbb71147d4",
      "0xb495f14e3809781f528e9da66fe0e0290bfa1f66",
      "0xb51667ddaffdbe32e676704a0ca280ea19eb342b",
      "0x25f64af800d9d681dfa189aab5fda6968de83d60",
      "0x2bd642d778badef6a733fd04d665ac18c7a63292",
      "0xc00485651a10881dcdf2b37e906c7ab068b0d6de",
      "0xc7cb506c006b3b4187eb467066896b2f0f949fd3",
      "0xd93f1d7cd6b1b3b8dd0272fc1e793836ab36dddc",
      "0xe07770dcf6f2d2e8ef279e9698bfea4392d57f46",
      "0xe0f01415a3bdf54216e4e41d8707c704ec185727",
      "0xe9c22b8dc66d0499f0f33923b8fb7c2931ea6ba8",
      "0xed59e0fb105f003e508a1f59fe9f4ae5a755bded",
      "0xf2cffb1cab7455b28c4d5e290823f8022023bfba",
      "0x2d9d63433f43a8c55442619e810e1b34cfef8504",
      "0xfb57704b698c3bfe42728968f75efdea249f35ec",
    ],
    [
      10, 9, 5, 5, 5, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1,
    ],
    { gasLimit: 5000000 }
  );
  await bmyc.togglePause({ gasLimit: 200000 });
  console.log("Token address:", bmyc.address);

  // add 30m
  dueTime = "2022-11-10T16:19:40";
  console.log();
  while (new Date(dueTime).getTime() > Date.now()) {
    console.log(
      "\x1b[A\x1b[G\x1b[Jwaiting…",
      Date.now() - new Date(dueTime).getTime()
    );
    await delay(1000);
  }
  await bmyc.teamMint();
  await bmyc.changeMerkleRoot((await merkle("whitelists")).getHexRoot());
  process.exit();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
