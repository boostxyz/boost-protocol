// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {SignerValidator, ASignerValidator} from "contracts/validators/SignerValidator.sol";
import {ALimitedSignerValidator} from "contracts/validators/ALimitedSignerValidator.sol";

/// @title Limited Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers. Claims against an incentive for a given address are strictly limited in this implementation
contract LimitedSignerValidator is ALimitedSignerValidator, SignerValidator {
    using SignatureCheckerLib for address;
    using IncentiveBits for IncentiveBits.IncentiveMap;

    /// @notice Initialize the contract with the list of authorized signers
    /// @param data_ The compressed list of authorized signers
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override(ACloneable, SignerValidator) initializer {
        (address[] memory signers_, address validatorCaller_, uint256 maxClaims_) =
            abi.decode(data_, (address[], address, uint256));
        _initializeOwner(signers_[0]);
        maxClaimCount = maxClaims_;
        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = true;
        }

        _validatorCaller = validatorCaller_;
    }

    /// Validate that the action has been completed successfully by constructing a payload and checking the signature against it
    /// @inheritdoc AValidator
    function validate(uint256 boostId, uint256 incentiveId, address claimant, bytes calldata claimData)
        public
        payable
        override(AValidator, SignerValidator)
        returns (bool)
    {
        if (!_incrementClaim(boostId, incentiveId, claimant)) revert BoostError.MaximumClaimed(claimant);
        return super.validate(boostId, incentiveId, claimant, claimData);
    }

    function hashClaimantData(uint256 boostId, uint256 incentiveId, address claimant)
        public
        pure
        returns (bytes32 hash)
    {
        return keccak256(abi.encodePacked(boostId, incentiveId, claimant));
    }

    function _incrementClaim(uint256 boostId, uint256 incentiveId, address claimant) internal returns (bool) {
        bytes32 claimantHash = hashClaimantData(boostId, incentiveId, claimant);
        uint256 claimCount = quantityClaimed[claimantHash] + 1;

        if (claimCount > maxClaimCount) return false;

        quantityClaimed[claimantHash] = claimCount;
        return true;
    }

    function _domainNameAndVersion() internal pure override returns (string memory name, string memory version) {
        name = "LimitedSignerValidator";
        version = "1";
    }

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(ALimitedSignerValidator, ASignerValidator)
        returns (bytes4)
    {
        return type(ALimitedSignerValidator).interfaceId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ALimitedSignerValidator, ASignerValidator)
        returns (bool)
    {
        return interfaceId == type(ALimitedSignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
