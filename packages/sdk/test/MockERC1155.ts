import {
  mockErc1155Abi,
  simulateMockErc1155Burn,
  simulateMockErc1155Mint,
  writeMockErc1155Burn,
  writeMockErc1155Mint,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/shared/Mocks.sol/MockERC1155.json';
import type { Address, Hex } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../src';
import type { CallParams } from './../src/utils';

export class MockERC1155 extends Deployable {
  public async mint(
    address: Address,
    id: bigint,
    amount: bigint,
    params: CallParams<typeof writeMockErc1155Mint> = {},
  ) {
    return this.awaitResult(
      this.mintRaw(address, id, amount, params),
      mockErc1155Abi,
      simulateMockErc1155Mint,
    );
  }

  public async mintRaw(
    address: Address,
    id: bigint,
    amount: bigint,
    params: CallParams<typeof writeMockErc1155Mint> = {},
  ) {
    return writeMockErc1155Mint(this._config, {
      address: this.assertValidAddress(),
      args: [address, id, amount],
      ...params,
    });
  }

  public async burn(
    address: Address,
    id: bigint,
    amount: bigint,
    params: CallParams<typeof writeMockErc1155Burn> = {},
  ) {
    return this.awaitResult(
      this.burnRaw(address, id, amount, params),
      mockErc1155Abi,
      simulateMockErc1155Burn,
    );
  }

  public async burnRaw(
    address: Address,
    id: bigint,
    amount: bigint,
    params: CallParams<typeof writeMockErc1155Burn> = {},
  ) {
    return writeMockErc1155Burn(this._config, {
      address: this.assertValidAddress(),
      args: [address, id, amount],
      ...params,
    });
  }

  public override buildParameters(
    _payload: {} = {},
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [{}, options] = this.validateDeploymentConfig(_payload, _options);
    //@ts-expect-error this is a test utility, ignoring required args in parameter return
    return {
      abi: mockErc1155Abi,
      bytecode: bytecode as Hex,
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
