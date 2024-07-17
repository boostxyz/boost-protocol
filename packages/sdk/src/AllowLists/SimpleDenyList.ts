import {
  RegistryType,
  type SimpleDenyListPayload,
  prepareSimpleDenyListPayload,
  readSimpleDenyListGetComponentInterface,
  readSimpleDenyListIsAllowed,
  readSimpleDenyListSupportsInterface,
  simpleDenyListAbi,
  simulateSimpleDenyListSetDenied,
  writeSimpleDenyListSetDenied,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress, zeroHash } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { ReadParams, WriteParams } from '../utils';

export type { SimpleDenyListPayload };
export { prepareSimpleDenyListPayload };

/**
 * Description placeholder
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams<typeof simpleDenyListAbi, 'isAllowed'>} [params]
   * @returns {Promise<boolean>}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} interfaceId
   * @param {?ReadParams<typeof simpleDenyListAbi, 'supportsInterface'>} [params]
   * @returns {unknown}
   */
  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof simpleDenyListAbi, 'supportsInterface'>,
  ) {
    return readSimpleDenyListSupportsInterface(this._config, {
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
   * @param {?ReadParams<typeof simpleDenyListAbi, 'getComponentInterface'>} [params]
   * @returns {unknown}
   */
  public async getComponentInterface(
    params?: ReadParams<typeof simpleDenyListAbi, 'getComponentInterface'>,
  ) {
    return readSimpleDenyListGetComponentInterface(this._config, {
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
