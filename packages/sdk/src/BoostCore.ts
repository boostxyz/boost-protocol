import {
  boostCoreAbi,
  readBoostCoreCreateBoostAuth,
  readBoostCoreGetBoost,
  readBoostCoreGetBoostCount,
  readBoostCoreGetIncentiveFeesInfo,
  readBoostCoreProtocolFee,
  readBoostCoreProtocolFeeReceiver,
  readIAuthIsAuthorized,
  simulateBoostCoreClaimIncentive,
  simulateBoostCoreClaimIncentiveFor,
  simulateBoostCoreCreateBoost,
  simulateBoostCoreSetCreateBoostAuth,
  simulateBoostCoreSetProtocolFeeReceiver,
  simulateBoostCoreTopupIncentiveFromBudget,
  simulateBoostCoreTopupIncentiveFromSender,
  simulateTransparentBudgetCreateBoost,
  simulateTransparentBudgetCreateBoostWithPermit2,
  transparentBudgetAbi,
  writeBoostCoreClaimIncentive,
  writeBoostCoreClaimIncentiveFor,
  writeBoostCoreCreateBoost,
  writeBoostCoreSetCreateBoostAuth,
  writeBoostCoreSetProtocolFeeReceiver,
  writeBoostCoreTopupIncentiveFromBudget,
  writeBoostCoreTopupIncentiveFromSender,
  writeTransparentBudgetCreateBoost,
  writeTransparentBudgetCreateBoostWithPermit2,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json';
import {
  type GetTransactionReceiptParameters,
  getAccount,
  getChains,
  getTransactionReceipt,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { createWriteContract } from '@wagmi/core/codegen';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodePacked,
  keccak256,
  parseEventLogs,
  zeroAddress,
  zeroHash,
} from 'viem';
import { BoostCore as BoostCoreBases } from '../dist/deployments.json';
import { type Action, actionFromAddress } from './Actions/Action';
import { EventAction, type EventActionPayload } from './Actions/EventAction';
import { type AllowList, allowListFromAddress } from './AllowLists/AllowList';
import {
  OffchainAccessList,
  type OffchainAccessListPayload,
} from './AllowLists/OffchainAccessList';
import { OpenAllowList } from './AllowLists/OpenAllowList';
import {
  SimpleAllowList,
  type SimpleAllowListPayload,
} from './AllowLists/SimpleAllowList';
import {
  SimpleDenyList,
  type SimpleDenyListPayload,
} from './AllowLists/SimpleDenyList';
import { type Auth, PassthroughAuth } from './Auth/Auth';
import {
  Boost,
  type BoostPayload,
  type RawBoost,
  type Target,
  prepareBoostPayload,
} from './Boost';
import { type Budget, budgetFromAddress } from './Budgets/Budget';
import {
  ManagedBudget,
  type ManagedBudgetPayload,
  prepareTransfer,
} from './Budgets/ManagedBudget';
import {
  ManagedBudgetWithFees,
  type ManagedBudgetWithFeesPayload,
} from './Budgets/ManagedBudgetWithFees';
import {
  ManagedBudgetWithFeesV2,
  type ManagedBudgetWithFeesV2Payload,
} from './Budgets/ManagedBudgetWithFeesV2';
import { TransparentBudget } from './Budgets/TransparentBudget';
import {
  Deployable,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
  type GenericDeployableParams,
} from './Deployable/Deployable';
import { Roles } from './Deployable/DeployableTargetWithRBAC';
import {
  AllowListIncentive,
  type AllowListIncentivePayload,
} from './Incentives/AllowListIncentive';
import {
  CGDAIncentive,
  type CGDAIncentivePayload,
} from './Incentives/CGDAIncentive';
import {
  ERC20Incentive,
  type ERC20IncentivePayload,
} from './Incentives/ERC20Incentive';
import {
  ERC20PeggedIncentive,
  type ERC20PeggedIncentivePayload,
} from './Incentives/ERC20PeggedIncentive';
import {
  ERC20PeggedVariableCriteriaIncentiveV2,
  type ERC20PeggedVariableCriteriaIncentiveV2Payload,
} from './Incentives/ERC20PeggedVariableCriteriaIncentiveV2';
import {
  ERC20VariableCriteriaIncentiveV2,
  type ERC20VariableCriteriaIncentiveV2Payload,
} from './Incentives/ERC20VariableCriteriaIncentiveV2';
import type { ERC20VariableIncentivePayload } from './Incentives/ERC20VariableIncentive';
import {
  ERC20VariableIncentive,
  type Incentive,
  incentiveFromAddress,
} from './Incentives/Incentive';
import {
  PointsIncentive,
  type PointsIncentivePayload,
} from './Incentives/PointsIncentive';
import {
  LimitedSignerValidator,
  type LimitedSignerValidatorPayload,
} from './Validators/LimitedSignerValidator';
import {
  PayableLimitedSignerValidator,
  type PayableLimitedSignerValidatorPayload,
} from './Validators/PayableLimitedSignerValidator';
import {
  SignerValidator,
  type SignerValidatorPayload,
} from './Validators/SignerValidator';
import {
  BoostValidatorEOA,
  type Validator,
  validatorFromAddress,
} from './Validators/Validator';
import {
  BoostCoreNoIdentifierEmitted,
  BoostNotFoundError,
  BudgetMustAuthorizeBoostCore,
  DeployableUnknownOwnerProvidedError,
  IncentiveNotCloneableError,
  InvalidProtocolChainIdError,
  MustInitializeBudgetError,
} from './errors';
import type {
  AssetType,
  ERC1155TransferPayload,
  FungibleTransferPayload,
} from './transfers';
import {
  type GenericLog,
  type HashAndSimulatedResult,
  type ReadParams,
  type WriteParams,
  assertValidAddressByChainId,
} from './utils';

/**
 * The ABI of the BoostCore contract, if needed for low level operations
 *
 * @type {typeof boostCoreAbi}
 */
export { boostCoreAbi };

/**
 * The fee denominator (basis points, i.e. 10000 == 100%)
 *
 * @type {bigint}
 */
export const FEE_DENOMINATOR = 10000n;

/**
 * The fixed addresses for the deployed Boost Core.
 * By default, `new BoostCore` will use the address deployed to the currently connected chain, or `BOOST_CORE_ADDRESS` if not provided.
 *
 * @type {Record<number, Address>}
 */
export const BOOST_CORE_ADDRESSES: Record<number, Address> = {
  ...(import.meta.env?.VITE_BOOST_CORE_ADDRESS
    ? { 31337: import.meta.env.VITE_BOOST_CORE_ADDRESS }
    : {}),
  ...(BoostCoreBases as Record<number, Address>),
};

/**
 * The address of the deployed BoostCore instance. In prerelease mode, this will be its sepolia address
 *
 * @type {Address}
 */
export const BOOST_CORE_ADDRESS =
  BOOST_CORE_ADDRESSES[__DEFAULT_CHAIN_ID__ as unknown as number] ||
  zeroAddress;

/**
 * A generic `viem.Log` event with support for `BoostCore` event types.
 *
 * @export
 * @typedef {BoostCoreLog}
 * @template {ContractEventName<typeof boostCoreAbi>} [event=ContractEventName<
 *     typeof boostCoreAbi
 *   >]
 */
export type BoostCoreLog<
  event extends ContractEventName<typeof boostCoreAbi> = ContractEventName<
    typeof boostCoreAbi
  >,
> = GenericLog<typeof boostCoreAbi, event>;

/**
 * Boost Core instantiation options for a custom deployed instance.
 *
 * @export
 * @interface BoostCoreDeployedOptions
 * @typedef {BoostCoreDeployedOptions}
 * @extends {DeployableOptions}
 */
export interface BoostCoreDeployedOptions extends DeployableOptions {
  /**
   * The address of a deployed, custom Boost Core contract.
   *
   * @type {?Address}
   */
  address?: Address;
}

/**
 * Typeguard to determine if a user is supplying a custom address for a Boost Core contract.
 *
 * @param {*} opts
 * @returns {opts is BoostCoreDeployedOptions}
 */
// biome-ignore lint/suspicious/noExplicitAny: type guard
function isBoostCoreDeployed(opts: any): opts is BoostCoreDeployedOptions {
  return opts.address;
}

/**
 * Boost Core instantiation options when a user intends to deploy a new instance of Boost Core, setting their own registry address and protocol fee receiver.
 *
 * @export
 * @interface BoostCoreOptionsWithPayload
 * @typedef {BoostCoreOptionsWithPayload}
 * @extends {DeployableOptions}
 */
export interface BoostCoreOptionsWithPayload extends DeployableOptions {
  /**
   * The address of a deployed Boost Registry contract.
   *
   * @type {Address}
   */
  registryAddress: Address;
  /**
   * The address to send fees.
   *
   * @type {Address}
   */
  protocolFeeReceiver: Address;
  /**
   * The address that will be defined as the BoostCore owner.
   */
  owner: Address;
}

/**
 * Typeguard to determine if a user is intending to deploy a new instance of the Boost Core contracts with {@link BoostCoreOptionsWithPayload}.
 *
 * @param {*} opts
 * @returns {opts is BoostCoreOptionsWithPayload}
 */
// biome-ignore lint/suspicious/noExplicitAny: type guard
function isBoostCoreDeployable(opts: any): opts is BoostCoreOptionsWithPayload {
  return opts.registryAddress && opts.protocolFeeReceiver && opts.owner;
}

/**
 * A union representing both of the valid Boost Core instantiation parameters.
 *
 * @export
 * @typedef {BoostCoreConfig}
 */
export type BoostCoreConfig =
  | BoostCoreDeployedOptions
  | BoostCoreOptionsWithPayload;

/**
 * The interface required to create a new Boost.
 *
 * @export
 * @typedef {CreateBoostPayload}
 */
export type CreateBoostPayload = {
  budget: Budget;
  action: Action;
  validator?: Validator;
  allowList?: AllowList;
  incentives: Array<Incentive>;
  protocolFee?: bigint;
  maxParticipants?: bigint;
  owner?: Address;
};

/**
 * Represents the information about the disbursal of an incentive.
 *
 * @export
 * @typedef {IncentiveDisbursalInfo}
 */
export type IncentiveDisbursalInfo = {
  assetType: AssetType;
  asset: Address;
  protocolFeesRemaining: bigint;
  protocolFee: bigint;
  tokenId: bigint;
};

/**
 * The core contract for the Boost protocol. Used to create and retrieve deployed Boosts.
 *
 * @export
 * @class BoostCore
 * @typedef {BoostCore}
 * @extends {Deployable<[Address, Address, Address]>}
 */
export class BoostCore extends Deployable<
  [Address, Address, Address],
  typeof boostCoreAbi
> {
  /**
   * A static property representing a map of stringified chain ID's to the address of the deployed implementation on chain
   *
   * @static
   * @readonly
   * @type {Record<string, Address>}
   */
  static readonly addresses: Record<number, Address> = BOOST_CORE_ADDRESSES;

  /**
   * A getter that will return Boost core's static addresses by numerical chain ID
   *
   * @public
   * @readonly
   * @type {Record<number, Address>}
   */
  public get addresses(): Record<number, Address> {
    return (this.constructor as typeof BoostCore).addresses;
  }

  /**
   * Creates an instance of BoostCore.
   *
   * @constructor
   * @param {BoostCoreConfig} param0
   * @param {Config} param0.config
   * @param {?Account} [param0.account]
   * @param {({ address?: Address; } | { registryAddress: Address; protocolFeeReceiver: Address; owner: Address; })} param0....options
   */
  constructor({ config, account, ...options }: BoostCoreConfig) {
    if (isBoostCoreDeployed(options) && options.address) {
      super({ account, config }, options.address);
    } else if (isBoostCoreDeployable(options)) {
      super({ account, config }, [
        options.registryAddress,
        options.protocolFeeReceiver,
        options.owner,
      ]);
    } else {
      const { address } = assertValidAddressByChainId(
        config,
        BOOST_CORE_ADDRESSES,
      );
      super({ account, config }, address);
    }
    //@ts-expect-error I can't set this property on the class because for some reason it takes super out of constructor scope?
    this.abi = boostCoreAbi;
  }

  /**
   * Create a new Boost.
   *
   * @public
   * @async
   * @param {CreateBoostPayload} _boostPayload
   * @param {?WriteParams} [params]
   * @returns {Promise<Boost>}
   */
  public async createBoost(
    _boostPayload: CreateBoostPayload,
    _params?: WriteParams,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>(_boostPayload);
    const desiredChainId = _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    const boostFactory = createWriteContract({
      abi: boostCoreAbi,
      functionName: 'createBoost',
      address: coreAddress,
    });

    const onChainPayload = await this.prepareCreateBoostPayload(
      coreAddress,
      chainId,
      payload,
      options,
    );

    const boostHash = await boostFactory(options.config, {
      ...this.optionallyAttachAccount(options.account),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(_params as any),
      chainId,
      args: [prepareBoostPayload(onChainPayload)],
    });
    const receipt = await waitForTransactionReceipt(options.config, {
      hash: boostHash,
    });
    const boostCreatedLog = parseEventLogs({
      abi: boostCoreAbi,
      eventName: 'BoostCreated',
      logs: receipt.logs,
    }).at(0);
    let boostId = 0n;
    if (!boostCreatedLog) throw new BoostCoreNoIdentifierEmitted();
    boostId = boostCreatedLog?.args.boostId;
    const boost = await this.readBoost(boostId);
    return new Boost({
      id: boostId,
      budget: payload.budget.at(boost.budget),
      action: payload.action.at(boost.action),
      validator: payload.validator!.at(boost.validator),
      allowList: payload.allowList!.at(boost.allowList),
      incentives: payload.incentives.map((incentive, i) =>
        // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
        incentive.at(boost.incentives.at(i)!),
      ),
      protocolFee: boost.protocolFee,
      maxParticipants: boost.maxParticipants,
      owner: boost.owner,
    });
  }

  /**
   * Create a new Boost.
   *
   * @public
   * @async
   * @param {CreateBoostPayload} _boostPayload
   * @param {?WriteParams} [params]
   * @returns {Promise<HashAndSimulatedResult>}
   */
  public async createBoostRaw(
    _boostPayload: CreateBoostPayload,
    _params?: WriteParams,
  ): Promise<HashAndSimulatedResult> {
    const { request, result } = await this.simulateCreateBoost(
      _boostPayload,
      _params,
    );
    const hash = await writeBoostCoreCreateBoost(this._config, request);
    return { hash, result };
  }

  /**
   * Returns a simulated Boost creation.
   *
   * @public
   * @async
   * @param {CreateBoostPayload} _boostPayload
   * @param {?WriteParams} [params]
   * @returns {Promise<SimulateContractReturnType>}
   */
  public async simulateCreateBoost(
    _boostPayload: CreateBoostPayload,
    _params?: WriteParams,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>(_boostPayload);
    const desiredChainId = _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    const onChainPayload = await this.prepareCreateBoostPayload(
      coreAddress,
      chainId,
      payload,
      options,
    );

    return await simulateBoostCoreCreateBoost(this._config, {
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(_params as any),
      address: coreAddress,
      chainId,
      args: [prepareBoostPayload(onChainPayload)],
    });
  }

  /**
   * Creates a new Boost with a given TransparentBudget, which transfers assets to the budget on Boost creation.
   *
   * @public
   * @async
   * @param {TransparentBudget | Address} budget - Either an instance of a transparent budget, or the address of a transparent budget
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)[]} allocations - An array of transfers to be allocated to the budget prior to Boost creation
   * @param {Omit<CreateBoostPayload, 'budget'>} _boostPayload - The core Boost configuration sans budget
   * @param {?WriteParams} [params]
   * @returns {Promise<Boost>}
   */
  public async createBoostWithTransparentBudget(
    budget: TransparentBudget | Address,
    allocations: (FungibleTransferPayload | ERC1155TransferPayload)[],
    _boostPayload: Omit<CreateBoostPayload, 'budget'>,
    _params?: WriteParams,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>({
        ..._boostPayload,
        budget: this.TransparentBudget(
          typeof budget === 'string' ? budget : budget.assertValidAddress(),
        ),
      });
    const desiredChainId = _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    const boostFactory = createWriteContract({
      abi: transparentBudgetAbi,
      functionName: 'createBoost',
      address:
        typeof budget === 'string' ? budget : budget.assertValidAddress(),
    });

    const onChainPayload = await this.prepareCreateBoostPayload(
      coreAddress,
      chainId,
      payload,
      options,
    );

    const boostHash = await boostFactory(options.config, {
      ...this.optionallyAttachAccount(options.account),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(_params as any),
      chainId,
      args: [
        allocations.map(prepareTransfer),
        coreAddress,
        prepareBoostPayload(onChainPayload),
      ],
    });
    const receipt = await waitForTransactionReceipt(options.config, {
      hash: boostHash,
    });
    const boostCreatedLog = parseEventLogs({
      abi: boostCoreAbi,
      eventName: 'BoostCreated',
      logs: receipt.logs,
    }).at(0);
    let boostId = 0n;
    if (!boostCreatedLog) throw new BoostCoreNoIdentifierEmitted();
    boostId = boostCreatedLog?.args.boostId;
    const boost = await this.readBoost(boostId);
    return new Boost({
      id: boostId,
      budget: payload.budget.at(boost.budget),
      action: payload.action.at(boost.action),
      validator: payload.validator!.at(boost.validator),
      allowList: payload.allowList!.at(boost.allowList),
      incentives: payload.incentives.map((incentive, i) =>
        // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
        incentive.at(boost.incentives.at(i)!),
      ),
      protocolFee: boost.protocolFee,
      maxParticipants: boost.maxParticipants,
      owner: boost.owner,
    });
  }

  /**
   * Returns a transaction hash and simulated Boost creation using a transparent budget
   *
   * @public
   * @async
   * @param {TransparentBudget | Address} budget - Either an instance of a transparent budget, or the address of a transparent budget
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)[]} allocations - An array of transfers to be allocated to the budget prior to Boost creation
   * @param {Omit<CreateBoostPayload, 'budget'>} _boostPayload - The core Boost configuration sans budget
   * @param {?WriteParams} [params]
   * @returns {Promise<HashAndSimulatedResult>}
   */
  public async createBoostWithTransparentBudgetRaw(
    budget: TransparentBudget | Address,
    allocations: (FungibleTransferPayload | ERC1155TransferPayload)[],
    _boostPayload: Omit<CreateBoostPayload, 'budget'>,
    _params?: WriteParams,
  ): Promise<HashAndSimulatedResult> {
    const { request, result } =
      await this.simulateCreateBoostWithTransparentBudget(
        budget,
        allocations,
        _boostPayload,
        _params,
      );
    const hash = await writeTransparentBudgetCreateBoost(this._config, request);
    return { hash, result };
  }

  /**
   * Returns a simulated Boost creation using a transparent budget
   *
   * @public
   * @async
   * @param {TransparentBudget | Address} budget - Either an instance of a transparent budget, or the address of a transparent budget
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)[]} allocations - An array of transfers to be allocated to the budget prior to Boost creation
   * @param {Omit<CreateBoostPayload, 'budget'>} _boostPayload - The core Boost configuration sans budget
   * @param {?WriteParams} [params]
   * @returns {Promise<SimulateContractReturnType>}
   */
  public async simulateCreateBoostWithTransparentBudget(
    budget: TransparentBudget | Address,
    allocations: (FungibleTransferPayload | ERC1155TransferPayload)[],
    _boostPayload: Omit<CreateBoostPayload, 'budget'>,
    _params?: WriteParams,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>({
        ..._boostPayload,
        budget: this.TransparentBudget(
          typeof budget === 'string' ? budget : budget.assertValidAddress(),
        ),
      });
    const desiredChainId = _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    const onChainPayload = await this.prepareCreateBoostPayload(
      coreAddress,
      chainId,
      payload,
      options,
    );

    return await simulateTransparentBudgetCreateBoost(this._config, {
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(_params as any),
      address:
        typeof budget === 'string' ? budget : budget.assertValidAddress(),
      chainId,
      args: [
        allocations.map(prepareTransfer),
        coreAddress,
        prepareBoostPayload(onChainPayload),
      ],
    });
  }

  /**
   * Creates a new Boost with a given a TransparentBudget and Permit2, which transfers assets to the budget on Boost creation.
   *
   * @public
   * @async
   * @param {TransparentBudget | Address} budget - Either an instance of a transparent budget, or the address of a transparent budget
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)[]} allocations - An array of transfers to be allocated to the budget prior to Boost creation
   * @param {Omit<CreateBoostPayload, 'budget'>} _boostPayload - The core Boost configuration sans budget
   * @param {Hex} permit2Signature - The packed signature that was the result of signing the EIP712 hash of `permit`.
   * @param {bigint} nonce - The nonce for the permit2 batch transfer
   * @param {bigint} deadline - The deadline for the permit2 batch transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<Boost>}
   */
  public async createBoostWithPermit2(
    budget: TransparentBudget | Address,
    allocations: (FungibleTransferPayload | ERC1155TransferPayload)[],
    _boostPayload: Omit<CreateBoostPayload, 'budget'>,
    permit2Signature: Hex,
    nonce: bigint,
    deadline: bigint,
    _params?: WriteParams,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>({
        ..._boostPayload,
        budget: this.TransparentBudget(
          typeof budget === 'string' ? budget : budget.assertValidAddress(),
        ),
      });
    const desiredChainId = _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    const boostFactory = createWriteContract({
      abi: transparentBudgetAbi,
      functionName: 'createBoostWithPermit2',
      address:
        typeof budget === 'string' ? budget : budget.assertValidAddress(),
    });

    const onChainPayload = await this.prepareCreateBoostPayload(
      coreAddress,
      chainId,
      payload,
      options,
    );

    const boostHash = await boostFactory(options.config, {
      ...this.optionallyAttachAccount(options.account),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(_params as any),
      chainId,
      args: [
        allocations.map(prepareTransfer),
        coreAddress,
        prepareBoostPayload(onChainPayload),
        permit2Signature,
        nonce,
        deadline,
      ],
    });
    const receipt = await waitForTransactionReceipt(options.config, {
      hash: boostHash,
    });
    const boostCreatedLog = parseEventLogs({
      abi: boostCoreAbi,
      eventName: 'BoostCreated',
      logs: receipt.logs,
    }).at(0);
    let boostId = 0n;
    if (!boostCreatedLog) throw new BoostCoreNoIdentifierEmitted();
    boostId = boostCreatedLog?.args.boostId;
    const boost = await this.readBoost(boostId);
    return new Boost({
      id: boostId,
      budget: payload.budget.at(boost.budget),
      action: payload.action.at(boost.action),
      validator: payload.validator!.at(boost.validator),
      allowList: payload.allowList!.at(boost.allowList),
      incentives: payload.incentives.map((incentive, i) =>
        // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
        incentive.at(boost.incentives.at(i)!),
      ),
      protocolFee: boost.protocolFee,
      maxParticipants: boost.maxParticipants,
      owner: boost.owner,
    });
  }

  /**
   * Returns a transaction hash and simulated Boost creation using a TransparentBudget and Permit2
   *
   * @public
   * @async
   * @param {TransparentBudget | Address} budget - Either an instance of a transparent budget, or the address of a transparent budget
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)[]} allocations - An array of transfers to be allocated to the budget prior to Boost creation
   * @param {Omit<CreateBoostPayload, 'budget'>} _boostPayload - The core Boost configuration sans budget
   * @param {Hex} permit2Signature - The packed signature that was the result of signing the EIP712 hash of `permit`.
   * @param {bigint} nonce - The nonce for the permit2 batch transfer
   * @param {bigint} deadline - The deadline for the permit2 batch transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<HashAndSimulatedResult>}
   */
  public async createBoostWithPermit2Raw(
    budget: TransparentBudget | Address,
    allocations: (FungibleTransferPayload | ERC1155TransferPayload)[],
    _boostPayload: Omit<CreateBoostPayload, 'budget'>,
    permit2Signature: Hex,
    nonce: bigint,
    deadline: bigint,
    _params?: WriteParams,
  ): Promise<HashAndSimulatedResult> {
    const { request, result } = await this.simulateCreateBoostWithPermit2(
      budget,
      allocations,
      _boostPayload,
      permit2Signature,
      nonce,
      deadline,
      _params,
    );
    const hash = await writeTransparentBudgetCreateBoostWithPermit2(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Returns a simulated Boost creation using a TransparentBudget and Permit2
   *
   * @public
   * @async
   * @param {TransparentBudget | Address} budget - Either an instance of a transparent budget, or the address of a transparent budget
   * @param {(FungibleTransferPayload | ERC1155TransferPayload)[]} allocations - An array of transfers to be allocated to the budget prior to Boost creation
   * @param {Omit<CreateBoostPayload, 'budget'>} _boostPayload - The core Boost configuration sans budget
   * @param {Hex} permit2Signature - The packed signature that was the result of signing the EIP712 hash of `permit`.
   * @param {bigint} nonce - The nonce for the permit2 batch transfer
   * @param {bigint} deadline - The deadline for the permit2 batch transfer
   * @param {?WriteParams} [params]
   * @returns {Promise<SimulateContractReturnType>}
   */
  public async simulateCreateBoostWithPermit2(
    budget: TransparentBudget | Address,
    allocations: (FungibleTransferPayload | ERC1155TransferPayload)[],
    _boostPayload: Omit<CreateBoostPayload, 'budget'>,
    permit2Signature: Hex,
    nonce: bigint,
    deadline: bigint,
    _params?: WriteParams,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>({
        ..._boostPayload,
        budget: this.TransparentBudget(
          typeof budget === 'string' ? budget : budget.assertValidAddress(),
        ),
      });
    const desiredChainId = _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    const onChainPayload = await this.prepareCreateBoostPayload(
      coreAddress,
      chainId,
      payload,
      options,
    );

    return await simulateTransparentBudgetCreateBoostWithPermit2(this._config, {
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(_params as any),
      address:
        typeof budget === 'string' ? budget : budget.assertValidAddress(),
      chainId,
      args: [
        allocations.map(prepareTransfer),
        coreAddress,
        prepareBoostPayload(onChainPayload),
        permit2Signature,
        nonce,
        deadline,
      ],
    });
  }

  // This function mutates payload, which isn't awesome but it's fine
  public async prepareCreateBoostPayload(
    coreAddress: Address,
    chainId: number,
    payload: CreateBoostPayload,
    options: DeployableOptions,
  ): Promise<Required<BoostPayload>> {
    if (!payload.owner) {
      payload.owner =
        this._account?.address ||
        getAccount(options.config).address ||
        zeroAddress;
      if (payload.owner === zeroAddress) {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }

    // If not providing a custom validator, use either Boost's mainnet or testnet EOA, depending on provided chain id and given chain configurations
    if (!payload.validator) {
      const chains = getChains(options.config).filter(
        (chain) => !!this.addresses[chain.id] && chain.id === chainId,
      );
      const chain = chains.at(0);
      if (!chain)
        throw new InvalidProtocolChainIdError(
          chainId,
          Object.keys(this.addresses).map(Number),
        );
      const testnet = chain.testnet || chain.id === 31337;
      const signers = [
        (testnet
          ? BoostValidatorEOA.TESTNET
          : BoostValidatorEOA.MAINNET) as unknown as Address,
      ];

      // This seemed like the best approach - I didn't want to use the testnet PK even in local testing
      // May be another approach but this works for now and is pretty well isolated
      if (chain.id === 31337) {
        signers.push('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
      }

      payload.validator = this.LimitedSignerValidator({
        signers,
        validatorCaller: coreAddress,
        maxClaimCount: 1,
      });
    }

    let budgetPayload: BoostPayload['budget'] = zeroAddress;
    if (payload.budget.address) {
      budgetPayload = payload.budget.address;
      if (!(payload.budget instanceof TransparentBudget)) {
        if (!(await payload.budget.isAuthorized(coreAddress))) {
          throw new BudgetMustAuthorizeBoostCore(coreAddress);
        }
      }
    } else {
      throw new MustInitializeBudgetError();
    }

    // if we're supplying an address, it could be a pre-initialized target
    // if base is explicitly set to false, then it will not be initialized, and it will be referenced as is if it implements interface correctly
    let actionPayload: BoostPayload['action'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (payload.action.address) {
      const isBase = payload.action.isBase;
      actionPayload = {
        isBase: isBase,
        instance: payload.action.address,
        parameters: isBase
          ? payload.action.buildParameters(undefined, options).args.at(0) ||
            zeroHash
          : zeroHash,
      };
    } else {
      actionPayload.parameters =
        payload.action.buildParameters(undefined, options).args.at(0) ||
        zeroHash;
      actionPayload.instance = assertValidAddressByChainId(
        options.config,
        payload.action.bases,
        chainId,
      ).address;
    }

    let validatorPayload: BoostPayload['validator'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (payload.validator.address) {
      const isBase = payload.validator.isBase;
      validatorPayload = {
        isBase: isBase,
        instance: payload.validator.address,
        parameters: isBase
          ? payload.validator.buildParameters(undefined, options).args.at(0) ||
            zeroHash
          : zeroHash,
      };
    } else {
      validatorPayload.parameters =
        payload.validator.buildParameters(undefined, options).args.at(0) ||
        zeroHash;
      validatorPayload.instance = assertValidAddressByChainId(
        options.config,
        payload.validator.bases,
        chainId,
      ).address;
    }

    let allowListPayload: BoostPayload['allowList'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    // if allowlist not provided, assume open allowlist
    if (!payload.allowList) {
      payload.allowList = this.OpenAllowList();
    }
    if (payload.allowList.address) {
      const isBase = payload.allowList.isBase;
      allowListPayload = {
        isBase: isBase,
        instance: payload.allowList.address,
        parameters: isBase
          ? zeroHash // allowList.buildParameters(undefined, options).args.at(0) || zeroHash
          : zeroHash,
      };
    } else {
      allowListPayload.parameters =
        payload.allowList.buildParameters(undefined, options).args.at(0) ||
        zeroHash;
      allowListPayload.instance = assertValidAddressByChainId(
        options.config,
        payload.allowList.bases,
        chainId,
      ).address;
    }

    const incentivesPayloads: Array<Target> = payload.incentives.map(() => ({
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    }));
    for (let i = 0; i < payload.incentives.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
      const incentive = payload.incentives.at(i)!;
      if (incentive.address) {
        const isBase = incentive.isBase;
        if (!isBase) throw new IncentiveNotCloneableError(incentive);
        incentivesPayloads[i] = {
          isBase: isBase,
          instance: incentive.address,
          parameters: isBase
            ? incentive.buildParameters(undefined, options).args.at(0) ||
              zeroHash
            : zeroHash,
        };
      } else {
        // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
        incentivesPayloads[i]!.parameters =
          incentive.buildParameters(undefined, options).args.at(0) || zeroHash;
        // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
        incentivesPayloads[i]!.instance = assertValidAddressByChainId(
          options.config,
          incentive.bases,
          chainId,
        ).address;
      }
    }

    const onChainPayload = {
      budget: budgetPayload,
      action: actionPayload,
      validator: validatorPayload,
      allowList: allowListPayload,
      incentives: incentivesPayloads,
      protocolFee: payload.protocolFee || 0n,
      maxParticipants: payload.maxParticipants || 0n,
      owner: payload.owner,
    };

    return onChainPayload;
  }

  /**
   * Claims one incentive from a given `Boost` by `boostId` and `incentiveId`
   *
   * @public
   * @async
   * @param {bigint} boostId
   * @param {bigint} incentiveId
   * @param {Address} address
   * @param {Hex} data
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async claimIncentive(
    boostId: bigint,
    incentiveId: bigint,
    address: Address,
    data: Hex,
    params?: WriteParams,
  ) {
    return await this.awaitResult(
      this.claimIncentiveRaw(boostId, incentiveId, address, data, params),
    );
  }

  /**
   * Claim an incentive for a Boost
   *
   * @public
   * @async
   * @param {bigint} boostId - The ID of the Boost
   * @param {bigint} incentiveId - The ID of the Incentive
   * @param {Address} referrer - The address of the referrer (if any)
   * @param {Hex} data- The data for the claim
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async claimIncentiveRaw(
    boostId: bigint,
    incentiveId: bigint,
    referrer: Address,
    data: Hex,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateBoostCoreClaimIncentive(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chainId,
        ),
        args: [boostId, incentiveId, referrer, data],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostCoreClaimIncentive(this._config, request);
    return { hash, result };
  }

  /**
   * Claims one incentive for a given `Boost` on behalf of another user by `boostId` and `incentiveId`
   *
   * @public
   * @async
   * @param {bigint} boostId
   * @param {bigint} incentiveId
   * @param {Address} referrer
   * @param {Hex} data
   * @param {Address} claimant
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async claimIncentiveFor(
    boostId: bigint,
    incentiveId: bigint,
    referrer: Address,
    data: Hex,
    claimant: Address,
    params?: WriteParams,
  ) {
    return await this.awaitResult(
      this.claimIncentiveForRaw(
        boostId,
        incentiveId,
        referrer,
        data,
        claimant,
        params,
      ),
    );
  }

  /**
   * Claim an incentive for a Boost on behalf of another user
   *
   * @public
   * @async
   * @param {bigint} boostId - The ID of the Boost
   * @param {bigint} incentiveId - The ID of the Incentive
   * @param {Address} referrer - The address of the referrer (if any)
   * @param {Hex} data - The data for the claim
   * @param {Address} claimant - The address of the user eligible for the incentive payout
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: Hex; result: void; }>}
   */
  public async claimIncentiveForRaw(
    boostId: bigint,
    incentiveId: bigint,
    referrer: Address,
    data: Hex,
    claimant: Address,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateBoostCoreClaimIncentiveFor(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chainId,
        ),
        args: [boostId, incentiveId, referrer, data, claimant],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostCoreClaimIncentiveFor(this._config, request);
    return { hash, result };
  }

  /**
   * Get a Boost by index, will return the raw on chain representation of a Boost.
   *
   * @public
   * @async
   * @param {bigint | string} id
   * @param {?ReadParams} [params]
   * @returns {Promise<RawBoost>}
   * @throws {@link BoostNotFoundError}
   */
  public async readBoost(
    _id: string | bigint,
    params?: ReadParams,
  ): Promise<RawBoost> {
    try {
      let id: bigint;
      if (typeof _id === 'string') {
        id = BigInt(_id);
      } else id = _id;
      return await readBoostCoreGetBoost(this._config, {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chainId,
        ),
        args: [id],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      });
      // biome-ignore lint/suspicious/noExplicitAny: unknown error
    } catch (e: any) {
      if (e?.message?.includes('bounds'))
        throw new BoostNotFoundError(String(_id));
      throw e;
    }
  }

  /**
   * Get a Boost by index, will return a new {@link Boost} with correct target implementations instantiated, ie `(await core.getBoost(0n)).allowList instanceof SimpleAllowList` vs `SimpleDenyList`
   *
   * @public
   * @async
   * @param {(string | bigint)} _id
   * @param {?ReadParams} [params]
   * @returns {Promise<Boost>}
   * @throws {@link BoostNotFoundError}
   */
  public async getBoost(_id: string | bigint, params?: ReadParams) {
    let id: bigint;
    if (typeof _id === 'string') {
      id = BigInt(_id);
    } else id = _id;
    const { protocolFee, maxParticipants, owner, ...boostPayload } =
      await this.readBoost(id, params);
    const options: DeployableOptions = {
      config: this._config,
      account: this._account,
    };
    const [action, budget, validator, allowList, incentives] =
      await Promise.all([
        actionFromAddress(options, boostPayload.action, params),
        budgetFromAddress(options, boostPayload.budget, params),
        validatorFromAddress(options, boostPayload.validator, params),
        allowListFromAddress(options, boostPayload.allowList, params),
        Promise.all(
          boostPayload.incentives.map((incentiveAddress) =>
            incentiveFromAddress(options, incentiveAddress, params),
          ),
        ),
      ]);
    return new Boost({
      id,
      action,
      budget,
      validator,
      allowList,
      incentives: incentives as Incentive[],
      protocolFee,
      maxParticipants,
      owner,
    });
  }

  /**
   * Retrieve the total number of deployed Boosts
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async getBoostCount(params?: ReadParams) {
    return await readBoostCoreGetBoostCount(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Checks if an address is authorized
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?ReadParams &
   *       ReadParams} [params]
   * @returns {Promise<boolean>}
   */
  public async isAuthorized(
    address: Address,
    params?: ReadParams & ReadParams,
  ) {
    const auth = await this.createBoostAuth(params);
    return readIAuthIsAuthorized(this._config, {
      address: auth,
      args: [address],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Retrieve the address of the current creation auth provider.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async createBoostAuth(params?: ReadParams) {
    return await readBoostCoreCreateBoostAuth(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   *  Replace the current auth scheme.
   *
   * @public
   * @async
   * @param {Auth} auth
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setCreateBoostAuth(auth: Auth, params?: WriteParams) {
    return await this.awaitResult(
      this.setCreateBoostAuthRaw(auth.assertValidAddress(), {
        ...params,
      }),
    );
  }

  /**
   * Set the createBoostAuth address
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setCreateBoostAuthRaw(address: Address, params?: WriteParams) {
    const { request, result } = await simulateBoostCoreSetCreateBoostAuth(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chainId,
        ),
        args: [address],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostCoreSetCreateBoostAuth(this._config, request);
    return { hash, result };
  }

  /**
   * Get the protocol fee.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {unknown}
   */
  public async protocolFee(params?: ReadParams) {
    return await readBoostCoreProtocolFee(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get the protocol fee receiver.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<Address>}
   */
  public async protocolFeeReceiver(params?: ReadParams) {
    return await readBoostCoreProtocolFeeReceiver(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Set the protocol fee receiver address. This function is only callable by the owner.
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setProcolFeeReceiver(address: Address, params?: WriteParams) {
    return await this.awaitResult(
      this.setProcolFeeReceiverRaw(address, {
        ...params,
      }),
    );
  }

  /**
   * Set the protocol fee receiver address. This function is only callable by the owner.
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setProcolFeeReceiverRaw(address: Address, params?: WriteParams) {
    const { request, result } = await simulateBoostCoreSetProtocolFeeReceiver(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chainId,
        ),
        args: [address],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostCoreSetProtocolFeeReceiver(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Get the incentives fees information for a given Boost ID and Incentive ID.
   *
   * @public
   * @async
   * @param {bigint} boostId - The ID of the Boost
   * @param {bigint} incentiveId - The ID of the Incentive
   * @param {?ReadParams} [params]
   * @returns {Promise<IncentiveDisbursalInfo>}
   */
  public async getIncentiveFeesInfo(
    boostId: bigint,
    incentiveId: bigint,
    params?: ReadParams,
  ) {
    const key = keccak256(
      encodePacked(['uint256', 'uint256'], [boostId, incentiveId]),
    );

    return await readBoostCoreGetIncentiveFeesInfo(this._config, {
      ...assertValidAddressByChainId(
        this._config,
        this.addresses,
        params?.chainId,
      ),
      args: [key],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Retrieves the claim information from a transaction receipt.
   *
   * @param {GetTransactionReceiptParameters} params - The parameters required to get the transaction receipt.
   * @returns {Promise<{ boostId: bigint, incentiveId: bigint, claimer: Address, amount: bigint } | undefined>} The claim information if found, undefined otherwise.
   *
   * @description
   * This method retrieves the transaction receipt using the provided parameters,
   * then parses the logs to find the 'BoostClaimed' event.
   * If found, it returns the arguments of the event, which include the boost ID,
   * incentive ID, claimer address, and claimed amount.
   *
   * @example
   * ```ts
   * const claimInfo = await boostCore.getClaimFromTransaction({
   *   hash: '0x...',
   *   chainId: 1
   * });
   * if (claimInfo) {
   *   console.log(`Boost ${claimInfo.boostId} claimed by ${claimInfo.claimer}`);
   * }
   * ```
   */
  public async getClaimFromTransaction(
    params: GetTransactionReceiptParameters,
  ) {
    const receipt = await getTransactionReceipt(this._config, params);
    const logs = parseEventLogs({
      abi: boostCoreAbi,
      eventName: 'BoostClaimed',
      logs: receipt.logs,
    });
    return logs.at(0)?.args;
  }

  /**
   * Calculate the protocol fee for ERC20 or ETH assets for a given amount. Fees are collected when initializing new incentives, or clawing back from incentives.
   *
   * @example
   * ```ts
   * const fee = await core.calculateProtocolFee(
   *  await incentive.getTotalBudget()
   * )
   * const totalIncentiveFundAmount = desiredAmount + fee
   * await erc20.approve(budget.assertValidAddress(), totalIncentiveFundAmount);
   * await budget.allocate({
   *  amount: totalIncentiveFundAmount,
   *  asset: erc20.assertValidAddress(),
   *  target: '0xME',
   * });
   *
   * ```
   * @public
   * @async
   * @param {bigint} [amount]
   * @param {?ReadParams} [params]
   * @returns {Promise<void>}
   */
  public async calculateProtocolFee(amount: bigint, params?: ReadParams) {
    const protocolFee = await this.protocolFee(params);
    return (amount * protocolFee) / FEE_DENOMINATOR;
  }

  /**
   * Bound {@link PassthroughAuth} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const auth = core.PassthroughAuth('0x') // is roughly equivalent to
   * const auth = new PassthroughAuth({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {Address} address
   * @returns {PassthroughAuth}
   */
  PassthroughAuth(address?: Address) {
    return new PassthroughAuth(
      { config: this._config, account: this._account },
      address,
    );
  }

  // /**
  //  * Bound {@link ContractAction} constructor that reuses the same configuration as the Boost Core instance.
  //  *
  //  * @example
  //  * ```ts
  //  * const action = core.ContractAction('0x') // is roughly equivalent to
  //  * const action = new ContractAction({ config: core._config, account: core._account }, '0x')
  //  * ```
  //  * @param {DeployablePayloadOrAddress<ContractActionPayload>} options
  //  * @param {?boolean} [isBase]
  //  * @returns {ContractAction}
  //  */
  // ContractAction(
  //   options: DeployablePayloadOrAddress<ContractActionPayload>,
  //   isBase?: boolean,
  // ) {
  //   return new ContractAction(
  //     { config: this._config, account: this._account },
  //     options,
  //     isBase,
  //   );
  // }

  /**
   * Bound {@link EventAction} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const action = core.EventAction('0x') // is roughly equivalent to
   * const action = new EventAction({ config: core._config, account: core._account }, '0x')
   */
  EventAction(
    options: DeployablePayloadOrAddress<EventActionPayload>,
    isBase?: boolean,
  ) {
    return new EventAction(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }
  // /**
  //  * Bound {@link ERC721MintAction} constructor that reuses the same configuration as the Boost Core instance.
  //  *
  //  * @example
  //  * ```ts
  //  * const action = core.ERC721MintAction('0x') // is roughly equivalent to
  //  * const action = new ERC721MintAction({ config: core._config, account: core._account }, '0x')
  //  * ```
  //  * @param {DeployablePayloadOrAddress<ERC721MintActionPayload>} options
  //  * @param {?boolean} [isBase]
  //  * @returns {ERC721MintAction}
  //  */
  // ERC721MintAction(
  //   options: DeployablePayloadOrAddress<ERC721MintActionPayload>,
  //   isBase?: boolean,
  // ) {
  //   return new ERC721MintAction(
  //     { config: this._config, account: this._account },
  //     options,
  //     isBase,
  //   );
  // }
  /**
   * Bound {@link OpenAllowList} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const list = core.OpenAllowList('0x') // is roughly equivalent to
   * const list = new OpenAllowList({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {?boolean} [isBase]
   * @returns {OpenAllowList}
   */
  OpenAllowList(isBase?: boolean) {
    return new OpenAllowList(
      { config: this._config, account: this._account },
      undefined,
      isBase,
    );
  }
  /**
   * Bound {@link SimpleAllowList} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const list = core.SimpleAllowList('0x') // is roughly equivalent to
   * const list = new SimpleAllowList({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<SimpleAllowListPayload>} options
   * @param {?boolean} [isBase]
   * @returns {SimpleAllowList}
   */
  SimpleAllowList(
    options: DeployablePayloadOrAddress<SimpleAllowListPayload>,
    isBase?: boolean,
  ) {
    return new SimpleAllowList(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }
  /**
   * Bound {@link SimpleDenyList} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const list = core.SimpleDenyList('0x') // is roughly equivalent to
   * const list = new SimpleDenyList({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<SimpleDenyListPayload>} options
   * @param {?boolean} [isBase]
   * @returns {SimpleDenyList}
   */
  SimpleDenyList(
    options: DeployablePayloadOrAddress<SimpleDenyListPayload>,
    isBase?: boolean,
  ) {
    return new SimpleDenyList(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }
  /**
   * Bound {@link OffchainAccessList} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const list = core.OffchainAccessList('0x') // is roughly equivalent to
   * const list = new OffchainAccessList({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<OffchainAccessListPayload>} options
   * @param {?boolean} [isBase]
   * @returns {OffchainAccessList}
   */
  OffchainAccessList(
    options: DeployablePayloadOrAddress<OffchainAccessListPayload>,
    isBase?: boolean,
  ) {
    return new OffchainAccessList(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }
  // /**
  //  * Bound {@link SimpleBudget} constructor that reuses the same configuration as the Boost Core instance.
  //  *
  //  * @example
  //  * ```ts
  //  * const budget = core.SimpleBudget('0x') // is roughly equivalent to
  //  * const budget = new SimpleBudget({ config: core._config, account: core._account }, '0x')
  //  * ```
  //  * @param {DeployablePayloadOrAddress<SimpleBudgetPayload>} options
  //  * @returns {SimpleBudget}
  //  */
  // SimpleBudget(options: DeployablePayloadOrAddress<SimpleBudgetPayload>) {
  //   return new SimpleBudget(
  //     { config: this._config, account: this._account },
  //     options,
  //   );
  // }
  /**
   * Bound {@link ManagedBudget} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const budget = core.ManagedBudget('0x') // is roughly equivalent to
   * const budget = new ManagedBudget({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<ManagedBudgetPayload>} options
   * @returns {ManagedBudget}
   */
  ManagedBudget(options: DeployablePayloadOrAddress<ManagedBudgetPayload>) {
    if (
      typeof options !== 'string' &&
      !options.authorized.includes(this.assertValidAddress())
    ) {
      options.authorized = [this.assertValidAddress(), ...options.authorized];
      options.roles = [Roles.MANAGER, ...options.roles];
    }
    return new ManagedBudget(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Bound {@link ManagedBudgetWithFees} constructor that reuses the same configuration as the Boost Core instance.
   * Prepends the BoostCore address to the authorized list because it's structurally critical to calculating payouts.
   *
   * @example
   * ```ts
   * const budget = core.ManagedBudgetWithFees('0x') // is roughly equivalent to
   * const budget = new ManagedBudgetWithFees({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<ManagedBudgetWithFeesPayload>} options
   * @returns {ManagedBudgetWithFees}
   */
  ManagedBudgetWithFees(
    options: DeployablePayloadOrAddress<ManagedBudgetWithFeesPayload>,
  ) {
    if (
      typeof options !== 'string' &&
      !options.authorized.includes(this.assertValidAddress())
    ) {
      options.authorized = [this.assertValidAddress(), ...options.authorized];
      options.roles = [Roles.MANAGER, ...options.roles];
    }

    return new ManagedBudgetWithFees(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Bound {@link ManagedBudgetWithFeesV2} constructor that reuses the same configuration as the Boost Core instance.
   * Prepends the BoostCore address to the authorized list because it's structurally critical to calculating payouts.
   *
   * @example
   * ```ts
   * const budget = core.ManagedBudgetWithFeesV2('0x') // is roughly equivalent to
   * const budget = new ManagedBudgetWithFeesV2({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<ManagedBudgetWithFeesV2Payload>} options
   * @returns {ManagedBudgetWithFeesV2}
   */
  ManagedBudgetWithFeesV2(
    options: DeployablePayloadOrAddress<ManagedBudgetWithFeesV2Payload>,
  ) {
    if (
      typeof options !== 'string' &&
      !options.authorized.includes(this.assertValidAddress())
    ) {
      options.authorized = [this.assertValidAddress(), ...options.authorized];
      options.roles = [Roles.MANAGER, ...options.roles];
    }

    return new ManagedBudgetWithFeesV2(
      { config: this._config, account: this._account },
      options,
    );
  }
  // /**
  //  * Bound {@link TransparentBudget} constructor that reuses the same configuration as the Boost Core instance.
  //  *
  //  * @example
  //  * ```ts
  //  * const budget = core.TransparentBudget('0x') // is roughly equivalent to
  //  * const budget = new TransparentBudget({ config: core._config, account: core._account }, '0x')
  //  * ```
  //  * @param {DeployablePayloadOrAddress<never>} options
  //  * @returns {TransparentBudget}
  //  */
  // TransparentBudget(options: DeployablePayloadOrAddress<never>) {
  //   return new TransparentBudget(
  //     { config: this._config, account: this._account },
  //     options,
  //   );
  // }
  /**
   * Bound {@link TransparentBudget} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const budget = core.TransparentBudget('0x') // is roughly equivalent to
   * const budget = new TransparentBudget({ config: core._config, account: core._account }, '0x')
   * ```
   * @param {DeployablePayloadOrAddress<ManagedBudgetPayload>} options
   * @returns {TransparentBudget}
   */
  TransparentBudget(options: DeployablePayloadOrAddress<never>) {
    return new TransparentBudget(
      { config: this._config, account: this._account },
      options,
    );
  }
  // /**
  //  * Bound {@link VestingBudget} constructor that reuses the same configuration as the Boost Core instance.
  //  *
  //  * @example
  //  * ```ts
  //  * const budget = core.VestingBudget('0x') // is roughly equivalent to
  //  * const budget = new VestingBudget({ config: core._config, account: core._account }, '0x')
  //  * ```
  //  * @param {DeployablePayloadOrAddress<VestingBudgetPayload>} options
  //  * @returns {VestingBudget}
  //  */
  // VestingBudget(options: DeployablePayloadOrAddress<VestingBudgetPayload>) {
  //   return new VestingBudget(
  //     { config: this._config, account: this._account },
  //     options,
  //   );
  // }
  /**
   * Bound {@link AllowListIncentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const incentive = core.AllowListIncentive({ ... }) // is roughly equivalent to
   * const incentive = new AllowListIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<VestingBudgetPayload>} options
   * @returns {VestingBudget}
   */
  AllowListIncentive(options: AllowListIncentivePayload) {
    return new AllowListIncentive(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Bound {@link CGDAIncentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const incentive = core.CGDAIncentive({ ... }) // is roughly equivalent to
   * const incentive = new CGDAIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {CGDAIncentivePayload} options
   * @returns {CGDAIncentive}
   */
  CGDAIncentive(options: CGDAIncentivePayload) {
    return new CGDAIncentive(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Bound {@link ERC20Incentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const incentive = core.ERC20Incentive({ ... }) // is roughly equivalent to
   * const incentive = new ERC20Incentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {ERC20IncentivePayload} options
   * @returns {ERC20Incentive}
   */
  ERC20Incentive(options: ERC20IncentivePayload) {
    return new ERC20Incentive(
      { config: this._config, account: this._account },
      options,
    );
  }

  /**
   * Bound {@link ERC20PeggedIncentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const incentive = core.ERC20PeggedIncentive({ ... }) // is roughly equivalent to
   * const incentive = new ERC20PeggedIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {ERC20PeggedIncentivePayload} options
   * @returns {ERC20PeggedIncentive}
   */
  ERC20PeggedIncentive(options: ERC20PeggedIncentivePayload) {
    return new ERC20PeggedIncentive(
      { config: this._config, account: this._account },
      options,
    );
  }
  // /**
  //  * Temporarily disabled until low level ABI encoding bugs are resolved
  //  * Bound {@link ERC1155Incentive} constructor that reuses the same configuration as the Boost Core instance.
  //  *
  //  * @experimental
  //  * @example
  //  * ```ts
  //  * const incentive = core.ERC1155Incentive({ ... }) // is roughly equivalent to
  //  * const incentive = new ERC1155Incentive({ config: core._config, account: core._account }, { ... })
  //  * ```
  //  * @param {ERC1155IncentivePayload} options
  //  * @returns {ERC1155Incentive}
  //  */
  // ERC1155Incentive(options: ERC1155IncentivePayload) {
  //   return new ERC1155Incentive(
  //     { config: this._config, account: this._account },
  //     options,
  //   );
  // }
  /**
   * Bound {@link PointsIncentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const incentive = core.PointsIncentive({ ... }) // is roughly equivalent to
   * const incentive = new PointsIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {PointsIncentivePayload} options
   * @returns {PointsIncentive}
   */
  PointsIncentive(options: PointsIncentivePayload) {
    return new PointsIncentive(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Bound {@link SignerValidator} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.SignerValidator({ ... }) // is roughly equivalent to
   * const validator = new SignerValidator({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<SignerValidatorPayload>} options
   * @param {?boolean} [isBase]
   * @returns {SignerValidator}
   */
  SignerValidator(
    options: DeployablePayloadOrAddress<SignerValidatorPayload>,
    isBase?: boolean,
  ) {
    return new SignerValidator(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }

  /**
   * Bound {@link LimitedSignerValidator} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.LimitedSignerValidator({ ... }) // is roughly equivalent to
   * const validator = new LimitedSignerValidator({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<LimitedSignerValidatorPayload>} options
   * @param {?boolean} [isBase]
   * @returns {LimitedSignerValidator}
   */
  LimitedSignerValidator(
    options: DeployablePayloadOrAddress<LimitedSignerValidatorPayload>,
    isBase?: boolean,
  ) {
    return new LimitedSignerValidator(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }

  /**
   * Bound {@link PayableLimitedSignerValidator} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.PayableLimitedSignerValidator({ ... }) // is roughly equivalent to
   * const validator = new PayableLimitedSignerValidator({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<PayableLimitedSignerValidatorPayload>} options
   * @param {?boolean} [isBase]
   * @returns {PayableLimitedSignerValidator}
   */
  PayableLimitedSignerValidator(
    options: DeployablePayloadOrAddress<PayableLimitedSignerValidatorPayload>,
    isBase?: boolean,
  ) {
    return new PayableLimitedSignerValidator(
      { config: this._config, account: this._account },
      options,
      isBase ?? false,
    );
  }

  /**
   * Bound {@link ERC20VariableCriteriaIncentiveV2} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.ERC20VariableCrtieriaIncentive({ ... }) // is roughly equivalent to
   * const validator = new ERC20VariableCrtieriaIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<ERC20VariableCrtieriaIncentivePayload>} options
   * @param {?boolean} [isBase]
   * @returns {ERC20VariableCrtieriaIncentiveV2}
   * */
  ERC20VariableCriteriaIncentiveV2(
    options: DeployablePayloadOrAddress<ERC20VariableCriteriaIncentiveV2Payload>,
    isBase?: boolean,
  ) {
    return new ERC20VariableCriteriaIncentiveV2(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }

  /**
   * Bound {@link ERC20PeggedVariableCriteriaIncentiveV2} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.ERC20PeggedVariableCriteriaIncentiveV2({ ... }) // is roughly equivalent to
   * const validator = new ERC20PeggedVariableCriteriaIncentiveV2({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<ERC20PeggedVariableCriteriaIncentiveV2>} options
   * @param {?boolean} [isBase]
   * @returns {ERC20PeggedVariableCriteriaIncentiveV2}
   * */
  ERC20PeggedVariableCriteriaIncentiveV2(
    options: DeployablePayloadOrAddress<ERC20PeggedVariableCriteriaIncentiveV2Payload>,
    isBase?: boolean,
  ) {
    return new ERC20PeggedVariableCriteriaIncentiveV2(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }

  /**
   * Bound {@link ERC20VariableIncentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.ERC20VariableIncentive({ ... }) // is roughly equivalent to
   * const validator = new ERC20VariableIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<ERC20VariableIncentivePayload>} options
   * @param {?boolean} [isBase]
   * @returns {ERC20VariableIncentive}
   */
  ERC20VariableIncentive(
    options: DeployablePayloadOrAddress<ERC20VariableIncentivePayload>,
    isBase?: boolean,
  ) {
    return new ERC20VariableIncentive(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?[Address, Address, Address]} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: [Address, Address, Address],
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    return {
      abi: boostCoreAbi,
      bytecode: bytecode as Hex,
      args: payload,
      ...this.optionallyAttachAccount(options.account),
    };
  }
  /**
   * Prepares and executes a top-up from a Budget, specifying the net top-up amount
   * that should land in the incentive (the protocol fee is added automatically).
   *
   * @public
   * @async
   * @param {bigint} boostId The ID of the Boost
   * @param {bigint} incentiveId The ID of the incentive within that Boost
   * @param {any} topupPayload A typed struct for the incentive’s top-up parameters
   * @param {Address} [budget] Optional override budget address (otherwise uses the Boost’s budget)
   * @param {?WriteParams} [params] Additional transaction overrides
   * @returns {Promise<{ hash: Hex; result: void }>} The transaction hash and simulation result
   */
  public async topupIncentiveFromBudgetPreFee(
    boostId: bigint,
    incentiveId: bigint,
    topupAmount: bigint,
    budget?: Address,
    params?: WriteParams,
  ) {
    const boost = await this.getBoost(boostId, params as ReadParams);
    if (incentiveId >= boost.incentives.length) {
      throw new Error(`Incentive ID ${incentiveId} out of range`);
    }
    const incentive = boost.incentives[Number(incentiveId)];
    if (!incentive) {
      throw new Error(`Incentive with ID ${incentiveId} not found`);
    }

    const incentiveData = await incentive.getTopupPayload(topupAmount);

    if (!(topupAmount > 0)) {
      throw new Error('Top-up amount must be greater than zero');
    }

    return await this.topupIncentiveFromBudgetRaw(
      boostId,
      incentiveId,
      incentiveData,
      budget,
      params,
    );
  }

  /**
   * Prepares and executes a top-up from a Budget, specifying the entire total tokens
   * (incentive + fee) you want to disburse. We'll back-calculate how many tokens land
   * in the incentive.
   *
   * @public
   * @async
   * @param {bigint} boostId The ID of the Boost
   * @param {bigint} incentiveId The ID of the incentive within that Boost
   * @param {any} topupPayload A typed struct for the incentive’s top-up parameters
   * @param {bigint} totalAmount The total tokens to disburse
   * @param {Address} [budget] Optional override budget address
   * @param {?WriteParams} [params] Additional transaction overrides
   * @returns {Promise<{ hash: Hex; result: void }>}
   */
  public async topupIncentiveFromBudgetPostFee(
    boostId: bigint,
    incentiveId: bigint,
    totalAmount: bigint,
    budget?: Address,
    params?: WriteParams,
  ) {
    const feeBps = await this.protocolFee(params as ReadParams);
    const topupAmount =
      (totalAmount * FEE_DENOMINATOR) / (FEE_DENOMINATOR + feeBps);
    return this.topupIncentiveFromBudgetPreFee(
      boostId,
      incentiveId,
      topupAmount,
      budget,
      params,
    );
  }

  /**
   * Prepares and executes a top-up from the caller (msg.sender), specifying the net top-up
   * to land in the incentive. We'll add the protocol fee on top automatically.
   *
   * @public
   * @async
   * @param {bigint} boostId The ID of the Boost
   * @param {bigint} incentiveId The ID of the incentive within that Boost
   * @param {any} topupPayload A typed struct for the incentive’s top-up parameters
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: Hex; result: void }>}
   */
  public async topupIncentiveFromSenderPreFee(
    boostId: bigint,
    incentiveId: bigint,
    topupAmount: bigint,
    params?: WriteParams,
  ) {
    const boost = await this.getBoost(boostId, params as ReadParams);
    if (incentiveId >= boost.incentives.length) {
      throw new Error(`Incentive ID ${incentiveId} out of range`);
    }
    const incentive = boost.incentives[Number(incentiveId)];
    if (!incentive) {
      throw new Error(`Incentive with ID ${incentiveId} not found`);
    }

    if (!(topupAmount > 0)) {
      throw new Error('Top-up amount must be greater than zero');
    }

    const incentiveData = await incentive.getTopupPayload(topupAmount);

    return await this.topupIncentiveFromSenderRaw(
      boostId,
      incentiveId,
      incentiveData,
      params,
    );
  }

  /**
   * Prepares and executes a top-up from the caller (msg.sender), specifying the total
   * tokens you’re willing to provide (including fee). We'll back-calculate the net
   * top-up for the incentive.
   *
   * @public
   * @async
   * @param {bigint} boostId The ID of the Boost
   * @param {bigint} incentiveId The ID of the incentive within that Boost
   * @param {any} topupPayload A typed struct for the incentive’s top-up parameters
   * @param {bigint} totalAmount The entire tokens (top-up + fee)
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: Hex; result: void }>}
   */
  public async topupIncentiveFromSenderPostFee(
    boostId: bigint,
    incentiveId: bigint,
    totalAmount: bigint,
    params?: WriteParams,
  ) {
    const feeBps = await this.protocolFee(params as ReadParams);
    const topupAmount =
      (totalAmount * FEE_DENOMINATOR) / (FEE_DENOMINATOR + feeBps);

    return this.topupIncentiveFromSenderPreFee(
      boostId,
      incentiveId,
      topupAmount,
      params,
    );
  }

  /**
   * A lower-level function that actually calls `topupIncentiveFromSender` on-chain,
   * passing the final total. The contract modifies its internal logic to split net top-up vs. fee.
   *
   * @private
   * @param {bigint} boostId
   * @param {bigint} incentiveId
   * @param {Hex} preflightData The raw ABudget.Transfer data from preflight
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: Hex; result: void }>}
   */
  private async topupIncentiveFromSenderRaw(
    boostId: bigint,
    incentiveId: bigint,
    preflightData: Hex,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateBoostCoreTopupIncentiveFromSender(
      this._config,
      {
        ...this.optionallyAttachAccount(),
        ...(params as object),
        address: this.assertValidAddress(),
        args: [boostId, incentiveId, preflightData],
      },
    );
    const hash = await writeBoostCoreTopupIncentiveFromSender(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * A lower-level function that actually calls `topupIncentiveFromBudget` on-chain,
   * passing the preflight data plus the final total. The contract itself modifies
   * the amount to (topup + fee).
   *
   * @private
   * @param {bigint} boostId
   * @param {bigint} incentiveId
   * @param {Hex} preflightData The raw ABudget.Transfer (encoded) from preflight
   * @param {Address} [budget] Optional override for the budget
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: Hex; result: void }>}
   */
  private async topupIncentiveFromBudgetRaw(
    boostId: bigint,
    incentiveId: bigint,
    preflightData: Hex,
    budget?: Address,
    params?: WriteParams,
  ) {
    // e.g. run "simulate + write" pattern
    const { request, result } = await simulateBoostCoreTopupIncentiveFromBudget(
      this._config,
      {
        ...this.optionallyAttachAccount(),
        ...(params as object),
        address: this.assertValidAddress(),
        args: [boostId, incentiveId, preflightData, budget ?? zeroAddress],
      },
    );
    const hash = await writeBoostCoreTopupIncentiveFromBudget(
      this._config,
      request,
    );
    return { hash, result };
  }
}
