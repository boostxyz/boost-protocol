// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./ECDSA.sol";

//( @title P256
/// @author klkvr <https://github.com/klkvr>
/// @author jxom <https://github.com/jxom>
/// @notice Wrapper function to abstract low level details of call to the P256
///         signature verification precompile as defined in EIP-7212, see
///         <https://eips.ethereum.org/EIPS/eip-7212>.
library P256 {
    /// @notice P256VERIFY operation
    /// @param digest 32 bytes of the signed data hash
    /// @param signature Signature of the signer
    /// @param publicKey Public key of the signer
    /// @return success Represents if the operation was successful
    function verify(bytes32 digest, ECDSA.Signature memory signature, ECDSA.PublicKey memory publicKey)
        internal
        view
        returns (bool)
    {
        // P256VERIFY address is 0x14 from <https://github.com/paradigmxyz/alphanet/blob/main/crates/precompile/src/addresses.rs>
        (bool success, bytes memory output) =
            address(0x14).staticcall(abi.encode(digest, signature.r, signature.s, publicKey.x, publicKey.y));
        success = success && output.length == 32 && output[31] == 0x01;

        return success;
    }
}
