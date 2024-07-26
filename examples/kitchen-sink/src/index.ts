import {
  BoostCore,
  BoostRegistry,
  ERC20Incentive,
  SimpleAllowList,
  SimpleDenyList,
  StrategyType,
  prepareSignerValidatorValidatePayload,
} from '@boostxyz/sdk';
import { createConfig, signMessage } from '@wagmi/core';
import {
  http,
  createTestClient,
  encodePacked,
  keccak256,
  parseEther,
  publicActions,
  walletActions,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { MockERC20 } from './MockERC20';

// Use a local test account
const key =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const account = privateKeyToAccount(key);

// Set up viem client
const client = createTestClient({
  transport: http(undefined, { retryCount: 0 }),
  chain: hardhat,
  mode: 'hardhat',
  account,
  key,
})
  .extend(publicActions)
  .extend(walletActions);

// Set up wagmi client
const config = createConfig({
  chains: [hardhat],
  client: () => client,
});

// Construct registry
const registry = new BoostRegistry({
  config,
  account,
});

// Construct core
const core = new BoostCore({
  config,
  account,
});

const budgetAmount = parseEther('100');

// Deploy a new ERC20
const erc20 = new MockERC20({ config, account }, {});
await erc20.deploy();
await erc20.mint(account.address, budgetAmount);

// Clone the base SimpleBudget
const budget = await registry.clone(
  'MySimpleBudget',
  core.SimpleBudget({
    owner: account.address,
    authorized: [account.address, core.assertValidAddress()],
  }),
);

// Approve the budget to allocate
await erc20.approve(budget.assertValidAddress(), budgetAmount);
await budget.allocate({
  amount: budgetAmount,
  asset: erc20.assertValidAddress(),
  target: account.address,
});

// Create the Boost
const boost = await core.createBoost({
  protocolFee: 1n,
  referralFee: 2n,
  maxParticipants: 100n,
  budget: budget,
  action: core.ContractAction({
    chainId: BigInt(31_337),
    target: core.assertValidAddress(),
    selector: '0xdeadbeef',
    value: 0n,
  }),
  validator: core.SignerValidator({
    signers: [account.address],
  }),
  allowList: core.SimpleAllowList({
    owner: account.address,
    allowed: [account.address],
  }),
  incentives: [
    core.ERC20Incentive({
      asset: erc20.assertValidAddress(),
      reward: parseEther('1'),
      limit: 100n,
      strategy: StrategyType.POOL,
    }),
  ],
});

// Build signature for claim validation
const hash = keccak256(encodePacked(['string'], ['test']));
const signature = await signMessage(config, {
  account: key,
  message: { raw: hash },
});

// Claim 1 ERC20
await core.claimIncentive(
  boost.id,
  0n,
  account.address,
  // The shape of this hash will be different for each validator, right now we only have SignerValidator
  prepareSignerValidatorValidatePayload({
    signer: account.address,
    hash,
    signature,
  }),
);
