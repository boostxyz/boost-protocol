import {
  type AllowListIncentivePayload,
  type ClaimPayload,
  RegistryType,
  allowListIncentiveAbi,
  prepareAllowListIncentivePayload,
  prepareClaimPayload,
  readAllowListIncentiveAllowList,
  readAllowListIncentiveClaimed,
  readAllowListIncentiveClaims,
  readAllowListIncentiveGetComponentInterface,
  readAllowListIncentiveIsClaimable,
  readAllowListIncentiveLimit,
  readAllowListIncentiveOwner,
  readAllowListIncentiveReward,
  readAllowListIncentiveSupportsInterface,
  simulateAllowListIncentiveClaim,
  writeAllowListIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import type { Address, Hex } from 'viem';
import { SimpleAllowList } from '../AllowLists/AllowList';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { AllowListIncentivePayload };
export { prepareAllowListIncentivePayload };

/**
 * Description placeholder
 *
 * @export
 * @class AllowListIncentive
 * @typedef {AllowListIncentive}
 * @extends {DeployableTarget<AllowListIncentivePayload>}
 */
export class AllowListIncentive extends DeployableTarget<AllowListIncentivePayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_ALLOWLIST_INCENTIVE_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.INCENTIVE;

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'owner'>} [params]
   * @returns {unknown}
   */
  public async owner(
    params?: ReadParams<typeof allowListIncentiveAbi, 'owner'>,
  ) {
    return readAllowListIncentiveOwner(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'claims'>} [params]
   * @returns {unknown}
   */
  public async claims(
    params?: ReadParams<typeof allowListIncentiveAbi, 'claims'>,
  ) {
    return readAllowListIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'reward'>} [params]
   * @returns {unknown}
   */
  public async reward(
    params?: ReadParams<typeof allowListIncentiveAbi, 'reward'>,
  ) {
    return readAllowListIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'claimed'>} [params]
   * @returns {unknown}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof allowListIncentiveAbi, 'claimed'>,
  ) {
    return readAllowListIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'allowList'>} [params]
   * @returns {Promise<SimpleAllowList>}
   */
  public async allowList(
    params?: ReadParams<typeof allowListIncentiveAbi, 'allowList'>,
  ): Promise<SimpleAllowList> {
    const address = await readAllowListIncentiveAllowList(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    return new SimpleAllowList(
      { config: this._config, account: this._account },
      address,
    );
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'limit'>} [params]
   * @returns {unknown}
   */
  public async limit(
    params?: ReadParams<typeof allowListIncentiveAbi, 'limit'>,
  ) {
    return readAllowListIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?WriteParams<typeof allowListIncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claim(
    payload: Pick<ClaimPayload, 'target'>,
    params?: WriteParams<typeof allowListIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?WriteParams<typeof allowListIncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claimRaw(
    payload: Pick<ClaimPayload, 'target'>,
    params?: WriteParams<typeof allowListIncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateAllowListIncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeAllowListIncentiveClaim(this._config, request);
    return { hash, result };
  }

  // use prepareClaimPayload?
  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'isClaimable'>} [params]
   * @returns {unknown}
   */
  public async isClaimable(
    payload: Pick<ClaimPayload, 'target'>,
    params?: ReadParams<typeof allowListIncentiveAbi, 'isClaimable'>,
  ) {
    return readAllowListIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?AllowListIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: AllowListIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: allowListIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareAllowListIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
