import {
  erc20PeggedVariableCriteriaIncentiveAbi,
  readErc20PeggedVariableCriteriaIncentiveAsset,
  readErc20PeggedVariableCriteriaIncentiveClaimed,
  readErc20PeggedVariableCriteriaIncentiveClaims,
  readErc20PeggedVariableCriteriaIncentiveCurrentReward,
  readErc20PeggedVariableCriteriaIncentiveGetIncentiveCriteria,
  readErc20PeggedVariableCriteriaIncentiveGetMaxReward,
  readErc20PeggedVariableCriteriaIncentiveGetPeg,
  readErc20PeggedVariableCriteriaIncentiveIsClaimable,
  readErc20PeggedVariableCriteriaIncentiveLimit,
  readErc20PeggedVariableCriteriaIncentiveOwner,
  readErc20PeggedVariableCriteriaIncentiveReward,
  readErc20PeggedVariableCriteriaIncentiveTotalClaimed,
  simulateErc20PeggedVariableCriteriaIncentiveClaim,
  simulateErc20PeggedVariableCriteriaIncentiveClawback,
  writeErc20PeggedVariableCriteriaIncentiveClaim,
  writeErc20PeggedVariableCriteriaIncentiveClawback,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/Erc20PeggedVariableCriteriaIncentive.sol/Erc20PeggedVariableCriteriaIncentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
} from 'viem';
import { ERC20Incentive as ERC20IncentiveBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { type ClaimPayload, prepareClaimPayload } from '../claiming';
import { IncentiveCriteriaNotFoundError } from '../errors';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';
import type { IncentiveCriteria } from './ERC20VariableCriteriaIncentive';

export { erc20PeggedVariableCriteriaIncentiveAbi };

/**
 * The object representation of a `Erc20PeggedVariableCriteriaIncentive.InitPayload`
 *
 * @export
 * @interface Erc20PeggedVariableCriteriaIncentive
 * @typedef {Erc20PeggedVariableCriteriaIncentive}
 */
export interface ERC20PeggedVariableCriteriaIncentivePayload {
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
   * Maximum reward each claim is elligible for.
   *
   * @type {bigint}
   */
  maxReward: bigint;
  /**
   * (Optional) The address of the entity that can managed the incentive.
   *
   * @type {Address}
   * @optional
   */
  manager?: Address;
}

/**
 * A generic `viem.Log` event with support for `Erc20PeggedVariableCriteriaIncentive` event types.
 *
 * @export
 * @typedef {Erc20PeggedVariableCriteriaIncentiveLog}
 * @template {ContractEventName<typeof erc20PeggedVariableCriteriaIncentiveAbi>} [event=ContractEventName<
 *     typeof erc20PeggedVariableCriteriaIncentiveAbi
 *   >]
 */
export type Erc20PeggedVariableCriteriaIncentiveLog<
  event extends ContractEventName<
    typeof erc20PeggedVariableCriteriaIncentiveAbi
  > = ContractEventName<typeof erc20PeggedVariableCriteriaIncentiveAbi>,
> = GenericLog<typeof erc20PeggedVariableCriteriaIncentiveAbi, event>;

/**
 * A simple ERC20 incentive implementation that allows claiming of tokens
 *
 * @export
 * @class Erc20PeggedVariableCriteriaIncentive
 * @typedef {ERC20PeggedVariableCriteriaIncentive}
 * @extends {DeployableTarget<ERC20PeggedVariableCriteriaIncentive>}
 */
export class ERC20PeggedVariableCriteriaIncentive extends DeployableTarget<
  ERC20PeggedVariableCriteriaIncentivePayload,
  typeof erc20PeggedVariableCriteriaIncentiveAbi
> {
  public override readonly abi = erc20PeggedVariableCriteriaIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_ERC20_INCENTIVE_BASE,
    ...(ERC20IncentiveBases as Record<number, Address>),
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
    return await readErc20PeggedVariableCriteriaIncentiveOwner(this._config, {
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
    return await readErc20PeggedVariableCriteriaIncentiveCurrentReward(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
  }

  /**
   * Fetches the IncentiveCriteria struct from the contract
   *
   * @param {?ReadParams} [params]
   * @returns {Promise<IncentiveCriteria>} Incentive criteria structure
   * @throws {IncentiveCriteriaNotFoundError}
   */
  public async getMaxReward(params?: ReadParams): Promise<bigint> {
    const maxReward =
      await readErc20PeggedVariableCriteriaIncentiveGetMaxReward(this._config, {
        ...params,
        address: this.assertValidAddress(),
      });

    return maxReward;
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
    return await readErc20PeggedVariableCriteriaIncentiveClaims(this._config, {
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
    return await readErc20PeggedVariableCriteriaIncentiveTotalClaimed(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
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
    return await readErc20PeggedVariableCriteriaIncentiveClaimed(this._config, {
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
  public async getAsset(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveAsset(this._config, {
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
  public async getReward(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveReward(this._config, {
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
  public async getLimit(params?: ReadParams) {
    return await readErc20PeggedVariableCriteriaIncentiveLimit(this._config, {
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
    const { request, result } =
      await simulateErc20PeggedVariableCriteriaIncentiveClaim(this._config, {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeErc20PeggedVariableCriteriaIncentiveClaim(
      this._config,
      request,
    );
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
    const { request, result } =
      await simulateErc20PeggedVariableCriteriaIncentiveClawback(this._config, {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeErc20PeggedVariableCriteriaIncentiveClawback(
      this._config,
      request,
    );
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
    return await readErc20PeggedVariableCriteriaIncentiveIsClaimable(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [payload.target, payload.data],
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
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
    return await readErc20PeggedVariableCriteriaIncentiveGetPeg(this._config, {
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
    return await this.getLimit(params);
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
    const [totalClaimed, limit] = await Promise.all([
      this.totalClaimed(params),
      this.getLimit(params),
    ]);
    return limit - totalClaimed;
  }

  /**
   *Functions from the ERC20VariableIncentive contract
   */

  /**
   * Fetches the IncentiveCriteria struct from the contract
   *
   * @param {?ReadParams} [params]
   * @returns {Promise<IncentiveCriteria>} Incentive criteria structure
   * @throws {IncentiveCriteriaNotFoundError}
   */
  public async getIncentiveCriteria(
    params?: ReadParams,
  ): Promise<IncentiveCriteria> {
    try {
      const criteria =
        await readErc20PeggedVariableCriteriaIncentiveGetIncentiveCriteria(
          this._config,
          {
            ...params,
            address: this.assertValidAddress(),
          },
        );

      return criteria;
    } catch (e) {
      throw new IncentiveCriteriaNotFoundError(e as Error);
    }
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ERC20PeggedVariableCriteriaIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ERC20PeggedVariableCriteriaIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: erc20PeggedVariableCriteriaIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareERC20PeggedVariableCriteriaIncentivePayload(payload)],
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
   * Builds the claim data for the ERC20PeggedVariableCriteriaIncentivePayload.
   *
   * @public
   * @param {bigint} rewardAmount
   * @returns {Hash} Returns the encoded claim data
   * @description This function returns the encoded claim data for the ERC20PeggedVariableCriteriaIncentivePayload.
   */
  public buildClaimData(rewardAmount: bigint) {
    return encodeAbiParameters(
      [{ type: 'uint256', name: 'rewardAmount' }],
      [rewardAmount],
    );
  }
}

/**
 * Given a {@link ERC20PeggedVariableCriteriaIncentivePayload}, properly encode a `ERC20PeggedVariableCriteriaIncentivePayload.InitPayload` for use with {@link ERC20PeggedVariableCriteriaIncentivePayload} initialization.
 *
 * @param {ERC20PeggedVariableCriteriaIncentivePayload} param0
 * @param {Address} param0.asset - The address of the incentivized asset.
 * @param {Address} param0.peg - The peg to normalize to.
 * @param {bigint} param0.reward - The amount of the asset to distribute.
 * @param {bigint} param0.limit - How many times can this incentive be claimed.
 * @param {Address} [param0.manager=zeroAddress] - The entity that can manage the incentive.
 * @returns {Hex}
 */
export function prepareERC20PeggedVariableCriteriaIncentivePayload({
  asset,
  peg,
  reward,
  limit,
  maxReward,
  manager = zeroAddress,
}: ERC20PeggedVariableCriteriaIncentivePayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'address', name: 'peg' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
      { type: 'uint256', name: 'maxReward' },
      { type: 'address', name: 'manager' },
    ],
    [asset, peg, reward, limit, maxReward, manager],
  );
}
