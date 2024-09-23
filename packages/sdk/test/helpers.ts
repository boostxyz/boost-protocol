import {
  readMockErc20BalanceOf,
  readMockErc721BalanceOf,
  readMockErc721MintPrice,
  readMockErc1155BalanceOf,
  writeMockErc1155SetApprovalForAll,
  writePointsInitialize,
} from '@boostxyz/evm';
import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import ERC721MintActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import EventActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/EventAction.sol/EventAction.json';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import SimpleDenyListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import ManagedBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/ManagedBudget.sol/ManagedBudget.json';
import SimpleBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import VestingBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import AllowListIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import CGDAIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import ERC20IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import ERC20VariableIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20VariableIncentive.sol/ERC20VariableIncentive.json';
import ERC1155IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import PointsIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import SignerValidatorArtifact from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { deployContract, simulateContract, writeContract } from '@wagmi/core';
import { type Address, type Hex, parseEther, zeroAddress } from 'viem';
import {
  type ActionStep,
  AllowListIncentive,
  type AllowListIncentivePayload,
  BoostCore,
  type Budget,
  CGDAIncentive,
  type CGDAIncentivePayload,
  type CreateBoostPayload,
  ERC20Incentive,
  type ERC20IncentivePayload,
  ERC20VariableIncentive,
  EventAction,
  type EventActionPayload,
  FilterType,
  ManagedBudget,
  OpenAllowList,
  PointsIncentive,
  type PointsIncentivePayload,
  PrimitiveType,
  SignatureType,
  SignerValidator,
  type SignerValidatorPayload,
  SimpleAllowList,
  type SimpleAllowListPayload,
  SimpleDenyList,
  type SimpleDenyListPayload,
} from '../src';
import {
  ContractAction,
  type ContractActionPayload,
} from '../src/Actions/ContractAction';
import {
  ERC721MintAction,
  type ERC721MintActionPayload,
} from '../src/Actions/ERC721MintAction';
import { BoostRegistry } from '../src/BoostRegistry';
import {
  type ManagedBudgetPayload,
  ManagedBudgetRoles,
} from '../src/Budgets/ManagedBudget';
import {
  VestingBudget,
  type VestingBudgetPayload,
} from '../src/Budgets/VestingBudget';
import type { ERC20VariableIncentivePayload } from '../src/Incentives/ERC20VariableIncentive';
import {
  ERC1155Incentive,
  type ERC1155IncentivePayload,
} from '../src/Incentives/ERC1155Incentive';
import { getDeployedContractAddress } from '../src/utils';
import {
  SimpleBudget,
  type SimpleBudgetPayload,
} from './../src/Budgets/SimpleBudget';
import type {
  DeployableOptions,
  DeployablePayloadOrAddress,
} from './../src/Deployable/Deployable';
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
export type StringEmitterFixtures = Awaited<
  ReturnType<typeof deployStringEmitterMock>
>;
export type BudgetFixtures = {
  budget: ManagedBudget;
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
  const { budget, erc20 } = await loadFixture(
    fundBudget(defaultOptions, fixtures),
  );
  return core.createBoost({
    protocolFee: options.protocolFee || 1n,
    referralFee: options.protocolFee || 2n,
    maxParticipants: options.protocolFee || 100n,
    budget: options.budget || budget,
    action:
      options.action ||
      new fixtures.bases.EventAction(
        defaultOptions,
        makeMockEventActionPayload(
          core.assertValidAddress(),
          erc20.assertValidAddress(),
        ),
      ),
    validator:
      options.validator ||
      fixtures.core.SignerValidator({
        signers: [
          defaultOptions.account.address,
          accounts.at(0)?.account as Address,
        ],
        validatorCaller: accounts.at(0)?.account as Address,
      }),
    allowList:
      options.allowList ||
      fixtures.core.SimpleAllowList({
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
  const managedBudgetBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ManagedBudgetArtifact.abi,
      bytecode: ManagedBudgetArtifact.bytecode as Hex,
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
  const erc20VariableIncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ERC20VariableIncentiveArtifact.abi,
      bytecode: ERC20VariableIncentiveArtifact.bytecode as Hex,
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
    OpenAllowList: class TOpenAllowList extends OpenAllowList {
      public static override base = simpleDenyListBase;
    },
    SimpleBudget: class TSimpleBudget extends SimpleBudget {
      public static override base = simpleBudgetBase;
    },
    ManagedBudget: class TManagedBudget extends ManagedBudget {
      public static override base = managedBudgetBase;
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
    ERC20VariableIncentive: class TERC20VariableIncentive extends ERC20VariableIncentive {
      public static override base = erc20VariableIncentiveBase;
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
    await registry.register(deployable.registryType, name, deployable.base);
  }

  class TBoostCore extends BoostCore {
    ContractAction(
      options: DeployablePayloadOrAddress<ContractActionPayload>,
      isBase?: boolean,
    ) {
      return new bases.ContractAction(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
    override EventAction(
      options: DeployablePayloadOrAddress<EventActionPayload>,
      isBase?: boolean,
    ) {
      return new bases.EventAction(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
    ERC721MintAction(
      options: DeployablePayloadOrAddress<ERC721MintActionPayload>,
      isBase?: boolean,
    ) {
      return new bases.ERC721MintAction(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
    override SimpleAllowList(
      options: DeployablePayloadOrAddress<SimpleAllowListPayload>,
      isBase?: boolean,
    ) {
      return new bases.SimpleAllowList(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
    override SimpleDenyList(
      options: DeployablePayloadOrAddress<SimpleDenyListPayload>,
      isBase?: boolean,
    ) {
      return new bases.SimpleDenyList(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
    override OpenAllowList(isBase?: boolean) {
      return new bases.OpenAllowList(
        { config: this._config, account: this._account },
        undefined,
        isBase,
      );
    }
    SimpleBudget(options: DeployablePayloadOrAddress<SimpleBudgetPayload>) {
      return new bases.SimpleBudget(
        { config: this._config, account: this._account },
        options,
      );
    }
    override ManagedBudget(
      options: DeployablePayloadOrAddress<ManagedBudgetPayload>,
    ) {
      return new bases.ManagedBudget(
        { config: this._config, account: this._account },
        options,
      );
    }
    VestingBudget(options: DeployablePayloadOrAddress<VestingBudgetPayload>) {
      return new bases.VestingBudget(
        { config: this._config, account: this._account },
        options,
      );
    }
    override AllowListIncentive(options: AllowListIncentivePayload) {
      return new bases.AllowListIncentive(
        { config: this._config, account: this._account },
        options,
      );
    }
    override CGDAIncentive(options: CGDAIncentivePayload) {
      return new bases.CGDAIncentive(
        { config: this._config, account: this._account },
        options,
      );
    }
    override ERC20Incentive(options: ERC20IncentivePayload) {
      return new bases.ERC20Incentive(
        { config: this._config, account: this._account },
        options,
      );
    }
    ERC1155Incentive(options: ERC1155IncentivePayload) {
      return new bases.ERC1155Incentive(
        { config: this._config, account: this._account },
        options,
      );
    }
    override PointsIncentive(options: PointsIncentivePayload) {
      return new bases.PointsIncentive(
        { config: this._config, account: this._account },
        options,
      );
    }
    override SignerValidator(
      options: DeployablePayloadOrAddress<SignerValidatorPayload>,
      isBase?: boolean,
    ) {
      return new bases.SignerValidator(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
    override ERC20VariableIncentive(
      options: DeployablePayloadOrAddress<ERC20VariableIncentivePayload>,
      isBase?: boolean,
    ) {
      return new bases.ERC20VariableIncentive(
        { config: this._config, account: this._account },
        options,
        isBase,
      );
    }
  }

  const core = new TBoostCore({
    ...options,
    registryAddress: registry.assertValidAddress(),
    protocolFeeReceiver: account.address,
  });
  await core.deploy();

  return {
    registry,
    core,
    bases,
  };
}

export async function deployStringEmitterMock(
  options: DeployableTestOptions = defaultOptions,
) {
  const { config, account } = options;
  const stringEmitterAbi = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'string',
          name: 'emittedInfo',
          type: 'string',
        },
      ],
      name: 'Info',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'infoToEmit',
          type: 'string',
        },
      ],
      name: 'store',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  // from sourcecode here: https://gist.github.com/topocount/f1bf0f53c41e53fd0824b250a92cfad7
  const stringEmitterBytecode =
    '0x6080604052348015600e575f80fd5b506101cf8061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610029575f3560e01c8063131a06801461002d575b5f80fd5b610047600480360381019061004291906100fa565b610049565b005b8181604051610059929190610181565b60405180910390207f6d128f203c67be3b2d9bf1612fd59bdd6ae01f4f0d2ffedd05e76ab2a09b7f8a60405160405180910390a25050565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f8083601f8401126100ba576100b9610099565b5b8235905067ffffffffffffffff8111156100d7576100d661009d565b5b6020830191508360018202830111156100f3576100f26100a1565b5b9250929050565b5f80602083850312156101105761010f610091565b5b5f83013567ffffffffffffffff81111561012d5761012c610095565b5b610139858286016100a5565b92509250509250929050565b5f81905092915050565b828183375f83830152505050565b5f6101688385610145565b935061017583858461014f565b82840190509392505050565b5f61018d82848661015d565b9150819050939250505056fea264697066735822122078b2f20733c3e7365d624d4e4b056202633440be09d47a294bad7c236c6d2a0c64736f6c634300081a0033';

  const stringEmitterAddress = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: stringEmitterAbi,
      bytecode: stringEmitterBytecode,
      account,
    }),
  );

  async function emitString(infoToEmit: string) {
    const { request } = await simulateContract(config, {
      address: stringEmitterAddress,
      abi: stringEmitterAbi,
      functionName: 'store',
      args: [infoToEmit],
      account,
    });
    return writeContract(config, request);
  }

  console.log('StringEmitter', stringEmitterAddress);
  return {
    address: stringEmitterAddress,
    abi: stringEmitterAbi,
    emitString,
  };
}

export function freshBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
) {
  return async function freshBudget() {
    return await fixtures.registry.initialize(
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

export function freshManagedBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
) {
  return async function freshBudget() {
    return await fixtures.registry.initialize(
      crypto.randomUUID(),
      new fixtures.bases.ManagedBudget(options, {
        owner: options.account.address,
        authorized: [
          options.account.address,
          fixtures.core.assertValidAddress(),
        ],
        roles: [ManagedBudgetRoles.ADMIN, ManagedBudgetRoles.MANAGER],
      }),
    );
  };
}

export function freshVestingBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
) {
  return async function freshVestingBudget() {
    return await fixtures.registry.initialize(
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
      if (!budget)
        budget = await loadFixture(freshManagedBudget(options, fixtures)); // await loadFixture(freshBudget(options, fixtures));
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

export function fundManagedBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
  budget?: ManagedBudget,
  erc20?: MockERC20,
  erc1155?: MockERC1155,
  points?: MockPoints,
) {
  return async function fundBudget() {
    {
      if (!budget)
        budget = await loadFixture(freshManagedBudget(options, fixtures));
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

      return { budget, erc20, erc1155, points } as BudgetFixtures & {
        budget: ManagedBudget;
      };
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
        budget = await loadFixture(freshManagedBudget(options, fixtures));
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

      return { budget, erc20, erc1155, points } as BudgetFixtures;
    }
  };
}

export function makeMockEventActionPayload(
  coreAddress: Address,
  erc20Address: Address,
) {
  const step: ActionStep = {
    signature:
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    signatureType: SignatureType.EVENT,
    targetContract: erc20Address,
    chainid: 31337,
    actionParameter: {
      filterType: FilterType.EQUAL,
      fieldType: PrimitiveType.ADDRESS,
      fieldIndex: 0, // Assume the first field in the log is the 'from' address
      filterData: coreAddress,
    },
  };

  return {
    actionClaimant: {
      chainid: 31337,
      signatureType: SignatureType.EVENT,
      signature:
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      fieldIndex: 0,
      targetContract: erc20Address,
    },
    actionStepOne: step,
    actionStepTwo: step,
    actionStepThree: step,
    actionStepFour: step,
  } as EventActionPayload;
}

export function makeMockFunctionActionPayload(
  coreAddress: Address,
  erc20Address: Address,
) {
  const step: ActionStep = {
    signature: '0x40c10f19',
    chainid: 31337,
    signatureType: SignatureType.FUNC,
    targetContract: erc20Address,
    actionParameter: {
      filterType: FilterType.EQUAL,
      fieldType: PrimitiveType.ADDRESS,
      fieldIndex: 0, // Assume the first field in the log is the 'from' address
      filterData: coreAddress,
    },
  };

  return {
    actionClaimant: {
      signatureType: SignatureType.FUNC,
      signature: '0x40c10f19',
      fieldIndex: 0,
      targetContract: erc20Address,
      chainid: 31337,
    },
    actionStepOne: step,
    actionStepTwo: step,
    actionStepThree: step,
    actionStepFour: step,
  } as EventActionPayload;
}
