import {
  passthroughAuthAbi,
  readPassthroughAuthIsAuthorized,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/auth/PassthroughAuth.sol/PassthroughAuth.json';
import type { Address, ContractEventName, Hex } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableTarget } from '../Deployable/DeployableTarget';
import type { GenericLog, ReadParams } from '../utils';

export { passthroughAuthAbi };

/**
 * A generic `viem.Log` event with support for `PassthroughAuth` event types.
 *
 * @export
 * @typedef {PassthroughAuthLog}
 * @template {ContractEventName<
 *     typeof passthroughAuthAbi
 *   >} [event=ContractEventName<typeof passthroughAuthAbi>]
 */
export type PassthroughAuthLog<
  event extends ContractEventName<
    typeof passthroughAuthAbi
  > = ContractEventName<typeof passthroughAuthAbi>,
> = GenericLog<typeof passthroughAuthAbi, event>;

/**
 *  A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
 *
 * @export
 * @class PassthroughAuth
 * @typedef {PassthroughAuth}
 * @extends {DeployableTarget<PassthroughAuthPayload>}
 */
export class PassthroughAuth extends Deployable<
  // biome-ignore lint/suspicious/noExplicitAny: takes no parameters
  any,
  typeof passthroughAuthAbi
> {
  public override readonly abi = passthroughAuthAbi;

  public async isAuthorized(
    address: Address,
    params?: ReadParams<typeof passthroughAuthAbi, 'isAuthorized'>,
  ) {
    return readPassthroughAuthIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  /**
   * @inheritdoc
   *
   * @public
   * @param {?PassthroughAuthPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: never,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [_, options] = this.validateDeploymentConfig({}, _options);
    return {
      abi: passthroughAuthAbi,
      bytecode: bytecode as Hex,
      // biome-ignore lint/suspicious/noExplicitAny: <takes no payload>
      args: [] as any,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
