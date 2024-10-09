import { readMockErc20BalanceOf } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, pad, parseEther, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { accounts } from '@boostxyz/test/accounts';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
} from '@boostxyz/test/helpers';
import { BOOST_CORE_CLAIM_FEE } from '../BoostCore';
import { StrategyType } from '../claiming';
import { ERC20Incentive } from './ERC20Incentive';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('ERC20Incentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can successfully be deployed', async () => {
    const action = new ERC20Incentive(defaultOptions, {
      asset: zeroAddress,
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: zeroAddress,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can claim', async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
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
      await readMockErc20BalanceOf(defaultOptions.config, {
        address: budgets.erc20.assertValidAddress(),
        args: [defaultOptions.account.address],
      }),
    ).toBe(1n);
  });

  test('cannot claim twice', async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
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
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        { value: parseEther('0.000075') },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
