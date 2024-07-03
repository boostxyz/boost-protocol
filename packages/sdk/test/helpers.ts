import { RegistryType, writeBoostRegistryRegister } from '@boostxyz/evm';
import BoostCore from '@boostxyz/evm/artifacts/contracts/BoostCore.sol/BoostCore.json';
import BoostRegistry from '@boostxyz/evm/artifacts/contracts/BoostRegistry.sol/BoostRegistry.json';
import ContractAction from '@boostxyz/evm/artifacts/contracts/actions/ContractAction.sol/ContractAction.json';
import ERC721MintAction from '@boostxyz/evm/artifacts/contracts/actions/ERC721MintAction.sol/ERC721MintAction.json';
import SimpleAllowList from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleAllowList.sol/SimpleAllowList.json';
import SimpleDenyList from '@boostxyz/evm/artifacts/contracts/allowlists/SimpleDenyList.sol/SimpleDenyList.json';
import SimpleBudget from '@boostxyz/evm/artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget.json';
import VestingBudget from '@boostxyz/evm/artifacts/contracts/budgets/VestingBudget.sol/VestingBudget.json';
import AllowListIncentive from '@boostxyz/evm/artifacts/contracts/incentives/AllowListIncentive.sol/AllowListIncentive.json';
import CGDAIncentive from '@boostxyz/evm/artifacts/contracts/incentives/CGDAIncentive.sol/CGDAIncentive.json';
import ERC20Incentive from '@boostxyz/evm/artifacts/contracts/incentives/ERC20Incentive.sol/ERC20Incentive.json';
import ERC1155Incentive from '@boostxyz/evm/artifacts/contracts/incentives/ERC1155Incentive.sol/ERC1155Incentive.json';
import PointsIncentive from '@boostxyz/evm/artifacts/contracts/incentives/PointsIncentive.sol/PointsIncentive.json';
import SignerValidator from '@boostxyz/evm/artifacts/contracts/validators/SignerValidator.sol/SignerValidator.json';
import { deployContract } from '@wagmi/core';
import type { Hex } from 'viem';
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

  const bases = {
    ContractAction: {
      type: RegistryType.ACTION,
      name: 'ContractAction',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: ContractAction.abi,
          bytecode: ContractAction.bytecode as Hex,
          account,
        }),
      ),
    },
    ERC721MintAction: {
      type: RegistryType.ACTION,
      name: 'ERC721MintAction',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: ERC721MintAction.abi,
          bytecode: ERC721MintAction.bytecode as Hex,
          account,
        }),
      ),
    },
    SimpleAllowList: {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleAllowList',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: SimpleAllowList.abi,
          bytecode: SimpleAllowList.bytecode as Hex,
          account,
        }),
      ),
    },
    SimpleDenyList: {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleDenyList',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: SimpleDenyList.abi,
          bytecode: SimpleDenyList.bytecode as Hex,
          account,
        }),
      ),
    },
    SimpleBudget: {
      type: RegistryType.BUDGET,
      name: 'SimpleBudget',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: SimpleBudget.abi,
          bytecode: SimpleBudget.bytecode as Hex,
          account,
        }),
      ),
    },
    VestingBudget: {
      type: RegistryType.BUDGET,
      name: 'VestingBudget',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: VestingBudget.abi,
          bytecode: VestingBudget.bytecode as Hex,
          account,
        }),
      ),
    },
    AllowListIncentive: {
      type: RegistryType.INCENTIVE,
      name: 'AllowListIncentive',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: AllowListIncentive.abi,
          bytecode: AllowListIncentive.bytecode as Hex,
          account,
        }),
      ),
    },
    CGDAIncentive: {
      type: RegistryType.INCENTIVE,
      name: 'CGDAIncentive',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: CGDAIncentive.abi,
          bytecode: CGDAIncentive.bytecode as Hex,
          account,
        }),
      ),
    },
    ERC20Incentive: {
      type: RegistryType.INCENTIVE,
      name: 'ERC20Incentive',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: ERC20Incentive.abi,
          bytecode: ERC20Incentive.bytecode as Hex,
          account,
        }),
      ),
    },
    ERC1155Incentive: {
      type: RegistryType.INCENTIVE,
      name: 'ERC1155Incentive',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: ERC1155Incentive.abi,
          bytecode: ERC1155Incentive.bytecode as Hex,
          account,
        }),
      ),
    },
    PointsIncentive: {
      type: RegistryType.INCENTIVE,
      name: 'PointsIncentive',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: PointsIncentive.abi,
          bytecode: PointsIncentive.bytecode as Hex,
          account,
        }),
      ),
    },
    SignerValidator: {
      type: RegistryType.VALIDATOR,
      name: 'SignerValidator',
      base: await getDeployedContractAddress(
        config,
        deployContract(config, {
          abi: SignerValidator.abi,
          bytecode: SignerValidator.bytecode as Hex,
          account,
        }),
      ),
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
