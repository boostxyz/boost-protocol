import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers';
import { expect } from 'chai';
import { viem } from 'hardhat';
import {
  type Address,
  type GetContractReturnType,
  parseEther,
  zeroAddress,
} from 'viem';
import {
  RegistryType,
  StrategyType,
  contractAction,
  erc20Incentive,
  prepareBoostPayload,
  prepareERC1155Transfer,
  prepareFungibleTransfer,
  prepareSimpleBudgetPayload,
} from '../../artifacts';
import type { BoostCore$Type } from '../../artifacts/contracts/BoostCore.sol/BoostCore';
import type { BoostRegistry$Type } from '../../artifacts/contracts/BoostRegistry.sol/BoostRegistry';

export async function freshBudget() {
  const { registry, core } = await loadFixture(coreAndRegistry);
  const [ownerClient] = await viem.getWalletClients();

  const base = await registry.read.getBaseImplementation([
    await registry.read.getIdentifier([RegistryType.BUDGET, 'SimpleBudget']),
  ]);

  const cloneId = await registry.read.getCloneIdentifier([
    RegistryType.BUDGET,
    base,
    ownerClient?.account.address,
    'My Simple Budget',
  ]);

  await registry.write.deployClone([
    RegistryType.BUDGET,
    base,
    'My Simple Budget',
    prepareSimpleBudgetPayload({
      owner: ownerClient?.account.address,
      authorized: [ownerClient?.account.address, core.address],
    }),
  ]);

  const { instance } = await registry.read.getClone([cloneId]);

  return viem.getContractAt('SimpleBudget', instance);
}

export async function freshBoost(ownerAddress: Address = zeroAddress) {
  const { bases, core } = await loadFixture(coreAndRegistry);
  const { budget, erc20 } = await loadFixture(fundedBudget);
  const [creator] = await viem.getWalletClients();

  if (ownerAddress == zeroAddress) {
    ownerAddress = creator?.account.address;
  }

  await core.write.createBoost([
    prepareBoostPayload({
      budget: budget.address,
      owner: ownerAddress,
      action: {
        ...contractAction({
          chainId: BigInt(creator?.chain.id ?? 31337),
          target: core.address,
          value: 0n,
          selector: '0xdeadbeef',
        }),
        instance: bases.find((b) => b.name === 'ContractAction')?.base.address,
      },
      validator: {
        ...signerValidator({ signers: [ownerAddress] }),
        instance: bases.find((b) => b.name === 'SignerValidator')?.base.address,
      },
      allowList: {
        ...simpleAllowList({ owner: ownerAddress, allowed: [ownerAddress] }),
        instance: bases.find((b) => b.name === 'SimpleAllowList')?.base.address,
      },
      incentives: [
        {
          ...erc20Incentive({
            asset: erc20.address,
            reward: parseEther('1'),
            limit: 100n,
            strategy: StrategyType.POOL,
          }),
          instance: bases.find((b) => b.name === 'ERC20Incentive')?.base
            .address,
        },
      ],
    }),
  ]);

  return true;
}

export async function fundedBudget() {
  const [ownerClient] = await viem.getWalletClients();
  const budget = await loadFixture(freshBudget);
  const erc20 = await loadFixture(mockERC20);
  const erc1155 = await loadFixture(mockERC1155);

  await budget.write.allocate(
    [
      prepareFungibleTransfer({
        amount: parseEther('1.0'),
        asset: zeroAddress,
        target: ownerClient?.account.address,
      }),
    ],
    {
      value: parseEther('1.0'),
    },
  );

  await erc20.write.approve([budget.address, parseEther('100')]);
  await budget.write.allocate([
    prepareFungibleTransfer({
      amount: parseEther('100'),
      asset: erc20.address,
      target: ownerClient?.account.address,
    }),
  ]);

  await erc1155.write.setApprovalForAll([budget.address, true]);
  await budget.write.allocate([
    prepareERC1155Transfer({
      tokenId: 1n,
      amount: 100n,
      asset: erc1155.address,
      target: ownerClient?.account.address,
    }),
  ]);

  return { budget, erc20, erc1155 };
}

export async function mockERC20(
  funded?: Address[],
  amount = parseEther('1000'),
) {
  const [ownerClient] = await viem.getWalletClients();
  const token = await viem.deployContract('MockERC20');

  for (const address of [ownerClient?.account.address, ...(funded ?? [])]) {
    await token.write.mint([address, amount]);
    expect(await token.read.balanceOf([address])).to.equal(amount);
  }

  return token;
}

export async function mockERC1155(tokenId = 1n, amount = 100n) {
  const [ownerClient] = await viem.getWalletClients();
  const token = await viem.deployContract('MockERC1155');

  await token.write.mint([ownerClient?.account.address, tokenId, amount]);
  expect(
    await token.read.balanceOf([ownerClient?.account.address, tokenId]),
  ).to.equal(amount);

  return token;
}

export type Base = {
  type: RegistryType;
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  base: GetContractReturnType<any>;
};

export async function coreAndRegistry(): Promise<{
  bases: Base[];
  core: GetContractReturnType<BoostCore$Type['abi']>;
  registry: GetContractReturnType<BoostRegistry$Type['abi']>;
}> {
  const [ownerClient] = await viem.getWalletClients();
  const registry = await viem.deployContract('BoostRegistry');

  // Deploy the base implementations
  const bases = [
    {
      type: RegistryType.ACTION,
      name: 'ContractAction',
      base: await viem.deployContract('ContractAction'),
    },
    {
      type: RegistryType.ACTION,
      name: 'ERC721MintAction',
      base: await viem.deployContract('ERC721MintAction'),
    },
    {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleAllowList',
      base: await viem.deployContract('SimpleAllowList'),
    },
    {
      type: RegistryType.ALLOW_LIST,
      name: 'SimpleDenyList',
      base: await viem.deployContract('SimpleDenyList'),
    },
    {
      type: RegistryType.BUDGET,
      name: 'SimpleBudget',
      base: await viem.deployContract('SimpleBudget'),
    },
    {
      type: RegistryType.BUDGET,
      name: 'VestingBudget',
      base: await viem.deployContract('VestingBudget'),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'AllowListIncentive',
      base: await viem.deployContract('AllowListIncentive'),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'CGDAIncentive',
      base: await viem.deployContract('CGDAIncentive'),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'ERC20Incentive',
      base: await viem.deployContract('ERC20Incentive'),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'ERC1155Incentive',
      base: await viem.deployContract('ERC1155Incentive'),
    },
    {
      type: RegistryType.INCENTIVE,
      name: 'PointsIncentive',
      base: await viem.deployContract('PointsIncentive'),
    },
    {
      type: RegistryType.VALIDATOR,
      name: 'SignerValidator',
      base: await viem.deployContract('SignerValidator'),
    },
  ];

  // Add them all to the registry
  for (const { type, name, base } of bases) {
    await registry.write.register([type, name, base.address]);
  }

  // Deploy the Core
  const core = (await viem.deployContract('BoostCore', [
    registry.address,
    ownerClient?.account.address,
  ])) as GetContractReturnType<BoostCore$Type['abi']>;

  return { bases, core, registry };
}
