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
  simulateErc20IncentiveDrawRaffle,
  simulateErc20IncentiveReclaim,
  writeErc20IncentiveClaim,
  writeErc20IncentiveDrawRaffle,
  writeErc20IncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import { watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import type {
  AbiEvent,
  Address,
  ContractEventName,
  GetLogsReturnType,
  Hex,
} from 'viem';
import { getLogs } from 'viem/actions';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type ClaimPayload,
  type ERC20IncentivePayload,
  type GenericLog,
  type GetLogsParams,
  type ReadParams,
  RegistryType,
  type StrategyType,
  type WatchParams,
  type WriteParams,
  prepareClaimPayload,
  prepareERC20IncentivePayload,
} from '../utils';

export type { ERC20IncentivePayload };

/**
 * A record of `ERC20ListIncentive` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @export
 * @typedef {ERC20IncentiveAbiEvents}
 * @template {ContractEventName<
 *     typeof erc20IncentiveAbi
 *   >} [eventName=ContractEventName<typeof erc20IncentiveAbi>]
 */
export type ERC20IncentiveAbiEvents<
  eventName extends ContractEventName<
    typeof erc20IncentiveAbi
  > = ContractEventName<typeof erc20IncentiveAbi>,
> = {
  [name in eventName]: ExtractAbiEvent<typeof erc20IncentiveAbi, name>;
};

/**
 * A record of `ERC20Incentive` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @type {ERC20IncentiveAbiEvents}
 */
export const ERC20IncentiveAbiEvents: ERC20IncentiveAbiEvents = import.meta.env
  .ERC20IncentiveAbiEvents;

/**
 * A generic `viem.Log` event with support for `ERC20Incentive` event types.
 *
 * @export
 * @typedef {ERC20IncentiveEvent}
 * @template {ContractEventName<typeof erc20IncentiveAbi>} [event=ContractEventName<
 *     typeof erc20IncentiveAbi
 *   >]
 */
export type ERC20IncentiveEvent<
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
   * The owner of the incentive
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
   * Calculates the current reward based on the time since the last claim. The reward is calculated based on the time since the last claim, the available budget, and the reward parameters. It increases linearly over time in the absence of claims, with each hour adding `rewardBoost` to the current reward, up to the available budget. For example, if there is one claim in the first hour, then no claims for three hours, the claimable reward would be `initialReward - rewardDecay + (rewardBoost * 3)`
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'currentReward'>} [params]
   * @returns {Promise<bigint>} - The current reward
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
   * The number of claims that have been made
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'claims'>} [params]
   * @returns {Promise<bigint>}
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
   * A mapping of address to claim status
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'claimed'>} [params]
   * @returns {Promise<boolean>}
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
   * The address of the ERC20-like token
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'asset'>} [params]
   * @returns {Promise<Address>}
   */
  public async asset(params?: ReadParams<typeof erc20IncentiveAbi, 'asset'>) {
    return readErc20IncentiveAsset(this._config, {
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
   * The reward amount issued for each claim
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'reward'>} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(params?: ReadParams<typeof erc20IncentiveAbi, 'reward'>) {
    return readErc20IncentiveReward(this._config, {
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
   * The set of addresses that have claimed a slot in the incentive raffle, accessed by bigint index.
   *
   * @public
   * @async
   * @param {bigint} i - Index of address
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'entries'>} [params]
   * @returns {Promise<Address>}
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
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'claim'>} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'claim'>} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
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
   * Reclaim assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully reclaimed
   */
  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20IncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  /**
   * Reclaim assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully reclaimed
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
   * Check if an incentive is claimable. For the POOL strategy, the `bytes data` portion of the payload ignored. The recipient must not have already claimed the incentive.
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'isClaimable'>} [params]
   * @returns {unknown} = True if the incentive is claimable based on the data payload
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
   * Draw a winner from the raffle. Only callable by owner. Only valid when the strategy is set to `Strategy.RAFFLE`
   *
   * @public
   * @async
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>} [params]
   * @returns {Promise<void>}
   */
  public async drawRaffle(
    params?: WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>,
  ) {
    return this.awaitResult(this.drawRaffleRaw(params));
  }

  /**
   * Draw a winner from the raffle. Only callable by owner. Only valid when the strategy is set to `Strategy.RAFFLE`
   *
   * @public
   * @async
   * @param {?WriteParams<typeof erc20IncentiveAbi, 'drawRaffle'>} [params]
   * @returns {Promise<void>}
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
   * A typed wrapper for `viem.getLogs`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof erc20IncentiveAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof erc20IncentiveAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof erc20IncentiveAbi, event>]
   * @template {| readonly AbiEvent[]
   *       | readonly unknown[]
   *       | undefined} [abiEvents=abiEvent extends AbiEvent ? [abiEvent] : undefined]
   * @param {?GetLogsParams<
   *       typeof erc20IncentiveAbi,
   *       event,
   *       abiEvent,
   *       abiEvents
   *     > & {
   *       event?: abiEvent;
   *       events?: abiEvents;
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvents>>}
   */
  public async getLogs<
    event extends ContractEventName<typeof erc20IncentiveAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof erc20IncentiveAbi,
      event
    > = ExtractAbiEvent<typeof erc20IncentiveAbi, event>,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  >(
    params?: GetLogsParams<
      typeof erc20IncentiveAbi,
      event,
      abiEvent,
      abiEvents
    > & {
      event?: abiEvent;
      events?: abiEvents;
    },
  ): Promise<GetLogsReturnType<abiEvent, abiEvents>> {
    return getLogs(this._config.getClient({ chainId: params?.chainId }), {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
      ...(params as any),
      address: this.assertValidAddress(),
    });
  }

  /**
   * A typed wrapper for `wagmi.watchContractEvent`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof erc20IncentiveAbi>} event
   * @param {(log: ERC20IncentiveEvent<event>) => unknown} cb
   * @param {?WatchParams<typeof erc20IncentiveAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   */
  public async subscribe<
    event extends ContractEventName<typeof erc20IncentiveAbi>,
  >(
    cb: (log: ERC20IncentiveEvent<event>) => unknown,
    params?: WatchParams<typeof erc20IncentiveAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof erc20IncentiveAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: erc20IncentiveAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as ERC20IncentiveEvent<event>);
        }
      },
    });
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
