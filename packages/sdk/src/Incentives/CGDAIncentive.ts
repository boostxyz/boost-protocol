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
  simulateCgdaIncentiveClawback,
  writeCgdaIncentiveClaim,
  writeCgdaIncentiveClawback,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
} from 'viem';
import { CGDAIncentive as CGDAIncentiveBases } from '../../dist/deployments.json';
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

export { cgdaIncentiveAbi };

/**
 * The object representation of a `CGDAIncentive.InitPayload`
 *
 * @export
 * @interface CGDAIncentivePayload
 * @typedef {CGDAIncentivePayload}
 */
export interface CGDAIncentivePayload {
  /**
   * The address of the ERC20-like token
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * The initial reward amount
   *
   * @type {bigint}
   */
  initialReward: bigint;
  /**
   * The amount to subtract from the current reward after each claim
   *
   * @type {bigint}
   */
  rewardDecay: bigint;
  /**
   * The amount by which the reward increases for each hour without a claim (continuous linear increase)
   *
   * @type {bigint}
   */
  rewardBoost: bigint;
  /**
   * The total budget for the incentive
   *
   * @type {bigint}
   */
  totalBudget: bigint;
  /**
   * The entity that can `clawback` funds
   *
   * @type {Address}
   */
  manager: Address;
}

/**
 *  The configuration parameters for the CGDAIncentive
 *
 * @export
 * @interface CGDAParameters
 * @typedef {CGDAParameters}
 */
export interface CGDAParameters {
  /**
   * The amount to subtract from the current reward after each claim
   *
   * @type {bigint}
   */
  rewardDecay: bigint;
  /**
   * The amount by which the reward increases for each hour without a claim (continuous linear increase)
   *
   * @type {bigint}
   */
  rewardBoost: bigint;
  /**
   * The timestamp of the last claim
   *
   * @type {bigint}
   */
  lastClaimTime: bigint;
  /**
   * The current reward amount
   *
   * @type {bigint}
   */
  currentReward: bigint;
}

/**
 * A generic `viem.Log` event with support for `CGDAIncentive` event types.
 *
 * @export
 * @typedef {CGDAIncentiveLog}
 * @template {ContractEventName<typeof cgdaIncentiveAbi>} [event=ContractEventName<
 *     typeof cgdaIncentiveAbi
 *   >]
 */
export type CGDAIncentiveLog<
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
export class CGDAIncentive extends DeployableTarget<
  CGDAIncentivePayload,
  typeof cgdaIncentiveAbi
> {
  public override readonly abi = cgdaIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(CGDAIncentiveBases as Record<number, Address>),
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
   * The incentive's owner.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async owner(params?: ReadParams<typeof cgdaIncentiveAbi, 'owner'>) {
    return await readCgdaIncentiveOwner(this._config, {
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
  public async claims(params?: ReadParams<typeof cgdaIncentiveAbi, 'claims'>) {
    return await readCgdaIncentiveClaims(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(params?: ReadParams<typeof cgdaIncentiveAbi, 'reward'>) {
    return await readCgdaIncentiveReward(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'claimed'>,
  ) {
    return await readCgdaIncentiveClaimed(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async asset(params?: ReadParams<typeof cgdaIncentiveAbi, 'asset'>) {
    return await readCgdaIncentiveAsset(this._config, {
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
   * @param {?ReadParams} [params]
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async totalBudget(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'totalBudget'>,
  ) {
    return await readCgdaIncentiveTotalBudget(this._config, {
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
    params?: WriteParams<typeof cgdaIncentiveAbi, 'claim'>,
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
   * @returns {Promise<boolean>} - Returns true if successfully claimed
   */
  protected async claimRaw(
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
    params?: WriteParams<typeof cgdaIncentiveAbi, 'clawback'>,
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
   * @returns {Promise<boolean>} -  True if the assets were successfully clawbacked
   */
  public async clawbackRaw(
    payload: ClaimPayload,
    params?: WriteParams<typeof cgdaIncentiveAbi, 'clawback'>,
  ) {
    const { request, result } = await simulateCgdaIncentiveClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeCgdaIncentiveClawback(this._config, request);
    return { hash, result };
  }

  /**
   * Check if an incentive is claimable
   *
   * @public
   * @async
   * @param {ClaimPayload} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the incentive is claimable based on the data payload
   */
  public async isClaimable(
    payload: ClaimPayload,
    params?: ReadParams<typeof cgdaIncentiveAbi, 'isClaimable'>,
  ) {
    return await readCgdaIncentiveIsClaimable(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The current reward
   */
  public async currentReward(
    params?: ReadParams<typeof cgdaIncentiveAbi, 'currentReward'>,
  ) {
    return await readCgdaIncentiveCurrentReward(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
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

/**
 * Given a {@link CGDAIncentivePayload}, properly encode a `CGDAIncentive.InitPayload` for use with {@link CGDAIncentive} initialization.
 *
 * @param {CGDAIncentivePayload} param0
 * @param {Address} param0.asset - The address of the ERC20-like token
 * @param {bigint} param0.initialReward - The initial reward amount
 * @param {bigint} param0.rewardDecay - The amount to subtract from the current reward after each claim
 * @param {bigint} param0.rewardBoost - The amount by which the reward increases for each hour without a claim (continuous linear increase)
 * @param {bigint} param0.totalBudget - The total budget for the incentive
 * @returns {Hex}
 */
export function prepareCGDAIncentivePayload({
  asset,
  initialReward,
  rewardDecay,
  rewardBoost,
  totalBudget,
  manager,
}: CGDAIncentivePayload) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint256', name: 'initialReward' },
      { type: 'uint256', name: 'rewardDecay' },
      { type: 'uint256', name: 'rewardBoost' },
      { type: 'uint256', name: 'totalBudget' },
      { type: 'address', name: 'manager' },
    ],
    [asset, initialReward, rewardDecay, rewardBoost, totalBudget, manager],
  );
}
