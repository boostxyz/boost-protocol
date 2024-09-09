import { incentiveAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { AllowListIncentive } from './AllowListIncentive';
import { CGDAIncentive } from './CGDAIncentive';
import { ERC20Incentive } from './ERC20Incentive';
import { ERC20VariableIncentive } from './ERC20VariableIncentive';
import { ERC1155Incentive } from './ERC1155Incentive';
import { PointsIncentive } from './PointsIncentive';

export {
  AllowListIncentive,
  CGDAIncentive,
  ERC1155Incentive,
  ERC20Incentive,
  PointsIncentive,
  ERC20VariableIncentive,
};

/**
 * A union type representing all valid protocol Incentive implementations
 *
 * @export
 * @typedef {Incentive}
 */
export type Incentive =
  | AllowListIncentive
  | CGDAIncentive
  | ERC20Incentive
  | ERC1155Incentive
  | PointsIncentive
  | ERC20VariableIncentive;

/**
 * A map of Incentive component interfaces to their constructors.
 *
 * @type {{ "0xac92f9b5": typeof PointsIncentive; "0xabc1c3ae": typeof ERC20Incentive; "0x6366dc54": typeof AllowListIncentive; "0x03d4457b": typeof ERC1155Incentive; "0x83ad8d8a": typeof CGDAIncentive; }}
 */
export const IncentiveByComponentInterface = {
  ['0xac92f9b5']: PointsIncentive,
  ['0xabc1c3ae']: ERC20Incentive,
  ['0x6366dc54']: AllowListIncentive,
  ['0x03d4457b']: ERC1155Incentive,
  ['0x83ad8d8a']: CGDAIncentive,
  ['0x47319704']: ERC20VariableIncentive,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {unknown}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function incentiveFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: incentiveAbi,
    functionName: 'getComponentInterface',
    address,
  })) as keyof typeof IncentiveByComponentInterface;
  const Ctor = IncentiveByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(IncentiveByComponentInterface) as Hex[],
      interfaceId,
    );
  }
  return new Ctor(options, address);
}
