import { type Config, deployContract } from '@wagmi/core';
import type { Address } from 'viem';

export class Deployable {
  address: Address | undefined;

  public async deploy(
    config: Config,
    parameters: Parameters<typeof deployContract>[1],
  ): Promise<Address> {
    return (this.address = await deployContract(config, parameters));
  }
}
