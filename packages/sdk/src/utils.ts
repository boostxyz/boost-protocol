import { events } from '@boostxyz/signatures';
import {
  type Config,
  type ReadContractParameters,
  type SimulateContractParameters,
  type WatchContractEventParameters,
  getAccount,
  getChainId,
  readContract,
  waitForTransactionReceipt,
} from '@wagmi/core';
import type { ExtractAbiEvent } from 'abitype';
import type {
  Abi,
  AbiEvent,
  Address,
  ContractEventName,
  ContractFunctionName,
  GetLogsParameters,
  Hash,
  Hex,
  Log,
  WaitForTransactionReceiptParameters,
} from 'viem';
import { isHex, keccak256, slice, toHex } from 'viem';
import {
  InvalidProtocolChainIdError,
  NoContractAddressUponReceiptError,
} from './errors';

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/**
 * Enum encapsulating all the different types of targets used in the Boost V2 Protocol.
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
 * Enum encapsulating all the different cheat codes for criteria modules.
 * An Event Action action step criteria with a `fieldIndex` set to `CheatCodes.ANY_ACTION_PARAM`, fieldType set to `PrimitiveType.BYTES`, and `filterType` set to `FilterType.EQUAL` will always return true when validating the field, regardless of inputs
 * An Event Action `ActionClaimant` with a `fieldIndex` set to `CheatCodes.TX_SENDER_CLAIMANT`, will always validate with the sender of a given transaction.
 *
 *
 * @export
 * @enum {number}
 */
export enum CheatCodes {
  /* An Event Action action step criteria with a `fieldIndex` set to `CheatCodes.ANY_ACTION_PARAM`, fieldType set to `PrimitiveType.BYTES`, and `filterType` set to `FilterType.EQUAL` will always return true when validating the field, regardless of inputs */
  ANY_ACTION_PARAM = 255,
  /* An Event Action `ActionClaimant` with a `fieldIndex` set to `CheatCodes.TX_SENDER_CLAIMANT`, will always validate with the sender of a given transaction. */
  TX_SENDER_CLAIMANT = 255,
  /* For use with `ERC20VariableCriteriaIncentive`, if the criteria's `fieldIndex` is set to `CheatCodes.GAS_REBATE_INCENTIVE`, will claim an incentive amount equal to the transaction's gas used. */
  GAS_REBATE_INCENTIVE = 255,
}

/**
 * The signature for the Transfer event for both ERC20 and ERC721.
 *
 * @type {Hex}
 */
export const TRANSFER_SIGNATURE = events.selectors[
  'Transfer(address indexed,address indexed,uint256 indexed)'
] as Hex;

/**
 * Helper type that encapsulates common writeContract parameters without fields like `abi`, `args`, `functionName`, `address` that are expected to be provided the SDK.
 * See (writeContract)[https://viem.sh/docs/contract/writeContract]
 *
 * @export
 * @typedef {WriteParams}
 * @template {Abi} abi
 * @template {ContractFunctionName<abi>} functionName
 */
export type WriteParams = Partial<
  Omit<SimulateContractParameters, 'address' | 'args' | 'functionName' | 'abi'>
>;

/**
 * Helper type that encapsulates common readContract parameters without fields like `abi`, `args`, `functionName`, `address` that are expected to be provided the SDK.
 * See (readContract)[https://viem.sh/docs/contract/readContract]
 *
 * @export
 * @typedef {ReadParams}
 * @template {Abi} abi
 * @template {ContractFunctionName<abi>} functionName
 */
export type ReadParams = Partial<
  Omit<ReadContractParameters, 'address' | 'args' | 'functionName' | 'abi'>
>;

/**
 * Helper type that encapsulates common `watchContractEvent` parameters without fields like `address`, and `abi` that are expected to be provided the SDK.
 * See (watchContractEvent)[https://wagmi.sh/core/api/actions/watchContractEvent]
 *
 * @export
 * @typedef {WatchParams}
 * @template {Abi} abi
 * @template {ContractEventName<abi> | undefined} [eventName=undefined]
 */
export type WatchParams<
  abi extends Abi,
  eventName extends ContractEventName<abi> | undefined = undefined,
> = Partial<
  Omit<WatchContractEventParameters<abi, eventName>, 'address' | 'abi'>
>;

/**
 * Helper type that encapsulates common `getLogs` parameters without fields like `address` that are expected to be provided the SDK.
 * See (getLogs)[https://viem.sh/docs/actions/public/getLogs#getlogs]
 *
 * @export
 * @typedef {GetLogsParams}
 * @template {Abi} abi
 * @template {ContractEventName<abi>} event
 * @template {ExtractAbiEvent<abi, event>} [abiEvent=ExtractAbiEvent<abi, event>]
 * @template {| readonly AbiEvent[]
 *     | readonly unknown[]
 *     | undefined} [abiEvents=abiEvent extends AbiEvent ? [abiEvent] : undefined]
 */
export type GetLogsParams<
  abi extends Abi,
  event extends ContractEventName<abi>,
  abiEvent extends ExtractAbiEvent<abi, event> = ExtractAbiEvent<abi, event>,
  abiEvents extends
    | readonly AbiEvent[]
    | readonly unknown[]
    | undefined = abiEvent extends AbiEvent ? [abiEvent] : undefined,
> = Partial<Omit<GetLogsParameters<abiEvent, abiEvents>, 'address'>> & {
  chainId?: number | undefined;
};

/**
 * A generic `viem.Log` event with typed `args` support via a given `Abi` and `ContractEventName`
 *
 * @export
 * @typedef {GenericLog}
 * @template {Abi} abi
 * @template {ContractEventName<abi>} [event=ContractEventName<abi>]
 */
export type GenericLog<
  abi extends Abi,
  event extends ContractEventName<abi> = ContractEventName<abi>,
> = Log<bigint, number, false, ExtractAbiEvent<abi, event>, false>;

/**
 * Helper utility to convert a string to a `bytes4` type
 *
 * @export
 * @param {string} input
 * @returns {Hex}
 */
export function bytes4(input: string) {
  return slice(isHex(input) ? keccak256(input) : keccak256(toHex(input)), 0, 4);
}

/**
 * Utility function to wait for a transaction receipt, and extract the contractAddress
 *
 * @export
 * @async
 * @param {WagmiConfig} config - [Wagmi Configuration](https://wagmi.sh/core/api/createConfig)
 * @param {Promise<Hash>} hash - A transaction hash promise
 * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams] - @see {@link WaitForTransactionReceiptParameters}
 * @returns {Promise<Address>}
 * @throws {@link NoContractAddressUponReceiptError} if no `contractAddress` exists after the transaction has been received
 */
export async function getDeployedContractAddress(
  config: Config,
  hash: Promise<Hash>,
  waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
) {
  const receipt = await waitForTransactionReceipt(config, {
    ...waitParams,
    hash: await hash,
  });
  if (!receipt.contractAddress)
    throw new NoContractAddressUponReceiptError(receipt);
  return receipt.contractAddress;
}

/**
 * Utility type to encapsulate a transaction hash, and the simulated result prior to submitting the transaction.
 *
 * @export
 * @typedef {HashAndSimulatedResult}
 * @template [T=unknown]
 */
export type HashAndSimulatedResult<T = unknown> = { hash: Hash; result: T };

/**
 * Helper function to wait for a transaction receipt given a hash promise.
 *
 * @export
 * @async
 * @template [Result=unknown]
 * @param {WagmiConfig} config
 * @param {Promise<HashAndSimulatedResult<Result>>} hashPromise
 * @param {?Omit<WaitForTransactionReceiptParameters, 'hash'>} [waitParams]
 * @returns {Promise<Result>}
 */
export async function awaitResult<Result = unknown>(
  config: Config,
  hashPromise: Promise<HashAndSimulatedResult<Result>>,
  waitParams?: Omit<WaitForTransactionReceiptParameters, 'hash'>,
): Promise<Result> {
  const { hash, result } = await hashPromise;
  await waitForTransactionReceipt(config, {
    ...waitParams,
    hash,
  });
  return result;
}

/**
 * Given a wagmi config and a map of chain id's to addresses, determine an address/chainId combo that maps to the currently connected chain id, or throw a typed error.
 *
 * @export
 * @param {Config} config
 * @param {Record<string, Address>} addressByChainId
 * @param {number} desiredChainId
 * @returns {{ chainId: number, address: Address }}
 * @throws {@link InvalidProtocolChainIdError}
 */
export function assertValidAddressByChainId(
  config: Config,
  addressByChainId: Record<number, Address>,
  desiredChainId?: number,
): { chainId: number; address: Address } {
  let chainId: number | undefined = undefined;

  const wagmiChainId = getChainId(config);
  if (wagmiChainId && addressByChainId[wagmiChainId]) chainId = wagmiChainId;
  // if manually providing a chain id for some contract operation, try to use it
  if (desiredChainId !== undefined) {
    if (addressByChainId[desiredChainId]) chainId = desiredChainId;
  } else if (wagmiChainId !== undefined) {
    // otherwise if we can get the current chain id off the connected account and it matches one of ours, use it
    if (addressByChainId[wagmiChainId]) chainId = wagmiChainId;
  }
  // chainId is still undefined, try to get chain id off viem client
  if (chainId === undefined) {
    const wagmiAccount = getAccount(config);
    if (wagmiAccount.chainId !== undefined) {
      // otherwise if we can get the current chain id off the connected account and it matches one of ours, use it
      if (addressByChainId[wagmiAccount.chainId])
        chainId = wagmiAccount.chainId;
    }
  }
  // if chainId is STILL undefined, use our default addresses
  // TODO: update this when on prod network
  if (chainId === undefined) chainId = Number(__DEFAULT_CHAIN_ID__);
  if (!addressByChainId[chainId])
    throw new InvalidProtocolChainIdError(
      chainId,
      Object.keys(addressByChainId).map(Number),
    );
  // biome-ignore lint/style/noNonNullAssertion: this type should be narrowed by the above statement but isn't?
  return { chainId, address: addressByChainId[chainId]! };
}

/**
 * Check an ERC20's balance for a given asset and
 *
 * @public
 * @async
 * @param {Config} [config]
 * @param {Address} [asset]
 * @param {Address} [owner]
 * @param {?ReadParams} [params]
 * @returns {Promise<bigint>} - The erc20 balance
 */
export async function getErc20Balance(
  config: Config,
  asset: Address,
  owner: Address,
  params?: ReadParams,
) {
  return await readContract(config, {
    ...params,
    functionName: 'balanceOf',
    address: asset,
    args: [owner],
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  });
}
