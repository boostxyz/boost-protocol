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
import type { Address, ContractEventName, Hex } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  type ERC721MintActionPayload,
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
  prepareERC721MintActionPayload,
  prepareERC721MintActionValidate,
} from '../utils';
import { ContractAction } from './ContractAction';

export { erc721MintActionAbi, prepareERC721MintActionPayload };
export type { ERC721MintActionPayload };

/**
 * A generic `viem.Log` event with support for `ERC721MintAction` event types.
 *
 * @export
 * @typedef {ERC721MintActionLog}
 * @template {ContractEventName<
 *     typeof erc721MintActionAbi
 *   >} [event=ContractEventName<typeof erc721MintActionAbi>]
 */
export type ERC721MintActionLog<
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
export class ERC721MintAction extends ContractAction<
  typeof erc721MintActionAbi
> {
  //@ts-expect-error should never be constructed with variant typ
  public override readonly abi = erc721MintActionAbi;

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
