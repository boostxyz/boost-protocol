# Boost Protocol

[![Documentation](https://img.shields.io/badge/documentation-gh--pages-blue)](https://rabbitholegg.github.io/boost-protocol/index.html)
[![Test Status](https://github.com/rabbitholegg/boost-protocol/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/rabbitholegg/boost-protocol/actions/workflows/test.yml)

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

- **Boost Core**: Boost Core is a smart contract that facilitates the creation and management of Boosts. It is responsible for managing Boost parameters, tracking user participation, and distributing rewards. It is the glue that holds the entire Boost Protocol together.

- **Boost Registry**: Boost Registry is a smart contract that maintains a registry of the base implementations for Boost Actions, Boost Incentives, Boost Validators, Boost Budgets, and Boost AllowLists. This allows developers to create custom implementations and register them with the Boost Registry, making them available for use in Boosts. It also promotes code reuse and standardization across the protocol.

- **Boost Actions**: Boost Actions are smart contracts that define the specific actions that users must take to complete a Boost. They are designed to be modular and can be customized to fit the specific needs of the Boost. Examples of Boost Actions include swapping tokens, staking assets, and contributing to liquidity pools.

- **Boost Incentives**: Boost Incentives are smart contracts that define the specific rewards that users can earn by participating in a Boost. Examples of Boost Incentives include earning tokens, receiving NFTs, and participating in airdrops.

- **Boost Validators**: Boost Validators are smart contracts that validate user participation in a Boost and unlock access to its incentives. They are responsible for verifying that users have completed the required actions and are eligible to receive rewards. Examples of Boost Validator logic includes signature verifications, on-chain data validation, and validation of merkle and ZK proofs.

- **Boost Budgets**: Boost Budgets are smart contracts that control the allocation of incentives for a Boost. Examples of Boost Budgets include simple fixed allocations, dynamic allocations based on user participation, and allocations based on vesting schedules.

- **Boost AllowLists**: Boost AllowLists are smart contracts that control access to a Boost. They are responsible for defining the eligibility criteria for participation in a Boost. Examples of Boost AllowList criteria include whitelists, blacklists, asset holdings, and prior participation in other Boosts.

## Contributing

Boost Protocol is being developed with [Foundry](https://getfoundry.sh), a suite of tools for building, deploying, and managing decentralized applications. Foundry provides a set of tools and libraries that make it easy to build and deploy smart contracts, front-end applications, and infrastructure for decentralized applications.

At this time, we are not accepting contributions from the community. However, we are actively seeking feedback and suggestions for the protocol. If you have any ideas or suggestions, please feel free to open an issue or reach out to us on [Discord](https://discord.gg/boost-protocol).

## License

**TBD** — Boost Protocol is not yet licensed for public use. We are currently evaluating various licensing options and will update this section once a decision has been made.
