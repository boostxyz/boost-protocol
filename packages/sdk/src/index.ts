import {
  BoostPayload,
  boostCoreAbi,
  prepareBoostPayload,
  writeBoostCoreCreateBoost,
} from '@boostxyz/evm';
import { type Config, getAccount } from '@wagmi/core';
import { createWriteContract } from '@wagmi/core/codegen';
import { Address, Hex } from 'viem';

export const BOOST_CORE_ADDRESS: Address = '0x';

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

  // TODO don't use boost payload, instead accept nice interface with Budget, Validator instances, etc.
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
