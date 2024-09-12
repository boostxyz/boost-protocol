import { aActionAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { EventAction } from './EventAction';

export {
  // ContractAction,
  // ERC721MintAction,
  EventAction,
};

/**
 * A union type representing all valid protocol Action implementations
 *
 * @export
 * @typedef {Action}
 */
export type Action = EventAction; // | ContractAction | ERC721MintAction

/**
 * A map of Action component interfaces to their constructors.
 *
 * @type {{ "0x6c3129aa": EventAction; }}
 */
export const ActionByComponentInterface = {
  // ['0x6c3129aa']: ContractAction,
  // ['0x97e083eb']: ERC721MintAction,
  ['0x6c3129aa']: EventAction,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<EventAction>}
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
  return new Ctor(options, address);
}
