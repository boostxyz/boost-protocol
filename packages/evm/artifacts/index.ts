export * from './generated';
import { LibZip } from 'solady';
import {
  Address,
  Hex,
  encodeAbiParameters,
  parseAbiParameters,
  stringToHex,
  zeroAddress,
  zeroHash
} from 'viem';
import { AbiCoder } from 'ethers';

export enum RegistryType {
  ACTION = 0,
  ALLOW_LIST = 1,
  BUDGET = 2,
  INCENTIVE = 3,
  VALIDATOR = 4,
}

export enum StrategyType {
  POOL = 0,
  MINT = 1,
  RAFFLE = 2,
}

export enum ERC1155StrategyType {
  POOL = 0,
  MINT = 1,
}

export type Target = {
  isBase: boolean;
  instance: Address;
  parameters: Hex;
};

export function prepareTarget({ isBase, instance, parameters }: Target) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Target target',
      'struct Target { bool isBase; address instance; bytes parameters; }',
    ]),
    [{ isBase, instance, parameters }],
  );
}

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

export interface ERC20IncentivePayload {
  asset: Address;
  strategy: StrategyType;
  reward: bigint;
  limit: bigint;
}
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

export interface SignerValidatorValidatePayload {
  signer: Address;
  hash: Hex;
  signature: Hex;
}

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

export interface SignerValidatorPayload {
  signers: Address[];
}

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

export function signerValidator({
  signers,
}: SignerValidatorPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: prepareSignerValidatorPayload({ signers })
  };
}

export interface SimpleAllowListPayload {
  owner: Address;
  allowed: Address[];
}

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

export interface SimpleDenyListPayload {
  owner: Address;
  denied: Address[];
}

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

export interface BoostPayload {
  budget: Address;
  action: Target;
  validator: Target;
  allowList: Target;
  incentives: Target[];
  protocolFee?: bigint;
  referralFee?: bigint;
  maxParticipants?: bigint;
  owner: Address;
}

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

export interface ERC1155Payload {
  tokenId: bigint;
  amount: bigint;
}

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

export interface PointsIncentivePayload {
  venue: Address;
  selector: Hex;
  reward: bigint;
  limit: bigint;
}

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

export interface CGDAParameters {
  rewardDecay: bigint;
  rewardBoost: bigint;
  lastClaimTime: bigint;
  currentReward: bigint;
}

export interface CGDAIncentivePayload {
  asset: Address;
  initialReward: bigint;
  rewardDecay: bigint;
  rewardBoost: bigint;
  totalBudget: bigint;
}

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

export interface ERC1155IncentivePayload {
  asset: Address;
  strategy: ERC1155StrategyType;
  tokenId: bigint;
  limit: bigint;
  extraData: Hex;
}

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
    zeroHash])
};

export interface AllowListIncentivePayload {
  allowList: Address
  limit: bigint
}

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

export interface ERC20IncentivePayload {
  asset: Address;
  strategy: StrategyType;
  reward: bigint;
  limit: bigint;
}

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

export interface ContractActionPayload {
  chainId: bigint;
  target: Address;
  selector: Hex;
  value: bigint;
}

export type ERC721MintActionPayload = ContractActionPayload

export interface SimpleBudgetPayload {
  owner: Address;
  authorized: Address[];
}

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

export interface VestingBudgetPayload {
  owner: Address;
  authorized: Address[];
  start: bigint;
  duration: bigint;
  cliff: bigint;
}

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

export const prepareERC721MintActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return prepareContractActionPayload({ chainId, target, selector, value });
};

export interface ClaimPayload { target: Address, data?: Hex}

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

export enum AssetType {
  ETH,
  ERC20,
  ERC1155
}

export interface TransferPayload {
  assetType: AssetType
  address: Address
  target: Address
  data: Hex
}

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

export interface ERC1155TransferPayload {
  tokenId: bigint;
  amount: bigint;
  asset: Address;
  target: Address;
}

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

export interface FungiblePayload { amount: bigint }

export function prepareFungiblePayload({ amount }: FungiblePayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'FungiblePayload payload',
      'struct FungiblePayload { uint256 amount; }',
    ]),
    [{ amount }],
  );
}

export interface FungibleTransferPayload {
  amount: bigint;
  asset: Address;
  target: Address;
}

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
