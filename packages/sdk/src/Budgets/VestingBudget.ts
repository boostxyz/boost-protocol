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
  readVestingBudgetOwner,
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

export type { VestingBudgetPayload, prepareVestingBudgetPayload };

/**
 * Description placeholder
 *
 * @export
 * @class VestingBudget
 * @typedef {VestingBudget}
 * @extends {DeployableTarget<VestingBudgetPayload>}
 */
export class VestingBudget extends DeployableTarget<VestingBudgetPayload> {
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_VESTING_BUDGET_BASE;
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
   * @param {?ReadParams<typeof vestingBudgetAbi, 'owner'>} [params]
   * @returns {*}
   */
  public owner(params?: ReadParams<typeof vestingBudgetAbi, 'owner'>) {
    return readVestingBudgetOwner(this._config, {
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
   * @param {?ReadParams<typeof vestingBudgetAbi, 'start'>} [params]
   * @returns {*}
   */
  public start(params?: ReadParams<typeof vestingBudgetAbi, 'start'>) {
    return readVestingBudgetStart(this._config, {
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
   * @param {?ReadParams<typeof vestingBudgetAbi, 'duration'>} [params]
   * @returns {*}
   */
  public duration(params?: ReadParams<typeof vestingBudgetAbi, 'duration'>) {
    return readVestingBudgetDuration(this._config, {
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
   * @param {?ReadParams<typeof vestingBudgetAbi, 'cliff'>} [params]
   * @returns {*}
   */
  public cliff(params?: ReadParams<typeof vestingBudgetAbi, 'cliff'>) {
    return readVestingBudgetCliff(this._config, {
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
   * @async
   * @param {FungibleTransferPayload} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'allocate'>} [params]
   * @returns {unknown}
   */
  public async allocate(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'allocate'>,
  ) {
    return this.awaitResult(this.allocateRaw(transfer, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'allocate'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
  public async reclaim(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'reclaim'>,
  ) {
    return this.awaitResult(this.reclaimRaw(transfer, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'reclaim'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburse'>} [params]
   * @returns {unknown}
   */
  public async disburse(
    transfer: FungibleTransferPayload,
    params?: WriteParams<typeof vestingBudgetAbi, 'disburse'>,
  ) {
    return this.awaitResult(this.disburseRaw(transfer, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload} transfer
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburse'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload[]} transfers
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>} [params]
   * @returns {unknown}
   */
  public async disburseBatch(
    transfers: FungibleTransferPayload[],
    params?: WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>,
  ) {
    return this.awaitResult(this.disburseBatchRaw(transfers, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {FungibleTransferPayload[]} transfers
   * @param {?WriteParams<typeof vestingBudgetAbi, 'disburseBatch'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address[]} addresses
   * @param {boolean[]} allowed
   * @param {?WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>} [params]
   * @returns {unknown}
   */
  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params?: WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>,
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
   * @param {?WriteParams<typeof vestingBudgetAbi, 'setAuthorized'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @param {Address} account
   * @param {?ReadParams<typeof vestingBudgetAbi, 'isAuthorized'>} [params]
   * @returns {*}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @param {?ReadParams<typeof vestingBudgetAbi, 'end'>} [params]
   * @returns {*}
   */
  public end(params?: ReadParams<typeof vestingBudgetAbi, 'end'>) {
    return readVestingBudgetEnd(this._config, {
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
   * @param {?ReadParams<typeof vestingBudgetAbi, 'total'>} [params]
   * @returns {*}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @param {Address} asset
   * @param {?ReadParams<typeof vestingBudgetAbi, 'available'>} [params]
   * @returns {*}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @param {Address} asset
   * @param {?ReadParams<typeof vestingBudgetAbi, 'distributed'>} [params]
   * @returns {*}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Hex} interfaceId
   * @param {?ReadParams<typeof vestingBudgetAbi, 'supportsInterface'>} [params]
   * @returns {unknown}
   */
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

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof vestingBudgetAbi, 'getComponentInterface'>} [params]
   * @returns {unknown}
   */
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

  /**
   * @inheritdoc
   *
   * @public
   * @param {?VestingBudgetPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
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
