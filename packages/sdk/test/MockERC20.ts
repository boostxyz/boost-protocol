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
import type { WriteParams } from './../src/utils';

export class MockERC20 extends Deployable {
  public async mint(
    address: Address,
    value: bigint,
    params: WriteParams<typeof mockErc20Abi, 'mint'>,
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
    params: WriteParams<typeof mockErc20Abi, 'mint'>,
  ) {
    return writeMockErc20Mint(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
  }

  public async mintPayable(
    address: Address,
    value: bigint,
    params: WriteParams<typeof mockErc20Abi, 'mintPayable'>,
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
    params: WriteParams<typeof mockErc20Abi, 'mintPayable'>,
  ) {
    return writeMockErc20MintPayable(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
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
