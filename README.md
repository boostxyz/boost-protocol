# Boost Protocol

- [Boost Protocol](#boost-protocol)
  - [Overview](#overview)
  - [How It Works](#how-it-works)
    - [Boost Creation](#boost-creation)
    - [Boost Participation](#boost-participation)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
    - [Solidity Development](#solidity-development)
    - [Developing with the SDK](#developing-with-the-sdk)
    - [Changesets \& Publishing](#changesets--publishing)

[![Documentation](https://img.shields.io/badge/documentation-gh--pages-blue)](https://rabbitholegg.github.io/boost-protocol/index.html)
[![Test Status](https://github.com/rabbitholegg/boost-protocol/actions/workflows/verify.yml/badge.svg?branch=main)](https://github.com/rabbitholegg/boost-protocol/actions/workflows/verify.yml)

> [!WARNING]
> Boost Protocol is currently under active development and is not ready for production use. The code and documentation are subject to change. We recommend against building on top of the protocol prior to the first official release.

The Boost Protocol is a permissionless, trustless, and decentralized growth engine for protocol and application developers. It enables developers to bootstrap their projects by leveraging the power of community and the network effect.

Boosts are individual campaigns that are designed to incentivize and reward users for participation in a specific protocol or application. They are designed to be flexible and can be customized to fit the specific needs of the project. Boosts can be used to incentivize a wide range of actions, including but not limited to:

- Swapping, holding, staking, lending, or borrowing various types of assets
- Voting, delegating, or creating governance proposals
- Minting, acquiring, burning, or listing NFTs
- Engaging in yield farming or liquidity mining
- Contributing to liquidity pools
- Promoting protocol growth and adoption
- Performing protocol-specific actions
- ... and so much more

## Overview

The Boost Protocol is built on top of the Ethereum Virtual Machine and leverages the power of smart contracts to create a trustless and decentralized system. The protocol is designed to be modular and flexible, allowing developers to create custom Boosts that fit the specific needs of their project.

The Boost Protocol is composed of the following components:

- **Boost Core** is a smart contract that facilitates the creation and management of Boosts. It is responsible for managing Boost parameters, tracking user participation, and distributing rewards. It is the glue that holds the entire Boost Protocol together.

- **Boost Registry** is a smart contract that maintains a registry of the base implementations for Boost Actions, Boost Incentives, Boost Validators, Boost Budgets, and Boost AllowLists. This allows developers to create custom implementations and register them with the Boost Registry, making them available for use in Boosts. It also promotes code reuse and standardization across the protocol.

- **Boost Actions** are smart contracts that define the specific actions that users must take to complete a Boost. They are designed to be modular and can be customized to fit the specific needs of the Boost. Examples of Boost Actions include swapping tokens, staking assets, and contributing to liquidity pools.

- **Boost Incentives** are smart contracts that define the specific rewards that users can earn by participating in a Boost. Examples of Boost Incentives include earning tokens, receiving NFTs, and participating in airdrops.

// TODO NOTES - Add information on how reward/limit work contextually

- **Boost Validators** are smart contracts that validate user participation in a Boost and unlock access to its incentives. They are responsible for verifying that users have completed the required actions and are eligible to receive rewards. Examples of Boost Validator logic includes signature verifications, on-chain data validation, and validation of merkle and ZK proofs.

- **Boost Budgets** are smart contracts that control the allocation of incentives for a Boost. Examples of Boost Budgets include simple fixed allocations, dynamic allocations based on user participation, and allocations based on vesting schedules.

- **Boost AllowLists** are smart contracts that control access to a Boost. They are responsible for defining the eligibility criteria for participation in a Boost. Examples of Boost AllowList criteria include whitelists, blacklists, asset holdings, and prior participation in other Boosts.

## How It Works

The Boost Protocol is designed to be flexible and customizable, allowing developers to create custom Boosts that fit the specific needs of their project. The process of creating and participating in a Boost typically involves the following steps:

### Boost Creation

1. **Create a Budget**: Before a Boost can be created, the creator needs a budget from which incentives can be allocated. [Budgets](https://rabbitholegg.github.io/boost-protocol/src/budgets/index.html) can be fixed, dynamic, or based on a vesting schedule, and they control the allocation of incentives for Boosts. They can hold native tokens, ERC20s and ERC1155s, and they're reusable across multiple Boosts.

2. **Create a Boost**: A Boost is a targeted campaign to incentivize a certain type of engagement by offering rewards to participating users. Boosts are created using the Boost Core smart contract and can be customized to fit the needs of nearly any use case. Boost creators can choose from a variety of pre-built [*Actions*](https://rabbitholegg.github.io/boost-protocol/src/actions/index.html), [*Validators*](https://rabbitholegg.github.io/boost-protocol/src/validators/index.html), [*Incentives*](https://rabbitholegg.github.io/boost-protocol/src/incentives/index.html), and [*AllowLists*](https://rabbitholegg.github.io/boost-protocol/src/allowlists/index.html) available through the [*Boost Registry*](https://rabbitholegg.github.io/boost-protocol/src/BoostRegistry.sol/contract.BoostRegistry.html) or create their own custom implementations, optionally adding them to the Boost Registry for the community to use in their own Boosts.

    - **Choose an Action**: An Action is a specific, observable on-chain activity that users must take in order to complete a Boost. Actions can be as simple as swapping tokens or as complex as bridging from one chain and then maintaining a position of a particular size in a certain liquidity pool over time on another. Actions are reusable across multiple Boosts and can be created using the Boost Registry.

    - **Select a Validator**: The Validator defines the specific logic that will be used to attest to the fact of a user's completion of the Boost's Action. Some Actions are self-validating, while others might not be observable directly by the validator contract and thus require a user to submit proof of completion. Validators are extremely flexible and can be customized to fit the nearly any use case, including on-chain data validation, axiom-type signature attestations, and validation of merkle and ZK proofs.

    - **Create Incentives**: Incentives are the specific rewards that users will earn by participating in a Boost, and every Boost must offer at least one. Incentives can be simple, one-off token rewards, or they can be more complex, such as a whitelist slot, an NFT, ERC20s streamed over time, protocol-specific rewards, or access to other Boosts. There are a variety of pre-built generic Incentives available through the Registry, like `ERC20Incentive`, `ERC1155Incentive`, `AllowListIncentive`, and `PointsIncentive`, which can be used as-is or extended to fit the specific needs of the Boost creator. Incentives cannot be reused across multiple Boosts for accounting and integrity reasons, i.e., once an Incentive is deployed, it is locked to the Boost it was created for.

    - **Build an AllowLists**: An AllowList is used to control access to a Boost. It defines the eligibility criteria for participation in the Boost and can be as simple as a whitelist (or blacklist), or they can be more complex, such as requiring the caller to hold a certain amount of a particular asset, have a minimum or maximum portfolio value, have staked, voted, or delegated to a specific address, or to have participated in a previous Boost. You can reuse AllowLists across multiple Boosts, or use them in combination with the `AllowListIncentive` to create a series of Boosts that build on each other and reward users for ongoing, more meaningful engagement.

### Boost Participation

1. **Discover a Boost**: Users can discover Boosts through a variety of channels, including the Boost Inbox, RabbitHole, and other platforms that integrate with the Boost Protocol. Boosts can be targeted at specific user segments, such as holders of a particular token, users of a specific protocol, or members of a particular community. Once a user identifies a Boost they would like to participate in, they can review the Boost details, including the required actions, incentives, and eligibility criteria. *(The following steps assume the user has chosen to participate in a Boost and has met the eligibility criteria.)*

2. **Complete the Actions**: The user must complete the required actions to participate in the Boost. Actions can be as simple as swapping tokens or as complex as contributing to a liquidity pool. The user must complete the actions in accordance with the rules defined by the Boost creator.

3. **Submit Proof of Completion**: If the Boost's Action can't be immediately validated on-chain from the Validator contract, the user must submit proof of completion to the Validator. The proof can take many forms, including signatures, merkle proofs, and ZK proofs. The Validator will verify the proof and attest to the user's completion of the Boost.

4. **Claim Incentives**: Once the Validator has confirmed the user has completed the Boost's Action, the user can claim the Incentives. The Incentives can be claimed immediately or over time, depending on the rules defined by the Boost creator. Once claimed, the Incentives are transferred to the user's wallet.

## Development

### Prerequisites

- [Node ~20](https://github.com/nvm-sh/nvm)
- [PNPM](https://pnpm.io/installation)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Getting Started

Clone the repository - `git clone https://github.com/rabbitholegg/boost-protocol`

Install dependencies - `pnpm install`. This command will also initialize all submodules required for `evm` package development.

Build packages - `turbo build` or `pnpm build`

### Solidity Development

- [Python](https://docs.brew.sh/Homebrew-and-Python)
- [Wake](https://pypi.org/project/eth-wake/)
- [Slither](https://github.com/crytic/slither)

If using vscode, install this repository's recommended extensions, which depend on the above dependencies.

- [Wake](https://marketplace.visualstudio.com/items?itemName=AckeeBlockchain.tools-for-solidity)
- [Hardhat Solidity](https://arc.net/l/quote/odxovcyb)
- [Slither](https://marketplace.visualstudio.com/items?itemName=trailofbits.slither-vscode)
- [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters)

## Coverage

We generate coverage reports with `forge`

To generate the contract coverage run:
`cd packages/evm && pnpm run coverage`

After running coverage you should have an `lcov.info` file in `/packages/evm/coverage/lcov.info` This will work with coverage gutters to show uncovered lines in testing.

You may need to tweak the settings for the extention in order to help it find the coverage report.

### Developing with the SDK

The build step for `@boostxyz/sdk` requires the following deployed contract address environment variables to exist in either a global context, or set in `/packages/sdk/.env`

```sh
VITE_BOOST_CORE_ADDRESS=
VITE_BOOST_REGISTRY_ADDRESS=
VITE_CONTRACT_ACTION_BASE=
VITE_EVENT_ACTION_BASE=
VITE_ERC721_MINT_ACTION_BASE=
VITE_SIMPLE_ALLOWLIST_BASE=
VITE_SIMPLE_DENYLIST_BASE=
VITE_SIMPLE_BUDGET_BASE=
VITE_VESTING_BUDGET_BASE=
VITE_ALLOWLIST_INCENTIVE_BASE=
VITE_CGDA_INCENTIVE_BASE=
VITE_ERC20_INCENTIVE_BASE=
VITE_ERC1155_INCENTIVE_BASE=
VITE_POINTS_INCENTIVE_BASE=
VITE_SIGNER_VALIDATOR_BASE=
```

Where each these values will be different depending on what chain the protocol is deployed to, but public mainline releases of `@boostxyz/sdk` should always have the correct Boost Network environment variables injected at build time during CI.

As an example, to use `@boost/sdk` against a local hardhat node, you could use the following flow.

```sh
# if not already running a local node
cd packages/sdk && npx hardhat node --verbose

# deploy protocol contracts to local hardhat node
# keep in mind these values will be different each time the node is restarted
npx boost deploy --chain hardhat --privateKey 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 >> packages/sdk/.env && sed -i '' 's/^/VITE_/' packages/sdk/.env

# to bypass the deploy cache, you can run the deployment command with the --force flag
npx boost deploy --force ...

# build artifacts, with sdk now configured to reference deployed contracts
npx turbo build

# from some location if different than this repo...
pnpm link PATH/TO/packages/sdk
```

Then you should be able to access the compiled SDK wherever your heart desires:

```ts
import { BoostCore } from '@boostxyz/sdk'
// etc
```

### Changesets & Publishing

In order to publish you need to make sure that the pull request you're submitting has a changeset. If you don't want to publish this isn't needed. In order to generate a changeset run `pnpm changeset`, select a change type [major,minor,patch], and draft a small summary of the changeset. Select version based on [semantic versioning](https://semver.org/).

After this all you need to do is push and merge the pull request and the Github Action will handle the process of versioning, and publishing.
