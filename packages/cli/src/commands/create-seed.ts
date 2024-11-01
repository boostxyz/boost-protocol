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
import type { MockERC20 } from '@boostxyz/test/MockERC20';
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
  isAddress,
  isHex,
  pad,
  parseEther,
  size,
  zeroAddress,
} from 'viem';
import { type ZodType, type ZodTypeDef, z } from 'zod';
import type { Command, Options } from '../utils';
export type SeedResult = {
  success?: boolean;
};
export const seed: Command<SeedResult> = async function seed({
  from,
  generateSeed,
}: Options) {
  if (!from || generateSeed) {
    const seedLocation = generateSeed ?? './boost_seeds/defaultSeed.json';
    console.warn(
      'writing default seed file to: ',
      path.join(process.cwd(), seedLocation),
    );
    await fs.mkdir(path.dirname(seedLocation), { recursive: true });
    await fs.writeFile(
      seedLocation,
      JSON.stringify(defaultBoostConfig, bigintReplacer, 2),
    );
    return {};
  }

  const parseResult = await getSeed(from);

  const fixtures = await deployFixtures(defaultOptions)();
  const { budget } = await fundBudget(defaultOptions, fixtures);

  console.log({ parseResult });
  await fixtures.core.createBoost({
    protocolFee: parseResult.protocolFee,
    maxParticipants: parseResult.maxParticipants,
    budget,
    action: fixtures.core.EventAction(parseResult.action),
    validator: fixtures.core.SignerValidator(parseResult.validator),
    allowList: getAllowList(parseResult, fixtures),
    incentives: [],
  });

  return {
    success: true,
  };
};

async function getSeed(seedPath: string) {
  const unparsedPayload = await fs.readFile(path.normalize(seedPath), {
    encoding: 'utf8',
  });

  return zBoostConfigSeed.parse(JSON.parse(unparsedPayload));
}

const defaultBoostConfig: BoostConfig = {
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
      signature: pad('0xdeadbeef'),
      fieldIndex: 0,
      targetContract: zeroAddress,
      chainid: 1,
    },
    actionSteps: [
      {
        signature: pad('0xdeadbeef'),
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
  incentives: [],
};

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
    | Identifiable<ERC20IncentivePayload>
    | Identifiable<ERC20VariableCriteriaIncentivePayload>
    | Identifiable<ERC20VariableIncentivePayload>
  )[];
};

const zAddressSchema = z.custom<Address>(isAddress, 'invalid eth address');

const zSignatureSchema = z.custom<`0x${string}`>(
  (val) => isHex(val) && size(val) === 32,
  'invalid signature',
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
  signature: zSignatureSchema,
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
  signature: zSignatureSchema,
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
});

export const zBoostConfigSeed: z.ZodType<BoostConfig> = z.object({
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
  budget?: Budget,
  erc20?: MockERC20,
  amount = 110n,
) {
  if (!budget) budget = await freshManagedBudget(options, fixtures)();
  if (!erc20) erc20 = await fundErc20(options)();

  await budget.allocate(
    {
      amount: parseEther('1.0'),
      asset: zeroAddress,
      target: options.account.address,
    },
    { value: parseEther('1.0') },
  );

  await erc20.approve(
    budget.assertValidAddress(),
    parseEther(amount.toString()),
  );
  await budget.allocate({
    amount: parseEther('110'),
    asset: erc20.assertValidAddress(),
    target: options.account.address,
  });

  return { budget, erc20 } as BudgetFixtures;
}

const bigintReplacer = (_: string, value: unknown) =>
  typeof value === 'bigint' ? value.toString() : value;
