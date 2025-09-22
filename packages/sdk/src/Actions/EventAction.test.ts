import { 
  selectors as eventSelectors, 
  abi as eventAbi,
 } from "@boostxyz/signatures/events";
import { selectors as funcSelectors } from "@boostxyz/signatures/functions";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {
  type AbiEvent,
  type Address,
  type Log,
  type Hex,
  isAddress,
  isAddressEqual,
  parseEther,
  toHex,
  zeroAddress,
  zeroHash,
} from "viem";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import type { MockERC20 } from "@boostxyz/test/MockERC20";
import type { MockERC721 } from "@boostxyz/test/MockERC721";
import { accounts } from "@boostxyz/test/accounts";
import {
  type Fixtures,
  type StringEmitterFixtures,
  defaultOptions,
  deployFixtures,
  fundErc20,
  deployStringEmitterMock,
  fundErc721,
} from "@boostxyz/test/helpers";
import {
  EventAction,
  type EventLogs,
  type EventActionPayloadSimple,
  FilterType,
  PrimitiveType,
  SignatureType,
  Criteria,
  anyActionParameter,
  transactionSenderClaimant,
  packFieldIndexes,
  unpackFieldIndexes,
  packClaimantFieldIndexes,
  decodeAndReorderLogArgs,
  ActionClaimant,
  getScalarValue,
} from "./EventAction";
import { allKnownSignatures } from "@boostxyz/test/allKnownSignatures";
import { getTransactionReceipt } from "@wagmi/core";

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

function basicErc721TransferActionWithEmptyActionParameter(erc721: MockERC721) {
  const eventActionPayload = basicErc721TransferAction(erc721);
  if (eventActionPayload.actionSteps[0]?.actionParameter) {
    eventActionPayload.actionSteps[0].actionParameter = anyActionParameter();
  }
  return eventActionPayload;
}

function cloneEventAction(
  fixtures: Fixtures,
  erc721: MockERC721,
  eventActionPayload = basicErc721TransferAction(erc721),
) {
  return function cloneEventAction() {
    return fixtures.registry.initialize(
      crypto.randomUUID(),
      fixtures.core.EventAction(eventActionPayload),
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

function basicErc721MintFuncActionWithEmptyActionParameter(erc721: MockERC721) {
  const eventActionPayload = basicErc721MintFuncAction(erc721);
  if (eventActionPayload.actionSteps[0]?.actionParameter) {
    eventActionPayload.actionSteps[0].actionParameter = anyActionParameter();
  }
  return eventActionPayload;
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

function cloneFunctionAction(
  fixtures: Fixtures,
  erc721: MockERC721,
  eventActionPayload = basicErc721MintFuncAction(erc721),
) {
  return function cloneFunctionAction() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.EventAction(defaultOptions, eventActionPayload),
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
  fieldIndex: number = 0,
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
      // @ts-expect-error
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
      const { hash } = await erc721.transferFromRaw(
        defaultOptions.account.address,
        recipient,
        1n,
      );
      expect(
        await action.validateActionSteps({
          hash,
          knownSignatures: allKnownSignatures,
        }),
      ).toBe(true);
    });

    test("can supply your own logs to validate against", async () => {
      const hash =
        "0xff0e6ab0c4961ec14b7b40afec83ed7d7a77582683512a262e641d21f82efea5";
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
      expect(
        await action.validateActionSteps({
          hash,
          logs,
          knownSignatures: allKnownSignatures,
        }),
      ).toBe(true);
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

        const hash =
          await stringEmitterFixtures.emitIndexedString("Hello world");
        await expect(() =>
          action.validateActionSteps({
            hash,
            knownSignatures: allKnownSignatures,
          }),
        ).rejects.toThrowError(/Parameter is not transparently stored onchain/);
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
        expect(
          await action.validateActionSteps({
            hash,
            knownSignatures: allKnownSignatures,
          }),
        ).toBe(true);
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
        expect(
          await action.validateActionSteps({
            hash,
            knownSignatures: allKnownSignatures,
          }),
        ).toBe(true);
      });
    });

    test("can derive a transaction sender claimant from an event action", async () => {
      const action = await loadFixture(
        cloneEventAction(fixtures, erc721, {
          ...basicErc721TransferAction(erc721),
          actionClaimant: transactionSenderClaimant(chainId),
        }),
      );
      const recipient = accounts[1].account;
      await erc721.approve(recipient, 1n);
      const { hash } = await erc721.transferFromRaw(
        defaultOptions.account.address,
        recipient,
        1n,
      );
      expect(
        isAddressEqual(
          (await action.deriveActionClaimantFromTransaction(
            await action.getActionClaimant(),
            {
              hash,
              knownSignatures: allKnownSignatures,
            },
          ))!,
          defaultOptions.account.address,
        ),
      ).toBe(true);
    });

    test("can derive the claimant from an event action", async () => {
      const action = await loadFixture(cloneEventAction(fixtures, erc721));
      const recipient = accounts[1].account;
      await erc721.approve(recipient, 1n);
      const { hash } = await erc721.transferFromRaw(
        defaultOptions.account.address,
        recipient,
        1n,
      );
      expect(
        await action.deriveActionClaimantFromTransaction(
          await action.getActionClaimant(),
          {
            hash,
            knownSignatures: allKnownSignatures,
          },
        ),
      ).toBe(recipient);
    });

    test("can derive the claimant from a function action", async () => {
      const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
      const recipient = accounts[1].account;
      const { hash } = await erc721.mintRaw(recipient, {
        value: parseEther(".1"),
      });

      expect(
        await action.deriveActionClaimantFromTransaction(
          await action.getActionClaimant(),
          {
            hash,
            knownSignatures: allKnownSignatures,
          },
        ),
      ).toBe(recipient);
    });

    test("can derive the claimant from a function action only if tx block number is gte than `notBeforeBlockNumber`", async () => {
      const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
      const recipient = accounts[1].account;
      const { hash } = await erc721.mintRaw(recipient, {
        value: parseEther(".1"),
      });

      const receipt = await getTransactionReceipt(defaultOptions.config, {
        hash,
      });

      expect(
        await action.deriveActionClaimantFromTransaction(
          await action.getActionClaimant(),
          {
            hash,
            knownSignatures: allKnownSignatures,
            notBeforeBlockNumber: 1n,
          },
        ),
      ).toBe(recipient);
      expect(
        await action.deriveActionClaimantFromTransaction(
          await action.getActionClaimant(),
          {
            hash,
            knownSignatures: allKnownSignatures,
            notBeforeBlockNumber: receipt.blockNumber,
          },
        ),
      ).toBe(recipient);
      expect(
        await action.deriveActionClaimantFromTransaction(
          await action.getActionClaimant(),
          {
            hash,
            knownSignatures: allKnownSignatures,
            notBeforeBlockNumber: receipt.blockNumber + 1n,
          },
        ),
      ).toBe(undefined);
      expect(
        await action.deriveActionClaimantFromTransaction(
          await action.getActionClaimant(),
          {
            hash,
            knownSignatures: allKnownSignatures,
            notBeforeBlockNumber: BigInt(Number.MAX_SAFE_INTEGER),
          },
        ),
      ).toBe(undefined);
    });

    test("validates empty actionParameter", async () => {
      const action = await loadFixture(
        cloneEventAction(
          fixtures,
          erc721,
          basicErc721TransferActionWithEmptyActionParameter(erc721),
        ),
      );
      const recipient = accounts[1].account;
      await erc721.approve(recipient, 1n);
      const { hash } = await erc721.transferFromRaw(
        defaultOptions.account.address,
        recipient,
        1n,
      );
      expect(
        await action.validateActionSteps({
          hash,
          knownSignatures: allKnownSignatures,
        }),
      ).toBe(true);
    });
  });
});

describe("validateFieldAgainstCriteria unit tests", () => {
  let action: EventAction;
  beforeAll(async () => {
    action = await loadFixture(cloneEventAction(fixtures, erc721));
  });
  const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";
  const mockInput = { decodedArgs: ["not used"] };

  test("should return true for EQUAL filter type with ADDRESS field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.EQUAL,
      PrimitiveType.ADDRESS,
      mockAddress,
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      mockAddress,
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return true for EQUAL filter type with UINT field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.EQUAL,
      PrimitiveType.UINT,
      "0xc8",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      200n,
      mockInput,
    );
    expect(result).toBe(true);
  });
  test("should return true for EQUAL filter type with STRING field type when values match", () => {
    // Decoded value: 'hello'
    const mockCriteria = createMockCriteria(
      FilterType.EQUAL,
      PrimitiveType.STRING,
      "0x68656c6c6f",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      "hello",
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return false for EQUAL filter type with STRING field type when values do not match", () => {
    // Decoded value: 'hello'
    const mockCriteria = createMockCriteria(
      FilterType.EQUAL,
      PrimitiveType.STRING,
      "0x68656c6c6f",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      "world",
      mockInput,
    );
    expect(result).toBe(false);
  });

  test("should return true for EQUAL filter type with BYTES field type when values match", () => {
    // Decoded value: '0x68656c6c6f' (hex for 'hello')
    const mockCriteria = createMockCriteria(
      FilterType.EQUAL,
      PrimitiveType.BYTES,
      "0x68656c6c6f",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      "0x68656c6c6f",
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return false for EQUAL filter type with BYTES field type when values do not match", () => {
    // Decoded value: '0x68656c6c6f' (hex for 'hello')
    const mockCriteria = createMockCriteria(
      FilterType.EQUAL,
      PrimitiveType.BYTES,
      "0x68656c6c6f",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      "0x776f726c64",
      mockInput,
    ); // hex for 'world'
    expect(result).toBe(false);
  });

  test("should return false for NOT_EQUAL filter type with ADDRESS field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.NOT_EQUAL,
      PrimitiveType.ADDRESS,
      mockAddress,
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      zeroAddress,
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return true for NOT_EQUAL filter type with UINT field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.NOT_EQUAL,
      PrimitiveType.UINT,
      "0xc9",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      200n,
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should throw InvalidNumericalCriteriaError for GREATER_THAN filter type with non-uint field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.GREATER_THAN,
      PrimitiveType.STRING,
      "0x100",
    );
    expect(() =>
      action.validateFieldAgainstCriteria(mockCriteria, "200", mockInput),
    ).toThrow("non-numerical criteria");
  });

  test("should return true for GREATER_THAN filter type with UINT field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.GREATER_THAN,
      PrimitiveType.UINT,
      "0x64",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      200n,
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return true for CONTAINS filter type with STRING field type", () => {
    // Decoded value: 'hello'
    const mockCriteria = createMockCriteria(
      FilterType.CONTAINS,
      PrimitiveType.STRING,
      "0x68656c6c6f",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      "hello world",
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return true for CONTAINS filter type with BYTES field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.CONTAINS,
      PrimitiveType.BYTES,
      "0xbeef",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      "0xdeadbeef",
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should throw FieldValueNotComparableError for CONTAINS filter type with non-string/bytes field type", () => {
    // Decoded value: 123
    const mockCriteria = createMockCriteria(
      FilterType.CONTAINS,
      PrimitiveType.UINT,
      "0x7b",
    );
    expect(() =>
      action.validateFieldAgainstCriteria(mockCriteria, 123n, mockInput),
    ).toThrow(/only .* bytes or string/);
  });

  test("should throw UnrecognizedFilterTypeError for unrecognized filter type", () => {
    const mockCriteria = createMockCriteria(
      8 as FilterType,
      PrimitiveType.STRING,
      "0x74657374",
    ); // Decoded value: 'test'
    expect(() =>
      action.validateFieldAgainstCriteria(mockCriteria, "test", mockInput),
    ).toThrow("Invalid FilterType");
  });

  test("should return true for LESS_THAN filter type with UINT field type", () => {
    // Decoded value: 200
    const mockCriteria = createMockCriteria(
      FilterType.LESS_THAN,
      PrimitiveType.UINT,
      "0xc8",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      100n,
      mockInput,
    );
    expect(result).toBe(true);
  });

  test("should return false for LESS_THAN filter type with UINT field type when value is greater", () => {
    // Decoded value: 100
    const mockCriteria = createMockCriteria(
      FilterType.LESS_THAN,
      PrimitiveType.UINT,
      "0x64",
    );
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      200n,
      mockInput,
    );
    expect(result).toBe(false);
  });

  test("should throw InvalidNumericalCriteriaError for LESS_THAN filter type with non-uint field type", () => {
    // Decoded value: 100
    const mockCriteria = createMockCriteria(
      FilterType.LESS_THAN,
      PrimitiveType.STRING,
      "0x64",
    );
    expect(() =>
      action.validateFieldAgainstCriteria(mockCriteria, "50", mockInput),
    ).toThrow("non-numerical");
  });

  test("should throw InvalidNumericalCriteriaError for LESS_THAN filter type with ADDRESS field type", () => {
    const mockCriteria = createMockCriteria(
      FilterType.LESS_THAN,
      PrimitiveType.ADDRESS,
      "0x1234567890abcdef1234567890abcdef12345678",
    );
    expect(() =>
      action.validateFieldAgainstCriteria(
        mockCriteria,
        "0x1234567890abcdef1234567890abcdef12345678",
        mockInput,
      ),
    ).toThrow("non-numerical");
  });

  test("should return true for anyActionParameter", async () => {
    const mockCriteria = anyActionParameter();
    const result = action.validateFieldAgainstCriteria(
      mockCriteria,
      zeroHash,
      mockInput,
    );
    expect(result).toBe(true);
  });
});

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
    // @ts-expect-error
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test("validates function action step with correct hash", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    expect(
      await action.isActionStepValid(actionStep, {
        hash,
        knownSignatures: allKnownSignatures,
      }),
    ).toBe(true);
  });

  test("validates event action step with `notBeforeBlockNumber` lower than tx blockNumber", async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    const criteriaMatch = await action.isActionStepValid(actionStep, {
      notBeforeBlockNumber: BigInt(Number.MAX_SAFE_INTEGER),
      hash,
      knownSignatures: allKnownSignatures,
    });

    expect(criteriaMatch).toBe(false);
  });

  test("validates event action step with `notBeforeBlockNumber` greater than/equal to tx blockNumber", async () => {
    const action = await loadFixture(cloneEventAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });
    const receipt = await getTransactionReceipt(defaultOptions.config, {
      hash,
    });

    const eqMatch = await action.isActionStepValid(actionStep, {
      notBeforeBlockNumber: receipt.blockNumber,
      hash,
      knownSignatures: allKnownSignatures,
    });

    expect(eqMatch).toBe(true);
    const gtMatch = await action.isActionStepValid(actionStep, {
      notBeforeBlockNumber: receipt.blockNumber - 1n,
      hash,
      knownSignatures: allKnownSignatures,
    });

    expect(gtMatch).toBe(true);
  });


  test("validates function action step with `notBeforeBlockNumber` lower than tx blockNumber", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    const criteriaMatch = await action.isActionStepValid(actionStep, {
      notBeforeBlockNumber: BigInt(Number.MAX_SAFE_INTEGER),
      hash,
      knownSignatures: allKnownSignatures,
    });

    expect(criteriaMatch).toBe(false);
  });

  test("validates function action step with `notBeforeBlockNumber` greater than/equal to tx blockNumber", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });
    const receipt = await getTransactionReceipt(defaultOptions.config, {
      hash,
    });

    const eqMatch = await action.isActionStepValid(actionStep, {
      notBeforeBlockNumber: receipt.blockNumber,
      hash,
      knownSignatures: allKnownSignatures,
    });

    expect(eqMatch).toBe(true);
    const gtMatch = await action.isActionStepValid(actionStep, {
      notBeforeBlockNumber: receipt.blockNumber - 1n,
      hash,
      knownSignatures: allKnownSignatures,
    });

    expect(gtMatch).toBe(true);
  });

  test("validates function step with EQUAL filter", async () => {
    const action = await loadFixture(cloneFunctionAction(fixtures, erc721));
    const actionSteps = await action.getActionSteps();
    const actionStep = actionSteps[0]!;
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    const criteriaMatch = await action.isActionStepValid(actionStep, {
      hash,
      knownSignatures: allKnownSignatures,
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
      await action.isActionStepValid(invalidStep, {
        hash,
        knownSignatures: allKnownSignatures,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain(
        'Failed to decode function data: Encoded function signature "0x6a627842"',
      );
    }
  });

  test("validates empty actionParameter", async () => {
    const action = await loadFixture(
      cloneFunctionAction(
        fixtures,
        erc721,
        basicErc721MintFuncActionWithEmptyActionParameter(erc721),
      ),
    );
    const recipient = accounts[1].account;
    const { hash } = await erc721.mintRaw(recipient, {
      value: parseEther(".1"),
    });

    expect(
      await action.validateActionSteps({
        hash,
        knownSignatures: allKnownSignatures,
      }),
    ).toBe(true);
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
        knownSignatures: allKnownSignatures,
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
        knownSignatures: allKnownSignatures,
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
        knownSignatures: allKnownSignatures,
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
        knownSignatures: allKnownSignatures,
      }),
    ).toBe(true);
  });
});

describe("Tuple & bitpacked fieldIndex support", () => {
  describe("packFieldIndexes / unpackFieldIndexes", () => {
    test("packs up to five indexes and unpacks them correctly", () => {
      const indexes = [0, 3, 5, 10, 63]; // sample indexes
      const packed = packFieldIndexes(indexes);
      const result = unpackFieldIndexes(packed);
      const resultIndexes = [0, 3, 5, 10]; // 63 is a terminator and won't be included since it triggers a break

      expect(result).toEqual(resultIndexes);
    });

    test("packs 3 indexes with the automatic addition of a terminator and unpacks them correctly", () => {
      const indexes = [0, 3, 5]; // sample indexes
      const packed = packFieldIndexes(indexes);
      const result = unpackFieldIndexes(packed);
      const resultIndexes = [0, 3, 5]; // should terminate on it's own even if a terminator isn't passed in

      expect(result).toEqual(resultIndexes);
    });

    test("throws if more than five indexes are provided", () => {
      expect(() => packFieldIndexes([1, 2, 3, 4, 5, 6])).toThrowError(
        "Can only pack up to 5 indexes.",
      );
    });

    test("throws if an index exceeds the max field index (63)", () => {
      // 64 is out of range
      expect(() => packFieldIndexes([64])).toThrowError(
        "Index 64 exceeds the maximum allowed value (63).",
      );
    });

    test("terminates on max-field-index in unpackFieldIndexes", () => {
      // 63 is used as a "terminator," so anything after 63 should be truncated
      // Example: [2, 63, 7] => We expect only [2] because 63 signals end
      const packed = packFieldIndexes([2, 63, 7]);
      const result = unpackFieldIndexes(packed);

      // we expect only [2], because 63 signals "stop"
      expect(result).toEqual([2]);
    });
  });

  describe("parseFieldFromAbi with TUPLE bitpacked indexes", () => {
    // We'll create a minimal EventAction or a direct call to parseFieldFromAbi
    // to show we can handle a TUPLE index that references nested components

    test("handles a single-level tuple with one sub-index", async () => {
      // Suppose we have a tuple param in index 0, with a single sub-field
      // We'll pack the indexes: [0, 0]
      // i.e. top-level param at index 0 is a tuple, then sub-field 0
      const tupleIndex = packFieldIndexes([0, 0]);

      // We'll construct a minimal event or function input ABI with 1 param: a tuple of [address].
      const abiInputs = [
        {
          type: "tuple",
          components: [{ type: "address" }],
        },
      ];

      // The actual values we decoded: array of one tuple => [ ["0x1234..."] ]
      const allArgs = [
        // param 0 is a tuple of length 1 => the "address"
        ["0x111122223333444455556666777788889999AaAa"],
      ];

      const action = new EventAction(
        defaultOptions,
        basicErc721MintFuncAction(erc721),
      );

      const { value, type } = action.parseFieldFromAbi(
        allArgs,
        tupleIndex, // bitpacked indexes
        abiInputs,
        PrimitiveType.TUPLE, // declared TUPLE
      );

      expect(type).toBe(PrimitiveType.ADDRESS);
      expect(value).toBe("0x111122223333444455556666777788889999AaAa");
    });

    test("handles deeper nested tuples with multiple sub-indexes", async () => {
      // Suppose param 1 is a tuple, inside that subcomponent 2 is also a tuple, etc.
      const tupleIndex = packFieldIndexes([1, 2, 0]); // for example

      // Our ABI might have 2 top-level params: param 0 is a normal uint, param 1 is a tuple
      // That tuple's 'components' has at least 3 fields, so we pick sub-field #2
      // that sub-field #2 might itself be a tuple with at least 1 field => sub-sub-field #0
      const abiInputs = [
        { type: "uint256" }, // param 0
        {
          type: "tuple",
          components: [
            { type: "address" }, // sub-field 0
            { type: "uint256" }, // sub-field 1
            {
              type: "tuple", // sub-field 2
              components: [{ type: "string" }], // sub-sub-field 0
            },
          ],
        },
      ];

      const allArgs = [
        123n, // param 0
        [
          "0x111122223333444455556666777788889999AaAa", // sub-field0
          999n, // sub-field1
          // sub-field2 => tuple
          ["hello world"], // sub-sub-field 0
        ],
      ];

      const action = new EventAction(
        defaultOptions,
        basicErc721MintFuncAction(erc721),
      );
      const { value, type } = action.parseFieldFromAbi(
        allArgs,
        tupleIndex,
        abiInputs,
        PrimitiveType.TUPLE, // We know it's a nested TUPLE
      );

      expect(type).toBe(PrimitiveType.STRING);
      expect(value).toBe("hello world");
    });

    test("throws if TUPLE indexes go out of range", async () => {
      const tupleIndex = packFieldIndexes([1, 2, 9]); // sub-field #9 doesn't exist
      const abiInputs = [
        { type: "uint256" },
        {
          type: "tuple",
          components: [
            { type: "address" },
            { type: "uint256" },
            {
              type: "tuple",
              components: [{ type: "string" }],
            },
          ],
        },
      ];
      const allArgs = [
        123n,
        [
          "0x111122223333444455556666777788889999AaAa",
          999n,
          ["hello world"],
        ],
      ];
      const action = new EventAction(
        defaultOptions,
        basicErc721MintFuncAction(erc721),
      );      
      expect(() =>
        action.parseFieldFromAbi(allArgs, tupleIndex, abiInputs, PrimitiveType.TUPLE),
      ).toThrowError("Failed to decode tuple: 9");
    });
  });
});

describe('decodeAndReorderLogArgs', () => {
  test('correctly reorders mixed indexed and non-indexed parameters', () => {
    const event = eventAbi[
      'Minted(address indexed,uint8,uint8,address indexed,(uint32,uint256,address,uint32,uint32,uint32,address,bool,uint256,uint256,uint256,uint256,uint256),uint256 indexed)'
    ] as AbiEvent;

    const log: Log = {
      address: "0x000000000001a36777f9930aaeff623771b13e70",
      blockHash: "0xf529b056439fb090e974a2567642500ede9b5632ddb3bc138e6bebdf18ce367a",
      blockNumber: 24706315n,
      data: "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000015a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000512b55b00d744fc2edb8474f223a7498c3e5a7ce00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000002c2ad68fd900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f8c501d9b0000000000000000000000000000000000000000000000000000000c9e86723e0000000000000000000000000000000000000000000000000000000000000000000",
      logIndex: 379,
      removed: false,
      topics: [
        "0x2a29f7402bd32f0e4bbe17d44be064f7f64d96ee174ed7cb27936d869bf9a888",
        "0x0000000000000000000000008bc2a882609060bf9b5c673af5d11795463b9230",
        "0x000000000000000000000000234d469154ed5cec5a8c22b186e4766d556702ff",
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      ],
      transactionHash: "0x604496c89be16e005314db89478c9999fc55aa95e8bbc6d5e8b2a26afc82abb7",
      transactionIndex: 110,
    };

    const result = decodeAndReorderLogArgs(event, log);

    expect(result.args[0]).toBe("0x8BC2A882609060Bf9b5C673aF5D11795463B9230");
    expect(result.args[1]).toBe(0);
    expect(result.args[2]).toBe(0);
    expect(result.args[3]).toBe("0x234d469154eD5cEC5A8C22b186e4766d556702ff");
    expect(Array.isArray(result.args[4]));
    expect(result.args[5]).toBe(0n);
  });

  test('correctly reorders mixed indexed and non-indexed parameters', () => {
    const event = eventAbi['NameRegistered(string,bytes32 indexed,address indexed,uint256)'] as AbiEvent;

    const log: Log = {
      address: "0x4ccb0bb02fcaba27e82a56646e81d8c5bc4119a5",
      blockHash: "0xd3756b6a35ebee1bfcf66b605dc3bd6fc85ca282ed94b190b25db4c6b3ef188a",
      blockNumber: 23536079n,
      data: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000693a2861000000000000000000000000000000000000000000000000000000000000000c626f6f73742d6d61747469650000000000000000000000000000000000000000",
      logIndex: 133,
      removed: false,
      topics: [
        "0x0667086d08417333ce63f40d5bc2ef6fd330e25aaaf317b7c489541f8fe600fa",
        "0x82de51675fd710fc7a247469e170340787130a61b84dc3446b63277e03e4abd9",
        "0x000000000000000000000000865c301c46d64de5c9b124ec1a97ef1efc1bcbd1"
      ],
      transactionHash: "0xbe54acb2ceb28e7eb962e09218d51ab3369139ac3fd782cacccf163f0daf1a08",
      transactionIndex: 26,
    };

    const result = decodeAndReorderLogArgs(event, log);

    expect(result.args[0]).toBe("boost-mattie");
    expect(result.args[1]).toBe("0x82de51675fd710fc7a247469e170340787130a61b84dc3446b63277e03e4abd9");
    expect(result.args[2]).toBe("0x865C301c46d64DE5c9B124Ec1a97eF1EFC1bcbd1");
    expect(result.args[3]).toBe(1765419105n);
  });

  test('works with events where params are already correctly ordered', () => {
    const event = eventAbi["BoostCreated(uint256 indexed,address indexed,address indexed,uint256,address,address,address)"] as AbiEvent;

    const log: Log = {
      address: "0xdcffce9d8185706780a46cf04d9c6b86b3451497",
      blockHash: "0xdfcbc66fc07d41321badb8f8afa3e8fea3f65e87791d3de1ad07d470b2ff1c8e",
      blockNumber: 7449080n,
      data: "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000e81490c0b9e625999c78f155c7bcf7f11f512b390000000000000000000000003322baef13ac75b1b1e25abc65c0df28f9e55670000000000000000000000000d1513f67da84dec0759f6a715bf28a637c7de716",
      logIndex: 141,
      removed: false,
      topics: [
        "0x116812d3ad4507d72f2c428b63246d594ca055a1dc119394285504c23d1f34cd",
        "0x000000000000000000000000000000000000000000000000000000000000006f",
        "0x0000000000000000000000000000c1e5c9d12c8c52eb319af11da44bb84779d2",
        "0x0000000000000000000000008b1646483aeedd894feb417da1f5a7ab1846e81e"
      ],
      transactionHash: "0xb23270a738440be31b2e6c2e1180324f04159d7bfd681564e877d8675fd8b5c2",
      transactionIndex: 79,
    };

    const result = decodeAndReorderLogArgs(event, log);

    expect(result.args[0]).toBe(111n);
    expect(result.args[1]).toBe("0x0000c1E5C9d12c8c52eb319AF11dA44bb84779d2");
    expect(result.args[2]).toBe("0x8B1646483aEedd894feB417dA1f5a7Ab1846E81E");
    expect(result.args[3]).toBe(1n);
    expect(result.args[4]).toBe("0xE81490c0b9e625999C78f155c7bCf7f11f512B39");
    expect(result.args[5]).toBe("0x3322BaEf13ac75B1b1E25Abc65c0dF28f9e55670");
    expect(result.args[6]).toBe("0xD1513f67da84DEc0759F6a715BF28A637c7de716");
  });

  test('works with events where there is no indexed params', () => {
    const event = eventAbi['Minted(uint8,address,uint256,uint256)'] as AbiEvent;

    const log: Log = {
      address: "0x45ecff1c647a32455ced5c21400fe61aa2be680b",
      blockHash: "0xc5b14f59a5bc89e6a6ecdd595d4d10d1dd82adc624a04717fdff78bbb9dac988",
      blockNumber: 24749935n,
      data: "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000865c301c46d64de5c9b124ec1a97ef1efc1bcbd1000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000014a4",
      logIndex: 188,
      removed: false,
      topics: [
        "0x7ac572687bf4e66a8514fc2ec464fc2644c78bcb1d80a225fc51a33e0ee38bfa"
      ],
      transactionHash: "0x0e4aba5edcbfff24d25290066b992ef5670a00864febe38ffaeb8cb1476faa96",
      transactionIndex: 42,
    };

    const result = decodeAndReorderLogArgs(event, log);

    expect(result.args[0]).toBe(1);
    expect(result.args[1]).toBe("0x865C301c46d64DE5c9B124Ec1a97eF1EFC1bcbd1");
    expect(result.args[2]).toBe(1n);
    expect(result.args[3]).toBe(5284n);
  });
}); 

describe("criteria field index tuple support", () => {
  test("extracts scalar value from single-level tuple", () => {
    const args = [123n, [456n, 789n], 999n];
    const fieldIndex = packFieldIndexes([1, 0]);
    const result = getScalarValue(args, fieldIndex);
    expect(result).toBe(456n);
  });

  test("extracts scalar value from two-level nested tuple", () => {
    const args = [
      100n,
      [
        200n,
        [300n, 400n, 500n],
        600n
      ],
      700n
    ];
    const fieldIndex = packFieldIndexes([1, 1, 2]);

    const result = getScalarValue(args, fieldIndex);
    expect(result).toBe(500n);
  });

  test("extracts scalar value from three-level nested tuple", () => {
    const args = [
      [
        [
          [111n, 222n],
          [333n, 444n]
        ],
        555n
      ],
      666n
    ];
    const fieldIndex = packFieldIndexes([0, 0, 1, 1]);

    const result = getScalarValue(args, fieldIndex);
    expect(result).toBe(444n);
  });

  test("extracts scalar value from four-level nested tuple (max depth)", () => {
    const args = [
      [
        [
          [
            [1n, 2n, 3n],
            [4n, 5n, 6n]
          ],
          [[7n, 8n], [9n, 10n]]
        ]
      ]
    ];
    const fieldIndex = packFieldIndexes([0, 0, 0, 1, 2]);

    const result = getScalarValue(args, fieldIndex);
    expect(result).toBe(6n);
  });

  test("throws error when field index unpacks to empty array", () => {
    const args = [123n, 456n];
    const fieldIndex = 0xFFFFFFF;

    expect(() => getScalarValue(args, fieldIndex)).toThrowError(
      "Failed to unpack any indexes from fieldIndex"
    );
  });

  test("throws error when accessing non-array at intermediate level", () => {
    const args = [123n, 456n, 789n];
    const fieldIndex = packFieldIndexes([1, 0]);

    expect(() => getScalarValue(args, fieldIndex)).toThrowError(
      "Expected array at level 1, but got bigint"
    );
  });

  test("throws error when index is out of bounds", () => {
    const args = [[100n, 200n], [300n]];
    const fieldIndex = packFieldIndexes([1, 5]);

    expect(() => getScalarValue(args, fieldIndex)).toThrowError(
      "Index 5 is out of bounds at level 1. Array length is 1"
    );
  });

  test("throws error when final value is not a bigint", () => {
    const args = [["hello", "world"], [123n, 456n]];
    const fieldIndex = packFieldIndexes([0, 0]);

    expect(() => getScalarValue(args, fieldIndex)).toThrowError(
      "Expected bigint at final position, but got string"
    );
  });

  test("handles direct field access (single index)", () => {
    const args = [111n, 222n, 333n];
    const fieldIndex = packFieldIndexes([2]);

    const result = getScalarValue(args, fieldIndex);
    expect(result).toBe(333n);
  });

  test("throws error for index exceeding max field index", () => {
    expect(() => packFieldIndexes([0, 64])).toThrowError(
      "Index 64 exceeds the maximum allowed value"
    );
  });
});

describe("claimant tuple field support", () => {
  describe("validateClaimantAgainstArgs with tuple access", () => {
    test("correctly extracts address from tuple field", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      // Test args with a tuple containing an address at position [2][1]
      const testArgs = [
        "0x1111111111111111111111111111111111111111",
        100n,
        ["0x2222222222222222222222222222222222222222", "0x3333333333333333333333333333333333333333", 500n],
        "test"
      ];

      // Test extracting from tuple at args[2][1]
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: packClaimantFieldIndexes([2, 1]),
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBe("0x3333333333333333333333333333333333333333");
    });

    test("returns undefined if tuple index is out of bounds", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      const testArgs = [
        "0x1111111111111111111111111111111111111111",
        ["0x2222222222222222222222222222222222222222"]
      ];

      // Try to access args[1][2] which doesn't exist
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: packClaimantFieldIndexes([1, 2]),
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBeUndefined();
    });

    test("returns undefined if first index is out of bounds", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      const testArgs = ["0x1111111111111111111111111111111111111111"];

      // Try to access args[5][0] where args[5] doesn't exist
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: packClaimantFieldIndexes([5, 0]),
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBeUndefined();
    });

    test("returns undefined if tuple field is not an address", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      const testArgs = [
        ["not-an-address", 123n, "test"]
      ];

      // Try to access args[0][0] which is not an address
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: packClaimantFieldIndexes([0, 0]),
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBeUndefined();
    });

    test("returns undefined if field at first index is not a tuple", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      const testArgs = [
        "0x1111111111111111111111111111111111111111",
        "not-a-tuple"
      ];

      // Try to access args[1][0] but args[1] is not an array
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: packClaimantFieldIndexes([1, 0]),
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBeUndefined();
    });

    test("still handles direct field access correctly", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      const testArgs = [
        "0x1111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222",
        100n
      ];

      // Direct access to args[1] (not a tuple index)
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: 1,
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBe("0x2222222222222222222222222222222222222222");
    });

    test("handles complex tuple with correct address", () => {
      const eventAction = new EventAction({ config: {} as any });
      
      // Complex nested structure
      const testArgs = [
        { someField: "data" },
        100n,
        [
          "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          ["nested", "data"],
          "0xcccccccccccccccccccccccccccccccccccccccc"
        ]
      ];

      // Access args[2][3] which is an address
      const claimant: ActionClaimant = {
        signatureType: SignatureType.EVENT,
        signature: zeroHash,
        fieldIndex: packClaimantFieldIndexes([2, 3]),
        targetContract: zeroAddress,
        chainid: 1
      };

      const result = eventAction.validateClaimantAgainstArgs(claimant, { args: testArgs });
      expect(result).toBe("0xcccccccccccccccccccccccccccccccccccccccc");
    });
  });
});
