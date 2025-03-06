import {
  readTransparentBudgetDistributed,
  readTransparentBudgetOwner,
  readTransparentBudgetTotal,
  simulateTransparentBudgetClawbackFromTarget,
  simulateTransparentBudgetDisburse,
  simulateTransparentBudgetDisburseBatch,
  transparentBudgetAbi,
  writeTransparentBudgetClawbackFromTarget,
  writeTransparentBudgetDisburse,
  writeTransparentBudgetDisburseBatch,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/budgets/TransparentBudget.sol/TransparentBudget.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  zeroAddress,
} from 'viem';
import { TransparentBudget as TransparentBudgetBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTargetWithRBAC } from '../Deployable/DeployableTargetWithRBAC';
import type {
  ERC1155TransferPayload,
  FungibleTransferPayload,
} from '../transfers';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';
import { prepareTransfer } from './ManagedBudget';
export { transparentBudgetAbi };
export type { ERC1155TransferPayload, FungibleTransferPayload };

/**
 * A generic `viem.Log` event with support for `TransparentBudget` event types.
 *
 * @export
 * @typedef {TransparentBudgetLog}
 * @template {ContractEventName<typeof transparentBudgetAbi>} [event=ContractEventName<
 *     typeof transparentBudgetAbi
 *   >]
 */
export type TransparentBudgetLog<
  event extends ContractEventName<
    typeof transparentBudgetAbi
  > = ContractEventName<typeof transparentBudgetAbi>,
> = GenericLog<typeof transparentBudgetAbi, event>;

/**
 * A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
 * This type of budget supports ETH, ERC20, and ERC1155 assets only
 *
 * @export
 * @class TransparentBudget
 * @typedef {TransparentBudget}
 * @extends {DeployableTargetWithRBAC<TransparentBudgetPayload>}
 */
export class TransparentBudget extends DeployableTargetWithRBAC<
  never,
  typeof transparentBudgetAbi
> {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = transparentBudgetAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_TRANSPARENT_BUDGET_BASE,
    ...(TransparentBudgetBases as Record<number, Address>),
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
   * Clawbacks assets from an incentive associated with the budget via Boost Core.
   * Only the authorized users can clawback assets from an incentive.
   * If the asset transfer fails, the reclamation will revert.
   *
   * @example
   * ```ts
   * const [amount, address] = await budgets.budget.clawbackFromTarget(
   *   core.assertValidAddress(),
   *   erc20Incentive.buildClawbackData(1n),
   *   boost.id,
   *   incentiveId,
   * );
   * ```
   * @public
   * @async
   * @param {Address} target - The address of a contract implementing clawback, typically `BoostCore`
   * @param {Hex} data - The encoded data payload for the clawback, can be acquired with `incentive.buildClawbackData`
   * @param {bigint | number} boostId - The ID of the boost
   * @param {bigint | number} incentiveId - The ID of the incentive
   * @param {?WriteParams} [params] - Optional write parameters
   * @returns {Promise<[bigint, Address]>} - Returns a tuple of amount reclaimed and the address reclaimed from
   */
  public async clawbackFromTarget(
    target: Address,
    data: Hex,
    boostId: bigint | number,
    incentiveId: bigint | number,
    params?: WriteParams,
  ) {
    return await this.awaitResult(
      this.clawbackFromTargetRaw(target, data, boostId, incentiveId, params),
    );
  }

  /**
   * Clawbacks assets from an incentive associated with the budget via Boost Core.
   * Only the authorized users can clawback assets from an incentive.
   * If the asset transfer fails, the reclamation will revert.
   *
   * @example
   * ```ts
   * const { hash, result: [ amount, address ] } = await budgets.budget.clawbackFromTargetRaw(
   *   core.assertValidAddress(),
   *   erc20Incentive.buildClawbackData(1n),
   *   boost.id,
   *   incentiveId,
   * );
   * ```
   * @public
   * @async
   * @param {Address} target - The address of a contract implementing clawback, typically `BoostCore`
   * @param {Hex} data - The encoded data payload for the clawback, can be acquired with `incentive.buildClawbackData`
   * @param {bigint | number} boostId - The ID of the boost
   * @param {bigint | number} incentiveId - The ID of the incentive
   * @param {?WriteParams} [params] - Optional write parameters
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>} - Returns transaction hash and simulated result
   */
  public async clawbackFromTargetRaw(
    target: Address,
    data: Hex,
    boostId: bigint | number,
    incentiveId: bigint | number,
    params?: WriteParams,
  ) {
    const { request, result } =
      await simulateTransparentBudgetClawbackFromTarget(this._config, {
        address: this.assertValidAddress(),
        args: [target, data, BigInt(boostId), BigInt(incentiveId)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
    const hash = await writeTransparentBudgetClawbackFromTarget(
      this._config,
      request,
    );
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
    params?: WriteParams,
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
    params?: WriteParams,
  ) {
    const { request, result } = await simulateTransparentBudgetDisburse(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [prepareTransfer(transfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeTransparentBudgetDisburse(this._config, request);
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
    params?: WriteParams,
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
    params?: WriteParams,
  ) {
    const { request, result } = await simulateTransparentBudgetDisburseBatch(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [transfers.map(prepareTransfer)],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeTransparentBudgetDisburseBatch(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Get the owner of the budget
   *
   * @public
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public owner(params?: ReadParams) {
    return readTransparentBudgetOwner(this._config, {
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
    params?: ReadParams,
  ) {
    return readTransparentBudgetTotal(this._config, {
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
    params?: ReadParams,
  ) {
    return readTransparentBudgetDistributed(this._config, {
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
   * @param {?TransparentBudgetPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: never,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [_, options] = this.validateDeploymentConfig({}, _options);
    return {
      abi: transparentBudgetAbi,
      bytecode: bytecode as Hex,
      args: [],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
