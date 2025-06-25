# PayableLimitedSignerValidator SDK Implementation Plan

## Overview

This document outlines the complete implementation plan for adding SDK support for the `PayableLimitedSignerValidator` contract. This validator extends the `LimitedSignerValidator` with payable functionality, requiring users to pay a claim fee when validating.

### Key Features
- Inherits all functionality from `LimitedSignerValidator` (signature validation, claim limits)
- Adds a configurable claim fee requirement
- Uses a global fee pattern where the base implementation stores the fee and all clones read from it
- Fee is forwarded to the protocol fee receiver

## Architecture Changes

### Contract Pattern
```
Base Implementation (holds claimFee, has owner)
    ├── Clone 1 (reads fee from base)
    ├── Clone 2 (reads fee from base)
    └── Clone N (reads fee from base)
```

- **Base Implementation**: Stores the master `claimFee` value and has an owner set in constructor
- **Clones**: Store reference to base implementation, read fee dynamically
- **Fee Updates**: Only possible on base by the owner, automatically affects all clones

### Important Constructor Change
The PayableLimitedSignerValidator constructor now requires an `owner` parameter:
```solidity
constructor(address owner_) {
    _initializeOwner(owner_);
    _disableInitializers();
}
```
This ensures the base implementation has an owner who can manage the global claim fee.

## Implementation Steps

### 1. Generate TypeScript Bindings

**File**: `packages/evm/wagmi.config.ts` (or equivalent build configuration)

Ensure the build process generates TypeScript bindings for:
- `payableLimitedSignerValidatorAbi`
- Read functions: `readPayableLimitedSignerValidatorClaimFee`, `readPayableLimitedSignerValidatorGetClaimFee`
- Write functions: `writePayableLimitedSignerValidatorSetClaimFee`, `writePayableLimitedSignerValidatorValidate`
- Simulate functions: `simulatePayableLimitedSignerValidatorSetClaimFee`, `simulatePayableLimitedSignerValidatorValidate`

### 2. Create Main Implementation File

**File**: `packages/sdk/src/Validators/PayableLimitedSignerValidator.ts`

```typescript
import {
  payableLimitedSignerValidatorAbi,
  readPayableLimitedSignerValidatorGetClaimFee,
  readPayableLimitedSignerValidatorHashSignerData,
  readPayableLimitedSignerValidatorSigners,
  simulatePayableLimitedSignerValidatorSetClaimFee,
  simulatePayableLimitedSignerValidatorSetAuthorized,
  simulatePayableLimitedSignerValidatorSetValidatorCaller,
  simulatePayableLimitedSignerValidatorValidate,
  writePayableLimitedSignerValidatorSetClaimFee,
  writePayableLimitedSignerValidatorSetAuthorized,
  writePayableLimitedSignerValidatorSetValidatorCaller,
  writePayableLimitedSignerValidatorValidate,
} from '@boostxyz/evm';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/PayableLimitedSignerValidator.sol/PayableLimitedSignerValidator.json';
import { bytecode } from '@boostxyz/evm/artifacts/contracts/validators/PayableLimitedSignerValidator.sol/PayableLimitedSignerValidator.json';
import {
  type Address,
  type ContractEventName,
  type Hex,
  encodeAbiParameters,
} from 'viem';
import { PayableLimitedSignerValidator as PayableLimitedSignerValidatorBases } from '../../dist/deployments.json';
import type {
  DeployableOptions,
  GenericDeployableParams,
} from '../Deployable/Deployable';
import {
  type GenericLog,
  type ReadParams,
  RegistryType,
  type WriteParams,
} from '../utils';
import { 
  LimitedSignerValidator,
  type LimitedSignerValidatorPayload,
  type LimitedSignerValidatorValidatePayload,
  type LimitedSignerValidatorClaimDataParams,
  type LimitedSignerValidatorInputParams,
  type LimitedSignerValidatorSignaturePayload,
} from './LimitedSignerValidator';

export { payableLimitedSignerValidatorAbi };

/**
 * Object representation of a {@link PayableLimitedSignerValidator} initialization payload
 *
 * @export
 * @interface PayableLimitedSignerValidatorPayload
 * @typedef {PayableLimitedSignerValidatorPayload}
 */
export interface PayableLimitedSignerValidatorPayload {
  /**
   * The list of authorized signers. The first address in the list will be the initial owner of the contract.
   *
   * @type {Address[]}
   */
  signers: Address[];
  /**
   * The authorized caller of the validator function
   * @type {Address}
   */
  validatorCaller: Address;
  /**
   * The max quantity of claims a user can make for a given incentive
   * @type {number}
   */
  maxClaimCount: number;
  /**
   * The address of the base implementation to read claim fees from
   * @type {Address}
   */
  baseImplementation: Address;
}

/**
 * Extended validate payload that includes the payment value
 *
 * @export
 * @interface PayableLimitedSignerValidatorValidatePayload
 * @typedef {PayableLimitedSignerValidatorValidatePayload}
 */
export interface PayableLimitedSignerValidatorValidatePayload extends LimitedSignerValidatorValidatePayload {
  /**
   * The amount of ETH to send with the validation call (must match claimFee exactly)
   *
   * @type {bigint}
   */
  value: bigint;
}

/**
 * A generic `viem.Log` event with support for `PayableLimitedSignerValidator` event types.
 *
 * @export
 * @typedef {PayableLimitedSignerValidatorLog}
 */
export type PayableLimitedSignerValidatorLog<
  event extends ContractEventName<
    typeof payableLimitedSignerValidatorAbi
  > = ContractEventName<typeof payableLimitedSignerValidatorAbi>,
> = GenericLog<typeof payableLimitedSignerValidatorAbi, event>;

/**
 * A validator that verifies signatures, limits claims per address, and requires a claim fee.
 * The claim fee is stored on the base implementation and all clones read from it.
 * This allows updating the fee globally by only changing it on the base.
 *
 * @export
 * @class PayableLimitedSignerValidator
 * @extends {LimitedSignerValidator}
 */
export class PayableLimitedSignerValidator extends LimitedSignerValidator {
  /**
   * @inheritdoc
   *
   * @public
   * @readonly
   * @type {*}
   */
  public override readonly abi = payableLimitedSignerValidatorAbi;
  
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {Record<number, Address>}
   */
  public static override bases: Record<number, Address> = {
    31337: import.meta.env.VITE_PAYABLE_LIMITED_SIGNER_VALIDATOR_BASE,
    ...(PayableLimitedSignerValidatorBases as Record<number, Address>),
  };
  
  /**
   * @inheritdoc
   *
   * @public
   * @static
   * @type {RegistryType}
   */
  public static override registryType: RegistryType = RegistryType.VALIDATOR;

  /**
   * Get the current claim fee. For clones, this reads from the base implementation.
   *
   * @public
   * @async
   * @param {?ReadParams} [params]
   * @returns {Promise<bigint>}
   */
  public async getClaimFee(params?: ReadParams): Promise<bigint> {
    return await readPayableLimitedSignerValidatorGetClaimFee(this._config, {
      address: this.assertValidAddress(),
      // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
      ...(params as any),
    });
  }

  /**
   * Set the claim fee (only callable on the base implementation by the owner)
   *
   * @public
   * @async
   * @param {bigint} newFee - The new claim fee amount in wei
   * @param {?WriteParams} [params]
   * @returns {Promise<void>}
   */
  public async setClaimFee(newFee: bigint, params?: WriteParams): Promise<void> {
    return await this.awaitResult(this.setClaimFeeRaw(newFee, params));
  }

  /**
   * Set the claim fee (only callable on the base implementation by the owner)
   *
   * @public
   * @async
   * @param {bigint} newFee - The new claim fee amount in wei
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: void; }>}
   */
  public async setClaimFeeRaw(newFee: bigint, params?: WriteParams) {
    const { request, result } = await simulatePayableLimitedSignerValidatorSetClaimFee(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [newFee],
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      },
    );
    const hash = await writePayableLimitedSignerValidatorSetClaimFee(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Validate that the action has been completed successfully. 
   * Requires exact payment of the claim fee.
   *
   * @public
   * @async
   * @param {PayableLimitedSignerValidatorValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<boolean>} - True if the action has been validated
   */
  protected async validate(
    payload: PayableLimitedSignerValidatorValidatePayload,
    params?: WriteParams,
  ): Promise<boolean> {
    return await this.awaitResult(this.validateRaw(payload, params));
  }

  /**
   * Validate that the action has been completed successfully.
   * Requires exact payment of the claim fee.
   *
   * @public
   * @async
   * @param {PayableLimitedSignerValidatorValidatePayload} payload
   * @param {?WriteParams} [params]
   * @returns {Promise<{ hash: `0x${string}`; result: boolean; }>}
   */
  protected async validateRaw(
    payload: PayableLimitedSignerValidatorValidatePayload,
    params?: WriteParams,
  ) {
    const { request, result } = await simulatePayableLimitedSignerValidatorValidate(
      this._config,
      {
        address: this.assertValidAddress(),
        args: [
          payload.boostId,
          payload.incentiveId,
          payload.claimant,
          payload.claimData,
        ],
        value: payload.value,
        ...this.optionallyAttachAccount(),
        // biome-ignore lint/suspicious/noExplicitAny: Accept any shape of valid wagmi/viem parameters
        ...(params as any),
      },
    );
    const hash = await writePayableLimitedSignerValidatorValidate(
      this._config,
      request,
    );
    return { hash, result };
  }

  /**
   * Build the initialization parameters for the validator
   *
   * @public
   * @override
   * @param {?PayableLimitedSignerValidatorPayload} [_payload]
   * @param {?DeployableOptions} [_options]
   * @returns {GenericDeployableParams}
   */
  public override buildParameters(
    _payload?: PayableLimitedSignerValidatorPayload,
    _options?: DeployableOptions,
  ): GenericDeployableParams {
    const [payload, options] = this.validateDeploymentConfig(
      _payload,
      _options,
    );
    if (!payload.signers || payload.signers.length === 0) {
      throw new Error('PayableLimitedSignerValidator: must have at least one signer');
    }
    if (!payload.validatorCaller) {
      throw new Error('PayableLimitedSignerValidator: validatorCaller is required');
    }
    if (!payload.baseImplementation) {
      throw new Error('PayableLimitedSignerValidator: baseImplementation is required');
    }
    return {
      abi: payableLimitedSignerValidatorAbi,
      bytecode: bytecode as Hex,
      args: [],
      ...this.optionallyAttachAccount(options.account),
    };
  }

  /**
   * Prepare the initialization payload for contract deployment
   *
   * @protected
   * @param {PayableLimitedSignerValidatorPayload} payload
   * @returns {Hex}
   */
  protected override preparePayload(
    payload: PayableLimitedSignerValidatorPayload,
  ): Hex {
    return encodeAbiParameters(
      [
        { name: 'signers', type: 'address[]' },
        { name: 'validatorCaller', type: 'address' },
        { name: 'maxClaimCount', type: 'uint256' },
        { name: 'baseImplementation', type: 'address' },
      ],
      [
        payload.signers,
        payload.validatorCaller,
        BigInt(payload.maxClaimCount),
        payload.baseImplementation,
      ],
    );
  }
}

/**
 * Prepare the initialization payload for a PayableLimitedSignerValidator
 *
 * @export
 * @param {PayableLimitedSignerValidatorPayload} payload
 * @returns {Hex}
 */
export function preparePayableLimitedSignerValidatorPayload(
  payload: PayableLimitedSignerValidatorPayload,
): Hex {
  return encodeAbiParameters(
    [
      { name: 'signers', type: 'address[]' },
      { name: 'validatorCaller', type: 'address' },
      { name: 'maxClaimCount', type: 'uint256' },
      { name: 'baseImplementation', type: 'address' },
    ],
    [
      payload.signers,
      payload.validatorCaller,
      BigInt(payload.maxClaimCount),
      payload.baseImplementation,
    ],
  );
}
```

### 3. Create Test File

**File**: `packages/sdk/src/Validators/PayableLimitedSignerValidator.test.ts`

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import { parseEther, type Address, type Hex } from 'viem';
import { accounts } from '../../test/accounts';
import { setupConfig, type TestingEnvironment } from '../../test/setup';
import { PayableLimitedSignerValidator } from './PayableLimitedSignerValidator';
import { prepareLimitedSignerValidatorClaimDataPayload } from './LimitedSignerValidator';

describe('PayableLimitedSignerValidator', () => {
  let env: TestingEnvironment;
  let baseValidator: PayableLimitedSignerValidator;
  let clonedValidator: PayableLimitedSignerValidator;
  const claimFee = parseEther('0.01');
  const newClaimFee = parseEther('0.02');

  beforeEach(async () => {
    env = await setupConfig();
    
    // Deploy base validator
    baseValidator = await env.boost.deployPayableLimitedSignerValidator({
      signers: [accounts[0].address],
      validatorCaller: env.boostCore.address,
      maxClaimCount: 5,
      baseImplementation: '0x0000000000000000000000000000000000000000', // Base doesn't need this
    });

    // Set initial claim fee on base
    await baseValidator.setClaimFee(claimFee);

    // Deploy clone that references the base
    clonedValidator = await env.boost.deployPayableLimitedSignerValidator({
      signers: [accounts[1].address],
      validatorCaller: env.boostCore.address,
      maxClaimCount: 5,
      baseImplementation: baseValidator.address,
    });
  });

  describe('Claim Fee Management', () => {
    it('should read claim fee from base implementation', async () => {
      const baseFee = await baseValidator.getClaimFee();
      const cloneFee = await clonedValidator.getClaimFee();
      
      expect(baseFee).toBe(claimFee);
      expect(cloneFee).toBe(claimFee);
    });

    it('should update fee globally when base is updated', async () => {
      await baseValidator.setClaimFee(newClaimFee);
      
      const baseFee = await baseValidator.getClaimFee();
      const cloneFee = await clonedValidator.getClaimFee();
      
      expect(baseFee).toBe(newClaimFee);
      expect(cloneFee).toBe(newClaimFee);
    });

    it('should prevent clones from setting fee', async () => {
      await expect(
        clonedValidator.setClaimFee(newClaimFee)
      ).rejects.toThrow('Unauthorized');
    });

    it('should only allow owner to set fee on base', async () => {
      const nonOwnerValidator = new PayableLimitedSignerValidator(env.config, {
        address: baseValidator.address,
        account: accounts[1], // Different account
      });

      await expect(
        nonOwnerValidator.setClaimFee(newClaimFee)
      ).rejects.toThrow();
    });
  });

  describe('Validation with Payment', () => {
    let claimData: Hex;
    
    beforeEach(async () => {
      // Prepare claim data with signature
      claimData = await prepareLimitedSignerValidatorClaimDataPayload({
        signer: accounts[0],
        incentiveData: '0x',
        chainId: env.config.chains[0].id,
        validator: clonedValidator.address,
        incentiveQuantity: 1,
        claimant: accounts[2].address,
        boostId: 1n,
      });
    });

    it('should validate with exact claim fee', async () => {
      const result = await clonedValidator.validate({
        boostId: 1n,
        incentiveId: 0n,
        claimant: accounts[2].address,
        claimData,
        value: claimFee,
      });

      expect(result).toBe(true);
    });

    it('should revert with insufficient fee', async () => {
      await expect(
        clonedValidator.validate({
          boostId: 1n,
          incentiveId: 0n,
          claimant: accounts[2].address,
          claimData,
          value: claimFee - 1n,
        })
      ).rejects.toThrow('InvalidClaimFee');
    });

    it('should revert with excess fee', async () => {
      await expect(
        clonedValidator.validate({
          boostId: 1n,
          incentiveId: 0n,
          claimant: accounts[2].address,
          claimData,
          value: claimFee + parseEther('0.001'),
        })
      ).rejects.toThrow('InvalidClaimFee');
    });

    it('should validate with zero fee when fee is set to zero', async () => {
      await baseValidator.setClaimFee(0n);
      
      const result = await clonedValidator.validate({
        boostId: 1n,
        incentiveId: 0n,
        claimant: accounts[2].address,
        claimData,
        value: 0n,
      });

      expect(result).toBe(true);
    });
  });
});
```

### 4. Update Module Exports

**File**: `packages/sdk/src/index.ts`

Add the following export:
```typescript
export * from './Validators/PayableLimitedSignerValidator';
```

### 5. Update Deployment Configuration

**File**: `packages/sdk/dist/deployments.json` (after deployment)

Add the deployed base implementation addresses:
```json
{
  // ... existing entries ...
  "PayableLimitedSignerValidator": {
    "10": "0x...", // Optimism
    "8453": "0x...", // Base
    "42161": "0x...", // Arbitrum
    "84532": "0x...", // Base Sepolia
    "11155111": "0x..." // Sepolia
  }
}
```

### 6. Environment Variable Configuration

**File**: `.env` (for local development)

Add the local base address:
```env
VITE_PAYABLE_LIMITED_SIGNER_VALIDATOR_BASE=0x... # Local deployment address
```

### 7. Helper Functions Export

Add these utility functions to the main file or a separate utils file:

```typescript
/**
 * Helper to prepare claim data with proper fee consideration
 * 
 * @export
 * @param {LimitedSignerValidatorClaimDataParams & { validator: PayableLimitedSignerValidator }} params
 * @returns {Promise<{ claimData: Hex; requiredFee: bigint }>}
 */
export async function preparePayableLimitedSignerValidatorClaimData(
  params: LimitedSignerValidatorClaimDataParams & { validator: PayableLimitedSignerValidator }
): Promise<{ claimData: Hex; requiredFee: bigint }> {
  const claimData = await prepareLimitedSignerValidatorClaimDataPayload(params);
  const requiredFee = await params.validator.getClaimFee();
  
  return {
    claimData,
    requiredFee,
  };
}
```

## Usage Examples

### Deploy Base Implementation and Set Fee
```typescript
// Deploy base implementation (with owner set in constructor)
// Note: The deployment script/factory must pass the owner address to the constructor
const baseValidator = await boost.deployPayableLimitedSignerValidator({
  signers: [owner],
  validatorCaller: boostCore.address,
  maxClaimCount: 10,
  baseImplementation: '0x0000000000000000000000000000000000000000',
});

// Set the global claim fee (owner was set during deployment)
await baseValidator.setClaimFee(parseEther('0.01'));
```

### Deploy Clone
```typescript
// Deploy clone that references the base
const validator = await boost.deployPayableLimitedSignerValidator({
  signers: [signer1, signer2],
  validatorCaller: boostCore.address,
  maxClaimCount: 5,
  baseImplementation: baseValidator.address,
});

// Check the fee (reads from base)
const fee = await validator.getClaimFee();
console.log('Claim fee:', formatEther(fee), 'ETH');
```

### Validate with Payment
```typescript
// Prepare claim data
const { claimData, requiredFee } = await preparePayableLimitedSignerValidatorClaimData({
  signer: authorizedSigner,
  incentiveData: '0x',
  chainId: 1,
  validator,
  incentiveQuantity: 1,
  claimant: userAddress,
  boostId: 1n,
});

// Validate with exact fee payment
const result = await validator.validate({
  boostId: 1n,
  incentiveId: 0n,
  claimant: userAddress,
  claimData,
  value: requiredFee,
});
```

### Update Global Fee
```typescript
// Only the base owner can update the fee
await baseValidator.setClaimFee(parseEther('0.02'));

// All clones now require the new fee
const newFee = await validator.getClaimFee(); // Returns 0.02 ETH
```

## Testing Checklist

- [ ] Base implementation deployment
- [ ] Clone deployment with base reference
- [ ] Fee reading from base and clones
- [ ] Fee setting (only on base)
- [ ] Fee setting authorization (only owner)
- [ ] Validation with exact fee payment
- [ ] Validation with insufficient fee (should revert)
- [ ] Validation with excess fee (should revert)
- [ ] Validation with zero fee
- [ ] Global fee updates affecting all clones
- [ ] Integration with BoostCore's claimIncentiveFor

## Migration Guide

For existing LimitedSignerValidator users:

1. **Deploy Base Implementation**: Deploy a single PayableLimitedSignerValidator as the base
2. **Set Initial Fee**: Call `setClaimFee()` on the base to set the desired fee
3. **Update Clone Deployments**: When deploying new validators, pass the base implementation address instead of individual fees
4. **Update Validation Calls**: Include the `value` parameter when calling validate functions

## Security Considerations

1. **Exact Fee Requirement**: The contract requires exact fee payment to prevent funds from getting stuck
2. **Fee Recipient**: Fees are forwarded to the protocol fee receiver from BoostCore
3. **Access Control**: Only the base implementation owner can update fees
4. **Clone Restrictions**: Clones cannot modify the fee, ensuring consistent behavior
5. **Constructor Owner**: The base implementation MUST have an owner set in the constructor to manage fees

## Critical Issue: Zero Address Owner

If you've already deployed the PayableLimitedSignerValidator without the constructor owner parameter, the base implementation will have a zero address owner and you won't be able to set the claim fee. In this case, you need to:

1. **Redeploy the base implementation** with the updated constructor that accepts an owner parameter
2. **Update all references** to point to the new base implementation address
3. **For existing clones**, they would need to be redeployed pointing to the new base implementation

This is a breaking change that requires redeployment of the base validator contract.

## Gas Optimization Notes

1. **Storage Efficiency**: Clones don't store the fee, reducing deployment costs
2. **Dynamic Reading**: Small overhead for reading from base, but saves on clone deployment
3. **Batch Updates**: Updating fee on base is more efficient than updating multiple clones

## Future Enhancements

1. **Fee Tiers**: Could extend to support different fees for different boost types
2. **Dynamic Fees**: Could implement time-based or usage-based fee adjustments
3. **Fee Distribution**: Could add mechanisms for fee sharing with boost creators
</rewritten_file> 