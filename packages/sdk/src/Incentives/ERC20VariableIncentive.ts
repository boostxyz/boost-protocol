import {
  erc20VariableIncentiveAbi,
  readErc20VariableIncentiveAsset,
  readErc20VariableIncentiveClaimed,
  readErc20VariableIncentiveClaims,
  readErc20VariableIncentiveCurrentReward,
  readErc20VariableIncentiveIsClaimable,
  readErc20VariableIncentiveLimit,
  readErc20VariableIncentiveOwner,
  readErc20VariableIncentiveReward,
  readErc20VariableIncentiveTotalClaimed,
  simulateErc20VariableIncentiveClaim,
  simulateErc20VariableIncentiveClawback,
  writeErc20VariableIncentiveClaim,
  writeErc20VariableIncentiveClawback,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20VariableIncentive.sol/ERC20VariableIncentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
} from 'viem';
import { ERC20VariableIncentive as ERC20VariableIncentiveBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { type ClaimPayload, prepareClaimPayload } from '../claiming';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { erc20VariableIncentiveAbi };
/**
 * The object representation of a `ERC20VariableIncentivePayload.InitPayload`
 *
 * @export
 * @interface ERC20VariableIncentivePayload
 * @typedef {ERC20VariableIncentivePayload}
 */
export interface ERC20VariableIncentivePayload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The amount of the asset to distribute.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * The total spending limit of the asset that will be distributed.
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
 * A generic `viem.Log` event with support for `ERC20VariableIncentive` event types.
 *
 * @export
 * @typedef {ERC20VariableIncentiveLog}
 * @template {ContractEventName<typeof erc20VariableIncentiveAbi>} [event=ContractEventName<
 *     typeof erc20VariableIncentiveAbi
 *   >]
 */
export type ERC20VariableIncentiveLog<
  event extends ContractEventName<
    typeof erc20VariableIncentiveAbi
  > = ContractEventName<typeof erc20VariableIncentiveAbi>,
> = GenericLog<typeof erc20VariableIncentiveAbi, event>;

/**
 *  A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit
 *
 * @export
 * @class ERC20VariableIncentive
 * @typedef {ERC20VariableIncentive}
 * @extends {DeployableTarget<ERC20VariableIncentivePayload>}
 */
export class ERC20VariableIncentive extends DeployableTarget<
  ERC20VariableIncentivePayload,
  typeof erc20VariableIncentiveAbi
> {
  public override readonly abi = erc20VariableIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(ERC20VariableIncentiveBases as Record<number, Address>),
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
  public async owner(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'owner'>,
  ) {
    return await readErc20VariableIncentiveOwner(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The total amount of rewards claimed
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async totalClaimed(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'totalClaimed'>,
  ) {
    return await readErc20VariableIncentiveTotalClaimed(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The current reward
   */
  public async currentReward(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'currentReward'>,
  ) {
    return await readErc20VariableIncentiveCurrentReward(this._config, {
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
  public async claims(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'claims'>,
  ) {
    return await readErc20VariableIncentiveClaims(this._config, {
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
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'claimed'>,
  ) {
    return await readErc20VariableIncentiveClaimed(this._config, {
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
  public async asset(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'asset'>,
  ) {
    return await readErc20VariableIncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The reward amount issued for each claim
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'reward'>,
  ) {
    return await readErc20VariableIncentiveReward(this._config, {
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
  public async limit(
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'limit'>,
  ) {
    return await readErc20VariableIncentiveLimit(this._config, {
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  protected async claim(
    payload: ClaimPayload,
    params?: WriteParams<typeof erc20VariableIncentiveAbi, 'claim'>,
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
    params?: WriteParams<typeof erc20VariableIncentiveAbi, 'claim'>,
  ) {
    const { request, result } = await simulateErc20VariableIncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20VariableIncentiveClaim(this._config, request);
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
    params?: WriteParams<typeof erc20VariableIncentiveAbi, 'clawback'>,
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
    params?: WriteParams<typeof erc20VariableIncentiveAbi, 'clawback'>,
  ) {
    const { request, result } = await simulateErc20VariableIncentiveClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20VariableIncentiveClawback(
      this._config,
      request,
    );
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
    params?: ReadParams<typeof erc20VariableIncentiveAbi, 'isClaimable'>,
  ) {
    return await readErc20VariableIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [prepareClaimPayload(payload)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC20VariableIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20VariableIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20VariableIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC20VariableIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}

/**
 * Given a {@link ERC20VariableIncentivePayload}, properly encode a ` ERC20VariableIncentive.InitPayload` for use with {@link ERC20VariableIncentive} initialization.
 *
 * @param {ERC20VariableIncentivePayload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @returns {Hex}
 */
export function prepareERC20VariableIncentivePayload({
  asset,
  reward,
  limit,
  manager,
}: ERC20VariableIncentivePayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
      { type: 'address', name: 'manager' },
    ],
    [asset, reward, limit, manager],
  );
}
