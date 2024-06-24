import {
  type PrepareSimpleBudgetPayload,
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
import { type Address, type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { PrepareSimpleBudgetPayload };

export class SimpleBudget extends Deployable<PrepareSimpleBudgetPayload> {
  public start(params: CallParams<typeof readVestingBudgetStart> = {}) {
    return readVestingBudgetStart(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public allocate(
    data: Hex,
    params: CallParams<typeof writeSimpleBudgetAllocate> = {},
  ) {
    return writeSimpleBudgetAllocate(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public reclaim(
    data: Hex,
    params: CallParams<typeof writeSimpleBudgetReclaim> = {},
  ) {
    return writeSimpleBudgetReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburse(
    data: Hex,
    params: CallParams<typeof writeSimpleBudgetDisburse> = {},
  ) {
    return writeSimpleBudgetDisburse(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatch(
    data: Hex[],
    params: CallParams<typeof writeSimpleBudgetDisburseBatch> = {},
  ) {
    return writeSimpleBudgetDisburseBatch(this._config, {
      address: this.assertValidAddress(),
      args: [data],
      ...params,
    });
  }

  public async setAuthorized(
    addresses: Address[],
    allowed: boolean[],
    params: CallParams<typeof writeSimpleBudgetSetAuthorized> = {},
  ) {
    return await writeSimpleBudgetSetAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [addresses, allowed],
      ...params,
    });
  }

  public isAuthorized(
    account: Address,
    params: CallParams<typeof readSimpleBudgetIsAuthorized> = {},
  ) {
    return readSimpleBudgetIsAuthorized(this._config, {
      address: this.assertValidAddress(),
      args: [account],
      ...params,
    });
  }

  public total(
    asset: Address,
    tokenId: bigint | undefined,
    params: CallParams<typeof readSimpleBudgetTotal> = {},
  ) {
    return readSimpleBudgetTotal(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      ...params,
    });
  }

  public available(
    asset: Address,
    tokenId: bigint | undefined,
    params: CallParams<typeof readSimpleBudgetAvailable> = {},
  ) {
    return readSimpleBudgetAvailable(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      ...params,
    });
  }

  public distributed(
    asset: Address,
    tokenId: bigint | undefined,
    params: CallParams<typeof readSimpleBudgetDistributed> = {},
  ) {
    return readSimpleBudgetDistributed(this._config, {
      address: this.assertValidAddress(),
      args: tokenId ? [asset, tokenId] : [asset],
      ...params,
    });
  }

  public override buildParameters(
    _payload?: PrepareSimpleBudgetPayload,
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
      abi: SimpleBudgetArtifact.abi,
      bytecode: SimpleBudgetArtifact.bytecode as Hex,
      args: [prepareSimpleBudgetPayload(payload)],
    };
  }
}
