import { aAllowListAbi } from '@boostxyz/evm';
import {
  AOffchainAccessList,
  ASimpleAllowList,
  ASimpleDenyList,
} from '@boostxyz/evm/deploys/componentInterfaces.json';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import type { ReadParams } from '../utils';
import { OffchainAccessList } from './OffchainAccessList';
import { OpenAllowList } from './OpenAllowList';
import { SimpleAllowList } from './SimpleAllowList';
import { SimpleDenyList } from './SimpleDenyList';

export { OffchainAccessList, OpenAllowList, SimpleAllowList, SimpleDenyList };

/**
 * A union type representing all valid protocol AllowList implementations
 *
 * @export
 * @typedef {AllowList}
 */
export type AllowList =
  | OffchainAccessList
  | OpenAllowList
  | SimpleAllowList
  | SimpleDenyList;

/**
 * A map of AllowList component interfaces to their constructors.
 *
 * @type {{ "0x1392d798": SimpleAllowList; "0x3d30a22c": SimpleDenyList; "0x2a6b3c38": OffchainAccessList; }}
 */
export const AllowListByComponentInterface = {
  [ASimpleAllowList as Hex]: SimpleAllowList,
  [ASimpleDenyList as Hex]: SimpleDenyList,
  [AOffchainAccessList as Hex]: OffchainAccessList,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 * This function will never return an instance of {@link OpenAllowList} because it has the same component interface as {@link SimpleDenyList}
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<SimpleAllowList | SimpleDenyList>}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function allowListFromAddress(
  options: DeployableOptions,
  address: Address,
  params?: ReadParams,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aAllowListAbi,
    functionName: 'getComponentInterface',
    address,
    ...params,
  })) as keyof typeof AllowListByComponentInterface;
  const Ctor = AllowListByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(AllowListByComponentInterface) as Hex[],
      interfaceId as Hex,
    );
  }
  return new Ctor(options, address) as
    | SimpleDenyList
    | SimpleAllowList
    | OffchainAccessList;
}
