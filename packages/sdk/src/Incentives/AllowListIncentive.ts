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
import type { Address, ContractEventName, Hex } from 'viem';
import { SimpleAllowList } from '../AllowLists/AllowList';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  type AllowListIncentivePayload,
  type ClaimPayload,
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
  prepareAllowListIncentivePayload,
  prepareClaimPayload,
} from '../utils';

export { allowListIncentiveAbi };
export type { AllowListIncentivePayload };

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
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_ALLOWLIST_INCENTIVE_BASE;
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'owner'>} [params]
   * @returns {unknown}
   */
  public async owner(
    params?: ReadParams<typeof allowListIncentiveAbi, 'owner'>,
  ) {
    return readAllowListIncentiveOwner(this._config, {
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'claims'>} [params]
   * @returns {Promise<bigint>}
   */
  public async claims(
    params?: ReadParams<typeof allowListIncentiveAbi, 'claims'>,
  ) {
    return readAllowListIncentiveClaims(this._config, {
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'reward'>} [params]
   * @returns {Promise<bigint>}
   */
  public async reward(
    params?: ReadParams<typeof allowListIncentiveAbi, 'reward'>,
  ) {
    return readAllowListIncentiveReward(this._config, {
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'claimed'>} [params]
   * @returns {Promise<boolean>}
   */
  public async claimed(
    address: Address,
    params?: ReadParams<typeof allowListIncentiveAbi, 'claimed'>,
  ) {
    return readAllowListIncentiveClaimed(this._config, {
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'allowList'>} [params]
   * @returns {Promise<SimpleAllowList>}
   */
  public async allowList(
    params?: ReadParams<typeof allowListIncentiveAbi, 'allowList'>,
  ): Promise<SimpleAllowList> {
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'limit'>} [params]
   * @returns {unknown}
   */
  public async limit(
    params?: ReadParams<typeof allowListIncentiveAbi, 'limit'>,
  ) {
    return readAllowListIncentiveLimit(this._config, {
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
   * @param {?WriteParams<typeof allowListIncentiveAbi, 'claim'>} [params]
   * @returns {Promise<true>} - return true if successful, otherwise revert
   */
  public async claim(
    payload: Pick<ClaimPayload, 'target'>,
    params?: WriteParams<typeof allowListIncentiveAbi, 'claim'>,
  ) {
    return this.awaitResult(this.claimRaw(payload, params));
  }

  /**
   * Claim a slot on the {@link SimpleAllowList}
   *
   * @public
   * @async
   * @param {Pick<ClaimPayload, 'target'>} payload
   * @param {?WriteParams<typeof allowListIncentiveAbi, 'claim'>} [params]
   * @returns {Promise<true>} - return true if successful, otherwise revert
   */
  public async claimRaw(
    payload: Pick<ClaimPayload, 'target'>,
    params?: WriteParams<typeof allowListIncentiveAbi, 'claim'>,
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
   * @param {?ReadParams<typeof allowListIncentiveAbi, 'isClaimable'>} [params]
   * @returns {Promise<boolean>} - True if the incentive is claimable based on the data payload
   */
  public async isClaimable(
    payload: Pick<ClaimPayload, 'target'>,
    params?: ReadParams<typeof allowListIncentiveAbi, 'isClaimable'>,
  ) {
    return readAllowListIncentiveIsClaimable(this._config, {
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
}
