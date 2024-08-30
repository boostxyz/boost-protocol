import {
  readSimpleBudgetAvailable,
  readSimpleBudgetDistributed,
  readSimpleBudgetIsAuthorized,
  readSimpleBudgetOwner,
  readSimpleBudgetTotal,
  simpleBudgetAbi,
  simulateSimpleBudgetAllocate,
  simulateSimpleBudgetDisburse,
  simulateSimpleBudgetDisburseBatch,
  simulateSimpleBudgetReclaim,
  simulateSimpleBudgetSetAuthorized,
  writeSimpleBudgetAllocate,
  writeSimpleBudgetDisburse,
  writeSimpleBudgetDisburseBatch,
  writeSimpleBudgetReclaim,
  writeSimpleBudgetSetAuthorized,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
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
  type ReadParams,
  RegistryType,
  type SimpleBudgetPayload,
  type WriteParams,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
  prepareSimpleBudgetPayload,
} from '../utils';

export { simpleBudgetAbi };
export type {
  ERC1155TransferPayload,
  FungibleTransferPayload,
  SimpleBudgetPayload,
};

/**
 * A generic `viem.Log` event with support for `SimpleBudget` event types.
 *
 * @export
 * @typedef {SimpleBudgetLog}
 * @template {ContractEventName<typeof simpleBudgetAbi>} [event=ContractEventName<
 *     typeof simpleBudgetAbi
 *   >]
 */
export type SimpleBudgetLog<
  event extends ContractEventName<typeof simpleBudgetAbi> = ContractEventName<
    typeof simpleBudgetAbi
  >,
> = GenericLog<typeof simpleBudgetAbi, event>;

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
 * @class SimpleBudget
 * @typedef {SimpleBudget}
 * @extends {DeployableTarget<SimpleBudgetPayload>}
 */
export class SimpleBudget extends DeployableTarget<
  SimpleBudgetPayload,
  typeof simpleBudgetAbi
> {
  public override readonly abi = simpleBudgetAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_SIMPLE_BUDGET_BASE;
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
   * @param {?WriteParams<typeof simpleBudgetAbi, 'allocate'>} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocate(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'allocate'>,
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
   * @param {?WriteParams<typeof simpleBudgetAbi, 'allocate'>} [params]
   * @returns {Promise<boolean>} - True if the allocation was successful
   */
  public async allocateRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'allocate'>,
  ) {
    const { request, result } = await simulateSimpleBudgetAllocate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleBudgetAllocate(this._config, request);
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
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async reclaim(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'reclaim'>,
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
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'reclaim'>} [params]
   * @returns {Promise<boolean>} - True if the request was successful
   */
  public async reclaimRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateSimpleBudgetReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleBudgetReclaim(this._config, request);
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to a single recipient
   * If the asset transfer fails, the disbursement will revert
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburse'>} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburse'>,
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
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburse'>} [params]
   * @returns {Promise<boolean>} - True if the disbursement was successful
   */
  public async disburseRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburse'>,
  ) {
    const { request, result } = await simulateSimpleBudgetDisburse(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleBudgetDisburse(this._config, request);
    return { hash, result };
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  /**
   * Disburses assets from the budget to multiple recipients
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>} [params]
   * @returns {Promise<boolean>} - True if all disbursements were successful
   */
  public async disburseBatchRaw(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>,
  ) {
    const { request, result } = await simulateSimpleBudgetDisburseBatch(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [transfers.map(prepareTransfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleBudgetDisburseBatch(this._config, request);
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
   * @param {?WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>,
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
   * @param {?WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>} [params]
   * @returns {Promise<void>}
   */
  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>,
  ) {
    const { request, result } = await simulateSimpleBudgetSetAuthorized(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeSimpleBudgetSetAuthorized(this._config, request);
    return { hash, result };
  }

  /**
   * Check if the given account is authorized to use the budget
   *
   * @public
   * @param {Address} account
   * @param {?ReadParams<typeof simpleBudgetAbi, 'isAuthorized'>} [params]
   * @returns {Promise<boolean>} - True if the account is authorized
   */
  public isAuthorized(
    account: Address,
    params?: ReadParams<typeof simpleBudgetAbi, 'isAuthorized'>,
  ) {
    return readSimpleBudgetIsAuthorized(this._config, {
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
   * @param {?ReadParams<typeof simpleBudgetAbi, 'owner'>} [params]
   * @returns {Promise<Address>}
   */
  public owner(params?: ReadParams<typeof simpleBudgetAbi, 'owner'>) {
    return readSimpleBudgetOwner(this._config, {
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
   * @param {?ReadParams<typeof simpleBudgetAbi, 'total'>} [params]
   * @returns {Promise<bigint>} - The total amount of assets
   */
  public total(
    asset: Address,
    tokenId?: bigint | undefined,
    params?: ReadParams<typeof simpleBudgetAbi, 'total'>,
  ) {
    return readSimpleBudgetTotal(this._config, {
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
   * @param {?ReadParams<typeof simpleBudgetAbi, 'available'>} [params]
   * @returns {Promise<bigint>} - The amount of assets available
   */
  public available(
    asset: Address,
    tokenId?: bigint | undefined,
    params?: ReadParams<typeof simpleBudgetAbi, 'available'>,
  ) {
    return readSimpleBudgetAvailable(this._config, {
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
   * @param {?ReadParams<typeof simpleBudgetAbi, 'distributed'>} [params]
   * @returns {Promise<bigint>} - The amount of assets distributed
   */
  public distributed(
    asset: Address,
    tokenId?: bigint | undefined,
    params?: ReadParams<typeof simpleBudgetAbi, 'distributed'>,
  ) {
    return readSimpleBudgetDistributed(this._config, {
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
   * @param {?SimpleBudgetPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: SimpleBudgetPayload,
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
      abi: simpleBudgetAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleBudgetPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
