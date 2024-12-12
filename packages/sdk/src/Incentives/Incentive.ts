import { aIncentiveAbi } from '@boostxyz/evm';
import {
  AAllowListIncentive,
  ACGDAIncentive,
  AERC20Incentive,
  AERC20PeggedIncentive,
  AERC20PeggedVariableCriteriaIncentive,
  AERC20VariableCriteriaIncentive,
  AERC20VariableIncentive,
  // AERC20VariableCriteriaIncentive
  APointsIncentive,
} from '@boostxyz/evm/deploys/componentInterfaces.json';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import type { ReadParams } from '../utils';
import { AllowListIncentive } from './AllowListIncentive';
import { CGDAIncentive } from './CGDAIncentive';
import { ERC20Incentive } from './ERC20Incentive';
import { ERC20PeggedIncentive } from './ERC20PeggedIncentive';
import { ERC20PeggedVariableCriteriaIncentive } from './ERC20PeggedVariableCriteriaIncentive';
import { ERC20VariableCriteriaIncentive } from './ERC20VariableCriteriaIncentive';
import { ERC20VariableIncentive } from './ERC20VariableIncentive';
// import { ERC1155Incentive } from './ERC1155Incentive';
import { PointsIncentive } from './PointsIncentive';

export {
  AllowListIncentive,
  CGDAIncentive,
  // ERC1155Incentive,
  ERC20Incentive,
  ERC20PeggedIncentive,
  ERC20PeggedVariableCriteriaIncentive,
  PointsIncentive,
  ERC20VariableIncentive,
  ERC20VariableCriteriaIncentive,
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
  // | ERC1155Incentive
  | ERC20PeggedIncentive
  | ERC20PeggedVariableCriteriaIncentive
  | PointsIncentive
  | ERC20VariableIncentive
  | ERC20VariableCriteriaIncentive;

/**
 * A map of Incentive component interfaces to their constructors.
 *
 * @type {{ "0xc5b24b8e": typeof PointsIncentive; "0x8c901437": typeof ERC20Incentive; "0x4414fbb4": typeof ERC20PeggedIncentive; "0xf60c99c9": typeof ERC20PeggedVariableCriteriaIncentive; "0x56586338":  typeof AllowListIncentive; "0xa39e44d9": typeof CGDAIncentive; "0xa8e4af1e": typeof ERC20VariableIncentive; "0x90318111": typeof ERC20VariableCriteriaIncentive }}
 */
export const IncentiveByComponentInterface = {
  [APointsIncentive as Hex]: PointsIncentive,
  [AERC20Incentive as Hex]: ERC20Incentive,
  [AERC20VariableIncentive as Hex]: ERC20VariableIncentive,
  [AERC20PeggedIncentive as Hex]: ERC20PeggedIncentive,
  [AAllowListIncentive]: AllowListIncentive,
  // [AERC1155Incentive as Hex]: ERC1155Incentive,
  [ACGDAIncentive as Hex]: CGDAIncentive,
  [AERC20VariableIncentive as Hex]: ERC20VariableIncentive,
  [AERC20VariableCriteriaIncentive as Hex]: ERC20VariableCriteriaIncentive,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Incentive}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function incentiveFromAddress(
  options: DeployableOptions,
  address: Address,
  params?: ReadParams,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aIncentiveAbi,
    functionName: 'getComponentInterface',
    address,
    ...params,
  })) as keyof typeof IncentiveByComponentInterface;
  const Ctor = IncentiveByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(IncentiveByComponentInterface) as Hex[],
      interfaceId as Hex,
    );
  }
  return new Ctor(options, address);
}
