import {
  type SimpleBudgetPayload,
  type TransferPayload,
  prepareSimpleBudgetPayload,
  prepareTransferPayload,
  readSimpleBudgetAvailable,
  readSimpleBudgetDistributed,
  readSimpleBudgetGetComponentInterface,
  readSimpleBudgetIsAuthorized,
  readSimpleBudgetSupportsInterface,
  readSimpleBudgetTotal,
  readVestingBudgetStart,
  simpleAllowListAbi,
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
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { SimpleBudgetPayload };

export class SimpleBudget extends DeployableTarget<SimpleBudgetPayload> {
  public static base = import.meta.env.VITE_SIMPLE_BUDGET_BASE;
  public override readonly base = SimpleBudget.base;

  public start(params: CallParams<typeof readVestingBudgetStart> = {}) {
    return readVestingBudgetStart(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public async allocate(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetAllocate> = {},
  ) {
    return this.awaitResult(
      this.allocateRaw(transfer, params),
      simpleAllowListAbi,
      simulateSimpleBudgetAllocate,
    );
  }

  public allocateRaw(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetAllocate> = {},
  ) {
    return writeSimpleBudgetAllocate(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public async reclaim(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetReclaim> = {},
  ) {
    return this.awaitResult(
      this.reclaimRaw(transfer, params),
      simpleAllowListAbi,
      simulateSimpleBudgetReclaim,
    );
  }

  public reclaimRaw(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetReclaim> = {},
  ) {
    return writeSimpleBudgetReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public async disburse(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetDisburse> = {},
  ) {
    return this.awaitResult(
      this.disburseRaw(transfer, params),
      simpleAllowListAbi,
      simulateSimpleBudgetDisburse,
    );
  }

  public disburseRaw(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetDisburse> = {},
  ) {
    return writeSimpleBudgetDisburse(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public async disburseBatch(
    transfers: TransferPayload[],
    params: CallParams<typeof writeSimpleBudgetDisburseBatch> = {},
  ) {
    return this.awaitResult(
      this.disburseBatchRaw(transfers, params),
      simpleAllowListAbi,
      simulateSimpleBudgetDisburseBatch,
    );
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatchRaw(
    transfers: TransferPayload[],
    params: CallParams<typeof writeSimpleBudgetDisburseBatch> = {},
  ) {
    return writeSimpleBudgetDisburseBatch(this._config, {
      address: this.assertValidAddress(),
      args: [transfers.map(prepareTransferPayload)],
      ...params,
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSimpleBudgetSetAuthorized> = {},
  ) {
    return this.awaitResult(
      this.setAuthorizedRaw(addresses, allowed, params),
      simpleAllowListAbi,
      simulateSimpleBudgetSetAuthorized,
    );
  }

  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSimpleBudgetSetAuthorized> = {},
  ) {
    return await writeSimpleBudgetSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public isAuthorized(
    account: Address,
    params: CallParams<typeof readSimpleBudgetIsAuthorized> = {},
  ) {
    return readSimpleBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...params,
    });
  }

  public total(
    asset: Address,
    tokenId: bigint | undefined,
    params: CallParams<typeof readSimpleBudgetTotal> = {},
  ) {
    return readSimpleBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      ...params,
    });
  }

  public available(
    asset: Address,
    tokenId: bigint | undefined,
    params: CallParams<typeof readSimpleBudgetAvailable> = {},
  ) {
    return readSimpleBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      ...params,
    });
  }

  public distributed(
    asset: Address,
    tokenId: bigint | undefined,
    params: CallParams<typeof readSimpleBudgetDistributed> = {},
  ) {
    return readSimpleBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      ...params,
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params: CallParams<typeof readSimpleBudgetSupportsInterface> = {},
  ) {
    return readSimpleBudgetSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params: CallParams<typeof readSimpleBudgetGetComponentInterface> = {},
  ) {
    return readSimpleBudgetGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      ...params,
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
      abi: simpleAllowListAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleBudgetPayload(payload)],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
