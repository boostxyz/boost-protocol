pragma solidity ^0.8.0;

struct Authorization {
    uint256 chainId;
    address codeAddress;
    uint256 nonce;
    bytes signature;
}

struct EIP7702AuthData {
    Authorization[] authlist;
}

struct Asset {
    address token;
    uint256 amount;
}

struct Call {
    address target;
    bytes callData;
    uint256 value;
}

struct CallByUser {
    address user; // User who delegated calldata and funded assets on origin chain.
    uint256 nonce; // Unique nonce for this user call to prevent replay. Set by user on origin chain so
    // there is no re-org risk to this value.
    Asset asset; // token & amount, used to fund execution of calldata
    uint64 chainId; // should match chain id where calls are to be executed
    bytes signature; // Signed calldata, to be used by the XAccount contract to verify the user's ordered the calldata.
    Call[] calls; // calldata to execute
}

struct FillerData {
    uint256 boostId; // ID of the boost for the intent that's being filled
    uint256 incentiveId; // ID of the incentive being claimed
}
