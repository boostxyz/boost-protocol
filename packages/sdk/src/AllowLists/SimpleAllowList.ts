import {
  readSimpleAllowListIsAllowed,
  readSimpleAllowListOwner,
  simpleAllowListAbi,
  simulateSimpleAllowListSetAllowed,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { getAccount } from '@wagmi/core';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
  zeroHash,
} from 'viem';
import { SimpleAllowList as SimpleAllowListBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  DeployableTargetWithRBAC,
  Roles,
} from '../Deployable/DeployableTargetWithRBAC';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { simpleAllowListAbi };

/**
 * Object representation of a {@link SimpleAllowList} initialization payload.
 *
 * @export
 * @interface SimpleAllowListPayload
 * @typedef {SimpleAllowListPayload}
 */
export interface SimpleAllowListPayload {
  /**
   * The allow list's owner, given the {@link LIST_MANAGER_ROLE} role.
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of allowed addresses.
   *
   * @type {Address[]}
   */
  allowed: Address[];
}

/**
 * A generic `viem.Log` event with support for `SimpleAllowList` event types.
 *
 * @export
 * @typedef {SimpleAllowListLog}
 * @template {ContractEventName<
 *     typeof simpleAllowListAbi
 *   >} [event=ContractEventName<typeof simpleAllowListAbi>]
 */
export type SimpleAllowListLog<
  event extends ContractEventName<
    typeof simpleAllowListAbi
  > = ContractEventName<typeof simpleAllowListAbi>,
> = GenericLog<typeof simpleAllowListAbi, event>;

/**
 * A constant representing the list manager's role
 *
 * @deprecated use {@link Roles} instead
 * @type {1n}
 */
export const LIST_MANAGER_ROLE = Roles.MANAGER;
/**
 * A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
 *
 * @export
 * @class SimpleAllowList
 * @typedef {SimpleAllowList}
 * @extends {DeployableTargetWithRBAC<SimpleAllowListPayload>}
 */
export class SimpleAllowList extends DeployableTargetWithRBAC<
  SimpleAllowListPayload,
  typeof simpleAllowListAbi
> {
  public override readonly abi = simpleAllowListAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(SimpleAllowListBases as Record<number, Address>),
  };
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ALLOW_LIST;

  /**
   * Retrieves the owner
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>} - The address of the owner
   */
  public async owner(
    params?: ReadParams<typeof simpleAllowListAbi, 'owner'>,
  ): Promise<Address> {
    return await readSimpleAllowListOwner(this._config, {
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      address: this.assertValidAddress(),
      args: [],
    });
  }

  /**
   * Check if a user is authorized.
   *
   * @public
   * @async
   * @param {Address} address - The address of the user
   * @param {?ReadParams} [params]
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
   * @param {?ReadParams} [params]
   * @returns {Promise<void>}
   */
  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return await this.awaitResult(
      this.setAllowedRaw(addresses, allowed, params),
    );
  }

  /**
   * Set the allowed status of a user. The length of the `users_` and `allowed_` arrays must be the same.
   * This function can only be called by the owner
   *
   * @public
   * @async
   * @param {Address[]} addresses - The list of users to update
   * @param {boolean[]} allowed - The allowed status of each user
   * @param {?ReadParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
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

/**
 * Given a {@link SimpleAllowListPayload}, properly encode the initialization payload.
 *
 * @param {SimpleAllowListPayload} param0
 * @param {Address} param0.owner - The allow list's owner, given the {@link LIST_MANAGER_ROLE} role.
 * @param {Address[]} param0.allowed - List of allowed addresses.
 * @returns {Hex}
 */
export function prepareSimpleAllowListPayload({
  owner,
  allowed,
}: SimpleAllowListPayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'address[]', name: 'allowed' },
    ],
    [owner, allowed],
  );
}
