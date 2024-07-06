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
  ERC20Incentive,
  ERC1155Incentive,
  PointsIncentive,
};

export type Incentive =
  | AllowListIncentive
  | CGDAIncentive
  | ERC20Incentive
  | ERC1155Incentive
  | PointsIncentive;

export const IncentiveByComponentInterface = {
  ['0x1e2e16a8']: PointsIncentive,
  ['0x197d2cb3']: ERC20Incentive,
  ['0xd1da3349']: AllowListIncentive,
  ['0xb168aa66']: ERC1155Incentive,
  ['0x31116297']: CGDAIncentive,
};

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
