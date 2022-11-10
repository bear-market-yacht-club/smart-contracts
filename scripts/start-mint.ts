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
      "0x9261b0e89969106d493d2960ecb854ac1057ecc0",
      "0x38a2884d62f8e4aa538308a3db5f483ed5a9253c",
      "0x9bc40a1d8d6c73f30cbe912808c15c1d1a5ebf9e",
      "0xb75628919b5530c9a4429c5329674239fd2b952f",
      "0xa13965bc7b8003b4ce744c9aaf1c0dfcd1556da2",
      "0x25f64af800d9d681dfa189aab5fda6968de83d60",
      "0x6691c02018c47a815bb0255a5963a1a9c653dadc",
      "0x483ca9370064ba03200fade3b37603eb8cf464c6",
      "0xa3c15f80dcc7a8f55a3159199be411e976618e24",
      "0x38a2884d62f8e4aa538308a3db5f483ed5a9253c",
      "0x2d9d63433f43a8c55442619e810e1b34cfef8504",
      "0x4a6aa398f119156d2d5c3d47abb038876bd7bc00",
      "0x32242fe69141b2df23b02dfef9b5e535ac0e27f1",
      "0x97c8becdb6bdb1bfc0a789cc240f0e126c9a3feb",
      "0x9807ececa310e31ba8e71316432fe4836b45da32",
      "0x447afa4b9f5c187f39f365166fc47dc33793ae0d",
      "0x6ea9b0e6ce9d17d446fa156cc007df9b94abb34e",
      "0xa3c15f80dcc7a8f55a3159199be411e976618e24",
      "0xb51667ddaffdbe32e676704a0ca280ea19eb342b",
      "0x07efa31476e09920eb7e8df870af6fb9974a35fa",
      "0x9261b0e89969106d493d2960ecb854ac1057ecc0",
      "0x4a15d91a07954bf91bbf40cfe14cebe2a6316cd5",
      "0x9b9cc63626692b73b65b315cb586a7b543d3391f",
      "0x165a4e31e484fd43ea9f71974d7d6953aae70718",
      "0x32e8cabc78ba0b53ac1318a2102854810edadad1",
      "0x9807ececa310e31ba8e71316432fe4836b45da32",
      "0xd0c7c30a8f963c8ac7f837cb66b6a71602502b8a",
      "0x6ea9b0e6ce9d17d446fa156cc007df9b94abb34e",
      "0x76a6d7d4f8509440298182e48af3c38e82d47eed",
      "0xe9c22b8dc66d0499f0f33923b8fb7c2931ea6ba8",
      "0x24a666990ef29a2c2eefa92822659c3503db878b",
      "0xf2cffb1cab7455b28c4d5e290823f8022023bfba",
      "0x40f3daf7aee2529d3a4fba5ae85a6674421682e0",
      "0x26852f5184f188e9f0c4551fdd25c37391c10bad",
      "0x0eca4897a897d9f3d0742a3a645ced3a7db74880",
      "0x40f3daf7aee2529d3a4fba5ae85a6674421682e0",
      "0x8f926cfa7fff4b2d17bcc49b48944b9be9b8fc98",
      "0x1ff0a95f49cb5e16fbd2dc484b54b48a621b0b9b",
      "0x84217606111dd6354d97c17f34b7e19502798605",
      "0x0ebde4dafe91e61e4c0b688efaee3610dbc2a722",
      "0x0eca4897a897d9f3d0742a3a645ced3a7db74880",
      "0xb495f14e3809781f528e9da66fe0e0290bfa1f66",
      "0x42f0f2dfd722056a910630b97fd19174b25802e6",
      "0x1edcd17cdd71fea99bbf6aee6cd21b70f189ae89",
      "0xd693c5001ad81dcc54f7391f1bd32b3e12a15f56",
      "0xfb57704b698c3bfe42728968f75efdea249f35ec",
      "0x9b9cc63626692b73b65b315cb586a7b543d3391f",
      "0xfde601162419b5b58fd931552943343da58d6907",
      "0x424a1088e10e7a1a190005f232bc46f67c63f10c",
      "0xf367236d56338ac780267ac09217b02746607cae",
      "0x10a74d536d07baab67b4537d59a943205861ec31",
      "0xb75e827aaf5c204f1e375b0d52e4a6d1ba0b94e5",
      "0x2dfbf9f619af91456ff8270616f36969e1736a10",
      "0x43880899cc5093be2a773040e3631234fd9ea7f3",
      "0x447afa4b9f5c187f39f365166fc47dc33793ae0d",
      "0x32e8cabc78ba0b53ac1318a2102854810edadad1",
      "0xda32fb556a8015b2d492cf19c339401ad4789ebc",
      "0xfe063d3a9ecda0b9db0169ba0778aa22eb77a9ee",
      "0x32e8cabc78ba0b53ac1318a2102854810edadad1",
      "0x03a8726172fa51d64b0c3d583de5876e73d73d0e",
      "0xd93f1d7cd6b1b3b8dd0272fc1e793836ab36dddc",
      "0xd93f1d7cd6b1b3b8dd0272fc1e793836ab36dddc",
      "0x0be848e6db55564b186c6373e781c6a141eef067",
      "0x1e92b9028af8da3e7806ddc0762a074bef95d068",
      "0xb7628ed8f24e3d9626453600dce62b68531fe49d",
      "0xbdb67f6f9e65a24573ae00b512c67c0472a3747c",
      "0x5ec62034dd3b198763c72e5ae775fad3990973b3",
      "0xf547afbca7d82b366c1e6e0d161480606a95f17f",
      "0x76b2ebbb9eacac1376575b4f77d81457b3489fae",
      "0xbdb67f6f9e65a24573ae00b512c67c0472a3747c",
      "0xcc0fe514a11bfa77f855da3d6cfc3cf91fbfabfa",
      "0xe43e23a61f22d42a24337f1e992dcd1d2d23435f",
      "0xe07770dcf6f2d2e8ef279e9698bfea4392d57f46",
      "0xe07770dcf6f2d2e8ef279e9698bfea4392d57f46",
      "0x4a15d91a07954bf91bbf40cfe14cebe2a6316cd5",
      "0x4a15d91a07954bf91bbf40cfe14cebe2a6316cd5",
      "0xd93f1d7cd6b1b3b8dd0272fc1e793836ab36dddc",
      "0x34d190ef8c85810ca05c939b1403141df20c6489",
      "0x4a15d91a07954bf91bbf40cfe14cebe2a6316cd5",
      "0x46b230f9277ea279fbba94824aad9242f95b8182",
      "0x96288df1058f7eb065fd60a53aad6ed78aead527",
      "0xc7cb506c006b3b4187eb467066896b2f0f949fd3",
      "0x78c4fb4729026ded25046a7030c8e4c2f6d2031f",
      "0xe6c089b739aa7e84e1d50709392052aecca5d67c",
      "0x6d6978f82906cf7bd0a5f6c7f22911516ff5f381",
      "0x67593a4f0c1e290eae66459ee160a82945a5886f",
      "0xaed072bbd1e541102ad6173352cd72dbb71147d4",
      "0x087ed99eebf62c3424b106834bf424d44632dd59",
      "0xf825c91ee69d5d0432bc08b125c6c6be637f4943",
      "0xf825c91ee69d5d0432bc08b125c6c6be637f4943",
      "0xe16eba3f9df30a77cf8f7759a2066661683b44e0",
      "0xb5876d83605ab7220d68fff82e61acd55d2b84f5",
      "0xc00485651a10881dcdf2b37e906c7ab068b0d6de",
      "0xd0c7c30a8f963c8ac7f837cb66b6a71602502b8a",
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
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
