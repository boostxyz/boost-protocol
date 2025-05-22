# Wallet Provider Integration Guide

This guide describes one approach to reward wallet users with cashback through the Boost Protocol. It assumes that the wallet provider wants to reward only the transactions that originate through its own wallet. The on‑chain portion uses a custom validator contract while the off‑chain component handles attribution and signature generation.

## 1. Deploy a Wallet‑Specific Validator

Deploy a clone of `SignerValidator` (or `LimitedSignerValidator`) with your signer address whitelisted. When creating a Boost, supply this validator address so that claims must be authorized by your off‑chain service. The BoostCore contract emits the validator address via the `BoostCreated` event:

```solidity
event BoostCreated(
    uint256 indexed boostId,
    address indexed owner,
    address indexed action,
    uint256 incentiveCount,
    address validator,
    address allowList,
    address budget
);
```

The validator address is also returned by `BoostCore.getBoost` allowing you to inspect each boost configuration.

## 2. Record Transactions Off‑Chain

When your wallet sends a user transaction, record its hash and the user account in your backend. Check whether the transaction meets the criteria for a specific Boost (for example, interaction with a partner protocol).

## 3. Generate a Signed Claim

Once the transaction qualifies, create a claim payload including the transaction hash (or other metadata) inside the `incentiveData` field. Sign the typed data required by `SignerValidator` using your private key. The SDK provides a helper:

```ts
const payload = await prepareSignerValidatorClaimDataPayload({
  signer: { account: walletSigner, privateKey: signerKey },
  incentiveData: encodedIncentiveData,
  chainId,
  validator: validatorAddress,
  incentiveQuantity,
  claimant: userAddress,
  boostId,
});
```

This produces the encoded claim data that callers pass to `BoostCore.claimIncentive`.

## 4. Submit the Claim On‑Chain

The wallet (or the user) calls:

```solidity
boostCore.claimIncentive(boostId, incentiveId, referrer, payload);
```

Set `referrer` to your wallet address to track attribution. `BoostCore` sends the claim through your validator’s `validate` function. The validator checks the signature, ensures the claim hasn’t been replayed, and returns `true` if valid.

## 5. Track Reward Attribution

Listen for the `BoostClaimed` event:

```solidity
event BoostClaimed(
    uint256 indexed boostId,
    uint256 indexed incentiveId,
    address indexed claimant,
    address referrer,
    bytes data
);
```

The event includes the `claimant` and `referrer` addresses along with the arbitrary data payload. Off‑chain services can correlate the event with the original transaction hash stored in `incentiveData` to confirm the claim.

## 6. Distribute Cashback

After verifying that a claim originates from your wallet and was executed on‑chain, credit the user with cashback through your backend. Because the validator only approves claims signed by your service, you can be confident that rewards go to your own users.

## Summary

By deploying a dedicated validator and signing claims off‑chain, wallet providers can attribute transactions to their users and selectively approve Boost rewards. The combination of `BoostCreated`/`BoostClaimed` events and the SDK helpers make it straightforward to integrate wallet‑specific incentives while keeping the on‑chain contracts permissionless.
