import {
  erc721MintActionAbi,
  readErc721MintActionPrepare,
  readErc721MintActionValidated,
  simulateErc721MintActionExecute,
  simulateErc721MintActionValidate,
  writeErc721MintActionExecute,
  writeErc721MintActionValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
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
import {
  type ERC721MintActionPayload,
  type GenericLog,
  type GetLogsParams,
  type ReadParams,
  RegistryType,
  type WatchParams,
  type WriteParams,
  prepareERC721MintActionPayload,
  prepareERC721MintActionValidate,
} from '../utils';
import { ContractAction } from './ContractAction';

export { prepareERC721MintActionPayload, erc721MintActionAbi };
export type { ERC721MintActionPayload };

/**
 * A generic `viem.Log` event with support for `ERC721MintAction` event types.
 *
 * @export
 * @typedef {ERC721MintActionEvent}
 * @template {ContractEventName<
 *     typeof erc721MintActionAbi
 *   >} [event=ContractEventName<typeof erc721MintActionAbi>]
 */
export type ERC721MintActionEvent<
  event extends ContractEventName<
    typeof erc721MintActionAbi
  > = ContractEventName<typeof erc721MintActionAbi>,
> = GenericLog<typeof erc721MintActionAbi, event>;

/**
 * A primitive action to mint and/or validate that an ERC721 token has been minted
 * The action is expected to be prepared with the data payload for the minting of the token
 * This a minimal generic implementation that should be extended if additional functionality or customizations are required
 * It is expected that the target contract has an externally accessible mint function whose selector
 *
 * @export
 * @class ERC721MintAction
 * @typedef {ERC721MintAction}
 * @extends {ContractAction}
 */
export class ERC721MintAction extends ContractAction {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_ERC721_MINT_ACTION_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ACTION;

  /**
   * The set of validated tokens
   * This is intended to prevent multiple validations against the same token ID
   *
   * @public
   * @async
   * @param {bigint} token
   * @param {?ReadParams<typeof erc721MintActionAbi, 'validated'>} [params]
   * @returns {unknown}
   */
  public async validated(
    token: bigint,
    params?: ReadParams<typeof erc721MintActionAbi, 'validated'>,
  ) {
    return readErc721MintActionValidated(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [token],
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams<typeof erc721MintActionAbi, 'execute'>} [params]
   * @returns {unknown}
   */
  public override async execute(
    data: Hex,
    params?: WriteParams<typeof erc721MintActionAbi, 'execute'>,
  ) {
    return this.awaitResult(this.executeRaw(data, params));
  }

  /**
   * @inheritdoc
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?WriteParams<typeof erc721MintActionAbi, 'execute'>} [params]
   * @returns {unknown}
   */
  public override async executeRaw(
    data: Hex,
    params?: WriteParams<typeof erc721MintActionAbi, 'execute'>,
  ) {
    const { request, result } = await simulateErc721MintActionExecute(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [data],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc721MintActionExecute(this._config, request);
    return { hash, result };
  }

  /**
   * @inheritdoc
   *
   * @public
   * @async
   * @param {Hex} data
   * @param {?ReadParams<typeof erc721MintActionAbi, 'prepare'>} [params]
   * @returns {unknown}
   */
  public override async prepare(
    data: Hex,
    params?: ReadParams<typeof erc721MintActionAbi, 'prepare'>,
  ) {
    return readErc721MintActionPrepare(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Validate that the action has been completed successfully
   *
   * @public
   * @async
   * @param {Address} holder - The holder
   * @param {BigInt} tokenId - The token ID
   * @param {?WriteParams<typeof erc721MintActionAbi, 'validate'>} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the action has been validated for the user
   */
  public async validate(
    holder: Address,
    tokenId: bigint,
    params?: WriteParams<typeof erc721MintActionAbi, 'validate'>,
  ) {
    return this.awaitResult(this.validateRaw(holder, tokenId, params));
  }

  /**
   * Validate that the action has been completed successfully
   *
   * @public
   * @async
   * @param {Address} holder - The holder
   * @param {BigInt} tokenId - The token ID
   * @param {?WriteParams<typeof erc721MintActionAbi, 'validate'>} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the action has been validated for the user
   */
  public async validateRaw(
    holder: Address,
    tokenId: bigint,
    params?: WriteParams<typeof erc721MintActionAbi, 'validate'>,
  ) {
    const { request, result } = await simulateErc721MintActionValidate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareERC721MintActionValidate(holder, tokenId)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc721MintActionValidate(this._config, request);
    return { hash, result };
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
   * @template {ContractEventName<typeof erc721MintActionAbi>} event
   * @template {ExtractAbiEvent<
   *       typeof erc721MintActionAbi,
   *       event
   *     >} [abiEvent=ExtractAbiEvent<typeof erc721MintActionAbi, event>]
   * @param {?Omit<
   *       GetLogsParams<typeof erc721MintActionAbi, event, abiEvent, abiEvent[]>,
   *       'event' | 'events'
   *     > & {
   *       eventName?: event;
   *       eventNames?: event[];
   *     }} [params]
   * @returns {Promise<GetLogsReturnType<abiEvent, abiEvent[]>>}
   * 
   @ts-expect-error slight params mismatch */
  public override async getLogs<
    event extends ContractEventName<typeof erc721MintActionAbi>,
    const abiEvent extends ExtractAbiEvent<
      typeof erc721MintActionAbi,
      event
    > = ExtractAbiEvent<typeof erc721MintActionAbi, event>,
  >(
    params?: Omit<
      GetLogsParams<typeof erc721MintActionAbi, event, abiEvent, abiEvent[]>,
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
              abi: erc721MintActionAbi,
              name: params.eventName,
              // biome-ignore lint/suspicious/noExplicitAny: awkward abi intersection issue
            } as any),
          }
        : {}),
      ...(params?.eventNames
        ? {
            events: params.eventNames.map((name) =>
              getAbiItem({
                abi: erc721MintActionAbi,
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
   * @inheritdoc
   *
   * @public
   * @async
   * @template {ContractEventName<typeof erc721MintActionAbi>} event
   * @param {(log: ERC721MintActionEvent<event>) => unknown} cb
   * @param {?WatchParams<typeof erc721MintActionAbi, event> & {
   *       eventName?: event;
   *     }} [params]
   * @returns {unknown, params?: any) => unknown} Unsubscribe function
   @ts-expect-error completely overriding subscribe generics for this class */
  public override async subscribe<
    event extends ContractEventName<typeof erc721MintActionAbi>,
  >(
    cb: (log: ERC721MintActionEvent<event>) => unknown,
    params?: WatchParams<typeof erc721MintActionAbi, event> & {
      eventName?: event;
    },
  ) {
    return watchContractEvent<
      typeof this._config,
      (typeof this._config)['chains'][number]['id'],
      typeof erc721MintActionAbi,
      event
    >(this._config, {
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      eventName: params?.eventName,
      abi: erc721MintActionAbi,
      address: this.assertValidAddress(),
      onLogs: (logs) => {
        for (let l of logs) {
          cb(l as unknown as ERC721MintActionEvent<event>);
        }
      },
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC721MintActionPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC721MintActionPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc721MintActionAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC721MintActionPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
