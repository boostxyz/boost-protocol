import { type Config, waitForTransactionReceipt } from '@wagmi/core';
import type {
  Abi,
  ContractFunctionName,
  Hash,
  Hex,
  WaitForTransactionReceiptParameters,
} from 'viem';
import { isHex, keccak256, slice, toHex } from 'viem';
import type { WriteContractParameters } from 'viem/actions';
import { NoContractAddressUponReceiptError } from './errors';

/**
 * Helper type that encapsulates common writeContract parameters without fields like `abi`, `args`, `functionName`, `address` that are expected to be provided the API.
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
 * Helper type that encapsulates common readContract parameters without fields like `abi`, `args`, `functionName`, `address` that are expected to be provided the API.
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
    WriteContractParameters<abi, functionName>,
    'address' | 'args' | 'functionName' | 'abi'
  >
>;

/**
 * Helper utility to convert a string to a `bytes4` type
 *
 * @export
 * @param {string} input
 * @returns {*}
 */
export function bytes4(input: string) {
  return slice(isHex(input) ? keccak256(input) : keccak256(toHex(input)), 0, 4);
}

/**
 * Utility function to wait for a transaction receipt, and extract the contractAddress
 *
 * @export
 * @async
 * @param {Config} config - [Wagmi Configuration](https://wagmi.sh/core/api/createConfig)
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
 * @param {Config} config
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
