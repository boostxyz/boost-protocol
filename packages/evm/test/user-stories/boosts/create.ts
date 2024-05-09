import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import { Address, parseEther, WalletClient, zeroAddress } from "viem";
import {
  freshBudget,
  prepareFungibleTransfer,
  mockERC20,
  mockERC1155,
  prepareERC1155Transfer,
  fundedBudget,
} from "../../utils/helpers";
import { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import { SimpleBudget$Type } from "../../../artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget";
import { MockERC20$Type } from "../../../artifacts/contracts/shared/Mocks.sol/MockERC20";
import { MockERC1155$Type } from "../../../artifacts/contracts/shared/Mocks.sol/MockERC1155";

describe("As a creator", function () {
  describe("with a funded budget", function () {
    let erc20: GetContractReturnType<MockERC20$Type["abi"]>;
    let erc1155: GetContractReturnType<MockERC1155$Type["abi"]>;
    let budget: GetContractReturnType<SimpleBudget$Type["abi"]>;
    let owner: { address: Address, client: WalletClient };
    let other: { address: Address, client: WalletClient };

    beforeEach(async function () {
      const [ownerClient, otherClient] = await viem.getWalletClients();
      owner = { address: ownerClient!.account.address, client: ownerClient as WalletClient };
      other = { address: otherClient!.account.address, client: otherClient as WalletClient };

      const { budget: _budget, erc20: _erc20, erc1155: _erc1155 } = await loadFixture(fundedBudget);
      budget = _budget as GetContractReturnType<SimpleBudget$Type["abi"]>;
      erc20 = _erc20 as GetContractReturnType<MockERC20$Type["abi"]>;
      erc1155 = _erc1155 as GetContractReturnType<MockERC1155$Type["abi"]>;
    });

    it("can create a minimal Boost");
    it("can reuse an existing action");
    it("can reuse an existing allowlist");
    it("can offer multiple incentives");
  });
});

describe("As a user", function () {
  it("can discover available Boosts");
  it("can participate in a Boost");
});