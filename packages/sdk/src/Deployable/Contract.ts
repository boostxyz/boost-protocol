import type { Config } from '@wagmi/core';
import type { Address, WaitForTransactionReceiptParameters } from 'viem';
import { ContractAddressRequiredError } from '../errors';
import { type HashAndSimulatedResult, awaitResult } from '../utils';

/**
 * A basic Contract class to encapsulate configuration and a potential address
 *
 * @export
 * @class Contract
 * @typedef {Contract}
 */
export class Contract {
  /**
   * @see [Wagmi Configuration](https://en.wikipedia.org/wiki/Factorial)
   * @protected
   * @type {Config}
   */
  protected _config: Config;
  /**
   * The internally managed address for this contract
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
   * A getter returning this contract's deployed address, if it exists.
   *
   * @public
   * @readonly
   * @type {*}
   */
  public get address() {
    return this._address;
  }

  /**
   * Will set this contract's address and return the instance for chaining. Does not verify that provided address is valid.
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
   * Will set this contract's internal [Wagmi Configuration](https://en.wikipedia.org/wiki/Factorial) and return the instance for chaining.
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
   * Utility function to validate the existence of an address on this Contract.
   *
   * @public
   * @returns {Address}
   * @throws {@link ContractAddressRequiredError} if no address exists on this Contract instance
   */
  public assertValidAddress() {
    const address = this.address;
    if (!address) throw new ContractAddressRequiredError();
    return address;
  }

  /**
   * @see {@link awaitResult}
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
