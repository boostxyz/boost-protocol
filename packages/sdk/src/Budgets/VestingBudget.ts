import {
  type PrepareVestingBudgetPayload,
  prepareVestingBudgetPayload,
  readVestingBudgetAvailable,
  readVestingBudgetDistributed,
  readVestingBudgetEnd,
  readVestingBudgetIsAuthorized,
  readVestingBudgetTotal,
  writeVestingBudgetAllocate,
  writeVestingBudgetDisburse,
  writeVestingBudgetDisburseBatch,
  writeVestingBudgetReclaim,
  writeVestingBudgetSetAuthorized,
} from '@boostxyz/evm';
import VestingBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import { type Config, getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { PrepareVestingBudgetPayload };

export class VestingBudget extends Deployable<PrepareVestingBudgetPayload> {
  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public allocate(
    data: Hex,
    params: CallParams<typeof writeVestingBudgetAllocate> = {},
  ) {
    return writeVestingBudgetAllocate(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public reclaim(
    data: Hex,
    params: CallParams<typeof writeVestingBudgetReclaim> = {},
  ) {
    return writeVestingBudgetReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburse(
    data: Hex,
    params: CallParams<typeof writeVestingBudgetDisburse> = {},
  ) {
    return writeVestingBudgetDisburse(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatch(
    data: Hex[],
    params: CallParams<typeof writeVestingBudgetDisburseBatch> = {},
  ) {
    return writeVestingBudgetDisburseBatch(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeVestingBudgetSetAuthorized> = {},
  ) {
    return await writeVestingBudgetSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public isAuthorized(
    account: Address,
    params: CallParams<typeof readVestingBudgetIsAuthorized> = {},
  ) {
    return readVestingBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...params,
    });
  }

  public end(params: CallParams<typeof readVestingBudgetEnd> = {}) {
    return readVestingBudgetEnd(this._config, {
      address: this.assertValidAddress(),
      args: [],
      ...params,
    });
  }

  public total(
    asset: Address,
    params: CallParams<typeof readVestingBudgetTotal> = {},
  ) {
    return readVestingBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      ...params,
    });
  }

  public available(
    asset: Address,
    params: CallParams<typeof readVestingBudgetAvailable> = {},
  ) {
    return readVestingBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      ...params,
    });
  }

  public distributed(
    asset: Address,
    params: CallParams<typeof readVestingBudgetDistributed> = {},
  ) {
    return readVestingBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: [asset],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: PrepareVestingBudgetPayload,
    _config?: Config,
  ): GenericDeployableParams {
    const [payload, config] = this.validateDeploymentConfig(_payload, _config);
    if (!payload.owner || payload.owner === zeroAddress) {
      const owner = getAccount(config).address;
      if (owner) {
        payload.owner = owner;
      } else {
        throw new DeployableUnknownOwnerProvidedError();
      }
    }
    return {
      abi: VestingBudgetArtifact.abi,
      bytecode: VestingBudgetArtifact.bytecode as Hex,
      args: [prepareVestingBudgetPayload(payload)],
    };
  }
}
