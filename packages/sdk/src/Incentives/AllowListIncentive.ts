import {
  allowListIncentiveAbi,
  readAllowListIncentiveAllowList,
  readAllowListIncentiveClaimed,
  readAllowListIncentiveClaims,
  readAllowListIncentiveIsClaimable,
  readAllowListIncentiveLimit,
  readAllowListIncentiveOwner,
  readAllowListIncentiveReward,
  simulateAllowListIncentiveClaim,
  writeAllowListIncentiveClaim,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  zeroHash,
} from 'viem';
import { AllowListIncentive as AllowListIncentiveBases } from '../../dist/deployments.json';
import { SimpleAllowList } from '../AllowLists/AllowList';
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

export { allowListIncentiveAbi };

/**
 * The object representation of a `AllowListIncentive.InitPayload`
 *
 * @export
 * @interface AllowListIncentivePayload
 * @typedef {AllowListIncentivePayload}
 */
export interface AllowListIncentivePayload {
  /**
   * The address to the allowlist to add claimers to.
   *
   * @type {Address}
   */
  allowList: Address;
  /**
   *  The maximum number of claims that can be made (one per address)
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * A generic `viem.Log` event with support for `AllowListIncentive` event types.
 *
 * @export
 * @typedef {AllowListIncentiveLog}
 * @template {ContractEventName<
 *     typeof allowListIncentiveAbi
 *   >} [event=ContractEventName<typeof allowListIncentiveAbi>]
 */
export type AllowListIncentiveLog<
  event extends ContractEventName<
    typeof allowListIncentiveAbi
  > = ContractEventName<typeof allowListIncentiveAbi>,
> = GenericLog<typeof allowListIncentiveAbi, event>;

/**
 * An incentive implementation that grants the claimer a slot on an {SimpleAllowList}
 * In order for any claim to be successful:
 * - The claimer must not already be on the allow list; and
 * - The maximum number of claims must not have been reached; and
 * - This contract must be authorized to modify the allow list
 *
 * @export
 * @class AllowListIncentive
 * @typedef {AllowListIncentive}
 * @extends {DeployableTarget<AllowListIncentivePayload>}
 */
export class AllowListIncentive extends DeployableTarget<
  AllowListIncentivePayload,
  typeof allowListIncentiveAbi
> {
  public override readonly abi = allowListIncentiveAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(import.meta.env?.VITE_ALLOWLIST_INCENTIVE_BASE
      ? { 31337: import.meta.env.VITE_ALLOWLIST_INCENTIVE_BASE }
      : {}),
    ...(AllowListIncentiveBases as Record<number, Address>),
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
   * The owner of the allowList
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async owner(params?: ReadParams) {
    return await readAllowListIncentiveOwner(this._config, {
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
    return await readAllowListIncentiveClaims(this._config, {
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
  public async reward(params?: ReadParams) {
    return await readAllowListIncentiveReward(this._config, {
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
  public async claimed(address: Address, params?: ReadParams) {
    return await readAllowListIncentiveClaimed(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The {@link SimpleAllowList} contract
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<SimpleAllowList>}
   */
  public async allowList(params?: ReadParams): Promise<SimpleAllowList> {
    const address = await readAllowListIncentiveAllowList(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    return new SimpleAllowList(
      { config: this._config, account: this._account },
      address,
    );
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
    return await readAllowListIncentiveLimit(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Claim a slot on the {@link SimpleAllowList}
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<true>} - return true if successful, otherwise revert
   */
  protected async claim(
    payload: Pick<ClaimPayload, 'target'>,
    params?: WriteParams,
  ) {
    return await this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim a slot on the {@link SimpleAllowList}
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - return true if successful, otherwise revert
   */
  protected async claimRaw(
    payload: Pick<ClaimPayload, 'target'>,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateAllowListIncentiveClaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareClaimPayload(payload)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeAllowListIncentiveClaim(this._config, request);
    return { hash, result };
  }

  /**
   * Check if an incentive is claimable
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?ReadParams} [params]
   * @returns {Promise<boolean>} - True if the incentive is claimable based on the data payload
   */
  public async isClaimable(
    payload: Pick<ClaimPayload, 'target'>,
    params?: ReadParams,
  ) {
    return await readAllowListIncentiveIsClaimable(this._config, {
      address: this.assertValidAddress(),
      args: [payload.target, '0x'],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Check if an incentive can potentially be claimed by comparing limit and total claims. Does not take requesting user or underlying allowlist into account.
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
   * Check how many claims remain by comparing limit and total claims. Does not take requesting user or underlying allowlist into account.
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
   * @param {?AllowListIncentivePayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: AllowListIncentivePayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: allowListIncentiveAbi,
      bytecode: bytecode as Hex,
      args: [prepareAllowListIncentivePayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }

  /**
   * Generates a top-up payload for the AllowListIncentive contract.
   *
   * @public
   * @param {bigint} netAmount The net number of slots to be added to the allowlist.
   * @returns {Hex} The ABI-encoded top-up payload.
   */
  public getTopupPayload(netAmount: bigint): Hex {
    return encodeAbiParameters(
      [
        { type: 'address', name: 'allowList' },
        { type: 'uint256', name: 'limit' },
      ],
      [this.payload?.allowList ?? zeroHash, netAmount],
    );
  }

  /**
   * Builds the claim data for the AllowListIncentive.
   *
   * @public
   * @returns {Hash} A `zeroHash`, as AllowListIncentive doesn't require specific claim data.
   * @description This function returns `zeroHash` because AllowListIncentive doesn't use any specific claim data.
   */
  public buildClaimData() {
    return zeroHash;
  }
}

/**
 * Given a {@link AllowListIncentivePayload}, properly encode a `AllowListIncentive.InitPayload` for use with {@link AllowListIncentive} initialization.
 *
 * @param {AllowListIncentivePayload} param0
 * @param {Address} param0.allowList - The address to the allowlist to add claimers to.
 * @param {bigint} param0.limit -  The maximum number of claims that can be made (one per address)
 * @returns {Hex}
 */
export const prepareAllowListIncentivePayload = ({
  allowList,
  limit,
}: AllowListIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'allowList' },
      { type: 'uint256', name: 'limit' },
    ],
    [allowList, limit],
  );
};
