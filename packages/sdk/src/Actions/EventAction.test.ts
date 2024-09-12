import {
  mockErc20Abi,
  readAEventActionGetActionSteps,
  readEventActionGetActionStepsCount,
  readEventActionGetComponentInterface,
  readMockErc20BalanceOf,
  writeAEventActionPrepare,
} from '@boostxyz/evm';
import { selectors } from '@boostxyz/signatures/events';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { getClient } from '@wagmi/core';
import {
  ContractFunctionExecutionError,
  type Hex,
  encodeAbiParameters,
  encodeFunctionData,
  isAddress,
  parseEther,
  toFunctionSelector,
  zeroAddress,
} from 'viem';
import { call } from 'viem/actions';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC20 } from '../../test/MockERC20';
import type { MockERC721 } from '../../test/MockERC721';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundErc20,
  fundErc721,
} from '../../test/helpers';
import {
  type EventActionPayloadSimple,
  FilterType,
  PrimitiveType,
  SignatureType,
} from '../utils';
import { EventAction } from './EventAction';

let fixtures: Fixtures, erc721: MockERC721;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

function basicErc721TransferAction(
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.EVENT,
      signature: selectors['Transfer(address,address,uint256)'] as Hex,
      fieldIndex: 0,
      targetContract: erc721.assertValidAddress(),
    },
    actionSteps: [
      {
        signature: selectors['Transfer(address,address,uint256)'] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: erc721.assertValidAddress(),
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 0,
          filterData: defaultOptions.account.address,
        },
      },
    ],
  };
}

function cloneEventAction(fixtures: Fixtures, erc721: MockERC721) {
  return function cloneEventAction() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.EventAction(
        defaultOptions,
        basicErc721TransferAction(erc721),
      ),
    );
  };
}

describe.only('EventAction', () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
  });

  test('can successfully be deployed', async () => {
    const action = new EventAction(
      defaultOptions,
      basicErc721TransferAction(erc721),
    );
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can read action steps', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    console.log(action);
    console.log(
      await readAEventActionGetActionSteps(defaultOptions.config, {
        address: action.assertValidAddress(),
        args: [],
      }),
    );
    // const step = await action.getActionStepsCount();
    // console.log(step);
  });
});
