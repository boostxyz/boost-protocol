import {
  managedBudgetAbi,
  readManagedBudgetAvailable,
  readManagedBudgetDistributed,
  readManagedBudgetHasAllRoles,
  readManagedBudgetHasAnyRole,
  readManagedBudgetIsAuthorized,
  readManagedBudgetOwner,
  readManagedBudgetRolesOf,
  readManagedBudgetTotal,
  simulateManagedBudgetAllocate,
  simulateManagedBudgetClawback,
  simulateManagedBudgetDisburse,
  simulateManagedBudgetDisburseBatch,
  simulateManagedBudgetGrantRoles,
  simulateManagedBudgetRevokeRoles,
  simulateManagedBudgetSetAuthorized,
  writeManagedBudgetAllocate,
  writeManagedBudgetClawback,
  writeManagedBudgetDisburse,
  writeManagedBudgetDisburseBatch,
  writeManagedBudgetGrantRoles,
  writeManagedBudgetRevokeRoles,
  writeManagedBudgetSetAuthorized,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/budgets/ManagedBudget.sol/ManagedBudget.json';
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
import {
  DeployableUnknownOwnerProvidedError,
  UnknownTransferPayloadSupplied,
} from '../errors';
import {
  type ERC1155TransferPayload,
  type FungibleTransferPayload,
  type GenericLog,
  type ManagedBudgetPayload,
  type ReadParams,
  RegistryType,
  type WriteParams,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
  prepareManagedBudgetPayload,
} from '../utils';

export { managedBudgetAbi };
export type {
  ERC1155TransferPayload,
  FungibleTransferPayload,
  ManagedBudgetPayload,
};

/**
 * Enum representing available roles for use in the `ManagedBudget`.
 * `MANAGER` can disburse funds.
 * `ADMIN` can additionally manage authorized users on the budget.
 *
 * @type {{ readonly MANAGER: 1n; readonly ADMIN_ROLE: 2n; }}
 */
export const ManagedBudgetRoles = {
  MANAGER: 1n,
  ADMIN: 2n,
} as const;

/**
 * A generic `viem.Log` event with support for `ManagedBudget` event types.
 *
 * @export
 * @typedef {ManagedBudgetLog}
 * @template {ContractEventName<typeof managedBudgetAbi>} [event=ContractEventName<
 *     typeof managedBudgetAbi
 *   >]
 */
export type ManagedBudgetLog<
  event extends ContractEventName<typeof managedBudgetAbi> = ContractEventName<
    typeof managedBudgetAbi
  >,
> = GenericLog<typeof managedBudgetAbi, event>;

/**
 * Typeguard to determine if a transfer payload is a Fungible Transfer
 *
 * @export
 * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
 * @returns {transfer is FungibleTransferPayload}
 */
export function isFungibleTransfer(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
): transfer is FungibleTransferPayload {
  return (transfer as ERC1155TransferPayload).tokenId === undefined;
}

/**
 * Typeguard to determine if a transfer payload is an ERC1155 Transfer
 *
 * @export
 * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
 * @returns {transfer is ERC1155TransferPayload}
 */
export function isERC1155TransferPayload(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
): transfer is ERC1155TransferPayload {
  return (transfer as ERC1155TransferPayload).tokenId !== undefined;
}

/**
 * Given either a Fungible transfer, or ERC1155 transfer, will properly encode parameters for transfers, claims, disbursements, allocations, etc.
 *
 * @export
 * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
 * @returns {*}
 * @throws {@link UnknownTransferPayloadSupplied}
 */
export function prepareTransfer(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
) {
  if (isFungibleTransfer(transfer)) {
    return prepareFungibleTransfer(transfer);
  } else if (isERC1155TransferPayload(transfer)) {
    return prepareERC1155Transfer(transfer);
  } else throw new UnknownTransferPayloadSupplied(transfer);
}

/**
 * A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
 * This type of budget supports ETH, ERC20, and ERC1155 assets only
 *
 * @export
 * @class ManagedBudget
 * @typedef {ManagedBudget}
 * @extends {DeployableTarget<ManagedBudgetPayload>}
 */
export class ManagedBudget extends DeployableTarget<
  ManagedBudgetPayload,
  typeof managedBudgetAbi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = managedBudgetAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_MANAGED_BUDGET_BASE;
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
   * @param {?WriteParams<typeof managedBudgetAbi, 'allocate'>} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocate(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'allocate'>,
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
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof managedBudgetAbi, 'allocate'>} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocateRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'allocate'>,
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
   * @param {?WriteParams<typeof managedBudgetAbi, 'clawback'>} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async clawback(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'clawback'>,
  ) {
    return this.awaitResult(this.clawbackRaw(transfer, params));
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
   * @param {?WriteParams<typeof managedBudgetAbi, 'clawback'>} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async clawbackRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'clawback'>,
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
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof managedBudgetAbi, 'disburse'>} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(this.disburseRaw(transfer, params));
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof managedBudgetAbi, 'disburse'>} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburseRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'disburse'>,
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
   * @param {?WriteParams<typeof managedBudgetAbi, 'disburseBatch'>} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof managedBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams<typeof managedBudgetAbi, 'disburseBatch'>} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatchRaw(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof managedBudgetAbi, 'disburseBatch'>,
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
   * Set the authorized status of the given accounts
   * The mechanism for managing authorization is left to the implementing contract
   *
   * @public
   * @async
   * @param {Address[]} addresses - The accounts to authorize or deauthorize
   * @param {boolean[]} allowed - The authorization status for the given accounts
   * @param {?WriteParams<typeof managedBudgetAbi, 'setAuthorized'>} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof managedBudgetAbi, 'setAuthorized'>,
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
   * @param {?WriteParams<typeof managedBudgetAbi, 'setAuthorized'>} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof managedBudgetAbi, 'setAuthorized'>,
  ) {
    const { request, result } = await simulateManagedBudgetSetAuthorized(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetSetAuthorized(this._config, request);
    return { hash, result };
  }

  /**
   * Grant many accounts permissions on the budget.
   *
   * @example
   * ```ts
   * await budget.grantRoles(['0xfoo', '0xbar], [ManagedBudgetRoles.MANAGER, ManagedBudgetRoles.ADMIN])
   * ```
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {bigint[]} roles
   * @param {?WriteParams<typeof managedBudgetAbi, 'grantRoles'>} [params]
   * @returns {unknown}
   */
  public async grantRoles(
    addresses: Address[],
    roles: bigint[],
    params?: WriteParams<typeof managedBudgetAbi, 'grantRoles'>,
  ) {
    return this.awaitResult(this.grantRolesRaw(addresses, roles, params));
  }

  /**
   * Grant many accounts permissions on the budget.
   *
   * @example
   * ```ts
   * await budget.grantRoles(['0xfoo', '0xbar], [ManagedBudgetRoles.MANAGER, ManagedBudgetRoles.ADMIN])
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {bigint[]} roles
   * @param {?WriteParams<typeof managedBudgetAbi, 'grantRoles'>} [params]
   * @returns {unknown}
   */
  public async grantRolesRaw(
    addresses: Address[],
    roles: bigint[],
    params?: WriteParams<typeof managedBudgetAbi, 'grantRoles'>,
  ) {
    const { request, result } = await simulateManagedBudgetGrantRoles(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, roles],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetGrantRoles(
      this._config,
      // biome-ignore lint/suspicious/noExplicitAny: negligible low level lack of type intersection
      request as any,
    );
    return { hash, result };
  }

  /**
   * Revoke many accounts' permissions on the budget.
   *
   * @example
   * ```ts
   * await budget.revokeRoles(['0xfoo', '0xbar], [ManagedBudgetRoles.MANAGER, ManagedBudgetRoles.ADMIN])
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {bigint[]} roles
   * @param {?WriteParams<typeof managedBudgetAbi, 'revokeRoles'>} [params]
   * @returns {unknown}
   */
  public async revokeRoles(
    addresses: Address[],
    roles: bigint[],
    params?: WriteParams<typeof managedBudgetAbi, 'revokeRoles'>,
  ) {
    return this.awaitResult(this.revokeRolesRaw(addresses, roles, params));
  }

  /**
   * Revoke many accounts' permissions on the budget.
   *
   * @example
   * ```ts
   * await budget.revokeRoles(['0xfoo', '0xbar], [ManagedBudgetRoles.MANAGER, ManagedBudgetRoles.ADMIN])
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {bigint[]} roles
   * @param {?WriteParams<typeof managedBudgetAbi, 'revokeRoles'>} [params]
   * @returns {unknown}
   */
  public async revokeRolesRaw(
    addresses: Address[],
    roles: bigint[],
    params?: WriteParams<typeof managedBudgetAbi, 'revokeRoles'>,
  ) {
    const { request, result } = await simulateManagedBudgetRevokeRoles(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, roles],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeManagedBudgetRevokeRoles(
      this._config,
      // biome-ignore lint/suspicious/noExplicitAny: negligible low level lack of type intersection
      request as any,
    );
    return { hash, result };
  }

  /**
   * Return an array of the roles assigned to the given account.
   * @example
   * ```ts
   * (await budget.rolesOf(0xfoo)).includes(ManagedBudgetRoles.ADMIN)
   * @public
   * @param {Address} account
   * @param {?ReadParams<typeof managedBudgetAbi, 'rolesOf'>} [params]
   * @returns {Promise<Array<bigint>>}
   */
  public async rolesOf(
    account: Address,
    params?: ReadParams<typeof managedBudgetAbi, 'rolesOf'>,
  ) {
    const roles = await readManagedBudgetRolesOf(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    return [ManagedBudgetRoles.MANAGER, ManagedBudgetRoles.ADMIN].filter(
      (role) => (roles & role) === role,
    );
  }

  /**
   * Returns whether given account has any of the provided roles bitmap.
   *
   * @example
   * ```ts
   * await budget.hasAnyRole(0xfoo, ManagedBudgetRoles.ADMIN | ManagedBudgetRoles.MANAGER)
   * @public
   * @param {Address} account
   * @param {bigint} roles
   * @param {?ReadParams<typeof managedBudgetAbi, 'hasAnyRole'>} [params]
   * @returns {Promise<boolean>}
   */
  public hasAnyRole(
    account: Address,
    roles: bigint,
    params?: ReadParams<typeof managedBudgetAbi, 'hasAnyRole'>,
  ) {
    return readManagedBudgetHasAnyRole(this._config, {
      address: this.assertValidAddress(),
      args: [account, roles],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Returns whether given account has all of the provided roles bitmap.
   *
   * @example
   * ```ts
   * await budget.hasAllRoles(0xfoo, ManagedBudgetRoles.ADMIN & ManagedBudgetRoles.MANAGER)
   *
   * @public
   * @param {Address} account
   * @param {bigint} roles
   * @param {?ReadParams<typeof managedBudgetAbi, 'hasAllRoles'>} [params]
   * @returns {*}
   */
  public hasAllRoles(
    account: Address,
    roles: bigint,
    params?: ReadParams<typeof managedBudgetAbi, 'hasAllRoles'>,
  ) {
    return readManagedBudgetHasAllRoles(this._config, {
      address: this.assertValidAddress(),
      args: [account, roles],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Check if the given account is authorized to use the budget
   *
   * @public
   * @param {Address} account
   * @param {?ReadParams<typeof managedBudgetAbi, 'isAuthorized'>} [params]
   * @returns {Promise<boolean>} - True if the account is authorized
   */
  public isAuthorized(
    account: Address,
    params?: ReadParams<typeof managedBudgetAbi, 'isAuthorized'>,
  ) {
    return readManagedBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the owner of the budget
   *
   * @public
   * @param {?ReadParams<typeof managedBudgetAbi, 'owner'>} [params]
   * @returns {Promise<Address>}
   */
  public owner(params?: ReadParams<typeof managedBudgetAbi, 'owner'>) {
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
   * @param {Address} asset - The address of the asset
   * @param {?(bigint | undefined)} [tokenId] - The ID of the token
   * @param {?ReadParams<typeof managedBudgetAbi, 'total'>} [params]
   * @returns {Promise<bigint>} - The total amount of assets
   */
  public total(
    asset: Address,
    tokenId?: bigint | undefined,
    params?: ReadParams<typeof managedBudgetAbi, 'total'>,
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
   * @param {Address} asset
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams<typeof managedBudgetAbi, 'available'>} [params]
   * @returns {Promise<bigint>} - The amount of assets available
   */
  public available(
    asset: Address,
    tokenId?: bigint | undefined,
    params?: ReadParams<typeof managedBudgetAbi, 'available'>,
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
   * @param {Address} asset
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams<typeof managedBudgetAbi, 'distributed'>} [params]
   * @returns {Promise<bigint>} - The amount of assets distributed
   */
  public distributed(
    asset: Address,
    tokenId?: bigint | undefined,
    params?: ReadParams<typeof managedBudgetAbi, 'distributed'>,
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
   * @param {?ManagedBudgetPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: ManagedBudgetPayload,
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
      abi: managedBudgetAbi,
      bytecode: bytecode as Hex,
      args: [prepareManagedBudgetPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
