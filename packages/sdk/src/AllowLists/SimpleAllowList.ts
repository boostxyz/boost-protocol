import {
  readSimpleAllowListIsAllowed,
  simpleAllowListAbi,
  simulateSimpleAllowListGrantRoles,
  simulateSimpleAllowListSetAllowed,
  writeSimpleAllowListGrantRoles,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { getAccount, watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import {
  type Address,
  type ContractEventName,
  type GetLogsReturnType,
  type Hex,
  getAbiItem,
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
  type SimpleAllowListPayload,
  type WatchParams,
  prepareSimpleAllowListPayload,
} from '../utils';

export type { SimpleAllowListPayload };
export { simpleAllowListAbi };

/**
 * A generic `viem.Log` event with support for `SimpleAllowList` event types.
 *
 * @export
 * @typedef {SimpleAllowListEvent}
 * @template {ContractEventName<
 *     typeof simpleAllowListAbi
 *   >} [event=ContractEventName<typeof simpleAllowListAbi>]
 */
export type SimpleAllowListEvent<
  event extends ContractEventName<
    typeof simpleAllowListAbi
  > = ContractEventName<typeof simpleAllowListAbi>,
> = GenericLog<typeof simpleAllowListAbi, event>;

/**
 * A constant representing the list manager's role
 *
 * @type {2n}
 */
export const LIST_MANAGER_ROLE = 2n;
/**
 * A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
 *
 * @export
 * @class SimpleAllowList
 * @typedef {SimpleAllowList}
 * @extends {DeployableTarget<SimpleAllowListPayload>}
 */
export class SimpleAllowList extends DeployableTarget<SimpleAllowListPayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_SIMPLE_ALLOWLIST_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ALLOW_LIST;

  /**
   * Check if a user is authorized.
   *
   * @public
   * @async
   * @param {Address} address - The address of the user
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {Promise<boolean>} - True if the user is authorized
   */
  public async isAllowed(
    address: Address,
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ): Promise<boolean> {
    return await readSimpleAllowListIsAllowed(this._config, {
      address: this.assertValidAddress(),
      args: [address, zeroHash],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Set the allowed status of a user. The length of the `users_` and `allowed_` arrays must be the same.
   * This function can only be called by the owner
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of users to update
   * @param {boolean[]} allowed - The allowed status of each user
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {Promise<void>}
   */
  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return this.awaitResult(this.setAllowedRaw(addresses, allowed, params));
  }

  /**
   * Set the allowed status of a user. The length of the `users_` and `allowed_` arrays must be the same.
   * This function can only be called by the owner
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of users to update
   * @param {boolean[]} allowed - The allowed status of each user
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {Promise<void>}
   */
  public async setAllowedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    const { request, result } = await simulateSimpleAllowListSetAllowed(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleAllowListSetAllowed(this._config, request);
    return { hash, result };
  }

  /**
   * Allows the owner to grant `user` `roles`.
   *
   * @public
   * @async
   * @param {Address} address
   * @param {bigint} role
   * @param {?ReadParams<typeof simpleAllowListAbi, 'grantRoles'>} [params]
   * @returns {Promise<void>}
   */
  public async grantRoles(
    address: Address,
    role: bigint,
    params?: ReadParams<typeof simpleAllowListAbi, 'grantRoles'>,
  ) {
    return this.awaitResult(this.grantRolesRaw(address, role, params));
  }

  /**
   * Allows the owner to grant `user` `roles`.
   *
   * @public
   * @async
   * @param {Address} address
   * @param {bigint} role
   * @param {?ReadParams<typeof simpleAllowListAbi, 'grantRoles'>} [params]
   * @returns {Promise<void>}
   */
  public async grantRolesRaw(
    address: Address,
    role: bigint,
    params?: ReadParams<typeof simpleAllowListAbi, 'grantRoles'>,
  ) {
    const { request, result } = await simulateSimpleAllowListGrantRoles(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [address, role],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleAllowListGrantRoles(this._config, request);
    return { hash, result };
  }

  /**
   * A typed wrapper for (viem.getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs].
   * Accepts `eventName` and `eventNames` as optional parameters to narrow the returned log types.
   * @example
   * ```ts
   * const logs = contract.getLogs({ eventName: 'EventName' })
   * const logs = contract.getLogs({ eventNames: ['EventName'] })
   * ```
   * @public
   * @async
   * @template {ContractEventName<typeof simpleAllowListAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof simpleAllowListAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof simpleAllowListAbi, event>]
   * @param {?Omit<
   *       GetLogsParams<typeof simpleAllowListAbi, event, abiEvent, abiEvent[]>,
   *       'event' | 'events'
   *     > & {
   *       eventName?: event;
   *       eventNames?: event[];
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvent[]>>}
   */
  public async getLogs<
    event extends ContractEventName<typeof simpleAllowListAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof simpleAllowListAbi,
      event
    > = ExtractAbiEvent<typeof simpleAllowListAbi, event>,
  >(
    params?: Omit<
      GetLogsParams<typeof simpleAllowListAbi, event, abiEvent, abiEvent[]>,
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
              abi: simpleAllowListAbi,
              name: params.eventName,
              // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
            } as any),
          }
        : {}),
      ...(params?.eventNames
        ? {
            events: params.eventNames.map((name) =>
              getAbiItem({
                abi: simpleAllowListAbi,
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
   * @template {ContractEventName<typeof simpleAllowListAbi>} event
   * @param {(log: SimpleAllowListEvent<event>) => unknown} cb
   * @param {?WatchParams<typeof simpleAllowListAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   */
  public async subscribe<
    event extends ContractEventName<typeof simpleAllowListAbi>,
  >(
    cb: (log: SimpleAllowListEvent<event>) => unknown,
    params?: WatchParams<typeof simpleAllowListAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof simpleAllowListAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: simpleAllowListAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as SimpleAllowListEvent<event>);
        }
      },
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?SimpleAllowListPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: SimpleAllowListPayload,
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
      abi: simpleAllowListAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleAllowListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
