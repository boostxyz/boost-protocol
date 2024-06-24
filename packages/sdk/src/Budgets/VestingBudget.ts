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
import { DeployableAddressRequiredError } from '../errors';

export type { PrepareVestingBudgetPayload };

export class VestingBudget extends Deployable {
  protected payload: PrepareVestingBudgetPayload = {
    owner: zeroAddress,
    authorized: [],
    start: 0n,
    duration: 0n,
    cliff: 0n,
  };

  constructor(config: Partial<PrepareVestingBudgetPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public allocate(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeVestingBudgetAllocate(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public reclaim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeVestingBudgetReclaim(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburse(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeVestingBudgetDisburse(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatch(data: Hex[], config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeVestingBudgetDisburseBatch(config, {
      address: this.address,
      args: [data],
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    config: Config,
  ) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return await writeVestingBudgetSetAuthorized(config, {
      address: this.address,
      args: [addresses, allowed],
    });
  }

  public isAuthorized(account: Address, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readVestingBudgetIsAuthorized(config, {
      address: this.address,
      args: [account],
    });
  }

  public end(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readVestingBudgetEnd(config, {
      address: this.address,
      args: [],
    });
  }

  public total(asset: Address, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readVestingBudgetTotal(config, {
      address: this.address,
      args: [asset],
    });
  }

  public available(asset: Address, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readVestingBudgetAvailable(config, {
      address: this.address,
      args: [asset],
    });
  }

  public distributed(asset: Address, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readVestingBudgetDistributed(config, {
      address: this.address,
      args: [asset],
    });
  }

  public override buildParameters(config: Config): GenericDeployableParams {
    if (!this.payload.owner || this.payload.owner === zeroAddress) {
      const owner = getAccount(config).address;
      if (owner) {
        this.payload.owner = owner;
      } else {
        // throw?
        console.warn('Unable to ascertain owner for budget');
      }
    }
    return {
      abi: VestingBudgetArtifact.abi,
      bytecode: VestingBudgetArtifact.bytecode as Hex,
      args: [prepareVestingBudgetPayload(this.payload)],
    };
  }
}
