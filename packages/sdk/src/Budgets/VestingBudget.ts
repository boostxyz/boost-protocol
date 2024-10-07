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
  simulateVestingBudgetClawback,
  simulateVestingBudgetDisburse,
  simulateVestingBudgetDisburseBatch,
  simulateVestingBudgetSetAuthorized,
  vestingBudgetAbi,
  writeVestingBudgetAllocate,
  writeVestingBudgetClawback,
  writeVestingBudgetDisburse,
  writeVestingBudgetDisburseBatch,
  writeVestingBudgetSetAuthorized,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import { getAccount } from '@wagmi/core';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTargetWithRBAC } from '../Deployable/DeployableTargetWithRBAC';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import {
  type FungibleTransferPayload,
  prepareFungibleTransfer,
} from '../transfers';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';

export { vestingBudgetAbi };
export type { FungibleTransferPayload };
/**
 * The object representation of a `VestingBudget.InitPayload`
 *
 * @export
 * @interface VestingBudgetPayload
 * @typedef {VestingBudgetPayload}
 */
export interface VestingBudgetPayload {
  /**
   * The budget's owner.
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
   *
   * @type {Address[]}
   */
  authorized: Address[];
  /**
   * The timestamp at which the vesting schedule begins
   *
   * @type {bigint}
   */
  start: bigint;
  /**
   * The duration of the vesting schedule (in seconds)
   *
   * @type {bigint}
   */
  duration: bigint;
  /**
   * The duration of the cliff period (in seconds)
   *
   * @type {bigint}
   */
  cliff: bigint;
}

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
 * - This contract is {Ownable} to enable the owner to allocate to the budget, clawback and disburse assets from the budget, and to set authorized addresses. Additionally, the owner can transfer ownership of the budget to another address. Doing so has no effect on the vesting schedule.
 *
 * @export
 * @class VestingBudget
 * @typedef {VestingBudget}
 * @extends {DeployableTargetWithRBAC<VestingBudgetPayload>}
 */
export class VestingBudget extends DeployableTargetWithRBAC<
  VestingBudgetPayload,
  typeof vestingBudgetAbi
> {
  public override readonly abi = vestingBudgetAbi;
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
  public static override registryType: RegistryType = RegistryType.BUDGET;

  /**
   * Get the owner of the budget
   *
   * @public
   * @param {?ReadParams} [params]
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
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
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocate(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'allocate'>,
  ) {
    return await this.awaitResult(this.allocateRaw(transfer, params));
  }

  /**
   *  Allocates assets to the budget.
   *  The caller must have already approved the contract to transfer the asset
   *  If the asset transfer fails, the allocation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the allocation was successful
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
   * Clawbacks assets from the budget.
   * Only the owner can directly clawback assets from the budget
   * If the amount is zero, the entire balance of the asset will be transferred to the receiver
   * If the asset transfer fails, the reclamation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async clawback(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'clawback'>,
  ) {
    return await this.awaitResult(this.clawbackRaw(transfer, params));
  }

  /**
   * Clawbacks assets from the budget.
   * Only the owner can directly clawback assets from the budget
   * If the amount is zero, the entire balance of the asset will be transferred to the receiver
   * If the asset transfer fails, the reclamation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the request was successful
   */
  public async clawbackRaw(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'clawback'>,
  ) {
    const { request, result } = await simulateVestingBudgetClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareFungibleTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetClawback(this._config, request);
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburse(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'disburse'>,
  ) {
    return await this.awaitResult(this.disburseRaw(transfer, params));
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the disbursement was successful
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatch(
    transfers: FungibleTransferPayload[],
    params?: WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>,
  ) {
    return await this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload>} transfers
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if all disbursements were successful
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
   * Get the end time of the vesting schedule
   *
   * @public
   * @param {?ReadParams} [params]
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
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"] -  The address of the asset (or the zero address for native assets)
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public total(
    asset: Address = zeroAddress,
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
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"] -  The address of the asset (or the zero address for native assets)
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The amount of assets currently available for distribution
   */
  public available(
    asset: Address = zeroAddress,
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
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"]
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The amount of assets distributed
   */
  public distributed(
    asset: Address = zeroAddress,
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

/**
 * Given a {@link VestingBudgetPayload}, properly encode a `VestingBudget.InitPayload` for use with {@link VestingBudget} initialization.
 *
 * @param {VestingBudgetPayload} param0
 * @param {Address} param0.owner - The budget's owner.
 * @param {{}} param0.authorized - List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
 * @param {bigint} param0.start - The timestamp at which the vesting schedule begins
 * @param {bigint} param0.duration - The duration of the vesting schedule (in seconds)
 * @param {bigint} param0.cliff - The duration of the cliff period (in seconds)
 * @returns {Hex}
 */
export function prepareVestingBudgetPayload({
  owner,
  authorized,
  start,
  duration,
  cliff,
}: VestingBudgetPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'VestingBudgetPayload payload',
      'struct VestingBudgetPayload { address owner; address[] authorized; uint64 start; uint64 duration; uint64 cliff; }',
    ]),
    [{ owner, authorized, start, duration, cliff }],
  );
}
