import {
  RegistryType,
  type SimpleAllowListPayload,
  prepareSimpleAllowListPayload,
  readSimpleAllowListGetComponentInterface,
  readSimpleAllowListIsAllowed,
  readSimpleAllowListSupportsInterface,
  simpleAllowListAbi,
  simulateSimpleAllowListGrantRoles,
  simulateSimpleAllowListSetAllowed,
  writeSimpleAllowListGrantRoles,
  writeSimpleAllowListSetAllowed,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import { getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { ReadParams } from '../utils';

export type { SimpleAllowListPayload };
export { prepareSimpleAllowListPayload };

/**
 * Description placeholder
 *
 * @type {2n}
 */
export const LIST_MANAGER_ROLE = 2n;
/**
 * Description placeholder
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {Promise<boolean>}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {unknown}
   */
  public async setAllowed(
    addresses: Address[],
    allowed: boolean[],
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return this.awaitResult(this.setAllowedRaw(addresses, allowed, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {bigint} role
   * @param {?ReadParams<typeof simpleAllowListAbi, 'grantRoles'>} [params]
   * @returns {unknown}
   */
  public async grantRoles(
    address: Address,
    role: bigint,
    params?: ReadParams<typeof simpleAllowListAbi, 'grantRoles'>,
  ) {
    return this.awaitResult(this.grantRolesRaw(address, role, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {bigint} role
   * @param {?ReadParams<typeof simpleAllowListAbi, 'grantRoles'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} interfaceId
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {unknown}
   */
  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return readSimpleAllowListSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof simpleAllowListAbi, 'setAllowed'>} [params]
   * @returns {unknown}
   */
  public async getComponentInterface(
    params?: ReadParams<typeof simpleAllowListAbi, 'setAllowed'>,
  ) {
    return readSimpleAllowListGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
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
