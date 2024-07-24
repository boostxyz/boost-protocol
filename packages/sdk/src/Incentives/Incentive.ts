import { incentiveAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { AllowListIncentive } from './AllowListIncentive';
import { CGDAIncentive } from './CGDAIncentive';
import { ERC20Incentive } from './ERC20Incentive';
import { ERC1155Incentive } from './ERC1155Incentive';
import { PointsIncentive } from './PointsIncentive';

export {
  AllowListIncentive,
  CGDAIncentive,
  ERC1155Incentive,
  ERC20Incentive,
  PointsIncentive,
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
  | PointsIncentive;

/**
 * A map of Incentive component interfaces to their constructors.
 *
 * @type {{ "0x1e2e16a8": typeof PointsIncentive; "0x197d2cb3": typeof ERC20Incentive; "0xd1da3349": typeof AllowListIncentive; "0xb168aa66": typeof ERC1155Incentive; "0x31116297": typeof CGDAIncentive; }}
 */
export const IncentiveByComponentInterface = {
  ['0x1e2e16a8']: PointsIncentive,
  ['0x197d2cb3']: ERC20Incentive,
  ['0xd1da3349']: AllowListIncentive,
  ['0xb168aa66']: ERC1155Incentive,
  ['0x31116297']: CGDAIncentive,
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
