import { allowListAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { SimpleAllowList } from './SimpleAllowList';
import { SimpleDenyList } from './SimpleDenyList';

export { SimpleDenyList, SimpleAllowList };

export type AllowList = SimpleAllowList | SimpleDenyList;

export const AllowListByComponentInterface = {
  ['0x2bc9016b']: SimpleAllowList,
  ['0x9d585f63']: SimpleDenyList,
};

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
