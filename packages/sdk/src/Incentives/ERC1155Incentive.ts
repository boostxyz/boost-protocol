import {
  erc1155IncentiveAbi,
  readErc1155IncentiveAsset,
  readErc1155IncentiveClaimed,
  readErc1155IncentiveClaims,
  readErc1155IncentiveExtraData,
  readErc1155IncentiveIsClaimable,
  readErc1155IncentiveLimit,
  readErc1155IncentivePreflight,
  readErc1155IncentiveReward,
  readErc1155IncentiveStrategy,
  readErc1155IncentiveTokenId,
  simulateErc1155IncentiveClaim,
  simulateErc1155IncentiveReclaim,
  writeErc1155IncentiveClaim,
  writeErc1155IncentiveReclaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
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
  type ERC1155IncentivePayload,
  ERC1155StrategyType,
  type GenericLog,
  type GetLogsParams,
  type ReadParams,
  RegistryType,
  type StrategyType,
  type WatchParams,
  type WriteParams,
  prepareClaimPayload,
  prepareERC1155IncentivePayload,
} from '../utils';

export { ERC1155StrategyType, erc1155IncentiveAbi };
export type { ERC1155IncentivePayload };

/**
 * A generic `viem.Log` event with support for `ERC1155Incentive` event types.
 *
 * @export
 * @typedef {ERC1155IncentiveLog}
 * @template {ContractEventName<
 *     typeof erc1155IncentiveAbi
 *   >} [event=ContractEventName<typeof erc1155IncentiveAbi>]
 */
export type ERC1155IncentiveLog<
  event extends ContractEventName<
    typeof erc1155IncentiveAbi
  > = ContractEventName<typeof erc1155IncentiveAbi>,
> = GenericLog<typeof erc1155IncentiveAbi, event>;

/**
 * This is currently not exported due to a mysterious abi encoding issue
 *
 * @experimental
 * @export
 * @class ERC1155Incentive
 * @typedef {ERC1155Incentive}
 * @extends {DeployableTarget<ERC1155IncentivePayload>}
 */
export class ERC1155Incentive extends DeployableTarget<
  ERC1155IncentivePayload,
  typeof erc1155IncentiveAbi
> {
  public override readonly abi = erc1155IncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_ERC1155_INCENTIVE_BASE;
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'claims'>} [params]
   * @returns {unknown}
   */
  public async claims(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'claims'>,
  ) {
    return readErc1155IncentiveClaims(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'reward'>} [params]
   * @returns {unknown}
   */
  public async reward(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'reward'>,
  ) {
    return readErc1155IncentiveReward(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'claimed'>} [params]
   * @returns {unknown}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'claimed'>,
  ) {
    return readErc1155IncentiveClaimed(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'asset'>} [params]
   * @returns {unknown}
   */
  public async asset(params?: ReadParams<typeof erc1155IncentiveAbi, 'asset'>) {
    return readErc1155IncentiveAsset(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'strategy'>} [params]
   * @returns {Promise<StrategyType>}
   */
  public async strategy(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'strategy'>,
  ): Promise<StrategyType> {
    return readErc1155IncentiveStrategy(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'limit'>} [params]
   * @returns {unknown}
   */
  public async limit(params?: ReadParams<typeof erc1155IncentiveAbi, 'limit'>) {
    return readErc1155IncentiveLimit(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'tokenId'>} [params]
   * @returns {unknown}
   */
  public async tokenId(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'tokenId'>,
  ) {
    return readErc1155IncentiveTokenId(this._config, {
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
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'extraData'>} [params]
   * @returns {unknown}
   */
  public async extraData(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'extraData'>,
  ) {
    return readErc1155IncentiveExtraData(this._config, {
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
   * @param {?WriteParams<typeof erc1155IncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc1155IncentiveAbi, 'claim'>} [params]
   * @returns {unknown}
   */
  public async claimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateErc1155IncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc1155IncentiveClaim(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc1155IncentiveAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
  public async reclaim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams<typeof erc1155IncentiveAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
  public async reclaimRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateErc1155IncentiveReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc1155IncentiveReclaim(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'isClaimable'>} [params]
   * @returns {unknown}
   */
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'isClaimable'>,
  ) {
    return readErc1155IncentiveIsClaimable(this._config, {
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
   * @param {ERC1155IncentivePayload} data
   * @param {?ReadParams<typeof erc1155IncentiveAbi, 'preflight'>} [params]
   * @returns {unknown}
   */
  public async preflight(
    data: ERC1155IncentivePayload,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'preflight'>,
  ) {
    return readErc1155IncentivePreflight(this._config, {
      address: this.assertValidAddress(),
      args: [prepareERC1155IncentivePayload(data)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  // /**
  //  * A typed wrapper for (viem.getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs].
  //  * Accepts `eventName` and `eventNames` as optional parameters to narrow the returned log types.
  //  * @example
  //  * ```ts
  //  * const logs = contract.getLogs({ eventName: 'EventName' })
  //  * const logs = contract.getLogs({ eventNames: ['EventName'] })
  //  * ```
  //  * @public
  //  * @async
  //  * @template {ContractEventName<typeof erc1155IncentiveAbi>} event
  //  * @template {ExtractAbiEvent<
  //  *       typeof erc1155IncentiveAbi,
  //  *       event
  //  *     >} [abiEvent=ExtractAbiEvent<typeof erc1155IncentiveAbi, event>]
  //  * @param {?Omit<
  //  *       GetLogsParams<typeof erc1155IncentiveAbi, event, abiEvent, abiEvent[]>,
  //  *       'event' | 'events'
  //  *     > & {
  //  *       eventName?: event;
  //  *       eventNames?: event[];
  //  *     }} [params]
  //  * @returns {Promise<GetLogsReturnType<abiEvent, abiEvent[]>>}
  //  */
  // public async getLogs<
  //   event extends ContractEventName<typeof erc1155IncentiveAbi>,
  //   const abiEvent extends ExtractAbiEvent<
  //     typeof erc1155IncentiveAbi,
  //     event
  //   > = ExtractAbiEvent<typeof erc1155IncentiveAbi, event>,
  // >(
  //   params?: Omit<
  //     GetLogsParams<typeof erc1155IncentiveAbi, event, abiEvent, abiEvent[]>,
  //     'event' | 'events'
  //   > & {
  //     eventName?: event;
  //     eventNames?: event[];
  //   },
  // ): Promise<GetLogsReturnType<abiEvent, abiEvent[]>> {
  //   return getLogs(this._config.getClient({ chainId: params?.chainId }), {
  //     // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wag
  //     ...(params as any),
  //     ...(params?.eventName
  //       ? {
  //           event: getAbiItem({
  //             abi: erc1155IncentiveAbi,
  //             name: params.eventName,
  //             // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
  //           } as any),
  //         }
  //       : {}),
  //     ...(params?.eventNames
  //       ? {
  //           events: params.eventNames.map((name) =>
  //             getAbiItem({
  //               abi: erc1155IncentiveAbi,
  //               name,
  //               // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
  //             } as any),
  //           ),
  //         }
  //       : {}),
  //     address: this.assertValidAddress(),
  //   });
  // }

  // /**
  //  * A typed wrapper for `wagmi.watchContractEvent`
  //  *
  //  * @public
  //  * @async
  //  * @template {ContractEventName<typeof erc1155IncentiveAbi>} event
  //  * @param {(log: ERC1155IncentiveLog<event>) => unknown} cb
  //  * @param {?WatchParams<typeof erc1155IncentiveAbi, event> & {
  //  *       eventName?: event;
  //  *     }} [params]
  //  * @returns {unknown, params?: any) => unknown} Unsubscribe function
  //  */
  // public async subscribe<
  //   event extends ContractEventName<typeof erc1155IncentiveAbi>,
  // >(
  //   cb: (log: ERC1155IncentiveLog<event>) => unknown,
  //   params?: WatchParams<typeof erc1155IncentiveAbi, event> & {
  //     eventName?: event;
  //   },
  // ) {
  //   return watchContractEvent<
  //     typeof this._config,
  //     (typeof this._config)['chains'][number]['id'],
  //     typeof erc1155IncentiveAbi,
  //     event
  //   >(this._config, {
  //     // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
  //     ...(params as any),
  //     eventName: params?.eventName,
  //     abi: erc1155IncentiveAbi,
  //     address: this.assertValidAddress(),
  //     onLogs: (logs) => {
  //       for (let l of logs) {
  //         cb(l as unknown as ERC1155IncentiveLog<event>);
  //       }
  //     },
  //   });
  // }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC1155IncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC1155IncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc1155IncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC1155IncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
