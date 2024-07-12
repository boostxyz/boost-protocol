import {
  ERC1155StrategyType,
  StrategyType,
  readErc1155BalanceOf,
} from '@boostxyz/evm';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { parseEther, stringToBytes, stringToHex } from 'viem';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundBudget,
} from '../test/helpers';
import { ContractAction } from './Actions/ContractAction';
import { SimpleAllowList } from './AllowLists/SimpleAllowList';
import { BoostCore } from './BoostCore';
import { SimpleBudget } from './Budgets/SimpleBudget';
import { DeployableTarget } from './Deployable/DeployableTarget';
import { ERC20Incentive } from './Incentives/ERC20Incentive';
import { SignerValidator } from './Validators/SignerValidator';
import { IncentiveNotCloneableError } from './errors';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('BoostCore', () => {
  beforeEach(async () => {
    fixtures = await loadFixture(deployFixtures);
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can successfully create a boost using all base contract implementations', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;
    const boost = await client.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
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
    expect(boost.incentives.at(0)!.address).toBe(onChainBoost.incentives.at(0));
  });

  test('can successfully retrieve a Boost with correct component interfaces', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;
    const _boost = await client.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await client.getBoost(_boost.id);
    expect(boost.protocolFee).toBe(1001n);
    expect(boost.referralFee).toBe(1002n);
    expect(boost.maxParticipants).toBe(100n);
    expect(boost.budget instanceof SimpleBudget).toBe(true);
    expect(boost.action instanceof ContractAction).toBe(true);
    expect(boost.validator instanceof SignerValidator).toBe(true);
    expect(boost.allowList instanceof SimpleAllowList).toBe(true);
    expect(boost.incentives.at(0) instanceof ERC20Incentive).toBe(true);
  });

  test('can reuse an existing action', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;

    // allocate more funds to the budget
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.address!, parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.address!,
      target: defaultOptions.account.address,
    });

    const _boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(
        defaultOptions,
        _boost.action.assertValidAddress(),
        false,
      ),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await client.readBoost(boost.id);
    expect(onChainBoost.action).toBe(_boost.action.assertValidAddress());
  });

  test('can reuse an existing action', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.address!, parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.address!,
      target: defaultOptions.account.address,
    });

    const _boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(
        defaultOptions,
        _boost.action.assertValidAddress(),
        false,
      ),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await client.readBoost(boost.id);
    expect(onChainBoost.action).toBe(_boost.action.assertValidAddress());
  });

  test('can reuse an existing validator', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.address!, parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.address!,
      target: defaultOptions.account.address,
    });

    const _boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(
        defaultOptions,
        _boost.validator.assertValidAddress(),
        false,
      ),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await client.readBoost(boost.id);
    expect(onChainBoost.validator).toBe(_boost.validator.assertValidAddress());
  });

  test('can reuse an existing allowlist', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.address!, parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.address!,
      target: defaultOptions.account.address,
    });

    const _boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(
        defaultOptions,
        _boost.allowList.assertValidAddress(),
        false,
      ),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.address!,
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await client.readBoost(boost.id);
    expect(onChainBoost.allowList).toBe(_boost.allowList.assertValidAddress());
  });

  test('cannot reuse an existing incentive', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.address!, parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.address!,
      target: defaultOptions.account.address,
    });

    const incentive = new bases.ERC20Incentive(defaultOptions, {
      asset: erc20.address!,
      reward: parseEther('1'),
      limit: 100n,
      strategy: StrategyType.POOL,
    });
    const _boost = await client.createBoost({
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [incentive],
    });
    try {
      await client.createBoost({
        budget: budget,
        action: new bases.ContractAction(defaultOptions, {
          chainId: BigInt(31_337),
          target: core.assertValidAddress(),
          selector: '0xdeadbeef',
          value: 0n,
        }),
        validator: new bases.SignerValidator(defaultOptions, {
          signers: [defaultOptions.account.address],
        }),
        allowList: new bases.SimpleAllowList(defaultOptions, {
          owner: defaultOptions.account.address,
          allowed: [defaultOptions.account.address],
        }),
        incentives: [incentive],
      });
    } catch (e) {
      expect(e).toBeInstanceOf(IncentiveNotCloneableError);
    }
  });

  test('can offer multiple incentives', async () => {
    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20, erc1155 } = budgets;

    console.log(
      await readErc1155BalanceOf(defaultOptions.config, {
        address: erc1155.assertValidAddress(),
        args: [budget.assertValidAddress(), 1n],
      }),
    );
    const _boost = await client.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: new bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
      validator: new bases.SignerValidator(defaultOptions, {
        signers: [defaultOptions.account.address],
      }),
      allowList: new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
        new bases.ERC1155Incentive(defaultOptions, {
          asset: erc1155.assertValidAddress(),
          strategy: ERC1155StrategyType.POOL,
          limit: 5n,
          tokenId: 1n,
          extraData: stringToHex(''),
        }),
      ],
    });
  });

  test('can discover available boosts', async () => {});

  test('can participate in a boost', async () => {});
});
