import { type Address, type Hex, zeroAddress } from 'viem';
import type { Action } from './Actions/Action';
import type { AllowList } from './AllowLists/AllowList';
import type { Budget } from './Budgets/Budget';
import type { Incentive } from './Incentives/Incentive';
import type { Validator } from './Validators/Validator';

export interface BoostPayload {
  address?: Address;
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

export interface LibBoost {
  action: Address;
  validator: Address;
  allowList: Address;
  budget: Address;
  incentives: Array<Address>;
  protocolFee: bigint;
  referralFee: bigint;
  maxParticipants: bigint;
  owner: Address;
}

export class Boost {
  readonly action: Action;
  readonly validator: Validator;
  readonly allowList: AllowList;
  readonly budget: Budget;
  readonly incentives: Array<Incentive>;
  readonly protocolFee: bigint;
  readonly referralFee: bigint;
  readonly maxParticipants: bigint;
  readonly owner: Address;

  constructor(payload: BoostPayload) {
    this.action = payload.action;
    this.validator = payload.validator;
    this.allowList = payload.allowList;
    this.budget = payload.budget;
    this.incentives = payload.incentives;
    this.protocolFee = payload.protocolFee || 0n;
    this.referralFee = payload.referralFee || 0n;
    this.maxParticipants = payload.maxParticipants || 0n;
    this.owner = payload.owner || zeroAddress;
  }

  // public encode() {}

  public static decode(_data: Hex) {
    // TODO decode hash, initialize class
    // return new Boost({});
  }
}
