import fs from "node:fs/promises";
import path from "node:path";
import {
  type AllowList,
  type AllowListIncentivePayload,
  BOOST_CORE_ADDRESS,
  BOOST_CORE_ADDRESSES,
  BoostCore,
  type Budget,
  type ERC20IncentivePayload,
  type ERC20VariableCriteriaIncentivePayload,
  type ERC20VariableIncentivePayload,
  type EventActionPayload,
  FilterType,
  type ManagedBudget,
  type ManagedBudgetPayload,
  PrimitiveType,
  Roles,
  SignatureType,
  type SignerValidatorPayload,
  type SimpleAllowListPayload,
  type SimpleDenyListPayload,
  StrategyType,
  allowListFromAddress,
} from "@boostxyz/sdk";
import { MockERC20 } from "@boostxyz/test/MockERC20";
import { accounts } from "@boostxyz/test/accounts";
import {
  type BudgetFixtures,
  type DeployableTestOptions,
  type Fixtures,
  defaultOptions,
  freshManagedBudget,
  fundErc20,
} from "@boostxyz/test/helpers";
import { Address as AddressSchema, SolidityBytes } from "abitype/zod";
import {
  type Address,
  type Hex,
  isAddress,
  pad,
  parseEther,
  toEventSelector,
  toFunctionSelector,
  zeroAddress,
} from "viem";
import * as _chains from "viem/chains";
import { z } from "zod";
import { type Command, type Options, getDeployableOptions } from "../utils";

const chains = _chains as Record<string, _chains.Chain>;

export type SeedResult = {
  erc20?: Address;
  success?: boolean;
};

export const seed: Command<any> = async function seed(
  positionals,
  options: Options,
) {
  const privateKey = options.privateKey,
    mnemonic = options.mnemonic,
    _chain = options.chain;
  if (!privateKey && !mnemonic)
    throw new Error(
      "Must provide `--privateKey` or `--mnemonic` to deploy contracts",
    );
  if (!_chain || !chains[_chain])
    throw new Error(
      `Must provide valid \`--chain\` to specify target deployment chain, valid chains are ${Object.keys(chains)}`,
    );
  const [{ config, account }, chain] = getDeployableOptions({
    chain: _chain,
    privateKey,
    mnemonic,
  });
  const chainId = chain!.id!;

  if (positionals.at(0) === "generate") {
    return makeSeed({ account: account?.address, chainId });
  }

  if (positionals.at(0) === "erc20") {
    return;
  }

  const coreAddress = BOOST_CORE_ADDRESSES[chainId];
  if (!coreAddress) {
    throw new Error(
      `Unable to select a deployed BoostCore with chain ID ${chainId}`,
    );
  }

  const core = new BoostCore({
    config,
    account,
    address: coreAddress,
  });

  if (!positionals.length) throw new Error("No seed provided");
  const templates = await Promise.all(positionals.map(getSeed));

  const assets: Record<Address, bigint> = {};

  for (const template of templates) {
    const incentives = template.incentives.map((incentive) => {
      const asset = (incentive as any).asset as Address;
      if (!assets[asset]) assets[asset] = 0n;
      switch (incentive.type) {
        case "AllowListIncentive":
          return core.AllowListIncentive(incentive);
        case "ERC20Incentive":
          if (incentive.strategy === StrategyType.RAFFLE) {
            assets[asset] += incentive.reward;
          }
          if (incentive.strategy === StrategyType.POOL) {
            assets[asset] += incentive.reward * incentive.limit;
          }
          return core.ERC20Incentive(incentive);
        case "ERC20VariableCriteriaIncentive":
          assets[asset] += incentive.limit;
          return core.ERC20VariableCriteriaIncentive(incentive);
        case "ERC20VariableIncentive":
          assets[asset] += incentive.limit;
          return core.ERC20VariableIncentive(incentive);
      }
    });

    let budget: Address | ManagedBudget;
    if (typeof template.budget === "string" && isAddress(template.budget))
      budget = template.budget;
    const result = await fundBudget(
      defaultOptions,
      fixtures,
      new MockERC20(defaultOptions, template.asset),
    );
    budget = result.budget;

    await core.createBoost({
      protocolFee: template.protocolFee,
      maxParticipants: template.maxParticipants,
      budget: template.budget,
      action: core.EventAction(template.action as EventActionPayload),
      validator: core.SignerValidator(template.validator),
      allowList: await getAllowList(template, { core }),
      incentives,
    });
  }

  return {
    success: true,
  };
};

async function getSeed(seedPath: string) {
  const unparsedPayload = await fs.readFile(path.normalize(seedPath), {
    encoding: "utf8",
  });

  return BoostSeedConfigSchema.parse(JSON.parse(unparsedPayload));
}

export function makeSeed({
  asset = "0xf3B2d0E4f2d8F453DBCc278b10e88b20d7f19f8D",
  account = accounts[0].account,
  chainId = 11155111,
}: {
  asset?: Address;
  account?: Address;
  chainId: number;
}): BoostConfig {
  return {
    protocolFee: 0n,
    maxParticipants: 10n,
    budget: {
      type: "ManagedBudget",
      owner: account,
      authorized: [account],
      roles: [Roles.MANAGER],
    },
    action: {
      type: "EventAction",
      actionClaimant: {
        signatureType: SignatureType.FUNC,
        signature: "function mint(address to, uint256 amount)" as Hex,
        fieldIndex: 0,
        targetContract: zeroAddress,
        chainid: chainId,
      },
      actionSteps: [
        {
          signature: "event Minted(address to, uint256 amount)" as Hex,
          signatureType: SignatureType.FUNC,
          actionType: 0,
          targetContract: zeroAddress,
          chainid: chainId,
          actionParameter: {
            filterType: FilterType.EQUAL,
            fieldType: PrimitiveType.ADDRESS,
            fieldIndex: 0,
            filterData: account,
          },
        },
      ],
    },
    validator: undefined,
    allowList: {
      type: "SimpleDenyList",
      owner: account,
      denied: [],
    },
    incentives: [
      {
        type: "ERC20Incentive",
        asset: asset,
        strategy: 0,
        reward: 1n,
        limit: 1n,
        manager: account,
      },
    ],
  };
}

type Identifiable<T> = T & { type: string };
type BoostConfig = {
  protocolFee: bigint;
  maxParticipants: bigint;
  budget: Address | Identifiable<ManagedBudgetPayload>;
  action: Address | Identifiable<EventActionPayload>;
  validator?: Address | Identifiable<SignerValidatorPayload>;
  allowList:
    | Address
    | Identifiable<SimpleDenyListPayload | SimpleAllowListPayload>;
  incentives: Identifiable<
    | AllowListIncentivePayload
    | ERC20IncentivePayload
    | ERC20VariableCriteriaIncentivePayload
    | ERC20VariableIncentivePayload
  >[];
};

const RolesSchema = z.coerce
  .number()
  .min(1)
  .max(2)
  .transform(BigInt)
  .pipe(z.custom<Roles>());

export const ManagedBudgetSchema = z
  .object({
    type: z.literal("ManagedBudget"),
    owner: AddressSchema,
    authorized: z.array(AddressSchema),
    roles: z.array(RolesSchema),
  })
  .refine(
    (b) => b.authorized.length === b.roles.length,
    "length mismatch authorized and roles",
  );

const AbiSignatureSchema = z.custom<`0x${string}`>().pipe(
  z
    .string()
    .regex(/^(event|function) .*/, {
      message: "signature must start with `event` or function`",
    })
    .transform((sig: string) => {
      if (sig.startsWith("event")) return pad(toFunctionSelector(sig)) as Hex;
      if (sig.startsWith("function")) return toEventSelector(sig) as Hex;
      throw new Error("unreachable");
    }),
);

export const ActionClaimantSchema = z.object({
  signatureType: z.nativeEnum(SignatureType),
  signature: AbiSignatureSchema,
  fieldIndex: z.number().nonnegative(),
  targetContract: AddressSchema,
  chainid: z.number().nonnegative(),
});

export const ActionStepCriteriaSchema = z.object({
  filterType: z.nativeEnum(FilterType),
  fieldType: z.nativeEnum(PrimitiveType),
  fieldIndex: z.number().nonnegative(),
  filterData: SolidityBytes,
});

export const ActionStepSchema = z.object({
  signature: AbiSignatureSchema,
  signatureType: z.nativeEnum(SignatureType),
  actionType: z.number().optional(),
  targetContract: AddressSchema,
  chainid: z.number().nonnegative(),
  actionParameter: ActionStepCriteriaSchema,
});

export const EventActionSchema = z.object({
  type: z.literal("EventAction"),
  actionClaimant: ActionClaimantSchema,
  actionSteps: z.array(ActionStepSchema).max(4),
});

export const SignerValidatorSchema = z.object({
  type: z.literal("SignerValidator"),
  signers: z.array(AddressSchema),
  validatorCaller: AddressSchema,
});

export const SimpleDenyListSchema = z.object({
  type: z.literal("SimpleDenyList"),
  owner: AddressSchema,
  denied: z.array(AddressSchema),
});

export const SimpleAllowListSchema = z.object({
  type: z.literal("SimpleAllowList"),
  owner: AddressSchema,
  allowed: z.array(AddressSchema),
});

export const AllowListIncentiveSchema = z.object({
  type: z.literal("AllowListIncentive"),
  allowList: AddressSchema,
  limit: z.coerce.bigint(),
});

export const ERC20IncentiveSchema = z.object({
  type: z.literal("ERC20Incentive"),
  asset: AddressSchema,
  strategy: z.nativeEnum(StrategyType),
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema.optional(),
});

export const ERC20VariableIncentiveSchema = z.object({
  type: z.literal("ERC20VariableIncentive"),
  asset: AddressSchema,
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema,
});

export const IncentiveCriteriaSchema = z.object({
  criteriaType: z.nativeEnum(SignatureType),
  signature: AbiSignatureSchema,
  fieldIndex: z.number().nonnegative(),
  targetContract: AddressSchema,
});

export const ERC20VariableCriteriaIncentiveSchema = z.object({
  type: z.literal("ERC20VariableCriteriaIncentive"),
  asset: AddressSchema,
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema.optional(),
  criteria: IncentiveCriteriaSchema,
});

export const BoostSeedConfigSchema = z.object({
  protocolFee: z.coerce.bigint(),
  maxParticipants: z.coerce.bigint(),
  budget: z.union([AddressSchema, ManagedBudgetSchema]),
  action: z.union([AddressSchema, EventActionSchema]),
  validator: z.union([AddressSchema, SignerValidatorSchema]),
  allowList: z.union([
    AddressSchema,
    SimpleDenyListSchema,
    SimpleAllowListSchema,
  ]),
  incentives: z.array(
    z.union([
      AllowListIncentiveSchema,
      ERC20IncentiveSchema,
      ERC20VariableCriteriaIncentiveSchema,
      ERC20VariableIncentiveSchema,
    ]),
  ),
});

async function getAllowList(
  { allowList }: z.infer<typeof BoostSeedConfigSchema>,
  { core }: { core: BoostCore },
): Promise<AllowList> {
  if (typeof allowList === "string" && isAddress(allowList))
    return await allowListFromAddress(
      //@ts-expect-error i do what i want
      { config: core._config, account: core._account },
      allowList,
    );
  switch (allowList.type) {
    case "SimpleAllowList":
      return core.SimpleAllowList(allowList as SimpleAllowListPayload);
    case "SimpleDenyList":
      return core.SimpleDenyList(allowList as SimpleDenyListPayload);
    default:
      throw new Error("unusupported AllowList:," + allowList);
  }
}

async function fundBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
  erc20: MockERC20,
  budget?: Budget,
  amount = 110n,
) {
  if (!budget) budget = await freshManagedBudget(options, fixtures)();
  await fundErc20(options, erc20, [], parseEther(amount.toString()))();

  await budget.allocate(
    {
      amount: parseEther("1.0"),
      asset: zeroAddress,
      target: options.account.address,
    },
    { value: parseEther("1.0") },
  );

  await erc20.approve(
    budget.assertValidAddress(),
    parseEther(amount.toString()),
  );
  await budget.allocate({
    amount: parseEther(amount.toString()),
    asset: erc20.assertValidAddress(),
    target: options.account.address,
  });

  return { budget, erc20 } as BudgetFixtures;
}
