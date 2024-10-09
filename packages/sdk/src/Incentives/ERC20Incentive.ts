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
} from 'viem';
import { ERC20Incentive as ERC20IncentiveBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type ClaimPayload,
  type StrategyType,
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
   * The type of disbursement strategy for the incentive. `StrategyType.MINT` is not supported for `ERC20Incentives`
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
   * How many times can this incentive be claimed.
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   * The entity that can `clawback` funds
   *
   * @type {Address}
   */
  manager: Address;
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
  public async owner(params?: ReadParams<typeof erc20IncentiveAbi, 'owner'>) {
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
  public async currentReward(
    params?: ReadParams<typeof erc20IncentiveAbi, 'currentReward'>,
  ) {
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
  public async claims(params?: ReadParams<typeof erc20IncentiveAbi, 'claims'>) {
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
  public async claimed(
    address: Address,
    params?: ReadParams<typeof erc20IncentiveAbi, 'claimed'>,
  ) {
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
  public async asset(params?: ReadParams<typeof erc20IncentiveAbi, 'asset'>) {
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
  public strategy(
    params?: ReadParams<typeof erc20IncentiveAbi, 'strategy'>,
  ): Promise<StrategyType> {
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
  public async reward(params?: ReadParams<typeof erc20IncentiveAbi, 'reward'>) {
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
  public async limit(params?: ReadParams<typeof erc20IncentiveAbi, 'limit'>) {
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
  public async entries(
    i: bigint,
    params?: ReadParams<typeof erc20IncentiveAbi, 'entries'>,
  ) {
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
  protected async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'claim'>,
  ) {
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
  protected async claimRaw(
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
   * Clawback assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully clawbacked
   */
  public async clawback(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'clawback'>,
  ) {
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
  public async clawbackRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'clawback'>,
  ) {
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
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof erc20IncentiveAbi, 'isClaimable'>,
  ) {
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
  public async drawRaffle(
    params?: WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>,
  ) {
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

/**
 * Given a {@link ERC20IncentivePayload}, properly encode a `ERC20Incentive.InitPayload` for use with {@link ERC20Incentive} initialization.
 *
 * @param {ERC20IncentivePayload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {StrategyType} param0.strategy - The type of disbursement strategy for the incentive. `StrategyType.MINT` is not supported for `ERC20Incentives`
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @returns {Hex}
 */
export function prepareERC20IncentivePayload({
  asset,
  strategy,
  reward,
  limit,
  manager,
}: ERC20IncentivePayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint8', name: 'strategy' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
      { type: 'address', name: 'manager' },
    ],
    [asset, strategy, reward, limit, manager],
  );
}
