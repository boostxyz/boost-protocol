import {
  type ERC1155TransferPayload,
  type FungibleTransferPayload,
  RegistryType,
  type SimpleBudgetPayload,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
  prepareSimpleBudgetPayload,
  readSimpleBudgetAvailable,
  readSimpleBudgetDistributed,
  readSimpleBudgetGetComponentInterface,
  readSimpleBudgetIsAuthorized,
  readSimpleBudgetOwner,
  readSimpleBudgetSupportsInterface,
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
import { type Address, type Hex, zeroAddress } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import {
  DeployableUnknownOwnerProvidedError,
  UnknownTransferPayloadSupplied,
} from '../errors';
import type { ReadParams, WriteParams } from '../utils';

export type {
  SimpleBudgetPayload,
  FungibleTransferPayload,
  ERC1155TransferPayload,
};

/**
 * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
 * @returns {*}
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
 * Description placeholder
 *
 * @export
 * @class SimpleBudget
 * @typedef {SimpleBudget}
 * @extends {DeployableTarget<SimpleBudgetPayload>}
 */
export class SimpleBudget extends DeployableTarget<SimpleBudgetPayload> {
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'allocate'>} [params]
   * @returns {unknown}
   */
  public async allocate(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'allocate'>,
  ) {
    return this.awaitResult(this.allocateRaw(transfer, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'allocate'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
  public async reclaim(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(transfer, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'reclaim'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburse'>} [params]
   * @returns {unknown}
   */
  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(this.disburseRaw(transfer, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)} transfer
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburse'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>} [params]
   * @returns {unknown}
   */
  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Array<FungibleTransferPayload | ERC1155TransferPayload>} transfers
   * @param {?WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>} [params]
   * @returns {unknown}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>,
  ) {
    return this.awaitResult(this.setAuthorizedRaw(addresses, allowed, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @param {Address} account
   * @param {?ReadParams<typeof simpleBudgetAbi, 'isAuthorized'>} [params]
   * @returns {*}
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
   * Description placeholder
   *
   * @public
   * @param {?ReadParams<typeof simpleBudgetAbi, 'owner'>} [params]
   * @returns {*}
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
   * Description placeholder
   *
   * @public
   * @param {Address} asset
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams<typeof simpleBudgetAbi, 'total'>} [params]
   * @returns {*}
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
   * Description placeholder
   *
   * @public
   * @param {Address} asset
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams<typeof simpleBudgetAbi, 'available'>} [params]
   * @returns {*}
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
   * Description placeholder
   *
   * @public
   * @param {Address} asset
   * @param {?(bigint | undefined)} [tokenId]
   * @param {?ReadParams<typeof simpleBudgetAbi, 'distributed'>} [params]
   * @returns {*}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} interfaceId
   * @param {?ReadParams<typeof simpleBudgetAbi, 'supportsInterface'>} [params]
   * @returns {unknown}
   */
  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof simpleBudgetAbi, 'supportsInterface'>,
  ) {
    return readSimpleBudgetSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof simpleBudgetAbi, 'getComponentInterface'>} [params]
   * @returns {unknown}
   */
  public async getComponentInterface(
    params?: ReadParams<typeof simpleBudgetAbi, 'getComponentInterface'>,
  ) {
    return readSimpleBudgetGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
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
