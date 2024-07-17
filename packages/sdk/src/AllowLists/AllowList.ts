import { allowListAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { SimpleAllowList } from './SimpleAllowList';
import { SimpleDenyList } from './SimpleDenyList';

export { SimpleDenyList, SimpleAllowList };

/**
 * Description placeholder
 *
 * @export
 * @typedef {AllowList}
 */
export type AllowList = SimpleAllowList | SimpleDenyList;

/**
 * Description placeholder
 *
 * @type {{ "0x2bc9016b": any; "0x9d585f63": any; }}
 */
export const AllowListByComponentInterface = {
  ['0x2bc9016b']: SimpleAllowList,
  ['0x9d585f63']: SimpleDenyList,
};

/**
 * Description placeholder
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {unknown}
 */
export async function allowListFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: allowListAbi,
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
