import {
  readSimpleDenyListIsAllowed,
  simpleDenyListAbi,
  simulateSimpleDenyListSetDenied,
  writeSimpleDenyListSetDenied,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { getAccount } from '@wagmi/core';
import { watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import {
  type AbiEvent,
  type Address,
  type ContractEventName,
  type GetLogsReturnType,
  type Hex,
  zeroAddress,
  zeroHash,
} from 'viem';
import { getLogs } from 'viem/actions';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import {
  type GenericLog,
  type GetLogsParams,
  type ReadParams,
  RegistryType,
  type SimpleDenyListPayload,
  type WatchParams,
  type WriteParams,
  prepareSimpleDenyListPayload,
} from '../utils';

export type { SimpleDenyListPayload };

/**
 * A record of `SimpleDenyList` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @export
 * @typedef {SimpleDenyListAbiEvents}
 * @template {ContractEventName<
 *     typeof simpleDenyListAbi
 *   >} [eventName=ContractEventName<typeof simpleDenyListAbi>]
 */
export type SimpleDenyListAbiEvents<
  eventName extends ContractEventName<
    typeof simpleDenyListAbi
  > = ContractEventName<typeof simpleDenyListAbi>,
> = {
  [name in eventName]: ExtractAbiEvent<typeof simpleDenyListAbi, name>;
};

/**
 * A record of `SimpleDenyList` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @type {SimpleDenyListAbiEvents}
 */
export const SimpleDenyListAbiEvents: SimpleDenyListAbiEvents = import.meta.env
  .SimpleDenyListAbiEvents;

/**
 * A generic `viem.Log` event with support for `SimpleDenyList` event types.
 *
 * @export
 * @typedef {SimpleDenyListEvent}
 * @template {ContractEventName<typeof simpleDenyListAbi>} [event=ContractEventName<
 *     typeof simpleDenyListAbi
 *   >]
 */
export type SimpleDenyListEvent<
  event extends ContractEventName<typeof simpleDenyListAbi> = ContractEventName<
    typeof simpleDenyListAbi
  >,
> = GenericLog<typeof simpleDenyListAbi, event>;

/**
 * A simple implementation of an AllowList that implicitly allows all addresses except those explicitly added to the deny list
 *
 * @export
 * @class SimpleDenyList
 * @typedef {SimpleDenyList}
 * @extends {DeployableTarget<SimpleDenyListPayload>}
 */
export class SimpleDenyList extends DeployableTarget<SimpleDenyListPayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_SIMPLE_DENYLIST_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ALLOW_LIST;

  /**
   * Check if a user is authorized (i.e. not denied)
   *
   * @public
   * @async
   * @param {Address} address - The address of the user
   * @param {?ReadParams<typeof simpleDenyListAbi, 'isAllowed'>} [params]
   * @returns {Promise<boolean>} - True if the user is authorized
   */
  public async isAllowed(
    address: Address,
    params?: ReadParams<typeof simpleDenyListAbi, 'isAllowed'>,
  ): Promise<boolean> {
    return await readSimpleDenyListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Set the denied status of a user. The length of the `users_` and `denied_` arrays must be the same. This function can only be called by the owner
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of users to update
   * @param {boolean[]} allowed - The denied status of each user
   * @param {?WriteParams<typeof simpleDenyListAbi, 'setDenied'>} [params]
   * @returns {unknown}
   */
  public async setDenied(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleDenyListAbi, 'setDenied'>,
  ) {
    return this.awaitResult(this.setDeniedRaw(addresses, allowed, params));
  }

  /**
   * Set the denied status of a user. The length of the `users_` and `denied_` arrays must be the same. This function can only be called by the owner
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of users to update
   * @param {boolean[]} allowed - The denied status of each user
   * @param {?WriteParams<typeof simpleDenyListAbi, 'setDenied'>} [params]
   * @returns {unknown}
   */
  public async setDeniedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleDenyListAbi, 'setDenied'>,
  ) {
    const { request, result } = await simulateSimpleDenyListSetDenied(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleDenyListSetDenied(this._config, request);
    return { hash, result };
  }

  /**
   * A typed wrapper for `viem.getLogs`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof simpleDenyListAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof simpleDenyListAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof simpleDenyListAbi, event>]
   * @template {| readonly AbiEvent[]
   *       | readonly unknown[]
   *       | undefined} [abiEvents=abiEvent extends AbiEvent ? [abiEvent] : undefined]
   * @param {?GetLogsParams<
   *       typeof simpleDenyListAbi,
   *       event,
   *       abiEvent,
   *       abiEvents
   *     > & {
   *       event?: abiEvent;
   *       events?: abiEvents;
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvents>>}
   */
  public async getLogs<
    event extends ContractEventName<typeof simpleDenyListAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof simpleDenyListAbi,
      event
    > = ExtractAbiEvent<typeof simpleDenyListAbi, event>,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  >(
    params?: GetLogsParams<
      typeof simpleDenyListAbi,
      event,
      abiEvent,
      abiEvents
    > & {
      event?: abiEvent;
      events?: abiEvents;
    },
  ): Promise<GetLogsReturnType<abiEvent, abiEvents>> {
    return getLogs(this._config.getClient({ chainId: params?.chainId }), {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
      ...(params as any),
      address: this.assertValidAddress(),
    });
  }

  /**
   * A typed wrapper for `wagmi.watchContractEvent`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof simpleDenyListAbi>} event
   * @param {(log: SimpleDenyListEvent<event>) => unknown} cb
   * @param {?WatchParams<typeof simpleDenyListAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   */
  public async subscribe<
    event extends ContractEventName<typeof simpleDenyListAbi>,
  >(
    cb: (log: SimpleDenyListEvent<event>) => unknown,
    params?: WatchParams<typeof simpleDenyListAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof simpleDenyListAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: simpleDenyListAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as SimpleDenyListEvent<event>);
        }
      },
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?SimpleDenyListPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: SimpleDenyListPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    if (!payload.owner || payload.owner === zeroAddress) {
      const owner = options.account
        ? options.account.address
        : options.config
          ? getAccount(options.config).address
          : this._account?.address;
      if (owner) {
        payload.owner = owner;
      } else {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }
    return {
      abi: simpleDenyListAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleDenyListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
