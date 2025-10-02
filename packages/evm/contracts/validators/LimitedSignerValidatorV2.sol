// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {SignerValidatorV2, ASignerValidatorV2} from "contracts/validators/SignerValidatorV2.sol";
import {ALimitedSignerValidatorV2} from "contracts/validators/ALimitedSignerValidatorV2.sol";

/// @title Limited Signer Validator v2
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers. Claims against an incentive for a given address are strictly limited in this implementation
contract LimitedSignerValidatorV2 is ALimitedSignerValidatorV2, SignerValidatorV2 {
    using SignatureCheckerLib for address;
    using IncentiveBits for IncentiveBits.IncentiveMap;

    /// @notice Initialize the contract with the list of authorized signers
    /// @param data_ The compressed list of authorized signers
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override(ACloneable, SignerValidatorV2) initializer {
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
        virtual
        override(AValidator, SignerValidatorV2)
        returns (bool)
    {
        bytes32 claimantHash = hashClaimantData(boostId, incentiveId, claimant);
        uint256 nextCount = quantityClaimed[claimantHash] + 1;
        if (nextCount > maxClaimCount) revert BoostError.MaximumClaimed(claimant);

        bool isValid = super.validate(boostId, incentiveId, claimant, claimData);
        if (!isValid) return false;

        quantityClaimed[claimantHash] = nextCount;
        return true;
    }

    function hashClaimantData(uint256 boostId, uint256 incentiveId, address claimant)
        public
        pure
        returns (bytes32 hash)
    {
        return keccak256(abi.encodePacked(boostId, incentiveId, claimant));
    }

    /// @notice Returns the name of this validator
    /// @return The validator name
    function validatorName()
        external
        pure
        virtual
        override(ALimitedSignerValidatorV2, ASignerValidatorV2)
        returns (string memory)
    {
        return "LimitedSignerValidatorV2";
    }

    function _domainNameAndVersion()
        internal
        pure
        virtual
        override
        returns (string memory name, string memory version)
    {
        name = "LimitedSignerValidatorV2";
        version = "1";
    }

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(ALimitedSignerValidatorV2, ASignerValidatorV2)
        returns (bytes4)
    {
        return type(ALimitedSignerValidatorV2).interfaceId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ALimitedSignerValidatorV2, ASignerValidatorV2)
        returns (bool)
    {
        return interfaceId == type(ALimitedSignerValidatorV2).interfaceId || super.supportsInterface(interfaceId);
    }
}
