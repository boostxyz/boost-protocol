import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  type ActionClaimant,
  type ActionStep,
  type AllowList,
  type AllowListIncentivePayload,
  type Budget,
  type Criteria,
  type DeployablePayloadOrAddress,
  type ERC20IncentivePayload,
  type ERC20VariableCriteriaIncentivePayload,
  type ERC20VariableIncentivePayload,
  type EventActionPayload,
  type EventActionPayloadSimple,
  FilterType,
  type ManagedBudgetPayload,
  ManagedBudgetRoles,
  PrimitiveType,
  SignatureType,
  type SignerValidatorPayload,
  type SimpleAllowListPayload,
  type SimpleDenyListPayload,
  StrategyType,
} from '@boostxyz/sdk';
import { MockERC20 } from '@boostxyz/test/MockERC20';
import { accounts } from '@boostxyz/test/accounts';
import {
  type BudgetFixtures,
  type DeployableTestOptions,
  type Fixtures,
  defaultOptions,
  deployFixtures,
  freshManagedBudget,
  fundErc20,
} from '@boostxyz/test/helpers';
import {
  type Address,
  type Hex,
  isAddress,
  isHex,
  pad,
  parseEther,
  size,
  toEventSelector,
  toFunctionSelector,
  zeroAddress,
} from 'viem';
import { type ZodType, type ZodTypeDef, z } from 'zod';
import type { Command, Options } from '../utils';
export type SeedResult = {
  erc20?: Address;
  success?: boolean;
};
export const seed: Command<SeedResult> = async function seed({
  from,
  generateSeed,
  generateERC20,
}: Options) {
  if ((!from || generateSeed) && !generateERC20) {
    const seedLocation = generateSeed ?? './boost_seeds/defaultSeed.json';
    console.warn(
      'writing default seed file to: ',
      path.join(process.cwd(), seedLocation),
    );
    await fs.mkdir(path.dirname(seedLocation), { recursive: true });
    await fs.writeFile(
      seedLocation,
      JSON.stringify(defaultBoostSeed, bigintReplacer, 2),
    );
    return {};
  }

  if (generateERC20) {
    let erc20 = new MockERC20(defaultOptions, {});
    await erc20.deploy();
    return {
      erc20: erc20.assertValidAddress(),
    };
  }

  if (!from) throw new Error('No seed provided');
  const parseResult = await getSeed(from);

  const fixtures = await deployFixtures(defaultOptions)();

  const { budget } = await fundBudget(
    defaultOptions,
    fixtures,
    new MockERC20(defaultOptions, parseResult.asset),
  );

  const incentivePromises = parseResult.incentives.map(async (incentive) => {
    await fundBudgetForIncentive(fixtures, budget, incentive);
    return fixtures.core.ERC20Incentive(incentive);
  });

  const incentives = await Promise.all(incentivePromises);

  await fixtures.core.createBoost({
    protocolFee: parseResult.protocolFee,
    maxParticipants: parseResult.maxParticipants,
    budget,
    action: fixtures.core.EventAction(parseResult.action),
    validator: fixtures.core.SignerValidator(parseResult.validator),
    allowList: getAllowList(parseResult, fixtures),
    incentives,
  });

  return {
    success: true,
  };
};

async function fundBudgetForIncentive(
  fixtures: Fixtures,
  budget: Budget,
  { asset, limit }: { asset?: Address; limit?: bigint },
) {
  if (asset && limit) {
    let erc20 = new MockERC20(defaultOptions, asset);
    await fundBudget(
      defaultOptions,
      fixtures,
      erc20,
      budget,
      parseEther(limit.toString()),
    );
  }
}

async function getSeed(seedPath: string) {
  const unparsedPayload = await fs.readFile(path.normalize(seedPath), {
    encoding: 'utf8',
  });

  return zBoostConfigSeed.parse(JSON.parse(unparsedPayload));
}

const defaultBoostSeed: BoostConfig = {
  asset: '0x0BbfcD7a557FFB8A70CB0948FF680F0E573bbFf2',
  protocolFee: 12n,
  maxParticipants: 50n,
  budget: {
    type: 'ManagedBudget',
    owner: accounts[0].account,
    authorized: [accounts[0].account],
    roles: [ManagedBudgetRoles.MANAGER],
  },
  action: {
    type: 'EventAction',
    actionClaimant: {
      signatureType: SignatureType.FUNC,
      signature: 'function mint(address to, uint256 amount)' as Hex,
      fieldIndex: 0,
      targetContract: zeroAddress,
      chainid: 1,
    },
    actionSteps: [
      {
        signature: 'event Minted(address to, uint256 amount)' as Hex,
        signatureType: SignatureType.FUNC,
        actionType: 0,
        targetContract: zeroAddress,
        chainid: 1,
        actionParameter: {
          filterType: FilterType.EQUAL,
          fieldType: PrimitiveType.ADDRESS,
          fieldIndex: 0,
          filterData: zeroAddress,
        },
      },
    ],
  },
  validator: {
    type: 'SignerValidator',
    signers: [accounts[0].account],
    validatorCaller: accounts[0].account,
  },
  allowList: {
    type: 'SimpleDenyList',
    owner: accounts[0].account,
    denied: [],
  },
  incentives: [
    {
      type: 'ERC20Incentive',
      asset: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      strategy: 0,
      reward: 1n,
      limit: 1n,
      manager: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    },
  ],
};

type Identifiable<T> = T & { type: string };
type BoostConfig = {
  asset: Address;
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
    | Identifiable<ERC20IncentivePayload>
    | Identifiable<ERC20VariableCriteriaIncentivePayload>
    | Identifiable<ERC20VariableIncentivePayload>
  )[];
};

const zAddressSchema = z.custom<Address>(isAddress, 'invalid eth address');

const zAbiItemSchema = z.custom<`0x${string}`>().pipe(
  z
    .string()
    .regex(/^(event|function) .*/, {
      message: 'signature must start with `event` or function`',
    })
    .transform((sig) => {
      if (sig.startsWith('event')) return pad(toFunctionSelector(sig)) as Hex;
      if (sig.startsWith('function')) return toEventSelector(sig) as Hex;
      throw new Error('unreachable');
    }),
);

const zHexSchema = z.custom<`0x${string}`>(isHex, 'invalid Hex payload');

const zManagedBudgetRoleSchema = z.coerce
  .number()
  .min(1)
  .max(2)
  .transform(BigInt)
  .pipe(z.custom<ManagedBudgetRoles>());

export const zManagedBudget: z.ZodSchema<Identifiable<ManagedBudgetPayload>> = z
  .object({
    type: z.literal('ManagedBudget'),
    owner: zAddressSchema,
    authorized: z.array(zAddressSchema),
    roles: z.array(zManagedBudgetRoleSchema),
  })
  .refine(
    (b) => b.authorized.length === b.roles.length,
    'length mismatch authorized and roles',
  );

export const zActionClaimant: z.ZodSchema<ActionClaimant> = z.object({
  signatureType: z.nativeEnum(SignatureType),
  signature: zAbiItemSchema,
  fieldIndex: z.number().nonnegative(),
  targetContract: zAddressSchema,
  chainid: z.number().nonnegative(),
});

export const zActionStepCriteria: z.ZodSchema<Criteria> = z.object({
  filterType: z.nativeEnum(FilterType),
  fieldType: z.nativeEnum(PrimitiveType),
  fieldIndex: z.number().nonnegative(),
  filterData: zHexSchema,
});

export const zActionStep: z.ZodSchema<ActionStep> = z.object({
  signature: zAbiItemSchema,
  signatureType: z.nativeEnum(SignatureType),
  actionType: z.number().optional(),
  targetContract: zAddressSchema,
  chainid: z.number().nonnegative(),
  actionParameter: zActionStepCriteria,
});

export const zEventActionSeed: z.ZodSchema<
  Identifiable<EventActionPayloadSimple>
> = z.object({
  type: z.literal('EventAction'),
  actionClaimant: zActionClaimant,
  actionSteps: z.array(zActionStep).max(4),
});

export const zSignerValidatorSeed: z.ZodSchema<
  Identifiable<SignerValidatorPayload>
> = z.object({
  type: z.literal('SignerValidator'),
  signers: z.array(zAddressSchema),
  validatorCaller: zAddressSchema,
});

export const zSimpleDenyListSeed: z.ZodSchema<
  Identifiable<SimpleDenyListPayload>
> = z.object({
  type: z.literal('SimpleDenyList'),
  owner: zAddressSchema,
  denied: z.array(zAddressSchema),
});

export const zSimpleAllowListSeed: z.ZodSchema<
  Identifiable<SimpleAllowListPayload>
> = z.object({
  type: z.literal('SimpleAllowList'),
  owner: zAddressSchema,
  allowed: z.array(zAddressSchema),
});

export const zERC20IncentiveSeed: z.ZodSchema<
  Identifiable<ERC20IncentivePayload>
> = z.object({
  type: z.literal('ERC20Incentive'),
  asset: zAddressSchema,
  strategy: z.nativeEnum(StrategyType),
  reward: z.coerce.bigint(),
  limit: z.coerce.bigint(),
  manager: zAddressSchema.optional(),
});

export const zBoostConfigSeed: z.ZodType<BoostConfig> = z.object({
  asset: zAddressSchema,
  protocolFee: z.coerce.bigint(),
  maxParticipants: z.coerce.bigint(),
  budget: z.union([zAddressSchema, zManagedBudget]),
  action: z.union([zAddressSchema, zEventActionSeed]),
  validator: z.union([zAddressSchema, zSignerValidatorSeed]),
  allowList: z.union([
    zAddressSchema,
    zSimpleDenyListSeed,
    zSimpleAllowListSeed,
  ]),
  incentives: z.array(zERC20IncentiveSeed).max(8),
  /*
  incentives: z.array(z.union([
    zAllowListIncentiveSeed,
    zERC20IncentiveSeed,
    zERC20VariableCriteriaIncentiveSeed,
    zERC20VariableIncentiveSeed,
  ])),
  */
});

function getAllowList(
  { allowList }: z.infer<typeof zBoostConfigSeed>,
  { core }: Fixtures,
): AllowList {
  switch (allowList.type) {
    case 'SimpleAllowList':
      return core.SimpleAllowList(allowList);
    case 'SimpleDenyList':
      return core.SimpleDenyList(allowList);
    default:
      throw new Error('unusupported AllowList:,' + allowList);
  }
}

async function fundBudget(
  options: DeployableTestOptions,
  fixtures: Fixtures,
  erc20: MockERC20,
  budget?: Budget,
  amount = parseEther('110'),
) {
  if (!budget) budget = await freshManagedBudget(options, fixtures)();
  //await fundErc20(options, erc20, [], parseEther(amount.toString()))();
  console.log(`minting ${amount} to ${options.account.address}`);
  await erc20.mint(options.account.address, amount);

  await erc20.approve(budget.assertValidAddress(), amount);
  await budget.allocate({
    amount,
    asset: erc20.assertValidAddress(),
    target: options.account.address,
  });

  return { budget, erc20 } as BudgetFixtures;
}

const bigintReplacer = (_: string, value: unknown) =>
  typeof value === 'bigint' ? value.toString() : value;
