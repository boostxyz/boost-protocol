// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BasePaymaster} from "lib/modular-account/lib/account-abstraction/contracts/core/BasePaymaster.sol";
import {
    UserOperation,
    UserOperationLib
} from "lib/modular-account/lib/account-abstraction/contracts/interfaces/UserOperation.sol";
import {IEntryPoint} from "lib/modular-account/lib/account-abstraction/contracts/interfaces/IEntryPoint.sol";
import {IPaymaster} from "lib/modular-account/lib/account-abstraction/contracts/interfaces/IPaymaster.sol";

import {ECDSA} from "lib/solady/src/utils/ECDSA.sol";
import {OwnableRoles} from "lib/solady/src/auth/OwnableRoles.sol";

contract BoostPaymaster is IPaymaster, OwnableRoles {
    using ECDSA for bytes32;
    using UserOperationLib for UserOperation;

    error InvalidSignature();

    IEntryPoint public immutable entryPoint;

    uint256 private constant VALID_TIMESTAMP_OFFSET = 20;
    uint256 private constant SIGNATURE_OFFSET = 84;

    struct ValidationData {
        address aggregator;
        uint48 validAfter;
        uint48 validUntil;
    }

    /// @notice A mapping of signers to their status.
    mapping(address => bool) public isSigner;

    /// @notice A mapping of sender to their nonce.
    mapping(address => uint256) public senderNonce;

    constructor(IEntryPoint _entryPoint, address[] memory _signers) {
        entryPoint = _entryPoint;
        for (uint256 i = 0; i < _signers.length; i++) {
            isSigner[_signers[i]] = true;
        }
    }

    /// @notice Pack a UserOperation into a byte array
    /// @param userOp The UserOperation to pack
    /// @return ret The packed UserOperation
    function pack(UserOperation calldata userOp) internal pure returns (bytes memory ret) {
        bytes calldata pnd = userOp.paymasterAndData;
        assembly {
            let ofs := userOp
            let len := sub(sub(pnd.offset, ofs), 32)
            ret := mload(0x40)
            mstore(0x40, add(ret, add(len, 32)))
            mstore(ret, len)
            calldatacopy(add(ret, 32), ofs, len)
        }
    }

    /// @notice Hash a UserOperation for off-chain signing and on-chain validation.
    /// @param userOp The UserOperation to hash
    /// @param validUntil The timestamp until which the UserOperation is valid
    /// @param validAfter The timestamp after which the UserOperation is valid
    /// @return The hash of the UserOperation
    function getHash(UserOperation calldata userOp, uint48 validUntil, uint48 validAfter)
        public
        view
        returns (bytes32)
    {
        // `userOp.hash()` contains the `paymasterAndData`, so we can't use it here.
        return keccak256(
            abi.encode(
                pack(userOp), block.chainid, address(this), senderNonce[userOp.getSender()], validUntil, validAfter
            )
        );
    }

    /// @notice Validate the UserOperation and return the validation data
    /// @param userOp The UserOperation to validate
    /// @param - The hash of the UserOperation (unused)
    /// @param - The maximum cost of the UserOperation (unused)
    /// @return context The context for the UserOperation
    /// @return validationData The validation data for the UserOperation
    /// @dev Note that this method DOES NOT revert on signature failure. Instead, it sets the first bit of the validationData to 1 to indicate that validation failed. This enables us to simulate transactions without a valid signature.
    function validatePaymasterUserOp(UserOperation calldata userOp, bytes32, uint256)
        external
        returns (bytes memory context, uint256 validationData)
    {
        (uint48 validUntil, uint48 validAfter, bytes calldata signature) =
            parsePaymasterAndData(userOp.paymasterAndData);

        bytes32 hash = ECDSA.toEthSignedMessageHash(getHash(userOp, validUntil, validAfter));
        senderNonce[userOp.getSender()]++;

        //don't revert on signature failure: return SIG_VALIDATION_FAILED
        if (!isSigner[ECDSA.recover(hash, signature)]) {
            return ("", _packValidationData(true, validUntil, validAfter));
        }

        //no need for other on-chain validation: entire UserOp should have been checked
        // by the external service prior to signing it.
        return ("", _packValidationData(false, validUntil, validAfter));
    }

    /// @notice Parse the paymaster and data from a UserOperation
    /// @param paymasterAndData The paymaster and data to parse
    /// @return validUntil The timestamp until which the UserOperation is valid
    /// @return validAfter The timestamp after which the UserOperation is valid
    /// @return signature The signature used to authorize the UserOperation
    function parsePaymasterAndData(bytes calldata paymasterAndData)
        public
        pure
        returns (uint48 validUntil, uint48 validAfter, bytes calldata signature)
    {
        (validUntil, validAfter) =
            abi.decode(paymasterAndData[VALID_TIMESTAMP_OFFSET:SIGNATURE_OFFSET], (uint48, uint48));
        signature = paymasterAndData[SIGNATURE_OFFSET:];
    }

    /// @inheritdoc IPaymaster
    /// @notice Post-operation handler for the result of a UserOperation
    /// @param mode The mode of the operation (opSucceeded, opReverted, postOpReverted)
    /// @param context The context returned by validatePaymasterUserOp
    /// @param actualGasCost The actual gas cost of the operation (excluding the postOp handler)
    function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) external override {
        _requireFromEntryPoint();
        _postOp(mode, context, actualGasCost);
    }

    /**
     * post-operation handler.
     * (verified to be called only through the entryPoint)
     * @dev if subclass returns a non-empty context from validatePaymasterUserOp, it must also implement this method.
     * @param mode enum with the following options:
     *      opSucceeded - user operation succeeded.
     *      opReverted  - user op reverted. still has to pay for gas.
     *      postOpReverted - user op succeeded, but caused postOp (in mode=opSucceeded) to revert.
     *                       Now this is the 2nd call, after user's op was deliberately reverted.
     * @param context - the context value returned by validatePaymasterUserOp
     * @param actualGasCost - actual gas used so far (without this postOp call).
     */
    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal virtual {
        (mode, context, actualGasCost); // unused params
        // subclass must override this method if validatePaymasterUserOp returns a context
        revert("must override");
    }

    /**
     * add a deposit for this paymaster, used for paying for transaction fees
     */
    function deposit() public payable {
        entryPoint.depositTo{value: msg.value}(address(this));
    }

    /**
     * withdraw value from the deposit
     * @param withdrawAddress target to send to
     * @param amount to withdraw
     */
    function withdrawTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint.withdrawTo(withdrawAddress, amount);
    }
    /**
     * add stake for this paymaster.
     * This method can also carry eth value to add to the current stake.
     * @param unstakeDelaySec - the unstake delay for this paymaster. Can only be increased.
     */

    function addStake(uint32 unstakeDelaySec) external payable onlyOwner {
        entryPoint.addStake{value: msg.value}(unstakeDelaySec);
    }

    /**
     * return current paymaster's deposit on the entryPoint.
     */
    function getDeposit() public view returns (uint256) {
        return entryPoint.balanceOf(address(this));
    }

    /**
     * unlock the stake, in order to withdraw it.
     * The paymaster can't serve requests once unlocked, until it calls addStake again
     */
    function unlockStake() external onlyOwner {
        entryPoint.unlockStake();
    }

    /**
     * withdraw the entire paymaster's stake.
     * stake must be unlocked first (and then wait for the unstakeDelay to be over)
     * @param withdrawAddress the address to send withdrawn value.
     */
    function withdrawStake(address payable withdrawAddress) external onlyOwner {
        entryPoint.withdrawStake(withdrawAddress);
    }

    /// validate the call is made from a valid entrypoint
    function _requireFromEntryPoint() internal virtual {
        require(msg.sender == address(entryPoint), "Sender not EntryPoint");
    }

    /// @notice Pack the validation data into a single uint256 field
    /// @param sigFailed Whether the signature validation failed
    /// @param validUntil The timestamp until which the UserOperation is valid
    /// @param validAfter The timestamp after which the UserOperation is valid
    /// @return The packed ValidationData
    /// @dev The packed ValidationData is structured as follows:
    ///   - sigFailure | 20 bytes | 0 for success, 1 for failure (padded to 20 bytes for standards compliance, but we only technically need 1 bit)
    ///   - validUntil | 6 bytes  | The timestamp until which the UserOperation is valid
    ///   - validAfter | 6 bytes  | The timestamp after which the UserOperation is valid
    function _packValidationData(bool sigFailed, uint48 validUntil, uint48 validAfter)
        internal
        pure
        returns (uint256)
    {
        return (sigFailed ? 1 : 0) | (uint256(validUntil) << 160) | (uint256(validAfter) << (160 + 48));
    }

    /// @notice Unpack the validation data from a single uint256 field
    /// @param validationData The packed ValidationData
    /// @return data The unpacked ValidationData
    /// @dev Assumes the packed ValidationData is structured as described in {_packValidationData}
    function _parseValidationData(uint256 validationData) internal pure returns (ValidationData memory data) {
        address aggregator = address(uint160(validationData));
        uint48 validUntil = uint48(validationData >> 160);
        if (validUntil == 0) {
            validUntil = type(uint48).max;
        }
        uint48 validAfter = uint48(validationData >> (48 + 160));
        return ValidationData(aggregator, validAfter, validUntil);
    }
}
