# @boostxyz/sdk

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
