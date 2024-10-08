import { selectors as eventSelectors } from "@boostxyz/signatures/events";
import { selectors as funcSelectors } from "@boostxyz/signatures/functions";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  type AbiEvent,
  type Address,
  type GetLogsReturnType,
  type Hex,
  type Log,
  isAddress,
  pad,
  parseEther,
  toHex,
  zeroAddress,
} from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockERC20 } from '@boostxyz/test/MockERC20';
import type { MockERC721 } from '@boostxyz/test/MockERC721';
import { accounts } from '@boostxyz/test/accounts';
import {
  type Fixtures,
  type StringEmitterFixtures,
  defaultOptions,
  deployFixtures,
  fundErc20,
  deployStringEmitterMock,
  fundErc721,
} from '@boostxyz/test/helpers';
import {
  EventAction,
  type EventLogs,
  type EventActionPayloadSimple,
  FilterType,
  PrimitiveType,
  SignatureType,
  Criteria,
} from "./EventAction";

let fixtures: Fixtures,
  erc721: MockERC721,
  erc20: MockERC20,
  stringEmitterFixtures: StringEmitterFixtures;
let chainId: number;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
  stringEmitterFixtures = await loadFixture(deployStringEmitterMock);
  chainId = defaultOptions.config.chains[0].id;
});

function basicErc721TransferAction(
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.EVENT,
      signature: eventSelectors[
        "Transfer(address indexed,address indexed,uint256 indexed)"
      ] as Hex,
      fieldIndex: 1,
      targetContract: erc721.assertValidAddress(),
      chainid: chainId,
    },
    actionSteps: [
      {
        signature: eventSelectors[
          "Transfer(address indexed,address indexed,uint256 indexed)"
        ] as Hex,
        signatureType: SignatureType.EVENT,
        targetContract: erc721.assertValidAddress(),
        chainid: chainId,
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 1,
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
      signature: funcSelectors["mint(address)"] as Hex,
      fieldIndex: 0,
      targetContract: erc721.assertValidAddress(),
      chainid: chainId,
    },
    actionSteps: [
      {
        signature: funcSelectors["mint(address)"] as Hex,
        signatureType: SignatureType.FUNC,
        actionType: 0,
        targetContract: erc721.assertValidAddress(),
        chainid: chainId,
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
      signature: funcSelectors["mint(address to, uint256 amount)"] as Hex,
      fieldIndex: 0,
      targetContract: erc20.assertValidAddress(),
      chainid: chainId,
    },
    actionSteps: [
      {
        signature: funcSelectors["mint(address to, uint256 amount)"] as Hex,
        signatureType: SignatureType.FUNC,
        actionType: 0,
        targetContract: erc20.assertValidAddress(),
        chainid: chainId,
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

function indexedStringErc721TransferAction(
  filterType: FilterType,
  data: Hex,
  stringEmitterAddress: Address,
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.EVENT,
      signature: eventSelectors[
        "Transfer(address indexed,address indexed,uint256 indexed)"
      ] as Hex,
      fieldIndex: 1,
      targetContract: erc721.assertValidAddress(),
      chainid: chainId,
    },
    actionSteps: [
      {
        signature: eventSelectors[
          "InfoIndexed(address indexed,string indexed)"
        ] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: stringEmitterAddress,
        chainid: chainId,
        actionParameter: {
          filterType,
          fieldType: PrimitiveType.STRING,
          fieldIndex: 1,
          filterData: data,
        },
      },
    ],
  };
}

function stringErc721TransferAction(
  filterType: FilterType,
  data: Hex,
  stringEmitterAddress: Address,
  erc721: MockERC721,
): EventActionPayloadSimple {
  return {
    actionClaimant: {
      signatureType: SignatureType.EVENT,
      signature: eventSelectors[
        "Transfer(address indexed,address indexed,uint256 indexed)"
      ] as Hex,
      fieldIndex: 1,
      targetContract: erc721.assertValidAddress(),
      chainid: chainId,
    },
    actionSteps: [
      {
        signature: eventSelectors["Info(address,string)"] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: stringEmitterAddress,
        chainid: chainId,
        actionParameter: {
          filterType,
          fieldType: PrimitiveType.STRING,
          fieldIndex: 1,
          filterData: data,
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

function cloneStringEventAction(
  fixtures: Fixtures,
  actionParams: EventActionPayloadSimple,
) {
  return function loadFixtureCallback() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.EventAction(defaultOptions, actionParams),
    );
  };
}

function createMockCriteria(
  filterType: FilterType,
  fieldType: PrimitiveType,
  filterData: Hex,
  fieldIndex: number = 0
): Criteria {
  return {
    filterType,
    fieldType,
    filterData,
    fieldIndex,
  };
}

describe("EventAction Event Selector", () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
  });

  describe("basic transfer event", () => {
    test("can successfully be deployed", async () => {
      const action = new EventAction(
        defaultOptions,
        basicErc721TransferAction(erc721),
      );
      await action.deploy();
      expect(isAddress(action.assertValidAddress())).toBe(true);
    });

    test("can get an action step", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const step = await action.getActionStep(0);
      if (!step)
        throw new Error("there should be an action step at this index");
      step.targetContract = step.targetContract.toUpperCase() as Hex;
      step.actionParameter.filterData =
        step.actionParameter.filterData.toUpperCase() as Hex;
      expect(step).toMatchObject({
        signature: eventSelectors[
          "Transfer(address indexed,address indexed,uint256 indexed)"
        ] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: erc721.assertValidAddress().toUpperCase(),
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 1,
          filterData: accounts[1].account.toUpperCase(),
        },
      });
    });

    test("can get all action steps", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const steps = await action.getActionSteps();
      expect(steps.length).toBe(1);
      const step = steps[0]!;
      step.targetContract = step.targetContract.toUpperCase() as Hex;
      step.actionParameter.filterData =
        step.actionParameter.filterData.toUpperCase() as Hex;
      expect(step).toMatchObject({
        signature: eventSelectors[
          "Transfer(address indexed,address indexed,uint256 indexed)"
        ] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: erc721.assertValidAddress().toUpperCase(),
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 1,
          filterData: accounts[1].account.toUpperCase(),
        },
      });
    });

    test("can get the total number of action steps", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const count = await action.getActionStepsCount();
      expect(count).toBe(1);
    });

    test("can get the action claimant", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const claimant = await action.getActionClaimant();
      claimant.targetContract = claimant.targetContract.toUpperCase() as Hex;
      expect(claimant).toMatchObject({
        signatureType: SignatureType.EVENT,
        signature: eventSelectors[
          "Transfer(address indexed,address indexed,uint256 indexed)"
        ] as Hex,
        fieldIndex: 1,
      });
    });

    test("can get all action steps", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const steps = await action.getActionSteps();
      expect(steps.length).toBe(1);
      const step = steps[0]!;
      step.targetContract = step.targetContract.toUpperCase() as Hex;
      step.actionParameter.filterData =
        step.actionParameter.filterData.toUpperCase() as Hex;
      expect(step).toMatchObject({
        signature: eventSelectors[
          "Transfer(address indexed,address indexed,uint256 indexed)"
        ] as Hex,
        signatureType: SignatureType.EVENT,
        actionType: 0,
        targetContract: erc721.assertValidAddress().toUpperCase(),
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 1,
          filterData: accounts[1].account.toUpperCase(),
        },
      });
    });

    test("can get the total number of action steps", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const count = await action.getActionStepsCount();
      expect(count).toBe(1);
    });

    test("can get the action claimant", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const claimant = await action.getActionClaimant();
      claimant.targetContract = claimant.targetContract.toUpperCase() as Hex;
      expect(claimant).toMatchObject({
        signatureType: SignatureType.EVENT,
        signature: eventSelectors[
          "Transfer(address indexed,address indexed,uint256 indexed)"
        ] as Hex,
        fieldIndex: 1,
        targetContract: erc721.assertValidAddress().toUpperCase(),
      });
    });

    test("with a correct log, validates", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const recipient = accounts[1].account;
      await erc721.approve(recipient, 1n);
      const { hash } = await erc721.transferFromRaw(defaultOptions.account.address, recipient, 1n);
      expect(await action.validateActionSteps({ hash, chainId })).toBe(true);
    });

    test("can supply your own logs to validate against", async () => {
      const hash = "0xff0e6ab0c4961ec14b7b40afec83ed7d7a77582683512a262e641d21f82efea5"
      const logs: EventLogs = [
        {
          eventName: "Transfer",
          args: [
            "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            1n,
          ],
          address: erc721.assertValidAddress(),
          blockHash:
            "0xbf602f988260519805d032be46d6ff97fbefbee6924b21097074d6d0bc34eced",
          blockNumber: 1203n,
          data: "0x",
          logIndex: 0,
          removed: false,
          topics: [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266",
            "0x00000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c8",
            "0x0000000000000000000000000000000000000000000000000000000000000001",
          ],
          transactionHash:
            "0xff0e6ab0c4961ec14b7b40afec83ed7d7a77582683512a262e641d21f82efea5",
          transactionIndex: 0,
        },
      ];
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      expect(await action.validateActionSteps({ hash, chainId, logs })).toBe(true);
    });

    describe("string event actions", () => {
      test("cannot parse and validate contains for an emitted string event with an indexed param", async () => {
        const action = await loadFixture(
          cloneStringEventAction(
            fixtures,
            indexedStringErc721TransferAction(
              FilterType.CONTAINS,
              toHex("ello"),
              stringEmitterFixtures.address,
              erc721,
            ),
          ),
        );

        const hash = await stringEmitterFixtures.emitIndexedString("Hello world");
        await expect(() => action.validateActionSteps({ hash, chainId })).rejects.toThrowError(
          /Parameter is not transparently stored onchain/,
        );
      });
      test("can parse and validate contains for an emitted string event", async () => {
        const action = await loadFixture(
          cloneStringEventAction(
            fixtures,
            stringErc721TransferAction(
              FilterType.CONTAINS,
              toHex("ello"),
              stringEmitterFixtures.address,
              erc721,
            ),
          ),
        );
        const hash = await stringEmitterFixtures.emitString("Hello world");
        expect(await action.validateActionSteps({ hash, chainId })).toBe(true);
      });
      test("can parse and validate regex for an emitted string event", async () => {
        const action = await loadFixture(
          cloneStringEventAction(
            fixtures,
            stringErc721TransferAction(
              FilterType.REGEX,
              toHex("[hH]ello"),
              stringEmitterFixtures.address,
              erc721,
            ),
          ),
        );

        const hash = await stringEmitterFixtures.emitString("Hello world");
        expect(await action.validateActionSteps({ hash, chainId })).toBe(true);
      });
    });
  });
});

describe("validateFieldAgainstCriteria unit tests", () => {
  let action: EventAction
  beforeAll(async () => {
      action = await loadFixture(cloneEventAction(fixtures, erc721));
  });
  const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';
  const mockInput = { decodedArgs: ['not used'] };

  test('should return true for EQUAL filter type with ADDRESS field type', () => {
    const mockCriteria = createMockCriteria(FilterType.EQUAL, PrimitiveType.ADDRESS, mockAddress);
    const result = action.validateFieldAgainstCriteria(mockCriteria, mockAddress, mockInput);
    expect(result).toBe(true);
  });

  test('should return true for EQUAL filter type with UINT field type', () => {
    const mockCriteria = createMockCriteria(FilterType.EQUAL, PrimitiveType.UINT, '0xc8');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 200n, mockInput);
    expect(result).toBe(true);
  });
  test('should return true for EQUAL filter type with STRING field type when values match', () => {
    // Decoded value: 'hello'
    const mockCriteria = createMockCriteria(FilterType.EQUAL, PrimitiveType.STRING, '0x68656c6c6f');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 'hello', mockInput);
    expect(result).toBe(true);
  });

  test('should return false for EQUAL filter type with STRING field type when values do not match', () => {
    // Decoded value: 'hello'
    const mockCriteria = createMockCriteria(FilterType.EQUAL, PrimitiveType.STRING, '0x68656c6c6f');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 'world', mockInput);
    expect(result).toBe(false);
  });

  test('should return true for EQUAL filter type with BYTES field type when values match', () => {
    // Decoded value: '0x68656c6c6f' (hex for 'hello')
    const mockCriteria = createMockCriteria(FilterType.EQUAL, PrimitiveType.BYTES, '0x68656c6c6f');
    const result = action.validateFieldAgainstCriteria(mockCriteria, '0x68656c6c6f', mockInput);
    expect(result).toBe(true);
  });

  test('should return false for EQUAL filter type with BYTES field type when values do not match', () => {
    // Decoded value: '0x68656c6c6f' (hex for 'hello')
    const mockCriteria = createMockCriteria(FilterType.EQUAL, PrimitiveType.BYTES, '0x68656c6c6f');
    const result = action.validateFieldAgainstCriteria(mockCriteria, '0x776f726c64', mockInput); // hex for 'world'
    expect(result).toBe(false);
  });

  test('should return false for NOT_EQUAL filter type with ADDRESS field type', () => {
    const mockCriteria = createMockCriteria(FilterType.NOT_EQUAL, PrimitiveType.ADDRESS, mockAddress);
    const result = action.validateFieldAgainstCriteria(mockCriteria, zeroAddress, mockInput);
    expect(result).toBe(true);
  });

  test('should return true for NOT_EQUAL filter type with UINT field type', () => {
    const mockCriteria = createMockCriteria(FilterType.NOT_EQUAL, PrimitiveType.UINT, '0xc9');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 200n, mockInput);
    expect(result).toBe(true);
  });

  test('should throw InvalidNumericalCriteriaError for GREATER_THAN filter type with non-uint field type', () => {
    const mockCriteria = createMockCriteria(FilterType.GREATER_THAN, PrimitiveType.STRING, '0x100');
    expect(() => action.validateFieldAgainstCriteria(mockCriteria, '200', mockInput)).toThrow('non-numerical criteria');
  });

  test('should return true for GREATER_THAN filter type with UINT field type', () => {
    const mockCriteria = createMockCriteria(FilterType.GREATER_THAN, PrimitiveType.UINT, '0x64');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 200n, mockInput);
    expect(result).toBe(true);
  });

  test('should return true for CONTAINS filter type with STRING field type', () => {
    // Decoded value: 'hello'
    const mockCriteria = createMockCriteria(FilterType.CONTAINS, PrimitiveType.STRING, '0x68656c6c6f');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 'hello world', mockInput);
    expect(result).toBe(true);
  });

  test('should return true for CONTAINS filter type with BYTES field type', () => {
    const mockCriteria = createMockCriteria(FilterType.CONTAINS, PrimitiveType.BYTES, '0xbeef');
    const result = action.validateFieldAgainstCriteria(mockCriteria, '0xdeadbeef', mockInput);
    expect(result).toBe(true);
  });

  test('should throw FieldValueNotComparableError for CONTAINS filter type with non-string/bytes field type', () => {
    // Decoded value: 123
    const mockCriteria = createMockCriteria(FilterType.CONTAINS, PrimitiveType.UINT, '0x7b');
    expect(() => action.validateFieldAgainstCriteria(mockCriteria, 123n, mockInput)).toThrow(/only .* bytes or string/);
  });

  test('should throw UnrecognizedFilterTypeError for unrecognized filter type', () => {
    const mockCriteria = createMockCriteria(6 as FilterType, PrimitiveType.STRING, '0x74657374'); // Decoded value: 'test'
    expect(() => action.validateFieldAgainstCriteria(mockCriteria, 'test', mockInput)).toThrow('Invalid FilterType');
  });

  test('should return true for LESS_THAN filter type with UINT field type', () => {
    // Decoded value: 200
    const mockCriteria = createMockCriteria(FilterType.LESS_THAN, PrimitiveType.UINT, '0xc8');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 100n, mockInput);
    expect(result).toBe(true);
  });

  test('should return false for LESS_THAN filter type with UINT field type when value is greater', () => {
    // Decoded value: 100
    const mockCriteria = createMockCriteria(FilterType.LESS_THAN, PrimitiveType.UINT, '0x64');
    const result = action.validateFieldAgainstCriteria(mockCriteria, 200n, mockInput);
    expect(result).toBe(false);
  });

  test('should throw InvalidNumericalCriteriaError for LESS_THAN filter type with non-uint field type', () => {
    // Decoded value: 100
    const mockCriteria = createMockCriteria(FilterType.LESS_THAN, PrimitiveType.STRING, '0x64');
    expect(() => action.validateFieldAgainstCriteria(mockCriteria, '50', mockInput)).toThrow('non-numerical');
  });

  test('should throw InvalidNumericalCriteriaError for LESS_THAN filter type with ADDRESS field type', () => {
    const mockCriteria = createMockCriteria(FilterType.LESS_THAN, PrimitiveType.ADDRESS, '0x1234567890abcdef1234567890abcdef12345678');
    expect(() => action.validateFieldAgainstCriteria(mockCriteria, '0x1234567890abcdef1234567890abcdef12345678', mockInput)).toThrow('non-numerical');
  });

})

describe("EventAction Func Selector", () => {
  beforeEach(async () => {
    erc721 = await loadFixture(fundErc721(defaultOptions));
    erc20 = await loadFixture(fundErc20(defaultOptions));
  });

  test("can be deployed successfully", async () => {
    const action = new EventAction(
      defaultOptions,
      basicErc721MintFuncAction(erc721),
    );
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("validates function action step with correct hash", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    expect(
      await action.isActionStepValid(actionStep, { hash, chainId })
    ).toBe(true);
  });

  test("validates function step with EQUAL filter", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    const criteriaMatch = await action.isActionStepValid(actionStep, {
      hash,
      chainId,
    });

    expect(criteriaMatch).toBe(true);
  });

  test("fails validation with incorrect function signature", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;

    const invalidStep = {
      ...actionStep,
      signature: funcSelectors["mint(address to, uint256 amount)"] as Hex, // Intentional mismatch
    };

    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    try {
      await action.isActionStepValid(invalidStep, { hash, chainId });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain(
        'Failed to decode function data: Encoded function signature "0x6a627842"',
      );
    }
  });

  test("validates against NOT_EQUAL filter criteria", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    actionStep.actionParameter.filterType = FilterType.NOT_EQUAL;
    const recipient = accounts[2].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    expect(
      await action.isActionStepValid(actionStep, {
        hash,
        chainId,
      }),
    ).toBe(true);
  });

  test("validates GREATER_THAN criteria for numeric values", async () => {
    const action = await loadFixture(cloneFunctionAction20(fixtures, erc20));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;

    actionStep.actionParameter = {
      filterType: FilterType.GREATER_THAN,
      fieldType: PrimitiveType.UINT,
      fieldIndex: 1,
      filterData: toHex("1"),
    };

    const address = accounts[1].account;
    const value = 400n;
    const { hash } = await erc20.mintRaw(address, value);

    expect(
      await action.isActionStepValid(actionStep, {
        hash,
        chainId,
      }),
    ).toBe(true);
  });

  test("validates LESS_THAN criteria for numeric values", async () => {
    const action = await loadFixture(cloneFunctionAction20(fixtures, erc20));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    actionStep.actionParameter = {
      filterType: FilterType.LESS_THAN,
      fieldType: PrimitiveType.UINT,
      fieldIndex: 1,
      filterData: toHex("5"),
    };

    const address = accounts[1].account;
    const value = 4n;
    const { hash } = await erc20.mintRaw(address, value);

    expect(
      await action.isActionStepValid(actionStep, {
        hash,
        chainId,
      }),
    ).toBe(true);
  });

  test("validates entire flow of function action", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    expect(
      await action.validateActionSteps({
        hash,
        chainId,
      }),
    ).toBe(true);
  });
});
