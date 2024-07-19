export * from './generated';
import { LibZip } from 'solady';
import {
  Address,
  Hex,
  encodeAbiParameters,
  parseAbiParameters,
  stringToHex,
  toHex,
  zeroAddress,
  zeroHash
} from 'viem';
import { AbiCoder } from 'ethers';

/**
 * Description placeholder
 *
 * @export
 * @enum {number}
 */
export enum RegistryType {
  ACTION = 0,
  ALLOW_LIST = 1,
  BUDGET = 2,
  INCENTIVE = 3,
  VALIDATOR = 4,
}

/**
 * Description placeholder
 *
 * @export
 * @enum {number}
 */
export enum StrategyType {
  POOL = 0,
  MINT = 1,
  RAFFLE = 2,
}

/**
 * Description placeholder
 *
 * @export
 * @enum {number}
 */
export enum ERC1155StrategyType {
  POOL = 0,
  MINT = 1,
}

/**
 * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @param {Target} param0
 * @param {boolean} param0.isBase
 * @param {Address} param0.instance
 * @param {Hex} param0.parameters
 * @returns {*}
 */
export function prepareTarget({ isBase, instance, parameters }: Target) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Target target',
      'struct Target { bool isBase; address instance; bytes parameters; }',
    ]),
    [{ isBase, instance, parameters }],
  );
}

/**
 * Description placeholder
 *
 * @export
 * @param {ContractActionPayload} param0
 * @param {bigint} param0.chainId
 * @param {Address} param0.target
 * @param {Hex} param0.selector
 * @param {bigint} param0.value
 * @returns {Target}
 */
export function contractAction({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: prepareContractActionPayload({
      chainId,
      target,
      selector,
      value,
    }),
  };
}

/**
 * Description placeholder
 *
 * @export
 * @interface ERC20IncentivePayload
 * @typedef {ERC20IncentivePayload}
 */
export interface ERC20IncentivePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Description placeholder
   *
   * @type {StrategyType}
   */
  strategy: StrategyType;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  limit: bigint;
}
/**
 * Description placeholder
 *
 * @export
 * @param {ERC20IncentivePayload} param0
 * @param {Address} param0.asset
 * @param {StrategyType} param0.strategy
 * @param {bigint} param0.reward
 * @param {bigint} param0.limit
 * @returns {Target}
 */
export function erc20Incentive({
  asset,
  strategy,
  reward,
  limit,
}: ERC20IncentivePayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: prepareERC20IncentivePayload({
      asset,
      strategy,
      reward,
      limit,
    }),
  };
}

/**
 * Description placeholder
 *
 * @export
 * @interface SignerValidatorValidatePayload
 * @typedef {SignerValidatorValidatePayload}
 */
export interface SignerValidatorValidatePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  signer: Address;
  /**
   * Description placeholder
   *
   * @type {Hex}
   */
  hash: Hex;
  /**
   * Description placeholder
   *
   * @type {Hex}
   */
  signature: Hex;
}

/**
 * Description placeholder
 *
 * @param {SignerValidatorValidatePayload} param0
 * @param {Address} param0.signer
 * @param {Hex} param0.hash
 * @param {Hex} param0.signature
 * @returns {*}
 */
export const prepareSignerValidatorValidatePayload = ({
  signer, hash, signature
  }: SignerValidatorValidatePayload) => {
    return encodeAbiParameters(
      [
        { type: 'address', name: 'signer_' },
        { type: 'bytes32', name: 'hash_' },
        { type: 'bytes', name: 'signature_' },
      ],
      [signer, hash, signature],
    );
  };

/**
 * Description placeholder
 *
 * @export
 * @interface SignerValidatorPayload
 * @typedef {SignerValidatorPayload}
 */
export interface SignerValidatorPayload {
  /**
   * Description placeholder
   *
   * @type {Address[]}
   */
  signers: Address[];
}

/**
 * Description placeholder
 *
 * @param {SignerValidatorPayload} param0
 * @param {{}} param0.signers
 * @returns {*}
 */
export const prepareSignerValidatorPayload = ({
  signers
  }: SignerValidatorPayload) => {
    return encodeAbiParameters(
      [
        { type: 'address[]', name: 'signers' },
      ],
      [signers],
    );
  };

/**
 * Description placeholder
 *
 * @export
 * @param {SignerValidatorPayload} param0
 * @param {{}} param0.signers
 * @returns {Target}
 */
export function signerValidator({
  signers,
}: SignerValidatorPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: prepareSignerValidatorPayload({ signers })
  };
}

/**
 * Description placeholder
 *
 * @export
 * @interface SimpleAllowListPayload
 * @typedef {SimpleAllowListPayload}
 */
export interface SimpleAllowListPayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * Description placeholder
   *
   * @type {Address[]}
   */
  allowed: Address[];
}

/**
 * Description placeholder
 *
 * @param {SimpleAllowListPayload} param0
 * @param {Address} param0.owner
 * @param {{}} param0.allowed
 * @returns {*}
 */
export const prepareSimpleAllowListPayload = ({
owner,
allowed
}: SimpleAllowListPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'address[]', name: 'allowed' },
    ],
    [owner, allowed],
  );
};

/**
 * Description placeholder
 *
 * @export
 * @param {SimpleAllowListPayload} param0
 * @param {Address} param0.owner
 * @param {{}} param0.allowed
 * @returns {Target}
 */
export function simpleAllowList({
  owner,
  allowed,
}: SimpleAllowListPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: prepareSimpleAllowListPayload({owner, allowed})
  };
}

/**
 * Description placeholder
 *
 * @export
 * @interface SimpleDenyListPayload
 * @typedef {SimpleDenyListPayload}
 */
export interface SimpleDenyListPayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * Description placeholder
   *
   * @type {Address[]}
   */
  denied: Address[];
}

/**
 * Description placeholder
 *
 * @param {SimpleDenyListPayload} param0
 * @param {Address} param0.owner
 * @param {{}} param0.denied
 * @returns {*}
 */
export const prepareSimpleDenyListPayload = ({
owner,
denied
}: SimpleDenyListPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'owner' },
      { type: 'address[]', name: 'denied' },
    ],
    [owner, denied],
  );
};

/**
 * Description placeholder
 *
 * @export
 * @param {SimpleDenyListPayload} param0
 * @param {Address} param0.owner
 * @param {{}} param0.denied
 * @returns {Target}
 */
export function simpleDenyList({
  owner,
  denied,
}: SimpleDenyListPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: prepareSimpleDenyListPayload({owner, denied})
  };
}

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
   * @type {Address}
   */
  budget: Address;
  /**
   * Description placeholder
   *
   * @type {Target}
   */
  action: Target;
  /**
   * Description placeholder
   *
   * @type {Target}
   */
  validator: Target;
  /**
   * Description placeholder
   *
   * @type {Target}
   */
  allowList: Target;
  /**
   * Description placeholder
   *
   * @type {Target[]}
   */
  incentives: Target[];
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
   * @type {Address}
   */
  owner: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @param {BoostPayload} param0
 * @param {Address} param0.budget
 * @param {Target} param0.action
 * @param {Target} param0.validator
 * @param {Target} param0.allowList
 * @param {{}} param0.incentives
 * @param {bigint} [param0.protocolFee=0n]
 * @param {bigint} [param0.referralFee=0n]
 * @param {bigint} [param0.maxParticipants=0n]
 * @param {Address} param0.owner
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

/**
 * Description placeholder
 *
 * @export
 * @interface ERC1155Payload
 * @typedef {ERC1155Payload}
 */
export interface ERC1155Payload {
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  amount: bigint;
}

/**
 * Description placeholder
 *
 * @export
 * @param {ERC1155Payload} param0
 * @param {bigint} param0.tokenId
 * @param {bigint} param0.amount
 * @returns {*}
 */
export function prepareERC1155Payload({
  tokenId,
  amount,
}: ERC1155Payload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'ERC1155Payload payload',
      'struct ERC1155Payload { uint256 tokenId; uint256 amount; bytes data; }',
    ]),
    [{ tokenId, amount, data: '0x' }],
  );
}

/**
 * Description placeholder
 *
 * @export
 * @interface PointsIncentivePayload
 * @typedef {PointsIncentivePayload}
 */
export interface PointsIncentivePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  venue: Address;
  /**
   * Description placeholder
   *
   * @type {Hex}
   */
  selector: Hex;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * Description placeholder
 *
 * @param {PointsIncentivePayload} param0
 * @param {Address} param0.venue
 * @param {Hex} param0.selector
 * @param {bigint} param0.reward
 * @param {bigint} param0.limit
 * @returns {*}
 */
export const preparePointsIncentivePayload = ({
  venue,
  selector,
  reward,
  limit,
}: PointsIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'venue' },
      { type: 'bytes4', name: 'selector' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
    ],
    [venue,
      selector,
      reward,
      limit],
  );
};

/**
 * The configuration parameters for the CGDAIncentive
 *
 * @export
 * @interface CGDAParameters
 * @typedef {CGDAParameters}
 */
export interface CGDAParameters {
  /**
   * The amount to subtract from the current reward after each claim
   *
   * @type {bigint}
   */
  rewardDecay: bigint;
  /**
   * The amount by which the reward increases for each hour without a claim (continuous linear increase)
   *
   * @type {bigint}
   */
  rewardBoost: bigint;
  /**
   * The timestamp of the last claim
   *
   * @type {bigint}
   */
  lastClaimTime: bigint;
  /**
   * The current reward amount
   *
   * @type {bigint}
   */
  currentReward: bigint;
}

/**
 * Description placeholder
 *
 * @export
 * @interface CGDAIncentivePayload
 * @typedef {CGDAIncentivePayload}
 */
export interface CGDAIncentivePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  initialReward: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  rewardDecay: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  rewardBoost: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  totalBudget: bigint;
}

/**
 * Description placeholder
 *
 * @param {CGDAIncentivePayload} param0
 * @param {Address} param0.asset
 * @param {bigint} param0.initialReward
 * @param {bigint} param0.rewardDecay
 * @param {bigint} param0.rewardBoost
 * @param {bigint} param0.totalBudget
 * @returns {*}
 */
export const prepareCGDAIncentivePayload = ({
  asset,
  initialReward,
  rewardDecay,
  rewardBoost,
  totalBudget
}: CGDAIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint256', name: 'initialReward' },
      { type: 'uint256', name: 'rewardDecay' },
      { type: 'uint256', name: 'rewardBoost' },
      { type: 'uint256', name: 'totalBudget' },
    ],
    [asset,
      initialReward,
      rewardDecay,
      rewardBoost,
      totalBudget],
  );
};

/**
 * Description placeholder
 *
 * @export
 * @interface ERC1155IncentivePayload
 * @typedef {ERC1155IncentivePayload}
 */
export interface ERC1155IncentivePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Description placeholder
   *
   * @type {ERC1155StrategyType}
   */
  strategy: ERC1155StrategyType;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  limit: bigint;
  /**
   * Description placeholder
   *
   * @type {Hex}
   */
  extraData: Hex;
}

// TODO: there's an issue with this specific payload encoding that exists between viem and ethers
/**
 * Description placeholder
 *
 * @param {ERC1155IncentivePayload} param0
 * @param {Address} param0.asset
 * @param {ERC1155StrategyType} param0.strategy
 * @param {bigint} param0.tokenId
 * @param {bigint} param0.limit
 * @param {Hex} param0.extraData
 * @returns {Hex}
 */
export const prepareERC1155IncentivePayload = ({
  asset,
  strategy,
  tokenId,
  limit,
  extraData
}: ERC1155IncentivePayload) => {
  return AbiCoder.defaultAbiCoder().encode([
    'address',
    'uint8',
    'uint256',
    'uint256',
    'bytes',
  ],
  [asset,
    strategy,
    tokenId,
    limit,
    zeroHash]) as Hex
};

/**
 * Description placeholder
 *
 * @export
 * @interface AllowListIncentivePayload
 * @typedef {AllowListIncentivePayload}
 */
export interface AllowListIncentivePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  allowList: Address
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  limit: bigint
}

/**
 * Description placeholder
 *
 * @param {AllowListIncentivePayload} param0
 * @param {Address} param0.allowList
 * @param {bigint} param0.limit
 * @returns {*}
 */
export const prepareAllowListIncentivePayload = ({
  allowList,
  limit
}: AllowListIncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'allowList' },
      { type: 'uint256', name: 'limit' },
    ],
    [allowList,
      limit
    ],
  );
};

/**
 * Description placeholder
 *
 * @export
 * @interface ERC20IncentivePayload
 * @typedef {ERC20IncentivePayload}
 */
export interface ERC20IncentivePayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Description placeholder
   *
   * @type {StrategyType}
   */
  strategy: StrategyType;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  reward: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  limit: bigint;
}

/**
 * Description placeholder
 *
 * @param {ERC20IncentivePayload} param0
 * @param {Address} param0.asset
 * @param {StrategyType} param0.strategy
 * @param {bigint} param0.reward
 * @param {bigint} param0.limit
 * @returns {*}
 */
export const prepareERC20IncentivePayload = ({
  asset,
  strategy,
  reward,
  limit,
}: ERC20IncentivePayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'asset' },
      { type: 'uint8', name: 'strategy' },
      { type: 'uint256', name: 'reward' },
      { type: 'uint256', name: 'limit' },
    ],
    [asset, strategy, reward, limit],
  );
};

/**
 * Description placeholder
 *
 * @export
 * @interface ContractActionPayload
 * @typedef {ContractActionPayload}
 */
export interface ContractActionPayload {
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  chainId: bigint;
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  target: Address;
  /**
   * Description placeholder
   *
   * @type {Hex}
   */
  selector: Hex;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  value: bigint;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {ERC721MintActionPayload}
 */
export type ERC721MintActionPayload = ContractActionPayload

/**
 * Description placeholder
 *
 * @export
 * @interface SimpleBudgetPayload
 * @typedef {SimpleBudgetPayload}
 */
export interface SimpleBudgetPayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * Description placeholder
   *
   * @type {Address[]}
   */
  authorized: Address[];
}

/**
 * Description placeholder
 *
 * @param {SimpleBudgetPayload} param0
 * @param {Address} param0.owner
 * @param {{}} param0.authorized
 * @returns {*}
 */
export const prepareSimpleBudgetPayload = ({
  owner,
  authorized,
}: SimpleBudgetPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'SimpleBudgetPayload payload',
      'struct SimpleBudgetPayload { address owner; address[] authorized; }',
    ]),
    [{ owner, authorized }],
  );
};

/**
 * Description placeholder
 *
 * @export
 * @interface VestingBudgetPayload
 * @typedef {VestingBudgetPayload}
 */
export interface VestingBudgetPayload {
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  owner: Address;
  /**
   * Description placeholder
   *
   * @type {Address[]}
   */
  authorized: Address[];
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  start: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  duration: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  cliff: bigint;
}

/**
 * Description placeholder
 *
 * @param {VestingBudgetPayload} param0
 * @param {Address} param0.owner
 * @param {{}} param0.authorized
 * @param {bigint} param0.start
 * @param {bigint} param0.duration
 * @param {bigint} param0.cliff
 * @returns {*}
 */
export const prepareVestingBudgetPayload = ({
  owner,
  authorized,
  start,
  duration,
  cliff
}: VestingBudgetPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'VestingBudgetPayload payload',
      'struct VestingBudgetPayload { address owner; address[] authorized; uint64 start; uint64 duration; uint64 cliff; }',
    ]),
    [{ owner, authorized, start, duration, cliff }],
  );
};

/**
 * Description placeholder
 *
 * @param {ContractActionPayload} param0
 * @param {bigint} param0.chainId
 * @param {Address} param0.target
 * @param {Hex} param0.selector
 * @param {bigint} param0.value
 * @returns {*}
 */
export const prepareContractActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'ContractActionPayload payload',
      'struct ContractActionPayload { uint256 chainId; address target; bytes4 selector; uint256 value; }',
    ]),
    [{ chainId, target, selector, value }],
  );
};

/**
 * Description placeholder
 *
 * @param {ContractActionPayload} param0
 * @param {bigint} param0.chainId
 * @param {Address} param0.target
 * @param {Hex} param0.selector
 * @param {bigint} param0.value
 * @returns {*}
 */
export const prepareERC721MintActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return prepareContractActionPayload({ chainId, target, selector, value });
};

/**
 * Description placeholder
 *
 * @export
 * @interface ClaimPayload
 * @typedef {ClaimPayload}
 */
export interface ClaimPayload { /**
 * Description placeholder
 *
 * @type {Address}
 */
target: Address, /**
 * Description placeholder
 *
 * @type {?Hex}
 */
data?: Hex}

/**
 * Description placeholder
 *
 * @param {ClaimPayload} param0
 * @param {Address} param0.target
 * @param {Hex} [param0.data=zeroHash]
 * @returns {*}
 */
export const prepareClaimPayload = ({ target, data = zeroHash }: ClaimPayload) => {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    [target, data],
  )
}

/*
* Transfer Payloads
*/

/**
 * Description placeholder
 *
 * @export
 * @enum {number}
 */
export enum AssetType {
  ETH,
  ERC20,
  ERC1155
}

/**
 * Description placeholder
 *
 * @export
 * @interface TransferPayload
 * @typedef {TransferPayload}
 */
export interface TransferPayload {
  /**
   * Description placeholder
   *
   * @type {AssetType}
   */
  assetType: AssetType
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  address: Address
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  target: Address
  /**
   * Description placeholder
   *
   * @type {Hex}
   */
  data: Hex
}

/**
 * Description placeholder
 *
 * @param {TransferPayload} param0
 * @param {AssetType} param0.assetType
 * @param {Address} param0.address
 * @param {Address} param0.target
 * @param {Hex} param0.data
 * @returns {*}
 */
export const prepareTransferPayload =({ assetType, address, target, data }: TransferPayload)  => {
  return encodeAbiParameters(
    [
      { type: 'uint8', name: 'assetType' },
      { type: 'address', name: 'asset' },
      { type: 'address', name: 'target' },
      { type: 'bytes', name: 'data' },
    ],
    [assetType, address, target, data],
  )
}

/**
 * Description placeholder
 *
 * @export
 * @interface ERC1155TransferPayload
 * @typedef {ERC1155TransferPayload}
 */
export interface ERC1155TransferPayload {
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  tokenId: bigint;
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  amount: bigint;
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  target: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @param {ERC1155TransferPayload} param0
 * @param {bigint} param0.tokenId
 * @param {bigint} param0.amount
 * @param {Address} param0.asset
 * @param {Address} param0.target
 * @returns {*}
 */
export function prepareERC1155Transfer({
  tokenId,
  amount,
  asset,
  target,
}: ERC1155TransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: AssetType.ERC1155,
        asset,
        data: prepareERC1155Payload({ tokenId, amount }),
        target,
      },
    ],
  );
}

/**
 * Description placeholder
 *
 * @export
 * @interface FungiblePayload
 * @typedef {FungiblePayload}
 */
export interface FungiblePayload { /**
 * Description placeholder
 *
 * @type {bigint}
 */
amount: bigint }

/**
 * Description placeholder
 *
 * @export
 * @param {FungiblePayload} param0
 * @param {bigint} param0.amount
 * @returns {*}
 */
export function prepareFungiblePayload({ amount }: FungiblePayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'FungiblePayload payload',
      'struct FungiblePayload { uint256 amount; }',
    ]),
    [{ amount }],
  );
}

/**
 * Description placeholder
 *
 * @export
 * @interface FungibleTransferPayload
 * @typedef {FungibleTransferPayload}
 */
export interface FungibleTransferPayload {
  /**
   * Description placeholder
   *
   * @type {bigint}
   */
  amount: bigint;
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  asset: Address;
  /**
   * Description placeholder
   *
   * @type {Address}
   */
  target: Address;
}

/**
 * Description placeholder
 *
 * @export
 * @param {FungibleTransferPayload} param0
 * @param {bigint} param0.amount
 * @param {Address} param0.asset
 * @param {Address} param0.target
 * @returns {*}
 */
export function prepareFungibleTransfer({
  amount,
  asset,
  target,
}: FungibleTransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: asset == zeroAddress ? AssetType.ETH : AssetType.ERC20,
        asset,
        data: prepareFungiblePayload({ amount }),
        target,
      },
    ],
  );
}

/**
 * Description placeholder
 *
 * @export
 * @param {Address} holder
 * @param {bigint} payload
 * @returns {*}
 */
export function prepareERC721MintActionValidate(holder: Address, payload: bigint) {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'holder' },
      { type: 'bytes', name: 'payload' },
    ],
    [holder, toHex(payload)],
  )
}
