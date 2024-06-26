import { RegistryType } from '@boostxyz/evm';
import { writeBoostRegistryRegister } from '@boostxyz/evm';
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
import type { Address, Hex } from 'viem';
import { accounts } from './accounts';
import { mockWalletClient, setupConfig } from './viem';

export interface Fixtures {
  bases: { type: RegistryType; name: string; base: Address }[];
  core: Address;
  registry: Address;
}

export async function deployContract(
  client: typeof mockWalletClient,
  ...params: Parameters<typeof mockWalletClient.deployContract>
) {
  const tx = await client.waitForTransactionReceipt({
    hash: await client.deployContract(...params),
  });
  return tx.contractAddress as Address;
}

export async function deployFixtures(
  account: Address = accounts.at(0)!.account,
  client = mockWalletClient,
): Promise<Fixtures> {
  const registry = await deployContract(client, {
    abi: BoostRegistry.abi,
    bytecode: BoostRegistry.bytecode as Hex,
    account,
  });

  const core = await deployContract(client, {
    abi: BoostCore.abi,
    bytecode: BoostCore.bytecode as Hex,
    account,
    args: [registry, account],
  });

  const bases = [
    {
      type: RegistryType.ACTION,
      name: 'ContractAction',
      base: await deployContract(client, {
        abi: ContractAction.abi,
        bytecode: ContractAction.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.ACTION,
      name: 'ERC721MintAction',
      base: await deployContract(client, {
        abi: ERC721MintAction.abi,
        bytecode: ERC721MintAction.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleAllowList',
      base: await deployContract(client, {
        abi: SimpleAllowList.abi,
        bytecode: SimpleAllowList.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleDenyList',
      base: await deployContract(client, {
        abi: SimpleDenyList.abi,
        bytecode: SimpleDenyList.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.BUDGET,
      name: 'SimpleBudget',
      base: await deployContract(client, {
        abi: SimpleBudget.abi,
        bytecode: SimpleBudget.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.BUDGET,
      name: 'VestingBudget',
      base: await deployContract(client, {
        abi: VestingBudget.abi,
        bytecode: VestingBudget.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'AllowListIncentive',
      base: await deployContract(client, {
        abi: AllowListIncentive.abi,
        bytecode: AllowListIncentive.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'CGDAIncentive',
      base: await deployContract(client, {
        abi: CGDAIncentive.abi,
        bytecode: CGDAIncentive.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'ERC20Incentive',
      base: await deployContract(client, {
        abi: ERC20Incentive.abi,
        bytecode: ERC20Incentive.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'ERC1155Incentive',
      base: await deployContract(client, {
        abi: ERC1155Incentive.abi,
        bytecode: ERC1155Incentive.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'PointsIncentive',
      base: await deployContract(client, {
        abi: PointsIncentive.abi,
        bytecode: PointsIncentive.bytecode as Hex,
        account,
      }),
    },
    {
      type: RegistryType.VALIDATOR,
      name: 'SignerValidator',
      base: await deployContract(client, {
        abi: SignerValidator.abi,
        bytecode: SignerValidator.bytecode as Hex,
        account,
      }),
    },
  ];

  const config = setupConfig(client);

  for (const { type, name, base } of bases) {
    await writeBoostRegistryRegister(config, {
      address: account,
      args: [type, name, base],
    });
  }

  return {
    registry,
    core,
    bases,
  };
}
