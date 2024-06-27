import {
  type SimpleBudgetPayload,
  type TransferPayload,
  prepareSimpleBudgetPayload,
  prepareTransferPayload,
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
import { getAccount } from '@wagmi/core';
import { type Address, type Hex, zeroAddress } from 'viem';
import {
  Deployable,
  type DeployableOptions,
  type GenericDeployableParams,
} from '../Deployable/Deployable';
import { DeployableUnknownOwnerProvidedError } from '../errors';
import type { CallParams } from '../utils';

export type { SimpleBudgetPayload };

export class SimpleBudget extends Deployable<SimpleBudgetPayload> {
  public start(params: CallParams<typeof readVestingBudgetStart> = {}) {
    return readVestingBudgetStart(this._config, {
      address: this.assertValidAddress(),
      ...params,
    });
  }

  public allocate(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetAllocate> = {},
  ) {
    return writeSimpleBudgetAllocate(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public reclaim(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetReclaim> = {},
  ) {
    return writeSimpleBudgetReclaim(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  public disburse(
    transfer: TransferPayload,
    params: CallParams<typeof writeSimpleBudgetDisburse> = {},
  ) {
    return writeSimpleBudgetDisburse(this._config, {
      address: this.assertValidAddress(),
      args: [prepareTransferPayload(transfer)],
      ...params,
    });
  }

  // use prepareFungibleTransfer or prepareERC1155Transfer
  // TODO use data structure
  public disburseBatch(
    transfers: TransferPayload[],
    params: CallParams<typeof writeSimpleBudgetDisburseBatch> = {},
  ) {
    return writeSimpleBudgetDisburseBatch(this._config, {
      address: this.assertValidAddress(),
      args: [transfers.map(prepareTransferPayload)],
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
    _payload?: SimpleBudgetPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    if (!payload.owner || payload.owner === zeroAddress) {
      const owner = options.account
        ? options.account.address
        : options.config
          ? getAccount(options.config).address
          : this._account?.address;
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
      ...this.optionallyAttachAccount(options.account),
    };
  }
}
