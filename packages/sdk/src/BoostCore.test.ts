import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { pad, parseEther, zeroAddress } from 'viem';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoost,
  fundBudget,
  makeMockEventActionPayload,
} from '@boostxyz/test/helpers';
import { ContractAction } from './Actions/ContractAction';
import type { ERC20Incentive } from './Incentives/ERC20Incentive';
import { StrategyType } from './claiming';
import { IncentiveNotCloneableError } from './errors';
import { bytes4 } from './utils';
import { BOOST_CORE_CLAIM_FEE } from './BoostCore';
import { accounts } from '@boostxyz/test/accounts';

let fixtures: Fixtures, budgets: BudgetFixtures;

describe('BoostCore', () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });
  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test('can get the total number of boosts', async () => {
    const { core } = fixtures;

    const { budget, erc20 } = budgets;
    await core.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    expect(await core.getBoostCount()).toBe(1n);
  });

  test('can successfully create a boost using all base contract implementations', async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const boost = await core.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);

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
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const _boost = await core.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await core.readBoost(_boost.id);
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
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more funds to the budget
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const _boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(_boost.action.assertValidAddress(), false),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);
    expect(onChainBoost.action).toBe(_boost.action.assertValidAddress());
  });

  test('can reuse an existing validator', async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const _boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator(
        _boost.validator.assertValidAddress(),
        false,
      ),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);
    expect(onChainBoost.validator).toBe(_boost.validator.assertValidAddress());
  });

  test('can reuse an existing allowlist', async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const _boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList(
        _boost.allowList.assertValidAddress(),
        false,
      ),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);
    expect(onChainBoost.allowList).toBe(_boost.allowList.assertValidAddress());
  });

  test('cannot reuse an existing incentive', async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther('100'));
    await erc20.approve(budget.assertValidAddress(), parseEther('100'));
    await budget.allocate({
      amount: parseEther('100'),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const incentive = core.ERC20Incentive({
      asset: erc20.assertValidAddress(),
      reward: parseEther('1'),
      limit: 100n,
      strategy: StrategyType.POOL,
    });
    const _boost = await core.createBoost({
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [incentive],
    });
    try {
      await core.createBoost({
        budget: budget,
        action: core.EventAction(
          makeMockEventActionPayload(
            core.assertValidAddress(),
            erc20.assertValidAddress(),
          ),
        ),
        validator: core.SignerValidator({
          signers: [defaultOptions.account.address],
          validatorCaller: defaultOptions.account.address,
        }),
        allowList: core.SimpleAllowList({
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
    const { registry, core } = fixtures;
    const { budget, erc20, points, erc1155 } = budgets;
    const allowList = await registry.initialize(
      'SharedAllowList',
      core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
    );

    const erc20Incentive = core.ERC20Incentive({
      asset: erc20.assertValidAddress(),
      reward: 1n,
      limit: 10n,
      strategy: StrategyType.POOL,
    });
    // const erc1155Incentive = core.ERC1155Incentive({
    //   asset: erc1155.assertValidAddress(),
    //   strategy: ERC1155StrategyType.POOL,
    //   limit: 1n,
    //   tokenId: 1n,
    //   extraData: '0x',
    // });
    const cgdaIncentive = core.CGDAIncentive({
      asset: erc20.assertValidAddress(),
      initialReward: 1n,
      totalBudget: 10n,
      rewardBoost: 1n,
      rewardDecay: 1n,
    });
    const allowListIncentive = core.AllowListIncentive({
      allowList: allowList.assertValidAddress(),
      limit: 5n,
    });
    const pointsIncentive = core.PointsIncentive({
      venue: points.assertValidAddress(),
      selector: bytes4('issue(address,uint256)'),
      reward: 1n,
      limit: 10n,
    });

    await core.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList(allowList.assertValidAddress()),
      incentives: [
        // erc1155Incentive,
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

    expect(await core.protocolFee()).toBe(1000n);
  });

  test('can get the protocol fee receiver', async () => {
    const { core } = fixtures;

    expect(await core.protocolFeeReceiver()).toBe(
      defaultOptions.account.address,
    );
  });

  test('can set the protocol fee receiver', async () => {
    const { core } = fixtures;

    await core.setProcolFeeReceiver(zeroAddress);

    expect(await core.protocolFeeReceiver()).toBe(zeroAddress);
  });

  test('can get the claim fee', async () => {
    const { core } = fixtures;

    expect(await core.claimFee()).toBe(75000000000000n);
  });

  test('can set the claim fee', async () => {
    const { core } = fixtures;

    await core.setClaimFee(100n);

    expect(await core.claimFee()).toBe(100n);
  });

  test('binds all actions, budgets, allowlists, incentives, and validators to reuse core options and account', () => {
    const { core } = fixtures;

    // const contractAction = core.ContractAction(zeroAddress);
    // expect(contractAction._config).toEqual(defaultOptions.config);
    // expect(contractAction._account).toEqual(defaultOptions.account);

    // const erc721MintAction = core.ERC721MintAction(zeroAddress);
    // expect(erc721MintAction._config).toEqual(defaultOptions.config);
    // expect(erc721MintAction._account).toEqual(defaultOptions.account);

    const eventAction = core.EventAction(zeroAddress);
    expect(eventAction._config).toEqual(defaultOptions.config);
    expect(eventAction._account).toEqual(defaultOptions.account);

    const allowList = core.SimpleAllowList(zeroAddress);
    expect(allowList._config).toEqual(defaultOptions.config);
    expect(allowList._account).toEqual(defaultOptions.account);

    const denyList = core.SimpleDenyList(zeroAddress);
    expect(denyList._config).toEqual(defaultOptions.config);
    expect(denyList._account).toEqual(defaultOptions.account);

    const managedBudget = core.ManagedBudget(zeroAddress);
    expect(managedBudget._config).toEqual(defaultOptions.config);
    expect(managedBudget._account).toEqual(defaultOptions.account);

    // const simpleBudget = core.SimpleBudget(zeroAddress);
    // expect(simpleBudget._config).toEqual(defaultOptions.config);
    // expect(simpleBudget._account).toEqual(defaultOptions.account);

    // const vestingBudget = core.VestingBudget(zeroAddress);
    // expect(vestingBudget._config).toEqual(defaultOptions.config);
    // expect(vestingBudget._account).toEqual(defaultOptions.account);

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

    const erc20VariableIncentive = core.ERC20VariableIncentive({
      asset: zeroAddress,
      reward: 0n,
      limit: 0n,
    });
    expect(erc20VariableIncentive._config).toEqual(defaultOptions.config);
    expect(erc20VariableIncentive._account).toEqual(defaultOptions.account);

    // const erc1155Incentive = core.ERC1155Incentive({
    //   asset: zeroAddress,
    //   strategy: 0,
    //   tokenId: 1n,
    //   limit: 0n,
    //   extraData: '0x',
    // });
    // expect(erc1155Incentive._config).toEqual(defaultOptions.config);
    // expect(erc1155Incentive._account).toEqual(defaultOptions.account);

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

    const { core } = fixtures;
    core.subscribe(subscription, { pollingInterval: 100 });
    const { budget, erc20 } = budgets;
    await core.createBoost({
      protocolFee: 1n,
      referralFee: 2n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidator({
        signers: [defaultOptions.account.address],
        validatorCaller: defaultOptions.account.address,
      }),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
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

  test('can set a passthrough auth scheme', async () => {
    const { core } = fixtures;

    const auth = core.PassthroughAuth();
    await auth.deploy();
    await core.setCreateBoostAuth(auth);
    expect((await core.createBoostAuth()).toLowerCase()).toBe(
      auth.assertValidAddress(),
    );
    expect(await core.isAuthorized(zeroAddress)).toBe(true);
  });

  test('uses the provided validator when one is specified', async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const customValidator = core.SignerValidator({
      signers: [budget.assertValidAddress()],
      validatorCaller: core.assertValidAddress(),
    });
    const boost = await core.createBoost({
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: customValidator,
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });

    expect(boost.validator).toBe(customValidator);
    const signers = await boost.validator.signers(budget.assertValidAddress());
    expect(signers).toBe(true);
  });

  test('creates a boost with a default validator when none is provided', async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const boost = await core.createBoost({
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      allowList: core.OpenAllowList(),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther('1'),
          limit: 100n,
          strategy: StrategyType.POOL,
        }),
      ],
    });

    const validator = boost.validator;

    // expect boostCore to be a validatorCaller
    expect(validator.payload?.validatorCaller).toBe(core.assertValidAddress());

    // expect current account to be a signer
    const signer = await validator.signers(defaultOptions.account.address);
    expect(signer).toBeDefined();
    expect(signer).toBe(true);
  });

  test('can retrieve the BoostClaimed event from a transaction hash', async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
    });
    const boost = await freshBoost(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad('0xdef456232173821931823712381232131391321934');
    const incentiveQuantity = 1;
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity,
      claimant,
      boostId: boost.id,
    });

    const {hash} = await fixtures.core.claimIncentiveRaw(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
      { value: BOOST_CORE_CLAIM_FEE },
    );

    const claimInfo = await fixtures.core.getClaimFromTransaction({ hash })
    expect(claimInfo).toBeDefined()
    expect(claimInfo?.claimant).toBe(claimant)
    expect(typeof claimInfo?.boostId).toBe('bigint')
    expect(claimInfo?.referrer).toBe(referrer)
  });
});
