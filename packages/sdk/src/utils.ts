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
 * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @param {string} input
 * @returns {*}
 */
export function bytes4(input: string) {
  return slice(isHex(input) ? keccak256(input) : keccak256(toHex(input)), 0, 4);
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {Config} config
 * @param {Promise<Hash>} hash
 * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams]
 * @returns {unknown}
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
 * Description placeholder
 *
 * @export
 * @typedef {HashAndSimulatedResult}
 * @template [T=unknown]
 */
export type HashAndSimulatedResult<T = unknown> = { hash: Hash; result: T };

/**
 * Description placeholder
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
