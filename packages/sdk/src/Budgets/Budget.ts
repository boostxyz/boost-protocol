import { aBudgetAbi } from '@boostxyz/evm';
import {
  AManagedBudget,
  AManagedBudgetWithFees,
  AManagedBudgetWithFeesV2,
} from '@boostxyz/evm/deploys/componentInterfaces.json';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import type { ReadParams } from '../utils';
import { ManagedBudget } from './ManagedBudget';
import { ManagedBudgetWithFees } from './ManagedBudgetWithFees';
import { ManagedBudgetWithFeesV2 } from './ManagedBudgetWithFeesV2';
import { TransparentBudget } from './TransparentBudget';

export {
  // VestingBudget,
  ManagedBudget,
  ManagedBudgetWithFees,
  ManagedBudgetWithFeesV2,
  TransparentBudget,
};

/**
 * A union type representing all valid protocol Budget implementations
 *
 * @export
 * @typedef {Budget}
 */
export type Budget =
  | ManagedBudget
  | ManagedBudgetWithFees
  | ManagedBudgetWithFeesV2
  | TransparentBudget; // | VestingBudget

/**
 * A map of Budget component interfaces to their constructors.
 *
 * @type {{ "0xa0109882": typeof ManagedBudget; }}
 */
export const BudgetByComponentInterface = {
  // ['0x64683da1']: VestingBudget,
  // ['0x2929d19c']: SimpleBudget,
  [AManagedBudget as Hex]: ManagedBudget,
  [AManagedBudgetWithFees as Hex]: ManagedBudgetWithFees,
  [AManagedBudgetWithFeesV2 as Hex]: ManagedBudgetWithFeesV2,
  ['0x2929d19c']: TransparentBudget,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<ManagedBudget | ManagedBudgetWithFees | ManagedBudgetWithFeesV2>}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function budgetFromAddress(
  options: DeployableOptions,
  address: Address,
  params?: ReadParams,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aBudgetAbi,
    functionName: 'getComponentInterface',
    address,
    ...params,
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
