import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { BMYC__factory } from "../typechain-types/factories/contracts";

describe("BMYC", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await ethers.getSigners();

    const whitelistedAddresses: string[] = [
      owner.address,
      otherAccounts[1].address,
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
      "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
      "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
      "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
      "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
      "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
      "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    ];

    const leaves = whitelistedAddresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const rootHash = merkleTree.getHexRoot();

    const BMYC = (await ethers.getContractFactory(
      "contracts/BMYC.sol:BMYC"
    )) as BMYC__factory;
    const bmyc = await BMYC.deploy(
      rootHash,
      "ipfs://baseuirheremorerandomsymboldlkj34klhjdhf98sdfhsdf89dfshd"
    );
    const ERC20 = await ethers.getContractFactory("TestERC20");
    const erc20 = await ERC20.connect(otherAccounts[0]).deploy();

    return { bmyc, erc20, owner, otherAccounts, merkleTree };
  }

  it("should be able to merkle whitelist", async function () {
    const { bmyc, erc20, owner, otherAccounts, merkleTree } = await loadFixture(
      deploy
    );

    const hexProof = merkleTree.getHexProof(
      keccak256(otherAccounts[1].address)
    );
    const badHexProof = merkleTree.getHexProof(
      keccak256(otherAccounts[0].address)
    );

    const mintPrice = await bmyc.MINT_PRICE();

    await expect(bmyc.mint(2, badHexProof)).to.be.revertedWith(
      "Cannot mint yet"
    );

    await bmyc.startMint();

    // try from another account
    await expect(bmyc.mint(2, badHexProof)).to.be.revertedWith(
      "not enough eth to mint"
    );
    // correct account, but addr isnt in merkle
    await expect(
      bmyc.connect(otherAccounts[0]).mint(2, badHexProof)
    ).to.be.revertedWith("not enough eth to mint");
    await expect(bmyc.connect(otherAccounts[0]).mint(2, [])).to.be.revertedWith(
      "not enough eth to mint"
    );

    let quantity = 2;
    await bmyc.connect(otherAccounts[1]).mint(quantity, hexProof, {
      value: mintPrice.mul(quantity - 1),
      gasLimit: 200000,
    });
    await bmyc.connect(otherAccounts[1]).mint(quantity, hexProof, {
      value: mintPrice.mul(quantity),
      gasLimit: 200000,
    });
    expect(await bmyc.balanceOf(otherAccounts[1].address)).to.equal(
      quantity * 2,
      "Didn't recieve the NFTs"
    );

    // check erc20 withdrawal
    expect(await erc20.balanceOf(otherAccounts[0].address)).to.be.equal(10);
    expect(await erc20.balanceOf(owner.address)).to.be.equal(0);
    await erc20.connect(otherAccounts[0]).transfer(bmyc.address, 10);
    expect(await erc20.balanceOf(otherAccounts[0].address)).to.be.equal(0);
    expect(await erc20.balanceOf(bmyc.address)).to.be.equal(10);
    await bmyc.withdrawToken(erc20.address);
    expect(await erc20.balanceOf(owner.address)).to.be.equal(10);
  });
});
