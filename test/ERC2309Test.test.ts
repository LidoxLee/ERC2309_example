import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC2309Test", function () {
  async function deployERC2309Test() {
    // Contracts are deployed using the first signer/account by default
    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const account_1 = signers[1];
    const account_2 = signers[2];
    const account_3 = signers[3];
    //get factory
    const ERC2309Test_Factory = await ethers.getContractFactory("ERC2309Test");
    const ERC2309Test_Instance = await ERC2309Test_Factory.deploy();

    return { deployer, account_1, account_2, account_3, ERC2309Test_Instance };
  }

  describe("mintERC2309 test", function () {
    it("Should deploy the contract, and check the owner balance is 5000", async function () {
      // check deployer balance
      const { deployer, ERC2309Test_Instance } = await loadFixture(deployERC2309Test);
      const deployer_balance = await ERC2309Test_Instance.balanceOf(deployer.address);
      // confirm balance correct
      expect(deployer_balance).to.equal(5000);

      // confirm owner of NFTs correct
      expect(await ERC2309Test_Instance.ownerOf(0)).to.be.equals(deployer.address);
      expect(await ERC2309Test_Instance.ownerOf(3000)).to.be.equals(deployer.address);
      expect(await ERC2309Test_Instance.ownerOf(4999)).to.be.equals(deployer.address);
    });

    it("Should call mintERC2309 5000 NFTs and check the owner balance is 5000", async function () {
      const { deployer, account_1, ERC2309Test_Instance } = await loadFixture(deployERC2309Test);
      const mintQuantity = 5000;
      const addressZero = ethers.constants.AddressZero;
      // When deploy contract with _mintQuantity 5000, tokenId 0 ~ 4999.
      // account_1 call mintERC2309 5000, tokenId 5000 ~ 9999.
      await expect(
        ERC2309Test_Instance.connect(account_1).mintERC2309(account_1.address, mintQuantity)
      )
        .to.be.emit(ERC2309Test_Instance, "ConsecutiveTransfer")
        .withArgs(5000, 5000 + mintQuantity - 1, addressZero, account_1.address);

      const account_1_balance = await ERC2309Test_Instance.balanceOf(account_1.address);
      // confirm balance correct
      expect(account_1_balance).to.equal(5000);

      // confirm owner of NFTs correct
      expect(await ERC2309Test_Instance.ownerOf(5000)).to.be.equals(account_1.address);
      expect(await ERC2309Test_Instance.ownerOf(8000)).to.be.equals(account_1.address);
      expect(await ERC2309Test_Instance.ownerOf(9999)).to.be.equals(account_1.address);
    });

    it("Should mintERC2309 5000 NFTs after mint 10 NFTs and check the owner balance is 5010", async function () {
      const { deployer, account_1, account_2, ERC2309Test_Instance } = await loadFixture(
        deployERC2309Test
      );
      const mintERC2309Quantity = 5000;
      const addressZero = ethers.constants.AddressZero;
      await expect(
        ERC2309Test_Instance.connect(account_1).mintERC2309(account_1.address, mintERC2309Quantity)
      )
        .to.be.emit(ERC2309Test_Instance, "ConsecutiveTransfer")
        .withArgs(5000, 5000 + mintERC2309Quantity - 1, addressZero, account_1.address);

      const account_1_balance = await ERC2309Test_Instance.balanceOf(account_1.address);
      // confirm balance correct
      expect(account_1_balance).to.equal(5000);

      // account2 mint 10 NFTs
      const mintQuantity = 10;
      await expect(ERC2309Test_Instance.connect(account_2).mint(account_2.address, mintQuantity))
        .emit(ERC2309Test_Instance, "Transfer")
        .withArgs(addressZero, account_2.address, 10000)
        .emit(ERC2309Test_Instance, "Transfer")
        .withArgs(addressZero, account_2.address, 10001)
        .emit(ERC2309Test_Instance, "Transfer")
        .withArgs(addressZero, account_2.address, 10002)
        .emit(ERC2309Test_Instance, "Transfer")
        .withArgs(addressZero, account_2.address, 10003);

      // confirm account_1 owner of NFTs correct
      expect(await ERC2309Test_Instance.ownerOf(5000)).to.be.equals(account_1.address);
      expect(await ERC2309Test_Instance.ownerOf(8000)).to.be.equals(account_1.address);
      expect(await ERC2309Test_Instance.ownerOf(9999)).to.be.equals(account_1.address);
      // confirm account_2 owner of NFTs correct
      expect(await ERC2309Test_Instance.ownerOf(10000)).to.be.equals(account_2.address);
      expect(await ERC2309Test_Instance.ownerOf(10005)).to.be.equals(account_2.address);
      expect(await ERC2309Test_Instance.ownerOf(10009)).to.be.equals(account_2.address);

      // account2 mint 5000 NFTs
      await expect(
        ERC2309Test_Instance.connect(account_2).mintERC2309(account_2.address, mintERC2309Quantity)
      )
        .emit(ERC2309Test_Instance, "ConsecutiveTransfer")
        .withArgs(10010, 10010 + mintERC2309Quantity - 1, addressZero, account_2.address);

      const account_2_balance = await ERC2309Test_Instance.balanceOf(account_2.address);
      // confirm balance correct
      expect(account_2_balance).to.equal(mintERC2309Quantity + mintQuantity);
    });

    it("Calculate mintERC2309 5000 NFTs gasUsed", async function () {
      const { deployer, account_1, account_2, ERC2309Test_Instance } = await loadFixture(
        deployERC2309Test
      );
      const mintERC2309Quantity = 5000;
      const mintQuantity = 10;
      const tx_mintERC2309 = await ERC2309Test_Instance.connect(account_1).mintERC2309(
        account_1.address,
        mintERC2309Quantity
      );

      const tx_mint = await ERC2309Test_Instance.connect(account_1).mint(
        account_1.address,
        mintQuantity
      );
      const receipt_mintERC2309 = await tx_mintERC2309.wait();
      const receipt_mint = await tx_mint.wait();
      const gasUsed_mintERC2309 = receipt_mintERC2309.gasUsed.toNumber();
      const gasUsed_mint = receipt_mint.gasUsed.toNumber();
      console.log(" gasUsed_mintERC2309 : ", gasUsed_mintERC2309);
      console.log(" gasUsed_mint : ", gasUsed_mint);
    });
  });
});
