import { actionAbi } from '@boostxyz/evm';
import { type Config, readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { ContractAction } from './ContractAction';
import { ERC721MintAction } from './ERC721MintAction';

export { ContractAction, ERC721MintAction };

/**
 * Description placeholder
 *
 * @export
 * @typedef {Action}
 */
export type Action = ContractAction | ERC721MintAction;

/**
 * Description placeholder
 *
 * @type {{ "0x2fae823b": any; "0xcba21e6c": any; }}
 */
export const ActionByComponentInterface = {
  ['0x2fae823b']: ContractAction,
  ['0xcba21e6c']: ERC721MintAction,
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
export async function actionFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: actionAbi,
    functionName: 'getComponentInterface',
    address,
  })) as keyof typeof ActionByComponentInterface;
  const Ctor = ActionByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(ActionByComponentInterface) as Hex[],
      interfaceId,
    );
  }
  return new Ctor(options, address) as ContractAction | ERC721MintAction;
}
