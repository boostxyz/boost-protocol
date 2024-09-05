import { aBudgetAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { ManagedBudget } from './ManagedBudget';
import { SimpleBudget } from './SimpleBudget';
import { VestingBudget } from './VestingBudget';

export { SimpleBudget, VestingBudget, ManagedBudget };

/**
 * A union type representing all valid protocol Budget implementations
 *
 * @export
 * @typedef {Budget}
 */
export type Budget = SimpleBudget | VestingBudget | ManagedBudget;

/**
 * A map of Budget component interfaces to their constructors.
 *
 * @type {{ "0x7aded85d": typeof VestingBudget; "0x0f2a5d52": typeof SimpleBudget; "0x0596908b": typeof SimpleBudget; }}
 */
export const BudgetByComponentInterface = {
  ['0x7aded85d']: VestingBudget,
  ['0x0f2a5d52']: SimpleBudget,
  ['0x0596908b']: ManagedBudget,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<VestingBudget | SimpleBudget>}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function budgetFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aBudgetAbi,
    functionName: 'getComponentInterface',
    address,
  })) as keyof typeof BudgetByComponentInterface;
  const Ctor = BudgetByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(BudgetByComponentInterface) as Hex[],
      interfaceId,
    );
  }
  return new Ctor(options, address);
}
