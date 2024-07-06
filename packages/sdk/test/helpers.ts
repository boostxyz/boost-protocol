//@ts-nocheck
import { RegistryType, writeBoostRegistryRegister } from '@boostxyz/evm';
import BoostCore from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json';
import BoostRegistry from '@boostxyz/evm/artifacts/contracts/BoostRegistry.sol/BoostRegistry.json';
import ContractActionArtifact from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
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
import { deployContract } from '@wagmi/core';
import type { Hex } from 'viem';
import {
  AllowListIncentive,
  CGDAIncentive,
  ContractAction,
  ERC20Incentive,
  ERC721MintAction,
  ERC1155Incentive,
  PointsIncentive,
  SignerValidator,
  SimpleAllowList,
  SimpleBudget,
  SimpleDenyList,
  VestingBudget,
} from '../src';
import { getDeployedContractAddress } from '../src/utils';
import { setupConfig, testAccount } from './viem';

export type Fixtures = Awaited<ReturnType<typeof deployFixtures>>;

export async function deployFixtures(
  config = setupConfig(),
  account = testAccount,
) {
  const registry = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: BoostRegistry.abi,
      bytecode: BoostRegistry.bytecode as Hex,
      account,
    }),
  );

  const core = await getDeployedContractAddress(
    config,
    deployContract(config, {
      abi: BoostCore.abi,
      bytecode: BoostCore.bytecode as Hex,
      account,
      args: [registry, account.address],
    }),
  );

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
    ContractAction: {
      type: RegistryType.ACTION,
      name: 'ContractAction',
      base: contractActionBase,
      Test: class TContractAction extends ContractAction {
        public static override base = contractActionBase;
        public override readonly base = contractActionBase;
      },
    },
    ERC721MintAction: {
      type: RegistryType.ACTION,
      name: 'ERC721MintAction',
      base: erc721MintActionBase,
      Test: class TERC721MintAction extends ERC721MintAction {
        public static override base = erc721MintActionBase;
        public override readonly base = erc721MintActionBase;
      },
    },
    SimpleAllowList: {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleAllowList',
      base: simpleAllowListBase,
      Test: class TSimpleAllowList extends SimpleAllowList {
        public static override base = simpleAllowListBase;
        public override readonly base = simpleAllowListBase;
      },
    },
    SimpleDenyList: {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleDenyList',
      base: simpleDenyListBase,
      Test: class TSimpleDenyList extends SimpleDenyList {
        public static override base = simpleDenyListBase;
        public override readonly base = simpleDenyListBase;
      },
    },
    SimpleBudget: {
      type: RegistryType.BUDGET,
      name: 'SimpleBudget',
      base: simpleBudgetBase,
      Test: class TSimpleBudget extends SimpleBudget {
        public static override base = simpleBudgetBase;
        public override readonly base = simpleBudgetBase;
      },
    },
    VestingBudget: {
      type: RegistryType.BUDGET,
      name: 'VestingBudget',
      base: vestingBudgetBase,
      Test: class TVestingBudget extends VestingBudget {
        public static override base = vestingBudgetBase;
        public override readonly base = vestingBudgetBase;
      },
    },
    AllowListIncentive: {
      type: RegistryType.INCENTIVE,
      name: 'AllowListIncentive',
      base: allowListIncentiveBase,
      Test: class TAllowListIncentive extends AllowListIncentive {
        public static override base = allowListIncentiveBase;
        public override readonly base = allowListIncentiveBase;
      },
    },
    CGDAIncentive: {
      type: RegistryType.INCENTIVE,
      name: 'CGDAIncentive',
      base: cgdaIncentiveBase,
      Test: class TCGDAIncentive extends CGDAIncentive {
        public static override base = cgdaIncentiveBase;
        public override readonly base = cgdaIncentiveBase;
      },
    },
    ERC20Incentive: {
      type: RegistryType.INCENTIVE,
      name: 'ERC20Incentive',
      base: erc20IncentiveBase,
      Test: class TERC20Incentive extends ERC20Incentive {
        public static override base = erc20IncentiveBase;
        public override readonly base = erc20IncentiveBase;
      },
    },
    ERC1155Incentive: {
      type: RegistryType.INCENTIVE,
      name: 'ERC1155Incentive',
      base: erc1155IncentiveBase,
      Test: class TERC1155Incentive extends ERC1155Incentive {
        public static override base = erc1155IncentiveBase;
        public override readonly base = erc1155IncentiveBase;
      },
    },
    PointsIncentive: {
      type: RegistryType.INCENTIVE,
      name: 'PointsIncentive',
      base: pointsIncentiveBase,
      Test: class TPointsIncentive extends PointsIncentive {
        public static override base = pointsIncentiveBase;
        public override readonly base = pointsIncentiveBase;
      },
    },
    SignerValidator: {
      type: RegistryType.VALIDATOR,
      name: 'SignerValidator',
      base: signerValidatorBase,
      Test: class TSignerValidator extends SignerValidator {
        public static override base = signerValidatorBase;
        public override readonly base = signerValidatorBase;
      },
    },
  };

  for (const { type, name, base } of Object.values(bases)) {
    await writeBoostRegistryRegister(config, {
      account,
      address: registry,
      args: [type, name, base],
    });
  }

  return {
    registry,
    core,
    bases,
  };
}
