import type { Config } from '@wagmi/core';
import type { Address, WaitForTransactionReceiptParameters } from 'viem';
import { ContractAddressRequiredError } from '../errors';
import { type HashAndSimulatedResult, awaitResult } from '../utils';

/**
 * Description placeholder
 *
 * @export
 * @class Contract
 * @typedef {Contract}
 */
export class Contract {
  /**
   * Description placeholder
   *
   * @protected
   * @type {Config}
   */
  protected _config: Config;
  /**
   * Description placeholder
   *
   * @protected
   * @type {(Address | undefined)}
   */
  protected _address: Address | undefined;

  /**
   * Creates an instance of Contract.
   *
   * @constructor
   * @param {Config} config
   * @param {(Address | undefined)} address
   */
  constructor(config: Config, address: Address | undefined) {
    this._config = config;
    this._address = address;
  }

  /**
   * Description placeholder
   *
   * @public
   * @readonly
   * @type {*}
   */
  public get address() {
    return this._address;
  }

  /**
   * Description placeholder
   *
   * @public
   * @param {Address} address
   * @returns {this}
   */
  public at(address: Address) {
    this._address = address;
    return this;
  }

  /**
   * Description placeholder
   *
   * @public
   * @param {Config} config
   * @returns {this}
   */
  public withConfig(config: Config) {
    this._config = config;
    return this;
  }

  /**
   * Description placeholder
   *
   * @public
   * @returns {*}
   */
  public assertValidAddress() {
    const address = this.address;
    if (!address) throw new ContractAddressRequiredError();
    return address;
  }

  /**
   * Description placeholder
   *
   * @protected
   * @async
   * @template [Result=unknown]
   * @param {Promise<HashAndSimulatedResult<Result>>} hashPromise
   * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams]
   * @returns {unknown}
   */
  protected async awaitResult<Result = unknown>(
    hashPromise: Promise<HashAndSimulatedResult<Result>>,
    waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
  ) {
    return awaitResult(this._config, hashPromise, waitParams);
  }
}
