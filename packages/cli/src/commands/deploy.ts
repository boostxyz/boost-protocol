import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import ERC721MintActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import EventActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/EventAction.sol/EventAction.json';
import SimpleAllowListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import SimpleDenyListArtifact from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import ManagedBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/ManagedBudget.sol/ManagedBudget.json';
import ManagedBudgetWithFeesArtifact from '@boostxyz/evm/artifacts/contracts/budgets/ManagedBudgetWithFees.sol/ManagedBudgetWithFees.json';
import VestingBudgetArtifact from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import AllowListIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import CGDAIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import ERC20IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import ERC20VariableCriteriaIncentiveV2Artifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20VariableCriteriaIncentiveV2.sol/ERC20VariableCriteriaIncentiveV2.json';
import ERC20VariableIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC20VariableIncentive.sol/ERC20VariableIncentive.json';
import ERC1155IncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import PointsIncentiveArtifact from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import LimitedSignerValidatorArtifact from '@boostxyz/evm/artifacts/contracts/validators/LimitedSignerValidator.sol/LimitedSignerValidator.json';
import SignerValidatorArtifact from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import {
  AllowListIncentive,
  BoostCore,
  BoostRegistry,
  CGDAIncentive,
  type DeployableOptions,
  ERC20Incentive,
  ERC20VariableCriteriaIncentiveV2,
  ERC20VariableIncentive,
  EventAction,
  LimitedSignerValidator,
  ManagedBudget,
  ManagedBudgetWithFees,
  PointsIncentive,
  SignerValidator,
  SimpleAllowList,
  SimpleDenyList,
  getDeployedContractAddress,
} from '@boostxyz/sdk';
import { createConfig, deployContract } from '@wagmi/core';
import type { Client, Hex } from 'viem';
import {
  http,
  createTestClient,
  createWalletClient,
  publicActions,
  walletActions,
} from 'viem';
import {
  type Address,
  mnemonicToAccount,
  privateKeyToAccount,
} from 'viem/accounts';

import { Chains, type Command, getDeployableOptions } from '../utils';

export type DeployResult = {
  BOOST_CORE_ADDRESS: string;
  BOOST_REGISTRY_ADDRESS: string;
  CONTRACT_ACTION_BASE: string;
  EVENT_ACTION_BASE: string;
  ERC721_MINT_ACTION_BASE: string;
  SIMPLE_ALLOWLIST_BASE: string;
  SIMPLE_DENYLIST_BASE: string;
  MANAGED_BUDGET_BASE: string;
  VESTING_BUDGET_BASE: string;
  ALLOWLIST_INCENTIVE_BASE: string;
  CGDA_INCENTIVE_BASE: string;
  ERC20_INCENTIVE_BASE: string;
  ERC20_VARIABLE_INCENTIVE_BASE: string;
  ERC20_VARIABLE_CRITERIA_INCENTIVE_BASE: string;
  ERC1155_INCENTIVE_BASE: string;
  POINTS_INCENTIVE_BASE: string;
  SIGNER_VALIDATOR_BASE: string;
  LIMITED_SIGNER_VALIDATOR_BASE: string;
};

export const deploy: Command<DeployResult> = async function deploy(
  _positionals,
  opts,
) {
  const privateKey = opts.privateKey,
    mnemonic = opts.mnemonic,
    _chain = opts.chain;
  if (!privateKey && !mnemonic)
    throw new Error(
      'Must provide `--privateKey` or `--mnemonic` to deploy contracts',
    );
  if (!_chain || !Chains[_chain])
    throw new Error(
      `Must provide valid \`--chain\` to specify target deployment chain, valid chains are ${Object.keys(Chains)}`,
    );

  const [options, chain] = getDeployableOptions({
    chain: _chain,
    privateKey,
    mnemonic,
  });

  const { config, account } = options;
  const chainId = chain!.id!;

  const _registry = await (
    new BoostRegistry({
      address: null,
      ...options,
      // biome-ignore lint/suspicious/noExplicitAny: we know what we're doing
    }) as any
  ).deploy();

  class TBoostRegistry extends BoostRegistry {
    public static override addresses: Record<number, Address> = {
      [chainId]: _registry.assertValidAddress(),
    };
  }

  const registry = new TBoostRegistry({
    ...options,
    address: _registry.assertValidAddress(),
  });

  const core = await (
    new BoostCore({
      ...options,
      registryAddress: registry.assertValidAddress(),
      protocolFeeReceiver: account.address,
      owner: account.address,
      // biome-ignore lint/suspicious/noExplicitAny: we know what we're doing
    }) as any
  ).deploy();

  const contractActionBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ContractActionArtifact.abi,
      bytecode: ContractActionArtifact.bytecode as Hex,
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
  const managedBudgetBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ManagedBudgetArtifact.abi,
      bytecode: ManagedBudgetArtifact.bytecode as Hex,
      account,
    }),
  );
  const managedBudgetWithFeesBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ManagedBudgetWithFeesArtifact.abi,
      bytecode: ManagedBudgetWithFeesArtifact.bytecode as Hex,
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

  const eventActionBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: EventActionArtifact.abi,
      bytecode: EventActionArtifact.bytecode as Hex,
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

  const erc20VariableIncentiveBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ERC20VariableIncentiveArtifact.abi,
      bytecode: ERC20VariableIncentiveArtifact.bytecode as Hex,
      account,
    }),
  );

  const erc20VariableCriteriaIncentiveV2Base = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: ERC20VariableCriteriaIncentiveV2Artifact.abi,
      bytecode: ERC20VariableCriteriaIncentiveV2Artifact.bytecode as Hex,
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

  const limitedSignerValidatorBase = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: LimitedSignerValidatorArtifact.abi,
      bytecode: LimitedSignerValidatorArtifact.bytecode as Hex,
      account,
    }),
  );

  const bases = {
    // ContractAction: class TContractAction extends ContractAction {
    //   public static override base = contractActionBase;
    // },
    // ERC721MintAction: class TERC721MintAction extends ERC721MintAction {
    //   public static override base = erc721MintActionBase;
    // },
    EventAction: class TEventAction extends EventAction {
      public static override bases: Record<number, Address> = {
        [chainId]: eventActionBase,
      } as Record<number, Address>;
    },
    SimpleAllowList: class TSimpleAllowList extends SimpleAllowList {
      public static override bases: Record<number, Address> = {
        [chainId]: simpleAllowListBase,
      } as Record<number, Address>;
    },
    SimpleDenyList: class TSimpleDenyList extends SimpleDenyList {
      public static override bases: Record<number, Address> = {
        [chainId]: simpleDenyListBase,
      };
    },
    ManagedBudget: class TManagedBudget extends ManagedBudget {
      public static override bases: Record<number, Address> = {
        [chainId]: managedBudgetBase,
      } as Record<number, Address>;
    },
    ManagedBudgetWithFees: class TManagedBudgetWithFees extends ManagedBudgetWithFees {
      public static override bases: Record<number, Address> = {
        [chainId]: managedBudgetWithFeesBase,
      } as Record<number, Address>;
    },
    // VestingBudget: class TVestingBudget extends VestingBudget {
    //   public static override base = vestingBudgetBase;
    // },
    AllowListIncentive: class TAllowListIncentive extends AllowListIncentive {
      public static override bases: Record<number, Address> = {
        [chainId]: allowListIncentiveBase,
      } as Record<number, Address>;
    },
    CGDAIncentive: class TCGDAIncentive extends CGDAIncentive {
      public static override bases: Record<number, Address> = {
        [chainId]: cgdaIncentiveBase,
      } as Record<number, Address>;
    },
    ERC20Incentive: class TERC20Incentive extends ERC20Incentive {
      public static override bases: Record<number, Address> = {
        [chainId]: erc20IncentiveBase,
      } as Record<number, Address>;
    },
    ERC20VariableIncentive: class TERC20VariableIncentive extends ERC20VariableIncentive {
      public static override bases: Record<number, Address> = {
        [chainId]: erc20VariableIncentiveBase,
      } as Record<number, Address>;
    },
    ERC20VariableCriteriaIncentiveV2: class TERC20VariableCriteriaIncentiveV2 extends ERC20VariableCriteriaIncentiveV2 {
      public static override bases: Record<number, Address> = {
        [chainId]: erc20VariableCriteriaIncentiveV2Base,
      } as Record<number, Address>;
    },
    // ERC1155Incentive: class TERC1155Incentive extends ERC1155Incentive {
    //   public static override base = erc1155IncentiveBase;
    // },
    PointsIncentive: class TPointsIncentive extends PointsIncentive {
      public static override bases: Record<number, Address> = {
        [chainId]: pointsIncentiveBase,
      } as Record<number, Address>;
    },
    SignerValidator: class TSignerValidator extends SignerValidator {
      public static override bases: Record<number, Address> = {
        [chainId]: signerValidatorBase,
      } as Record<number, Address>;
    },
    LimitedSignerValidator: class TLimitedSignerValidator extends LimitedSignerValidator {
      public static override bases: Record<number, Address> = {
        [chainId]: limitedSignerValidatorBase,
      } as Record<number, Address>;
    },
  };

  for (const [name, deployable] of Object.entries(bases)) {
    await registry.register(
      deployable.registryType,
      name,
      deployable.bases[chainId]!,
    );
  }

  return {
    BOOST_CORE_ADDRESS: core.assertValidAddress(),
    BOOST_REGISTRY_ADDRESS: registry.assertValidAddress(),
    CONTRACT_ACTION_BASE: contractActionBase,
    EVENT_ACTION_BASE: eventActionBase,
    ERC721_MINT_ACTION_BASE: erc721MintActionBase,
    SIMPLE_ALLOWLIST_BASE: simpleAllowListBase,
    SIMPLE_DENYLIST_BASE: simpleDenyListBase,
    MANAGED_BUDGET_BASE: managedBudgetBase,
    VESTING_BUDGET_BASE: vestingBudgetBase,
    ALLOWLIST_INCENTIVE_BASE: allowListIncentiveBase,
    CGDA_INCENTIVE_BASE: cgdaIncentiveBase,
    ERC20_INCENTIVE_BASE: erc20IncentiveBase,
    ERC20_VARIABLE_INCENTIVE_BASE: erc20VariableIncentiveBase,
    ERC20_VARIABLE_CRITERIA_INCENTIVE_V2_BASE:
      erc20VariableCriteriaIncentiveV2Base,
    ERC1155_INCENTIVE_BASE: erc1155IncentiveBase,
    POINTS_INCENTIVE_BASE: pointsIncentiveBase,
    SIGNER_VALIDATOR_BASE: signerValidatorBase,
    LIMITED_SIGNER_VALIDATOR_BASE: limitedSignerValidatorBase,
  };
};
