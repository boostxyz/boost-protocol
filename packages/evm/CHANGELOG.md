# @boostxyz/evm

## 8.0.0

### Major Changes

- a170c2b: **BREAKING** UUPS BoostCore (testnet deployments)

### Minor Changes

- 99181d5: deployment to celo mainnet
- 2c328ac: deploy modules and upgrades on: base sepolia, base mainnet, optimism, worldchain
- a6e97a3: add clawback event
- 3ef7d72: - adds referral fees
  - deploy new modules and upgrade BoostCore on Ethereum Sepolia

### Patch Changes

- b42ebd1: Include deployments for Base, Optimism, and World Chain

## 8.0.0-canary.5

### Minor Changes

- 99181d5: deployment to celo mainnet

## 8.0.0-canary.4

### Minor Changes

- 2c328ac: deploy modules and upgrades on: base sepolia, base mainnet, optimism, worldchain

## 8.0.0-canary.3

### Minor Changes

- 3ef7d72: - adds referral fees
  - deploy new modules and upgrade BoostCore on Ethereum Sepolia

## 8.0.0-canary.2

### Minor Changes

- a6e97a3: add clawback event

## 8.0.0-canary.1

### Patch Changes

- b42ebd1: Include deployments for Base, Optimism, and World Chain

## 8.0.0-canary.0

### Major Changes

- a170c2b: **BREAKING** UUPS BoostCore (testnet deployments)

## 7.4.0

### Minor Changes

- 115a70c: support world chain mainnet

## 7.3.0

### Minor Changes

- 0d418cc: add OffchainAccesslist Module
- 6e05afb: add OffchainAccessList SDK implementation
- a881361: deploy OffchainAccessList Module

### Patch Changes

- 3d80186: move AccessListIdNotFound error to OffchainAccessList

## 7.2.0

### Minor Changes

- 62c3456: add PayableLimitedSignerValidator implementation

## 7.1.0

### Minor Changes

- a49f302: support world chain sepolia

## 7.0.0

### Major Changes

- 015e29e: **BREAKING** Append v2 to ERC20VariableCriteria and ERC20PeggedVariableCriteria to force upgrades to new variable criteria functionality

### Minor Changes

- 06becaa: add valueType to variable incentive criteria
- a0f4430: new contract base deployments for all modules on testnets

### Patch Changes

- dca8622: Re-add V1 VariableCriteriaIncentives for backwards compatibility
- 8dde59c: deployments for ERC20PeggedVariableCriteriaIncentive, ERC20VariableCriteriaIncentive, ManagedBudgetWithFeesV2, and TransparentBudget
- 146aa95: deploys contracts on Optimism

## 7.0.0-canary.3

### Patch Changes

- 146aa95: deploys contracts on Optimism

## 7.0.0-canary.2

### Patch Changes

- 8dde59c: deployments for ERC20PeggedVariableCriteriaIncentive, ERC20VariableCriteriaIncentive, ManagedBudgetWithFeesV2, and TransparentBudget

## 7.0.0-canary.1

### Patch Changes

- dca8622: Re-add V1 VariableCriteriaIncentives for backwards compatibility

## 7.0.0-canary.0

### Major Changes

- 015e29e: **BREAKING** Append v2 to ERC20VariableCriteria and ERC20PeggedVariableCriteria to force upgrades to new variable criteria functionality

### Minor Changes

- 06becaa: add valueType to variable incentive criteria
- a0f4430: new contract base deployments for all modules on testnets

## 6.0.4

### Patch Changes

- a1132eb: creating TS types for cli releases

## 6.0.3

### Patch Changes

- df2369d: export LimitedSignerValidator component interface

## 6.0.2

### Patch Changes

- 8c3369c: Deployed LimitedSignerValidator

## 6.0.1

### Patch Changes

- 935a4e8: add ManagedBudgetWithFeesV2 to the sdk

## 6.0.0

### Major Changes

- 0731b2d: [ADHOC] chore(evm): deploy protocol
  feat(evm): add topup support for incentives
  feat(evm): support core upgradability

## 5.2.0

### Minor Changes

- 68ffa7b: deploy EventAction module on Base/BaseSepolia/Sepolia
- 00498c2: [BOOST-5131] feat: tuple support for eventaction

## 5.1.0

### Minor Changes

- 7afe8a3: add Erc20PeggedVariableCriteriaIncentive
- 3320c8d: standardize clawback logic

## 5.0.0

### Major Changes

- fa42c64: [ADHOC] chore(evm): deploy to base, sepolia and base sepolia

### Minor Changes

- 2e59293: fix protocol fee transfer on claim

## 4.0.0

### Major Changes

- d07a3b1: [ADHOC] chore(evm): deploy on base, sepolia & base sepolia

## 3.0.0

### Major Changes

- 5d0b1f8: correct deployment address for sepolia deployment
- efcac66: [ADHOC] chore: deploy onto Sepolia

## 2.1.4

### Patch Changes

- df8152b: [ADHOC] Chore(evm): deploy on base & base sepolia

## 2.1.3

### Patch Changes

- fe3e21a: use ERC20PeggedIncentive in the sdk

## 2.1.2

### Patch Changes

- 52f6db3: deploy new protocol to all supported networks

## 2.1.1

### Patch Changes

- a33c633: Deploy new protocol to base-sepolia

## 2.1.0

### Minor Changes

- bcdaf13: Add ManagedBudgetWithFees
- 0ec6acd: Redeploy core and ManagedBudgetWithFees

### Patch Changes

- d819fc2: refactor(evm): change attribution for clawback event in core

## 2.0.0

### Major Changes

- b9ac73b: LimitedSignerValidator implemented with SDK support

### Minor Changes

- 8813e6d: [ADHOC] chore: deploy contracts to sepolia and base sepolia
  Includes changes to variable criteria incentive for max rewards and core protocol fee handling
- bcc662c: consume component interfaces from evm in sdk to avoid magic strings
- 839fe56: add "ManyRoles" methods to RBAC
- a7a3331: refactor base to bases in boost targets, resolve base address from config, and default to sepolia for now
- eed8dae: create RBAC contract, extend allowlists and budgets from it to unify auth/event api, remove SimpleBudget as it's functionally similar to ManagedBudget
- 8b4be2a: add indexes to use case test signatures, refactor example tests
- 3bd41f4: feat(evm): deploy final V2 of protocol to Sepolia
- bac443d: Support Regex filtering for Event Actions

### Patch Changes

- 8101b27: chore: deploy contracts 11-7
- c64582d: [BOOST-4787] feat: extend erc20variableincentive to include on chain criteria

## 2.0.0-alpha.26

### Patch Changes

- 8101b27: chore: deploy contracts 11-7

## 2.0.0-alpha.25

### Minor Changes

- 8813e6d: [ADHOC] chore: deploy contracts to sepolia and base sepolia
  Includes changes to variable criteria incentive for max rewards and core protocol fee handling

## 2.0.0-alpha.24

### Major Changes

- b9ac73b: LimitedSignerValidator implemented with SDK support

## 1.1.0-alpha.23

### Minor Changes

- 839fe56: add "ManyRoles" methods to RBAC

## 1.1.0-alpha.22

## 0.0.0-alpha.7

### Minor Changes

- 3bd41f4: feat(evm): deploy final V2 of protocol to Sepolia

## 0.0.0-alpha.6

### Patch Changes

- c64582d: [BOOST-4787] feat: extend erc20variableincentive to include on chain criteria

## 0.0.0-alpha.5

### Minor Changes

- eed8dae: create RBAC contract, extend allowlists and budgets from it to unify auth/event api, remove SimpleBudget as it's functionally similar to ManagedBudget

## 0.0.0-alpha.4

### Minor Changes

- 8b4be2a: add indexes to use case test signatures, refactor example tests

## 0.0.0-alpha.3

### Minor Changes

- a7a3331: refactor base to bases in boost targets, resolve base address from config, and default to sepolia for now

## 0.0.0-alpha.2

### Minor Changes

- bac443d: Support Regex filtering for Event Actions

## 0.0.0-alpha.1

### Minor Changes

- bcc662c: consume component interfaces from evm in sdk to avoid magic strings
