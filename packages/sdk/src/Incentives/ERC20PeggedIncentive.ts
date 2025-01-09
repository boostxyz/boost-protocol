import {
  erc20PeggedIncentiveAbi,
  readErc20PeggedIncentiveAsset,
  readErc20PeggedIncentiveClaimed,
  readErc20PeggedIncentiveClaims,
  readErc20PeggedIncentiveCurrentReward,
  readErc20PeggedIncentiveGetPeg,
  readErc20PeggedIncentiveIsClaimable,
  readErc20PeggedIncentiveLimit,
  readErc20PeggedIncentiveOwner,
  readErc20PeggedIncentivePeg,
  readErc20PeggedIncentiveReward,
  readErc20PeggedIncentiveTotalClaimed,
  simulateErc20PeggedIncentiveClaim,
  simulateErc20PeggedIncentiveClawback,
  writeErc20PeggedIncentiveClaim,
  writeErc20PeggedIncentiveClawback,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/ERC20PeggedIncentive.sol/ERC20PeggedIncentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  decodeAbiParameters,
  encodeAbiParameters,
  zeroAddress,
} from 'viem';
import { ERC20PeggedIncentive as ERC20PeggedIncentiveBases } from '../../dist/deployments.json';
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

export { erc20PeggedIncentiveAbi };

/**
 * The object representation of a `ERC20PeggedIncentive.InitPayload`
 *
 * @export
 * @interface ERC20PeggedIncentivePayload
 * @typedef {ERC20PeggedIncentivePayload}
 */
export interface ERC20PeggedIncentivePayload {
  /**
   * The address of the incentivized asset.
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The peg to normalize to.
   *
   * @type {Address}
   */
  peg: Address;
  /**
   * The amount of the asset to distribute.
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * Total spend for the incentive.
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   * (Optional) The address of the entity that can managed the incentive.
   *
   * @type {Address}
   * @optional
   */
  manager?: Address;
}

/**
 * A generic `viem.Log` event with support for `ERC20PeggedIncentive` event types.
 *
 * @export
 * @typedef {ERC20PeggedIncentiveLog}
 * @template {ContractEventName<typeof erc20PeggedIncentiveAbi>} [event=ContractEventName<
 *     typeof erc20PeggedIncentiveAbi
 *   >]
 */
export type ERC20PeggedIncentiveLog<
  event extends ContractEventName<
    typeof erc20PeggedIncentiveAbi
  > = ContractEventName<typeof erc20PeggedIncentiveAbi>,
> = GenericLog<typeof erc20PeggedIncentiveAbi, event>;

/**
 * A simple ERC20 incentive implementation that allows claiming of tokens
 *
 * @export
 * @class ERC20PeggedIncentive
 * @typedef {ERC20PeggedIncentive}
 * @extends {DeployableTarget<ERC20PeggedIncentivePayload>}
 */
export class ERC20PeggedIncentive extends DeployableTarget<
  ERC20PeggedIncentivePayload,
  typeof erc20PeggedIncentiveAbi
> {
  public override readonly abi = erc20PeggedIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_ERC20_INCENTIVE_BASE,
    ...(ERC20PeggedIncentiveBases as Record<number, Address>),
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
    return await readErc20PeggedIncentiveOwner(this._config, {
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
  public async currentReward(params?: ReadParams) {
    return await readErc20PeggedIncentiveCurrentReward(this._config, {
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
    return await readErc20PeggedIncentiveClaims(this._config, {
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
    return await readErc20PeggedIncentiveTotalClaimed(this._config, {
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
    return await readErc20PeggedIncentiveClaimed(this._config, {
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
    return await readErc20PeggedIncentiveAsset(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The address of the pegged ERC20-like token
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async peg(params?: ReadParams) {
    return await readErc20PeggedIncentivePeg(this._config, {
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
    return await readErc20PeggedIncentiveReward(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The limit (max possible rewards payout in reward token)
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async limit(params?: ReadParams) {
    return await readErc20PeggedIncentiveLimit(this._config, {
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
    const { request, result } = await simulateErc20PeggedIncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20PeggedIncentiveClaim(this._config, request);
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
    const { request, result } = await simulateErc20PeggedIncentiveClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeErc20PeggedIncentiveClawback(this._config, request);
    return { hash, result };
  }

  /**
   * Check if an incentive is claimable.
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} = True if the incentive is claimable based on the data payload
   */
  public async isClaimable(payload: ClaimPayload, params?: ReadParams) {
    return await readErc20PeggedIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [payload.target, payload.data],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * read the peg token for the incentive.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>} = The address of the token the reward is pegged to
   */
  public async getPeg(params?: ReadParams) {
    return await readErc20PeggedIncentiveGetPeg(this._config, {
      address: this.assertValidAddress(),
      args: [],
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
    return await this.limit(params);
  }

  /**
   * Check if any claims remain by comparing the incentive's total claims against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if total claims is less than limit
   */
  public async canBeClaimed(params?: ReadParams) {
    return (await this.getRemainingClaimPotential(params)) > 0n;
  }

  /**
   * Check how many claims remain by comparing the incentive's total claims against its limit. Does not take requesting user's elligibility into account.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - True if total claims is less than limit
   */
  public async getRemainingClaimPotential(params?: ReadParams) {
    const [claims, limit] = await Promise.all([
      this.claims(params),
      this.limit(params),
    ]);
    return limit - claims;
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC20PeggedIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20PeggedIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20PeggedIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC20PeggedIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
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
   * Builds the claim data for the ERC20PeggedIncentive.
   *
   * @public
   * @param {bigint} rewardAmount
   * @returns {Hash} Returns the encoded claim data
   * @description This function returns the encoded claim data for the ERC20PeggedIncentive.
   */
  public buildClaimData(rewardAmount: bigint) {
    return encodeAbiParameters(
      [{ type: 'uint256', name: 'rewardAmount' }],
      [rewardAmount],
    );
  }

  /**
   * Decodes claim data for the ERC20PeggedIncentive, returning the claim amount.
   * Useful when deriving amount claimed from logs.
   *
   * @public
   * @param {Hex} claimData
   * @returns {BigInt} Returns the reward amount from a claim data payload
   */
  public decodeClaimData(claimData: Hex) {
    const boostClaimData = decodeAbiParameters(
      [
        {
          type: 'tuple',
          name: 'BoostClaimData',
          components: [
            { type: 'bytes', name: 'validatorData' },
            { type: 'bytes', name: 'incentiveData' },
          ],
        },
      ],
      claimData,
    );
    const signedAmount = decodeAbiParameters(
      [{ type: 'uint256' }],
      boostClaimData[0].incentiveData,
    )[0];
    return signedAmount;
  }
}

/**
 * Given a {@link ERC20PeggedIncentivePayload}, properly encode a `ERC20PeggedIncentive.InitPayload` for use with {@link ERC20PeggedIncentive} initialization.
 *
 * @param {ERC20PeggedIncentivePayload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {Address} param0.peg - The peg to normalize to.
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @param {Address} [param0.manager=zeroAddress] - The entity that can manage the incentive.
 * @returns {Hex}
 */
export function prepareERC20PeggedIncentivePayload({
  asset,
  peg,
  reward,
  limit,
  manager = zeroAddress,
}: ERC20PeggedIncentivePayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'address', name: 'peg' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
      { type: 'address', name: 'manager' },
    ],
    [asset, peg, reward, limit, manager],
  );
}
