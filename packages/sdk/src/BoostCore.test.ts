import { accounts } from "@boostxyz/test/accounts";
import {
  type BudgetFixtures,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshBoostWithV1Validator,
  freshBoostWithV2Validator,
  fundBudget,
  makeMockEventActionPayload,
  fundErc721,
} from "@boostxyz/test/helpers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { pad, parseEther, zeroAddress } from "viem";
import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ContractAction } from "./Actions/ContractAction";
import { StrategyType } from "./claiming";
import { BoostNotFoundError, IncentiveNotCloneableError } from "./errors";
import type { ERC20Incentive } from "./Incentives/ERC20Incentive";
import { bytes4 } from "./utils";
import { BoostValidatorEOA } from './Validators/Validator';
import { AssetType } from "./transfers";
import { waitForTransactionReceipt } from "@wagmi/core";
import { SignatureType, ValueType } from "./Actions/EventAction";
import { MockERC721 } from "@boostxyz/test/MockERC721";

let fixtures: Fixtures, budgets: BudgetFixtures;

describe("BoostCore", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });
  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test("can get the total number of boosts", async () => {
    const { core } = fixtures;

    const { budget, erc20 } = budgets;
    const payload = {
      protocolFee: 0n,
      maxParticipants: 5n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      validator: core.SignerValidatorV2({
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
          reward: parseEther("1"),
          limit: 5n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    }
    const { hash } = await core.createBoostRaw(payload)
    await waitForTransactionReceipt(defaultOptions.config, { hash })
    await core.createBoost(payload);
    expect(await core.getBoostCount()).toBe(2n);
  });

  test("throws a typed error if no boost exists", async () => {
    const { core } = fixtures;
    try {
      await core.getBoost(1000n);
    } catch (e) {
      expect(e instanceof BoostNotFoundError).toBe(true);
      // @ts-ignore
      expect(e.id).toBe("1000");
    }
  });

  test("can successfully create a boost using all base contract implementations", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const boost = await core.createBoost({
      protocolFee: 0n,
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);

    expect(boost.owner).toBe(onChainBoost.owner);
    expect(boost.protocolFee).toBe(onChainBoost.protocolFee);
    expect(boost.maxParticipants).toBe(onChainBoost.maxParticipants);

    expect(boost.action.address).toBe(onChainBoost.action);
    // just get some type safety here
    if (boost.action instanceof ContractAction === false) return;
    expect(await boost.action.chainId()).toBe(BigInt(31_337));
    expect((await boost.action.target()).toLowerCase()).toBe(
      core.assertValidAddress().toLowerCase(),
    );
    expect(await boost.action.selector()).toBe("0xdeadbeef");
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
    expect(await incentive.currentReward()).toBe(parseEther("1"));
    expect(await incentive.limit()).toBe(100n);
    expect(await incentive.claims()).toBe(0n);
  });

  test("can read the raw on chain representation of a boost", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const _boost = await core.createBoost({
      protocolFee: 0n,
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    const boost = await core.readBoost(_boost.id);
    expect(boost.protocolFee).toBe(1000n);
    expect(boost.maxParticipants).toBe(100n);
    expect(boost.budget).toBe(_boost.budget.assertValidAddress());
    expect(boost.action).toBe(_boost.action.assertValidAddress());
    expect(boost.validator).toBe(_boost.validator.assertValidAddress());
    expect(boost.allowList).toBe(_boost.allowList.assertValidAddress());
    expect(boost.incentives.at(0)).toBe(
      _boost.incentives.at(0)?.assertValidAddress(),
    );
  });

  test("can optionally supply a validator", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const _boost = await core.createBoost({
      protocolFee: 0n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    const boost = await core.readBoost(_boost.id);
    expect(boost.validator).toBe(_boost.validator.assertValidAddress());
  });

  test("can simulate a boost creation", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const simulated = await core.simulateCreateBoost({
      protocolFee: 0n,
      maxParticipants: 100n,
      budget: budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [
        core.ERC20Incentive({
          asset: erc20.assertValidAddress(),
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    expect(simulated.request.__mode).toBe("prepared");
  });

  test("can reuse an existing action", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more funds to the budget
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);
    expect(onChainBoost.action).toBe(_boost.action.assertValidAddress());
  });

  test("can reuse an existing validator", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);
    expect(onChainBoost.validator).toBe(_boost.validator.assertValidAddress());
  });

  test("can reuse an existing allowlist", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });
    const onChainBoost = await core.readBoost(boost.id);
    expect(onChainBoost.allowList).toBe(_boost.allowList.assertValidAddress());
  });

  test("cannot reuse an existing incentive", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // allocate more erc20 funds to the budget from the owning accound
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const incentive = core.ERC20Incentive({
      asset: erc20.assertValidAddress(),
      reward: parseEther("1"),
      limit: 100n,
      strategy: StrategyType.POOL,
      manager: budget.assertValidAddress(),
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

  test("can offer multiple incentives", async () => {
    const { registry, core } = fixtures;
    const { budget, erc20, points, erc1155 } = budgets;
    const allowList = await registry.initialize(
      "SharedAllowList",
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
      manager: budget.assertValidAddress(),
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
      manager: budget.assertValidAddress(),
    });
    const allowListIncentive = core.AllowListIncentive({
      allowList: allowList.assertValidAddress(),
      limit: 5n,
    });
    const pointsIncentive = core.PointsIncentive({
      venue: points.assertValidAddress(),
      selector: bytes4("issue(address,uint256)"),
      reward: 1n,
      limit: 10n,
    });

    await core.createBoost({
      protocolFee: 0n,
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
      await (
        await allowListIncentive.allowList()
      ).isAllowed(defaultOptions.account.address),
    ).toEqual(true);
    expect(await pointsIncentive.reward()).toEqual(1n);
    expect(await pointsIncentive.currentReward()).toEqual(1n);
    expect(await pointsIncentive.limit()).toEqual(10n);
  });

  test("can get  the protocol fee", async () => {
    const { core } = fixtures;

    expect(await core.protocolFee()).toBe(1000n);
  });

  test("can get the protocol fee receiver", async () => {
    const { core } = fixtures;

    expect(await core.protocolFeeReceiver()).toBe(
      defaultOptions.account.address,
    );
  });

  test("can set the protocol fee receiver", async () => {
    const { core } = fixtures;

    await core.setProcolFeeReceiver(zeroAddress);

    expect(await core.protocolFeeReceiver()).toBe(zeroAddress);
  });

  test("binds all actions, budgets, allowlists, incentives, and validators to reuse core options and account", () => {
    const { core } = fixtures;

    // const contractAction = core.ContractAction(zeroAddress);
    // expect(contractAction._config).toEqual(defaultOptions.config);
    // expect(contractAction._account).toEqual(defaultOptions.account);

    // const erc721MintAction = core.ERC721MintAction(zeroAddress);
    // expect(erc721MintAction._config).toEqual(defaultOptions.config);
    // expect(erc721MintAction._account).toEqual(defaultOptions.account);

    const eventAction = core.EventAction(zeroAddress);
    expect(eventAction.config).toEqual(defaultOptions.config);
    expect(eventAction.account).toEqual(defaultOptions.account);

    const allowList = core.SimpleAllowList(zeroAddress);
    expect(allowList.config).toEqual(defaultOptions.config);
    expect(allowList.account).toEqual(defaultOptions.account);

    const denyList = core.SimpleDenyList(zeroAddress);
    expect(denyList.config).toEqual(defaultOptions.config);
    expect(denyList.account).toEqual(defaultOptions.account);

    const managedBudget = core.ManagedBudget(zeroAddress);
    expect(managedBudget.config).toEqual(defaultOptions.config);
    expect(managedBudget.account).toEqual(defaultOptions.account);

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
    expect(allowListIncentive.config).toEqual(defaultOptions.config);
    expect(allowListIncentive.account).toEqual(defaultOptions.account);

    const cgdaIncentive = core.CGDAIncentive({
      asset: zeroAddress,
      initialReward: 0n,
      rewardDecay: 0n,
      rewardBoost: 0n,
      totalBudget: 0n,
      manager: zeroAddress,
    });
    expect(cgdaIncentive.config).toEqual(defaultOptions.config);
    expect(cgdaIncentive.account).toEqual(defaultOptions.account);

    const erc20Incentive = core.ERC20Incentive({
      asset: zeroAddress,
      strategy: 0,
      reward: 0n,
      limit: 0n,
    });
    expect(erc20Incentive.config).toEqual(defaultOptions.config);
    expect(erc20Incentive.account).toEqual(defaultOptions.account);

    const erc20VariableIncentive = core.ERC20VariableIncentive({
      asset: zeroAddress,
      reward: 0n,
      limit: 0n,
      manager: zeroAddress,
    });
    expect(erc20VariableIncentive.config).toEqual(defaultOptions.config);
    expect(erc20VariableIncentive.account).toEqual(defaultOptions.account);

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
      selector: "0x",
      reward: 0n,
      limit: 0n,
    });
    expect(pointsIncentive.config).toEqual(defaultOptions.config);
    expect(pointsIncentive.account).toEqual(defaultOptions.account);

    const signerValidator = core.SignerValidator(zeroAddress);
    expect(signerValidator.config).toEqual(defaultOptions.config);
    expect(signerValidator.account).toEqual(defaultOptions.account);
  });

  test("can subscribe to contract events", async () => {
    const subscription = vi.fn();

    const { core } = fixtures;
    core.subscribe(subscription, { pollingInterval: 100 });
    const { budget, erc20 } = budgets;
    await core.createBoost({
      protocolFee: 0n,
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    // This should be called once for each event
    expect(subscription).toHaveBeenCalledTimes(2);
  });

  test("can set a passthrough auth scheme", async () => {
    const { core } = fixtures;

    const auth = core.PassthroughAuth();
    // @ts-ignore
    await auth.deploy();
    await core.setCreateBoostAuth(auth);
    expect((await core.createBoostAuth()).toLowerCase()).toBe(
      auth.assertValidAddress(),
    );
    expect(await core.isAuthorized(zeroAddress)).toBe(true);
  });

  test("uses the provided validator when one is specified", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;
    const customValidator = core.SignerValidatorV2({
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });

    expect(boost.validator).toBe(customValidator);
    const signers = await boost.validator.signers(budget.assertValidAddress());
    expect(signers).toBe(true);
  });

  test("creates a boost with a default validator when none is provided", async () => {
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
          reward: parseEther("1"),
          limit: 100n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });

    const validator = boost.validator;

    // expect boostCore to be a validatorCaller
    expect(validator.payload?.validatorCaller).toBe(core.assertValidAddress());

    // expect current account to be a signer
    const signer = await validator.signers(BoostValidatorEOA.TESTNET);
    expect(signer).toBeDefined();
    expect(signer).toBe(true);
  });

  test("[v1-validator] can retrieve the BoostClaimed event from a transaction hash", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoostWithV1Validator(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
      referrer,
    });

    const { hash } = await fixtures.core.claimIncentiveRaw(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
    );

    const claimInfo = await fixtures.core.getClaimFromTransaction({ hash });
    expect(claimInfo).toBeDefined();
    expect(claimInfo?.claimant).toBe(claimant);
    expect(typeof claimInfo?.boostId).toBe("bigint");
    expect(claimInfo?.referrer).toBe(zeroAddress);
  });

  test("[v2-validator] can retrieve the BoostClaimed event from a transaction hash", async () => {
    // biome-ignore lint/style/noNonNullAssertion: we know this is defined
    const referrer = accounts.at(1)!.account!,
      // biome-ignore lint/style/noNonNullAssertion: we know this is defined
      trustedSigner = accounts.at(0)!;
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: 1n,
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });
    const boost = await freshBoostWithV2Validator(fixtures, {
      budget: budgets.budget,
      incentives: [erc20Incentive],
    });

    const claimant = trustedSigner.account;
    const incentiveData = pad("0xdef456232173821931823712381232131391321934");
    const claimDataPayload = await boost.validator.encodeClaimData({
      signer: trustedSigner,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
      referrer,
    });

    const { hash } = await fixtures.core.claimIncentiveRaw(
      boost.id,
      0n,
      referrer,
      claimDataPayload,
    );

    const claimInfo = await fixtures.core.getClaimFromTransaction({ hash });
    expect(claimInfo).toBeDefined();
    expect(claimInfo?.claimant).toBe(claimant);
    expect(typeof claimInfo?.boostId).toBe("bigint");
    expect(claimInfo?.referrer).toBe(referrer);
  });

  test("can calculate an incentive's protocol fee ahead of creation time", async () => {
    const erc20Incentive = fixtures.core.ERC20Incentive({
      asset: budgets.erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: parseEther('1'),
      limit: 1n,
      manager: budgets.budget.assertValidAddress(),
    });

    const totalFee = await fixtures.core.calculateProtocolFee(
      await erc20Incentive.getTotalBudget()
    )
    expect(totalFee).toBe(100000000000000000n)
  });

  test("can get incentive fees information", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // Create a new boost
    const boost = await core.createBoost({
      protocolFee: 0n,
      maxParticipants: 10n,
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
          reward: parseEther("1"),
          limit: 10n,
          strategy: StrategyType.POOL,
          manager: budget.assertValidAddress(),
        }),
      ],
    });

    const feesInfo = await core.getIncentiveFeesInfo(boost.id, 0n);

    expect(feesInfo).toBeDefined();
    expect(feesInfo.protocolFee).toBe(1000n);
    expect(feesInfo.protocolFeesRemaining).toBe(parseEther("1"));
    expect(feesInfo.assetType).toBe(AssetType.ERC20);
    expect(feesInfo.asset.toLowerCase()).toBe(erc20.assertValidAddress());
  });

  test("can create a boost with a pegged variable criteria incentive", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // Create a new MockERC721 instance
    const erc721 = await loadFixture(fundErc721(defaultOptions));

    // Create the pegged variable criteria incentive
    const peggedVariableCriteriaIncentive = core.ERC20PeggedVariableCriteriaIncentiveV2({
      asset: erc20.assertValidAddress(),
      peg: erc20.assertValidAddress(), // Using same token as peg for simplicity
      reward: parseEther("1"),
      limit: 100n,
      maxReward: parseEther("2"),
      manager: budget.assertValidAddress(),
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature: pad(bytes4("transferFrom(address,address,uint256)")),
        fieldIndex: 2,
        targetContract: erc721.assertValidAddress(),
        valueType: ValueType.WAD,
      },
    });

    // Create boost with the incentive
    const boost = await core.createBoost({
      protocolFee: 0n,
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
      incentives: [peggedVariableCriteriaIncentive],
    });

    // Get the deployed incentive instance
    const incentive = peggedVariableCriteriaIncentive;

    expect((await incentive.asset()).toLowerCase()).toBe(
      erc20.address?.toLowerCase(),
    );
    expect((await incentive.peg()).toLowerCase()).toBe(
      erc20.address?.toLowerCase(),
    );
    expect(await incentive.currentReward()).toBe(parseEther("1"));
    expect(await incentive.limit()).toBe(100n);
    expect(await incentive.getMaxReward()).toBe(parseEther("2"));

    // Verify criteria
    const criteria = await incentive.getIncentiveCriteria();
    expect(criteria.criteriaType).toBe(SignatureType.FUNC);
    expect(criteria.signature).toBe(pad(bytes4("transferFrom(address,address,uint256)")));
    expect(criteria.fieldIndex).toBe(2);
    expect(criteria.targetContract.toLowerCase()).toBe(
      erc721.address?.toLowerCase(),
    );
    expect(criteria.valueType).toBe(ValueType.WAD);
  });
});

describe("Top-Up Incentives", () => {
  let incentive: ReturnType<typeof fixtures.core.ERC20Incentive>;
  let boostId: bigint;

  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    incentive = core.ERC20Incentive({
      asset: erc20.assertValidAddress(),
      strategy: StrategyType.POOL,
      reward: parseEther("1"),
      limit: 5n,
      manager: budget.assertValidAddress(),
    });
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });


    const createdBoost = await core.createBoost({
      protocolFee: 0n,
      maxParticipants: 5n,
      budget,
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
    boostId = createdBoost.id;
  });

  test("can top up from a budget (pre-fee)", async () => {
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    const netTopup = parseEther("5");

    await core.topupIncentiveFromBudgetPreFee(boostId, 0n, netTopup, budget.assertValidAddress());

    expect(await incentive.limit()).toBe(5n + 5n); // original limit 5 + topup 5
  });

  test("can top up from a budget (post-fee)", async () => {
    const { core } = fixtures;
    const { budget } = budgets;

    const total = parseEther("5.5");
    await core.topupIncentiveFromBudgetPostFee(boostId, 0n, total, budget.assertValidAddress());

    expect(await incentive.limit()).toBe(10n + 5n);
  });

  test("pre-fee and post-fee top-ups lead to the same net top-up", async () => {
    const { core } = fixtures;
    const { budget } = budgets;

    const net = parseEther("2");
    const netPlusFee = parseEther("2.2");

    await core.topupIncentiveFromBudgetPreFee(boostId, 0n, net, budget.assertValidAddress());

    await core.topupIncentiveFromBudgetPostFee(boostId, 0n, netPlusFee, budget.assertValidAddress());

    expect(await incentive.limit()).toBe(15n + 4n);
  });

  test("can top up from sender (pre-fee)", async () => {
    const { core } = fixtures;
    const { erc20 } = budgets;

    const netTopup = parseEther("10");
    const netPlusFee = parseEther("11");
    await erc20.mint(defaultOptions.account.address, netPlusFee);
    await erc20.approve(core.assertValidAddress(), netPlusFee);

    await core.topupIncentiveFromSenderPreFee(boostId, 0n, netTopup);

    expect(await incentive.limit()).toBe(19n + 10n);
  });

  test("can top up from sender (post-fee)", async () => {
    const { core } = fixtures;
    const { erc20 } = budgets;

    const totalWithFee = parseEther("5.5");
    await erc20.mint(defaultOptions.account.address, totalWithFee);
    await erc20.approve(core.assertValidAddress(), totalWithFee);

    await core.topupIncentiveFromSenderPostFee(boostId, 0n, totalWithFee);

    expect(await incentive.limit()).toBe(29n + 5n);
  });

  test("throws if net top-up is zero", async () => {
    const { core } = fixtures;
    const { budget } = budgets;

    await expect(async () => {
      await core.topupIncentiveFromBudgetPreFee(boostId, 0n, 0n, budget.assertValidAddress());
    }).rejects.toThrowError();
  });
});

describe("ERC20PeggedVariableCriteriaIncentive Top-Ups", () => {
  let incentive: ReturnType<typeof fixtures.core.ERC20PeggedVariableCriteriaIncentiveV2>;
  let boostId: bigint;
  let erc721: MockERC721;

  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    // Create a new MockERC721 instance
    erc721 = await loadFixture(fundErc721(defaultOptions));

    incentive = core.ERC20PeggedVariableCriteriaIncentiveV2({
      asset: erc20.assertValidAddress(),
      peg: erc20.assertValidAddress(),
      reward: parseEther("1"),
      limit: 5n,
      maxReward: parseEther("2"),
      manager: budget.assertValidAddress(),
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature: pad(bytes4("transferFrom(address,address,uint256)")),
        fieldIndex: 2,
        targetContract: erc721.assertValidAddress(),
        valueType: ValueType.WAD,
      },
    });

    // Fund the budget
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const createdBoost = await core.createBoost({
      protocolFee: 0n,
      maxParticipants: 5n,
      budget,
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
    boostId = createdBoost.id;
  });

  test("can top up from a budget (pre-fee)", async () => {
    const { core } = fixtures;
    const { budget } = budgets;

    const netTopup = parseEther("5");
    const originalLimit = await incentive.limit();

    await core.topupIncentiveFromBudgetPreFee(
      boostId,
      0n,
      netTopup,
      budget.assertValidAddress()
    );

    const newLimit = await incentive.limit();
    expect(newLimit).toBe(originalLimit + netTopup);
  });

  test("can top up from a budget (post-fee)", async () => {
    const { core } = fixtures;
    const { budget } = budgets;

    const total = parseEther("5.5");
    const originalLimit = await incentive.limit();
    const feeBps = await core.protocolFee();
    const expectedNetTopup = (total * 10000n) / (10000n + feeBps);

    await core.topupIncentiveFromBudgetPostFee(
      boostId,
      0n,
      total,
      budget.assertValidAddress()
    );

    const newLimit = await incentive.limit();
    expect(newLimit).toBe(originalLimit + expectedNetTopup);
  });

  test("can top up from sender (pre-fee)", async () => {
    const { core } = fixtures;
    const { erc20 } = budgets;

    const netTopup = parseEther("5");
    const fee = (netTopup * 1000n) / 10000n; // 10% fee
    const totalRequired = netTopup + fee;
    const originalLimit = await incentive.limit();

    await erc20.mint(defaultOptions.account.address, totalRequired);
    await erc20.approve(core.assertValidAddress(), totalRequired);

    await core.topupIncentiveFromSenderPreFee(boostId, 0n, netTopup);

    const newLimit = await incentive.limit();
    expect(newLimit).toBe(originalLimit + netTopup);
  });

  test("can top up from sender (post-fee)", async () => {
    const { core } = fixtures;
    const { erc20 } = budgets;

    const totalWithFee = parseEther("5.5");
    const originalLimit = await incentive.limit();
    const feeBps = await core.protocolFee();
    const expectedNetTopup = (totalWithFee * 10000n) / (10000n + feeBps);

    await erc20.mint(defaultOptions.account.address, totalWithFee);
    await erc20.approve(core.assertValidAddress(), totalWithFee);

    await core.topupIncentiveFromSenderPostFee(boostId, 0n, totalWithFee);

    const newLimit = await incentive.limit();
    expect(newLimit).toBe(originalLimit + expectedNetTopup);
  });
});

describe("ERC20PeggedVariableCriteriaIncentive with LimitedSignerValidatorV2", () => {
  beforeAll(async () => {
    fixtures = await loadFixture(deployFixtures(defaultOptions));
  });
  beforeEach(async () => {
    budgets = await loadFixture(fundBudget(defaultOptions, fixtures));
  });

  test("enforces validator claim limit", async () => {
    const referrer = accounts[1].account!;
    const signer = accounts[0];
    const { core } = fixtures;
    const { budget, erc20 } = budgets;

    const erc721 = await loadFixture(fundErc721(defaultOptions));
    const incentive = core.ERC20PeggedVariableCriteriaIncentiveV2({
      asset: erc20.assertValidAddress(),
      peg: erc20.assertValidAddress(),
      reward: parseEther("1"),
      limit: parseEther("10"),
      maxReward: parseEther("2"),
      manager: budget.assertValidAddress(),
      criteria: {
        criteriaType: SignatureType.FUNC,
        signature: pad(bytes4("transferFrom(address,address,uint256)")),
        fieldIndex: 2,
        targetContract: erc721.assertValidAddress(),
        valueType: ValueType.WAD,
      },
    });
    await erc20.mint(defaultOptions.account.address, parseEther("110"));
    await erc20.approve(budget.assertValidAddress(), parseEther("110"));
    await budget.allocate({
      amount: parseEther("110"),
      asset: erc20.assertValidAddress(),
      target: defaultOptions.account.address,
    });

    const boost = await core.createBoost({
      protocolFee: 0n,
      maxParticipants: 5n,
      budget,
      action: core.EventAction(
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
      allowList: core.SimpleAllowList({
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
      incentives: [incentive],
    });

    const claimant = defaultOptions.account.address;
    const signedAmount = parseEther("1");
    const incentiveData = incentive.buildClaimData(signedAmount);

    // First claim
    const firstClaimPayload = await boost.validator.encodeClaimData({
      signer: signer,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
      referrer,
    });

    // First claim should succeed
    await core.claimIncentive(boost.id, 0n, referrer, firstClaimPayload);

    // Generate new signature for second claim
    const secondClaimPayload = await boost.validator.encodeClaimData({
      signer: signer,
      incentiveData,
      chainId: defaultOptions.config.chains[0].id,
      incentiveQuantity: boost.incentives.length,
      claimant,
      boostId: boost.id,
      referrer,
    });

    // Second claim should fail due to validator limit (specific error code)
    await expect(
      core.claimIncentive(boost.id, 0n, referrer, secondClaimPayload)
    ).rejects.toThrow("0x059b7045"); // BoostError.MaximumClaimed
  });
});
