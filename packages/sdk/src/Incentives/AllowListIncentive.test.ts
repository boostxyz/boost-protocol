import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { isAddress, pad, parseEther, zeroAddress } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { accounts } from '../../test/accounts';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
} from '../../test/helpers';
import { LIST_MANAGER_ROLE } from '../AllowLists/SimpleAllowList';
import { prepareSignerValidatorClaimDataPayload } from '../utils';
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
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)?.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
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

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    console.log(claimant);

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

    //await boost.validator.setValidatorCaller(boost.assertValidAddress());
    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: parseEther('0.000075'), account: trustedSigner.privateKey },
    );
    expect(await allowList.isAllowed(trustedSigner.account)).toBe(true);
  });

  test('cannot claim twice', async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)?.account!;
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const trustedSigner = accounts.at(0)!;
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
    const incentiveQuantity = 1;
    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    console.log(claimant);

    const claimDataPayload = await prepareSignerValidatorClaimDataPayload({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      validator: boost.validator.assertValidAddress(),
      incentiveQuantity,
      claimant,
      boostId: boost.id,
    });

    await fixtures.core.claimIncentive(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: parseEther('0.000075'), account: trustedSigner.privateKey },
    );
    try {
      await fixtures.core.claimIncentive(
        boost.id,
        0n,
        referrer,
        claimDataPayload,
        { value: parseEther('0.000075'), account: trustedSigner.privateKey },
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
