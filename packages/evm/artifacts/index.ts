export * from './generated';
import { LibZip } from 'solady';
import {
  Address,
  Hex,
  encodeAbiParameters,
  parseAbiParameters,
  zeroAddress,
  zeroHash
} from 'viem';

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

export interface SignerValidatorPayload {
  signers: Address[];
}

export function signerValidator({
  signers,
}: SignerValidatorPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: encodeAbiParameters(
      [{ type: 'address[]', name: 'signers' }],
      [signers],
    ),
  };
}

export interface SimpleAllowListPayload {
  owner: Address;
  allowed: Address[];
}

export function simpleAllowList({
  owner,
  allowed,
}: SimpleAllowListPayload): Target {
  return {
    isBase: true,
    instance: zeroAddress,
    parameters: encodeAbiParameters(
      [
        { type: 'address', name: 'owner' },
        { type: 'address[]', name: 'allowed' },
      ],
      [owner, allowed],
    ),
  };
}

export interface BoostPayload {
  budget: Address;
  action: Target;
  validator: Target;
  allowList: Target;
  incentives: Target[];
  owner: Address;
}

export function prepareBoostPayload({
  budget,
  action,
  validator,
  allowList,
  incentives,
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
          protocolFee: 0n,
          referralFee: 0n,
          maxParticipants: 0n,
          owner,
        },
      ],
    ),
  ) as Hex;
}

export interface PrepareERC1155Payload {
  tokenId: bigint;
  amount: bigint;
}

export function prepareERC1155Payload({
  tokenId,
  amount,
}: PrepareERC1155Payload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'ERC1155Payload payload',
      'struct ERC1155Payload { uint256 tokenId; uint256 amount; bytes data; }',
    ]),
    [{ tokenId, amount, data: zeroHash }],
  );
}

export interface PrepareERC1155TransferPayload {
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
}: PrepareERC1155TransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: 2,
        asset,
        data: prepareERC1155Payload({ tokenId, amount }),
        target,
      },
    ],
  );
}

export interface PrepareFungiblePayload { amount: bigint }

export function prepareFungiblePayload({ amount }: PrepareFungiblePayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'FungiblePayload payload',
      'struct FungiblePayload { uint256 amount; }',
    ]),
    [{ amount }],
  );
}

export interface PrepareFungibleTransferPayload {
  amount: bigint;
  asset: Address;
  target: Address;
}

export function prepareFungibleTransfer({
  amount,
  asset,
  target,
}: PrepareFungibleTransferPayload) {
  return encodeAbiParameters(
    parseAbiParameters([
      'Transfer request',
      'struct Transfer { uint8 assetType; address asset; address target; bytes data; }',
    ]),
    [
      {
        assetType: asset == zeroAddress ? 0 : 1,
        asset,
        data: prepareFungiblePayload({ amount }),
        target,
      },
    ],
  );
}

export interface PrepareERC20IncentivePayload {
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
}: PrepareERC20IncentivePayload) => {
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

export interface PrepareSimpleBudgetPayload {
  owner: Address;
  authorized: Address[];
}

export const prepareSimpleBudgetPayload = ({
  owner,
  authorized,
}: PrepareSimpleBudgetPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'SimpleBudgetPayload payload',
      'struct SimpleBudgetPayload { address owner; address[] authorized; }',
    ]),
    [{ owner, authorized }],
  );
};

export interface PrepareVestingBudgetPayload {
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
}: PrepareVestingBudgetPayload) => {
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
