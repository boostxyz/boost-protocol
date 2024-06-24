import {
  type PrepareSimpleBudgetPayload,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
  prepareSimpleBudgetPayload,
  readSimpleBudgetAvailable,
  readSimpleBudgetDistributed,
  readSimpleBudgetIsAuthorized,
  readSimpleBudgetTotal,
  readVestingBudgetStart,
  writeSimpleBudgetAllocate,
  writeSimpleBudgetDisburse,
  writeSimpleBudgetDisburseBatch,
  writeSimpleBudgetReclaim,
  writeSimpleBudgetSetAuthorized,
} from '@boostxyz/evm';
import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import { type Config, getAccount } from '@wagmi/core';
import {
  type Address,
  type Hex,
  encodeAbiParameters,
  zeroAddress,
  zeroHash,
} from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableAddressRequiredError } from '../errors';

export type { PrepareSimpleBudgetPayload };

export class SimpleBudget extends Deployable {
  protected payload: PrepareSimpleBudgetPayload = {
    owner: zeroAddress,
    authorized: [],
  };

  constructor(config: Partial<PrepareSimpleBudgetPayload> = {}) {
    super();
    this.payload = {
      ...this.payload,
      ...config,
    };
  }

  public start(config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readVestingBudgetStart(config, { address: this.address });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public allocate(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeSimpleBudgetAllocate(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public reclaim(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeSimpleBudgetReclaim(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburse(data: Hex, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeSimpleBudgetDisburse(config, {
      address: this.address,
      args: [data],
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatch(data: Hex[], config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return writeSimpleBudgetDisburseBatch(config, {
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
    return await writeSimpleBudgetSetAuthorized(config, {
      address: this.address,
      args: [addresses, allowed],
    });
  }

  public isAuthorized(account: Address, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readSimpleBudgetIsAuthorized(config, {
      address: this.address,
      args: [account],
    });
  }

  public total(asset: Address, tokenId: bigint | undefined, config: Config) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readSimpleBudgetTotal(config, {
      address: this.address,
      args: tokenId ? [asset, tokenId] : [asset],
    });
  }

  public available(
    asset: Address,
    tokenId: bigint | undefined,
    config: Config,
  ) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readSimpleBudgetAvailable(config, {
      address: this.address,
      args: tokenId ? [asset, tokenId] : [asset],
    });
  }

  public distributed(
    asset: Address,
    tokenId: bigint | undefined,
    config: Config,
  ) {
    if (!this.address) throw new DeployableAddressRequiredError();
    return readSimpleBudgetDistributed(config, {
      address: this.address,
      args: tokenId ? [asset, tokenId] : [asset],
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
      abi: SimpleBudgetArtifact.abi,
      bytecode: SimpleBudgetArtifact.bytecode as Hex,
      args: [prepareSimpleBudgetPayload(this.payload)],
    };
  }
}
