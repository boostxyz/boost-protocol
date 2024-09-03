import { readPointsBalanceOf, writePointsGrantRoles } from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { signMessage } from '@wagmi/core';
import { isAddress, pad, parseEther, zeroAddress } from 'viem';
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
import { bytes4, prepareSignerValidatorClaimDataPayload } from '../utils';
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
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
    const pointsIncentive = new fixtures.bases.PointsIncentive(defaultOptions, {
      venue: points.assertValidAddress(),
      selector: bytes4('issue(address,uint256)'),
      reward: 1n,
      limit: 10n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      validator: boost.validator.assertValidAddress(),
      incentiveQuantity,
      claimant,
      boostId: boost.id,
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
      claimDataPayload,
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
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;

    const pointsIncentive = new fixtures.bases.PointsIncentive(defaultOptions, {
      venue: points.assertValidAddress(),
      selector: bytes4('issue(address,uint256)'),
      reward,
      limit: 10n,
    });
    const boost = await freshBoost(fixtures, {
      incentives: [pointsIncentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      validator: boost.validator.assertValidAddress(),
      incentiveQuantity,
      claimant,
      boostId: boost.id,
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
      claimDataPayload,
      { value: parseEther('0.000075') },
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        { value: parseEther('0.000075') },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
