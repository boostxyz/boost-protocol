# @boostxyz/sdk

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
