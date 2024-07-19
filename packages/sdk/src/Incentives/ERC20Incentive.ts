import {
  type ClaimPayload,
  type ERC20IncentivePayload,
  RegistryType,
  type StrategyType,
  erc20IncentiveAbi,
  prepareClaimPayload,
  prepareERC20IncentivePayload,
  readCgdaIncentiveOwner,
  readErc20IncentiveAsset,
  readErc20IncentiveClaimed,
  readErc20IncentiveClaims,
  readErc20IncentiveCurrentReward,
  readErc20IncentiveEntries,
  readErc20IncentiveGetComponentInterface,
  readErc20IncentiveIsClaimable,
  readErc20IncentiveLimit,
  readErc20IncentiveOwner,
  readErc20IncentiveReward,
  readErc20IncentiveStrategy,
  readErc20IncentiveSupportsInterface,
  simulateErc20IncentiveClaim,
  simulateErc20IncentiveDrawRaffle,
  simulateErc20IncentiveReclaim,
  writeErc20IncentiveClaim,
  writeErc20IncentiveDrawRaffle,
  writeErc20IncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import type { Address, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { ReadParams, WriteParams } from '../utils';

export type { ERC20IncentivePayload };

/**
 * Description placeholder
 *
 * @export
 * @class ERC20Incentive
 * @typedef {ERC20Incentive}
 * @extends {DeployableTarget<ERC20IncentivePayload>}
 */
export class ERC20Incentive extends DeployableTarget<ERC20IncentivePayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_ERC20_INCENTIVE_BASE;
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'owner'>} [params]
   * @returns {unknown}
   */
  public async owner(params?: ReadParams<typeof erc20IncentiveAbi, 'owner'>) {
    return readErc20IncentiveOwner(this._config, {
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'currentReward'>} [params]
   * @returns {unknown}
   */
  public async currentReward(
    params?: ReadParams<typeof erc20IncentiveAbi, 'currentReward'>,
  ) {
    return readErc20IncentiveCurrentReward(this._config, {
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'claims'>} [params]
   * @returns {unknown}
   */
  public async claims(params?: ReadParams<typeof erc20IncentiveAbi, 'claims'>) {
    return readErc20IncentiveClaims(this._config, {
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'claimed'>} [params]
   * @returns {unknown}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof erc20IncentiveAbi, 'claimed'>,
  ) {
    return readErc20IncentiveClaimed(this._config, {
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'asset'>} [params]
   * @returns {unknown}
   */
  public async asset(params?: ReadParams<typeof erc20IncentiveAbi, 'asset'>) {
    return readErc20IncentiveAsset(this._config, {
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'strategy'>} [params]
   * @returns {Promise<StrategyType>}
   */
  public async strategy(
    params?: ReadParams<typeof erc20IncentiveAbi, 'strategy'>,
  ): Promise<StrategyType> {
    return readErc20IncentiveStrategy(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    }) as Promise<StrategyType>;
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'reward'>} [params]
   * @returns {unknown}
   */
  public async reward(params?: ReadParams<typeof erc20IncentiveAbi, 'reward'>) {
    return readErc20IncentiveReward(this._config, {
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
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'limit'>} [params]
   * @returns {unknown}
   */
  public async limit(params?: ReadParams<typeof erc20IncentiveAbi, 'limit'>) {
    return readErc20IncentiveLimit(this._config, {
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
   * @param {bigint} i
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'entries'>} [params]
   * @returns {unknown}
   */
  public async entries(
    i: bigint,
    params?: ReadParams<typeof erc20IncentiveAbi, 'entries'>,
  ) {
    return readErc20IncentiveEntries(this._config, {
      address: this.assertValidAddress(),
      args: [i],
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
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateErc20IncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveClaim(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
  public async reclaimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateErc20IncentiveReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveReclaim(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'isClaimable'>} [params]
   * @returns {unknown}
   */
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof erc20IncentiveAbi, 'isClaimable'>,
  ) {
    return readErc20IncentiveIsClaimable(this._config, {
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
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>} [params]
   * @returns {unknown}
   */
  public async drawRaffle(
    params?: WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>,
  ) {
    return this.awaitResult(this.drawRaffleRaw(params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>} [params]
   * @returns {unknown}
   */
  public async drawRaffleRaw(
    params?: WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>,
  ) {
    const { request, result } = await simulateErc20IncentiveDrawRaffle(
      this._config,
      {
        address: this.assertValidAddress(),
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveDrawRaffle(this._config, request);
    return { hash, result };
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC20IncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20IncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20IncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC20IncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
