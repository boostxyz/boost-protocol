import {
  type BoostPayload as OnChainBoostPayload,
  type Target,
  boostCoreAbi,
  prepareBoostPayload,
  readBoostCoreClaimFee,
  readBoostCoreGetBoost,
  readBoostCoreGetBoostCount,
  readBoostCoreProtocolFee,
  readBoostCoreProtocolFeeReceiver,
  simulateBoostCoreClaimIncentive,
  simulateBoostCoreSetClaimFee,
  simulateBoostCoreSetProtocolFeeReceiver,
  writeBoostCoreClaimIncentive,
  writeBoostCoreSetClaimFee,
  writeBoostCoreSetProtocolFeeReceiver,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json';
import { getAccount, waitForTransactionReceipt } from '@wagmi/core';
import { createWriteContract } from '@wagmi/core/codegen';
import {
  type Address,
  type Hex,
  parseEther,
  parseEventLogs,
  zeroAddress,
  zeroHash,
} from 'viem';
import { type Action, actionFromAddress } from './Actions/Action';
import {
  ContractAction,
  type ContractActionPayload,
} from './Actions/ContractAction';
import {
  ERC721MintAction,
  type ERC721MintActionPayload,
} from './Actions/ERC721MintAction';
import { type AllowList, allowListFromAddress } from './AllowLists/AllowList';
import {
  SimpleAllowList,
  type SimpleAllowListPayload,
} from './AllowLists/SimpleAllowList';
import {
  SimpleDenyList,
  type SimpleDenyListPayload,
} from './AllowLists/SimpleDenyList';
import { Boost } from './Boost';
import { type Budget, budgetFromAddress } from './Budgets/Budget';
import { SimpleBudget, type SimpleBudgetPayload } from './Budgets/SimpleBudget';
import {
  VestingBudget,
  type VestingBudgetPayload,
} from './Budgets/VestingBudget';
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
  ERC1155Incentive,
  type ERC1155IncentivePayload,
} from './Incentives/ERC1155Incentive';
import { type Incentive, incentiveFromAddress } from './Incentives/Incentive';
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
  NoContractAddressUponReceiptError,
} from './errors';
import type { ReadParams, WriteParams } from './utils';

/**
 * Description placeholder
 *
 * @type {Address}
 */
export const BOOST_CORE_ADDRESS: Address = import.meta.env
  .VITE_BOOST_CORE_ADDRESS;

/**
 * Description placeholder
 *
 * @type {*}
 */
export const BOOST_CORE_CLAIM_FEE = parseEther('0.000075');

/**
 * Description placeholder
 *
 * @export
 * @interface BoostCoreDeployedOptions
 * @typedef {BoostCoreDeployedOptions}
 * @extends {DeployableOptions}
 */
export interface BoostCoreDeployedOptions extends DeployableOptions {
  /**
   * Description placeholder
   *
   * @type {?Address}
   */
  address?: Address;
}

/**
 * Description placeholder
 *
 * @param {*} opts
 * @returns {opts is BoostCoreDeployedOptions}
 */
// biome-ignore lint/suspicious/noExplicitAny: type guard
function isBoostCoreDeployed(opts: any): opts is BoostCoreDeployedOptions {
  return opts.address;
}

/**
 * Description placeholder
 *
 * @export
 * @interface BoostCoreOptionsWithPayload
 * @typedef {BoostCoreOptionsWithPayload}
 * @extends {DeployableOptions}
 */
export interface BoostCoreOptionsWithPayload extends DeployableOptions {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  registryAddress: Address;
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  protocolFeeReceiver: Address;
}

/**
 * Description placeholder
 *
 * @param {*} opts
 * @returns {opts is BoostCoreOptionsWithPayload}
 */
// biome-ignore lint/suspicious/noExplicitAny: type guard
function isBoostCoreDeployable(opts: any): opts is BoostCoreOptionsWithPayload {
  return opts.registryAddress && opts.protocolFeeReceiver;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {BoostCoreConfig}
 */
export type BoostCoreConfig =
  | BoostCoreDeployedOptions
  | BoostCoreOptionsWithPayload;

/**
 * Description placeholder
 *
 * @export
 * @typedef {CreateBoostPayload}
 */
export type CreateBoostPayload = {
  budget: Budget;
  action: Action;
  validator: Validator;
  allowList: AllowList;
  incentives: Array<Incentive>;
  protocolFee?: bigint;
  referralFee?: bigint;
  maxParticipants?: bigint;
  owner?: Address;
};

/**
 * Description placeholder
 *
 * @export
 * @class BoostCore
 * @typedef {BoostCore}
 * @extends {Deployable<[Address, Address]>}
 */
export class BoostCore extends Deployable<[Address, Address]> {
  /**
   * Creates an instance of BoostCore.
   *
   * @constructor
   * @param {BoostCoreConfig} param0
   * @param {Config} param0.config
   * @param {Account} param0.account
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
      super({ account, config }, BOOST_CORE_ADDRESS);
    }
  }

  // TODO make this transactional? if any deployment fails what do we do with the previously deployed deployables?
  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {CreateBoostPayload} _boostPayload
   * @param {?DeployableOptions} [_options]
   * @returns {unknown}
   */
  public async createBoost(
    _boostPayload: CreateBoostPayload,
    _options?: DeployableOptions,
  ) {
    const coreAddress = this.assertValidAddress();
    const [payload, options] =
      this.validateDeploymentConfig<CreateBoostPayload>(
        _boostPayload,
        _options,
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
      address: this.address,
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

    let budgetPayload: OnChainBoostPayload['budget'] = zeroAddress;
    if (budget.address) {
      budgetPayload = budget.address;
      if (!(await budget.isAuthorized(coreAddress))) {
        throw new BudgetMustAuthorizeBoostCore(coreAddress);
      }
    } else {
      // budgets are either instantiated with an address or payload, so in this branch payload will exist
      const authorized = budget.payload?.authorized || [];
      if (!authorized.includes(coreAddress)) {
        throw new BudgetMustAuthorizeBoostCore(coreAddress);
      }
      const budgetHash = await budget.deployRaw(undefined, options);
      const receipt = await waitForTransactionReceipt(options.config, {
        hash: budgetHash,
      });
      if (!receipt.contractAddress)
        throw new NoContractAddressUponReceiptError(receipt);
      budgetPayload = receipt.contractAddress;
    }

    // if we're supplying an address, it could be a pre-initialized target
    // if base is explicitly set to false, then it will not be initialized, and it will be referenced as is if it implements interface correctly
    let actionPayload: OnChainBoostPayload['action'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (action.address) {
      const isBase = action.address === action.base || action.isBase;
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
      actionPayload.instance = action.base;
    }

    let validatorPayload: OnChainBoostPayload['validator'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (validator.address) {
      const isBase = validator.address === validator.base || validator.isBase;
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
      validatorPayload.instance = validator.base;
    }

    let allowListPayload: OnChainBoostPayload['allowList'] = {
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    };
    if (allowList.address) {
      const isBase = allowList.address === allowList.base || allowList.isBase;
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
      allowListPayload.instance = allowList.base;
    }

    let incentivesPayloads: Array<Target> = incentives.map(() => ({
      instance: zeroAddress,
      isBase: true,
      parameters: zeroHash,
    }));
    for (let i = 0; i < incentives.length; i++) {
      // biome-ignore lint/style/noNonNullAssertion: this will never be undefined
      const incentive = incentives.at(i)!;
      if (incentive.address) {
        const isBase = incentive.address === incentive.base || incentive.isBase;
        incentivesPayloads[i] = {
          isBase: isBase,
          instance: incentive.address,
          parameters: isBase
            ? incentive.buildParameters(undefined, options).args.at(0) ||
              zeroHash
            : zeroHash,
        };
      } else {
        incentivesPayloads[i]!.parameters =
          incentive.buildParameters(undefined, options).args.at(0) || zeroHash;
        incentivesPayloads[i]!.instance = incentive.base;
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
      args: [prepareBoostPayload(onChainPayload)],
      ...this.optionallyAttachAccount(options.account),
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
        incentive.at(boost.incentives.at(i)!),
      ),
      protocolFee: boost.protocolFee,
      referralFee: boost.referralFee,
      maxParticipants: boost.maxParticipants,
      owner: boost.owner,
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {bigint} boostId
   * @param {bigint} incentiveId
   * @param {Address} address
   * @param {Hex} data
   * @param {?WriteParams<typeof boostCoreAbi, 'claimIncentive'>} [params]
   * @returns {unknown}
   */
  public async claimIncentive(
    boostId: bigint,
    incentiveId: bigint,
    address: Address,
    data: Hex,
    params?: WriteParams<typeof boostCoreAbi, 'claimIncentive'>,
  ) {
    return this.awaitResult(
      this.claimIncentiveRaw(boostId, incentiveId, address, data, params),
    );
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {bigint} boostId
   * @param {bigint} incentiveId
   * @param {Address} address
   * @param {Hex} data
   * @param {?WriteParams<typeof boostCoreAbi, 'claimIncentive'>} [params]
   * @returns {unknown}
   */
  public async claimIncentiveRaw(
    boostId: bigint,
    incentiveId: bigint,
    address: Address,
    data: Hex,
    params?: WriteParams<typeof boostCoreAbi, 'claimIncentive'>,
  ) {
    const { request, result } = await simulateBoostCoreClaimIncentive(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [boostId, incentiveId, address, data],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeBoostCoreClaimIncentive(this._config, request);
    return { hash, result };
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {bigint} id
   * @param {?ReadParams<typeof boostCoreAbi, 'getBoost'>} [params]
   * @returns {unknown}
   */
  public async readBoost(
    id: bigint,
    params?: ReadParams<typeof boostCoreAbi, 'getBoost'>,
  ) {
    return readBoostCoreGetBoost(this._config, {
      address: this.assertValidAddress(),
      args: [id],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {(string | bigint)} _id
   * @param {?ReadParams<typeof boostCoreAbi, 'getBoost'>} [params]
   * @returns {unknown}
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof boostCoreAbi, 'getBoostCount'>} [params]
   * @returns {unknown}
   */
  public async getBoostCount(
    params?: ReadParams<typeof boostCoreAbi, 'getBoostCount'>,
  ) {
    return readBoostCoreGetBoostCount(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof boostCoreAbi, 'protocolFee'>} [params]
   * @returns {unknown}
   */
  public async protocolFee(
    params?: ReadParams<typeof boostCoreAbi, 'protocolFee'>,
  ) {
    return readBoostCoreProtocolFee(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof boostCoreAbi, 'protocolFeeReceiver'>} [params]
   * @returns {unknown}
   */
  public async protocolFeeReceiver(
    params?: ReadParams<typeof boostCoreAbi, 'protocolFeeReceiver'>,
  ) {
    return readBoostCoreProtocolFeeReceiver(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams<typeof boostCoreAbi, 'setProtocolFeeReceiver'>} [params]
   * @returns {unknown}
   */
  public async setProcolFeeReceiver(
    address: Address,
    params?: WriteParams<typeof boostCoreAbi, 'setProtocolFeeReceiver'>,
  ) {
    return this.awaitResult(this.setProcolFeeReceiverRaw(address, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {Address} address
   * @param {?WriteParams<typeof boostCoreAbi, 'setProtocolFeeReceiver'>} [params]
   * @returns {unknown}
   */
  public async setProcolFeeReceiverRaw(
    address: Address,
    params?: WriteParams<typeof boostCoreAbi, 'setProtocolFeeReceiver'>,
  ) {
    const { request, result } = await simulateBoostCoreSetProtocolFeeReceiver(
      this._config,
      {
        address: this.assertValidAddress(),
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
   * Description placeholder
   *
   * @public
   * @async
   * @param {?ReadParams<typeof boostCoreAbi, 'claimFee'>} [params]
   * @returns {unknown}
   */
  public async claimFee(params?: ReadParams<typeof boostCoreAbi, 'claimFee'>) {
    return readBoostCoreClaimFee(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {bigint} claimFee
   * @param {?WriteParams<typeof boostCoreAbi, 'setClaimFee'>} [params]
   * @returns {unknown}
   */
  public async setClaimFee(
    claimFee: bigint,
    params?: WriteParams<typeof boostCoreAbi, 'setClaimFee'>,
  ) {
    return this.awaitResult(this.setClaimFeeRaw(claimFee, params));
  }

  /**
   * Description placeholder
   *
   * @public
   * @async
   * @param {bigint} claimFee
   * @param {?WriteParams<typeof boostCoreAbi, 'setClaimFee'>} [params]
   * @returns {unknown}
   */
  public async setClaimFeeRaw(
    claimFee: bigint,
    params?: WriteParams<typeof boostCoreAbi, 'setClaimFee'>,
  ) {
    const { request, result } = await simulateBoostCoreSetClaimFee(
      this._config,
      {
        address: this.assertValidAddress(),
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
   * Description placeholder
   *
   * @param {DeployablePayloadOrAddress<ContractActionPayload>} options
   * @param {?boolean} [isBase]
   * @returns {ContractAction}
   */
  ContractAction(
    options: DeployablePayloadOrAddress<ContractActionPayload>,
    isBase?: boolean,
  ) {
    return new ContractAction(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }
  /**
   * Description placeholder
   *
   * @param {DeployablePayloadOrAddress<ERC721MintActionPayload>} options
   * @param {?boolean} [isBase]
   * @returns {ERC721MintAction}
   */
  ERC721MintAction(
    options: DeployablePayloadOrAddress<ERC721MintActionPayload>,
    isBase?: boolean,
  ) {
    return new ERC721MintAction(
      { config: this._config, account: this._account },
      options,
      isBase,
    );
  }
  /**
   * Description placeholder
   *
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
   * Description placeholder
   *
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
   * Description placeholder
   *
   * @param {DeployablePayloadOrAddress<SimpleBudgetPayload>} options
   * @returns {SimpleBudget}
   */
  SimpleBudget(options: DeployablePayloadOrAddress<SimpleBudgetPayload>) {
    return new SimpleBudget(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Description placeholder
   *
   * @param {DeployablePayloadOrAddress<VestingBudgetPayload>} options
   * @returns {VestingBudget}
   */
  VestingBudget(options: DeployablePayloadOrAddress<VestingBudgetPayload>) {
    return new VestingBudget(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Description placeholder
   *
   * @param {AllowListIncentivePayload} options
   * @returns {AllowListIncentive}
   */
  AllowListIncentive(options: AllowListIncentivePayload) {
    return new AllowListIncentive(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Description placeholder
   *
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
   * Description placeholder
   *
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
   * Description placeholder
   *
   * @param {ERC1155IncentivePayload} options
   * @returns {ERC1155Incentive}
   */
  ERC1155Incentive(options: ERC1155IncentivePayload) {
    return new ERC1155Incentive(
      { config: this._config, account: this._account },
      options,
    );
  }
  /**
   * Description placeholder
   *
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
   * Description placeholder
   *
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
