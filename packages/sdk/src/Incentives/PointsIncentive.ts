import {
  pointsIncentiveAbi,
  readPointsIncentiveClaimed,
  readPointsIncentiveClaims,
  readPointsIncentiveCurrentReward,
  readPointsIncentiveIsClaimable,
  readPointsIncentiveLimit,
  readPointsIncentiveReward,
  readPointsIncentiveSelector,
  readPointsIncentiveVenue,
  simulatePointsIncentiveClaim,
  writePointsIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import { watchContractEvent } from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import {
  type Address,
  type ContractEventName,
  type GetLogsReturnType,
  type Hex,
  getAbiItem,
} from 'viem';
import { getLogs } from 'viem/actions';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type ClaimPayload,
  type GenericLog,
  type GetLogsParams,
  type PointsIncentivePayload,
  type ReadParams,
  RegistryType,
  type WatchParams,
  type WriteParams,
  prepareClaimPayload,
  preparePointsIncentivePayload,
} from '../utils';

export type { PointsIncentivePayload };
export { pointsIncentiveAbi };

/**
 * A generic `viem.Log` event with support for `PointsIncentive` event types.
 *
 * @export
 * @typedef {PointsIncentiveLog}
 * @template {ContractEventName<
 *     typeof pointsIncentiveAbi
 *   >} [event=ContractEventName<typeof pointsIncentiveAbi>]
 */
export type PointsIncentiveLog<
  event extends ContractEventName<
    typeof pointsIncentiveAbi
  > = ContractEventName<typeof pointsIncentiveAbi>,
> = GenericLog<typeof pointsIncentiveAbi, event>;

/**
 * A simple on-chain points incentive implementation that allows claiming of soulbound tokens.
 *
 * In order for any claim to be successful:
 * - The claimer must not have already claimed the incentive; and
 * - The maximum number of claims must not have been reached; and
 * - This contract must be authorized to operate the points contract's issuance function
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
   * The number of claims that have been made
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'claims'>} [params]
   * @returns {Promise<bigint>}
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
   * The current reward
   *
   * @public
   * @async
   * @param {?ReadParams<typeof erc20IncentiveAbi, 'currentReward'>} [params]
   * @returns {Promise<bigint>} - The current reward
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
   * The reward amount issued for each claim
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
   * A mapping of address to claim status
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
   * The address of the points contract
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
   * The maximum number of claims that can be made (one per address)
   *
   * @public
   * @async
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'limit'>} [params]
   * @returns {Promise<bigint>}
   */
  public async limit(params?: ReadParams<typeof pointsIncentiveAbi, 'limit'>) {
    return readPointsIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The selector for the issuance function on the points contract
   *
   * @public
   * @async
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'selector'>} [params]
   * @returns {Promise<Hex>}
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
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof pointsIncentiveAbi, 'claim'>} [params]
   * @returns {Promise<boolean>} -  True if the incentive was successfully claimed
   */
  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof pointsIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim the incentive
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof pointsIncentiveAbi, 'claim'>} [params]
   * @returns {Promise<boolean>} -  True if the incentive was successfully claimed
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
   * Check if an incentive is claimable.
   * For the POOL strategy, the `bytes data` portion of the payload ignored.
   * The recipient must not have already claimed the incentive.
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams<typeof pointsIncentiveAbi, 'isClaimable'>} [params]
   * @returns {Promise<boolean>} -  True if the incentive is claimable based on the data payload
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
   * A typed wrapper for (viem.getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs].
   * Accepts `eventName` and `eventNames` as optional parameters to narrow the returned log types.
   * @example
   * ```ts
   * const logs = contract.getLogs({ eventName: 'EventName' })
   * const logs = contract.getLogs({ eventNames: ['EventName'] })
   * ```
   * @public
   * @async
   * @template {ContractEventName<typeof pointsIncentiveAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof pointsIncentiveAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof pointsIncentiveAbi, event>]
   * @param {?Omit<
   *       GetLogsParams<typeof pointsIncentiveAbi, event, abiEvent, abiEvent[]>,
   *       'event' | 'events'
   *     > & {
   *       eventName?: event;
   *       eventNames?: event[];
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvent[]>>}
   */
  public async getLogs<
    event extends ContractEventName<typeof pointsIncentiveAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof pointsIncentiveAbi,
      event
    > = ExtractAbiEvent<typeof pointsIncentiveAbi, event>,
  >(
    params?: Omit<
      GetLogsParams<typeof pointsIncentiveAbi, event, abiEvent, abiEvent[]>,
      'event' | 'events'
    > & {
      eventName?: event;
      eventNames?: event[];
    },
  ): Promise<GetLogsReturnType<abiEvent, abiEvent[]>> {
    return getLogs(this._config.getClient({ chainId: params?.chainId }), {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
      ...(params as any),
      ...(params?.eventName
        ? {
            event: getAbiItem({
              abi: pointsIncentiveAbi,
              name: params.eventName,
              // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
            } as any),
          }
        : {}),
      ...(params?.eventNames
        ? {
            events: params.eventNames.map((name) =>
              getAbiItem({
                abi: pointsIncentiveAbi,
                name,
                // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
              } as any),
            ),
          }
        : {}),
      address: this.assertValidAddress(),
    });
  }

  /**
   * A typed wrapper for `wagmi.watchContractEvent`
   *
   * @public
   * @async
   * @template {ContractEventName<typeof pointsIncentiveAbi>} event
   * @param {(log: PointsIncentiveLog<event>) => unknown} cb
   * @param {?WatchParams<typeof pointsIncentiveAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   */
  public async subscribe<
    event extends ContractEventName<typeof pointsIncentiveAbi>,
  >(
    cb: (log: PointsIncentiveLog<event>) => unknown,
    params?: WatchParams<typeof pointsIncentiveAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof pointsIncentiveAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: pointsIncentiveAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as PointsIncentiveLog<event>);
        }
      },
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
