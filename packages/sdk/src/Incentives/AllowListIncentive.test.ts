import { writePointsGrantRoles } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { signMessage } from '@wagmi/core';
import {
  encodePacked,
  isAddress,
  keccak256,
  parseEther,
  zeroAddress,
} from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
} from '../../test/helpers';
import { LIST_MANAGER_ROLE } from '../AllowLists/SimpleAllowList';
import { bytes4, prepareSignerValidatorValidatePayload } from '../utils';
import { PointsIncentive } from './PointsIncentive';

let fixtures: Fixtures;

function freshAllowList(fixtures: Fixtures) {
  return function freshAllowList() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [],
      }),
    );
  };
}

describe('AllowListIncentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });

  test('can successfully be deployed', async () => {
    const action = new PointsIncentive(defaultOptions, {
      venue: zeroAddress,
      selector: '0xdeadb33f',
      reward: 1n,
      limit: 1n,
    });
    await action.deploy();
    expect(isAddress(action.assertValidAddress())).toBe(true);
  });

  test('can claim', async () => {
    const referrer = accounts.at(1)!.account!;
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message: { raw: message },
    });
    const allowList = await loadFixture(freshAllowList(fixtures));
    const allowListIncentive = new fixtures.bases.AllowListIncentive(
      defaultOptions,
      {
        allowList: allowList.assertValidAddress(),
        limit: 3n,
      },
    );
    const boost = await freshBoost(fixtures, {
      incentives: [allowListIncentive],
    });
    await allowList.grantRoles(
      allowListIncentive.assertValidAddress(),
      LIST_MANAGER_ROLE,
    );
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      prepareSignerValidatorValidatePayload({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
      { value: parseEther('0.000075'), account: trustedSigner.privateKey },
    );
    expect(await allowList.isAllowed(trustedSigner.account)).toBe(true);
  });

  test('cannot claim twice', async () => {
    const referrer = accounts.at(1)!.account!;
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message: { raw: message },
    });
    const allowList = await loadFixture(freshAllowList(fixtures));
    const allowListIncentive = new fixtures.bases.AllowListIncentive(
      defaultOptions,
      {
        allowList: allowList.assertValidAddress(),
        limit: 3n,
      },
    );
    const boost = await freshBoost(fixtures, {
      incentives: [allowListIncentive],
    });
    await allowList.grantRoles(
      allowListIncentive.assertValidAddress(),
      LIST_MANAGER_ROLE,
    );
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      prepareSignerValidatorValidatePayload({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
      { value: parseEther('0.000075'), account: trustedSigner.privateKey },
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        prepareSignerValidatorValidatePayload({
          signer: trustedSigner.account,
          hash: message,
          signature: trustedSignature,
        }),
        { value: parseEther('0.000075'), account: trustedSigner.privateKey },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
