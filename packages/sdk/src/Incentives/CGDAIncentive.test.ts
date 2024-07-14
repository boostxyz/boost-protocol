import { isAddress, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { CGDAIncentive } from './CGDAIncentive';

describe('CGDAIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new CGDAIncentive(defaultOptions, {
      asset: zeroAddress,
      initialReward: 0n,
      rewardDecay: 0n,
      rewardBoost: 0n,
      totalBudget: 0n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
