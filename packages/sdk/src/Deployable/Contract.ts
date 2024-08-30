import { type Config, watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import {
  type Abi,
  type Address,
  type ContractEventName,
  type GetLogsReturnType,
  type WaitForTransactionReceiptParameters,
  type WatchContractEventOnLogsParameter,
  getAbiItem,
} from 'viem';
import { getLogs } from 'viem/actions';
import { ContractAddressRequiredError } from '../errors';
import {
  type GetLogsParams,
  type HashAndSimulatedResult,
  type WatchParams,
  awaitResult,
} from '../utils';

/**
 * A basic Contract class to encapsulate configuration and a potential address
 *
 * @export
 * @class Contract
 * @typedef {Contract}
 * @template {Abi} [ContractAbi=[]]
 * @template {ContractEventName<ContractAbi>} [ContractEvent=any]
 */
export class Contract<ContractAbi extends Abi> {
  //@ts-expect-error this should always be set by implementing contract
  public readonly abi: ContractAbi;
  /**
   * @see [Wagmi Configuration](https://wagmi.sh/core/api/createConfig)
   * @protected
   * @type {WagmiConfig}
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
   * A typed wrapper for (viem.getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs].
   * Accepts `eventName` and `eventNames` as optional parameters to narrow the returned log types.
   * @example
   * ```ts
   * const logs = contract.getLogs({ eventName: 'EventName' })
   * const logs = contract.getLogs({ eventNames: ['EventName'] })
   *
   * @public
   * @async
   * @template {ContractEvent} event
   * @template {ExtractAbiEvent<
   *       ContractAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<ContractAbi, event>]
   * @param {?Omit<
   *       GetLogsParams<ContractAbi, event, abiEvent, abiEvent[]>,
   *       'event' | 'events'
   *     > & {
   *       eventName?: event;
   *       eventNames?: event[];
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvent[]>>}
   */
  public async getLogs<
    event extends ContractEventName<ContractAbi>,
    const abiEvent extends ExtractAbiEvent<
      ContractAbi,
      event
    > = ExtractAbiEvent<ContractAbi, event>,
  >(
    params?: Omit<
      GetLogsParams<ContractAbi, event, abiEvent, abiEvent[]>,
      'event' | 'events'
    > & {
      eventName?: event;
      eventNames?: event[];
    },
  ): Promise<GetLogsReturnType<abiEvent, abiEvent[]>> {
    return getLogs(this._config.getClient({ chainId: params?.chainId }), {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
      ...(params as any),
      ...(params?.eventName
        ? {
            event: getAbiItem({
              abi: this.abi,
              name: params.eventName,
              // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
            } as any),
          }
        : {}),
      ...(params?.eventNames
        ? {
            events: params.eventNames.map((name) =>
              getAbiItem({
                abi: this.abi,
                name,
                // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
              } as any),
            ),
          }
        : {}),
      address: this.assertValidAddress(),
    });
  }

  /**
   * A typed wrapper for `wagmi.watchContractEvent`
   *
   * @public
   * @async
   * @template {ContractEvent} event
   * @param {(
   *       log: WatchContractEventOnLogsParameter<ContractAbi, event, true>[number],
   *     ) => unknown} cb
   * @param {?WatchParams<ContractAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown}
   */
  public async subscribe<event extends ContractEventName<ContractAbi>>(
    cb: (
      log: WatchContractEventOnLogsParameter<ContractAbi, event, true>[number],
    ) => unknown,
    params?: WatchParams<ContractAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      ContractAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: this.abi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l);
        }
      },
    });
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
