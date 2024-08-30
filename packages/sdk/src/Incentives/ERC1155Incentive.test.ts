import { readMockErc1155BalanceOf } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { signMessage } from '@wagmi/core';
import {
  encodePacked,
  isAddress,
  keccak256,
  pad,
  parseEther,
  zeroAddress,
  zeroHash,
} from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { accounts } from '../../test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
} from '../../test/helpers';
import { prepareSignerValidatorClaimDataPayload } from '../utils';
import { ERC1155Incentive, ERC1155StrategyType } from './ERC1155Incentive';

const BOOST_CORE_CLAIM_FEE = parseEther('0.000075');

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('ERC1155Incentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can successfully be deployed', async () => {
    const action = new ERC1155Incentive(defaultOptions, {
      asset: zeroAddress,
      strategy: ERC1155StrategyType.MINT,
      tokenId: 0n,
      limit: 10n,
      extraData: '0x',
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can claim', async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc1155Incentive = new fixtures.bases.ERC1155Incentive(
      defaultOptions,
      {
        asset: budgets.erc1155.assertValidAddress(),
        strategy: ERC1155StrategyType.POOL,
        tokenId: 1n,
        limit: 1n,
        extraData: zeroHash,
      },
    );
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc1155Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      validator: boost.validator.assertValidAddress(),
      incentiveQuantity,
      claimant,
      boostId: boost.id,
    });

    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: BOOST_CORE_CLAIM_FEE },
    );
    expect(
      await readMockErc1155BalanceOf(defaultOptions.config, {
        address: budgets.erc1155.assertValidAddress(),
        args: [defaultOptions.account.address, 1n],
      }),
    ).toBe(1n);
  });
});
