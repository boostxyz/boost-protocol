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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type CallParams<T extends (_c: any, params: any) => any> = Omit<
  Parameters<T>[1],
  'address' | 'args'
>;

export async function awaitResult<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi>,
>(
  config: Config,
  hashPromise: Promise<Hash>,
  abi: abi,
  simulationFunction: CreateSimulateContractReturnType<
    abi,
    undefined,
    functionName
  >,
  waitParams: Omit<WaitForTransactionReceiptParameters, 'hash'> = {},
) {
  const hash = await hashPromise;
  const receipt = await waitForTransactionReceipt(config, {
    ...waitParams,
    hash,
  });
  const tx = await getTransaction(config, { hash });
  const { args } = decodeFunctionData({
    abi,
    data: tx.input,
  });
  const { result } = await simulationFunction(config, {
    account: tx.from,
    address: tx.to,
    args: args as ContractFunctionArgs<abi, AbiStateMutability, functionName>,
    blockNumber: receipt.blockNumber,
    // biome-ignore lint/suspicious/noExplicitAny: TODO this is an extremely complex type, but this method is intended for internal use and as such is alright for now
  } as any);
  return result;
}
