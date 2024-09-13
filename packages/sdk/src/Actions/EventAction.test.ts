import {
  readAActionGetComponentInterface,
  readEventActionGetComponentInterface,
} from '@boostxyz/evm';
import { selectors } from '@boostxyz/signatures/events';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { type Hex, type Log, isAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC721 } from '../../test/MockERC721';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
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
      fieldIndex: 2,
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
          fieldIndex: 2,
          filterData: accounts.at(1)!.account,
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

describe('EventAction', () => {
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

  test('can get an action step', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const step = await action.getActionStep(0);
    if (!step) throw new Error('there should be an action step at this index');
    step.targetContract = step.targetContract.toUpperCase() as Hex;
    step.actionParameter.filterData =
      step.actionParameter.filterData.toUpperCase() as Hex;
    expect(step).toMatchObject({
      signature: selectors['Transfer(address,address,uint256)'] as Hex,
      signatureType: SignatureType.EVENT,
      actionType: 0,
      targetContract: erc721.assertValidAddress().toUpperCase(),
      actionParameter: {
        filterType: FilterType.EQUAL,
        fieldType: PrimitiveType.ADDRESS,
        fieldIndex: 2,
        filterData: accounts.at(1)!.account.toUpperCase(),
      },
    });
  });

  test('can get all action steps', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const steps = await action.getActionSteps();
    expect(steps.length).toBe(1);
    const step = steps.at(0)!;
    step.targetContract = step.targetContract.toUpperCase() as Hex;
    step.actionParameter.filterData =
      step.actionParameter.filterData.toUpperCase() as Hex;
    expect(step).toMatchObject({
      signature: selectors['Transfer(address,address,uint256)'] as Hex,
      signatureType: SignatureType.EVENT,
      actionType: 0,
      targetContract: erc721.assertValidAddress().toUpperCase(),
      actionParameter: {
        filterType: FilterType.EQUAL,
        fieldType: PrimitiveType.ADDRESS,
        fieldIndex: 2,
        filterData: accounts.at(1)!.account.toUpperCase(),
      },
    });
  });

  test('can get the total number of action steps', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const count = await action.getActionStepsCount();
    expect(count).toBe(1);
  });

  test('can get the action claimant', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const claimant = await action.getActionClaimant();
    claimant.targetContract = claimant.targetContract.toUpperCase() as Hex;
    expect(claimant).toMatchObject({
      signatureType: SignatureType.EVENT,
      signature: selectors['Transfer(address,address,uint256)'] as Hex,
      fieldIndex: 2,
      targetContract: erc721.assertValidAddress().toUpperCase(),
    });
  });

  test('with no logs, does not validate', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    expect(await action.validateActionSteps()).toBe(false);
  });

  test('with a correct log, validates', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const recipient = accounts.at(1)!.account;
    await erc721.approve(recipient, 1n);
    await erc721.transferFrom(defaultOptions.account.address, recipient, 1n);
    expect(await action.validateActionSteps()).toBe(true);
  });

  test('can supply your own logs to validate against', async () => {
    const log = {
      eventName: 'Transfer',
      args: undefined,
      address: erc721.assertValidAddress(),
      blockHash:
        '0xbf602f988260519805d032be46d6ff97fbefbee6924b21097074d6d0bc34eced',
      blockNumber: 1203n,
      data: '0x',
      logIndex: 0,
      removed: false,
      topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        '0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8',
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      ],
      transactionHash:
        '0xff0e6ab0c4961ec14b7b40afec83ed7d7a77582683512a262e641d21f82efea5',
      transactionIndex: 0,
    } as Log;
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    expect(await action.validateActionSteps({ logs: [log] })).toBe(true);
  });
});
