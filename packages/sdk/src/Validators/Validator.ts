import { aValidatorAbi } from '@boostxyz/evm';
import { ASignerValidator } from '@boostxyz/evm/deploys/componentInterfaces.json';
import { readContract } from '@wagmi/core';
import type { Address, Hex } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import { SignerValidator } from './SignerValidator';

export { SignerValidator };

/**
 * A union type representing all valid protocol Validator implementations
 *
 * @export
 * @typedef {Validator}
 */
export type Validator = SignerValidator;

/**
 * A map of Validator component interfaces to their constructors.
 *
 * @type {{ "0xd8725ea2": typeof SignerValidator; }}
 */
export const ValidatorByComponentInterface = {
  [ASignerValidator as Hex]: SignerValidator,
};

/**
 * A function that will read a contract's component interface using `getComponentInterface` and return the correct instantiated instance.
 *
 * @export
 * @async
 * @param {DeployableOptions} options
 * @param {Address} address
 * @returns {Promise<Validator>}
 * @throws {@link InvalidComponentInterfaceError}
 */
export async function validatorFromAddress(
  options: DeployableOptions,
  address: Address,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aValidatorAbi,
    functionName: 'getComponentInterface',
    address,
  })) as keyof typeof ValidatorByComponentInterface;
  const Ctor = ValidatorByComponentInterface[interfaceId];
  if (!Ctor) {
    throw new InvalidComponentInterfaceError(
      Object.keys(ValidatorByComponentInterface) as Hex[],
      interfaceId as Hex,
    );
  }
  return new Ctor(options, address);
}
