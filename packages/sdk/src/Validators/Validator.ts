import { aValidatorAbi } from '@boostxyz/evm';
import {
  ALimitedSignerValidator,
  APayableLimitedSignerValidator,
  ASignerValidator,
} from '@boostxyz/evm/deploys/componentInterfaces.json';
import { readContract } from '@wagmi/core';
import { type Address, type Hex, decodeAbiParameters } from 'viem';
import type { DeployableOptions } from '../Deployable/Deployable';
import { InvalidComponentInterfaceError } from '../errors';
import type { ReadParams } from '../utils';
import { LimitedSignerValidator } from './LimitedSignerValidator';
import { PayableLimitedSignerValidator } from './PayableLimitedSignerValidator';
import { SignerValidator } from './SignerValidator';

export { SignerValidator, LimitedSignerValidator };

/**
 * A union type representing all valid protocol Validator implementations
 *
 * @export
 * @typedef {Validator}
 */
export type Validator =
  | SignerValidator
  | LimitedSignerValidator
  | PayableLimitedSignerValidator;

/**
 * A map of Validator component interfaces to their constructors.
 *
 * @type {{ "0xd8725ea2": typeof SignerValidator; }}
 */
export const ValidatorByComponentInterface = {
  [ASignerValidator as Hex]: SignerValidator,
  [ALimitedSignerValidator as Hex]: LimitedSignerValidator,
  [APayableLimitedSignerValidator as Hex]: PayableLimitedSignerValidator,
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
  params?: ReadParams,
) {
  const interfaceId = (await readContract(options.config, {
    abi: aValidatorAbi,
    functionName: 'getComponentInterface',
    address,
    ...params,
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

/**
 * An enum of verified Boost Validator EOA (Externally Owned Account) addresses used by the Boost protocol
 * for validating transactions on mainnet and testnet environments.
 *
 * @example
 * ```typescript
 * // Initialize a SignerValidator using the pre-configured EOA address of a verified Boost validator.
 * // If no validator is provided to core.createBoost(...), then this is what will be used by default.
 * const validator = core.SignerValidator({
 *   signers: [BoostValidatorEOA.[TESTNET | MAINNET]],
 *   validatorCaller: core.assertValidAddress()
 * })
 * ```
 * @enum {Address}
 */
export const BoostValidatorEOA = {
  MAINNET: import.meta.env.VITE_BOOST_MAINNET_SIGNER_EOA as Address,
  TESTNET: import.meta.env.VITE_BOOST_TESTNET_SIGNER_EOA as Address,
};

/**
 * Decodes a claim data hex string into its validator data and incentive data components.
 *
 * @export
 * @param {Hex} data - The hex-encoded claim data to decode
 * @returns {{ validatorData: Hex; incentiveData: Hex }} The decoded claim data components
 */
export function decodeClaimData(data: Hex) {
  return decodeAbiParameters(
    [
      {
        type: 'tuple',
        name: 'BoostClaimData',
        components: [
          { type: 'bytes', name: 'validatorData' },
          { type: 'bytes', name: 'incentiveData' },
        ],
      },
    ],
    data,
  )[0];
}
