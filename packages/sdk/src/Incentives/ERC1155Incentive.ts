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
  simulateErc1155IncentiveClawback,
  writeErc1155IncentiveClaim,
  writeErc1155IncentiveClawback,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  parseAbiParameters,
} from 'viem';
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

export { erc1155IncentiveAbi };

/**
 * Enum representing inventive disbursement strategies for {@link ERC1155Incentive}
 *
 * @export
 * @enum {number}
 */
export enum ERC1155StrategyType {
  POOL = 0,
  MINT = 1,
}

/**
 * The object representation of a `ERC1155Incentive.InitPayload`
 *
 * @export
 * @interface ERC1155IncentivePayload
 * @typedef {ERC1155IncentivePayload}
 */
export interface ERC1155IncentivePayload {
  /**
   * The address of the `ERC1155` asset
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Should be `Strategy.POOL`
   *
   * @type {ERC1155StrategyType}
   */
  strategy: ERC1155StrategyType;
  /**
   * The token ID to target
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   *  The maximum number of claims that can be made (one per address)
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   *  Any extra data to accompany the claim, if applicable.
   *
   * @type {Hex}
   */
  extraData: Hex;
}

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
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {};
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async claims(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'claims'>,
  ) {
    return await readErc1155IncentiveClaims(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'reward'>,
  ) {
    return await readErc1155IncentiveReward(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'claimed'>,
  ) {
    return await readErc1155IncentiveClaimed(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async asset(params?: ReadParams<typeof erc1155IncentiveAbi, 'asset'>) {
    return await readErc1155IncentiveAsset(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<StrategyType>}
   */
  public strategy(
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
   * @param {?ReadParams} [params]
   * @returns {unknown}
   */
  public async limit(params?: ReadParams<typeof erc1155IncentiveAbi, 'limit'>) {
    return await readErc1155IncentiveLimit(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async tokenId(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'tokenId'>,
  ) {
    return await readErc1155IncentiveTokenId(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async extraData(
    params?: ReadParams<typeof erc1155IncentiveAbi, 'extraData'>,
  ) {
    return await readErc1155IncentiveExtraData(this._config, {
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>}
   */
  protected async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'claim'>,
  ) {
    return await this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>}
   */
  protected async claimRaw(
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>}
   */
  public async clawback(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'clawback'>,
  ) {
    return await this.awaitResult(this.clawbackRaw(payload, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>}
   */
  public async clawbackRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc1155IncentiveAbi, 'clawback'>,
  ) {
    const { request, result } = await simulateErc1155IncentiveClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc1155IncentiveClawback(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'isClaimable'>,
  ) {
    return await readErc1155IncentiveIsClaimable(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async preflight(
    data: ERC1155IncentivePayload,
    params?: ReadParams<typeof erc1155IncentiveAbi, 'preflight'>,
  ) {
    return await readErc1155IncentivePreflight(this._config, {
      address: this.assertValidAddress(),
      args: [prepareERC1155IncentivePayload(data)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

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

/**
 * Given a {@link ERC1155IncentivePayload}, properly encode a `ERC1155Incentive.InitPayload` for use with {@link ERC1155Incentive} initialization.
 *
 * @param {ERC1155IncentivePayload} param0
 * @param {Address} param0.asset - The address of the `ERC1155` asset
 * @param {ERC1155StrategyType} param0.strategy - Should be `Strategy.POOL`
 * @param {bigint} param0.tokenId - The token ID to target
 * @param {bigint} param0.limit -  The maximum number of claims that can be made (one per address)
 * @param {Hex} param0.extraData - Any extra data to accompany the claim, if applicable.
 * @returns {Hex}
 */
export const prepareERC1155IncentivePayload = ({
  asset,
  strategy,
  tokenId,
  limit,
  extraData,
}: ERC1155IncentivePayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'InitPayload payload',
      'struct InitPayload { address asset; uint8 strategy; uint256 tokenId; uint256 limit; bytes extraData; }',
    ]),
    [{ asset, strategy, tokenId, limit, extraData }],
  );
};
