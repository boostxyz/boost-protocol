import {
  type Config,
  type ReadContractParameters,
  type WatchContractEventParameters,
  type WriteContractParameters,
  waitForTransactionReceipt,
} from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import { LibZip } from 'solady';
import type {
  Abi,
  AbiEvent,
  Address,
  ContractEventName,
  ContractFunctionName,
  GetLogsParameters,
  Hash,
  Hex,
  Log,
  PrivateKeyAccount,
  WaitForTransactionReceiptParameters,
} from 'viem';
import {
  encodeAbiParameters,
  isHex,
  keccak256,
  parseAbiParameters,
  slice,
  toHex,
  zeroAddress,
  zeroHash,
} from 'viem';
import { signTypedData } from 'viem/accounts';
import { ContractAction } from './Actions/ContractAction';
import { ERC721MintAction } from './Actions/ERC721MintAction';
import {
  LIST_MANAGER_ROLE,
  SimpleAllowList,
} from './AllowLists/SimpleAllowList';
import { SimpleDenyList } from './AllowLists/SimpleDenyList';
import { VestingBudget } from './Budgets/VestingBudget';
import type { ERC1155Incentive } from './Incentives/ERC1155Incentive';
import { SignerValidator } from './Validators/SignerValidator';
import { NoContractAddressUponReceiptError } from './errors';

/**
 * Helper type that encapsulates common writeContract parameters without fields like `abi`, `args`, `functionName`, `address` that are expected to be provided the SDK.
 * See (writeContract)[https://viem.sh/docs/contract/writeContract]
 *
 * @export
 * @typedef {WriteParams}
 * @template {Abi} abi
 * @template {ContractFunctionName<abi>} functionName
 */
export type WriteParams<
  abi extends Abi,
  functionName extends ContractFunctionName<abi>,
> = Partial<
  Omit<
    WriteContractParameters<abi, functionName>,
    'address' | 'args' | 'functionName' | 'abi'
  >
>;

/**
 * Helper type that encapsulates common readContract parameters without fields like `abi`, `args`, `functionName`, `address` that are expected to be provided the SDK.
 * See (readContract)[https://viem.sh/docs/contract/readContract]
 *
 * @export
 * @typedef {ReadParams}
 * @template {Abi} abi
 * @template {ContractFunctionName<abi>} functionName
 */
export type ReadParams<
  abi extends Abi,
  functionName extends ContractFunctionName<abi>,
> = Partial<
  Omit<
    ReadContractParameters<abi, functionName>,
    'address' | 'args' | 'functionName' | 'abi'
  >
>;

/**
 * Helper type that encapsulates common `watchContractEvent` parameters without fields like `address`, and `abi` that are expected to be provided the SDK.
 * See (watchContractEvent)[https://wagmi.sh/core/api/actions/watchContractEvent]
 *
 * @export
 * @typedef {WatchParams}
 * @template {Abi} abi
 * @template {ContractEventName<abi> | undefined} [eventName=undefined]
 */
export type WatchParams<
  abi extends Abi,
  eventName extends ContractEventName<abi> | undefined = undefined,
> = Partial<
  Omit<WatchContractEventParameters<abi, eventName>, 'address' | 'abi'>
>;

/**
 * Helper type that encapsulates common `getLogs` parameters without fields like `address` that are expected to be provided the SDK.
 * See (getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs]
 *
 * @export
 * @typedef {GetLogsParams}
 * @template {Abi} abi
 * @template {ContractEventName<abi>} event
 * @template {ExtractAbiEvent<abi, event>} [abiEvent=ExtractAbiEvent<abi, event>]
 * @template {| readonly AbiEvent[]
 *     | readonly unknown[]
 *     | undefined} [abiEvents=abiEvent extends AbiEvent ? [abiEvent] : undefined]
 */
export type GetLogsParams<
  abi extends Abi,
  event extends ContractEventName<abi>,
  abiEvent extends ExtractAbiEvent<abi, event> = ExtractAbiEvent<abi, event>,
  abiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
> = Partial<Omit<GetLogsParameters<abiEvent, abiEvents>, 'address'>> & {
  chainId?: number | undefined;
};

/**
 * A generic `viem.Log` event with typed `args` support via a given `Abi` and `ContractEventName`
 *
 * @export
 * @typedef {GenericLog}
 * @template {Abi} abi
 * @template {ContractEventName<abi>} [event=ContractEventName<abi>]
 */
export type GenericLog<
  abi extends Abi,
  event extends ContractEventName<abi> = ContractEventName<abi>,
> = Log<bigint, number, false, ExtractAbiEvent<abi, event>, false>;

/**
 * Helper utility to convert a string to a `bytes4` type
 *
 * @export
 * @param {string} input
 * @returns {Hex}
 */
export function bytes4(input: Hex) {
  return slice(isHex(input) ? keccak256(input) : keccak256(toHex(input)), 0, 4);
}

/**
 * Utility function to wait for a transaction receipt, and extract the contractAddress
 *
 * @export
 * @async
 * @param {WagmiConfig} config - [Wagmi Configuration](https://wagmi.sh/core/api/createConfig)
 * @param {Promise<Hash>} hash - A transaction hash promise
 * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams] - @see {@link WaitForTransactionReceiptParameters}
 * @returns {unknown}
 * @throws {@link NoContractAddressUponReceiptError} if no `contractAddress` exists after the transaction has been received
 */
export async function getDeployedContractAddress(
  config: Config,
  hash: Promise<Hash>,
  waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
) {
  const receipt = await waitForTransactionReceipt(config, {
    ...waitParams,
    hash: await hash,
  });
  if (!receipt.contractAddress)
    throw new NoContractAddressUponReceiptError(receipt);
  return receipt.contractAddress;
}

/**
 * Utility type to encapsulate a transaction hash, and the simulated result prior to submitting the transaction.
 *
 * @export
 * @typedef {HashAndSimulatedResult}
 * @template [T=unknown]
 */
export type HashAndSimulatedResult<T = unknown> = { hash: Hash; result: T };

/**
 * Helper function to wait for a transaction receipt given a hash promise.
 *
 * @export
 * @async
 * @template [Result=unknown]
 * @param {WagmiConfig} config
 * @param {Promise<HashAndSimulatedResult<Result>>} hashPromise
 * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams]
 * @returns {Promise<Result>}
 */
export async function awaitResult<Result = unknown>(
  config: Config,
  hashPromise: Promise<HashAndSimulatedResult<Result>>,
  waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
): Promise<Result> {
  const { hash, result } = await hashPromise;
  await waitForTransactionReceipt(config, {
    ...waitParams,
    hash,
  });
  return result;
}

/**
 * Enum encapsulating all the different types of targets used in the Boost V2 Protocol.
 *
 * @export
 * @enum {number}
 */
export enum RegistryType {
  ACTION = 0,
  ALLOW_LIST = 1,
  BUDGET = 2,
  INCENTIVE = 3,
  VALIDATOR = 4,
}

/**
 * Enum representing incentive disbursement strategies.
 *
 * @export
 * @enum {number}
 */
export enum StrategyType {
  POOL = 0,
  MINT = 1,
  RAFFLE = 2,
}

/**
 * Enum representing inventive disbursement strategies for {@link ERC1155Incentive}
 *
 * @export
 * @enum {number}
 */
export enum ERC1155StrategyType {
  POOL = 0,
  MINT = 1,
}

/**
 * Object representation of `BoostLib.Target` struct. Used for low level Boost creation operations.
 * This is used to pass the base contract and its initialization parameters in an efficient manner
 *
 * @export
 * @typedef {Target}
 */
export type Target = {
  isBase: boolean;
  instance: Address;
  parameters: Hex;
};

/*
 * Action Event Payloads
 */

/**
 * Filter types used to determine how criteria are evaluated.
 *
 * @export
 * @enum {number}
 */
export enum FilterType {
  EQUAL = 0,
  NOT_EQUAL = 1,
  GREATER_THAN = 2,
  LESS_THAN = 3,
  CONTAINS = 4,
}

/**
 * The primitive types supported for filtering.
 *
 * @export
 * @enum {number}
 */
export enum PrimitiveType {
  UINT = 0,
  ADDRESS = 1,
  BYTES = 2,
  STRING = 3,
}

/**
 * Object representation of a `Criteria` struct used in event actions.
 *
 * @export
 * @interface Criteria
 * @typedef {Criteria}
 */
export interface Criteria {
  /**
   * The filter type used in this criteria.
   *
   * @type {FilterType}
   */
  filterType: FilterType;
  /**
   * The primitive type of the field being filtered.
   *
   * @type {PrimitiveType}
   */
  fieldType: PrimitiveType;
  /**
   * The index in the logs argument array where the field is located.
   *
   * @type {number}
   */
  fieldIndex: number;
  /**
   * The filter data used for complex filtering.
   *
   * @type {Hex}
   */
  filterData: Hex;
}

/**
 * Object representation of an `ActionEvent` struct used in event actions.
 *
 * @export
 * @interface ActionEvent
 * @typedef {ActionEvent}
 */
export interface ActionEvent {
  /**
   * The signature of the event.
   *
   * @type {Hex}
   */
  eventSignature: Hex;
  /**
   * The type of action being performed.
   *
   * @type {number}
   */
  actionType: number;
  /**
   * The address of the target contract.
   *
   * @type {Address}
   */
  targetContract: Address;
  /**
   * The criteria used for this action event.
   *
   * @type {Criteria}
   */
  actionParameter: Criteria;
}

/**
 * Object representation of an `InitPayload` struct used to initialize event actions.
 *
 * @export
 * @interface EventActionPayload
 * @typedef {EventActionPayload}
 */
export interface EventActionPayload {
  /**
   * The first action event.
   *
   * @type {ActionEvent}
   */
  actionEventOne: ActionEvent;
  /**
   * The second action event.
   *
   * @type {ActionEvent}
   */
  actionEventTwo: ActionEvent;
  /**
   * The third action event.
   *
   * @type {ActionEvent}
   */
  actionEventThree: ActionEvent;
  /**
   * The fourth action event.
   *
   * @type {ActionEvent}
   */
  actionEventFour: ActionEvent;
}

/**
 * Function to properly encode an event action payload.
 *
 * @param {InitPayload} param0
 * @param {ActionEvent} param0.actionEventOne - The first action event to initialize.
 * @param {ActionEvent} param0.actionEventTwo - The second action event to initialize.
 * @param {ActionEvent} param0.actionEventThree - The third action event to initialize.
 * @param {ActionEvent} param0.actionEventFour - The fourth action event to initialize.
 * @returns {Hex}
 */
export const prepareEventActionPayload = ({
  actionEventOne,
  actionEventTwo,
  actionEventThree,
  actionEventFour,
}: EventActionPayload) => {
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'actionEventOne',
        components: [
          { type: 'bytes4', name: 'eventSignature' },
          { type: 'uint8', name: 'actionType' },
          { type: 'address', name: 'targetContract' },
          {
            type: 'tuple',
            name: 'actionParameter',
            components: [
              { type: 'uint8', name: 'filterType' },
              { type: 'uint8', name: 'fieldType' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'bytes', name: 'filterData' },
            ],
          },
        ],
      },
      {
        type: 'tuple',
        name: 'actionEventTwo',
        components: [
          { type: 'bytes4', name: 'eventSignature' },
          { type: 'uint8', name: 'actionType' },
          { type: 'address', name: 'targetContract' },
          {
            type: 'tuple',
            name: 'actionParameter',
            components: [
              { type: 'uint8', name: 'filterType' },
              { type: 'uint8', name: 'fieldType' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'bytes', name: 'filterData' },
            ],
          },
        ],
      },
      {
        type: 'tuple',
        name: 'actionEventThree',
        components: [
          { type: 'bytes4', name: 'eventSignature' },
          { type: 'uint8', name: 'actionType' },
          { type: 'address', name: 'targetContract' },
          {
            type: 'tuple',
            name: 'actionParameter',
            components: [
              { type: 'uint8', name: 'filterType' },
              { type: 'uint8', name: 'fieldType' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'bytes', name: 'filterData' },
            ],
          },
        ],
      },
      {
        type: 'tuple',
        name: 'actionEventFour',
        components: [
          { type: 'bytes4', name: 'eventSignature' },
          { type: 'uint8', name: 'actionType' },
          { type: 'address', name: 'targetContract' },
          {
            type: 'tuple',
            name: 'actionParameter',
            components: [
              { type: 'uint8', name: 'filterType' },
              { type: 'uint8', name: 'fieldType' },
              { type: 'uint8', name: 'fieldIndex' },
              { type: 'bytes', name: 'filterData' },
            ],
          },
        ],
      },
    ],
    [actionEventOne, actionEventTwo, actionEventThree, actionEventFour],
  );
};

/**
 * Object representation of the `ERC20Incentive.InitPayload`.
 *
 * @export
 * @interface ERC20IncentivePayload
 * @typedef {ERC20IncentivePayload}
 */
export interface ERC20IncentivePayload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The type of disbursement strategy for the incentive. `StrategyType.MINT` is not supported for `ERC20Incentives`
   *
   * @type {StrategyType}
   */
  strategy: StrategyType;
  /**
   * The amount of the asset to distribute.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * How many times can this incentive be claimed.
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * Object representing the payload for signing before validaton.
 *
 * @export
 * @interface SignerValidatorSignaturePayload
 * @typedef {SignerValidatorSignaturePayload}
 */
export interface SignerValidatorSignaturePayload {
  /**
   * The ID of the boost.
   *
   * @type {bigint}
   */
  boostId: bigint;
  /**
   * The ID of the incentive.
   *
   * @type {number}
   */
  incentiveQuantity: number;
  /**
   * The address of the claimant.
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The claim data.
   *
   * @type {Hex}
   */
  incentiveData: Hex;
}

// /**
//  * Function to properly encode a validation payload.
//  *
//  * @param {SignerValidatorValidatePayload} param0
//  * @param {Address} param0.signer - The address of the signer with which to validate.
//  * @param {Hex} param0.hash - The transaction 558 to associate with the validation.
//  * @param {Hex} param0.signature - The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer
//  * @param {Address} param0.validator - Address of the validator module.
//  * @returns {*}
//  */
// export const prepareSignerValidatorSignaturePayload = ({
//   boostId,
//   incentiveId,
//   claimant,
//   claimData,
//   validator,
//   chainId,
// }: SignerValidatorSignaturePayload) => {
//   const domain = {
//     name: 'SignerValidator',
//     version: '1',
//     chainId: chainId,
//     verifyingContract: validator,
//   };
//   return hashTypedData({
//     domain,
//     types: {
//       SignerValidatorData: [
//         { name: 'incentiveId', type: 'uint256' },
//         { name: 'claimant', type: 'address' },
//         { name: 'boostId', type: 'uint256' },
//         { name: 'claimData', type: 'bytes32' },
//       ],
//     },
//     primaryType: 'SignerValidatorData',
//     message: {
//       incentiveId,
//       claimant,
//       boostId,
//       claimData,
//     },
//   });
// };

/**
 * Object reprentation of a {@link SignerValidator} initialization payload
 *
 * @export
 * @interface SignerValidatorPayload
 * @typedef {SignerValidatorPayload}
 */
export interface SignerValidatorPayload {
  /**
   * The list of authorized signers. The first address in the list will be the initial owner of the contract.
   *
   * @type {Address[]}
   */
  signers: Address[];
  /**
   * The authorized caller of the {@link prepareSignerValidator} function
   * @type {Address}
   */
  validatorCaller: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @interface SignerValidatorValidatePayload
 * @typedef {SignerValidatorValidatePayload}
 */
export interface SignerValidatorValidatePayload {
  /**
   * The ID of the boost.
   *
   * @type {bigint}
   */
  boostId: bigint;
  /**
   * The ID of the incentive.
   *
   * @type {bigint}
   */
  incentiveId: bigint;
  /**
   * The address of the claimant.
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The claim data.
   *
   * @type {Hex}
   */
  claimData: Hex;
}

/**
 * Given a {@link SignerValidatorPayload}, properly encode the initialization payload.
 *
 * @param {SignerValidatorPayload} param0
 * @param {Address[]} param0.signers
 * @param {Address} param0.validatorCaller
 * @returns {Hex}
 */
export const prepareSignerValidatorPayload = ({
  signers,
  validatorCaller,
}: SignerValidatorPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address[]', name: 'signers' },
      { type: 'address', name: 'validatorCaller' },
    ],
    [signers, validatorCaller],
  );
};

/**
 * Object representation of a {@link BoostClaimData} initialization payload
 *
 * @export
 * @interface BoostClaimData
 * @typedef {BoostClaimData}
 */
export interface BoostClaimData {
  /**
   * The validator data.
   *
   * @type {Hex}
   */
  validatorData: Hex;

  /**
   * The incentive data.
   *
   * @type {Hex}
   */
  incentiveData: Hex;
}

/**
 * Given a {@link BoostClaimData}, properly encode the initialization payload.
 *
 * @param {BoostClaimData} param0
 * @param {Hex} param0.validatorData
 * @param {Hex} param0.incentiveData
 * @returns {Hex}
 */
export const prepareBoostClaimData = ({
  validatorData,
  incentiveData,
}: BoostClaimData) => {
  return encodeAbiParameters(
    [
      { type: 'bytes', name: 'validatorData' },
      { type: 'bytes', name: 'incentiveData' },
    ],
    [validatorData, incentiveData],
  );
};

/**
 * Object representation of a {@link SignerValidatorInputParams} initialization payload
 *
 * @export
 * @interface SignerValidatorInputParams
 * @typedef {SignerValidatorInputParams}
 */
export interface SignerValidatorInputParams {
  /**
   * The signer address.
   *
   * @type {Address}
   */
  signer: Address;

  /**
   * The signature data.
   *
   * @type {string}
   */
  signature: Hex;

  /**
   * The incentive quantity.
   *
   * @type {number}
   */
  incentiveQuantity: number;
}

/**
 * Given a {@link SignerValidatorInputParams}, properly encode the initialization payload.
 *
 * @param {SignerValidatorInputParams} param0
 * @param {Address} param0.signer
 * @param {Hex} param0.signature
 * @param {number} param0.incentiveQuantity
 * @returns {Hex}
 */
export const prepareSignerValidatorInputParams = ({
  signer,
  signature,
  incentiveQuantity,
}: SignerValidatorInputParams) => {
  return encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'SignerValidatorInputParams',
        components: [
          { type: 'address', name: 'signer' },
          { type: 'bytes', name: 'signature' },
          { type: 'uint8', name: 'incentiveQuantity' },
        ],
      },
    ],
    [{ signer, signature, incentiveQuantity }],
  );
};

/**
 * Signer Validator Claim Data Payload
 *
 * @export
 * @interface SignerValidatorClaimDataParams
 * @typedef {SignerValidatorClaimDataParams}
 */
export interface SignerValidatorClaimDataParams {
  /**
   * The signer with which to sign the input
   *
   * @type {{
   *     account: Address;
   *     key: Hex;
   *     privateKey: PrivateKeyAccount;
   *   }}
   */
  signer: {
    account: Address;
    key: Hex;
    privateKey: PrivateKeyAccount;
  };
  /**
   * The encoded data to provide the underlying incentive. You can use {@link prepareAllowListIncentivePayload}, {@link prepareCGDAIncentivePayload}, {@link prepareERC20IncentivePayload}, {@link prepareERC1155IncentivePayload}, or {@link preparePointsIncentivePayload}
   *
   * @type {Hex}
   */
  incentiveData: Hex;
  /**
   * The chain id to target
   *
   * @type {number}
   */
  chainId: number;
  /**
   * The address of the validator
   *
   * @type {Address}
   */
  validator: Address;
  /**
   * The incentive quantity.
   *
   * @type {number}
   */
  incentiveQuantity: number;
  /**
   * The address of the claimant
   *
   * @type {Address}
   */
  claimant: Address;
  /**
   * The ID of the boost
   *
   * @type {bigint}
   */
  boostId: bigint;
}

/**
 * Signer Validator Claim Data Payload Preparation
 *
 * @export
 * @async
 * @param {SignerValidatorClaimDataParams} param0
 * @param {{ account: Address; key: Hex; privateKey: PrivateKeyAccount; }} param0.signer
 * @param {Hex} param0.incentiveData
 * @param {number} param0.chainId
 * @param {Address} param0.validator
 * @param {number} param0.incentiveQuantity
 * @param {Address} param0.claimant
 * @param {bigint} param0.boostId
 * @returns {Promise<Hex>}
 */
export async function prepareSignerValidatorClaimDataPayload({
  signer,
  incentiveData,
  chainId,
  validator,
  incentiveQuantity,
  claimant,
  boostId,
}: SignerValidatorClaimDataParams): Promise<Hex> {
  const domain = {
    name: 'SignerValidator',
    version: '1',
    chainId: chainId,
    verifyingContract: validator,
  };
  const typedData = {
    domain,
    types: {
      SignerValidatorData: [
        { name: 'boostId', type: 'uint256' },
        { name: 'incentiveQuantity', type: 'uint8' },
        { name: 'claimant', type: 'address' },
        { name: 'incentiveData', type: 'bytes' },
      ],
    },
    primaryType: 'SignerValidatorData' as const,
    message: {
      boostId,
      incentiveQuantity,
      claimant,
      incentiveData: incentiveData,
    },
  };

  const trustedSignature = await signTypedData({
    ...typedData,
    privateKey: signer.key,
  });

  // Prepare the claim data payload using the new helper
  const validatorData = prepareSignerValidatorInputParams({
    signer: signer.account,
    signature: trustedSignature,
    incentiveQuantity, // Adjust incentive quantity as necessary
  });

  const boostClaimDataPayload = encodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'BoostClaimData',
        components: [
          { type: 'bytes', name: 'validatorData' },
          { type: 'bytes', name: 'incentiveData' },
        ],
      },
    ],
    [{ validatorData, incentiveData }],
  );

  return boostClaimDataPayload;
}

/**
 * Object representation of a {@link SimpleAllowList} initialization payload.
 *
 * @export
 * @interface SimpleAllowListPayload
 * @typedef {SimpleAllowListPayload}
 */
export interface SimpleAllowListPayload {
  /**
   * The allow list's owner, given the {@link LIST_MANAGER_ROLE} role.
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of allowed addresses.
   *
   * @type {Address[]}
   */
  allowed: Address[];
}

/**
 * Given a {@link SimpleAllowListPayload}, properly encode the initialization payload.
 *
 * @param {SimpleAllowListPayload} param0
 * @param {Address} param0.owner - The allow list's owner, given the {@link LIST_MANAGER_ROLE} role.
 * @param {Address[]} param0.allowed - List of allowed addresses.
 * @returns {Hex}
 */
export const prepareSimpleAllowListPayload = ({
  owner,
  allowed,
}: SimpleAllowListPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'address[]', name: 'allowed' },
    ],
    [owner, allowed],
  );
};

/**
 * Object representation of a {@link SimpleDenyList} initialization payload.
 *
 * @export
 * @interface SimpleDenyListPayload
 * @typedef {SimpleDenyListPayload}
 */
export interface SimpleDenyListPayload {
  /**
   * The allow list's owner
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of denied addresses.
   *
   * @type {Address[]}
   */
  denied: Address[];
}

/**
 * Given a {@link SimpleDenyListPayload}, properly encode the initialization payload.
 *
 * @param {SimpleDenyListPayload} param0
 * @param {Address} param0.owner - The allow list's owner
 * @param {Address[]} param0.denied - List of denied addresses.
 * @returns {Hex}
 */
export const prepareSimpleDenyListPayload = ({
  owner,
  denied,
}: SimpleDenyListPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'address[]', name: 'denied' },
    ],
    [owner, denied],
  );
};

/**
 * Object representation of `BoostCore.InitPayload` struct.
 *
 * @export
 * @interface BoostPayload
 * @typedef {BoostPayload}
 */
export interface BoostPayload {
  /**
   * Address to valid budget.
   *
   * @type {Address}
   */
  budget: Address;
  /**
   * Target for existing action, or base with initialization payload.
   *
   * @type {Target}
   */
  action: Target;
  /**
   * Target for existing validator, or base with initialization payload.
   *
   * @type {Target}
   */
  validator: Target;
  /**
   * Target for existing allowList, or base with initialization payload.
   *
   * @type {Target}
   */
  allowList: Target;
  /**
   * Targets for new incentives, with initialization payloads.
   *
   * @type {Target[]}
   */
  incentives: Target[];
  /**
   * The base protocol fee (in bps)
   *
   * @type {?bigint}
   */
  protocolFee?: bigint;
  /**
   * The base referral fee (in bps)
   *
   * @type {?bigint}
   */
  referralFee?: bigint;
  /**
   * Optional maximum amount of participants in the Boost.
   *
   * @type {?bigint}
   */
  maxParticipants?: bigint;
  /**
   * The owner of the Boost.
   *
   * @type {Address}
   */
  owner: Address;
}

/**
 * Given a valid {@link BoostPayload}, properly encode and compress the payload for use with `createBoost`
 *
 * @export
 * @param {BoostPayload} param0
 * @param {Address} param0.budget - Address to valid budget.
 * @param {Target} param0.action - Target for existing action, or base with initialization payload.
 * @param {Target} param0.validator - Target for existing validator, or base with initialization payload.
 * @param {Target} param0.allowList - Target for existing allowList, or base with initialization payload.
 * @param {Target[]} param0.incentives - Targets for new incentives, with initialization payloads.
 * @param {bigint} [param0.protocolFee=0n] - The base protocol fee (in bps)
 * @param {bigint} [param0.referralFee=0n] - The base referral fee (in bps)
 * @param {bigint} [param0.maxParticipants=0n] - Optional maximum amount of participants in the Boost.
 * @param {Address} param0.owner - The owner of the Boost.
 * @returns {Hex}
 */
export function prepareBoostPayload({
  budget,
  action,
  validator,
  allowList,
  incentives,
  protocolFee = 0n,
  referralFee = 0n,
  maxParticipants = 0n,
  owner,
}: BoostPayload): Hex {
  return LibZip.cdCompress(
    encodeAbiParameters(
      parseAbiParameters([
        'BoostPayload payload',
        'struct BoostPayload { address budget; Target action; Target validator; Target allowList; Target[] incentives; uint64 protocolFee; uint64 referralFee; uint256 maxParticipants; address owner; }',
        'struct Target { bool isBase; address instance; bytes parameters; }',
      ]),
      [
        {
          budget,
          action,
          validator,
          allowList,
          incentives,
          protocolFee,
          referralFee,
          maxParticipants,
          owner,
        },
      ],
    ),
  ) as Hex;
}

/**
 * Object representation of
 *
 * @export
 * @interface ERC1155Payload
 * @typedef {ERC1155Payload}
 */
export interface ERC1155Payload {
  /**
   * The ERC1155 token ID for the incentive
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * The amount to transfer
   *
   * @type {bigint}
   */
  amount: bigint;
}

/**
 * Given a token ID and amount, properly encode a `ERC1155Incentive.ERC1155Payload` for use with {@link ERC1155Incentive} initialization.
 *
 * @export
 * @param {ERC1155Payload} param0
 * @param {bigint} param0.tokenId - The ERC1155 token ID for the incentive
 * @param {bigint} param0.amount - The amount to transfer
 * @returns {Hex}
 */
export function prepareERC1155Payload({ tokenId, amount }: ERC1155Payload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'ERC1155Payload payload',
      'struct ERC1155Payload { uint256 tokenId; uint256 amount; bytes data; }',
    ]),
    [{ tokenId, amount, data: '0x' }],
  );
}

/**
 * The object representation of a `PointsIncentive.InitPayload`
 *
 * @export
 * @interface PointsIncentivePayload
 * @typedef {PointsIncentivePayload}
 */
export interface PointsIncentivePayload {
  /**
   * The address of the points contract
   *
   * @type {Address}
   */
  venue: Address;
  /**
   * The selector for the issuance function on the points contract
   *
   * @type {Hex}
   */
  selector: Hex;
  /**
   * The reward amount issued for each claim
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   *  The maximum number of claims that can be made (one per address)
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * Given a {@link PointsIncentivePayload}, properly encode a `PointsIncentive.InitPayload` for use with {@link PointsIncentive} initialization.
 *
 * @param {PointsIncentivePayload} param0
 * @param {Address} param0.venue - The address of the points contract
 * @param {Hex} param0.selector - The selector for the issuance function on the points contract
 * @param {bigint} param0.reward - The reward amount issued for each claim
 * @param {bigint} param0.limit -  The maximum number of claims that can be made (one per address)
 * @returns {*}
 */
export const preparePointsIncentivePayload = ({
  venue,
  selector,
  reward,
  limit,
}: PointsIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'venue' },
      { type: 'bytes4', name: 'selector' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
    ],
    [venue, selector, reward, limit],
  );
};

/**
 *  The configuration parameters for the CGDAIncentive
 *
 * @export
 * @interface CGDAParameters
 * @typedef {CGDAParameters}
 */
export interface CGDAParameters {
  /**
   * The amount to subtract from the current reward after each claim
   *
   * @type {bigint}
   */
  rewardDecay: bigint;
  /**
   * The amount by which the reward increases for each hour without a claim (continuous linear increase)
   *
   * @type {bigint}
   */
  rewardBoost: bigint;
  /**
   * The timestamp of the last claim
   *
   * @type {bigint}
   */
  lastClaimTime: bigint;
  /**
   * The current reward amount
   *
   * @type {bigint}
   */
  currentReward: bigint;
}

/**
 * The object representation of a `CGDAIncentive.InitPayload`
 *
 * @export
 * @interface CGDAIncentivePayload
 * @typedef {CGDAIncentivePayload}
 */
export interface CGDAIncentivePayload {
  /**
   * The address of the ERC20-like token
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The initial reward amount
   *
   * @type {bigint}
   */
  initialReward: bigint;
  /**
   * The amount to subtract from the current reward after each claim
   *
   * @type {bigint}
   */
  rewardDecay: bigint;
  /**
   * The amount by which the reward increases for each hour without a claim (continuous linear increase)
   *
   * @type {bigint}
   */
  rewardBoost: bigint;
  /**
   * The total budget for the incentive
   *
   * @type {bigint}
   */
  totalBudget: bigint;
}

/**
 * Given a {@link CGDAIncentivePayload}, properly encode a `CGDAIncentive.InitPayload` for use with {@link CGDAIncentive} initialization.
 *
 * @param {CGDAIncentivePayload} param0
 * @param {Address} param0.asset - The address of the ERC20-like token
 * @param {bigint} param0.initialReward - The initial reward amount
 * @param {bigint} param0.rewardDecay - The amount to subtract from the current reward after each claim
 * @param {bigint} param0.rewardBoost - The amount by which the reward increases for each hour without a claim (continuous linear increase)
 * @param {bigint} param0.totalBudget - The total budget for the incentive
 * @returns {Hex}
 */
export const prepareCGDAIncentivePayload = ({
  asset,
  initialReward,
  rewardDecay,
  rewardBoost,
  totalBudget,
}: CGDAIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint256', name: 'initialReward' },
      { type: 'uint256', name: 'rewardDecay' },
      { type: 'uint256', name: 'rewardBoost' },
      { type: 'uint256', name: 'totalBudget' },
    ],
    [asset, initialReward, rewardDecay, rewardBoost, totalBudget],
  );
};

/**
 * The object representation of a `ERC1155Incentive.InitPayload`
 *
 * @export
 * @interface ERC1155IncentivePayload
 * @typedef {ERC1155IncentivePayload}
 */
export interface ERC1155IncentivePayload {
  /**
   * The address of the `ERC1155` asset
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Should be `Strategy.POOL`
   *
   * @type {ERC1155StrategyType}
   */
  strategy: ERC1155StrategyType;
  /**
   * The token ID to target
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   *  The maximum number of claims that can be made (one per address)
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   *  Any extra data to accompany the claim, if applicable.
   *
   * @type {Hex}
   */
  extraData: Hex;
}

/**
 * Given a {@link ERC1155IncentivePayload}, properly encode a `ERC1155Incentive.InitPayload` for use with {@link ERC1155Incentive} initialization.
 *
 * @param {ERC1155IncentivePayload} param0
 * @param {Address} param0.asset - The address of the `ERC1155` asset
 * @param {ERC1155StrategyType} param0.strategy - Should be `Strategy.POOL`
 * @param {bigint} param0.tokenId - The token ID to target
 * @param {bigint} param0.limit -  The maximum number of claims that can be made (one per address)
 * @param {Hex} param0.extraData - Any extra data to accompany the claim, if applicable.
 * @returns {Hex}
 */
export const prepareERC1155IncentivePayload = ({
  asset,
  strategy,
  tokenId,
  limit,
  extraData,
}: ERC1155IncentivePayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'InitPayload payload',
      'struct InitPayload { address asset; uint8 strategy; uint256 tokenId; uint256 limit; bytes extraData; }',
    ]),
    [{ asset, strategy, tokenId, limit, extraData }],
  );
  // return encodeAbiParameters(
  //   [
  //     { type: 'address', name: 'asset' },
  //     { type: 'uint8', name: 'strategy' },
  //     { type: 'uint256', name: 'tokenId' },
  //     { type: 'uint256', name: 'limit' },
  //     { type: 'bytes', name: 'extraData' },
  //   ],
  //   [asset, strategy, tokenId, limit, extraData],
  // );
};

/**
 * The object representation of a `AllowListIncentive.InitPayload`
 *
 * @export
 * @interface AllowListIncentivePayload
 * @typedef {AllowListIncentivePayload}
 */
export interface AllowListIncentivePayload {
  /**
   * The address to the allowlist to add claimers to.
   *
   * @type {Address}
   */
  allowList: Address;
  /**
   *  The maximum number of claims that can be made (one per address)
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * Given a {@link AllowListIncentivePayload}, properly encode a `AllowListIncentive.InitPayload` for use with {@link AllowListIncentive} initialization.
 *
 * @param {AllowListIncentivePayload} param0
 * @param {Address} param0.allowList - The address to the allowlist to add claimers to.
 * @param {bigint} param0.limit -  The maximum number of claims that can be made (one per address)
 * @returns {Hex}
 */
export const prepareAllowListIncentivePayload = ({
  allowList,
  limit,
}: AllowListIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'allowList' },
      { type: 'uint256', name: 'limit' },
    ],
    [allowList, limit],
  );
};

/**
 * The object representation of a `ERC20Incentive.InitPayload`
 *
 * @export
 * @interface ERC20IncentivePayload
 * @typedef {ERC20IncentivePayload}
 */
export interface ERC20IncentivePayload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The type of disbursement strategy for the incentive. `StrategyType.MINT` is not supported for `ERC20Incentives`
   *
   * @type {StrategyType}
   */
  strategy: StrategyType;
  /**
   * The amount of the asset to distribute.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * How many times can this incentive be claimed.
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * Given a {@link ERC20IncentivePayload}, properly encode a `ERC20Incentive.InitPayload` for use with {@link ERC20Incentive} initialization.
 *
 * @param {ERC20IncentivePayload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {StrategyType} param0.strategy - The type of disbursement strategy for the incentive. `StrategyType.MINT` is not supported for `ERC20Incentives`
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @returns {*}
 */
export const prepareERC20IncentivePayload = ({
  asset,
  strategy,
  reward,
  limit,
}: ERC20IncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint8', name: 'strategy' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
    ],
    [asset, strategy, reward, limit],
  );
};

/**
 * The object representation of a `ContractAction.InitPayload`
 *
 * @export
 * @interface ContractActionPayload
 * @typedef {ContractActionPayload}
 */
export interface ContractActionPayload {
  /**
   * The chain ID on which the target exists
   *
   * @type {bigint}
   */
  chainId: bigint;
  /**
   * The target contract address
   *
   * @type {Address}
   */
  target: Address;
  /**
   * The selector for the function to be called
   *
   * @type {Hex}
   */
  selector: Hex;
  /**
   * The native token value to send with the function call
   *
   * @type {bigint}
   */
  value: bigint;
}

/**
 * `ERC721MintActionPayload` is a re-exported `ContractActionPayload`
 *
 * @export
 * @typedef {ERC721MintActionPayload}
 */
export type ERC721MintActionPayload = ContractActionPayload;

/**
 * The object representation of a `SimpleBudgetPayload.InitPayload`
 *
 * @export
 * @interface SimpleBudgetPayload
 * @typedef {SimpleBudgetPayload}
 */
export interface SimpleBudgetPayload {
  /**
   * The budget's owner
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
   *
   * @type {Address[]}
   */
  authorized: Address[];
}

/**
 * Given a {@link SimpleBudgetPayload}, properly encode a `SimpleBudget.InitPayload` for use with {@link SimpleBudget} initialization.
 *
 * @param {SimpleBudgetPayload} param0
 * @param {Address} param0.owner - The budget's owner
 * @param {{}} param0.authorized - List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
 * @returns {*}
 */
export const prepareSimpleBudgetPayload = ({
  owner,
  authorized,
}: SimpleBudgetPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'SimpleBudgetPayload payload',
      'struct SimpleBudgetPayload { address owner; address[] authorized; }',
    ]),
    [{ owner, authorized }],
  );
};

/**
 * The object representation of a `VestingBudget.InitPayload`
 *
 * @export
 * @interface VestingBudgetPayload
 * @typedef {VestingBudgetPayload}
 */
export interface VestingBudgetPayload {
  /**
   * The budget's owner.
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
   *
   * @type {Address[]}
   */
  authorized: Address[];
  /**
   * The timestamp at which the vesting schedule begins
   *
   * @type {bigint}
   */
  start: bigint;
  /**
   * The duration of the vesting schedule (in seconds)
   *
   * @type {bigint}
   */
  duration: bigint;
  /**
   * The duration of the cliff period (in seconds)
   *
   * @type {bigint}
   */
  cliff: bigint;
}

/**
 * Given a {@link VestingBudgetPayload}, properly encode a `VestingBudget.InitPayload` for use with {@link VestingBudget} initialization.
 *
 * @param {VestingBudgetPayload} param0
 * @param {Address} param0.owner - The budget's owner.
 * @param {{}} param0.authorized - List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
 * @param {bigint} param0.start - The timestamp at which the vesting schedule begins
 * @param {bigint} param0.duration - The duration of the vesting schedule (in seconds)
 * @param {bigint} param0.cliff - The duration of the cliff period (in seconds)
 * @returns {Hex}
 */
export const prepareVestingBudgetPayload = ({
  owner,
  authorized,
  start,
  duration,
  cliff,
}: VestingBudgetPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'VestingBudgetPayload payload',
      'struct VestingBudgetPayload { address owner; address[] authorized; uint64 start; uint64 duration; uint64 cliff; }',
    ]),
    [{ owner, authorized, start, duration, cliff }],
  );
};

/**
 * Given a {@link ContractActionPayload}, properly encode a `ContractAction.InitPayload` for use with {@link ContractAction} initialization.
 *
 * @param {ContractActionPayload} param0
 * @param {bigint} param0.chainId - The chain ID on which the target exists
 * @param {Address} param0.target - The target contract address
 * @param {Hex} param0.selector - The selector for the function to be called
 * @param {bigint} param0.value - The native token value to send with the function call
 * @returns {Hex}
 */
export const prepareContractActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'ContractActionPayload payload',
      'struct ContractActionPayload { uint256 chainId; address target; bytes4 selector; uint256 value; }',
    ]),
    [{ chainId, target, selector, value }],
  );
};

/**
 * Given a {@link ContractActionPayload}, properly encode a `ContractAction.InitPayload` for use with {@link ERC721MintAction} initialization.
 *
 * @param {ContractActionPayload} param0
 * @param {bigint} param0.chainId - The chain ID on which the target exists
 * @param {Address} param0.target - The target contract address
 * @param {Hex} param0.selector - The selector for the function to be called
 * @param {bigint} param0.value - The native token value to send with the function call
 * @returns {*}
 */
export const prepareERC721MintActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return prepareContractActionPayload({ chainId, target, selector, value });
};

/**
 * The object representation of an `Incentive.ClaimPayload`
 *
 * @export
 * @interface ClaimPayload
 * @typedef {ClaimPayload}
 */
export interface ClaimPayload {
  /**
   * The address of the recipient
   *
   * @type {Address}
   */
  target: Address;
  /**
   * The implementation-specific data for the claim, if needed
   *
   * @type {?Hex}
   */
  data?: Hex;
}

/**
 * Given a valid {@link ClaimPayload}, encode the payload for use with Incentive operations.
 *
 * @param {ClaimPayload} param0
 * @param {Address} param0.target - The address of the recipient
 * @param {Hex} [param0.data=zeroHash] - The implementation-specific data for the claim, if needed
 * @returns {*}
 */
export const prepareClaimPayload = ({
  target,
  data = zeroHash,
}: ClaimPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    [target, data],
  );
};

/*
 * Transfer Payloads
 */

/**
 * The various types of assets supported in Budgets and Incentives.
 *
 * @export
 * @enum {number}
 */
export enum AssetType {
  ETH,
  ERC20,
  ERC1155,
}

/**
 * Object representation of a generic `Transfer` struct.
 *
 * @export
 * @interface TransferPayload
 * @typedef {TransferPayload}
 */
export interface TransferPayload {
  /**
   * The type of the asset being transferred.
   *
   * @type {AssetType}
   */
  assetType: AssetType;
  /**
   * The address of the asset to transfer, zero address for ETH.
   *
   * @type {Address}
   */
  address: Address;
  /**
   * The account from which to transfer the assets.
   *
   * @type {Address}
   */
  target: Address;
  /**
   * An encoded {@link FungiblePayload}, use {@link prepareFungiblePayload} to construct.
   *
   * @type {Hex}
   */
  data: Hex;
}

/**
 * Encodes parameters for transferring the transfer of Fungible and ERC1155 assets, used for {@link Budget} operations.
 * Typically you'd use {@link prepareFungibleTransfer} or {@link prepareERC1155Transfer}
 *
 * @param {TransferPayload} param0
 * @param {AssetType} param0.assetType - The asset type being transferred.
 * @param {Address} param0.address - The address of the asset, use zero address for ETH transfers.
 * @param {Address} param0.target - The address of the account being transferred from
 * @param {Hex} param0.data - Use {@link prepareFungiblePayload} to properly encode an amount to transfer
 * @returns {Hex}
 */
export const prepareTransferPayload = ({
  assetType,
  address,
  target,
  data,
}: TransferPayload) => {
  return encodeAbiParameters(
    [
      { type: 'uint8', name: 'assetType' },
      { type: 'address', name: 'asset' },
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    [assetType, address, target, data],
  );
};

/**
 * An object representation of the `Budget.Transfer` contract struct for transfers of ERC1155 assets.
 *
 * @export
 * @interface ERC1155TransferPayload
 * @typedef {ERC1155TransferPayload}
 */
export interface ERC1155TransferPayload {
  /**
   * The token ID to transfer
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * The amount to transfer
   *
   * @type {bigint}
   */
  amount: bigint;
  /**
   * The address of the asset to target
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The account to transfer from
   *
   * @type {Address}
   */
  target: Address;
}

/**
 * Encodes parameters for transferring the transfer of ERC1155 assets, used for {@link Budget} operations.
 * The caller must have already approved the contract to transfer the asset.
 *
 * @export
 * @param {ERC1155TransferPayload} param0
 * @param {bigint} param0.tokenId - The token ID to transfer
 * @param {bigint} param0.amount - The amount to transfer
 * @param {Address} param0.asset - The address of the asset to target
 * @param {Address} param0.target - The account to transfer from
 * @returns {Hex}
 */
export function prepareERC1155Transfer({
  tokenId,
  amount,
  asset,
  target,
}: ERC1155TransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: AssetType.ERC1155,
        asset,
        data: prepareERC1155Payload({ tokenId, amount }),
        target,
      },
    ],
  );
}

/**
 * An object representation of the `FungiblePayload` struct
 *
 * @export
 * @interface FungiblePayload
 * @typedef {FungiblePayload}
 */
export interface FungiblePayload {
  /**
   * The amount being transferred
   *
   * @type {bigint}
   */
  amount: bigint;
}

/**
 * Encodes an amount for the `FungiblePayload` struct
 *
 * @export
 * @param {FungiblePayload} param0
 * @param {bigint} param0.amount - The amount being transferred
 * @returns {*}
 */
export function prepareFungiblePayload({ amount }: FungiblePayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'FungiblePayload payload',
      'struct FungiblePayload { uint256 amount; }',
    ]),
    [{ amount }],
  );
}

/**
 * An object representation of the `Budget.Transfer` contract struct for transfers of fungible assets.
 *
 * @export
 * @interface FungibleTransferPayload
 * @typedef {FungibleTransferPayload}
 */
export interface FungibleTransferPayload {
  /**
   * The amount to transfer
   *
   * @type {bigint}
   */
  amount: bigint;
  /**
   * The address of the asset. Use zero address for ETH transfers.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The account to transfer from
   *
   * @type {Address}
   */
  target: Address;
}

/**
 * Encodes parameters for a Fungible transfer, used for Budget allocations.
 * The caller must have already approved the contract to transfer the asset.
 *
 * @export
 * @param {FungibleTransferPayload} param0
 * @param {bigint} param0.amount - The amount to transfer
 * @param {Address} param0.asset - The address of the asset. Use zero address for ETH transfers.
 * @param {Address} param0.target - The account to transfer from
 * @returns {Hex}
 */
export function prepareFungibleTransfer({
  amount,
  asset,
  target,
}: FungibleTransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: asset == zeroAddress ? AssetType.ETH : AssetType.ERC20,
        asset,
        data: prepareFungiblePayload({ amount }),
        target,
      },
    ],
  );
}

/**
 * Encodes a payload to validate that an action has been completed successfully.
 *
 *
 * @export
 * @param {Address} holder - The holder address
 * @param {bigint} payload - The token ID
 * @returns {Hex} - The first 20 bytes of the payload will be the holder address and the remaining bytes must be an encoded token ID (uint256)
 */
export function prepareERC721MintActionValidate(
  holder: Address,
  payload: bigint,
) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'holder' },
      { type: 'bytes', name: 'payload' },
    ],
    [holder, toHex(payload)],
  );
}
