import {
  boostCoreAbi,
  type iAuthAbi,
  readBoostCoreClaimFee,
  readBoostCoreCreateBoostAuth,
  readBoostCoreGetBoost,
  readBoostCoreGetBoostCount,
  readBoostCoreProtocolFee,
  readBoostCoreProtocolFeeReceiver,
  readIAuthIsAuthorized,
  simulateBoostCoreClaimIncentive,
  simulateBoostCoreClaimIncentiveFor,
  simulateBoostCoreSetClaimFee,
  simulateBoostCoreSetCreateBoostAuth,
  simulateBoostCoreSetProtocolFeeReceiver,
  writeBoostCoreClaimIncentive,
  writeBoostCoreClaimIncentiveFor,
  writeBoostCoreSetClaimFee,
  writeBoostCoreSetCreateBoostAuth,
  writeBoostCoreSetProtocolFeeReceiver,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json';
import {
  type GetTransactionReceiptParameters,
  getAccount,
  getTransactionReceipt,
  waitForTransactionReceipt,
} from '@wagmi/core';
import { createWriteContract } from '@wagmi/core/codegen';
import {
  type Address,
  type ContractEventName,
  type Hex,
  parseEther,
  parseEventLogs,
  zeroAddress,
  zeroHash,
} from 'viem';
import { BoostCore as BoostCoreBases } from '../dist/deployments.json';
import { type Action, actionFromAddress } from './Actions/Action';
import { EventAction, type EventActionPayload } from './Actions/EventAction';
import { type AllowList, allowListFromAddress } from './AllowLists/AllowList';
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
  type Target,
  prepareBoostPayload,
} from './Boost';
import { type Budget, budgetFromAddress } from './Budgets/Budget';
import {
  ManagedBudget,
  type ManagedBudgetPayload,
} from './Budgets/ManagedBudget';
import {
  Deployable,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
  type GenericDeployableParams,
} from './Deployable/Deployable';
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
  ERC20VariableCriteriaIncentive,
  type ERC20VariableCriteriaIncentivePayload,
} from './Incentives/ERC20VariableCriteriaIncentive';
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
  SignerValidator,
  type SignerValidatorPayload,
} from './Validators/SignerValidator';
import { type Validator, validatorFromAddress } from './Validators/Validator';
import {
  BoostCoreNoIdentifierEmitted,
  BudgetMustAuthorizeBoostCore,
  DeployableUnknownOwnerProvidedError,
  IncentiveNotCloneableError,
  MustInitializeBudgetError,
} from './errors';
import {
  type GenericLog,
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
 * The fee (in wei) required to claim each incentive, must be provided for the `claimIncentive` transaction
 *
 * @type {bigint}
 */
export const BOOST_CORE_CLAIM_FEE = parseEther('0.000075');

/**
 * The address of the deployed BoostCore instance. In prerelease mode, this will be its sepolia address
 *
 * @type {Address}
 */
export const BOOST_CORE_ADDRESS =
  (BoostCoreBases as Record<string, Address>)[__DEFAULT_CHAIN_ID__] ||
  zeroAddress;

/**
 * The fixed addresses for the deployed Boost Core.
 * By default, `new BoostCore` will use the address deployed to the currently connected chain, or `BOOST_CORE_ADDRESS` if not provided.
 *
 * @type {Record<number, Address>}
 */
export const BOOST_CORE_ADDRESSES: Record<number, Address> = {
  ...(BoostCoreBases as Record<number, Address>),
  31337: import.meta.env.VITE_BOOST_CORE_ADDRESS,
};

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
}

/**
 * Typeguard to determine if a user is intending to deploy a new instance of the Boost Core contracts with {@link BoostCoreOptionsWithPayload}.
 *
 * @param {*} opts
 * @returns {opts is BoostCoreOptionsWithPayload}
 */
// biome-ignore lint/suspicious/noExplicitAny: type guard
function isBoostCoreDeployable(opts: any): opts is BoostCoreOptionsWithPayload {
  return opts.registryAddress && opts.protocolFeeReceiver;
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
  allowList: AllowList;
  incentives: Array<Incentive>;
  protocolFee?: bigint;
  referralFee?: bigint;
  maxParticipants?: bigint;
  owner?: Address;
};

/**
 * The core contract for the Boost protocol. Used to create and retrieve deployed Boosts.
 *
 * @export
 * @class BoostCore
 * @typedef {BoostCore}
 * @extends {Deployable<[Address, Address]>}
 */
export class BoostCore extends Deployable<
  [Address, Address],
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
   * @param {({ address?: Address; } | { registryAddress: Address; protocolFeeReceiver: Address; })} param0....options
   */
  constructor({ config, account, ...options }: BoostCoreConfig) {
    if (isBoostCoreDeployed(options) && options.address) {
      super({ account, config }, options.address);
    } else if (isBoostCoreDeployable(options)) {
      super({ account, config }, [
        options.registryAddress,
        options.protocolFeeReceiver,
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
   * @param {?DeployableOptions} [_options]
   * @returns {Promise<Boost>}
   */
  public async createBoost(
    _boostPayload: CreateBoostPayload,
    _params?: DeployableOptions &
      WriteParams<typeof boostCoreAbi, 'createBoost'>,
  ) {
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>(_boostPayload, _params);
    const desiredChainId = _params?.chain?.id || _params?.chainId;
    const { chainId, address: coreAddress } = assertValidAddressByChainId(
      options.config,
      this.addresses,
      desiredChainId,
    );

    let {
      budget,
      action,
      validator,
      allowList,
      incentives,
      protocolFee = 0n,
      referralFee = 0n,
      maxParticipants = 0n,
      owner,
    } = payload;

    const boostFactory = createWriteContract({
      abi: boostCoreAbi,
      functionName: 'createBoost',
      address: coreAddress,
    });

    if (!owner) {
      owner =
        this._account?.address ||
        getAccount(options.config).address ||
        zeroAddress;
      if (owner === zeroAddress) {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }

    if (!validator) {
      validator = this.SignerValidator({
        signers: [owner],
        validatorCaller: coreAddress,
      });
    }

    let budgetPayload: BoostPayload['budget'] = zeroAddress;
    if (budget.address) {
      budgetPayload = budget.address;
      if (!(await budget.isAuthorized(coreAddress))) {
        throw new BudgetMustAuthorizeBoostCore(coreAddress);
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
    if (action.address) {
      const isBase = action.isBase;
      actionPayload = {
        isBase: isBase,
        instance: action.address,
        parameters: isBase
          ? action.buildParameters(undefined, options).args.at(0) || zeroHash
          : zeroHash,
      };
    } else {
      actionPayload.parameters =
        action.buildParameters(undefined, options).args.at(0) || zeroHash;
      actionPayload.instance = assertValidAddressByChainId(
        options.config,
        action.bases,
        chainId,
      ).address;
    }

    let validatorPayload: BoostPayload['validator'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (validator.address) {
      const isBase = validator.isBase;
      validatorPayload = {
        isBase: isBase,
        instance: validator.address,
        parameters: isBase
          ? validator.buildParameters(undefined, options).args.at(0) || zeroHash
          : zeroHash,
      };
    } else {
      validatorPayload.parameters =
        validator.buildParameters(undefined, options).args.at(0) || zeroHash;
      validatorPayload.instance = assertValidAddressByChainId(
        options.config,
        validator.bases,
        chainId,
      ).address;
    }

    let allowListPayload: BoostPayload['allowList'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (allowList.address) {
      const isBase = allowList.isBase;
      allowListPayload = {
        isBase: isBase,
        instance: allowList.address,
        parameters: isBase
          ? zeroHash // allowList.buildParameters(undefined, options).args.at(0) || zeroHash
          : zeroHash,
      };
    } else {
      allowListPayload.parameters =
        allowList.buildParameters(undefined, options).args.at(0) || zeroHash;
      allowListPayload.instance = assertValidAddressByChainId(
        options.config,
        allowList.bases,
        chainId,
      ).address;
    }

    const incentivesPayloads: Array<Target> = incentives.map(() => ({
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    }));
    for (let i = 0; i < incentives.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
      const incentive = incentives.at(i)!;
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
      protocolFee,
      referralFee,
      maxParticipants,
      owner,
    };

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
    boostId = boostCreatedLog?.args.boostIndex;
    const boost = await this.readBoost(boostId);
    return new Boost({
      id: boostId,
      budget: budget.at(boost.budget),
      action: action.at(boost.action),
      validator: validator.at(boost.validator),
      allowList: allowList.at(boost.allowList),
      incentives: incentives.map((incentive, i) =>
        // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
        incentive.at(boost.incentives.at(i)!),
      ),
      protocolFee: boost.protocolFee,
      referralFee: boost.referralFee,
      maxParticipants: boost.maxParticipants,
      owner: boost.owner,
    });
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
    params?: WriteParams<typeof boostCoreAbi, 'claimIncentive'>,
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
    params?: WriteParams<typeof boostCoreAbi, 'claimIncentive'>,
  ) {
    const { request, result } = await simulateBoostCoreClaimIncentive(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chain?.id || params?.chainId,
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
    params?: WriteParams<typeof boostCoreAbi, 'claimIncentiveFor'>,
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
    params?: WriteParams<typeof boostCoreAbi, 'claimIncentiveFor'>,
  ) {
    const { request, result } = await simulateBoostCoreClaimIncentiveFor(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chain?.id || params?.chainId,
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
   * @param {bigint} id
   * @param {?ReadParams} [params]
   * @returns {Promise<RawBoost>}
   */
  public async readBoost(
    id: bigint,
    params?: ReadParams<typeof boostCoreAbi, 'getBoost'>,
  ) {
    return await readBoostCoreGetBoost(this._config, {
      address: this.assertValidAddress(),
      args: [id],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Get a Boost by index, will return a new {@link Boost} with correct target implementations instantiated, ie `(await core.getBoost(0n)).allowList instanceof SimpleAllowList` vs `SimpleDenyList`
   *
   * @public
   * @async
   * @param {(string | bigint)} _id
   * @param {?ReadParams} [params]
   * @returns {Promise<Boost>}
   */
  public async getBoost(
    _id: string | bigint,
    params?: ReadParams<typeof boostCoreAbi, 'getBoost'>,
  ) {
    let id: bigint;
    if (typeof _id === 'string') {
      id = BigInt(_id);
    } else id = _id;
    const {
      protocolFee,
      referralFee,
      maxParticipants,
      owner,
      ...boostPayload
    } = await this.readBoost(id, params);
    const options: DeployableOptions = {
      config: this._config,
      account: this._account,
    };
    const [action, budget, validator, allowList, incentives] =
      await Promise.all([
        actionFromAddress(options, boostPayload.action),
        budgetFromAddress(options, boostPayload.budget),
        validatorFromAddress(options, boostPayload.validator),
        allowListFromAddress(options, boostPayload.allowList),
        Promise.all(
          boostPayload.incentives.map((incentiveAddress) =>
            incentiveFromAddress(options, incentiveAddress),
          ),
        ),
      ]);
    return new Boost({
      id,
      action,
      budget,
      validator,
      allowList,
      incentives,
      protocolFee,
      referralFee,
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
  public async getBoostCount(
    params?: ReadParams<typeof boostCoreAbi, 'getBoostCount'>,
  ) {
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
   *       ReadParams<typeof iAuthAbi, 'isAuthorized'>} [params]
   * @returns {Promise<boolean>}
   */
  public async isAuthorized(
    address: Address,
    params?: ReadParams<typeof boostCoreAbi, 'createBoostAuth'> &
      ReadParams<typeof iAuthAbi, 'isAuthorized'>,
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
  public async createBoostAuth(
    params?: ReadParams<typeof boostCoreAbi, 'createBoostAuth'>,
  ) {
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
  public async setCreateBoostAuth(
    auth: Auth,
    params?: WriteParams<typeof boostCoreAbi, 'setCreateBoostAuth'>,
  ) {
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
  public async setCreateBoostAuthRaw(
    address: Address,
    params?: WriteParams<typeof boostCoreAbi, 'setCreateBoostAuth'>,
  ) {
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
  public async protocolFee(
    params?: ReadParams<typeof boostCoreAbi, 'protocolFee'>,
  ) {
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
  public async protocolFeeReceiver(
    params?: ReadParams<typeof boostCoreAbi, 'protocolFeeReceiver'>,
  ) {
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
  public async setProcolFeeReceiver(
    address: Address,
    params?: WriteParams<typeof boostCoreAbi, 'setProtocolFeeReceiver'>,
  ) {
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
  public async setProcolFeeReceiverRaw(
    address: Address,
    params?: WriteParams<typeof boostCoreAbi, 'setProtocolFeeReceiver'>,
  ) {
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
   * Get the claim fee.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async claimFee(params?: ReadParams<typeof boostCoreAbi, 'claimFee'>) {
    return await readBoostCoreClaimFee(this._config, {
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
   * Sets the claim fee.
   *
   * @public
   * @async
   * @param {bigint} claimFee
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setClaimFee(
    claimFee: bigint,
    params?: WriteParams<typeof boostCoreAbi, 'setClaimFee'>,
  ) {
    return await this.awaitResult(this.setClaimFeeRaw(claimFee, params));
  }

  /**
   * Sets the claim fee.
   *
   * @public
   * @async
   * @param {bigint} claimFee
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setClaimFeeRaw(
    claimFee: bigint,
    params?: WriteParams<typeof boostCoreAbi, 'setClaimFee'>,
  ) {
    const { request, result } = await simulateBoostCoreSetClaimFee(
      this._config,
      {
        ...assertValidAddressByChainId(
          this._config,
          this.addresses,
          params?.chainId,
        ),
        args: [claimFee],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostCoreSetClaimFee(this._config, request);
    return { hash, result };
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
    return new ManagedBudget(
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
   * Bound {@link ERC20VariableCriteriaIncentive} constructor that reuses the same configuration as the Boost Core instance.
   *
   * @example
   * ```ts
   * const validator = core.ERC20VariableCrtieriaIncentive({ ... }) // is roughly equivalent to
   * const validator = new ERC20VariableCrtieriaIncentive({ config: core._config, account: core._account }, { ... })
   * ```
   * @param {DeployablePayloadOrAddress<ERC20VariableCrtieriaIncentivePayload>} options
   * @param {?boolean} [isBase]
   * @returns {ERC20VariableCrtieriaIncentive}
   * */
  ERC20VariableCriteriaIncentive(
    options: DeployablePayloadOrAddress<ERC20VariableCriteriaIncentivePayload>,
    isBase?: boolean,
  ) {
    return new ERC20VariableCriteriaIncentive(
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
   * @param {?[Address, Address]} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: [Address, Address],
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
}
