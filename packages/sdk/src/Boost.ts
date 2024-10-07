import { LibZip } from 'solady';
import {
  type Address,
  type Hex,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
} from 'viem';
import type { Action } from './Actions/Action';
import type { AllowList } from './AllowLists/AllowList';
import type { Budget } from './Budgets/Budget';
import type { Incentive } from './Incentives/Incentive';
import type { Validator } from './Validators/Validator';

/**
 * Interface representing a `BoostLib.Boost` on-chain struct
 *
 * @export
 * @interface BoostPayload
 * @typedef {BoostPayload}
 */
export interface RawBoost {
  action: Address;
  validator: Address;
  allowList: Address;
  budget: Address;
  incentives: readonly Address[];
  protocolFee: bigint;
  referralFee: bigint;
  maxParticipants: bigint;
  owner: Address;
}

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

/**
 * Object representation of `BoostLib.Target` struct. Used for low level Boost creation operations.
 * This is used to pass the base contract and its initialization parameters in an efficient manner
 *
 * @export
 * @typedef {Target}
 */
export type Target = {
  isBase: boolean;
  instance: Address;
  parameters: Hex;
};

/**
 * Object representation of `BoostCore.InitPayload` struct.
 *
 * @export
 * @interface BoostPayload
 * @typedef {BoostPayload}
 */
export interface BoostPayload {
  /**
   * Address to valid budget.
   *
   * @type {Address}
   */
  budget: Address;
  /**
   * Target for existing action, or base with initialization payload.
   *
   * @type {Target}
   */
  action: Target;
  /**
   * Target for existing validator, or base with initialization payload.
   *
   * @type {Target}
   */
  validator: Target;
  /**
   * Target for existing allowList, or base with initialization payload.
   *
   * @type {Target}
   */
  allowList: Target;
  /**
   * Targets for new incentives, with initialization payloads.
   *
   * @type {Target[]}
   */
  incentives: Target[];
  /**
   * The base protocol fee (in bps)
   *
   * @type {?bigint}
   */
  protocolFee?: bigint;
  /**
   * The base referral fee (in bps)
   *
   * @type {?bigint}
   */
  referralFee?: bigint;
  /**
   * Optional maximum amount of participants in the Boost.
   *
   * @type {?bigint}
   */
  maxParticipants?: bigint;
  /**
   * The owner of the Boost.
   *
   * @type {Address}
   */
  owner: Address;
}

/**
 * Given a valid {@link BoostPayload}, properly encode and compress the payload for use with `createBoost`
 *
 * @export
 * @param {BoostPayload} param0
 * @param {Address} param0.budget - Address to valid budget.
 * @param {Target} param0.action - Target for existing action, or base with initialization payload.
 * @param {Target} param0.validator - Target for existing validator, or base with initialization payload.
 * @param {Target} param0.allowList - Target for existing allowList, or base with initialization payload.
 * @param {Target[]} param0.incentives - Targets for new incentives, with initialization payloads.
 * @param {bigint} [param0.protocolFee=0n] - The base protocol fee (in bps)
 * @param {bigint} [param0.referralFee=0n] - The base referral fee (in bps)
 * @param {bigint} [param0.maxParticipants=0n] - Optional maximum amount of participants in the Boost.
 * @param {Address} param0.owner - The owner of the Boost.
 * @returns {Hex}
 */
export function prepareBoostPayload({
  budget,
  action,
  validator,
  allowList,
  incentives,
  protocolFee = 0n,
  referralFee = 0n,
  maxParticipants = 0n,
  owner,
}: BoostPayload): Hex {
  return LibZip.cdCompress(
    encodeAbiParameters(
      parseAbiParameters([
        'BoostPayload payload',
        'struct BoostPayload { address budget; Target action; Target validator; Target allowList; Target[] incentives; uint64 protocolFee; uint64 referralFee; uint256 maxParticipants; address owner; }',
        'struct Target { bool isBase; address instance; bytes parameters; }',
      ]),
      [
        {
          budget,
          action,
          validator,
          allowList,
          incentives,
          protocolFee,
          referralFee,
          maxParticipants,
          owner,
        },
      ],
    ),
  ) as Hex;
}
