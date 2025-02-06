import {
  mockErc721Abi,
  simulateMockErc721Approve,
  simulateMockErc721Mint,
  simulateMockErc721TransferFrom,
  writeMockErc721Approve,
  writeMockErc721Mint,
  writeMockErc721TransferFrom,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/shared/Mocks.sol/MockERC721.json';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
  type WriteParams,
} from '@boostxyz/sdk';
import type { Address, Hex } from 'viem';

export class MockERC721 extends Deployable<unknown, typeof mockErc721Abi> {
  public async approve(address: Address, amount: bigint, params?: WriteParams) {
    return await this.awaitResult(this.approveRaw(address, amount, params));
  }

  public async approveRaw(
    address: Address,
    amount: bigint,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateMockErc721Approve(this._config, {
      address: this.assertValidAddress(),
      args: [address, amount],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeMockErc721Approve(this._config, request);
    return { hash, result };
  }

  public async transferFrom(
    from: Address,
    to: Address,
    id: bigint,
    params?: WriteParams,
  ) {
    return await this.awaitResult(this.transferFromRaw(from, to, id, params));
  }

  public async transferFromRaw(
    from: Address,
    to: Address,
    id: bigint,
    params?: WriteParams,
  ) {
    const { request, result } = await simulateMockErc721TransferFrom(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [from, to, id],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
        ...(params as any),
      },
    );
    const hash = await writeMockErc721TransferFrom(this._config, request);
    return { hash, result };
  }

  public async mint(address: Address, params?: WriteParams) {
    return await this.awaitResult(this.mintRaw(address, params));
  }

  public async mintRaw(address: Address, params?: WriteParams) {
    const { request, result } = await simulateMockErc721Mint(this._config, {
      address: this.assertValidAddress(),
      args: [address],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeMockErc721Mint(this._config, request);
    return { hash, result };
  }

  public override buildParameters(
    _payload: unknown = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [_, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: mockErc721Abi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
