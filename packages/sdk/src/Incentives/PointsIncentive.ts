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
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
  zeroHash,
} from 'viem';
import { PointsIncentive as PointsIncentiveBases } from '../../dist/deployments.json';
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

export { pointsIncentiveAbi };

/**
 * The object representation of a `PointsIncentive.InitPayload`
 *
 * @export
 * @interface PointsIncentivePayload
 * @typedef {PointsIncentivePayload}
 */
export interface PointsIncentivePayload {
  /**
   * The address of the points contract
   *
   * @type {Address}
   */
  venue: Address;
  /**
   * The selector for the issuance function on the points contract
   *
   * @type {Hex}
   */
  selector: Hex;
  /**
   * The reward amount issued for each claim
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   *  The maximum number of claims that can be made (one per address)
   *
   * @type {bigint}
   */
  limit: bigint;
}

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
export class PointsIncentive extends DeployableTarget<
  PointsIncentivePayload,
  typeof pointsIncentiveAbi
> {
  public override readonly abi = pointsIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(import.meta.env?.VITE_POINTS_INCENTIVE_BASE
      ? { 31337: import.meta.env.VITE_POINTS_INCENTIVE_BASE }
      : {}),
    ...(PointsIncentiveBases as Record<number, Address>),
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
   * The number of claims that have been made
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async claims(params?: ReadParams) {
    return await readPointsIncentiveClaims(this._config, {
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
    return await readPointsIncentiveCurrentReward(this._config, {
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
   * @returns {Promise<bigint>} The reward amount issued for each claim
   */
  public async reward(params?: ReadParams) {
    return await readPointsIncentiveReward(this._config, {
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
    return await readPointsIncentiveClaimed(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async venue(params?: ReadParams) {
    return await readPointsIncentiveVenue(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async limit(params?: ReadParams) {
    return await readPointsIncentiveLimit(this._config, {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<Hex>}
   */
  public async selector(params?: ReadParams) {
    return await readPointsIncentiveSelector(this._config, {
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
   * @returns {Promise<boolean>} -  True if the incentive was successfully claimed
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
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} -  True if the incentive was successfully claimed
   */
  protected async claimRaw(payload: ClaimPayload, params?: WriteParams) {
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
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} -  True if the incentive is claimable based on the data payload
   */
  public async isClaimable(payload: ClaimPayload, params?: ReadParams) {
    return await readPointsIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [payload.target, payload.data],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
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

  /**
   * Generates a top-up payload for the PointsIncentive contract.
   *
   * @public
   * @param {bigint} netAmount The net reward amount to be added to the incentive.
   * @returns {Hex} The ABI-encoded top-up payload.
   */
  public getTopupPayload(netAmount: bigint): Hex {
    return encodeAbiParameters(
      [
        { type: 'address', name: 'venue' },
        { type: 'bytes4', name: 'selector' },
        { type: 'uint256', name: 'amount' },
      ],
      [
        this.payload?.venue ?? zeroAddress,
        this.payload?.selector ?? '0x00000000',
        netAmount,
      ],
    );
  }

  /**
   * Builds the claim data for the PointsIncentive.
   *
   * @public
   * @returns {Hash} A `zeroHash`, as PointsIncentive doesn't require specific claim data.
   * @description This function returns `zeroHash` because PointsIncentive doesn't use any specific claim data.
   */
  public buildClaimData() {
    return zeroHash;
  }
}

/**
 * Given a {@link PointsIncentivePayload}, properly encode a `PointsIncentive.InitPayload` for use with {@link PointsIncentive} initialization.
 *
 * @param {PointsIncentivePayload} param0
 * @param {Address} param0.venue - The address of the points contract
 * @param {Hex} param0.selector - The selector for the issuance function on the points contract
 * @param {bigint} param0.reward - The reward amount issued for each claim
 * @param {bigint} param0.limit -  The maximum number of claims that can be made (one per address)
 * @returns {*}
 */
export const preparePointsIncentivePayload = ({
  venue,
  selector,
  reward,
  limit,
}: PointsIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'venue' },
      { type: 'bytes4', name: 'selector' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
    ],
    [venue, selector, reward, limit],
  );
};
