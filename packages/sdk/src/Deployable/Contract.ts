import {
  type Config,
  getTransaction,
  waitForTransactionReceipt,
} from '@wagmi/core';
import type { CreateSimulateContractReturnType } from '@wagmi/core/codegen';
import {
  type Abi,
  type AbiStateMutability,
  type Address,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type Hash,
  decodeFunctionData,
} from 'viem';
import { ContractAddressRequiredError } from '../errors';

export class Contract {
  protected _config: Config;
  protected _address: Address | undefined;

  constructor(config: Config, address: Address | undefined) {
    this._config = config;
    this._address = address;
  }

  public get address() {
    return this._address;
  }

  public at(address: Address) {
    this._address = address;
    return this;
  }

  public withConfig(config: Config) {
    this._config = config;
    return this;
  }

  protected assertValidAddress() {
    const address = this.address;
    if (!address) throw new ContractAddressRequiredError();
    return address;
  }

  protected async awaitResult<
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi>,
  >(
    hashPromise: Promise<Hash>,
    abi: abi,
    fn: CreateSimulateContractReturnType<abi, undefined, functionName>,
  ) {
    const hash = await hashPromise;
    const receipt = await waitForTransactionReceipt(this._config, {
      hash,
    });
    const tx = await getTransaction(this._config, { hash });
    const { args } = decodeFunctionData({
      abi,
      data: tx.input,
    });
    const { result } = await fn(this._config, {
      account: tx.from,
      address: tx.to,
      args: args as ContractFunctionArgs<abi, AbiStateMutability, functionName>,
      blockNumber: receipt.blockNumber,
      // biome-ignore lint/suspicious/noExplicitAny: TODO this is an extremely complex type, but this method is intended for internal use and as such is alright for now
    } as any);
    return result;
  }
}
