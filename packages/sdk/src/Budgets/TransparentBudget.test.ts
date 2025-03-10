import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { isAddress, parseEther } from "viem";
import { beforeAll, describe, expect, test } from "vitest";
import type { MockERC20 } from "@boostxyz/test/MockERC20";
import type { MockERC1155 } from "@boostxyz/test/MockERC1155";
import {
  type Fixtures,
  defaultOptions,
  deployFixtures,
  fundTransparentBudget,
  makeMockEventActionPayload
} from "@boostxyz/test/helpers";
import { TransparentBudget } from "./TransparentBudget";
import { StrategyType } from "../claiming";

let fixtures: Fixtures,
  budget: TransparentBudget,
  erc20: MockERC20,
  erc1155: MockERC1155;

beforeAll(async () => {
  fixtures = await loadFixture(deployFixtures(defaultOptions));
});

describe("TransparentBudget", () => {
  test("can successfully be deployed", async () => {
    const budget = new TransparentBudget(defaultOptions);
    //@ts-expect-error internal but need to testing
    await budget.deploy();
    expect(isAddress(budget.assertValidAddress())).toBe(true);
  });

  test('can deploy a basic boost', async () => {
    const { core } = fixtures
    const { budget, erc20 } = await loadFixture(
      fundTransparentBudget(defaultOptions, fixtures),
    );
    const boost = await fixtures.core.createBoostWithTransparentBudget(budget,
      [
        {
          target: defaultOptions.account.address,
          asset: erc20.assertValidAddress(),
          amount: parseEther("1")
        }
      ],
      {
        owner: defaultOptions.account.address,
        protocolFee: 0n,
        maxParticipants: 5n,
        validator: core.SignerValidator({
          signers: [defaultOptions.account.address],
          validatorCaller: defaultOptions.account.address,
        }),
        action: core.EventAction(
          makeMockEventActionPayload(
            core.assertValidAddress(),
            erc20.assertValidAddress(),
          ),
        ),
        incentives: [
          core.ERC20Incentive({
            asset: erc20.assertValidAddress(),
            reward: parseEther("0.1"),
            limit: 5n,
            strategy: StrategyType.POOL,
            manager: budget.assertValidAddress(),
          }),
        ],
      })
  })

  // describe("can disburse", () => {
  //   beforeEach(async () => {
  //     const budgetFixtures = await loadFixture(
  //       fundTransparentBudget(defaultOptions, fixtures),
  //     );
  //     budget = budgetFixtures.budget as TransparentBudget;
  //     erc20 = budgetFixtures.erc20;
  //     erc1155 = budgetFixtures.erc1155;
  //   });

  //   test("native assets", async () => {
  //     await budget.disburse({
  //       amount: parseEther("1.0"),
  //       asset: zeroAddress,
  //       target: defaultOptions.account.address,
  //     });

  //     expect(await budget.distributed()).toBe(parseEther("1.0"));
  //   });

  //   test("erc20 assets", async () => {
  //     await budget.disburse({
  //       amount: parseEther("10"),
  //       asset: erc20.assertValidAddress(),
  //       target: defaultOptions.account.address,
  //     });

  //     expect(await budget.distributed(erc20.assertValidAddress())).toBe(
  //       parseEther("100"),
  //     );
  //   });

  //   test("erc1155 assets", async () => {
  //     await budget.disburse({
  //       tokenId: 1n,
  //       amount: 5n,
  //       asset: erc1155.assertValidAddress(),
  //       target: defaultOptions.account.address,
  //     });

  //     expect(await budget.distributed(erc1155.assertValidAddress(), 1n)).to.equal(
  //       5n,
  //     );
  //   });
  // });
});
