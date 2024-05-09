import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";
import {
  Address,
  encodeAbiParameters,
  GetContractReturnType,
  Hex,
  parseAbiParameters,
  parseEther,
  zeroAddress,
  zeroHash,
} from "viem";
import { SimpleBudget$Type } from "../../artifacts/contracts/budgets/SimpleBudget.sol/SimpleBudget";
import { MockERC20$Type } from "../../artifacts/contracts/shared/Mocks.sol/MockERC20";
import { MockERC1155$Type } from "../../artifacts/contracts/shared/Mocks.sol/MockERC1155";

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
    prepareSimpleBudgetPayload({
      owner: ownerClient!.account.address,
      authorized: [ownerClient!.account.address],
    }),
  ]);

  const [log] = await registry.getEvents.Deployed({
    registryType: RegistryType.BUDGET,
  });

  return viem.getContractAt("SimpleBudget", log!.args.deployedInstance!);
};

export const fundedBudget = async (): Promise<{
  budget: GetContractReturnType<SimpleBudget$Type["abi"]>;
  erc20: GetContractReturnType<MockERC20$Type["abi"]>;
  erc1155: GetContractReturnType<MockERC1155$Type["abi"]>;
}> => {
  const [ownerClient] = await viem.getWalletClients();
  const budget = await loadFixture(freshBudget);
  const erc20 = await loadFixture(mockERC20);
  const erc1155 = await loadFixture(mockERC1155);

  await budget.write.allocate(
    [
      prepareFungibleTransfer({
        amount: parseEther("1.0"),
        asset: zeroAddress,
        target: ownerClient!.account.address,
      }),
    ],
    {
      value: parseEther("1.0"),
    }
  );

  await erc20.write.approve([budget.address, parseEther("100")]);
  await budget.write.allocate([
    prepareFungibleTransfer({
      amount: parseEther("100"),
      asset: erc20.address,
      target: ownerClient!.account.address,
    }),
  ]);

  await erc1155.write.setApprovalForAll([budget.address, true]);
  await budget.write.allocate([
    prepareERC1155Transfer({
      tokenId: 1n,
      amount: 100n,
      asset: erc1155.address,
      target: ownerClient!.account.address,
    }),
  ]);

  return { budget, erc20, erc1155 };
};

export const prepareERC20IncentivePayload = ({
  asset,
  strategy,
  reward,
  limit,
}: {
  asset: Address;
  strategy: number;
  reward: bigint;
  limit: bigint;
}) => {
  return encodeAbiParameters(
    parseAbiParameters([
      "ERC20IncentivePayload payload",
      "struct ERC20IncentivePayload { address asset; uint8 strategy; uint256 reward; uint256 limit; }",
    ]),
    [{ asset, strategy, reward, limit }]
  );
};

export interface ContractActionPayload {
  chainId: bigint;
  target: Address;
  selector: Hex;
  value: bigint;
}

export const prepareSimpleBudgetPayload = ({
  owner,
  authorized,
}: {
  owner: Address;
  authorized: Address[];
}) => {
  return encodeAbiParameters(
    parseAbiParameters([
      "SimpleBudgetPayload payload",
      "struct SimpleBudgetPayload { address owner; address[] authorized; }",
    ]),
    [{ owner, authorized }]
  );
};

export const prepareContractActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return encodeAbiParameters(
    parseAbiParameters([
      "ContractActionPayload payload",
      "struct ContractActionPayload { uint256 chainId; address target; bytes4 selector; uint256 value; }",
    ]),
    [{ chainId, target, selector, value }]
  );
};

export const prepareERC721MintActionPayload = ({
  chainId,
  target,
  selector,
  value,
}: ContractActionPayload) => {
  return prepareContractActionPayload({ chainId, target, selector, value });
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

export const mockERC1155 = async (tokenId = 1n, amount = 100n) => {
  const [ownerClient] = await viem.getWalletClients();
  const token = await viem.deployContract("MockERC1155");

  await token.write.mint([ownerClient!.account.address, tokenId, amount]);
  expect(
    await token.read.balanceOf([ownerClient!.account.address, tokenId])
  ).to.equal(amount);

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
