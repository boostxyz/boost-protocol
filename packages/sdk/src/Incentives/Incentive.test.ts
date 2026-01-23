import { pad, zeroAddress } from 'viem';
import { describe, expect, test } from 'vitest';
import { defaultOptions } from '@boostxyz/test/helpers';
import { StrategyType } from '../claiming';
import {
  AllowListIncentive,
  CGDAIncentive,
  ERC20Incentive,
  ERC20VariableIncentive,
  ERC20VariableCriteriaIncentive,
  ERC20VariableCriteriaIncentiveV2,
  ERC20PeggedVariableCriteriaIncentive,
  ERC20PeggedVariableCriteriaIncentiveV2,
  ERC20PeggedIncentive,
  incentiveFromAddress,
} from './Incentive';
import { PointsIncentive } from './PointsIncentive';
import { SignatureType, ValueType } from '../Actions/EventAction';

describe('Incentive', () => {
  test('can automatically instantiate PointsIncentive given an address', async () => {
    const incentive = new PointsIncentive(defaultOptions, {
      venue: zeroAddress,
      selector: '0xdeadb33f',
      reward: 1n,
      limit: 1n,
    });
    // @ts-expect-error private method
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
    // @ts-expect-error private method
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
    // @ts-expect-error private method
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
    // @ts-expect-error private method
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
    // @ts-expect-error private method
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20VariableIncentive);
  });

  test('can automatically instantiate ERC20PeggedIncentive given an address', async () => {
    const incentive = new ERC20PeggedIncentive(defaultOptions, {
      asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      peg: zeroAddress,
      limit: 1000000n,
      reward: 100000n,
    });
    // @ts-expect-error private method
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20PeggedIncentive);
  });

  test('can automatically instantiate ERC20VariableCriteriaIncentive (V1) given an address', async () => {
    const incentive = new ERC20VariableCriteriaIncentive(defaultOptions, {
      asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      limit: 1000000n,
      reward: 1000000n,
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature:
          pad("0xa9059cbb"),
        fieldIndex: 1,
        targetContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
    });
    // @ts-expect-error private method
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20VariableCriteriaIncentive);
  });

  test('can automatically instantiate ERC20VariableCriteriaIncentiveV2 given an address', async () => {
    const incentive = new ERC20VariableCriteriaIncentiveV2(defaultOptions, {
      asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      limit: 1000000n,
      reward: 1000000n,
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature:
          pad("0xa9059cbb"),
        fieldIndex: 1,
        targetContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        valueType: ValueType.WAD,
      },
    });
    // @ts-expect-error private method
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20VariableCriteriaIncentiveV2);
  });

  test('can automatically instantiate ERC20PeggedVariableCriteriaIncentive (V1) given an address', async () => {
    const incentive = new ERC20PeggedVariableCriteriaIncentive(defaultOptions, {
      asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      peg: zeroAddress,
      limit: 1000000n,
      reward: 1000000n,
      maxReward: 1000000n,
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature:
          pad("0xa9059cbb"),
        fieldIndex: 1,
        targetContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
    });
    // @ts-expect-error private method
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20PeggedVariableCriteriaIncentive);
  });

  test('can automatically instantiate ERC20PeggedVariableCriteriaIncentiveV2 given an address', async () => {
    const incentive = new ERC20PeggedVariableCriteriaIncentiveV2(defaultOptions, {
      asset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      peg: zeroAddress,
      limit: 1000000n,
      reward: 1000000n,
      maxReward: 1000000n,
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature:
          pad("0xa9059cbb"),
        fieldIndex: 1,
        targetContract: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        valueType: ValueType.WAD,
      },
    });
    // @ts-expect-error private method
    await incentive.deploy();
    expect(
      await incentiveFromAddress(
        defaultOptions,
        incentive.assertValidAddress(),
      ),
    ).toBeInstanceOf(ERC20PeggedVariableCriteriaIncentiveV2);
  });
});
