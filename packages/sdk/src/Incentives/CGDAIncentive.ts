import {
  cgdaIncentiveAbi,
  readCgdaIncentiveAsset,
  readCgdaIncentiveCgdaParams,
  readCgdaIncentiveClaimed,
  readCgdaIncentiveClaims,
  readCgdaIncentiveCurrentReward,
  readCgdaIncentiveIsClaimable,
  readCgdaIncentiveOwner,
  readCgdaIncentiveReward,
  readCgdaIncentiveTotalBudget,
  simulateCgdaIncentiveClaim,
  simulateCgdaIncentiveReclaim,
  writeCgdaIncentiveClaim,
  writeCgdaIncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
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
  type CGDAIncentivePayload,
  type CGDAParameters,
  type ClaimPayload,
  type GenericLog,
  type GetLogsParams,
  type ReadParams,
  RegistryType,
  type WatchParams,
  type WriteParams,
  prepareCGDAIncentivePayload,
  prepareClaimPayload,
} from '../utils';

export type { CGDAIncentivePayload };

/**
 * A record of `CGDAIncentive` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @export
 * @typedef {CGDAIncentiveAbiEvents}
 * @template {ContractEventName<
 *     typeof cgdaIncentiveAbi
 *   >} [eventName=ContractEventName<typeof cgdaIncentiveAbi>]
 */
export type CGDAIncentiveAbiEvents<
  eventName extends ContractEventName<
    typeof cgdaIncentiveAbi
  > = ContractEventName<typeof cgdaIncentiveAbi>,
> = {
  [name in eventName]: ExtractAbiEvent<typeof cgdaIncentiveAbi, name>;
};

/**
 * A record of `CGDAIncentive` event names to `AbiEvent` objects for use with `getLogs`
 *
 * @type {CGDAIncentiveAbiEvents}
 */
export const CGDAIncentiveAbiEvents: CGDAIncentiveAbiEvents = import.meta.env
  .CGDAIncentiveAbiEvents;

/**
 * A generic `viem.Log` event with support for `CGDAIncentive` event types.
 *
 * @export
 * @typedef {CGDAIncentiveEvent}
 * @template {ContractEventName<typeof cgdaIncentiveAbi>} [event=ContractEventName<
 *     typeof cgdaIncentiveAbi
 *   >]
 */
export type CGDAIncentiveEvent<
  event extends ContractEventName<typeof cgdaIncentiveAbi> = ContractEventName<
    typeof cgdaIncentiveAbi
  >,
> = GenericLog<typeof cgdaIncentiveAbi, event>;

/**
 * Continuous Gradual Dutch Auction Incentive.
 * An CGDA incentive implementation with reward amounts adjusting dynamically based on claim volume.
 *
 * @export
 * @class CGDAIncentive
 * @typedef {CGDAIncentive}
 * @extends {DeployableTarget<CGDAIncentivePayload>}
 */
export class CGDAIncentive extends DeployableTarget<CGDAIncentivePayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_CGDA_INCENTIVE_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.INCENTIVE;

  /**
   * The incentive's owner.
   *
   * @public
   * @async
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'owner'>} [params]
   * @returns {unknown}
   */
  public async owner(params?: ReadParams<typeof cgdaIncentiveAbi, 'owner'>) {
    return readCgdaIncentiveOwner(this._config, {
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
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'claims'>} [params]
   * @returns {Promise<bigint>}
   */
  public async claims(params?: ReadParams<typeof cgdaIncentiveAbi, 'claims'>) {
    return readCgdaIncentiveClaims(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The reward amount issued for each claim
   *
   * @public
   * @async
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'reward'>} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(params?: ReadParams<typeof cgdaIncentiveAbi, 'reward'>) {
    return readCgdaIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the claim status for a user
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'claimed'>} [params]
   * @returns {Promise<boolean>}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'claimed'>,
  ) {
    return readCgdaIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The CGDA-like token used for the incentive
   *
   * @public
   * @async
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'asset'>} [params]
   * @returns {unknown}
   */
  public async asset(params?: ReadParams<typeof cgdaIncentiveAbi, 'asset'>) {
    return readCgdaIncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The configuration parameters for the CGDAIncentive
   *
   * @public
   * @async
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'cgdaParams'>} [params]
   * @returns {Promise<CGDAParameters>}
   */
  public async cgdaParams(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'cgdaParams'>,
  ): Promise<CGDAParameters> {
    const [rewardDecay, rewardBoost, lastClaimTime, currentReward] =
      await readCgdaIncentiveCgdaParams(this._config, {
        address: this.assertValidAddress(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    return {
      rewardDecay,
      rewardBoost,
      lastClaimTime,
      currentReward,
    };
  }

  /**
   * The total budget of the incentive
   *
   * @public
   * @async
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'totalBudget'>} [params]
   * @returns {Promise<bigint>}
   */
  public async totalBudget(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'totalBudget'>,
  ) {
    return readCgdaIncentiveTotalBudget(this._config, {
      address: this.assertValidAddress(),
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
   * @param {?WriteParams<typeof cgdaIncentiveAbi, 'claim'>} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof cgdaIncentiveAbi, 'claim'>} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateCgdaIncentiveClaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeCgdaIncentiveClaim(this._config, request);
    return { hash, result };
  }

  /**
   * Reclaim assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof cgdaIncentiveAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully reclaimed
   */
  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  /**
   * Reclaim assets from the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof cgdaIncentiveAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} -  True if the assets were successfully reclaimed
   */
  public async reclaimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateCgdaIncentiveReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeCgdaIncentiveReclaim(this._config, request);
    return { hash, result };
  }

  /**
   * Check if an incentive is claimable
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'isClaimable'>} [params]
   * @returns {Promise<boolean>} - True if the incentive is claimable based on the data payload
   */
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'isClaimable'>,
  ) {
    return readCgdaIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Calculates the current reward based on the time since the last claim.
   * The reward is calculated based on the time since the last claim, the available budget, and the reward parameters. It increases linearly over time in the absence of claims, with each hour adding `rewardBoost` to the current reward, up to the available budget.
   * For example, if there is one claim in the first hour, then no claims for three hours, the claimable reward would be `initialReward - rewardDecay + (rewardBoost * 3)`
   *
   * @public
   * @async
   * @param {?ReadParams<typeof cgdaIncentiveAbi, 'currentReward'>} [params]
   * @returns {Promise<bigint>} - The current reward
   */
  public async currentReward(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'currentReward'>,
  ) {
    return readCgdaIncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * A typed wrapper for `viem.getLogs`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof cgdaIncentiveAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof cgdaIncentiveAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof cgdaIncentiveAbi, event>]
   * @template {| readonly AbiEvent[]
   *       | readonly unknown[]
   *       | undefined} [abiEvents=abiEvent extends AbiEvent ? [abiEvent] : undefined]
   * @param {?GetLogsParams<
   *       typeof cgdaIncentiveAbi,
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
    event extends ContractEventName<typeof cgdaIncentiveAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof cgdaIncentiveAbi,
      event
    > = ExtractAbiEvent<typeof cgdaIncentiveAbi, event>,
    const abiEvents extends
      | readonly AbiEvent[]
      | readonly unknown[]
      | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
  >(
    params?: GetLogsParams<
      typeof cgdaIncentiveAbi,
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
   * @template {ContractEventName<typeof cgdaIncentiveAbi>} event
   * @param {(log: CGDAIncentiveEvent<event>) => unknown} cb
   * @param {?WatchParams<typeof cgdaIncentiveAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   */
  public async subscribe<
    event extends ContractEventName<typeof cgdaIncentiveAbi>,
  >(
    cb: (log: CGDAIncentiveEvent<event>) => unknown,
    params?: WatchParams<typeof cgdaIncentiveAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof cgdaIncentiveAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: cgdaIncentiveAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as CGDAIncentiveEvent<event>);
        }
      },
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?CGDAIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: CGDAIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: cgdaIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareCGDAIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
