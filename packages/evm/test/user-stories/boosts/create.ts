import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { GetContractReturnType } from '@nomicfoundation/hardhat-viem/types';
import { expect } from 'chai';
import { viem } from 'hardhat';
import { Address, WalletClient, parseEther } from 'viem';
import { BoostCore$Type } from '../../../artifacts/contracts/BoostCore.sol/BoostCore';
import { BoostRegistry$Type } from '../../../artifacts/contracts/BoostRegistry.sol/BoostRegistry';
import { Action$Type } from '../../../artifacts/contracts/actions/Action.sol/Action';
import { SimpleBudget$Type } from '../../../artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget';
import { MockERC20$Type } from '../../../artifacts/contracts/shared/Mocks.sol/MockERC20';
import { MockERC1155$Type } from '../../../artifacts/contracts/shared/Mocks.sol/MockERC1155';
import {
  StrategyType,
  erc20Incentive,
  prepareBoostPayload,
  prepareFungibleTransfer,
  signerValidator,
  simpleAllowList,
} from '../../../artifacts/index';
import {
  Base,
  coreAndRegistry,
  freshBoost,
  fundedBudget,
} from '../../utils/helpers';

describe('As a creator', function () {
  describe('with a funded budget', function () {
    let erc20: GetContractReturnType<MockERC20$Type['abi']>;
    let erc1155: GetContractReturnType<MockERC1155$Type['abi']>;
    let budget: GetContractReturnType<SimpleBudget$Type['abi']>;
    let core: GetContractReturnType<BoostCore$Type['abi']>;
    let registry: GetContractReturnType<BoostRegistry$Type['abi']>;
    let bases: Base[];

    let action: GetContractReturnType<Action$Type['abi']>;

    let owner: { address: Address; client: WalletClient };
    let other: { address: Address; client: WalletClient };

    beforeEach(async function () {
      const [ownerClient, otherClient] = await viem.getWalletClients();
      owner = {
        address: ownerClient?.account.address,
        client: ownerClient as WalletClient,
      };
      other = {
        address: otherClient?.account.address,
        client: otherClient as WalletClient,
      };

      const {
        bases: _bases,
        core: _core,
        registry: _registry,
      } = await loadFixture(coreAndRegistry);
      bases = _bases;
      core = _core as GetContractReturnType<BoostCore$Type['abi']>;
      registry = _registry as GetContractReturnType<BoostRegistry$Type['abi']>;

      const {
        budget: _budget,
        erc20: _erc20,
        erc1155: _erc1155,
      } = await loadFixture(fundedBudget);
      budget = _budget as GetContractReturnType<SimpleBudget$Type['abi']>;
      erc20 = _erc20 as GetContractReturnType<MockERC20$Type['abi']>;
      erc1155 = _erc1155 as GetContractReturnType<MockERC1155$Type['abi']>;
    });

    it('can create a minimal Boost', async function () {
      expect(await core.read.getBoostCount()).to.equal(0n);
      await loadFixture(freshBoost);
      expect(await core.read.getBoostCount()).to.equal(1n);
    });

    it('can reuse an existing action', async function () {
      const { budget, erc20 } = await loadFixture(fundedBudget);
      await loadFixture(freshBoost);

      const boost = await core.read.getBoost([0n]);
      const action = await viem.getContractAt('Action', boost.action);
      expect(await action.read.supportsInterface(['0xe6715795'])).to.be.true;

      // add enough funds to cover the new incentives
      await erc20.write.mint([owner.address, parseEther('1000')]);
      await erc20.write.approve([budget.address, parseEther('1000')]);
      await budget.write.allocate([
        prepareFungibleTransfer({
          amount: parseEther('1000'),
          asset: erc20.address,
          target: owner.address,
        }),
      ]);

      await core.write.createBoost([
        prepareBoostPayload({
          budget: budget.address,
          owner: owner.address,
          action: {
            parameters: '0x',
            instance: action.address,
            isBase: false,
          },
          validator: {
            ...signerValidator({ signers: [owner.address] }),
            instance: bases.find((b) => b.name === 'SignerValidator')?.base
              .address,
          },
          allowList: {
            ...simpleAllowList({
              owner: owner.address,
              allowed: [owner.address],
            }),
            instance: bases.find((b) => b.name === 'SimpleAllowList')?.base
              .address,
          },
          incentives: [
            {
              ...erc20Incentive({
                asset: erc20.address,
                reward: parseEther('100'),
                limit: 10n,
                strategy: StrategyType.POOL,
              }),
              instance: bases.find((b) => b.name === 'ERC20Incentive')?.base
                .address,
            },
          ],
        }),
      ]);
    });

    it('can reuse an existing allowlist');
    it('can offer multiple incentives');
  });
});

describe('As a user', function () {
  it('can discover available Boosts');
  it('can participate in a Boost');
});
