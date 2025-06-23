import fs from 'node:fs/promises';
import path from 'node:path';
import {
  type AllowList,
  type AllowListIncentivePayload,
  BOOST_CORE_ADDRESSES,
  BOOST_REGISTRY_ADDRESSES,
  BoostCore,
  BoostRegistry,
  type Budget,
  type CGDAIncentivePayload,
  type CreateBoostPayload,
  type DeployableOptions,
  type DeployablePayloadOrAddress,
  type ERC20IncentivePayload,
  type ERC20PeggedVariableCriteriaIncentiveV2Payload,
  type ERC20VariableCriteriaIncentiveV2Payload,
  type ERC20VariableIncentivePayload,
  type EventActionPayload,
  FilterType,
  type LimitedSignerValidatorPayload,
  type ManagedBudget,
  type ManagedBudgetPayload,
  type ManagedBudgetWithFeesV2,
  type ManagedBudgetWithFeesV2Payload,
  type PayableLimitedSignerValidatorPayload,
  type PointsIncentivePayload,
  PrimitiveType,
  Roles,
  SignatureType,
  type SignerValidatorPayload,
  type SimpleAllowListPayload,
  type SimpleDenyListPayload,
  StrategyType,
  ValueType,
  allowListFromAddress,
} from '@boostxyz/sdk';
import { MockERC20 } from '@boostxyz/test/MockERC20';
import { accounts } from '@boostxyz/test/accounts';
import { deepEqual } from '@wagmi/core';
import {
  type Address,
  type Hex,
  isAddress,
  isHex,
  pad,
  parseEther,
  toEventSelector,
  toFunctionSelector,
  zeroAddress,
} from 'viem';
import { type ZodType, type ZodTypeDef, z } from 'zod';
import { type Command, type Options, getDeployableOptions } from '../utils';
export type SeedResult = {
  erc20?: Address;
  boostIds?: string[];
  budget?: Address;
};

export type DeployableWagmiOptions = Required<DeployableOptions>;

const DEFAULT_MNEMONIC =
  'test test test test test test test test test test test junk';

export const seed: Command<SeedResult | BoostConfig> = async function seed(
  positionals,
  options: Options,
) {
  const privateKey = options.privateKey,
    mnemonic = options.mnemonic ?? DEFAULT_MNEMONIC,
    _chain = options.chain || 'anvil';

  const [{ config, account }, chain] = getDeployableOptions({
    chain: _chain,
    rpcUrl: options.rpcUrl,
    privateKey,
    mnemonic,
  });

  const chainId = chain.id;

  if (positionals.at(0) === 'generate') {
    return makeSeed({ account: account?.address, chainId });
  }

  if (positionals.at(0) === 'erc20') {
    let erc20 = new MockERC20({ config, account }, {});
    // @ts-expect-error
    await erc20.deploy();
    return {
      erc20: erc20.assertValidAddress(),
    };
  }

  const registryAddress = BOOST_REGISTRY_ADDRESSES[chainId];
  if (!registryAddress) {
    throw new Error(
      `Unable to select a deployed BoostRegistry with chain ID ${chainId}`,
    );
  }

  const registry = new BoostRegistry({
    config,
    account,
    address: registryAddress,
  });

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

  if (!positionals.length) throw new Error('No seed provided');
  const templates = await Promise.all(positionals.map(getSeed));

  let sharedBudget: ManagedBudget | ManagedBudgetWithFeesV2 | undefined;
  let sharedBudgetConfig: ManagedBudgetPayload | undefined;
  const boostIds: string[] = [];
  let budgetAddress: Address | undefined;
  for (const template of templates) {
    let budget: ManagedBudget | ManagedBudgetWithFeesV2;
    if (typeof template.budget === 'string' && isAddress(template.budget))
      budget = core.ManagedBudget(template.budget);
    // TODO: create budget from Core
    else if (deepEqual(sharedBudgetConfig, template.budget) && sharedBudget) {
      budget = sharedBudget;
    } else {
      let budgetTemplate = template.budget;
      switch (budgetTemplate.type) {
        case 'ManagedBudget': {
          const payload = {
            ...budgetTemplate,
            authorized: [...template.budget.authorized, coreAddress],
            roles: [...template.budget.roles, Roles.MANAGER],
          } satisfies ManagedBudgetPayload;
          budget = await registry.initialize(
            crypto.randomUUID(),
            core.ManagedBudget(payload),
          );
        }
        case 'ManagedBudgetWithFeesV2': {
          const payload = {
            managementFee: 0n,
            ...budgetTemplate,
            authorized: [...template.budget.authorized, coreAddress],
            roles: [...template.budget.roles, Roles.MANAGER],
          } satisfies ManagedBudgetWithFeesV2Payload;
          budget = await registry.initialize(
            crypto.randomUUID(),
            core.ManagedBudgetWithFeesV2(payload),
          );
        }
      }
      sharedBudget = budget;
      sharedBudgetConfig = template.budget;
      budgetAddress = budget.assertValidAddress();
    }

    const incentivePromises = template.incentives.map(async (incentive) => {
      let amount = 0n;
      switch (incentive.type) {
        case 'AllowListIncentive':
          return core.AllowListIncentive(incentive);
        case 'PointsIncentive':
          return core.PointsIncentive(incentive);
        case 'ERC20Incentive':
          if (incentive.strategy === StrategyType.RAFFLE) {
            amount += incentive.reward;
          }
          if (incentive.strategy === StrategyType.POOL) {
            amount += incentive.reward * incentive.limit;
          }
          if (incentive.shouldMintAndAllocate)
            await fundBudgetForIncentive(budget, amount, incentive.asset, {
              config,
              account,
            });
          return core.ERC20Incentive(incentive);
        case 'ERC20VariableCriteriaIncentiveV2':
          amount += incentive.limit;
          if (incentive.shouldMintAndAllocate)
            await fundBudgetForIncentive(budget, amount, incentive.asset, {
              config,
              account,
            });
          return core.ERC20VariableCriteriaIncentiveV2(incentive);
        case 'ERC20PeggedVariableCriteriaIncentiveV2':
          amount += incentive.limit;
          if (incentive.shouldMintAndAllocate)
            await fundBudgetForIncentive(budget, amount, incentive.asset, {
              config,
              account,
            });
          return core.ERC20PeggedVariableCriteriaIncentiveV2(incentive);
        case 'ERC20VariableIncentive':
          amount += incentive.limit;
          if (incentive.shouldMintAndAllocate)
            await fundBudgetForIncentive(budget, amount, incentive.asset, {
              config,
              account,
            });
          return core.ERC20VariableIncentive(incentive);
        case 'CGDAIncentive':
          amount += incentive.totalBudget;
          if (incentive.shouldMintAndAllocate)
            await fundBudgetForIncentive(budget, amount, incentive.asset, {
              config,
              account,
            });
          return core.CGDAIncentive(incentive);
      }
    });

    const incentives = await Promise.all(incentivePromises);

    const boostConfig: CreateBoostPayload = {
      protocolFee: template.protocolFee,
      maxParticipants: template.maxParticipants,
      budget: budget,
      action: core.EventAction(template.action),
      allowList: await getAllowList(template, { core }),
      incentives,
    };

    if (template.validator) {
      boostConfig.validator = core.SignerValidator(template.validator);
    }

    const boost = await core.createBoost(boostConfig);
    boostIds.push(boost.id.toString());
  }

  return {
    boostIds,
    budget: budgetAddress,
  };
};

async function fundBudgetForIncentive(
  budget: Budget,
  amount: bigint,
  asset: Address,
  options: DeployableWagmiOptions,
) {
  if (asset && amount) {
    let erc20 = new MockERC20(options, asset);
    await fundBudget(options, erc20, budget, parseEther(amount.toString()));
  }
}

async function getSeed(seedPath: string) {
  const unparsedPayload = await fs.readFile(path.normalize(seedPath), {
    encoding: 'utf8',
  });

  return BoostSeedConfigSchema.parse(JSON.parse(unparsedPayload));
}

const zHexSchema = z.custom<`0x${string}`>(isHex, 'invalid Hex payload');

const AddressSchema = z
  .string()
  .transform((val, ctx) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;

    if (!regex.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid Address ${val}`,
      });
    }

    return val;
  })
  .pipe(z.custom<Address>(isAddress, 'invalid eth address'));

const ManagedBudgetRoleSchema = z.coerce
  .number()
  .min(1)
  .max(2)
  .transform(BigInt)
  .pipe(z.custom<Roles>());

export const ManagedBudgetWithFeesV2Schema = z
  .object({
    type: z.literal('ManagedBudgetWithFeesV2'),
    owner: AddressSchema,
    authorized: z.array(AddressSchema),
    managementFee: z.coerce.bigint().nonnegative().lt(10_000n),
    roles: z.array(ManagedBudgetRoleSchema),
  })
  .refine(
    (b) => b.authorized.length === b.roles.length,
    'length mismatch authorized and roles',
  );

export const ManagedBudgetSchema = z
  .object({
    type: z.literal('ManagedBudget'),
    owner: AddressSchema,
    authorized: z.array(AddressSchema),
    roles: z.array(ManagedBudgetRoleSchema),
  })
  .refine(
    (b) => b.authorized.length === b.roles.length,
    'length mismatch authorized and roles',
  );

const zAbiItemSchema: ZodType<`0x${string}`, ZodTypeDef, string> = z
  .custom<`0x${string}`>()
  .pipe(
    z
      .string()
      .regex(/^(event|function) .*/, {
        message: 'signature must start with `event` or function`',
      })
      .transform((sig) => {
        if (sig.startsWith('function'))
          return pad(toFunctionSelector(sig)) as Hex;
        if (sig.startsWith('event')) return toEventSelector(sig) as Hex;
        throw new Error('unreachable');
      }),
  );

type Identifiable<T> = T & { type: string };
export type BoostConfig = {
  protocolFee: bigint;
  maxParticipants: bigint;
  budget: DeployablePayloadOrAddress<
    Identifiable<ManagedBudgetWithFeesV2Payload>
  >;
  action: DeployablePayloadOrAddress<Identifiable<EventActionPayload>>;
  validator: DeployablePayloadOrAddress<
    | Identifiable<SignerValidatorPayload>
    | Identifiable<LimitedSignerValidatorPayload>
    | Identifiable<PayableLimitedSignerValidatorPayload>
  >;
  allowList: DeployablePayloadOrAddress<
    Identifiable<SimpleDenyListPayload> | Identifiable<SimpleAllowListPayload>
  >;
  incentives: (
    | Identifiable<AllowListIncentivePayload>
    | Identifiable<PointsIncentivePayload>
    | (Identifiable<ERC20IncentivePayload> & {
        shouldMintAndAllocate?: boolean;
      })
    | (Identifiable<ERC20PeggedVariableCriteriaIncentiveV2Payload> & {
        shouldMintAndAllocate?: boolean;
      })
    | (Identifiable<ERC20VariableCriteriaIncentiveV2Payload> & {
        shouldMintAndAllocate?: boolean;
      })
    | (Identifiable<ERC20VariableIncentivePayload> & {
        shouldMintAndAllocate?: boolean;
      })
    | (Identifiable<CGDAIncentivePayload> & {
        shouldMintAndAllocate?: boolean;
      })
  )[];
};

export const ActionClaimantSchema = z.object({
  signatureType: z.nativeEnum(SignatureType),
  signature: zAbiItemSchema,
  fieldIndex: z.number().nonnegative(),
  targetContract: AddressSchema,
  chainid: z.number().nonnegative(),
});

export const ActionStepCriteriaSchema = z.object({
  filterType: z.nativeEnum(FilterType),
  fieldType: z.nativeEnum(PrimitiveType),
  fieldIndex: z.number().nonnegative(),
  filterData: zHexSchema,
});

export const ActionStepSchema = z.object({
  signature: zAbiItemSchema,
  signatureType: z.nativeEnum(SignatureType),
  actionType: z.number().optional(),
  targetContract: AddressSchema,
  chainid: z.number().nonnegative(),
  actionParameter: ActionStepCriteriaSchema,
});

export const EventActionSchema = z.object({
  type: z.literal('EventAction'),
  actionClaimant: ActionClaimantSchema,
  actionSteps: z.array(ActionStepSchema).max(4),
});

export const LimitedSignerValidatorSchema = z.object({
  type: z.literal('LimitedSignerValidator'),
  signers: z.array(AddressSchema),
  validatorCaller: AddressSchema,
  maxClaimCount: z.coerce.number(),
});

export const PayableLimitedSignerValidatorSchema = z.object({
  type: z.literal('PayableLimitedSignerValidator'),
  signers: z.array(AddressSchema),
  validatorCaller: AddressSchema,
  maxClaimCount: z.coerce.number(),
  baseImplementation: AddressSchema,
});

export const SignerValidatorSchema = z.object({
  type: z.literal('SignerValidator'),
  signers: z.array(AddressSchema),
  validatorCaller: AddressSchema,
});

export const SimpleDenyListSchema = z.object({
  type: z.literal('SimpleDenyList'),
  owner: AddressSchema,
  denied: z.array(AddressSchema),
});

export const SimpleAllowListSchema = z.object({
  type: z.literal('SimpleAllowList'),
  owner: AddressSchema,
  allowed: z.array(AddressSchema),
});

export const AllowListIncentiveSchema = z.object({
  type: z.literal('AllowListIncentive'),
  allowList: AddressSchema,
  limit: z.coerce.bigint(),
});

export const ERC20IncentiveSchema = z.object({
  type: z.literal('ERC20Incentive'),
  asset: AddressSchema,
  shouldMintAndAllocate: z.boolean().optional().default(false),
  strategy: z.nativeEnum(StrategyType),
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema.optional(),
});

export const ERC20VariableIncentiveSchema = z.object({
  type: z.literal('ERC20VariableIncentive'),
  asset: AddressSchema,
  shouldMintAndAllocate: z.boolean().optional().default(false),
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema,
});

export const IncentiveCriteriaSchema = z.object({
  criteriaType: z.nativeEnum(SignatureType),
  signature: zAbiItemSchema,
  fieldIndex: z.number().nonnegative(),
  targetContract: AddressSchema,
  valueType: z.nativeEnum(ValueType),
});

export const ERC20VariableCriteriaIncentiveV2Schema = z.object({
  type: z.literal('ERC20VariableCriteriaIncentiveV2'),
  asset: AddressSchema,
  shouldMintAndAllocate: z.boolean().optional().default(false),
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema.optional(),
  criteria: IncentiveCriteriaSchema,
});

export const ERC20PeggedVariableCriteriaIncentiveV2Schema = z.object({
  type: z.literal('ERC20PeggedVariableCriteriaIncentiveV2'),
  asset: AddressSchema,
  shouldMintAndAllocate: z.boolean().optional().default(false),
  maxReward: z.coerce.bigint(),
  peg: AddressSchema,
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: AddressSchema.optional(),
  criteria: IncentiveCriteriaSchema,
});

export const CGDAIncentiveSchema = z.object({
  type: z.literal('CGDAIncentive'),
  asset: AddressSchema,
  shouldMintAndAllocate: z.boolean().optional().default(false),
  initialReward: z.coerce.bigint(),
  rewardDecay: z.coerce.bigint(),
  rewardBoost: z.coerce.bigint(),
  totalBudget: z.coerce.bigint(),
  manager: AddressSchema,
});

export const PointsIncentiveSchema = z.object({
  type: z.literal('PointsIncentive'),
  venue: AddressSchema,
  selector: zAbiItemSchema,
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
});

export const BoostSeedConfigSchema = z.object({
  protocolFee: z.coerce.bigint(),
  maxParticipants: z.coerce.bigint(),
  budget: z.union([
    AddressSchema,
    ManagedBudgetSchema,
    ManagedBudgetWithFeesV2Schema,
  ]),
  action: z.union([AddressSchema, EventActionSchema]),
  validator: z
    .union([
      AddressSchema,
      SignerValidatorSchema,
      LimitedSignerValidatorSchema,
      PayableLimitedSignerValidatorSchema,
    ])
    .optional(),
  allowList: z
    .union([AddressSchema, SimpleDenyListSchema, SimpleAllowListSchema])
    .optional(),
  incentives: z.array(
    z.union([
      AllowListIncentiveSchema,
      ERC20IncentiveSchema,
      ERC20VariableCriteriaIncentiveV2Schema,
      ERC20PeggedVariableCriteriaIncentiveV2Schema,
      ERC20VariableIncentiveSchema,
      CGDAIncentiveSchema,
      PointsIncentiveSchema,
    ]),
  ),
});

export type BoostSeedConfig = z.infer<typeof BoostSeedConfigSchema>;

async function getAllowList(
  { allowList }: BoostSeedConfig,
  { core }: { core: BoostCore },
): Promise<AllowList> {
  if (!allowList) return core.OpenAllowList();
  if (typeof allowList === 'string' && isAddress(allowList))
    return await allowListFromAddress(
      //@ts-expect-error i do what i want
      { config: core._config, account: core._account },
      allowList,
    );
  switch (allowList.type) {
    case 'SimpleAllowList':
      return core.SimpleAllowList(allowList as SimpleAllowListPayload);
    case 'SimpleDenyList':
      return core.SimpleDenyList(allowList as SimpleDenyListPayload);
    default:
      throw new Error('unusupported AllowList: ' + allowList);
  }
}

async function fundBudget(
  options: DeployableWagmiOptions,
  erc20: MockERC20,
  budget: Budget,
  amount = parseEther('110'),
) {
  await erc20.mint(options.account.address, amount);

  await erc20.approve(budget.assertValidAddress(), amount);
  if ('allocate' in budget) {
    await budget.allocate({
      amount,
      asset: erc20.assertValidAddress(),
      target: options.account.address,
    });
  }

  return { budget, erc20 };
}

export function makeSeed({
  asset = '0xf3B2d0E4f2d8F453DBCc278b10e88b20d7f19f8D',
  account = accounts[0].account,
  chainId,
}: {
  asset?: Address;
  account?: Address;
  chainId: number;
}): BoostConfig {
  return {
    protocolFee: 0n,
    maxParticipants: 10n,
    budget: {
      type: 'ManagedBudgetWithFeesV2',
      owner: account,
      authorized: [account],
      roles: [Roles.MANAGER],
      managementFee: 500n,
    },
    action: {
      type: 'EventAction',
      actionClaimant: {
        signatureType: SignatureType.FUNC,
        signature: 'function mint(address to, uint256 amount)' as Hex,
        fieldIndex: 0,
        targetContract: zeroAddress,
        chainid: chainId,
      },
      actionSteps: [
        {
          signature: 'event Minted(address to, uint256 amount)' as Hex,
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
    validator: {
      type: 'SignerValidator',
      signers: [account],
      validatorCaller: account,
    },
    allowList: {
      type: 'SimpleDenyList',
      owner: account,
      denied: [],
    },
    incentives: [
      {
        type: 'ERC20Incentive',
        asset: asset,
        shouldMintAndAllocate: false,
        strategy: 0,
        reward: 1n,
        limit: 1n,
        manager: account,
      },
    ],
  };
}

export async function getCreateBoostPayloadFromBoostConfig(
  seedConfigRaw: unknown,
  core: BoostCore,
) {
  const seedConfig = BoostSeedConfigSchema.parse(seedConfigRaw);
  let budget: ManagedBudgetWithFeesV2;
  if (typeof seedConfig.budget === 'string' && isAddress(seedConfig.budget))
    budget = core.ManagedBudgetWithFeesV2(seedConfig.budget);
  else {
    throw new Error('budget missing');
  }

  const incentives = seedConfig.incentives.map((incentive) => {
    switch (incentive.type) {
      case 'AllowListIncentive':
        return core.AllowListIncentive(incentive);
      case 'PointsIncentive':
        return core.PointsIncentive(incentive);
      case 'ERC20Incentive':
        return core.ERC20Incentive(incentive);
      case 'ERC20VariableCriteriaIncentiveV2':
        return core.ERC20VariableCriteriaIncentiveV2(incentive);
      case 'ERC20PeggedVariableCriteriaIncentiveV2':
        return core.ERC20PeggedVariableCriteriaIncentiveV2(incentive);
      case 'ERC20VariableIncentive':
        return core.ERC20VariableIncentive(incentive);
      case 'CGDAIncentive':
        return core.CGDAIncentive(incentive);
    }
  });

  const boostConfig: CreateBoostPayload = {
    protocolFee: seedConfig.protocolFee,
    maxParticipants: seedConfig.maxParticipants,
    budget: budget,
    action: core.EventAction(seedConfig.action),
    allowList: await getAllowList(seedConfig, { core }),
    incentives,
  };

  if (seedConfig.validator && typeof seedConfig.validator == 'object') {
    switch (seedConfig.validator.type) {
      case 'SignerValidator':
        boostConfig.validator = core.SignerValidator(seedConfig.validator);
        break;
      case 'LimitedSignerValidator':
        boostConfig.validator = core.LimitedSignerValidator(
          seedConfig.validator,
        );
        break;
      case 'PayableLimitedSignerValidator':
        boostConfig.validator = core.PayableLimitedSignerValidator(
          seedConfig.validator,
        );
        break;
      default:
        throw new Error('unsupported Validator: ' + seedConfig.validator);
    }
  }

  return boostConfig;
}
