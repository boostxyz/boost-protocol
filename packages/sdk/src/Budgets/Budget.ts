import {
  budgetAbi,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
} from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { SimpleBudget } from './SimpleBudget';
import { VestingBudget } from './VestingBudget';

export { SimpleBudget, VestingBudget };

export { prepareERC1155Transfer, prepareFungibleTransfer };

/**
 * Description placeholder
 *
 * @export
 * @typedef {Budget}
 */
export type Budget = SimpleBudget | VestingBudget;

/**
 * Description placeholder
 *
 * @type {{ "0x7aded85d": any; "0x0f2a5d52": any; }}
 */
export const BudgetByComponentInterface = {
  ['0x7aded85d']: VestingBudget,
  ['0x0f2a5d52']: SimpleBudget,
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
export async function budgetFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: budgetAbi,
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
