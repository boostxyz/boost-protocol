import { isAddress, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '../../test/helpers';
import { PointsIncentive } from './PointsIncentive';

describe('PointsIncentive', () => {
  test('can successfully be deployed', async () => {
    const action = new PointsIncentive(defaultOptions, {
      venue: zeroAddress,
      selector: '0xdeadb33f',
      reward: 1n,
      limit: 1n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });
});
