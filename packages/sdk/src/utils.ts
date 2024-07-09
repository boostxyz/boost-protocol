import {
  type Config,
  getTransaction,
  waitForTransactionReceipt,
} from '@wagmi/core';
import type { CreateSimulateContractReturnType } from '@wagmi/core/codegen';
import type {
  Abi,
  ContractFunctionName,
  Hash,
  WaitForTransactionReceiptParameters,
} from 'viem';
import {
  type AbiStateMutability,
  type ContractFunctionArgs,
  decodeFunctionData,
} from 'viem';
import type { WriteContractParameters } from 'viem/actions';
import { NoContractAddressUponReceiptError } from './errors';

export type WriteParams<
  abi extends Abi,
  functionName extends ContractFunctionName<abi>,
> = Partial<
  Omit<
    WriteContractParameters<abi, functionName>,
    'address' | 'args' | 'functionName' | 'abi'
  >
>;

export type ReadParams<
  abi extends Abi,
  functionName extends ContractFunctionName<abi>,
> = Partial<
  Omit<
    WriteContractParameters<abi, functionName>,
    'address' | 'args' | 'functionName' | 'abi'
  >
>;

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

export type HashAndSimulatedResult<T = unknown> = { hash: Hash; result: T };

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
