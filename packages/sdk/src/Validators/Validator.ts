import { validatorAbi } from '@boostxyz/evm';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { SignerValidator } from './SignerValidator';

export { SignerValidator };

export type Validator = SignerValidator;

export const ValidatorByComponentInterface = {
  ['0xd8725ea2']: SignerValidator,
};

export async function validatorFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: validatorAbi,
    functionName: 'getComponentInterface',
    address,
  })) as keyof typeof ValidatorByComponentInterface;
  const Ctor = ValidatorByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(ValidatorByComponentInterface) as Hex[],
      interfaceId,
    );
  }
  return new Ctor(options, address);
}
