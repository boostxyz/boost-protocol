import {
  type FungibleTransferPayload,
  RegistryType,
  type VestingBudgetPayload,
  prepareFungibleTransfer,
  prepareVestingBudgetPayload,
  readVestingBudgetAvailable,
  readVestingBudgetCliff,
  readVestingBudgetDistributed,
  readVestingBudgetDuration,
  readVestingBudgetEnd,
  readVestingBudgetGetComponentInterface,
  readVestingBudgetIsAuthorized,
  readVestingBudgetStart,
  readVestingBudgetSupportsInterface,
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
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { ReadParams, WriteParams } from '../utils';

export type { VestingBudgetPayload };

export class VestingBudget extends DeployableTarget<VestingBudgetPayload> {
  public static base = import.meta.env.VITE_VESTING_BUDGET_BASE;
  public override readonly base = VestingBudget.base;

  public static registryType: RegistryType = RegistryType.BUDGET;
  public override readonly registryType: RegistryType = RegistryType.BUDGET;

  public start(params?: ReadParams<typeof vestingBudgetAbi, 'start'>) {
    return readVestingBudgetStart(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public duration(params?: ReadParams<typeof vestingBudgetAbi, 'duration'>) {
    return readVestingBudgetDuration(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public cliff(params?: ReadParams<typeof vestingBudgetAbi, 'cliff'>) {
    return readVestingBudgetCliff(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async allocate(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'allocate'>,
  ) {
    return this.awaitResult(this.allocateRaw(transfer, params));
  }

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

  public async reclaim(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(transfer, params));
  }

  public async reclaimRaw(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'reclaim'>,
  ) {
    const { request, result } = await simulateVestingBudgetReclaim(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareFungibleTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetReclaim(this._config, request);
    return { hash, result };
  }

  public async disburse(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(this.disburseRaw(transfer, params));
  }

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

  public async disburseBatch(
    transfers: FungibleTransferPayload[],
    params?: WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

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

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>,
  ) {
    return this.awaitResult(this.setAuthorizedRaw(addresses, allowed, params));
  }

  public async setAuthorizedRaw(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>,
  ) {
    const { request, result } = await simulateVestingBudgetSetAuthorized(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [addresses, allowed],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeVestingBudgetSetAuthorized(this._config, request);
    return { hash, result };
  }

  public isAuthorized(
    account: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'isAuthorized'>,
  ) {
    return readVestingBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public end(params?: ReadParams<typeof vestingBudgetAbi, 'end'>) {
    return readVestingBudgetEnd(this._config, {
      address: this.assertValidAddress(),
      args: [],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public total(
    asset: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'total'>,
  ) {
    return readVestingBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public available(
    asset: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'available'>,
  ) {
    return readVestingBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public distributed(
    asset: Address,
    params?: ReadParams<typeof vestingBudgetAbi, 'distributed'>,
  ) {
    return readVestingBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async supportsInterface(
    interfaceId: Hex,
    params?: ReadParams<typeof vestingBudgetAbi, 'supportsInterface'>,
  ) {
    return readVestingBudgetSupportsInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [interfaceId],
    });
  }

  public async getComponentInterface(
    params?: ReadParams<typeof vestingBudgetAbi, 'getComponentInterface'>,
  ) {
    return readVestingBudgetGetComponentInterface(this._config, {
      address: this.assertValidAddress(),
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
      args: [],
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
