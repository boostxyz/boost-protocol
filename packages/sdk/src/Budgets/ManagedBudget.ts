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
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from 'viem';
import { ManagedBudget as ManagedBudgetBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableTargetWithRBAC } from '../Deployable/DeployableTargetWithRBAC';
import {
  DeployableUnknownOwnerProvidedError,
  UnknownTransferPayloadSupplied,
} from '../errors';
import {
  type ERC1155TransferPayload,
  type FungibleTransferPayload,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
} from '../transfers';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';
export { managedBudgetAbi };
export type { ERC1155TransferPayload, FungibleTransferPayload };

/**
 * The object representation of a `ManagedBudgetPayload.InitPayload`
 *
 * @export
 * @interface ManagedBudgetPayload
 * @typedef {ManagedBudgetPayload}
 */
export interface ManagedBudgetPayload {
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
   * @type {ManagedBudgetRoles[]}
   */
  roles: ManagedBudgetRoles[];
}

/**
 *  Enum representing available roles for use in the `ManagedBudget`.
 * `MANAGER` can disburse funds.
 * `ADMIN` can additionally manage authorized users on the budget.
 *
 * @export
 * @type {{ readonly MANAGER: 1n; readonly ADMIN_ROLE: 2n; }}
 * @enum {bigint}
 */
export enum ManagedBudgetRoles {
  //@ts-expect-error ts doesn't like bigint enum values
  MANAGER = 1n,
  //@ts-expect-error ts doesn't like bigint enum values
  ADMIN = 2n,
}

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
 * @returns {Hex}
 * @throws {@link UnknownTransferPayloadSupplied}
 */
export function prepareTransfer(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
) {
  if (isFungibleTransfer(transfer)) {
    return prepareFungibleTransfer(transfer);
  }
  if (isERC1155TransferPayload(transfer)) {
    return prepareERC1155Transfer(transfer);
  }
  throw new UnknownTransferPayloadSupplied(transfer);
}

/**
 * A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
 * This type of budget supports ETH, ERC20, and ERC1155 assets only
 *
 * @export
 * @class ManagedBudget
 * @typedef {ManagedBudget}
 * @extends {DeployableTargetWithRBAC<ManagedBudgetPayload>}
 */
export class ManagedBudget extends DeployableTargetWithRBAC<
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
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    ...(ManagedBudgetBases as Record<number, Address>),
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
    params?: WriteParams<typeof managedBudgetAbi, 'allocate'>,
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async clawback(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'clawback'>,
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
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - True if the request was successful
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof managedBudgetAbi, 'disburse'>,
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
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof managedBudgetAbi, 'disburseBatch'>,
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
   * Get the owner of the budget
   *
   * @public
   * @param {?ReadParams} [params]
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
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"] - The address of the asset
   * @param {?(bigint | undefined)} [tokenId] - The ID of the token
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The total amount of assets
   */
  public total(
    asset: Address = zeroAddress,
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
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"]
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The amount of assets available
   */
  public available(
    asset: Address = zeroAddress,
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
   * @param {Address} [asset="0x0000000000000000000000000000000000000000"]
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>} - The amount of assets distributed
   */
  public distributed(
    asset: Address = zeroAddress,
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

/**
 * Given a {@link ManagedBudgetPayload}, properly encode a `ManagedBudget.InitPayload` for use with {@link ManagedBudget} initialization.
 *
 * @param {ManagedBudgetPayload} param0
 * @param {Address} param0.owner - The budget's owner
 * @param {{}} param0.authorized - List of accounts authorized to use the budget. This list should include a Boost core address to interact with the protocol.
 * @param {{}} param0.roles - List of roles to assign to the corresponding account by index.
 * @returns {Hex}
 */
export const prepareManagedBudgetPayload = ({
  owner,
  authorized,
  roles,
}: ManagedBudgetPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'ManagedBudgetPayload payload',
      'struct ManagedBudgetPayload { address owner; address[] authorized; uint256[] roles; }',
    ]),
    [{ owner, authorized, roles: roles as unknown as Array<bigint> }],
  );
};
