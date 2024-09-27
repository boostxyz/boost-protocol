import {
  readSimpleDenyListIsAllowed,
  simpleDenyListAbi,
  simulateSimpleDenyListSetDenied,
  writeSimpleDenyListSetDenied,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { getAccount } from '@wagmi/core';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
  zeroHash,
} from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { simpleDenyListAbi };

/**
 * Object representation of a {@link SimpleDenyList} initialization payload.
 *
 * @export
 * @interface SimpleDenyListPayload
 * @typedef {SimpleDenyListPayload}
 */
export interface SimpleDenyListPayload {
  /**
   * The allow list's owner
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of denied addresses.
   *
   * @type {Address[]}
   */
  denied: Address[];
}

/**
 * A generic `viem.Log` event with support for `SimpleDenyList` event types.
 *
 * @export
 * @typedef {SimpleDenyListLog}
 * @template {ContractEventName<typeof simpleDenyListAbi>} [event=ContractEventName<
 *     typeof simpleDenyListAbi
 *   >]
 */
export type SimpleDenyListLog<
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
export class SimpleDenyList<
  Payload = SimpleDenyListPayload,
> extends DeployableTarget<Payload | undefined, typeof simpleDenyListAbi> {
  public override readonly abi = simpleDenyListAbi;
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
    return await this.awaitResult(
      this.setDeniedRaw(addresses, allowed, params),
    );
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
   * @inheritdoc
   *
   * @public
   * @param {?SimpleDenyListPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [p, options] = this.validateDeploymentConfig(_payload, _options);
    const payload = p as SimpleDenyListPayload;
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

/**
 * Given a {@link SimpleDenyListPayload}, properly encode the initialization payload.
 *
 * @param {SimpleDenyListPayload} param0
 * @param {Address} param0.owner - The allow list's owner
 * @param {Address[]} param0.denied - List of denied addresses.
 * @returns {Hex}
 */
export function prepareSimpleDenyListPayload({
  owner,
  denied,
}: SimpleDenyListPayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'address[]', name: 'denied' },
    ],
    [owner, denied],
  );
}
