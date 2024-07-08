import { StrategyType } from '@boostxyz/evm';
import { parseEther } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import { MockERC20 } from '../test/MockERC20';
import { type Fixtures, deployFixtures } from '../test/helpers';
import { setupConfig, testAccount } from '../test/viem';
import { ContractAction } from './Actions/ContractAction';
import { SimpleAllowList } from './AllowLists/SimpleAllowList';
import { BoostCore } from './BoostCore';
import { SimpleBudget } from './Budgets/SimpleBudget';
import type { DeployableOptions } from './Deployable/Deployable';
import { SignerValidator } from './Validators/SignerValidator';

let fixtures: Fixtures;
const options: DeployableOptions = {
  config: setupConfig(),
  account: testAccount,
};

beforeAll(async () => {
  fixtures = await deployFixtures();
});

describe('BoostCore', () => {
  test('can successfully create a boost using all base contract implementations', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...options,
      address: core,
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const boost = await client.createBoost({
      budget: new bases.SimpleBudget.Test(options, {
        owner: testAccount.address,
        authorized: [],
      }),
      action: new bases.ContractAction.Test(options, {
        chainId: BigInt(31_337),
        target: core,
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator.Test(options, {
        signers: [testAccount.address],
      }),
      allowList: new bases.SimpleAllowList.Test(options, {
        owner: testAccount.address,
        allowed: [],
      }),
      incentives: [new bases.ERC20Incentive.Test(options, {
       asset: erc20.address!,
       reward: parseEther('1'),
       limit: 100n,
       strategy: StrategyType.POOL
      }],
    });
    expect(await client.getBoostCount()).toBe(1n);
    const onChainBoost = await client.readBoost(0n);
    expect(boost.id).toBe(0n);
    expect(boost.action.address).toBe(onChainBoost.action);
    expect(boost.validator.address).toBe(onChainBoost.validator);
    expect(boost.allowList.address).toBe(onChainBoost.allowList);
    expect(boost.budget.address).toBe(onChainBoost.budget);
    expect(boost.protocolFee).toBe(onChainBoost.protocolFee);
    expect(boost.referralFee).toBe(onChainBoost.referralFee);
    expect(boost.maxParticipants).toBe(onChainBoost.maxParticipants);
    expect(boost.owner).toBe(onChainBoost.owner);
    expect(boost.incentives.length).toBe(onChainBoost.incentives.length);
  });

  test('can successfully retrieve a Boost with correct component interfaces', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...options,
      address: core,
    });
    const { id } = await client.createBoost({
      budget: new bases.SimpleBudget.Test(options, {
        owner: testAccount.address,
        authorized: [],
      }),
      action: new bases.ContractAction.Test(options, {
        chainId: BigInt(31_337),
        target: core,
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator.Test(options, {
        signers: [testAccount.address],
      }),
      allowList: new bases.SimpleAllowList.Test(options, {
        owner: testAccount.address,
        allowed: [],
      }),
      incentives: [],
    });
    const boost = await client.getBoost(id);
    expect(boost.budget instanceof SimpleBudget).toBe(true);
    expect(boost.action instanceof ContractAction).toBe(true);
    expect(boost.validator instanceof SignerValidator).toBe(true);
    expect(boost.allowList instanceof SimpleAllowList).toBe(true);
  });

  test('can reuse an existing action', async () => {});
});
