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
  type DeployablePayloadOrAddress,
  type ERC20IncentivePayload,
  type ERC20VariableCriteriaIncentivePayload,
  type ERC20VariableIncentivePayload,
  type EventActionPayload,
  FilterType,
  type ManagedBudget,
  type ManagedBudgetPayload,
  type PointsIncentivePayload,
  PrimitiveType,
  Roles,
  SignatureType,
  type SignerValidatorPayload,
  type SimpleAllowListPayload,
  type SimpleDenyListPayload,
  StrategyType,
  allowListFromAddress,
} from '@boostxyz/sdk';
import { MockERC20 } from '@boostxyz/test/MockERC20';
import { accounts } from '@boostxyz/test/accounts';
import type { DeployableTestOptions } from '@boostxyz/test/helpers';
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
import { z } from 'zod';
import { type Command, type Options, getDeployableOptions } from '../utils';
export type SeedResult = {
  erc20?: Address;
  boostIds?: string[];
};

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

  let sharedBudget: ManagedBudget | undefined;
  let sharedBudgetConfig: ManagedBudgetPayload | undefined;
  const boostIds: string[] = [];
  for (const template of templates) {
    let budget: ManagedBudget;
    if (typeof template.budget === 'string' && isAddress(template.budget))
      budget = core.ManagedBudget(template.budget);
    // TODO: create budget from Core
    else if (deepEqual(sharedBudgetConfig, template.budget) && sharedBudget) {
      budget = sharedBudget;
    } else {
      const payload = {
        ...template.budget,
        authorized: [...template.budget.authorized, coreAddress],
        roles: [...template.budget.roles, Roles.MANAGER],
      } satisfies ManagedBudgetPayload;
      budget = await registry.initialize(
        crypto.randomUUID(),
        core.ManagedBudget(payload),
      );
      sharedBudget = budget;
      sharedBudgetConfig = template.budget;
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
        case 'ERC20VariableCriteriaIncentive':
          amount += incentive.limit;
          if (incentive.shouldMintAndAllocate)
            await fundBudgetForIncentive(budget, amount, incentive.asset, {
              config,
              account,
            });
          return core.ERC20VariableCriteriaIncentive(incentive);
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
  };
};

async function fundBudgetForIncentive(
  budget: Budget,
  amount: bigint,
  asset: Address,
  options: DeployableTestOptions,
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

const zAbiItemSchema = z.custom<`0x${string}`>().pipe(
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
type BoostConfig = {
  protocolFee: bigint;
  maxParticipants: bigint;
  budget: DeployablePayloadOrAddress<Identifiable<ManagedBudgetPayload>>;
  action: DeployablePayloadOrAddress<Identifiable<EventActionPayload>>;
  validator: DeployablePayloadOrAddress<Identifiable<SignerValidatorPayload>>;
  allowList: DeployablePayloadOrAddress<
    Identifiable<SimpleDenyListPayload> | Identifiable<SimpleAllowListPayload>
  >;
  incentives: (
    | Identifiable<AllowListIncentivePayload>
    | Identifiable<PointsIncentivePayload>
    | (Identifiable<ERC20IncentivePayload> & {
        shouldMintAndAllocate?: boolean;
      })
    | (Identifiable<ERC20VariableCriteriaIncentivePayload> & {
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
});

export const ERC20VariableCriteriaIncentiveSchema = z.object({
  type: z.literal('ERC20VariableCriteriaIncentive'),
  asset: AddressSchema,
  shouldMintAndAllocate: z.boolean().optional().default(false),
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
  budget: z.union([AddressSchema, ManagedBudgetSchema]),
  action: z.union([AddressSchema, EventActionSchema]),
  validator: z.union([AddressSchema, SignerValidatorSchema]).optional(),
  allowList: z
    .union([AddressSchema, SimpleDenyListSchema, SimpleAllowListSchema])
    .optional(),
  incentives: z.array(
    z.union([
      AllowListIncentiveSchema,
      ERC20IncentiveSchema,
      ERC20VariableCriteriaIncentiveSchema,
      ERC20VariableIncentiveSchema,
      CGDAIncentiveSchema,
      PointsIncentiveSchema,
    ]),
  ),
});

async function getAllowList(
  { allowList }: z.infer<typeof BoostSeedConfigSchema>,
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
  options: DeployableTestOptions,
  erc20: MockERC20,
  budget: Budget,
  amount = parseEther('110'),
) {
  await erc20.mint(options.account.address, amount);

  await erc20.approve(budget.assertValidAddress(), amount);
  await budget.allocate({
    amount,
    asset: erc20.assertValidAddress(),
    target: options.account.address,
  });

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
      type: 'ManagedBudget',
      owner: account,
      authorized: [account],
      roles: [Roles.MANAGER],
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
