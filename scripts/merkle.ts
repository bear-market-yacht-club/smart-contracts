import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import Knex from "knex";
import { whitelists } from "knex/types/tables";
import dotenv from "dotenv";
dotenv.config();

declare module "knex/types/tables" {
  interface whitelists {
    address: string;
  }
}

const merkle = (async () => {
  const knex = Knex({
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL!,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

  const whitelistedAddresses = await knex<whitelists>("whitelists");

  const leaves = whitelistedAddresses.map((addr) =>
    keccak256(addr.address.toLowerCase())
  );
  const merkleTree = new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });
  // const rootHash = merkleTree.getHexRoot();
  // console.log(merkleTree.toString());
  return merkleTree;

  // client side
  // const claimingAddress = keccak256(whitelistedAddresses[4]); //msg.sender
  // const claimingAddress = keccak256(
  //   "0x2546BcD3c84621e976D8185a91A922aE77ECEc30"
  // ); //msg.sender
  // const hexProof = merkleTree.getHexProof(claimingAddress);
  // console.log({ hexProof });

  //verification
  // console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
  // return { rootHash };
})();

export { merkle };
