import { readMockErc20BalanceOf } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { signMessage } from '@wagmi/core';
import { encodePacked, isAddress, keccak256, parseEther } from 'viem';
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
import { prepareSignerValidatorValidatePayload } from '../utils';
import { CGDAIncentive } from './CGDAIncentive';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('CGDAIncentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });

  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can successfully be deployed', async () => {
    const action = new CGDAIncentive(defaultOptions, {
      asset: budgets.erc20.assertValidAddress(),
      initialReward: 1n,
      totalBudget: 10n,
      rewardBoost: 1n,
      rewardDecay: 1n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can claim', async () => {
    const referrer = accounts.at(1)!.account!;
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message: { raw: message },
    });
    const erc20Incentive = new fixtures.bases.CGDAIncentive(defaultOptions, {
      asset: budgets.erc20.assertValidAddress(),
      initialReward: 1n,
      totalBudget: 10n,
      rewardBoost: 1n,
      rewardDecay: 1n,
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      prepareSignerValidatorValidatePayload({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
      { value: parseEther('0.000075') },
    );
    expect(
      await readMockErc20BalanceOf(defaultOptions.config, {
        address: budgets.erc20.assertValidAddress(),
        args: [defaultOptions.account.address],
      }),
    ).toBe(1n);
  });

  test('cannot claim twice', async () => {
    const referrer = accounts.at(1)!.account!;
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message: { raw: message },
    });
    const erc20Incentive = new fixtures.bases.CGDAIncentive(defaultOptions, {
      asset: budgets.erc20.assertValidAddress(),
      initialReward: 1n,
      totalBudget: 10n,
      rewardBoost: 1n,
      rewardDecay: 1n,
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      prepareSignerValidatorValidatePayload({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
      { value: parseEther('0.000075') },
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        prepareSignerValidatorValidatePayload({
          signer: trustedSigner.account,
          hash: message,
          signature: trustedSignature,
        }),
        { value: parseEther('0.000075') },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
