import { simpleDenyListAbi } from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import { type Address, type Hex, zeroAddress } from 'viem';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import { RegistryType } from '../utils';
import {
  SimpleDenyList,
  type SimpleDenyListPayload,
  prepareSimpleDenyListPayload,
} from './SimpleDenyList';

export const openAllowListAbi = simpleDenyListAbi;

/**
 * A simple AllowList, extending {@link DenyList}, that is ownerless and allows anyone to claim.
 *
 * @export
 * @class OpenAllowList
 * @typedef {OpenAllowList}
 * @extends {DeployableTarget<OpenAllowListPayload>}
 */
export class OpenAllowList extends SimpleDenyList<undefined> {
  public override readonly abi = openAllowListAbi;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Address}
   */
  public static override base: Address = import.meta.env
    .VITE_SIMPLE_DENYLIST_BASE;
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.ALLOW_LIST;

  /**
   * @inheritdoc
   *
   * @public
   * @param {?SimpleDenyListPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: SimpleDenyListPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [_, options] = this.validateDeploymentConfig({}, _options);
    return {
      abi: openAllowListAbi,
      bytecode: bytecode as Hex,
      args: [prepareSimpleDenyListPayload({ owner: zeroAddress, denied: [] })],
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
