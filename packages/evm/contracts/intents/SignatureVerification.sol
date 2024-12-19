// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ECDSA} from "./utils/ECDSA.sol";
import {P256} from "./utils/P256.sol";
import {WebAuthnP256} from "./utils/WebAuthnP256.sol";

/// @title ExperimentalDelegation
/// @author jxom <https://github.com/jxom>
/// @notice Experimental EIP-7702 Delegation contract that allows authorized Keys to invoke calls on behalf of an EOA.
library SignatureVerification {
    ////////////////////////////////////////////////////////////////////////
    // Data Structures
    ////////////////////////////////////////////////////////////////////////

    /// @notice The type of key.
    enum KeyType {
        P256,
        WebAuthnP256
    }

    /// @notice A Key that can be used to authorize calls.
    /// @custom:property publicKey - ECDSA public key.
    /// @custom:property expiry - Unix timestamp at which the key expires (0 = never).
    /// @custom:property keyType - Type of key (0 = P256, 1 = WebAuthnP256).
    struct Key {
        uint256 expiry;
        KeyType keyType;
        ECDSA.PublicKey publicKey;
    }

    /// @notice A wrapped signature.
    /// @custom:property keyIndex - The index of the authorized key.
    /// @custom:property signature - The ECDSA signature.
    /// @custom:property metadata - (Optional) Key-specific metadata.
    struct WrappedSignature {
        uint32 keyIndex;
        ECDSA.Signature signature;
        bool prehash;
        bytes metadata;
    }

    ////////////////////////////////////////////////////////////////////////
    // Errors
    ////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when a key is expired or unauthorized.
    error KeyExpiredOrUnauthorized();

    /// @notice Thrown when a signature is invalid.
    error InvalidSignature();

    ////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Asserts that a signature is valid.
    /// @param digest - The digest to verify.
    /// @param signature - The wrapped signature to verify.
    function assertSignature(bytes32 digest, bytes memory signature, Key memory key) internal view {
        if (_isValidSignature(digest, signature, key) == bytes4(0)) {
            revert InvalidSignature();
        }
    }

    /// @notice Parses a signature from bytes format.
    /// @param signature - The signature to parse.
    /// @return wrappedSignature - The parsed signature.
    function parseSignature(bytes memory signature) internal pure returns (WrappedSignature memory) {
        if (signature.length == 65) {
            bytes32 r;
            bytes32 s;
            bytes1 yParity;
            assembly {
                r := mload(add(signature, 0x20))
                s := mload(add(signature, 0x40))
                yParity := byte(0, mload(add(signature, 0x60)))
            }
            return
                WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), uint8(yParity)), false, new bytes(0xf00d));
        }
        return abi.decode(signature, (WrappedSignature));
    }

    /// @notice Checks if a signature is valid.
    /// @param digest - The digest to verify.
    /// @param signature - The wrapped signature to verify.
    /// @param key - The key to verify the signature against.
    /// @return magicValue - The magic value indicating the validity of the signature.
    function _isValidSignature(bytes32 digest, bytes memory signature, Key memory key)
        private
        view
        returns (bytes4 magicValue)
    {
        WrappedSignature memory wrappedSignature = parseSignature(signature);

        // If prehash flag is set (usually for WebCrypto P256), SHA-256 hash the digest.
        if (wrappedSignature.prehash) digest = sha256(abi.encodePacked(digest));

        bytes4 success = bytes4(keccak256("isValidSignature(bytes32,bytes)"));
        bytes4 failure = bytes4(0);

        // If the key has expired, the signature is invalid.
        if (key.expiry > 0 && key.expiry < block.timestamp) return failure;

        // Verify based on key type.
        if (key.keyType == KeyType.P256 && P256.verify(digest, wrappedSignature.signature, key.publicKey)) {
            return success;
        }
        if (key.keyType == KeyType.WebAuthnP256) {
            WebAuthnP256.Metadata memory metadata = abi.decode(wrappedSignature.metadata, (WebAuthnP256.Metadata));
            if (WebAuthnP256.verify(digest, metadata, wrappedSignature.signature, key.publicKey)) return success;
        }
        return failure;
    }
}
