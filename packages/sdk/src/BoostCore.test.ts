import {
  StrategyType,
  readBoostCoreOwner,
  readErc20IncentiveOwner,
  readSimpleBudgetIsAuthorized,
} from '@boostxyz/evm';
import { parseEther } from 'viem';
import { beforeAll, describe, expect, test } from 'vitest';
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshERC20,
  fundBudget,
} from '../test/helpers';
import { testAccount } from '../test/viem';
import { ContractAction } from './Actions/ContractAction';
import { SimpleAllowList } from './AllowLists/SimpleAllowList';
import { BoostCore } from './BoostCore';
import { SimpleBudget } from './Budgets/SimpleBudget';
import { SignerValidator } from './Validators/SignerValidator';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await deployFixtures();
});

describe('BoostCore', () => {
  test('can successfully create a boost using all base contract implementations', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core,
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = await fundBudget(defaultOptions, fixtures);
    const boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction.Test(defaultOptions, {
        chainId: BigInt(31_337),
        target: core,
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator.Test(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList.Test(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive.Test(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
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
    expect(boost.incentives.at(0)).toBe(onChainBoost.incentives.at(0));
  });

  test.skip('can successfully retrieve a Boost with correct component interfaces', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core,
    });
    const { id } = await client.createBoost({
      budget: new bases.SimpleBudget.Test(defaultOptions, {
        owner: testAccount.address,
        authorized: [testAccount.address],
      }),
      action: new bases.ContractAction.Test(defaultOptions, {
        chainId: BigInt(31_337),
        target: core,
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator.Test(defaultOptions, {
        signers: [testAccount.address],
      }),
      allowList: new bases.SimpleAllowList.Test(defaultOptions, {
        owner: testAccount.address,
        allowed: [testAccount.address],
      }),
      incentives: [
        new bases.ERC20Incentive.Test(defaultOptions, {
          asset: (await freshERC20()).address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await client.getBoost(id);
    expect(boost.budget instanceof SimpleBudget).toBe(true);
    expect(boost.action instanceof ContractAction).toBe(true);
    expect(boost.validator instanceof SignerValidator).toBe(true);
    expect(boost.allowList instanceof SimpleAllowList).toBe(true);
  });

  // test('can reuse an existing action', async () => {

  // });
});
