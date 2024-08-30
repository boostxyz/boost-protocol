import {
  readVestingBudgetAvailable,
  readVestingBudgetCliff,
  readVestingBudgetDistributed,
  readVestingBudgetDuration,
  readVestingBudgetEnd,
  readVestingBudgetIsAuthorized,
  readVestingBudgetOwner,
  readVestingBudgetStart,
  readVestingBudgetTotal,
  simulateVestingBudgetAllocate,
  simulateVestingBudgetDisburse,
  simulateVestingBudgetDisburseBatch,
  simulateVestingBudgetReclaim,
  simulateVestingBudgetSetAuthorized,
  vestingBudgetAbi,
  writeVestingBudgetAllocate,
  writeVestingBudgetDisburse,
  writeVestingBudgetDisburseBatch,
  writeVestingBudgetReclaim,
  writeVestingBudgetSetAuthorized,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import { getAccount } from '@wagmi/core';
import {
  type Address,
  type ContractEventName,
  type Hex,
  zeroAddress,
} from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import {
  type FungibleTransferPayload,
  type GenericLog,
  type ReadParams,
  RegistryType,
  type VestingBudgetPayload,
  type WriteParams,
  prepareFungibleTransfer,
  prepareVestingBudgetPayload,
} from '../utils';

export { vestingBudgetAbi };
export type { VestingBudgetPayload };

/**
 * A generic `viem.Log` event with support for `VestingBudget` event types.
 *
 * @export
 * @typedef {VestingBudgetLog}
 * @template {ContractEventName<typeof vestingBudgetAbi>} [event=ContractEventName<
 *     typeof vestingBudgetAbi
 *   >]
 */
export type VestingBudgetLog<
  event extends ContractEventName<typeof vestingBudgetAbi> = ContractEventName<
    typeof vestingBudgetAbi
  >,
> = GenericLog<typeof vestingBudgetAbi, event>;

/**
 * A vesting-based budget implementation that allows for the distribution of assets over time
 * Take note of the following when making use of this budget type:
 * - The budget is designed to manage native and ERC20 token balances only. Using rebasing tokens or other non-standard token types may result in unexpected behavior.
 * - Any assets allocated to this type of budget will follow the vesting schedule as if they were locked from the beginning, which is to say that, if the vesting has already started, some portion of the assets will be immediately available for distribution.
 * - A vesting budget can also act as a time-lock, unlocking all assets at a specified point in time. To release assets at a specific time rather than vesting them over time, set the `start` to the desired time and the `duration` to zero.
 * - This contract is {Ownable} to enable the owner to allocate to the budget, reclaim and disburse assets from the budget, and to set authorized addresses. Additionally, the owner can transfer ownership of the budget to another address. Doing so has no effect on the vesting schedule.
 *
 * @export
 * @class VestingBudget
 * @typedef {VestingBudget}
 * @extends {DeployableTarget<VestingBudgetPayload>}
 */
export class VestingBudget extends DeployableTarget<
  VestingBudgetPayload,
  typeof vestingBudgetAbi
> {
  public override readonly abi = vestingBudgetAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_VESTING_BUDGET_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.BUDGET;

  /**
   * Get the owner of the budget
   *
   * @public
   * @param {?ReadParams<typeof vestingBudgetAbi, 'owner'>} [params]
   * @returns {Promise<Address>}
   */
  public owner(params?: ReadParams<typeof vestingBudgetAbi, 'owner'>) {
    return readVestingBudgetOwner(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The timestamp at which the vesting schedule begins
   *
   * @public
   * @param {?ReadParams<typeof vestingBudgetAbi, 'start'>} [params]
   * @returns {*}
   */
  public start(params?: ReadParams<typeof vestingBudgetAbi, 'start'>) {
    return readVestingBudgetStart(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The duration of the vesting schedule (in seconds)
   *
   * @public
   * @param {?ReadParams<typeof vestingBudgetAbi, 'duration'>} [params]
   * @returns {*}
   */
  public duration(params?: ReadParams<typeof vestingBudgetAbi, 'duration'>) {
    return readVestingBudgetDuration(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * The duration of the cliff period (in seconds)
   *
   * @public
   * @param {?ReadParams<typeof vestingBudgetAbi, 'cliff'>} [params]
   * @returns {*}
   */
  public cliff(params?: ReadParams<typeof vestingBudgetAbi, 'cliff'>) {
    return readVestingBudgetCliff(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   *  Allocates assets to the budget.
   *  The caller must have already approved the contract to transfer the asset
   *  If the asset transfer fails, the allocation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'allocate'>} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocate(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'allocate'>,
  ) {
    return this.awaitResult(this.allocateRaw(transfer, params));
  }

  /**
   *  Allocates assets to the budget.
   *  The caller must have already approved the contract to transfer the asset
   *  If the asset transfer fails, the allocation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'allocate'>} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocateRaw(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'allocate'>,
  ) {
    const { request, result } = await simulateVestingBudgetAllocate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareFungibleTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetAllocate(this._config, request);
    return { hash, result };
  }

  /**
   * Reclaims assets from the budget.
   * Only the owner can directly reclaim assets from the budget
   * If the amount is zero, the entire balance of the asset will be transferred to the receiver
   * If the asset transfer fails, the reclamation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async reclaim(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(transfer, params));
  }

  /**
   * Reclaims assets from the budget.
   * Only the owner can directly reclaim assets from the budget
   * If the amount is zero, the entire balance of the asset will be transferred to the receiver
   * If the asset transfer fails, the reclamation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async reclaimRaw(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateVestingBudgetReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareFungibleTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetReclaim(this._config, request);
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburse'>} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburse(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(this.disburseRaw(transfer, params));
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburse'>} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburseRaw(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'disburse'>,
  ) {
    const { request, result } = await simulateVestingBudgetDisburse(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareFungibleTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetDisburse(this._config, request);
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload>} transfers
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatch(
    transfers: FungibleTransferPayload[],
    params?: WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload>} transfers
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatchRaw(
    transfers: FungibleTransferPayload[],
    params?: WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>,
  ) {
    const { request, result } = await simulateVestingBudgetDisburseBatch(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [transfers.map(prepareFungibleTransfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetDisburseBatch(this._config, request);
    return { hash, result };
  }

  /**
   * Set the authorized status of the given accounts
   * The mechanism for managing authorization is left to the implementing contract
   *
   * @public
   * @async
   * @param {Address[]} addresses - The accounts to authorize or deauthorize
   * @param {boolean[]} allowed - The authorization status for the given accounts
   * @param {?WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>,
  ) {
    return this.awaitResult(this.setAuthorizedRaw(addresses, allowed, params));
  }

  /**
   * Set the authorized status of the given accounts
   * The mechanism for managing authorization is left to the implementing contract
   *
   * @public
   * @async
   * @param {Address[]} addresses - The accounts to authorize or deauthorize
   * @param {boolean[]} allowed - The authorization status for the given accounts
   * @param {?WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>,
  ) {
    const { request, result } = await simulateVestingBudgetSetAuthorized(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetSetAuthorized(this._config, request);
    return { hash, result };
  }

  /**
   * Check if the given account is authorized to use the budget
   *
   * @public
   * @param {Address} account
   * @param {?ReadParams<typeof vestingBudgetAbi, 'isAuthorized'>} [params]
   * @returns {Promise<boolean>} - True if the account is authorized
   */
  public isAuthorized(
    account: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'isAuthorized'>,
  ) {
    return readVestingBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the end time of the vesting schedule
   *
   * @public
   * @param {?ReadParams<typeof vestingBudgetAbi, 'end'>} [params]
   * @returns {Promise<bigint>}
   */
  public end(params?: ReadParams<typeof vestingBudgetAbi, 'end'>) {
    return readVestingBudgetEnd(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the total amount of assets allocated to the budget, including any that have been distributed
   * This is equal to the sum of the total current balance and the total distributed amount
   *
   * @public
   * @param {Address} asset -  The address of the asset (or the zero address for native assets)
   * @param {?ReadParams<typeof vestingBudgetAbi, 'total'>} [params]
   * @returns {Promise<bigint>}
   */
  public total(
    asset: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'total'>,
  ) {
    return readVestingBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the amount of assets available for distribution from the budget as of the current block timestamp
   * This is equal to the total vested amount minus any already distributed
   *
   * @public
   * @param {Address} asset -  The address of the asset (or the zero address for native assets)
   * @param {?ReadParams<typeof vestingBudgetAbi, 'available'>} [params]
   * @returns {Promise<bigint>} - The amount of assets currently available for distribution
   */
  public available(
    asset: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'available'>,
  ) {
    return readVestingBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the amount of assets that have been distributed from the budget
   *
   * @public
   * @param {Address} asset
   * @param {?ReadParams<typeof vestingBudgetAbi, 'distributed'>} [params]
   * @returns {Promise<bigint>} - The amount of assets distributed
   */
  public distributed(
    asset: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'distributed'>,
  ) {
    return readVestingBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?VestingBudgetPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: VestingBudgetPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    if (!payload.owner || payload.owner === zeroAddress) {
      const owner = options.account
        ? options.account.address
        : options.config
          ? getAccount(options.config).address
          : this._account?.address;
      if (owner) {
        payload.owner = owner;
      } else {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }
    return {
      abi: vestingBudgetAbi,
      bytecode: bytecode as Hex,
      args: [prepareVestingBudgetPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
