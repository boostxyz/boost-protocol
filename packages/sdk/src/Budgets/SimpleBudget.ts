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
  public static override base = import.meta.env.VITE_SIMPLE_BUDGET_BASE;
  public static override registryType: RegistryType = RegistryType.BUDGET;

  public async allocate(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'allocate'>,
  ) {
    return this.awaitResult(this.allocateRaw(transfer, params));
  }

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

  public async reclaim(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(transfer, params));
  }

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

  public async disburse(
    transfer: FungibleTransferPayload | ERC1155TransferPayload,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(this.disburseRaw(transfer, params));
  }

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

  public async disburseBatch(
    transfers: Array<FungibleTransferPayload | ERC1155TransferPayload>,
    params?: WriteParams<typeof simpleBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
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

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof simpleBudgetAbi, 'setAuthorized'>,
  ) {
    return this.awaitResult(this.setAuthorizedRaw(addresses, allowed, params));
  }

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
