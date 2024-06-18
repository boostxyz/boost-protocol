import {
  type BoostPayload,
  boostCoreAbi,
  prepareBoostPayload,
} from '@boostxyz/evm';
import type { Config } from '@wagmi/core';
import { createWriteContract } from '@wagmi/core/codegen';
import type { Address } from 'viem';

export const BOOST_CORE_ADDRESS: Address = import.meta.env
  .VITE_BOOST_CORE_ADDRESS;

export interface BoostClientConfig {
  address?: Address;
  config: Config;
}

export class BoostClient {
  protected address: Address = BOOST_CORE_ADDRESS;
  protected config: Config;

  constructor({ address, config }: BoostClientConfig) {
    if (address) this.address = address;
    this.config = config;
  }

  public async createBoost(payload: BoostPayload) {
    const boostFactory = createWriteContract({
      abi: boostCoreAbi,
      functionName: 'createBoost',
      address: this.address,
    });

    // if (!payload.budget) {
    //   // create simple budget
    // }

    // if (!payload.action) {
    //   // idk
    // }

    // if (!payload.validator) {
    //   //
    // }

    // if (!payload.allowList) {
    // }

    // if (!payload.incentives) {
    // }

    // if (!payload.owner) {
    //   const owner = getAccount(this.config);
    //   payload.owner = owner.address;
    // }

    const boost = await boostFactory(this.config, {
      //TODO resolve this
      args: [prepareBoostPayload(payload)],
    });

    return boost;
  }
}
