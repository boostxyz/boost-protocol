import {
  erc20IncentiveAbi,
  readErc20IncentiveAsset,
  readErc20IncentiveClaimed,
  readErc20IncentiveClaims,
  readErc20IncentiveCurrentReward,
  readErc20IncentiveEntries,
  readErc20IncentiveIsClaimable,
  readErc20IncentiveLimit,
  readErc20IncentiveOwner,
  readErc20IncentiveReward,
  readErc20IncentiveStrategy,
  simulateErc20IncentiveClaim,
  simulateErc20IncentiveClawback,
  simulateErc20IncentiveDrawRaffle,
  writeErc20IncentiveClaim,
  writeErc20IncentiveClawback,
  writeErc20IncentiveDrawRaffle,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
  zeroHash,
} from 'viem';
import { ERC20Incentive as ERC20IncentiveBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type ClaimPayload,
  StrategyType,
  prepareClaimPayload,
} from '../claiming';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { erc20IncentiveAbi };

/**
 * The object representation of a `ERC20Incentive.InitPayload`
 *
 * @export
 * @interface ERC20IncentivePayload
 * @typedef {ERC20IncentivePayload}
 */
export interface ERC20IncentivePayload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The type of disbursement strategy for the incentive.
   *
   * @type {StrategyType}
   */
  strategy: StrategyType;
  /**
   * The amount of the asset to distribute.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * How many times can this incentive be claimed. This should ideally be 1n for `RAFFLE` strategy types.
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   * (Optional) The address of the entity that can trigger a raffle.
   * If omitted, the incentive will have no manager with permissions to draw the raffle.
   *
   * @type {Address}
   * @optional
   */
  manager?: Address;
}

/**
 * A generic `viem.Log` event with support for `ERC20Incentive` event types.
 *
 * @export
 * @typedef {ERC20IncentiveLog}
 * @template {ContractEventName<typeof erc20IncentiveAbi>} [event=ContractEventName<
 *     typeof erc20IncentiveAbi
 *   >]
 */
export type ERC20IncentiveLog<
  event extends ContractEventName<typeof erc20IncentiveAbi> = ContractEventName<
    typeof erc20IncentiveAbi
  >,
> = GenericLog<typeof erc20IncentiveAbi, event>;

/**
 * A simple ERC20 incentive implementation that allows claiming of tokens
 *
 * @export
 * @class ERC20Incentive
 * @typedef {ERC20Incentive}
 * @extends {DeployableTarget<ERC20IncentivePayload>}
 */
export class ERC20Incentive extends DeployableTarget<
  ERC20IncentivePayload,
  typeof erc20IncentiveAbi
> {
  public override readonly abi = erc20IncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_ERC20_INCENTIVE_BASE,
    ...(ERC20IncentiveBases as Record<number, Address>),
  };
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.INCENTIVE;

  /**
   * The owner of the incentive
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async owner(params?: ReadParams) {
    return await readErc20IncentiveOwner(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Calculates the current reward based on the time since the last claim. The reward is calculated based on the time since the last claim, the available budget, and the reward parameters. It increases linearly over time in the absence of claims, with each hour adding `rewardBoost` to the current reward, up to the available budget. For example, if there is one claim in the first hour, then no claims for three hours, the claimable reward would be `initialReward - rewardDecay + (rewardBoost * 3)`
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The current reward
   */
  public async currentReward(params?: ReadParams) {
    return await readErc20IncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The number of claims that have been made
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async claims(params?: ReadParams) {
    return await readErc20IncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * A mapping of address to claim status
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async claimed(address: Address, params?: ReadParams) {
    return await readErc20IncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The address of the ERC20-like token
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async asset(params?: ReadParams) {
    return await readErc20IncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The strategy for the incentive (MINT or POOL)
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<StrategyType>}
   */
  public strategy(params?: ReadParams): Promise<StrategyType> {
    return readErc20IncentiveStrategy(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    }) as Promise<StrategyType>;
  }

  /**
   * The reward amount issued for each claim
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(params?: ReadParams) {
    return await readErc20IncentiveReward(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The limit (max claims, or max entries for raffles)
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async limit(params?: ReadParams) {
    return await readErc20IncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The set of addresses that have claimed a slot in the incentive raffle, accessed by bigint index.
   *
   * @public
   * @async
   * @param {bigint} i - Index of address
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async entries(i: bigint, params?: ReadParams) {
    return await readErc20IncentiveEntries(this._config, {
      address: this.assertValidAddress(),
      args: [i],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  protected async claim(payload: ClaimPayload, params?: WriteParams) {
    return await this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - Returns true if successfully claimed
   */
  protected async claimRaw(payload: ClaimPayload, params?: WriteParams) {
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
   * Clawback assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully clawbacked
   */
  public async clawback(payload: ClaimPayload, params?: WriteParams) {
    return await this.awaitResult(this.clawbackRaw(payload, params));
  }

  /**
   * Clawback assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} -  True if the assets were successfully clawbacked
   */
  public async clawbackRaw(payload: ClaimPayload, params?: WriteParams) {
    const { request, result } = await simulateErc20IncentiveClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20IncentiveClawback(this._config, request);
    return { hash, result };
  }

  /**
   * Check if an incentive is claimable. For the POOL strategy, the `bytes data` portion of the payload ignored. The recipient must not have already claimed the incentive.
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} = True if the incentive is claimable based on the data payload
   */
  public async isClaimable(payload: ClaimPayload, params?: ReadParams) {
    return await readErc20IncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Draw a winner from the raffle. Only callable by owner. Only valid when the strategy is set to `Strategy.RAFFLE`
   *
   * @public
   * @async
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async drawRaffle(params?: WriteParams) {
    return await this.awaitResult(this.drawRaffleRaw(params));
  }

  /**
   * Draw a winner from the raffle. Only callable by owner. Only valid when the strategy is set to `Strategy.RAFFLE`
   *
   * @public
   * @async
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async drawRaffleRaw(params?: WriteParams) {
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
   * Get the maximum amount that can be claimed by this incentive. Useful when used in conjunction with `BoostCore.calculateProtocolFee`
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} = Return a bigint representing that maximum amount that can be distributed by this incentive.
   */
  public async getTotalBudget(params?: ReadParams) {
    if (
      this.payload?.strategy !== undefined &&
      this.payload?.limit !== undefined &&
      this.payload?.reward !== undefined
    ) {
      return (this.payload.strategy as StrategyType) === StrategyType.POOL
        ? this.payload.limit * this.payload.reward
        : this.payload.reward;
    }
    const [strategy, limit, reward] = await Promise.all([
      this.strategy(params),
      this.limit(params),
      this.reward(params),
    ]);
    return strategy === StrategyType.POOL ? limit * reward : reward;
  }

  /**
   * Check if any claims remain by comparing the incentive's total claims against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if total claims is less than limit
   */
  public async canBeClaimed(params?: ReadParams) {
    return (await this.getRemainingClaimPotential(params)) > 0n;
  }

  /**
   * Check how many claims remain by comparing the incentive's total claims against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - True if total claims is less than limit
   */
  public async getRemainingClaimPotential(params?: ReadParams) {
    const [claims, limit] = await Promise.all([
      this.claims(params),
      this.limit(params),
    ]);
    return limit - claims;
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

  /**
   * Encodes an amount to clawback from the incentive
   *
   * @public
   * @param {bigint} amount - How much of the asset to clawback
   * @returns {Hex} - Returns an encoded uint256
   */
  public buildClawbackData(amount: bigint) {
    return encodeAbiParameters([{ type: 'uint256' }], [amount]);
  }

  /**
   * Builds the claim data for the ERC20Incentive.
   *
   * @public
   * @returns {Hash} A `zeroHash`, as ERC20Incentive doesn't require specific claim data.
   * @description This function returns `zeroHash` because ERC20Incentive doesn't use any specific claim data.
   */
  public buildClaimData() {
    return zeroHash;
  }
}

/**
 * Given a {@link ERC20IncentivePayload}, properly encode a `ERC20Incentive.InitPayload` for use with {@link ERC20Incentive} initialization.
 *
 * @param {ERC20IncentivePayload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {StrategyType} param0.strategy - The type of disbursement strategy for the incentive. `StrategyType.MINT` is not supported for `ERC20Incentives`
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @param {Address} [param0.manager=zeroAddress] - The entity that can draw raffles - defaults to unset
 * @returns {Hex}
 */
export function prepareERC20IncentivePayload({
  asset,
  strategy,
  reward,
  limit,
  manager = zeroAddress,
}: ERC20IncentivePayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint8', name: 'strategy' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
      { type: 'address', name: 'manager' },
    ],
    [
      asset,
      strategy,
      reward,
      // unclear how user set limit should work for raffle, so in order to avoid passing 0's let's correct it
      limit === 0n && strategy === StrategyType.RAFFLE ? 1n : limit,
      manager,
    ],
  );
}
