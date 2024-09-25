import {
  type Config,
  type ReadContractParameters,
  type WatchContractEventParameters,
  type WriteContractParameters,
  waitForTransactionReceipt,
} from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import type {
  Abi,
  AbiEvent,
  ContractEventName,
  ContractFunctionName,
  GetLogsParameters,
  Hash,
  Hex,
  Log,
  WaitForTransactionReceiptParameters,
} from 'viem';
import { isHex, keccak256, slice, toHex } from 'viem';
import { NoContractAddressUponReceiptError } from './errors';

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

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
export function bytes4(input: string) {
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
