import type { Config } from '@wagmi/core';
import type { CreateSimulateContractReturnType } from '@wagmi/core/codegen';
import type {
  Abi,
  Address,
  ContractFunctionName,
  Hash,
  WaitForTransactionReceiptParameters,
} from 'viem';
import { ContractAddressRequiredError } from '../errors';
import { type HashAndSimulatedResult, awaitResult } from '../utils';

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

  protected async awaitResult<Result = unknown>(
    hashPromise: Promise<HashAndSimulatedResult<Result>>,
    waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
  ) {
    return awaitResult(this._config, hashPromise, waitParams);
  }
}
