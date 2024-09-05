import { aActionAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { ContractAction } from './ContractAction';
import { ERC721MintAction } from './ERC721MintAction';
import { EventAction } from './EventAction';

export { ContractAction, ERC721MintAction };

/**
 * A union type representing all valid protocol Action implementations
 *
 * @export
 * @typedef {Action}
 */
export type Action = ContractAction | ERC721MintAction | EventAction;

/**
 * A map of Action component interfaces to their constructors.
 *
 * @type {{ "0x2fae823b": ContractAction; "0xcba21e6c": ERC721MintAction; "0x916b9f6d": EventAction; }}
 */
export const ActionByComponentInterface = {
  ['0x2fae823b']: ContractAction,
  ['0xcba21e6c']: ERC721MintAction,
  ['0x916b9f6d']: EventAction,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<ContractAction | ERC721MintAction | EventAction>}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function actionFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aActionAbi,
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
  return new Ctor(options, address) as
    | ContractAction
    | ERC721MintAction
    | EventAction;
}
