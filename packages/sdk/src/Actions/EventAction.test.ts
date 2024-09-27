import { selectors as eventSelectors } from '@boostxyz/signatures/events';
import { selectors as funcSelectors } from '@boostxyz/signatures/functions';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { type Hex, type Log, isAddress, pad, parseEther, toHex } from 'viem';
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
  EventAction,
  type EventActionPayloadSimple,
  FilterType,
  PrimitiveType,
  SignatureType,
} from './EventAction';

let fixtures: Fixtures, erc721: MockERC721, erc20: MockERC20;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures);
});

function basicErc721TransferAction(
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.EVENT,
      signature: eventSelectors['Transfer(address,address,uint256)'] as Hex,
      fieldIndex: 2,
      targetContract: erc721.assertValidAddress(),
      chainid: defaultOptions.config.chains[0].id,
    },
    actionSteps: [
      {
        signature: eventSelectors['Transfer(address,address,uint256)'] as Hex,
        signatureType: SignatureType.EVENT,
        targetContract: erc721.assertValidAddress(),
        chainid: defaultOptions.config.chains[0].id,
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 2,
          filterData: accounts[1].account,
        },
      },
    ],
  };
}

function cloneEventAction(fixtures: Fixtures, erc721: MockERC721) {
  return function cloneEventAction() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.EventAction(basicErc721TransferAction(erc721)),
    );
  };
}

function basicErc721MintFuncAction(
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.FUNC,
      signature: pad(funcSelectors['mint(address)'] as Hex),
      fieldIndex: 0,
      targetContract: erc721.assertValidAddress(),
      chainid: defaultOptions.config.chains[0].id,
    },
    actionSteps: [
      {
        signature: pad(funcSelectors['mint(address)'] as Hex),
        signatureType: SignatureType.FUNC,
        actionType: 0,
        targetContract: erc721.assertValidAddress(),
        chainid: defaultOptions.config.chains[0].id,
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 0,
          filterData: accounts[1].account,
        },
      },
    ],
  };
}

function basicErc20MintFuncAction(erc20: MockERC20): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.FUNC,
      signature: pad(funcSelectors['mint(address to, uint256 amount)'] as Hex),
      fieldIndex: 0,
      targetContract: erc20.assertValidAddress(),
      chainid: defaultOptions.config.chains[0].id,
    },
    actionSteps: [
      {
        signature: pad(
          funcSelectors['mint(address to, uint256 amount)'] as Hex,
        ),
        signatureType: SignatureType.FUNC,
        actionType: 0,
        targetContract: erc20.assertValidAddress(),
        chainid: defaultOptions.config.chains[0].id,
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 0,
          filterData: accounts[1].account,
        },
      },
    ],
  };
}

function cloneFunctionAction20(fixtures: Fixtures, erc20: MockERC20) {
  return function cloneFunctionAction20() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.EventAction(
        defaultOptions,
        basicErc20MintFuncAction(erc20),
      ),
    );
  };
}

function cloneFunctionAction(fixtures: Fixtures, erc721: MockERC721) {
  return function cloneFunctionAction() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.EventAction(
        defaultOptions,
        basicErc721MintFuncAction(erc721),
      ),
    );
  };
}

describe('EventAction Event Selector', () => {
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
      signature: eventSelectors['Transfer(address,address,uint256)'] as Hex,
      signatureType: SignatureType.EVENT,
      actionType: 0,
      targetContract: erc721.assertValidAddress().toUpperCase(),
      actionParameter: {
        filterType: FilterType.EQUAL,
        fieldType: PrimitiveType.ADDRESS,
        fieldIndex: 2,
        filterData: accounts[1].account.toUpperCase(),
      },
    });
  });

  test('can get all action steps', async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const steps = await action.getActionSteps();
    expect(steps.length).toBe(1);
    const step = steps[0]!;
    step.targetContract = step.targetContract.toUpperCase() as Hex;
    step.actionParameter.filterData =
      step.actionParameter.filterData.toUpperCase() as Hex;
    expect(step).toMatchObject({
      signature: eventSelectors['Transfer(address,address,uint256)'] as Hex,
      signatureType: SignatureType.EVENT,
      actionType: 0,
      targetContract: erc721.assertValidAddress().toUpperCase(),
      actionParameter: {
        filterType: FilterType.EQUAL,
        fieldType: PrimitiveType.ADDRESS,
        fieldIndex: 2,
        filterData: accounts[1].account.toUpperCase(),
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
      signature: eventSelectors['Transfer(address,address,uint256)'] as Hex,
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
    const recipient = accounts[1].account;
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

describe('EventAction Func Selector', () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
    erc20 = await loadFixture(fundErc20(defaultOptions));
  });

  test('can be deployed successfully', async () => {
    const action = new EventAction(
      defaultOptions,
      basicErc721MintFuncAction(erc721),
    );
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('validates function action step with correct hash', async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther('.1'),
    });

    expect(
      await action.isActionFunctionValid(actionSteps[0], {
        hash,
      }),
    ).toBe(true);
  });

  test('throws an error when hash is missing', async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    try {
      await action.isActionFunctionValid(actionSteps[0], {});
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe(
        'Hash is required for function validation',
      );
    }
  });

  test('validates function step with EQUAL filter', async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();

    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther('.1'),
    });

    const criteriaMatch = await action.isActionFunctionValid(actionSteps[0], {
      hash,
    });

    expect(criteriaMatch).toBe(true);
  });

  test('fails validation with incorrect function signature', async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const recipient = accounts[1].account;

    const invalidStep = {
      ...actionSteps[0],
      signature: pad(funcSelectors['mint(address to, uint256 amount)'] as Hex), // Intentional mismatch
    };

    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther('.1'),
    });

    try {
      await action.isActionFunctionValid(invalidStep, { hash });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain(
        'AbiFunctionSignatureNotFoundError',
      );
    }
  });

  test('validates against NOT_EQUAL filter criteria', async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    actionSteps[0].actionParameter.filterType = FilterType.NOT_EQUAL;
    const recipient = accounts[2].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther('.1'),
    });

    expect(
      await action.isActionFunctionValid(actionSteps[0], {
        hash,
      }),
    ).toBe(true);
  });

  test('validates GREATER_THAN criteria for numeric values', async () => {
    const action = await loadFixture(cloneFunctionAction20(fixtures, erc20));
    const actionSteps = await action.getActionSteps();

    actionSteps[0].actionParameter = {
      filterType: FilterType.GREATER_THAN,
      fieldType: PrimitiveType.UINT,
      fieldIndex: 1,
      filterData: toHex('1'),
    };

    const address = accounts[1].account;
    const value = 400n;
    const { hash } = await erc20.mintRaw(address, value);

    expect(
      await action.isActionFunctionValid(actionSteps[0], {
        hash,
      }),
    ).toBe(true);
  });

  test('validates LESS_THAN criteria for numeric values', async () => {
    const action = await loadFixture(cloneFunctionAction20(fixtures, erc20));
    const actionSteps = await action.getActionSteps();
    actionSteps[0].actionParameter = {
      filterType: FilterType.LESS_THAN,
      fieldType: PrimitiveType.UINT,
      fieldIndex: 1,
      filterData: toHex('5'),
    };

    const address = accounts[1].account;
    const value = 4n;
    const { hash } = await erc20.mintRaw(address, value);

    expect(
      await action.isActionFunctionValid(actionSteps[0], {
        hash,
      }),
    ).toBe(true);
  });

  test('validates entire flow of function action', async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther('.1'),
    });

    expect(
      await action.validateActionSteps({
        hash,
      }),
    ).toBe(true);
  });
});
