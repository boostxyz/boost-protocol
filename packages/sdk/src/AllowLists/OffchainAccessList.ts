import {
  offchainAccessListAbi,
  readOffchainAccessListGetAllowListIds,
  readOffchainAccessListGetDenyListIds,
  readOffchainAccessListHasAllowListId,
  readOffchainAccessListHasDenyListId,
  readOffchainAccessListOwner,
  simulateOffchainAccessListAddAllowListId,
  simulateOffchainAccessListAddDenyListId,
  simulateOffchainAccessListRemoveAllowListId,
  simulateOffchainAccessListRemoveDenyListId,
  simulateOffchainAccessListSetAllowListIds,
  simulateOffchainAccessListSetDenyListIds,
  writeOffchainAccessListAddAllowListId,
  writeOffchainAccessListAddDenyListId,
  writeOffchainAccessListRemoveAllowListId,
  writeOffchainAccessListRemoveDenyListId,
  writeOffchainAccessListSetAllowListIds,
  writeOffchainAccessListSetDenyListIds,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/OffchainAccessList.sol/OffchainAccessList.json';
import { getAccount } from '@wagmi/core';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
} from 'viem';
import { OffchainAccessList as OffchainAccessListBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTargetWithRBAC } from '../Deployable/DeployableTargetWithRBAC';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { offchainAccessListAbi };

/**
 * Object representation of a {@link OffchainAccessList} initialization payload.
 *
 * @export
 * @interface OffchainAccessListPayload
 * @typedef {OffchainAccessListPayload}
 */
export interface OffchainAccessListPayload {
  /**
   * The access list's owner
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of off-chain allowlist IDs.
   *
   * @type {string[]}
   */
  allowlistIds: string[];
  /**
   * List of off-chain denylist IDs.
   *
   * @type {string[]}
   */
  denylistIds: string[];
}

/**
 * A generic `viem.Log` event with support for `OffchainAccessList` event types.
 *
 * @export
 * @typedef {OffchainAccessListLog}
 * @template {ContractEventName<typeof offchainAccessListAbi>} [event=ContractEventName<
 *     typeof offchainAccessListAbi
 *   >]
 */
export type OffchainAccessListLog<
  event extends ContractEventName<
    typeof offchainAccessListAbi
  > = ContractEventName<typeof offchainAccessListAbi>,
> = GenericLog<typeof offchainAccessListAbi, event>;

/**
 * An AllowList that links on-chain boosts to off-chain access lists stored in a database.
 * This implementation always allows everyone (returns true) but stores references to off-chain allowlist and denylist IDs.
 *
 * @export
 * @class OffchainAccessList
 * @typedef {OffchainAccessList}
 * @extends {DeployableTargetWithRBAC<OffchainAccessListPayload>}
 */
export class OffchainAccessList extends DeployableTargetWithRBAC<
  OffchainAccessListPayload,
  typeof offchainAccessListAbi
> {
  public override readonly abi = offchainAccessListAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(import.meta.env?.VITE_OFFCHAIN_ACCESS_LIST_BASE
      ? { 31337: import.meta.env.VITE_OFFCHAIN_ACCESS_LIST_BASE }
      : {}),
    ...(OffchainAccessListBases as Record<number, Address>),
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
  public async owner(params?: ReadParams): Promise<Address> {
    return await readOffchainAccessListOwner(this._config, {
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      address: this.assertValidAddress(),
      args: [],
    });
  }

  /**
   * Check if a user is authorized based on off-chain allowlists/denylists
   *
   * @public
   * @async
   * @param {Address} address - The address of the user
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the user is allowed
   */
  public isAllowed(_address: Address, _params?: ReadParams) {
    // TODO: check address against offchain allowlist/denylist using api calls
    throw new Error(
      'isAllowed() not available for OffchainAccessList, implementation should be done offchain',
    );
  }

  /**
   * Get all allowlist IDs
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<string[]>} - Array of allowlist IDs
   */
  public async getAllowlistIds(params?: ReadParams) {
    return await readOffchainAccessListGetAllowListIds(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get all denylist IDs
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<string[]>} - Array of denylist IDs
   */
  public async getDenylistIds(params?: ReadParams) {
    return await readOffchainAccessListGetDenyListIds(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Set allowlist IDs, replacing all existing ones. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string[]} ids - The new allowlist IDs
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setAllowlistIds(ids: string[], params?: WriteParams) {
    return await this.awaitResult(this.setAllowlistIdsRaw(ids, params));
  }

  /**
   * Set allowlist IDs, replacing all existing ones. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string[]} ids - The new allowlist IDs
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setAllowlistIdsRaw(ids: string[], params?: WriteParams) {
    const { request, result } = await simulateOffchainAccessListSetAllowListIds(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [ids],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeOffchainAccessListSetAllowListIds(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Set denylist IDs, replacing all existing ones. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string[]} ids - The new denylist IDs
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setDenylistIds(ids: string[], params?: WriteParams) {
    return await this.awaitResult(this.setDenylistIdsRaw(ids, params));
  }

  /**
   * Set denylist IDs, replacing all existing ones. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string[]} ids - The new denylist IDs
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setDenylistIdsRaw(ids: string[], params?: WriteParams) {
    const { request, result } = await simulateOffchainAccessListSetDenyListIds(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [ids],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeOffchainAccessListSetDenyListIds(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Add a single allowlist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The allowlist ID to add
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async addAllowlistId(id: string, params?: WriteParams) {
    return await this.awaitResult(this.addAllowlistIdRaw(id, params));
  }

  /**
   * Add a single allowlist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The allowlist ID to add
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async addAllowlistIdRaw(id: string, params?: WriteParams) {
    const { request, result } = await simulateOffchainAccessListAddAllowListId(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [id],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeOffchainAccessListAddAllowListId(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Add a single denylist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The denylist ID to add
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async addDenylistId(id: string, params?: WriteParams) {
    return await this.awaitResult(this.addDenylistIdRaw(id, params));
  }

  /**
   * Add a single denylist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The denylist ID to add
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async addDenylistIdRaw(id: string, params?: WriteParams) {
    const { request, result } = await simulateOffchainAccessListAddDenyListId(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [id],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeOffchainAccessListAddDenyListId(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Remove a single allowlist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The allowlist ID to remove
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async removeAllowlistId(id: string, params?: WriteParams) {
    return await this.awaitResult(this.removeAllowlistIdRaw(id, params));
  }

  /**
   * Remove a single allowlist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The allowlist ID to remove
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async removeAllowlistIdRaw(id: string, params?: WriteParams) {
    const { request, result } =
      await simulateOffchainAccessListRemoveAllowListId(this._config, {
        address: this.assertValidAddress(),
        args: [id],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeOffchainAccessListRemoveAllowListId(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Remove a single denylist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The denylist ID to remove
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async removeDenylistId(id: string, params?: WriteParams) {
    return await this.awaitResult(this.removeDenylistIdRaw(id, params));
  }

  /**
   * Remove a single denylist ID. This function can only be called by authorized users.
   *
   * @public
   * @async
   * @param {string} id - The denylist ID to remove
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async removeDenylistIdRaw(id: string, params?: WriteParams) {
    const { request, result } =
      await simulateOffchainAccessListRemoveDenyListId(this._config, {
        address: this.assertValidAddress(),
        args: [id],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeOffchainAccessListRemoveDenyListId(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Check if an allowlist ID exists
   *
   * @public
   * @async
   * @param {string} id - The allowlist ID to check
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the ID exists
   */
  public async hasAllowlistId(
    id: string,
    params?: ReadParams,
  ): Promise<boolean> {
    return await readOffchainAccessListHasAllowListId(this._config, {
      address: this.assertValidAddress(),
      args: [id],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Check if a denylist ID exists
   *
   * @public
   * @async
   * @param {string} id - The denylist ID to check
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the ID exists
   */
  public async hasDenylistId(
    id: string,
    params?: ReadParams,
  ): Promise<boolean> {
    return await readOffchainAccessListHasDenyListId(this._config, {
      address: this.assertValidAddress(),
      args: [id],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?OffchainAccessListPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: OffchainAccessListPayload,
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
      abi: offchainAccessListAbi,
      bytecode: bytecode as Hex,
      args: [prepareOffchainAccessListPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}

/**
 * Given a {@link OffchainAccessListPayload}, properly encode the initialization payload.
 *
 * @param {OffchainAccessListPayload} param0
 * @param {Address} param0.owner - The access list's owner
 * @param {string[]} param0.allowlistIds - List of off-chain allowlist IDs
 * @param {string[]} param0.denylistIds - List of off-chain denylist IDs
 * @returns {Hex}
 */
export function prepareOffchainAccessListPayload({
  owner,
  allowlistIds,
  denylistIds,
}: OffchainAccessListPayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'string[]', name: 'allowlistIds' },
      { type: 'string[]', name: 'denylistIds' },
    ],
    [owner, allowlistIds, denylistIds],
  );
}
