import {
  type ERC1155TransferPayload,
  type FungibleTransferPayload,
  type SimpleBudgetPayload,
  type TransferPayload,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
  prepareSimpleBudgetPayload,
  prepareTransferPayload,
  readSimpleBudgetAvailable,
  readSimpleBudgetDistributed,
  readSimpleBudgetGetComponentInterface,
  readSimpleBudgetIsAuthorized,
  readSimpleBudgetSupportsInterface,
  readSimpleBudgetTotal,
  readVestingBudgetStart,
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
import type { CreateWriteContractParameters } from '@wagmi/core/codegen';
import { type Address, type Hex, zeroAddress } from 'viem';
import { writeContract } from 'viem/actions';
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

export type { SimpleBudgetPayload };

export function isFungibleTransfer(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
): transfer is FungibleTransferPayload {
  return (transfer as ERC1155TransferPayload).tokenId === undefined;
}

export function isERC1155TransferPayload(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
): transfer is ERC1155TransferPayload {
  return (transfer as ERC1155TransferPayload).tokenId !== undefined;
}

export function prepareTransfer(
  transfer: FungibleTransferPayload | ERC1155TransferPayload,
) {
  if (isFungibleTransfer(transfer)) {
    return prepareFungibleTransfer(transfer);
  } else if (isERC1155TransferPayload(transfer)) {
    return prepareERC1155Transfer(transfer);
  } else throw new UnknownTransferPayloadSupplied(transfer);
}

export class SimpleBudget extends DeployableTarget<SimpleBudgetPayload> {
  public static base = import.meta.env.VITE_SIMPLE_BUDGET_BASE;
  public override readonly base = SimpleBudget.base;

  public async allocate(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'allocate'>,
  ) {
    return this.awaitResult(
      this.allocateRaw(transfer, params),
      simpleBudgetAbi,
      simulateSimpleBudgetAllocate,
    );
  }

  public allocateRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'allocate'>,
  ) {
    return writeSimpleBudgetAllocate(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransfer(transfer)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async reclaim(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'reclaim'>,
  ) {
    return this.awaitResult(
      this.reclaimRaw(transfer, params),
      simpleBudgetAbi,
      simulateSimpleBudgetReclaim,
    );
  }

  public reclaimRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'reclaim'>,
  ) {
    return writeSimpleBudgetReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransfer(transfer)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(
      this.disburseRaw(transfer, params),
      simpleBudgetAbi,
      simulateSimpleBudgetDisburse,
    );
  }

  public disburseRaw(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburse'>,
  ) {
    return writeSimpleBudgetDisburse(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransfer(transfer)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(
      this.disburseBatchRaw(transfers, params),
      simpleBudgetAbi,
      simulateSimpleBudgetDisburseBatch,
    );
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatchRaw(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>,
  ) {
    return writeSimpleBudgetDisburseBatch(this._config, {
      address: this.assertValidAddress(),
      args: [transfers.map(prepareTransfer)],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>,
  ) {
    return this.awaitResult(
      this.setAuthorizedRaw(addresses, allowed, params),
      simpleBudgetAbi,
      simulateSimpleBudgetSetAuthorized,
    );
  }

  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>,
  ) {
    return await writeSimpleBudgetSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public isAuthorized(
    account: Address,
    params?: ReadParams<typeof simpleBudgetAbi, 'isAuthorized'>,
  ) {
    return readSimpleBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public total(
    asset: Address,
    tokenId: bigint | undefined,
    params?: ReadParams<typeof simpleBudgetAbi, 'total'>,
  ) {
    return readSimpleBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public available(
    asset: Address,
    tokenId: bigint | undefined,
    params?: ReadParams<typeof simpleBudgetAbi, 'available'>,
  ) {
    return readSimpleBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public distributed(
    asset: Address,
    tokenId: bigint | undefined,
    params?: ReadParams<typeof simpleBudgetAbi, 'distributed'>,
  ) {
    return readSimpleBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

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
