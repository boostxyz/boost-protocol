import {
  type Config,
  getTransaction,
  waitForTransactionReceipt,
} from '@wagmi/core';
import type { CreateSimulateContractReturnType } from '@wagmi/core/codegen';
import { type Abi, type Address, type Hash, decodeFunctionData } from 'viem';
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

  protected async awaitResult<A extends Abi, FunctionName extends string>(
    hashPromise: Promise<Hash>,
    abi: A,
    fn: CreateSimulateContractReturnType<A, undefined, FunctionName>,
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
      address: tx.to!,
      args,
      blockNumber: receipt.blockNumber,
    });
    return result;
  }
}
