import {
  mockErc1155Abi,
  simulateMockErc1155Burn,
  simulateMockErc1155Mint,
  writeMockErc1155Burn,
  writeMockErc1155Mint,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/shared/Mocks.sol/MockERC1155.json';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '@boostxyz/sdk';
import type { WriteParams } from '@boostxyz/sdk';
import type { Address, Hex } from 'viem';

export class MockERC1155 extends Deployable<unknown, typeof mockErc1155Abi> {
  public async mint(
    address: Address,
    id: bigint,
    amount: bigint,
    params: WriteParams = {},
  ) {
    return await this.awaitResult(this.mintRaw(address, id, amount, params));
  }

  public async mintRaw(
    address: Address,
    id: bigint,
    amount: bigint,
    params: WriteParams = {},
  ) {
    const { request, result } = await simulateMockErc1155Mint(this._config, {
      address: this.assertValidAddress(),
      args: [address, id, amount],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeMockErc1155Mint(this._config, request);
    return { hash, result };
  }

  public async burn(
    address: Address,
    id: bigint,
    amount: bigint,
    params: WriteParams = {},
  ) {
    return await this.awaitResult(this.burnRaw(address, id, amount, params));
  }

  public async burnRaw(
    address: Address,
    id: bigint,
    amount: bigint,
    params: WriteParams = {},
  ) {
    const { request, result } = await simulateMockErc1155Burn(this._config, {
      address: this.assertValidAddress(),
      args: [address, id, amount],
      ...this.optionallyAttachAccount(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters, wagmi does the same thing internally
      ...(params as any),
    });
    const hash = await writeMockErc1155Burn(this._config, request);
    return { hash, result };
  }

  public override buildParameters(
    _payload: unknown = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [_, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: mockErc1155Abi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
