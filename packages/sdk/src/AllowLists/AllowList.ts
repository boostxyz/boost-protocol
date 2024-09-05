import { aAllowListAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { SimpleAllowList } from './SimpleAllowList';
import { SimpleDenyList } from './SimpleDenyList';

export { SimpleAllowList, SimpleDenyList };

/**
 * A union type representing all valid protocol AllowList implementations
 *
 * @export
 * @typedef {AllowList}
 */
export type AllowList = SimpleAllowList | SimpleDenyList;

/**
 * A map of AllowList component interfaces to their constructors.
 *
 * @type {{ "0x2bc9016b": SimpleAllowList; "0x9d585f63": SimpleDenyList; }}
 */
export const AllowListByComponentInterface = {
  ['0x2bc9016b']: SimpleAllowList,
  ['0x9d585f63']: SimpleDenyList,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
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
) {
  const interfaceId = (await readContract(options.config, {
    abi: aAllowListAbi,
    functionName: 'getComponentInterface',
    address,
  })) as keyof typeof AllowListByComponentInterface;
  const Ctor = AllowListByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(AllowListByComponentInterface) as Hex[],
      interfaceId,
    );
  }
  return new Ctor(options, address);
}
