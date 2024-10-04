import { aBudgetAbi } from '@boostxyz/evm';
import { AManagedBudget } from '@boostxyz/evm/deploys/componentInterfaces.json';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { ManagedBudget } from './ManagedBudget';

export {
  // VestingBudget,
  ManagedBudget,
};

/**
 * A union type representing all valid protocol Budget implementations
 *
 * @export
 * @typedef {Budget}
 */
export type Budget = ManagedBudget; // | VestingBudget

/**
 * A map of Budget component interfaces to their constructors.
 *
 * @type {{ "0xa0109882": typeof ManagedBudget; }}
 */
export const BudgetByComponentInterface = {
  // ['0x64683da1']: VestingBudget,
  // ['0x2929d19c']: SimpleBudget,
  [AManagedBudget as Hex]: ManagedBudget,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<ManagedBudget>}
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
      interfaceId as Hex,
    );
  }
  return new Ctor(options, address);
}
