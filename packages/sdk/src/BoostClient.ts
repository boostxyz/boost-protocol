import {
  type BoostPayload,
  boostCoreAbi,
  prepareBoostPayload,
} from '@boostxyz/evm';
import { type Config, getAccount } from '@wagmi/core';
import { createWriteContract } from '@wagmi/core/codegen';
import { type Address, zeroAddress, zeroHash } from 'viem';
import type { Action } from './Actions/Action';
import type { AllowList } from './AllowLists/AllowList';
import type { Budget } from './Budgets/Budget';
import type { Deployable } from './Deployable/Deployable';
import type { Incentive } from './Incentives/Incentive';
import type { Validator } from './Validators/Validator';

export const BOOST_CORE_ADDRESS: Address = import.meta.env
  .VITE_BOOST_CORE_ADDRESS;

export interface BoostClientConfig {
  address?: Address;
  config: Config;
}

export interface CreateBoostPayload {
  budget: Budget;
  action: Action;
  validator: Validator;
  allowList: AllowList;
  incentives: Array<Incentive>;
  protocolFee?: bigint;
  referralFee?: bigint;
  maxParticipants?: bigint;
  owner?: Address;
}

// TODO RFC?
// As dependencies are deployed, the iterator yields with the deployable and the remaining number of steps. finally, it yields with the address of
export interface CreateBoostProgress {
  remaining: number;
  deployed: Deployable;
}

export interface CreateBoostCompletion {
  address: Address;
}

export class BoostClient {
  protected address: Address = BOOST_CORE_ADDRESS;
  protected config: Config;

  constructor({ address, config }: BoostClientConfig) {
    if (address) this.address = address;
    this.config = config;
  }

  public async *createBoost({
    budget,
    action,
    validator,
    allowList,
    incentives,
    protocolFee = 0n,
    referralFee = 0n,
    maxParticipants = 0n,
    owner = zeroAddress,
  }: CreateBoostPayload): AsyncGenerator<
    CreateBoostProgress | CreateBoostCompletion,
    Address
  > {
    const boostFactory = createWriteContract({
      abi: boostCoreAbi,
      functionName: 'createBoost',
      address: this.address,
    });

    if (!owner) {
      owner = getAccount(this.config).address || zeroAddress;
      if (owner === zeroAddress) {
        // throw? TODO
        console.warn('No owner supplied, falling back to zeroAddress');
      }
    }

    // As we proceed, decrement total steps to indiciate progress to consumer
    let remainingSteps = 4 + incentives.length;

    let budgetPayload: Pick<BoostPayload, 'budget'> = {
      budget: budget.address || zeroAddress,
    };

    if (budget.address === zeroAddress) {
      budget = await this.deploy(budget);
      budgetPayload.budget = budget.address || zeroAddress;
      // TODO validate and throw?
    }
    yield {
      remaining: --remainingSteps,
      deployed: budget,
    };

    let actionPayload: Pick<BoostPayload, 'action'> = {
      action: {
        isBase: false,
        instance: action.address || zeroAddress,
        parameters: action.buildParameters(this.config).args.at(0) || zeroHash,
      },
    };
    if (actionPayload.action.instance === zeroAddress) {
      action = await this.deploy(action);
      actionPayload.action.instance = action.address || zeroAddress;
      // TODO validate and throw?
    }
    yield {
      remaining: --remainingSteps,
      deployed: action,
    };

    let validatorPayload: Pick<BoostPayload, 'validator'> = {
      validator: {
        isBase: false,
        instance: validator.address || zeroAddress,
        parameters:
          validator.buildParameters(this.config).args.at(0) || zeroHash,
      },
    };
    if (validatorPayload.validator.instance === zeroAddress) {
      validator = await this.deploy(validator);
      validatorPayload.validator.instance = validator.address || zeroAddress;
      // TODO validate and throw?
    }
    yield {
      remaining: --remainingSteps,
      deployed: validator,
    };

    let allowListPayload: Pick<BoostPayload, 'allowList'> = {
      allowList: {
        isBase: false,
        instance: allowList.address || zeroAddress,
        parameters:
          allowList.buildParameters(this.config).args.at(0) || zeroHash,
      },
    };
    if (allowListPayload.allowList.instance === zeroAddress) {
      allowList = await this.deploy(allowList);
      allowListPayload.allowList.instance = allowList.address || zeroAddress;
      // TODO validate and throw?
    }
    yield {
      remaining: --remainingSteps,
      deployed: allowList,
    };

    let incentivesPayload: Pick<BoostPayload, 'incentives'> = {
      incentives: incentives.map((incentive) => ({
        isBase: false,
        instance: incentive.address || zeroAddress,
        parameters:
          incentive.buildParameters(this.config).args.at(0) || zeroHash,
      })),
    };
    for (let i = 0; i < incentives.length; i++) {
      let incentive = incentives.at(i)!;
      const incentiveTarget = incentivesPayload.incentives.at(i)!;

      if (incentiveTarget.instance === zeroAddress) {
        incentive = await this.deploy(incentive);
        incentiveTarget.instance = incentive.address || zeroAddress;
        // TODO validate and throw?
      }
      yield {
        remaining: --remainingSteps,
        deployed: incentive,
      };
    }

    const boostPayload: BoostPayload = {
      ...budgetPayload,
      ...actionPayload,
      ...validatorPayload,
      ...allowListPayload,
      ...incentivesPayload,
      protocolFee,
      referralFee,
      maxParticipants,
      owner,
    };

    const boost = await boostFactory(this.config, {
      args: [prepareBoostPayload(boostPayload)],
    });

    yield {
      address: boost,
    };

    return boost;
  }

  public async deploy<T extends Deployable>(deployable: T) {
    await deployable.deploy(this.config);
    return deployable;
  }
}
