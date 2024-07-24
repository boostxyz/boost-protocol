import { readPointsBalanceOf, writePointsGrantRoles } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { signMessage } from '@wagmi/core';
import {
  encodePacked,
  isAddress,
  keccak256,
  parseEther,
  zeroAddress,
} from 'viem';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import type { MockPoints } from '../../test/MockPoints';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  freshPoints,
} from '../../test/helpers';
import { bytes4, prepareSignerValidatorValidatePayload } from '../utils';
import { PointsIncentive } from './PointsIncentive';

let fixtures: Fixtures, points: MockPoints;

describe('PointsIncentive', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });

  beforeEach(async () => {
    points = await loadFixture(freshPoints);
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
    const pointsIncentive = new fixtures.bases.PointsIncentive(defaultOptions, {
      venue: points.assertValidAddress(),
      selector: bytes4('issue(address,uint256)'),
      reward: 1n,
      limit: 10n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
    });
    await writePointsGrantRoles(defaultOptions.config, {
      address: points.assertValidAddress(),
      args: [pointsIncentive.assertValidAddress(), 2n],
      account: defaultOptions.account,
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      prepareSignerValidatorValidatePayload({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
      { value: parseEther('0.000075') },
    );
    expect(
      await readPointsBalanceOf(defaultOptions.config, {
        address: points.assertValidAddress(),
        args: [defaultOptions.account.address],
      }),
    ).toBe(1n);
  });

  test('cannot claim twice', async () => {
    const reward = 1n;
    const referrer = accounts.at(1)!.account!;
    const message = keccak256(encodePacked(['string'], ['test']));
    const trustedSigner = accounts.at(0)!;
    const trustedSignature = await signMessage(defaultOptions.config, {
      account: trustedSigner.privateKey,
      message: { raw: message },
    });
    const pointsIncentive = new fixtures.bases.PointsIncentive(defaultOptions, {
      venue: points.assertValidAddress(),
      selector: bytes4('issue(address,uint256)'),
      reward,
      limit: 10n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
    });
    await writePointsGrantRoles(defaultOptions.config, {
      address: points.assertValidAddress(),
      args: [pointsIncentive.assertValidAddress(), 2n],
      account: defaultOptions.account,
    });
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      prepareSignerValidatorValidatePayload({
        signer: trustedSigner.account,
        hash: message,
        signature: trustedSignature,
      }),
      { value: parseEther('0.000075') },
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
        { value: parseEther('0.000075') },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
