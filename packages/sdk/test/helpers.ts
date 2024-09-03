import {
  readMockErc20BalanceOf,
  readMockErc721BalanceOf,
  readMockErc721MintPrice,
  readMockErc1155BalanceOf,
  writeMockErc1155SetApprovalForAll,
  writePointsInitialize,
} from '@boostxyz/evm';
import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import EventActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import ERC721MintActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import SimpleDenyListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import VestingBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import AllowListIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import CGDAIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import ERC20IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import ERC1155IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import PointsIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import SignerValidatorArtifact from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { deployContract } from '@wagmi/core';
import { type Address, type Hex, parseEther, zeroAddress } from 'viem';
import {
  AllowListIncentive,
  BoostCore,
  type Budget,
  CGDAIncentive,
  ContractAction,
  type CreateBoostPayload,
  ERC20Incentive,
  ERC721MintAction,
  EventAction,
  PointsIncentive,
  SignerValidator,
  SimpleAllowList,
  SimpleBudget,
  SimpleDenyList,
  VestingBudget,
} from '../src';
import { BoostRegistry } from '../src/BoostRegistry';
import { ERC1155Incentive } from '../src/Incentives/ERC1155Incentive';
import { getDeployedContractAddress } from '../src/utils';
import type { DeployableOptions } from './../src/Deployable/Deployable';
import { MockERC20 } from './MockERC20';
import { MockERC721 } from './MockERC721';
import { MockERC1155 } from './MockERC1155';
import { MockPoints } from './MockPoints';
import { accounts } from './accounts';
import { setupConfig, testAccount } from './viem';

export type DeployableTestOptions = Required<DeployableOptions>;

export const defaultOptions: DeployableTestOptions = {
  config: setupConfig(),
  account: testAccount,
};

export type Fixtures = Awaited<ReturnType<typeof deployFixtures>>;
export type BudgetFixtures = {
  budget: SimpleBudget;
  erc20: MockERC20;
  erc1155: MockERC1155;
  points: MockPoints;
};

export async function freshBoost(
  fixtures: Fixtures,
  options: Partial<CreateBoostPayload>,
) {
  const core = new BoostCore({
    ...defaultOptions,
    address: fixtures.core.assertValidAddress(),
  });
  return core.createBoost({
    protocolFee: options.protocolFee || 1n,
    referralFee: options.protocolFee || 2n,
    maxParticipants: options.protocolFee || 100n,
    budget:
      options.budget ||
      (await loadFixture(fundBudget(defaultOptions, fixtures))).budget,
    action:
      options.action ||
      new fixtures.bases.ContractAction(defaultOptions, {
        chainId: BigInt(31_337),
        target: core.assertValidAddress(),
        selector: '0xdeadbeef',
        value: 0n,
      }),
    validator:
      options.validator ||
      new fixtures.bases.SignerValidator(defaultOptions, {
        signers: [
          defaultOptions.account.address,
          accounts.at(0)?.account as Address,
        ],
        validatorCaller: accounts.at(0)?.account as Address,
      }),
    allowList:
      options.allowList ||
      new fixtures.bases.SimpleAllowList(defaultOptions, {
        owner: defaultOptions.account.address,
        allowed: [defaultOptions.account.address],
      }),
    incentives: options.incentives || [],
  });
}

export async function deployFixtures(
  options: DeployableTestOptions = defaultOptions,
) {
  const { config, account } = options;
  const registry = await new BoostRegistry({
    address: null,
    ...options,
  }).deploy();
  const core = await new BoostCore({
    ...options,
    registryAddress: registry.assertValidAddress(),
    protocolFeeReceiver: account.address,
  }).deploy();

  const contractActionBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ContractActionArtifact.abi,
      bytecode: ContractActionArtifact.bytecode as Hex,
      account,
    }),
  );
  const eventActionBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: EventActionArtifact.abi,
      bytecode: EventActionArtifact.bytecode as Hex,
      account,
    }),
  );
  const erc721MintActionBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ERC721MintActionArtifact.abi,
      bytecode: ERC721MintActionArtifact.bytecode as Hex,
      account,
    }),
  );
  const simpleAllowListBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: SimpleAllowListArtifact.abi,
      bytecode: SimpleAllowListArtifact.bytecode as Hex,
      account,
    }),
  );
  const simpleDenyListBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: SimpleDenyListArtifact.abi,
      bytecode: SimpleDenyListArtifact.bytecode as Hex,
      account,
    }),
  );
  const simpleBudgetBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: SimpleBudgetArtifact.abi,
      bytecode: SimpleBudgetArtifact.bytecode as Hex,
      account,
    }),
  );
  const vestingBudgetBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: VestingBudgetArtifact.abi,
      bytecode: VestingBudgetArtifact.bytecode as Hex,
      account,
    }),
  );

  const allowListIncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: AllowListIncentiveArtifact.abi,
      bytecode: AllowListIncentiveArtifact.bytecode as Hex,
      account,
    }),
  );
  const cgdaIncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: CGDAIncentiveArtifact.abi,
      bytecode: CGDAIncentiveArtifact.bytecode as Hex,
      account,
    }),
  );

  const erc20IncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ERC20IncentiveArtifact.abi,
      bytecode: ERC20IncentiveArtifact.bytecode as Hex,
      account,
    }),
  );

  const erc1155IncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ERC1155IncentiveArtifact.abi,
      bytecode: ERC1155IncentiveArtifact.bytecode as Hex,
      account,
    }),
  );

  const pointsIncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: PointsIncentiveArtifact.abi,
      bytecode: PointsIncentiveArtifact.bytecode as Hex,
      account,
    }),
  );

  const signerValidatorBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: SignerValidatorArtifact.abi,
      bytecode: SignerValidatorArtifact.bytecode as Hex,
      account,
    }),
  );

  const bases = {
    ContractAction: class TContractAction extends ContractAction {
      public static override base = contractActionBase;
    },
    EventAction: class TEventAction extends EventAction {
      public static override base = eventActionBase;
    },
    ERC721MintAction: class TERC721MintAction extends ERC721MintAction {
      public static override base = erc721MintActionBase;
    },
    SimpleAllowList: class TSimpleAllowList extends SimpleAllowList {
      public static override base = simpleAllowListBase;
    },
    SimpleDenyList: class TSimpleDenyList extends SimpleDenyList {
      public static override base = simpleDenyListBase;
    },
    SimpleBudget: class TSimpleBudget extends SimpleBudget {
      public static override base = simpleBudgetBase;
    },
    VestingBudget: class TVestingBudget extends VestingBudget {
      public static override base = vestingBudgetBase;
    },
    AllowListIncentive: class TAllowListIncentive extends AllowListIncentive {
      public static override base = allowListIncentiveBase;
    },
    CGDAIncentive: class TCGDAIncentive extends CGDAIncentive {
      public static override base = cgdaIncentiveBase;
    },
    ERC20Incentive: class TERC20Incentive extends ERC20Incentive {
      public static override base = erc20IncentiveBase;
    },
    ERC1155Incentive: class TERC1155Incentive extends ERC1155Incentive {
      public static override base = erc1155IncentiveBase;
    },
    PointsIncentive: class TPointsIncentive extends PointsIncentive {
      public static override base = pointsIncentiveBase;
    },
    SignerValidator: class TSignerValidator extends SignerValidator {
      public static override base = signerValidatorBase;
    },
  };

  for (const [name, deployable] of Object.entries(bases)) {
    console.log(name, deployable.base);
    await registry.register(deployable.registryType, name, deployable.base);
  }

  return {
    registry,
    core,
    bases,
  };
}

export function freshBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
) {
  return async function freshBudget() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.SimpleBudget(options, {
        owner: options.account.address,
        authorized: [
          options.account.address,
          fixtures.core.assertValidAddress(),
        ],
      }),
    );
  };
}

export function freshVestingBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
) {
  return async function freshVestingBudget() {
    return fixtures.registry.clone(
      crypto.randomUUID(),
      new fixtures.bases.VestingBudget(options, {
        owner: options.account.address,
        authorized: [
          options.account.address,
          fixtures.core.assertValidAddress(),
        ],
        start: 0n,
        duration: 10n,
        cliff: 0n,
      }),
    );
  };
}

export async function freshERC20(
  options: DeployableTestOptions = defaultOptions,
) {
  const erc20 = new MockERC20(options, {});
  await erc20.deploy();
  return erc20;
}

export async function freshPoints(
  options: DeployableTestOptions = defaultOptions,
) {
  const points = new MockPoints(options, {});
  await points.deploy();
  await writePointsInitialize(options.config, {
    address: points.assertValidAddress(),
    args: ['Points', 'POI', options.account.address],
    account: options.account,
  });
  return points;
}

export async function freshERC1155(
  options: DeployableTestOptions = defaultOptions,
) {
  const erc1155 = new MockERC1155(options, {});
  await erc1155.deploy();
  return erc1155;
}

export async function freshERC721(
  options: DeployableTestOptions = defaultOptions,
) {
  const erc721 = new MockERC721(options, {});
  await erc721.deploy();
  return erc721;
}

export function fundErc20(
  options: DeployableTestOptions,
  erc20?: MockERC20,
  funded: Address[] = [],
  amount: bigint = parseEther('100'),
) {
  return async function fundErc20() {
    if (!erc20) erc20 = await freshERC20();
    for (const address of [options.account.address, ...(funded ?? [])]) {
      await erc20.mint(address, amount);
      const balance = await readMockErc20BalanceOf(options.config, {
        address: erc20.assertValidAddress(),
        args: [address],
      });
      if (amount !== balance) throw new Error(`Balance did not match`);
    }
    return erc20;
  };
}

export function fundErc721(
  options: DeployableTestOptions,
  erc721?: MockERC721,
  funded: Address[] = [],
) {
  return async function fundErc721() {
    if (!erc721) erc721 = await freshERC721();
    const price = await readMockErc721MintPrice(options.config, {
      address: erc721.assertValidAddress(),
      account: options.account,
    });
    for (const address of [options.account.address, ...(funded ?? [])]) {
      await erc721.mint(address, { value: price });
      const balance = await readMockErc721BalanceOf(options.config, {
        address: erc721.assertValidAddress(),
        args: [address],
      });
      if (balance !== 1n) throw new Error(`Balance did not match`);
    }
    return erc721;
  };
}

export function fundPoints(
  options: DeployableTestOptions,
  points?: MockPoints,
  funded: Address[] = [],
  amount: bigint = parseEther('100'),
) {
  return async function fundPoints() {
    if (!points) points = await freshPoints();
    for (const address of [options.account.address, ...(funded ?? [])]) {
      await points.issue(address, amount);
      const balance = await readMockErc20BalanceOf(options.config, {
        address: points.assertValidAddress(),
        args: [address],
      });
      if (amount !== balance) throw new Error(`Balance did not match`);
    }
    return points;
  };
}

export function fundErc1155(
  options: DeployableTestOptions,
  erc1155?: MockERC1155,
  tokenId = 1n,
  amount = 100n,
) {
  return async function fundErc1155() {
    if (!erc1155) erc1155 = await freshERC1155(options);
    await erc1155.mint(options.account.address, tokenId, amount);
    const balance = await readMockErc1155BalanceOf(options.config, {
      address: erc1155.assertValidAddress(),
      args: [options.account.address, tokenId],
    });
    if (balance !== amount)
      throw new Error(`Balance did not match ${{ balance, amount }}`);
    return erc1155;
  };
}

export function fundBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
  budget?: Budget,
  erc20?: MockERC20,
  erc1155?: MockERC1155,
  points?: MockPoints,
) {
  return async function fundBudget() {
    {
      if (!budget) budget = await loadFixture(freshBudget(options, fixtures));
      if (!erc20) erc20 = await loadFixture(fundErc20(options));
      if (!erc1155) erc1155 = await loadFixture(fundErc1155(options));
      if (!points) points = await loadFixture(fundPoints(options));

      await budget.allocate(
        {
          amount: parseEther('1.0'),
          asset: zeroAddress,
          target: options.account.address,
        },
        { value: parseEther('1.0') },
      );

      await erc20.approve(budget.assertValidAddress(), parseEther('100'));
      await budget.allocate({
        amount: parseEther('100'),
        asset: erc20.assertValidAddress(),
        target: options.account.address,
      });

      await writeMockErc1155SetApprovalForAll(options.config, {
        args: [budget.assertValidAddress(), true],
        address: erc1155.assertValidAddress(),
        account: options.account,
      });
      await budget.allocate({
        tokenId: 1n,
        amount: 100n,
        asset: erc1155.assertValidAddress(),
        target: options.account.address,
      });

      return { budget, erc20, erc1155, points } as BudgetFixtures;
    }
  };
}

export function fundVestingBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
  budget?: Budget,
  erc20?: MockERC20,
  erc1155?: MockERC1155,
  points?: MockPoints,
) {
  return async function fundVestingBudget() {
    {
      if (!budget)
        budget = await loadFixture(freshVestingBudget(options, fixtures));
      if (!erc20) erc20 = await loadFixture(fundErc20(options));
      if (!erc1155) erc1155 = await loadFixture(fundErc1155(options));
      if (!points) points = await loadFixture(fundPoints(options));

      await budget.allocate(
        {
          amount: parseEther('1.0'),
          asset: zeroAddress,
          target: options.account.address,
        },
        { value: parseEther('1.0') },
      );

      await erc20.approve(budget.assertValidAddress(), parseEther('100'));
      await budget.allocate({
        amount: parseEther('100'),
        asset: erc20.assertValidAddress(),
        target: options.account.address,
      });

      return { budget, erc20, erc1155, points } as BudgetFixtures & {
        budget: VestingBudget;
      };
    }
  };
}
