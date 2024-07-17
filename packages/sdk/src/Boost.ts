import { type Address, type Hex, zeroAddress } from 'viem';
import type { Action } from './Actions/Action';
import type { AllowList } from './AllowLists/AllowList';
import type { Budget } from './Budgets/Budget';
import type { Incentive } from './Incentives/Incentive';
import type { Validator } from './Validators/Validator';

/**
 * Description placeholder
 *
 * @export
 * @interface BoostPayload
 * @typedef {BoostPayload}
 */
export interface BoostPayload {
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  id: bigint;
  /**
   * Description placeholder
   *
   * @type {Budget}
   */
  budget: Budget;
  /**
   * Description placeholder
   *
   * @type {Action}
   */
  action: Action;
  /**
   * Description placeholder
   *
   * @type {Validator}
   */
  validator: Validator;
  /**
   * Description placeholder
   *
   * @type {AllowList}
   */
  allowList: AllowList;
  /**
   * Description placeholder
   *
   * @type {Array<Incentive>}
   */
  incentives: Array<Incentive>;
  /**
   * Description placeholder
   *
   * @type {?bigint}
   */
  protocolFee?: bigint;
  /**
   * Description placeholder
   *
   * @type {?bigint}
   */
  referralFee?: bigint;
  /**
   * Description placeholder
   *
   * @type {?bigint}
   */
  maxParticipants?: bigint;
  /**
   * Description placeholder
   *
   * @type {?Address}
   */
  owner?: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @class Boost
 * @typedef {Boost}
 */
export class Boost {
  /**
   * Description placeholder
   *
   * @readonly
   * @type {bigint}
   */
  readonly id: bigint;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {Budget}
   */
  readonly budget: Budget;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {Action}
   */
  readonly action: Action;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {Validator}
   */
  readonly validator: Validator;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {AllowList}
   */
  readonly allowList: AllowList;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {Array<Incentive>}
   */
  readonly incentives: Array<Incentive>;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {bigint}
   */
  readonly protocolFee: bigint;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {bigint}
   */
  readonly referralFee: bigint;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {bigint}
   */
  readonly maxParticipants: bigint;
  /**
   * Description placeholder
   *
   * @readonly
   * @type {Address}
   */
  readonly owner: Address;

  /**
   * Creates an instance of Boost.
   *
   * @constructor
   * @param {BoostPayload} payload
   */
  constructor(payload: BoostPayload) {
    this.id = payload.id;
    this.budget = payload.budget;
    this.action = payload.action;
    this.validator = payload.validator;
    this.allowList = payload.allowList;
    this.incentives = payload.incentives;
    this.protocolFee = payload.protocolFee || 0n;
    this.referralFee = payload.referralFee || 0n;
    this.maxParticipants = payload.maxParticipants || 0n;
    this.owner = payload.owner || zeroAddress;
  }
}
