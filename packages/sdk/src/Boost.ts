import { type Address, zeroAddress } from 'viem';
import type { Action } from './Actions/Action';
import type { AllowList } from './AllowLists/AllowList';
import type { Budget } from './Budgets/Budget';
import type { Incentive } from './Incentives/Incentive';
import type { Validator } from './Validators/Validator';

/**
 * Configuration used to instantiate a `Boost` instance.
 *
 * @export
 * @interface BoostPayload
 * @typedef {BoostPayload}
 */
export interface BoostConfig {
  /**
   *
   * @type {bigint}
   */
  id: bigint;
  /**
   *
   * @type {Budget}
   */
  budget: Budget;
  /**
   *
   * @type {Action}
   */
  action: Action;
  /**
   *
   * @type {Validator}
   */
  validator: Validator;
  /**
   *
   * @type {AllowList}
   */
  allowList: AllowList;
  /**
   *
   * @type {Array<Incentive>}
   */
  incentives: Array<Incentive>;
  /**
   *
   * @type {?bigint}
   */
  protocolFee?: bigint;
  /**
   *
   * @type {?bigint}
   */
  referralFee?: bigint;
  /**
   *
   * @type {?bigint}
   */
  maxParticipants?: bigint;
  /**
   *
   * @type {?Address}
   */
  owner?: Address;
}

/**
 * A struct representing a single Boost. Typically you would not construct this directly, rather get an instance from `BoostCore.createBoost` or `BoostCore.getBoost`
 *
 * @export
 * @class Boost
 * @typedef {Boost}
 */
export class Boost {
  /**
   *
   * @readonly
   * @type {bigint}
   */
  readonly id: bigint;
  /**
   *
   * @readonly
   * @type {Budget}
   */
  readonly budget: Budget;
  /**
   *
   * @readonly
   * @type {Action}
   */
  readonly action: Action;
  /**
   *
   * @readonly
   * @type {Validator}
   */
  readonly validator: Validator;
  /**
   *
   * @readonly
   * @type {AllowList}
   */
  readonly allowList: AllowList;
  /**
   *
   * @readonly
   * @type {Array<Incentive>}
   */
  readonly incentives: Array<Incentive>;
  /**
   *
   * @readonly
   * @type {bigint}
   */
  readonly protocolFee: bigint;
  /**
   *
   * @readonly
   * @type {bigint}
   */
  readonly referralFee: bigint;
  /**
   *
   * @readonly
   * @type {bigint}
   */
  readonly maxParticipants: bigint;
  /**
   *
   * @readonly
   * @type {Address}
   */
  readonly owner: Address;

  /**
   * Creates an instance of Boost.
   *
   * @constructor
   * @param {BoostConfig} config
   */
  constructor(config: BoostConfig) {
    this.id = config.id;
    this.budget = config.budget;
    this.action = config.action;
    this.validator = config.validator;
    this.allowList = config.allowList;
    this.incentives = config.incentives;
    this.protocolFee = config.protocolFee || 0n;
    this.referralFee = config.referralFee || 0n;
    this.maxParticipants = config.maxParticipants || 0n;
    this.owner = config.owner || zeroAddress;
  }
}
