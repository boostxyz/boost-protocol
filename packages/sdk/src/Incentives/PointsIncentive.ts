import {
  type ClaimPayload,
  type PointsIncentivePayload,
  RegistryType,
  pointsIncentiveAbi,
  prepareClaimPayload,
  preparePointsIncentivePayload,
  readPointsIncentiveClaimed,
  readPointsIncentiveClaims,
  readPointsIncentiveCurrentReward,
  readPointsIncentiveGetComponentInterface,
  readPointsIncentiveIsClaimable,
  readPointsIncentiveLimit,
  readPointsIncentiveReward,
  readPointsIncentiveSelector,
  readPointsIncentiveSupportsInterface,
  readPointsIncentiveVenue,
  simulatePointsIncentiveClaim,
  writePointsIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { PointsIncentivePayload };

/**
 * Description placeholder
 *
 * @export
 * @class PointsIncentive
 * @typedef {PointsIncentive}
 * @extends {DeployableTarget<PointsIncentivePayload>}
 */
export class PointsIncentive extends DeployableTarget<PointsIncentivePayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_POINTS_INCENTIVE_BASE;
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'claims'>} [params]
   * @returns {unknown}
   */
  public async claims(
    params?: ReadParams<typeof pointsIncentiveAbi, 'claims'>,
  ) {
    return readPointsIncentiveClaims(this._config, {
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'currentReward'>} [params]
   * @returns {unknown}
   */
  public async currentReward(
    params?: ReadParams<typeof pointsIncentiveAbi, 'currentReward'>,
  ) {
    return readPointsIncentiveCurrentReward(this._config, {
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'reward'>} [params]
   * @returns {unknown}
   */
  public async reward(
    params?: ReadParams<typeof pointsIncentiveAbi, 'reward'>,
  ) {
    return readPointsIncentiveReward(this._config, {
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'claimed'>} [params]
   * @returns {unknown}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof pointsIncentiveAbi, 'claimed'>,
  ) {
    return readPointsIncentiveClaimed(this._config, {
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'venue'>} [params]
   * @returns {unknown}
   */
  public async venue(params?: ReadParams<typeof pointsIncentiveAbi, 'venue'>) {
    return readPointsIncentiveVenue(this._config, {
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'limit'>} [params]
   * @returns {unknown}
   */
  public async limit(params?: ReadParams<typeof pointsIncentiveAbi, 'limit'>) {
    return readPointsIncentiveLimit(this._config, {
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
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'selector'>} [params]
   * @returns {unknown}
   */
  public async selector(
    params?: ReadParams<typeof pointsIncentiveAbi, 'selector'>,
  ) {
    return readPointsIncentiveSelector(this._config, {
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
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof pointsIncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof pointsIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof pointsIncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof pointsIncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulatePointsIncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writePointsIncentiveClaim(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'isClaimable'>} [params]
   * @returns {unknown}
   */
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof pointsIncentiveAbi, 'isClaimable'>,
  ) {
    return readPointsIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} interfaceId
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'supportsInterface'>} [params]
   * @returns {unknown}
   */
  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof pointsIncentiveAbi, 'supportsInterface'>,
  ) {
    return readPointsIncentiveSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      args: [interfaceId],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'getComponentInterface'>} [params]
   * @returns {unknown}
   */
  public async getComponentInterface(
    params?: ReadParams<typeof pointsIncentiveAbi, 'getComponentInterface'>,
  ) {
    return readPointsIncentiveGetComponentInterface(this._config, {
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
   * @param {?PointsIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: PointsIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: pointsIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [preparePointsIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
