import {
  type TransferPayload,
  type VestingBudgetPayload,
  prepareTransferPayload,
  prepareVestingBudgetPayload,
  readVestingBudgetAvailable,
  readVestingBudgetDistributed,
  readVestingBudgetEnd,
  readVestingBudgetIsAuthorized,
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
import { type Address, type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { VestingBudgetPayload };

export class VestingBudget extends Deployable<VestingBudgetPayload> {
  public async allocate(
    transfer: TransferPayload,
    params: CallParams<typeof writeVestingBudgetAllocate> = {},
  ) {
    return this.awaitResult(
      this.allocateRaw(transfer, params),
      vestingBudgetAbi,
      simulateVestingBudgetAllocate,
    );
  }

  public allocateRaw(
    transfer: TransferPayload,
    params: CallParams<typeof writeVestingBudgetAllocate> = {},
  ) {
    return writeVestingBudgetAllocate(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public async reclaim(
    transfer: TransferPayload,
    params: CallParams<typeof writeVestingBudgetReclaim> = {},
  ) {
    return this.awaitResult(
      this.reclaimRaw(transfer, params),
      vestingBudgetAbi,
      simulateVestingBudgetReclaim,
    );
  }

  public reclaimRaw(
    transfer: TransferPayload,
    params: CallParams<typeof writeVestingBudgetReclaim> = {},
  ) {
    return writeVestingBudgetReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public async disburse(
    transfer: TransferPayload,
    params: CallParams<typeof writeVestingBudgetDisburse> = {},
  ) {
    return this.awaitResult(
      this.disburseRaw(transfer, params),
      vestingBudgetAbi,
      simulateVestingBudgetDisburse,
    );
  }

  public disburseRaw(
    transfer: TransferPayload,
    params: CallParams<typeof writeVestingBudgetDisburse> = {},
  ) {
    return writeVestingBudgetDisburse(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public async disburseBatch(
    transfers: TransferPayload[],
    params: CallParams<typeof writeVestingBudgetDisburseBatch> = {},
  ) {
    return this.awaitResult(
      this.disburseBatchRaw(transfers, params),
      vestingBudgetAbi,
      simulateVestingBudgetDisburseBatch,
    );
  }

  public disburseBatchRaw(
    transfers: TransferPayload[],
    params: CallParams<typeof writeVestingBudgetDisburseBatch> = {},
  ) {
    return writeVestingBudgetDisburseBatch(this._config, {
      address: this.assertValidAddress(),
      args: [transfers.map(prepareTransferPayload)],
      ...params,
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeVestingBudgetSetAuthorized> = {},
  ) {
    return this.awaitResult(
      this.setAuthorizedRaw(addresses, allowed, params),
      vestingBudgetAbi,
      simulateVestingBudgetSetAuthorized,
    );
  }

  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeVestingBudgetSetAuthorized> = {},
  ) {
    return await writeVestingBudgetSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public isAuthorized(
    account: Address,
    params: CallParams<typeof readVestingBudgetIsAuthorized> = {},
  ) {
    return readVestingBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...params,
    });
  }

  public end(params: CallParams<typeof readVestingBudgetEnd> = {}) {
    return readVestingBudgetEnd(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public total(
    asset: Address,
    params: CallParams<typeof readVestingBudgetTotal> = {},
  ) {
    return readVestingBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      ...params,
    });
  }

  public available(
    asset: Address,
    params: CallParams<typeof readVestingBudgetAvailable> = {},
  ) {
    return readVestingBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      ...params,
    });
  }

  public distributed(
    asset: Address,
    params: CallParams<typeof readVestingBudgetDistributed> = {},
  ) {
    return readVestingBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      ...params,
    });
  }

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
