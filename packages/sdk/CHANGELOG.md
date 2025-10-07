# @boostxyz/sdk

## 8.0.0-canary.5

### Minor Changes

- 6ff3c1c: add targetContract check in action validation

### Patch Changes

- cb705f0: use actionStep signature to filter decoded logs

## 8.0.0-canary.4

### Minor Changes

- 3ef7d72: - adds referral fees
  - deploy new modules and upgrade BoostCore on Ethereum Sepolia

## 8.0.0-canary.3

### Patch Changes

- 883c4d4: fix fieldIndex type for variableCriteriaIncentives and actionClaimant

## 8.0.0-canary.2

### Minor Changes

- 1e1c0d5: add nested tuple support to variable incentives
- a6e97a3: add clawback event

## 8.0.0-canary.1

### Patch Changes

- b42ebd1: Include deployments for Base, Optimism, and World Chain

## 8.0.0-canary.0

### Major Changes

- a170c2b: **BREAKING** UUPS BoostCore (testnet deployments)

## 7.8.0

### Minor Changes

- 81bc7a7: add tuple support for claimant

## 7.7.0

### Minor Changes

- 115a70c: support world chain mainnet

## 7.6.0

### Minor Changes

- 6e05afb: add OffchainAccessList SDK implementation

## 7.5.1

### Patch Changes

- 982f379: fix fieldType mutation

## 7.5.0

### Minor Changes

- 62c3456: add PayableLimitedSignerValidator implementation

### Patch Changes

- ed4c633: conditionally add hardhat chain to bases

## 7.4.0

### Minor Changes

- a49f302: support world chain sepolia

## 7.3.0

### Minor Changes

- b1f7a7b: add optional logs to GetIncentiveScalarV2Params
- 341a01e: derive claimant from actionStep logs

## 7.2.0

### Minor Changes

- 83249bc: add tuple support for incentive criteria

### Patch Changes

- 8db0796: update claimant matching logic

## 7.1.0

### Minor Changes

- 7396842: expose prepareCreateBoostPayload for public usage

## 7.0.0

### Major Changes

- 015e29e: **BREAKING** Append v2 to ERC20VariableCriteria and ERC20PeggedVariableCriteria to force upgrades to new variable criteria functionality

### Minor Changes

- 507bf0b: ERC20VariableIncentive and ERC20VaribleCritieriaIncentive decodeClaimData functions return Promise<bigint>
- 836d814: TransparentBudget implementation
- 06becaa: add valueType to variable incentive criteria

### Patch Changes

- dca8622: Re-add V1 VariableCriteriaIncentives for backwards compatibility
- 8fa7e9c: use updated addresses for ERC20PeggedVariableCriteriaIncentive, ERC20VariableCriteriaIncentive, ManagedBudgetWithFeesV2, and TransparentBudget
- 146aa95: deploys contracts on Optimism

## 7.0.0-canary.3

### Patch Changes

- 146aa95: deploys contracts on Optimism

## 7.0.0-canary.2

### Patch Changes

- 8fa7e9c: use updated addresses for ERC20PeggedVariableCriteriaIncentive, ERC20VariableCriteriaIncentive, ManagedBudgetWithFeesV2, and TransparentBudget

## 7.0.0-canary.1

### Patch Changes

- dca8622: Re-add V1 VariableCriteriaIncentives for backwards compatibility

## 7.0.0-canary.0

### Major Changes

- 015e29e: **BREAKING** Append v2 to ERC20VariableCriteria and ERC20PeggedVariableCriteria to force upgrades to new variable criteria functionality

### Minor Changes

- 507bf0b: ERC20VariableIncentive and ERC20VaribleCritieriaIncentive decodeClaimData functions return Promise<bigint>
- 836d814: TransparentBudget implementation
- 06becaa: add valueType to variable incentive criteria

## 6.1.3

### Patch Changes

- 53ed9e5: fix issue with privkey format in limitedSignerValidator

## 6.1.2

### Patch Changes

- df2369d: export LimitedSignerValidator component interface

## 6.1.1

### Patch Changes

- 9ee2db2: use LimitedSignerValidator base address

## 6.1.0

### Minor Changes

- 54de50c: Changes default behavior in boost creation to use a LimitedSignerValidator

## 6.0.3

### Patch Changes

- 532d0ec: revert BoostCore addresses

## 6.0.2

### Patch Changes

- 8cc4585: allow overwrite of addresses in BoostCore SDK

## 6.0.1

### Patch Changes

- 935a4e8: add ManagedBudgetWithFeesV2 to the sdk

## 6.0.0

### Major Changes

- 0731b2d: [ADHOC] chore(evm): deploy protocol
  feat(evm): add topup support for incentives
  feat(evm): support core upgradability

## 5.5.0

### Minor Changes

- 3ac1685: normalize UINT hex to intended value

## 5.4.0

### Minor Changes

- 6f21288: add padding to 4-byte function selectors in signature
- 23ceab9: derive signatureType from signature

### Patch Changes

- 2897165: prevent mutatation of Transfer abi by using structuredClone

## 5.3.1

### Patch Changes

- cf262d1: [BOOST-5221] feat(sdk): update tuple support helpers to add terminators
- 34308e9: fix transfer signature issue in deriveActionClaimantFromTransaction method
- aef6e3c: fix undefined address in address comparison

## 5.3.0

### Minor Changes

- ade50d6: reorder event args params in decoded logs to match abi params
- 68ffa7b: deploy EventAction module on Base/BaseSepolia/Sepolia
- 00498c2: [BOOST-5131] feat: tuple support for eventaction
- 999399b: add method for getIncentiveFeesInfo on boostcore

### Patch Changes

- a62b4c1: fix getRemainingClaims on ERC20PeggedIncentive
- f6a5b57: add decodeClaimData to ERC20PeggedIncentive
- 29813f6: add a createBoostRaw function to BoostCore sdk

## 5.2.1

### Patch Changes

- f01db75: fixes claim data decoding for ERC20PeggedVariableCriteriaIncentive

## 5.2.0

### Minor Changes

- 5c1ea17: auto-add boostcore as a manager in ManagedBudget

### Patch Changes

- d32f677: add decodeClaimData method to ERC20PeggedVariableCriteriaIncentive

## 5.1.1

### Patch Changes

- 5b172a5: update base contracts for pegged incentive types

## 5.1.0

### Minor Changes

- a853ac8: add logic for Transfer event decoding
- 3320c8d: standardize clawback logic

## 5.0.0

### Major Changes

- fa42c64: [ADHOC] chore(evm): deploy to base, sepolia and base sepolia

## 4.0.0

### Major Changes

- d07a3b1: [ADHOC] chore(evm): deploy on base, sepolia & base sepolia

## 3.0.0

### Major Changes

- 5d0b1f8: correct deployment address for sepolia deployment
- efcac66: [ADHOC] chore: deploy onto Sepolia

## 2.2.2

### Patch Changes

- df8152b: [ADHOC] Chore(evm): deploy on base & base sepolia
- 3bef168: generate build claim data for ERC20PeggedIncentive

## 2.2.1

### Patch Changes

- fe3e21a: use ERC20PeggedIncentive in the sdk

## 2.2.0

### Minor Changes

- e3feb6d: Add ownership management methods to DeployableTargetWithRBAC

### Patch Changes

- 864e7fd: fix for isClaimable error on incentives
- 47132d5: fixes block number validation
- 4893d56: pass params into internal reads on getBoost

## 2.1.2

### Patch Changes

- 7b11e38: fix owner param in BoostCore constructor
- 52f6db3: deploy new protocol to all supported networks

## 2.1.1

### Patch Changes

- a33c633: Deploy new protocol to base-sepolia

## 2.1.0

### Minor Changes

- bcdaf13: Add ManagedBudgetWithFees
- 0ec6acd: Redeploy core and ManagedBudgetWithFees

## 2.0.0

### Major Changes

- 5a51804: make `ValidateActionStepsParams.chainId` mandatory to skirt sender, logs weirdness
- 2bcbb7b: initial sdk alpha release

### Minor Changes

- 9ff2694: add `getTotalBudget` and `calculateProtocolFee` utilities
- aa20a00: add `EventAction.deriveActionClaimantFromTransaction` method, slight refactor to how `ValidateActionStepParams` are handled
- f11669c: add `OpenAllowList`, for zero config allow list support
- 74e818c: ManagedBudgetRoles as ts enum
- 9860502: make `ValidationActionStepParams.knownSignatures` mandatory. Cuts down on size via dep removal, better dx
- 0101059: add `transactionSenderClaimant(): ActionClaimant` utility
- 6cefd33: add `clawbackFromTarget` API to ManagedBudget, docs, tests
- 2de419c: add `decodeClaimData` api to Validator, variable incentives
- bac443d: Implement support for non-indexed string parameters
- 1df1f74: split out eventABI getter parameters from the validation parameters for
  validateActionSteps calls
- 1c9a128: must supply chainId in `transactionSenderClaimant`
- ba5b22f: event action hardening, alternate event action payload shape, action step deduping
- bcc662c: consume component interfaces from evm in sdk to avoid magic strings
- 95240eb: deprecate ManagedBudgetRoles enum for RBAC Roles
- 29e17b0: add buildClaimData method to incentives
- 5144fde: add owner to allow/denylist
- b1f6864: ERC1155Incentive functioning with tests, refactor all ts utilities to sdk package
- 004140a: accept numerical strings for id in core.readBoost
- 33c2c49: merge known signatures with signatures registry, add mint(address,uint256,address,uint256,address,string) function signature
- 2377fa4: add `BoostCore.simulateCreateBoost`, minor refactor to encapsulate building the on chain create boost payload
- be00de4: add BoostNotFoundError to read/get Boost for friendlier message
- 1025a21: add `BoostCore.getClaimFromTransaction` for retrieving `BoostClaimed` event from tx
- 839fe56: add "ManyRoles" methods to RBAC
- a5e3376: Bump SDK to build in new contracts and release
- 6beb1d4: noop: force publication
- 7076b88: export boostRegistryAbi, test all public exports
- 2ed232d: change WriteParams to use SimulateContractParameters under the hood, remove excessively huge generic typings
- 43d7fe2: add `BoostValidatorEOA` to `Validator` module, use as default signer in `core.createBoost`
- a7a3331: refactor base to bases in boost targets, resolve base address from config, and default to sepolia for now
- 31de323: test release alpha.1
- 1dc5168: refactor utils, put interfaces and encoding functions with their respective consuming classes
- 1c9a128: accept `GetTransactionParameters` in `ValidateActionStepParams` to fix retroactive Boost completion
- 324a1c7: better support for pnpm linking w/ env specified contracts on all implementations
- eed8dae: create RBAC contract, extend allowlists and budgets from it to unify auth/event api, remove SimpleBudget as it's functionally similar to ManagedBudget
- 15f71e8: add `BoostRegistry.initialize` as more obvious alternative name for `.clone`, make `.deploy` protected for Boost targets, await valid action steps, better `isBase` defaults, update comments
- 494d87c: add initializeRaw for consistency with other clone methods
- 8b4be2a: add indexes to use case test signatures, refactor example tests
- 5a6d1e6: refactor ERC20VariableCriteria to extend ERC20Variable to fix missing methods, remove dependence on signatures package like EventAction
- bac443d: Support Regex filtering for Event Actions
- 818ab69: add `ValidateActionStepParams.notBeforeBlockNumber` bigint to support retroactive boost fixes
- 19744b8: add viability test for delegation action
- b6574e8: add `incentive.canBeClaimed` & `incentive.getRemainingClaimPotential` and add missing incentives to cli seed
- d44954a: make `actionType` optional in event action steps, default to 0 if not provided
- 0a0d35b: fix BoostRegisty.getClone method, it now returns the correct interface

### Patch Changes

- 449cf4b: [BOOST-4842] feat(sdk): add gas used setting for variable incentives sdk helpers
- 2225e57: configure sdk to generate sourcemaps, include src in dep bundle so as not to break "sources" field
- 5473021: remove evm as optional dependency
- f0c615b: create and validate `anyActionParameter`
- 48f014d: fix address comparison for NOT_EQUAL case
- 7554bac: moves data fetching for validation at action step level
- 34fff84: fix environment passthrough for event action base address
- 9fe6e77: use default signer/validator when none is provided
- 953fb62: fixes `DecodeLogTopicsMismatch` error
- 4b65cfe: refactor budget methods to make assets have zero address as the default value
- b9ac73b: LimitedSignerValidator implemented with SDK support
- d8f0d27: Replace signTypedData util with PrivateKeyAccount's signTypedData
- 1b43eaf: initial sepolia release, omit unused, unaudited interfaces, release @boostxyz/signatures
- c64582d: [BOOST-4787] feat: extend erc20variableincentive to include on chain criteria

## 2.0.0-alpha.35

### Minor Changes

- 2de419c: add `decodeClaimData` api to Validator, variable incentives

## 2.0.0-alpha.34

### Minor Changes

- 9ff2694: add `getTotalBudget` and `calculateProtocolFee` utilities
- 2ed232d: change WriteParams to use SimulateContractParameters under the hood, remove excessively huge generic typings

## 2.0.0-alpha.33

### Minor Changes

- 6cefd33: add `clawbackFromTarget` API to ManagedBudget, docs, tests

## 2.0.0-alpha.32

### Minor Changes

- a5e3376: Bump SDK to build in new contracts and release

## 2.0.0-alpha.31

### Minor Changes

- 95240eb: deprecate ManagedBudgetRoles enum for RBAC Roles

### Patch Changes

- 5473021: remove evm as optional dependency

## 2.0.0-alpha.30

## 2.0.0-alpha.29

### Patch Changes

- 953fb62: fixes `DecodeLogTopicsMismatch` error

## 2.0.0-alpha.28

### Minor Changes

- 818ab69: add `ValidateActionStepParams.notBeforeBlockNumber` bigint to support retroactive boost fixes

## 2.0.0-alpha.27

### Minor Changes

- 1c9a128: must supply chainId in `transactionSenderClaimant`
- 1c9a128: accept `GetTransactionParameters` in `ValidateActionStepParams` to fix retroactive Boost completion

## 2.0.0-alpha.26

### Patch Changes

- d8f0d27: Replace signTypedData util with PrivateKeyAccount's signTypedData

## 2.0.0-alpha.25

### Major Changes

- 5a51804: make `ValidateActionStepsParams.chainId` mandatory to skirt sender, logs weirdness

### Minor Changes

- 43d7fe2: add `BoostValidatorEOA` to `Validator` module, use as default signer in `core.createBoost`
- 5a6d1e6: refactor ERC20VariableCriteria to extend ERC20Variable to fix missing methods, remove dependence on signatures package like EventAction

### Patch Changes

- 449cf4b: [BOOST-4842] feat(sdk): add gas used setting for variable incentives sdk helpers
- b9ac73b: LimitedSignerValidator implemented with SDK support

## 1.1.0-alpha.24

### Minor Changes

- 0101059: add `transactionSenderClaimant(): ActionClaimant` utility

## 1.1.0-alpha.23

### Minor Changes

- 9860502: make `ValidationActionStepParams.knownSignatures` mandatory. Cuts down on size via dep removal, better dx
- 839fe56: add "ManyRoles" methods to RBAC
- 324a1c7: better support for pnpm linking w/ env specified contracts on all implementations

### Patch Changes

- Updated dependencies [807570f]
  - @boostxyz/signatures@1.1.0-alpha.23

## 1.1.0-alpha.22

### Minor Changes

- 29e17b0: add buildClaimData method to incentives

### Patch Changes

- f0c615b: create and validate `anyActionParameter`
  - @boostxyz/signatures@1.1.0-alpha.22

## 0.0.0-alpha.21

### Minor Changes

- 004140a: accept numerical strings for id in core.readBoost
- 33c2c49: merge known signatures with signatures registry, add mint(address,uint256,address,uint256,address,string) function signature
- 2377fa4: add `BoostCore.simulateCreateBoost`, minor refactor to encapsulate building the on chain create boost payload
- be00de4: add BoostNotFoundError to read/get Boost for friendlier message
- 494d87c: add initializeRaw for consistency with other clone methods
- 0a0d35b: fix BoostRegisty.getClone method, it now returns the correct interface

### Patch Changes

- Updated dependencies [2dbb00c]
- Updated dependencies [33c2c49]
  - @boostxyz/signatures@0.0.0-alpha.7

## 0.0.0-alpha.20

### Minor Changes

- aa20a00: add `EventAction.deriveActionClaimantFromTransaction` method, slight refactor to how `ValidateActionStepParams` are handled

## 0.0.0-alpha.19

### Minor Changes

- 7076b88: export boostRegistryAbi, test all public exports

## 0.0.0-alpha.18

### Minor Changes

- 1025a21: add `BoostCore.getClaimFromTransaction` for retrieving `BoostClaimed` event from tx

### Patch Changes

- 7554bac: moves data fetching for validation at action step level
- 9fe6e77: use default signer/validator when none is provided
- c64582d: [BOOST-4787] feat: extend erc20variableincentive to include on chain criteria
- Updated dependencies [720ef29]
- Updated dependencies [93f20ca]
- Updated dependencies [c64582d]
  - @boostxyz/signatures@0.0.0-alpha.6

## 0.0.0-alpha.17

### Minor Changes

- eed8dae: create RBAC contract, extend allowlists and budgets from it to unify auth/event api, remove SimpleBudget as it's functionally similar to ManagedBudget

## 0.0.0-alpha.16

### Minor Changes

- 5144fde: add owner to allow/denylist

### Patch Changes

- Updated dependencies [90d3275]
- Updated dependencies [c7964fd]
  - @boostxyz/signatures@0.0.0-alpha.5

## 0.0.0-alpha.15

### Minor Changes

- 8b4be2a: add indexes to use case test signatures, refactor example tests

### Patch Changes

- Updated dependencies [8b4be2a]
  - @boostxyz/signatures@0.0.0-alpha.4

## 0.0.0-alpha.14

### Patch Changes

- Updated dependencies [6154f5e]
  - @boostxyz/signatures@0.0.0-alpha.3

## 0.0.0-alpha.13

### Minor Changes

- a7a3331: refactor base to bases in boost targets, resolve base address from config, and default to sepolia for now

## 0.0.0-alpha.12

### Minor Changes

- bac443d: Implement support for non-indexed string parameters
- 1df1f74: split out eventABI getter parameters from the validation parameters for
  validateActionSteps calls
- bac443d: Support Regex filtering for Event Actions

## 0.0.0-alpha.11

### Minor Changes

- f11669c: add `OpenAllowList`, for zero config allow list support
- 74e818c: ManagedBudgetRoles as ts enum

### Patch Changes

- 4b65cfe: refactor budget methods to make assets have zero address as the default value

## 0.0.0-alpha.10

### Patch Changes

- 48f014d: fix address comparison for NOT_EQUAL case

## 0.0.0-alpha.9

### Minor Changes

- 1dc5168: refactor utils, put interfaces and encoding functions with their respective consuming classes
- 19744b8: add viability test for delegation action
- d44954a: make `actionType` optional in event action steps, default to 0 if not provided

### Patch Changes

- Updated dependencies [19744b8]
  - @boostxyz/signatures@0.0.0-alpha.1

## 0.0.0-alpha.8

### Minor Changes

- 15f71e8: add `BoostRegistry.initialize` as more obvious alternative name for `.clone`, make `.deploy` protected for Boost targets, await valid action steps, better `isBase` defaults, update comments

## 0.0.0-alpha.7

### Patch Changes

- 34fff84: fix environment passthrough for event action base address

## 0.0.0-alpha.6

### Patch Changes

- 2225e57: configure sdk to generate sourcemaps, include src in dep bundle so as not to break "sources" field

## 0.0.0-alpha.5

### Minor Changes

- 6beb1d4: noop: force publication

## 0.0.0-alpha.4

### Minor Changes

- bcc662c: consume component interfaces from evm in sdk to avoid magic strings

## 0.0.0-alpha.3

### Minor Changes

- ba5b22f: event action hardening, alternate event action payload shape, action step deduping

## 0.0.0-alpha.2

### Minor Changes

- b1f6864: ERC1155Incentive functioning with tests, refactor all ts utilities to sdk package
- 31de323: test release alpha.1

## 0.0.0-alpha.1

### Major Changes

- initial sdk alpha release
