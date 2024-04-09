import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import {
  Address,
  encodeAbiParameters,
  parseAbiParameters,
  parseEther,
  zeroAddress,
  zeroHash,
} from "viem";

export enum RegistryType {
  ACTION = 0,
  ALLOW_LIST = 1,
  BUDGET = 2,
  INCENTIVE = 3,
  VALIDATOR = 4,
}

export const freshBudget = async () => {
  const { registry } = await loadFixture(_deployRegistry);
  const [ownerClient] = await viem.getWalletClients();

  const base = await registry.read.getBaseImplementation([
    await registry.read.getIdentifier([RegistryType.BUDGET, "SimpleBudget"]),
  ]);

  await registry.write.deployClone([
    RegistryType.BUDGET,
    base,
    "My Simple Budget",
    encodeAbiParameters(
      parseAbiParameters([
        "InitPayload payload",
        "struct InitPayload { address owner; address[] authorized; }",
      ]),
      [
        {
          owner: ownerClient!.account.address,
          authorized: [ownerClient!.account.address],
        },
      ]
    ),
  ]);

  const [log] = await registry.getEvents.Deployed({
    registryType: RegistryType.BUDGET,
  });

  return viem.getContractAt("SimpleBudget", log!.args.deployedInstance!);
};

const fundedBudget = async () => {
  const budget = await loadFixture(freshBudget);
  await budget.write.allocate(
    [
      prepareFungibleTransfer({
        amount: parseEther("1.0"),
        asset: zeroAddress,
        target: budget.address,
      }),
    ],
    {
      value: parseEther("1.0"),
    }
  );

  return budget;
};

export const mockERC20 = async (
  funded?: Address[],
  amount = parseEther("1000")
) => {
  const [ownerClient] = await viem.getWalletClients();
  const token = await viem.deployContract("MockERC20");

  for (const address of [ownerClient!.account.address, ...(funded ?? [])]) {
    await token.write.mint([address, amount]);
    expect(await token.read.balanceOf([address])).to.equal(amount);
  }

  return token;
};

export const mockERC1155 = async (
  tokenId = 1n,
  amount = 100n
) => {
  const [ownerClient] = await viem.getWalletClients();
  const token = await viem.deployContract("MockERC1155");

  await token.write.mint([ownerClient!.account.address, tokenId, amount]);
  expect(await token.read.balanceOf([ownerClient!.account.address, tokenId])).to.equal(amount);

  return token;
};

const _deployRegistry = async () => {
  const [ownerClient] = await viem.getWalletClients();
  const registry = await viem.deployContract("BoostRegistry");

  // Deploy the base implementations
  const bases = [
    {
      type: RegistryType.ACTION,
      name: "ContractAction",
      base: await viem.deployContract("ContractAction"),
    },
    {
      type: RegistryType.ACTION,
      name: "ERC721MintAction",
      base: await viem.deployContract("ERC721MintAction"),
    },
    {
      type: RegistryType.ALLOW_LIST,
      name: "SimpleAllowList",
      base: await viem.deployContract("SimpleAllowList"),
    },
    {
      type: RegistryType.ALLOW_LIST,
      name: "SimpleDenyList",
      base: await viem.deployContract("SimpleDenyList"),
    },
    {
      type: RegistryType.BUDGET,
      name: "SimpleBudget",
      base: await viem.deployContract("SimpleBudget"),
    },
    {
      type: RegistryType.BUDGET,
      name: "VestingBudget",
      base: await viem.deployContract("VestingBudget"),
    },
    {
      type: RegistryType.INCENTIVE,
      name: "AllowListIncentive",
      base: await viem.deployContract("AllowListIncentive"),
    },
    {
      type: RegistryType.INCENTIVE,
      name: "CGDAIncentive",
      base: await viem.deployContract("CGDAIncentive"),
    },
    {
      type: RegistryType.INCENTIVE,
      name: "ERC20Incentive",
      base: await viem.deployContract("ERC20Incentive"),
    },
    {
      type: RegistryType.INCENTIVE,
      name: "ERC1155Incentive",
      base: await viem.deployContract("ERC1155Incentive"),
    },
    {
      type: RegistryType.INCENTIVE,
      name: "PointsIncentive",
      base: await viem.deployContract("PointsIncentive"),
    },
    {
      type: RegistryType.VALIDATOR,
      name: "SignerValidator",
      base: await viem.deployContract("SignerValidator"),
    },
  ];

  // Add them all to the registry
  for (const { type, name, base } of bases) {
    await registry.write.register([type, name, base.address]);
  }

  // Deploy the Core
  const core = await viem.deployContract("BoostCore", [
    registry.address,
    ownerClient!.account.address,
  ]);

  return { bases, core, registry };
};

export function prepareERC1155Payload({
  tokenId,
  amount,
}: {
  tokenId: bigint;
  amount: bigint;
}) {
  return encodeAbiParameters(
    parseAbiParameters([
      "ERC1155Payload payload",
      "struct ERC1155Payload { uint256 tokenId; uint256 amount; bytes data; }",
    ]),
    [{ tokenId, amount, data: zeroHash }]
  );
}

export function prepareERC1155Transfer({
  tokenId,
  amount,
  asset,
  target,
}: {
  tokenId: bigint;
  amount: bigint;
  asset: Address;
  target: Address;
}) {
  return encodeAbiParameters(
    parseAbiParameters([
      "Transfer request",
      "struct Transfer { uint8 assetType; address asset; address target; bytes data; }",
    ]),
    [
      {
        assetType: 2,
        asset,
        data: prepareERC1155Payload({ tokenId, amount }),
        target,
      },
    ]
  );
}

export function prepareFungiblePayload({ amount }: { amount: bigint }) {
  return encodeAbiParameters(
    parseAbiParameters([
      "FungiblePayload payload",
      "struct FungiblePayload { uint256 amount; }",
    ]),
    [{ amount }]
  );
}

export function prepareFungibleTransfer({
  amount,
  asset,
  target,
}: {
  amount: bigint;
  asset: Address;
  target: Address;
}) {
  return encodeAbiParameters(
    parseAbiParameters([
      "Transfer request",
      "struct Transfer { uint8 assetType; address asset; address target; bytes data; }",
    ]),
    [
      {
        assetType: asset == zeroAddress ? 0 : 1,
        asset,
        data: prepareFungiblePayload({ amount }),
        target,
      },
    ]
  );
}
