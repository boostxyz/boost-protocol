import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { GetContractReturnType } from '@nomicfoundation/hardhat-viem/types';
import { expect } from 'chai';
import { viem } from 'hardhat';
import { Address, WalletClient, parseEther, zeroAddress } from 'viem';
import { SimpleBudget$Type } from '../../../artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget';
import { MockERC20$Type } from '../../../artifacts/contracts/shared/Mocks.sol/MockERC20';
import { MockERC1155$Type } from '../../../artifacts/contracts/shared/Mocks.sol/MockERC1155';
import {
  freshBudget,
  fundedBudget,
  mockERC20,
  mockERC1155,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
} from '../../utils/helpers';

describe('As a creator', function () {
  describe('with a funded budget', function () {
    let _erc20: GetContractReturnType<MockERC20$Type['abi']>;
    let _erc1155: GetContractReturnType<MockERC1155$Type['abi']>;
    let _budget: GetContractReturnType<SimpleBudget$Type['abi']>;
    let _owner: { address: Address; client: WalletClient };
    let _other: { address: Address; client: WalletClient };

    beforeEach(async function () {
      let [ownerClient, otherClient] = await viem.getWalletClients();
      _owner = {
        address: ownerClient!.account.address,
        client: ownerClient as WalletClient,
      };
      _other = {
        address: otherClient!.account.address,
        client: otherClient as WalletClient,
      };

      let {
        budget: _budget,
        erc20: _erc20,
        erc1155: _erc1155,
      } = await loadFixture(fundedBudget);
      _budget = _budget as GetContractReturnType<SimpleBudget$Type['abi']>;
      _erc20 = _erc20 as GetContractReturnType<MockERC20$Type['abi']>;
      _erc1155 = _erc1155 as GetContractReturnType<MockERC1155$Type['abi']>;
    });

    it('can create a minimal Boost');
    it('can reuse an existing action');
    it('can reuse an existing allowlist');
    it('can offer multiple incentives');
  });
});

describe('As a user', function () {
  it('can discover available Boosts');
  it('can participate in a Boost');
});
