import {
  mockErc721Abi,
  simulateMockErc721Mint,
  writeMockErc721Mint,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/shared/Mocks.sol/MockERC721.json';
import type { Address, Hex } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../src';
import type { WriteParams } from '../src/utils';

export class MockERC721 extends Deployable<{}, typeof mockErc721Abi> {
  public async mint(
    address: Address,
    params?: WriteParams<typeof mockErc721Abi, 'mint'>,
  ) {
    return this.awaitResult(this.mintRaw(address, params));
  }

  public async mintRaw(
    address: Address,
    params?: WriteParams<typeof mockErc721Abi, 'mint'>,
  ) {
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
    _payload: {} = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [{}, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: mockErc721Abi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
