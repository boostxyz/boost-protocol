import {
  pointsAbi,
  simulatePointsApprove,
  simulatePointsIssue,
  writePointsApprove,
  writePointsIssue,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/tokens/Points.sol/Points.json';
import type { Address, Hex } from 'viem';
import type { DeployableOptions, GenericDeployableParams } from '../src';
import type { WriteParams } from './../src/utils';
import { MockERC20 } from './MockERC20';

export class MockPoints extends MockERC20 {
  public override async approve(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof pointsAbi, 'approve'>,
  ) {
    return this.awaitResult(this.approveRaw(address, value, params));
  }

  public override async approveRaw(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof pointsAbi, 'approve'>,
  ) {
    const { request, result } = await simulatePointsApprove(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writePointsApprove(this._config, request);
    return { hash, result };
  }

  public async issue(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof pointsAbi, 'issue'>,
  ) {
    return this.awaitResult(this.issueRaw(address, value, params));
  }

  public async issueRaw(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof pointsAbi, 'issue'>,
  ) {
    const { request, result } = await simulatePointsIssue(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writePointsIssue(this._config, request);
    return { hash, result };
  }

  public override buildParameters(
    _payload = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: pointsAbi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
