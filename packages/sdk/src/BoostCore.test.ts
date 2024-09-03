import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { parseEther, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundBudget,
} from '../test/helpers';
import { ContractAction } from './Actions/ContractAction';
import { PassthroughAuth } from './Auth/PassthroughAuth';
import { BoostCore } from './BoostCore';
import type { ERC20Incentive } from './Incentives/ERC20Incentive';
import { IncentiveNotCloneableError } from './errors';
import { ERC1155StrategyType, StrategyType, bytes4 } from './utils';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('BoostCore', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures);
  });
  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can get the total number of boosts', async () => {
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
    await client.createBoost({
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
        validatorCaller: defaultOptions.account.address,
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
      ],
    });
    expect(await client.getBoostCount()).toBe(1n);
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
        validatorCaller: defaultOptions.account.address,
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
      ],
    });
    const onChainBoost = await client.readBoost(boost.id);

    expect(boost.owner).toBe(onChainBoost.owner);
    expect(boost.protocolFee).toBe(onChainBoost.protocolFee);
    expect(boost.referralFee).toBe(onChainBoost.referralFee);
    expect(boost.maxParticipants).toBe(onChainBoost.maxParticipants);

    expect(boost.action.address).toBe(onChainBoost.action);
    // just get some type safety here
    if (boost.action instanceof ContractAction === false) return;
    expect(await boost.action.chainId()).toBe(BigInt(31_337));
    expect((await boost.action.target()).toLowerCase()).toBe(
      core.assertValidAddress().toLowerCase(),
    );
    expect(await boost.action.selector()).toBe('0xdeadbeef');
    expect(await boost.action.value()).toBe(0n);

    expect(boost.validator.address?.toLowerCase()).toBe(
      onChainBoost.validator.toLowerCase(),
    );
    expect(await boost.validator.signers(defaultOptions.account.address)).toBe(
      true,
    );

    expect(boost.allowList.address?.toLowerCase()).toBe(
      onChainBoost.allowList.toLowerCase(),
    );
    expect(
      await boost.allowList.isAllowed(defaultOptions.account.address),
    ).toBe(true);
    expect(await boost.allowList.isAllowed(zeroAddress)).toBe(false);

    expect(boost.budget.address?.toLowerCase()).toBe(
      onChainBoost.budget.toLowerCase(),
    );
    expect(
      await boost.budget.isAuthorized(defaultOptions.account.address),
    ).toBe(true);

    expect(boost.incentives.length).toBe(onChainBoost.incentives.length);
    const incentive = boost.incentives.at(0) as ERC20Incentive;
    expect(incentive.address?.toLowerCase()).toBe(
      onChainBoost.incentives.at(0)?.toLowerCase(),
    );
    expect((await incentive.asset()).toLowerCase()).toBe(
      erc20.address?.toLowerCase(),
    );
    expect(await incentive.currentReward()).toBe(parseEther('1'));
    expect(await incentive.limit()).toBe(100n);
    expect(await incentive.claims()).toBe(0n);
  });

  test('can read the raw on chain representation of a boost', async () => {
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
        validatorCaller: defaultOptions.account.address,
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
      ],
    });
    const boost = await client.readBoost(_boost.id);
    expect(boost.protocolFee).toBe(1001n);
    expect(boost.referralFee).toBe(1002n);
    expect(boost.maxParticipants).toBe(100n);
    expect(boost.budget).toBe(_boost.budget.assertValidAddress());
    expect(boost.action).toBe(_boost.action.assertValidAddress());
    expect(boost.validator).toBe(_boost.validator.assertValidAddress());
    expect(boost.allowList).toBe(_boost.allowList.assertValidAddress());
    expect(boost.incentives.at(0)).toBe(
      _boost.incentives.at(0)?.assertValidAddress(),
    );
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
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
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
        validatorCaller: defaultOptions.account.address,
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
        validatorCaller: defaultOptions.account.address,
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
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
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
        validatorCaller: defaultOptions.account.address,
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
          asset: erc20.assertValidAddress(),
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
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
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
        validatorCaller: defaultOptions.account.address,
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
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: new bases.SimpleAllowList(
        defaultOptions,
        _boost.allowList.assertValidAddress(),
        false,
      ),
      incentives: [
        new bases.ERC20Incentive(defaultOptions, {
          asset: erc20.assertValidAddress(),
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
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const incentive = new bases.ERC20Incentive(defaultOptions, {
      asset: erc20.assertValidAddress(),
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
        validatorCaller: defaultOptions.account.address,
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
          validatorCaller: defaultOptions.account.address,
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
    const { registry, core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20, points, erc1155 } = budgets;
    const allowList = await registry.clone(
      'SharedAllowList',
      new bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
    );

    const erc20Incentive = new bases.ERC20Incentive(defaultOptions, {
      asset: erc20.assertValidAddress(),
      reward: 1n,
      limit: 10n,
      strategy: StrategyType.POOL,
    });
    const erc1155Incentive = new bases.ERC1155Incentive(defaultOptions, {
      asset: erc1155.assertValidAddress(),
      strategy: ERC1155StrategyType.POOL,
      limit: 1n,
      tokenId: 1n,
      extraData: '0x',
    });
    const cgdaIncentive = new bases.CGDAIncentive(defaultOptions, {
      asset: erc20.assertValidAddress(),
      initialReward: 1n,
      totalBudget: 10n,
      rewardBoost: 1n,
      rewardDecay: 1n,
    });
    const allowListIncentive = new bases.AllowListIncentive(defaultOptions, {
      allowList: allowList.assertValidAddress(),
      limit: 5n,
    });
    const pointsIncentive = new bases.PointsIncentive(defaultOptions, {
      venue: points.assertValidAddress(),
      selector: bytes4('issue(address,uint256)'),
      reward: 1n,
      limit: 10n,
    });

    await client.createBoost({
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
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: new bases.SimpleAllowList(
        defaultOptions,
        allowList.assertValidAddress(),
        false,
      ),
      incentives: [
        erc1155Incentive,
        erc20Incentive,
        cgdaIncentive,
        allowListIncentive,
        pointsIncentive,
      ],
    });
    expect(await erc20Incentive.reward()).toEqual(1n);
    expect(await erc20Incentive.limit()).toEqual(10n);
    expect((await cgdaIncentive.asset()).toLowerCase()).toEqual(
      erc20.address?.toLowerCase(),
    );
    expect(await cgdaIncentive.currentReward()).toEqual(1n);
    expect(
      await (await allowListIncentive.allowList()).isAllowed(
        defaultOptions.account.address,
      ),
    ).toEqual(true);
    expect(await pointsIncentive.reward()).toEqual(1n);
    expect(await pointsIncentive.currentReward()).toEqual(1n);
    expect(await pointsIncentive.limit()).toEqual(10n);
  });

  test('can get  the protocol fee', async () => {
    const { core } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    expect(await client.protocolFee()).toBe(1000n);
  });

  test('can get the protocol fee receiver', async () => {
    const { core } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    expect(await client.protocolFeeReceiver()).toBe(
      defaultOptions.account.address,
    );
  });

  test('can set the protocol fee receiver', async () => {
    const { core } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    await client.setProcolFeeReceiver(zeroAddress);

    expect(await client.protocolFeeReceiver()).toBe(zeroAddress);
  });

  test('can get the claim fee', async () => {
    const { core } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    expect(await client.claimFee()).toBe(75000000000000n);
  });

  test('can set the claim fee', async () => {
    const { core } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    await client.setClaimFee(100n);

    expect(await client.claimFee()).toBe(100n);
  });

  test('binds all actions, budgets, allowlists, incentives, and validators to reuse core options and account', async () => {
    const { core } = fixtures;

    const contractAction = core.ContractAction(zeroAddress);
    expect(contractAction._config).toEqual(defaultOptions.config);
    expect(contractAction._account).toEqual(defaultOptions.account);

    const erc721MintAction = core.ERC721MintAction(zeroAddress);
    expect(erc721MintAction._config).toEqual(defaultOptions.config);
    expect(erc721MintAction._account).toEqual(defaultOptions.account);

    const allowList = core.SimpleAllowList(zeroAddress);
    expect(allowList._config).toEqual(defaultOptions.config);
    expect(allowList._account).toEqual(defaultOptions.account);

    const denyList = core.SimpleDenyList(zeroAddress);
    expect(denyList._config).toEqual(defaultOptions.config);
    expect(denyList._account).toEqual(defaultOptions.account);

    const simpleBudget = core.SimpleBudget(zeroAddress);
    expect(simpleBudget._config).toEqual(defaultOptions.config);
    expect(simpleBudget._account).toEqual(defaultOptions.account);

    const vestingBudget = core.VestingBudget(zeroAddress);
    expect(vestingBudget._config).toEqual(defaultOptions.config);
    expect(vestingBudget._account).toEqual(defaultOptions.account);

    const allowListIncentive = core.AllowListIncentive({
      allowList: zeroAddress,
      limit: 0n,
    });
    expect(allowListIncentive._config).toEqual(defaultOptions.config);
    expect(allowListIncentive._account).toEqual(defaultOptions.account);

    const cgdaIncentive = core.CGDAIncentive({
      asset: zeroAddress,
      initialReward: 0n,
      rewardDecay: 0n,
      rewardBoost: 0n,
      totalBudget: 0n,
    });
    expect(cgdaIncentive._config).toEqual(defaultOptions.config);
    expect(cgdaIncentive._account).toEqual(defaultOptions.account);

    const erc20Incentive = core.ERC20Incentive({
      asset: zeroAddress,
      strategy: 0,
      reward: 0n,
      limit: 0n,
    });
    expect(erc20Incentive._config).toEqual(defaultOptions.config);
    expect(erc20Incentive._account).toEqual(defaultOptions.account);

    const erc1155Incentive = core.ERC1155Incentive({
      asset: zeroAddress,
      strategy: 0,
      tokenId: 1n,
      limit: 0n,
      extraData: '0x',
    });
    expect(erc1155Incentive._config).toEqual(defaultOptions.config);
    expect(erc1155Incentive._account).toEqual(defaultOptions.account);

    const pointsIncentive = core.PointsIncentive({
      venue: zeroAddress,
      selector: '0x',
      reward: 0n,
      limit: 0n,
    });
    expect(pointsIncentive._config).toEqual(defaultOptions.config);
    expect(pointsIncentive._account).toEqual(defaultOptions.account);

    const signerValidator = core.SignerValidator(zeroAddress);
    expect(signerValidator._config).toEqual(defaultOptions.config);
    expect(signerValidator._account).toEqual(defaultOptions.account);
  });

  test('can subscribe to contract events', async () => {
    const subscription = vi.fn();

    const { core, bases } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });
    client.subscribe(subscription, { pollingInterval: 100 });

    // to whom it may concern, this syntax is only used because we need to use test classes
    // that are preconfigured with the dynamic base addresses generated at test time.
    // normally you would use the follow api for brevity
    // budget: client.SimpleBudget({} | '0xaddress')
    const { budget, erc20 } = budgets;
    await client.createBoost({
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
        validatorCaller: defaultOptions.account.address,
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
      ],
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    expect(subscription).toHaveBeenCalledTimes(1);
  });

  test('can set a passthrough auth sceme', async () => {
    const { core } = fixtures;
    const client = new BoostCore({
      ...defaultOptions,
      address: core.assertValidAddress(),
    });

    const auth = client.PassthroughAuth();
    await auth.deploy();
    await client.setCreateBoostAuth(auth);
    expect((await client.createBoostAuth()).toLowerCase()).toBe(
      auth.assertValidAddress(),
    );
    expect(await client.isAuthorized(zeroAddress)).toBe(true);
  });
});
