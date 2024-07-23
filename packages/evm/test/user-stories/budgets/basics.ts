import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import type { GetContractReturnType } from '@nomicfoundation/hardhat-viem/types';
import { expect } from 'chai';
import { viem } from 'hardhat';
import { type Address, type WalletClient, parseEther, zeroAddress } from 'viem';
import type { SimpleBudget$Type } from '../../../artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget';
import type { MockERC20$Type } from '../../../artifacts/contracts/shared/Mocks.sol/MockERC20';
import type { MockERC1155$Type } from '../../../artifacts/contracts/shared/Mocks.sol/MockERC1155';
import {
  prepareERC1155Transfer,
  prepareFungibleTransfer,
} from '../../../artifacts/index';
import {
  freshBudget,
  fundedBudget,
  mockERC20,
  mockERC1155,
} from '../../utils/helpers';

describe('As a creator', function () {
  let erc20: GetContractReturnType<MockERC20$Type['abi']>;
  let erc1155: GetContractReturnType<MockERC1155$Type['abi']>;
  let budget: GetContractReturnType<SimpleBudget$Type['abi']>;
  let owner: { address: Address; client: WalletClient };
  let _other: { address: Address; client: WalletClient };

  beforeEach(async function () {
    const [ownerClient, otherClient] = await viem.getWalletClients();
    owner = {
      address: ownerClient?.account.address,
      client: ownerClient as WalletClient,
    };
    _other = {
      address: otherClient?.account.address,
      client: otherClient as WalletClient,
    };
  });

  describe('I can create a simple budget', function () {
    it('with me as the owner', async function () {
      budget = await loadFixture(freshBudget);
      expect((await budget.read.owner()).toLowerCase()).to.equal(owner.address);
    });

    it('with an authorized user', async function () {
      budget = await loadFixture(freshBudget);
      expect(await budget.read.isAuthorized([owner.address])).to.be.true;
    });

    it('with no initial balance', async function () {
      budget = await loadFixture(freshBudget);
      expect(await budget.read.available([zeroAddress])).to.equal(0n);
    });

    describe('and I can allocate', function () {
      beforeEach(async function () {
        budget = await loadFixture(freshBudget);
        erc20 = await loadFixture(mockERC20);
        erc1155 = await loadFixture(mockERC1155);
      });

      it('native assets', async function () {
        await budget.write.allocate(
          [
            prepareFungibleTransfer({
              amount: parseEther('1.0'),
              asset: zeroAddress,
              target: owner.address,
            }),
          ],
          {
            value: parseEther('1.0'),
          },
        );

        expect(await budget.read.available([zeroAddress])).to.equal(
          parseEther('1.0'),
        );
      });

      it('ERC20 assets', async function () {
        await erc20.write.approve([budget.address, parseEther('100')]);
        await budget.write.allocate([
          prepareFungibleTransfer({
            amount: parseEther('100'),
            asset: erc20.address,
            target: owner.address,
          }),
        ]);

        expect(await budget.read.available([erc20.address])).to.equal(
          parseEther('100'),
        );
      });

      it('ERC1155 assets', async function () {
        await erc1155.write.mint([owner.address, 1n, 100n]);
        await erc1155.write.setApprovalForAll([budget.address, true]);
        await budget.write.allocate([
          prepareERC1155Transfer({
            tokenId: 1n,
            amount: 100n,
            asset: erc1155.address,
            target: owner.address,
          }),
        ]);

        expect(await budget.read.available([erc1155.address, 1n])).to.equal(
          100n,
        );
      });
    });

    context('with funds allocated', function () {
      beforeEach(async function () {
        const {
          budget: _budget,
          erc20: _erc20,
          erc1155: _erc1155,
        } = await loadFixture(fundedBudget);
        budget = _budget as GetContractReturnType<SimpleBudget$Type['abi']>;
        erc20 = _erc20 as GetContractReturnType<MockERC20$Type['abi']>;
        erc1155 = _erc1155 as GetContractReturnType<MockERC1155$Type['abi']>;
      });

      context('I can disburse', function () {
        it('native assets', async function () {
          await budget.write.disburse([
            prepareFungibleTransfer({
              amount: parseEther('1.0'),
              asset: zeroAddress,
              target: owner.address,
            }),
          ]);

          expect(await budget.read.available([zeroAddress])).to.equal(0n);
        });

        it('ERC20 assets', async function () {
          await budget.write.disburse([
            prepareFungibleTransfer({
              amount: parseEther('10'),
              asset: erc20.address,
              target: owner.address,
            }),
          ]);

          expect(await budget.read.available([erc20.address])).to.equal(
            parseEther('90'),
          );
        });

        it('ERC1155 assets', async function () {
          await budget.write.disburse([
            prepareERC1155Transfer({
              tokenId: 1n,
              amount: 5n,
              asset: erc1155.address,
              target: owner.address,
            }),
          ]);

          expect(await budget.read.available([erc1155.address, 1n])).to.equal(
            95n,
          );
        });
      });
    });
  });
});
