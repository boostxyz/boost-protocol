import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { parseEther, zeroAddress } from "viem";
import { freshBudget, prepareFungibleTransfer, mockERC20, mockERC1155, prepareERC1155Transfer } from "../../utils/helpers";

describe("As a creator", function () {
  describe("I can create a simple budget", function () {
    it("with me as the owner", async function () {
      const [ownerClient] = await viem.getWalletClients();
      const budget = await loadFixture(freshBudget);
      expect((await budget.read.owner()).toLowerCase()).to.equal(ownerClient!.account.address);
    });

    it("with an authorized user", async function () {
      const [ownerClient] = await viem.getWalletClients();
      const budget = await loadFixture(freshBudget);
      expect(await budget.read.isAuthorized([ownerClient!.account.address])).to.equal(true);
    });

    it("with no initial balance", async function () {
      const budget = await loadFixture(freshBudget);
      expect(await budget.read.available([zeroAddress])).to.equal(0n);
    });

    describe("and I can allocate", function () {
      it("native assets", async function () {
        const budget = await loadFixture(freshBudget);
        await budget.write.allocate([
          prepareFungibleTransfer({
            amount: parseEther("1.0"),
            asset: zeroAddress,
            target: budget.address,
          })
        ], {
          value: parseEther("1.0"),
        });
        expect(await budget.read.available([zeroAddress])).to.equal(parseEther("1.0"));
      });

      it("ERC20 assets", async function () {
        const [ownerClient] = await viem.getWalletClients();
        const budget = await loadFixture(freshBudget);
        const token = await loadFixture(mockERC20);

        await token.write.approve([budget.address, parseEther("100")]);
        await budget.write.allocate([
          prepareFungibleTransfer({
            amount: parseEther("100"),
            asset: token.address,
            target: ownerClient!.account.address,
          })
        ]);

        expect(await budget.read.available([token.address])).to.equal(parseEther("100"));
      });

      it("ERC1155 assets", async function () {
        const [ownerClient] = await viem.getWalletClients();
        const budget = await loadFixture(freshBudget);
        const token = await loadFixture(mockERC1155);

        await token.write.mint([ownerClient!.account.address, 1n, 100n]);
        await token.write.setApprovalForAll([budget.address, true]);
        await budget.write.allocate([
          prepareERC1155Transfer({
            tokenId: 1n,
            amount: 100n,
            asset: token.address,
            target: ownerClient!.account.address,
          })
        ]);

        expect(await budget.read.available([token.address, 1n])).to.equal(100n);
      });
    });
  });
});
