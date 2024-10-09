import { zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '@boostxyz/test/helpers';
import { StrategyType } from '../claiming';
import {
  AllowListIncentive,
  CGDAIncentive,
  ERC20Incentive,
  ERC20VariableIncentive,
  incentiveFromAddress,
} from './Incentive';
import { PointsIncentive } from './PointsIncentive';

describe('Incentive', () => {
  test('can automatically instantiate PointsIncentive given an address', async () => {
    const incentive = new PointsIncentive(defaultOptions, {
      venue: zeroAddress,
      selector: '0xdeadb33f',
      reward: 1n,
      limit: 1n,
    });
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(PointsIncentive);
  });

  test('can automatically instantiate AllowListIncentive given an address', async () => {
    const incentive = new AllowListIncentive(defaultOptions, {
      allowList: zeroAddress,
      limit: 3n,
    });
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(AllowListIncentive);
  });

  test('can automatically instantiate CGDAIncentive given an address', async () => {
    const incentive = new CGDAIncentive(defaultOptions, {
      asset: zeroAddress,
      initialReward: 1n,
      totalBudget: 10n,
      rewardBoost: 1n,
      rewardDecay: 1n,
      manager: zeroAddress,
    });
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(CGDAIncentive);
  });

  test('can automatically instantiate ERC20Incentive given an address', async () => {
    const incentive = new ERC20Incentive(defaultOptions, {
      asset: zeroAddress,
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 10n,
      manager: zeroAddress,
    });
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20Incentive);
  });

  test('can automatically instantiate ERC20VariableIncentive given an address', async () => {
    const incentive = new ERC20VariableIncentive(defaultOptions, {
      asset: zeroAddress,
      reward: 1n,
      limit: 10n,
      manager: zeroAddress,
    });
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20VariableIncentive);
  });
});
