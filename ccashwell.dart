ccashwell
ccashwell
  3 months ago

// Option 1: build a Boost object manually:
const boost = new Boost();
boost.action = new ERC20Action(...);
boost.incentives.push(new ERC20Incentive(...));
boost.budget = SimpleBudget.at(...);
boost.validator = SignerValidator.DEFAULT;

// Option 2: build it inline:
const boost = new Boost({
  action: new ERC20Action(...),
  incentives: [new ERC20Incentive(...)],
  budget: SimpleBudget.at(...),
  validator: SignerValidator.DEFAULT
});

// Option 3: use the BoostBuilder:
const boost = new BoostBuilder()
  .withAction(new ERC20Action(...))
  .withIncentive(new ERC20Incentive(...))
  .withBudget(SimpleBudget.at(...))
  .withValidator(SignerValidator.DEFAULT)
  .build();

// runs validation, then either throws or deploys
await boostClient.deploy(boost);

import {
  AllowListIncentive,
  ERC20Incentive,
  ERC721MintAction,
  SignerValidator,
  SimpleAllowList,
  SimpleBudget,
  chains,
  client,
  parseEther,
} from "@rabbitholegg/boost-sdk";

import { account, publicClient, walletClient } from "./config";

const boostClient = client({
  account,
  publicClient,
  walletClient,
});

const simpleBudget = await boostClient.deploy(
  new SimpleBudget({
    amount: parseEther("500"),
    asset: chains.arbitrum.tokens.arbToken,
  }),
);

const boost = await boostClient.createBoost({
  action: new ERC721MintAction({
    contract: "0xCcC...",
    function: "mint(address,uint256)",
    value: parseEther("0.1"),
  }),
  budget: simpleBudget,
  incentives: [
    new AllowListIncentive({
      allowList: SimpleAllowList.at("0xAbA..."),
    }),
    new ERC20Incentive({
      amount: parseEther("2.5"),
      asset: chains.arbitrum.tokens.arbToken,
    }),
  ],
  validator: SignerValidator.DEFAULT,
});
