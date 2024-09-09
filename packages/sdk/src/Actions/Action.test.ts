import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { zeroAddress, zeroHash } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import type { MockERC20 } from '../../test/MockERC20';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundErc20,
} from '../../test/helpers';
import { type ActionEvent, FilterType, PrimitiveType } from '../utils';
import { ContractAction } from './ContractAction';
import { ERC721MintAction } from './ERC721MintAction';
import { EventAction } from './EventAction';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

describe.only('Action', () => {
  test('should be able to instantiate a boost with a ContractAction', async () => {
    const action = new fixtures.bases.ContractAction(defaultOptions, {
      chainId: BigInt(31_337),
      target: fixtures.core.assertValidAddress(),
      selector: '0xdeadbeef',
      value: 0n,
    });
    const _boost = await freshBoost(fixtures, {
      action,
    });
    const boost = await fixtures.core.getBoost(_boost.id);
    expect(boost.action instanceof ContractAction).toBe(true);
  });

  test('should be able to instantiate a boost with an ERC721MintAction', async () => {
    const action = new fixtures.bases.ERC721MintAction(defaultOptions, {
      chainId: BigInt(31_337),
      target: fixtures.core.assertValidAddress(),
      selector: '0xdeadbeef',
      value: 0n,
    });
    const _boost = await freshBoost(fixtures, {
      action,
    });
    const boost = await fixtures.core.getBoost(_boost.id);
    expect(boost.action instanceof ERC721MintAction).toBe(true);
  });

  test('should be able to instantiate a boost with an EventAction', async () => {
    const actionEvent: ActionEvent = {
      eventSignature: '0xdeadbeef',
      actionType: 0,
      targetContract: zeroAddress,
      actionParameter: {
        filterType: FilterType.GREATER_THAN,
        fieldType: PrimitiveType.UINT,
        fieldIndex: 0,
        filterData: zeroHash,
      },
    };
    const action = new fixtures.bases.EventAction(defaultOptions, {
      actionEventOne: actionEvent,
      actionEventTwo: actionEvent,
      actionEventThree: actionEvent,
      actionEventFour: actionEvent,
    });
    const _boost = await freshBoost(fixtures, {
      action,
    });
    const boost = await fixtures.core.getBoost(_boost.id);
    expect(boost.action instanceof EventAction).toBe(true);
  });
});
