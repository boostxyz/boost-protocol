import {
  managedBudgetWithFeesAbi,
  readManagedBudgetAvailable,
  readManagedBudgetDistributed,
  readManagedBudgetOwner,
  readManagedBudgetTotal,
  readManagedBudgetWithFeesManagementFee,
  simulateManagedBudgetAllocate,
  simulateManagedBudgetClawback,
  simulateManagedBudgetClawbackFromTarget,
  simulateManagedBudgetDisburse,
  simulateManagedBudgetDisburseBatch,
  simulateManagedBudgetWithFeesPayManagementFee,
  simulateManagedBudgetWithFeesSetManagementFee,
  writeManagedBudgetAllocate,
  writeManagedBudgetClawback,
  writeManagedBudgetClawbackFromTarget,
  writeManagedBudgetDisburse,
  writeManagedBudgetDisburseBatch,
  writeManagedBudgetWithFeesPayManagementFee,
  writeManagedBudgetWithFeesSetManagementFee,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/budgets/ManagedBudgetWithFees.sol/ManagedBudgetWithFees.json';
import { getAccount } from '@wagmi/core';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from 'viem';
import { ManagedBudgetWithFees as ManagedBudgetWithFeesBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  DeployableTargetWithRBAC,
  type Roles,
} from '../Deployable/DeployableTargetWithRBAC';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type {
  ERC1155TransferPayload,
  FungibleTransferPayload,
} from '../transfers';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';
import { prepareTransfer } from './ManagedBudget';
export { managedBudgetWithFeesAbi };
export type { ERC1155TransferPayload, FungibleTransferPayload };

/**
 * The object representation of a `ManagedBudgetWithFeesPayload.InitPayload`
 *
 * @export
 * @interface ManagedBudgetWithFeesPayload
 * @typedef {ManagedBudgetWithFeesPayload}
 */
export interface ManagedBudgetWithFeesPayload {
  /**
   * The budget's owner
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
   * List of roles to assign to the corresponding account by index.
   *
   * @type {Roles[]}
   */
  roles: Roles[];
  /**
   * Management Fee rate for incentive payouts
   *
   * @type {bigint}
   */
  managementFee: bigint;
}

/**
 * A generic `viem.Log` event with support for `ManagedBudgetWithFees` event types.
 *
 * @export
 * @typedef {ManagedBudgetWithFeesLog}
 * @template {ContractEventName<typeof managedBudgetWithFeesAbi>} [event=ContractEventName<
 *     typeof managedBudgetWithFeesAbi
 *   >]
 */
export type ManagedBudgetWithFeesLog<
  event extends ContractEventName<
    typeof managedBudgetWithFeesAbi
  > = ContractEventName<typeof managedBudgetWithFeesAbi>,
> = GenericLog<typeof managedBudgetWithFeesAbi, event>;

/**
 * A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
 * This type of budget supports ETH, ERC20, and ERC1155 assets only
 *
 * @export
 * @class ManagedBudgetWithFees
 * @typedef {ManagedBudgetWithFees}
 * @extends {DeployableTargetWithRBAC<ManagedBudgetWithFeesPayload>}
 */
export class ManagedBudgetWithFees extends DeployableTargetWithRBAC<
  ManagedBudgetWithFeesPayload,
  typeof managedBudgetWithFeesAbi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = managedBudgetWithFeesAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(import.meta.env?.VITE_MANAGED_BUDGET_WITH_FEES_BASE
      ? { 31337: import.meta.env.VITE_MANAGED_BUDGET_WITH_FEES_BASE }
      : {}),
    ...(ManagedBudgetWithFeesBases as Record<number, Address>),
  };
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.BUDGET;

  /**
   *  Allocates assets to the budget.
   *  The caller must have already approved the contract to transfer the asset
   *  If the asset transfer fails, the allocation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocate(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams,
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
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the allocation was successful
   */
  public async allocateRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateManagedBudgetAllocate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetAllocate(this._config, request);
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
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async clawback(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams,
  ) {
    return await this.awaitResult(this.clawbackRaw(transfer, params));
  }

  /**
   * Clawbacks assets from the budget.
   * Only the owner or admin can directly clawback assets from the budget
   * If the amount is zero, the entire balance of the asset will be transferred to the receiver
   * If the asset transfer fails, the reclamation will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the request was successful
   */
  public async clawbackRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateManagedBudgetClawback(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetClawback(this._config, request);
    return { hash, result };
  }

  /**
   * Clawbacks assets from an incentive associated with the budget via Boost Core.
   * Only the authorized users can clawback assets from an incentive.
   * If the asset transfer fails, the reclamation will revert.
   *
   * @example
   * ```ts
   * const [amount, address] = await budgets.budget.clawbackFromTarget(
   *   core.assertValidAddress(),
   *   erc20Incentive.buildClawbackData(1n),
   *   boost.id,
   *   incentiveId,
   * );
   * ```
   * @public
   * @async
   * @param {Address} target - The address of a contract implementing clawback, typically `BoostCore`
   * @param {Hex} data - The encoded data payload for the clawback, can be acquired with `incentive.buildClawbackData`
   * @param {bigint | number} boostId - The ID of the boost
   * @param {bigint | number} incentiveId - The ID of the incentive
   * @param {?WriteParams} [params] - Optional write parameters
   * @returns {Promise<[bigint, Address]>} - Returns a tuple of amount reclaimed and the address reclaimed from
   */
  public async clawbackFromTarget(
    target: Address,
    data: Hex,
    boostId: bigint | number,
    incentiveId: bigint | number,
    params?: WriteParams,
  ) {
    return await this.awaitResult(
      this.clawbackFromTargetRaw(target, data, boostId, incentiveId, params),
    );
  }

  /**
   * Clawbacks assets from an incentive associated with the budget via Boost Core.
   * Only the authorized users can clawback assets from an incentive.
   * If the asset transfer fails, the reclamation will revert.
   *
   * @example
   * ```ts
   * const { hash, result: [ amount, address ] } = await budgets.budget.clawbackFromTargetRaw(
   *   core.assertValidAddress(),
   *   erc20Incentive.buildClawbackData(1n),
   *   boost.id,
   *   incentiveId,
   * );
   * ```
   * @public
   * @async
   * @param {Address} target - The address of a contract implementing clawback, typically `BoostCore`
   * @param {Hex} data - The encoded data payload for the clawback, can be acquired with `incentive.buildClawbackData`
   * @param {bigint | number} boostId - The ID of the boost
   * @param {bigint | number} incentiveId - The ID of the incentive
   * @param {?WriteParams} [params] - Optional write parameters
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - Returns transaction hash and simulated result
   */
  public async clawbackFromTargetRaw(
    target: Address,
    data: Hex,
    boostId: bigint | number,
    incentiveId: bigint | number,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateManagedBudgetClawbackFromTarget(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [target, data, BigInt(boostId), BigInt(incentiveId)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetClawbackFromTarget(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams,
  ) {
    return await this.awaitResult(this.disburseRaw(transfer, params));
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the disbursement was successful
   */
  public async disburseRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateManagedBudgetDisburse(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetDisburse(this._config, request);
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams,
  ) {
    return await this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if all disbursements were successful
   */
  public async disburseBatchRaw(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateManagedBudgetDisburseBatch(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [transfers.map(prepareTransfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetDisburseBatch(this._config, request);
    return { hash, result };
  }

  /**
   * Pays out reserved management fees to the boost owner
   * for a given incentive
   *
   * @public
   * @async
   * @param {bigint | string} boostId
   * @param {bigint | string} incentiveId
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the payout was successful
   */
  public async payManagementFee(
    boostId: bigint | string,
    incentiveId: bigint | string,
    params?: WriteParams,
  ) {
    return await this.awaitResult(
      this.payManagementFeeRaw(boostId, incentiveId, params),
    );
  }

  /**
   * Pays out reserved management fees to the boost owner
   *
   * @public
   * @async
   * @param bigint boostId
   * @param bigint incentiveId
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the payout was successful
   */
  public async payManagementFeeRaw(
    boostId: bigint | string,
    incentiveId: bigint | string,
    params?: WriteParams,
  ) {
    const { request, result } =
      await simulateManagedBudgetWithFeesPayManagementFee(this._config, {
        address: this.assertValidAddress(),
        args: [boostId, incentiveId],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeManagedBudgetWithFeesPayManagementFee(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Sets the management fee for the budget
   * @public
   * @async
   * @param {bigint} managementFee
   * @param {?WriteParams} [params]
   * @returns {Promise<void>} - will throw if the transaction fails
   */
  public async setManagementFee(managementFee: bigint, params?: WriteParams) {
    return await this.awaitResult(
      this.setManagementFeeRaw(managementFee, params),
    );
  }

  /**
   * Sets the management fee for the budget
   * @public
   * @async
   * @param {bigint} managementFee
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setManagementFeeRaw(
    managementFee: bigint,
    params?: WriteParams,
  ) {
    const { request, result } =
      await simulateManagedBudgetWithFeesSetManagementFee(this._config, {
        address: this.assertValidAddress(),
        args: [managementFee],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeManagedBudgetWithFeesSetManagementFee(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Get the configured management fee for the budget
   * @public
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The management fee
   */
  public async managementFee(params?: ReadParams) {
    return await readManagedBudgetWithFeesManagementFee(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the owner of the budget
   *
   * @public
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public owner(params?: ReadParams) {
    return readManagedBudgetOwner(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the total amount of assets allocated to the budget, including any that have been distributed
   * If a tokenId is provided, get the total amount of ERC1155 assets allocated to the budget, including any that have been distributed
   *
   * @public
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"] - The address of the asset
   * @param {?(bigint | undefined)} [tokenId] - The ID of the token
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The total amount of assets
   */
  public total(
    asset: Address = zeroAddress,
    tokenId?: bigint | undefined,
    params?: ReadParams,
  ) {
    return readManagedBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the amount of assets available for distribution from the budget.
   * If a tokenId is provided, get the amount of ERC1155 assets available for distribution from the budget
   *
   * @public
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"]
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The amount of assets available
   */
  public available(
    asset: Address = zeroAddress,
    tokenId?: bigint | undefined,
    params?: ReadParams,
  ) {
    return readManagedBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the amount of assets that have been distributed from the budget.
   * If a tokenId is provided, get the amount of ERC1155 assets that have been distributed from the budget
   *
   * @public
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"]
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The amount of assets distributed
   */
  public distributed(
    asset: Address = zeroAddress,
    tokenId?: bigint | undefined,
    params?: ReadParams,
  ) {
    return readManagedBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?ManagedBudgetWithFeesPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ManagedBudgetWithFeesPayload,
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
      abi: managedBudgetWithFeesAbi,
      bytecode: bytecode as Hex,
      args: [prepareManagedBudgetWithFeesPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}

/**
 * Given a {@link ManagedBudgetWithFeesPayload}, properly encode a `ManagedBudgetWithFees.InitPayload` for use with {@link ManagedBudgetWithFees} initialization.
 *
 * @param {ManagedBudgetWithFeesPayload} param0
 * @param {Address} param0.owner - The budget's owner
 * @param {{}} param0.authorized - List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
 * @param {{}} param0.roles - List of roles to assign to the corresponding account by index.
 * @returns {Hex}
 */
export const prepareManagedBudgetWithFeesPayload = ({
  owner,
  authorized,
  roles,
  managementFee,
}: ManagedBudgetWithFeesPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'ManagedBudgetWithFeesPayload payload',
      'struct ManagedBudgetWithFeesPayload { address owner; address[] authorized; uint256[] roles; uint256 managementFee; }',
    ]),
    [
      {
        owner,
        authorized,
        roles: roles as unknown as Array<bigint>,
        managementFee,
      },
    ],
  );
};
