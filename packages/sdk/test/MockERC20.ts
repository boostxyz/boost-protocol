import {
  mockErc20Abi,
  simulateMockErc20Mint,
  simulateMockErc20MintPayable,
  writeMockErc20Mint,
  writeMockErc20MintPayable,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/shared/Mocks.sol/MockERC20.json';
import type { Address, Hex } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../src';
import type { CallParams } from './../src/utils';

export class MockERC20 extends Deployable {
  public async mint(
    address: Address,
    value: bigint,
    params: CallParams<typeof writeMockErc20Mint> = {},
  ) {
    return this.awaitResult(
      this.mintRaw(address, value, params),
      mockErc20Abi,
      simulateMockErc20Mint,
    );
  }

  public async mintRaw(
    address: Address,
    value: bigint,
    params: CallParams<typeof writeMockErc20Mint> = {},
  ) {
    return writeMockErc20Mint(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...params,
    });
  }

  public async mintPayable(
    address: Address,
    value: bigint,
    params: CallParams<typeof writeMockErc20MintPayable> = {},
  ) {
    return this.awaitResult(
      this.mintPayableRaw(address, value, params),
      mockErc20Abi,
      simulateMockErc20MintPayable,
    );
  }
  public async mintPayableRaw(
    address: Address,
    value: bigint,
    params: CallParams<typeof writeMockErc20MintPayable> = {},
  ) {
    return writeMockErc20MintPayable(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...params,
    });
  }

  public override buildParameters(
    _payload = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [{}, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: mockErc20Abi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
