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
  type Abi,
  type Address,
  type ContractEventName,
  type Hex,
  decodeAbiParameters,
  encodeAbiParameters,
  zeroAddress,
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
   * The reward multiplier. If 0, the signed amount from the claim payload is used directly. Variable amount (in ETH decimal format) will by multiplied by this value.
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
 * A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit
 *
 * @export
 * @class ERC20VariableIncentive
 * @typedef {ERC20VariableIncentive}
 * @template [Payload=ERC20VariableIncentivePayload | undefined]
 * @template {Abi} [ABI=typeof erc20VariableIncentiveAbi]
 * @extends {DeployableTarget<ERC20VariableIncentivePayload, ABI>}
 */
export class ERC20VariableIncentive<
  Payload = ERC20VariableIncentivePayload | undefined,
  ABI extends Abi = typeof erc20VariableIncentiveAbi,
> extends DeployableTarget<Payload, ABI> {
  //@ts-expect-error it is instantiated correctly
  public override readonly abi = erc20VariableIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_ERC20_VARIABLE_INCENTIVE_BASE,
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
  public async owner(params?: ReadParams) {
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
  public async totalClaimed(params?: ReadParams) {
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
  public async currentReward(params?: ReadParams) {
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
  public async claims(params?: ReadParams) {
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
  public async claimed(address: Address, params?: ReadParams) {
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
  public async asset(params?: ReadParams) {
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
  public async reward(params?: ReadParams) {
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
  public async limit(params?: ReadParams) {
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
  public async isClaimable(payload: ClaimPayload, params?: ReadParams) {
    return await readErc20VariableIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [payload.target, payload.data],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
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
    if ((this.payload as ERC20VariableIncentivePayload)?.limit !== undefined) {
      return (this.payload as ERC20VariableIncentivePayload).limit;
    }
    return await this.limit(params);
  }

  /**
   * Check if any claims remain by comparing the incentive's total claimed amount against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if limit minus total claimed is greater than 0
   */
  public async canBeClaimed(params?: ReadParams) {
    return (await this.getRemainingClaimPotential(params)) > 0n;
  }

  /**
   * Check how much of the underlying asset remains by comparing the the limit against the total amount claimed. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - Limit minus total claimed
   */
  public async getRemainingClaimPotential(params?: ReadParams) {
    const [totalClaimed, limit] = await Promise.all([
      this.totalClaimed(params),
      this.limit(params),
    ]);
    return limit - totalClaimed;
  }
  /**
   * Generates a top-up payload for the ERC20PeggedIncentive contract by incrementing
   * the existing `limit` field by `netAmount`. The entire payload is then re-encoded
   * via `prepareERC20PeggedIncentivePayload(...)`.
   *
   * @public
   * @param {bigint} netAmount - The additional limit to add to this incentive.
   * @returns {Hex} The ABI-encoded payload with the updated `limit`.
   */
  public async getTopupPayload(netAmount: bigint): Promise<Hex> {
    return prepareERC20VariableIncentivePayload({
      asset: (await this.asset()) as Address,
      reward: netAmount,
      manager: zeroAddress,
      limit: 1n,
    });
  }

  /**
   * Builds the claim data for the ERC20VariableIncentive.
   *
   * @public
   * @param {bigint} rewardAmount
   * @returns {Hex} Returns the encoded claim data
   * @description This function returns the encoded claim data for the ERC20VariableIncentive.
   */
  public buildClaimData(rewardAmount: bigint) {
    return encodeAbiParameters(
      [{ type: 'uint256', name: 'rewardAmount' }],
      [rewardAmount],
    );
  }

  /**
   * Decodes claim data for the ERC20VariableIncentive, returning the encoded claim amount.
   * Useful when deriving amount claimed from logs.
   *
   * @public
   * @param {Hex} claimData
   * @returns {Promise<bigint>} Returns the reward amount from a claim data payload
   */
  public decodeClaimData(data: Hex) {
    return Promise.resolve(
      BigInt(decodeAbiParameters([{ type: 'uint256' }], data)[0]),
    );
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
   * @inheritdoc
   *
   * @public
   * @param {?ERC20VariableIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: Payload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20VariableIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [
        prepareERC20VariableIncentivePayload(
          payload as ERC20VariableIncentivePayload,
        ),
      ],
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
