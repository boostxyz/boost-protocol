import {
  mockErc20Abi,
  simulateMockErc20Approve,
  simulateMockErc20Mint,
  simulateMockErc20MintPayable,
  writeMockErc20Approve,
  writeMockErc20Mint,
  writeMockErc20MintPayable,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/shared/Mocks.sol/MockERC20.json';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
  type WriteParams,
} from '@boostxyz/sdk';
import type { Address, Hex } from 'viem';

export class MockERC20 extends Deployable<unknown, typeof mockErc20Abi> {
  public async approve(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof mockErc20Abi, 'approve'>,
  ) {
    return await this.awaitResult(this.approveRaw(address, value, params));
  }

  public async approveRaw(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof mockErc20Abi, 'approve'>,
  ) {
    const { request, result } = await simulateMockErc20Approve(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeMockErc20Approve(this._config, request);
    return { hash, result };
  }

  public async mint(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof mockErc20Abi, 'mint'>,
  ) {
    return await this.awaitResult(this.mintRaw(address, value, params));
  }

  public async mintRaw(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof mockErc20Abi, 'mint'>,
  ) {
    const { request, result } = await simulateMockErc20Mint(this._config, {
      address: this.assertValidAddress(),
      args: [address, value],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeMockErc20Mint(this._config, request);
    return { hash, result };
  }

  public async mintPayable(
    address: Address,
    value: bigint,
    params?: WriteParams<typeof mockErc20Abi, 'mintPayable'>,
  ) {
    return await this.awaitResult(
      // biome-ignore lint/suspicious/noExplicitAny: this is a mock contract, it's fine
      this.mintPayableRaw(address, value, params as any),
    );
  }
  public async mintPayableRaw(
    address: Address,
    value: bigint,
    params: WriteParams<typeof mockErc20Abi, 'mintPayable'>,
  ) {
    const { request, result } = await simulateMockErc20MintPayable(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [address, value],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeMockErc20MintPayable(this._config, request);
    return { hash, result };
  }

  public override buildParameters(
    _payload = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: mockErc20Abi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
