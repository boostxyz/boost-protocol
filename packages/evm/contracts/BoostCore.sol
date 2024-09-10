// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAction} from "contracts/actions/AAction.sol";
import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {IAuth} from "contracts/auth/IAuth.sol";
import {AValidator} from "contracts/validators/AValidator.sol";

/// @title Boost Core
/// @notice The core contract for the Boost protocol
/// @dev This contract is currently `Ownable` for simplicity, but this will be replaced with a decentralized governance mechanism prior to GA
contract BoostCore is Ownable, ReentrancyGuard {
    using LibClone for address;
    using LibZip for bytes;
    using SafeTransferLib for address;

    struct InitPayload {
        ABudget budget;
        BoostLib.Target action;
        BoostLib.Target validator;
        BoostLib.Target allowList;
        BoostLib.Target[] incentives;
        uint64 protocolFee;
        uint64 referralFee;
        uint256 maxParticipants;
        address owner;
    }

    event BoostCreated(
        uint256 indexed boostIndex,
        address indexed owner,
        address indexed action,
        uint256 incentiveCount,
        address validator,
        address allowList,
        address budget
    );

    /// @notice The list of boosts
    BoostLib.Boost[] private _boosts;

    /// @notice The BoostRegistry contract
    BoostRegistry public registry;

    IAuth public createBoostAuth;

    /// @notice The protocol fee receiver
    address public protocolFeeReceiver;

    /// @notice The claim fee (in wei)
    uint256 public claimFee = 0.000075 ether;

    /// @notice The base protocol fee (in bps)
    uint64 public protocolFee = 1_000; // 10%

    /// @notice The base referral fee (in bps)
    uint64 public referralFee = 1_000; // 10%

    /// @notice The fee denominator (basis points, i.e. 10000 == 100%)
    uint64 public constant FEE_DENOMINATOR = 10_000;

    modifier canCreateBoost(address sender) {
        if (address(createBoostAuth) != address(0) && !createBoostAuth.isAuthorized(sender)) {
            revert BoostError.Unauthorized();
        }
        _;
    }

    /// @notice Constructor to initialize the owner
    constructor(BoostRegistry registry_, address protocolFeeReceiver_) {
        _initializeOwner(msg.sender);
        registry = registry_;
        protocolFeeReceiver = protocolFeeReceiver_;
    }

    /// @notice Create a new Boost
    /// @param data_ The compressed data for the Boost `(ABudget, Target<AAction>, Target<Validator>, Target<AAllowList>, Target<AIncentive>[], protocolFee, referralFee, maxParticipants, owner)`
    /// @dev The data is expected to:
    ///     - be packed using `abi.encode()` and compressed using [Solady's LibZip calldata compression](https://github.com/Vectorized/solady/blob/main/src/utils/LibZip.sol)
    ///     - properly decode to the following types (in order):
    ///         - `ABudget` to be used for the Boost
    ///         - `Target` for the action
    ///         - `Target` for the validator which is expected to be one of the following:
    ///             - The address of a base implementation to be cloned (e.g. the result of `BoostRegistry.getBaseImplementation("SignerValidator")`), along with the parameters for its initializer;
    ///             - The address of a previously deployed clone with no parameter data (any parameter data will be ignored but will still add to the calldata size);
    ///             - The zero address along with no parameter data if validation is implemented by the action;
    ///         - `Target` for the allowList
    ///         - `Target[]` for the incentives
    ///         - `uint256` for the protocolFee (added to the base protocol fee)
    ///         - `uint256` for the referralFee (added to the base referral fee)
    ///         - `uint256` for the maxParticipants
    ///         - `address` for the owner of the Boost
    function createBoost(bytes calldata data_)
        external
        canCreateBoost(msg.sender)
        nonReentrant
        returns (BoostLib.Boost memory)
    {
        InitPayload memory payload_ = abi.decode(data_.cdDecompress(), (InitPayload));

        // Validate the Budget
        _checkBudget(payload_.budget);

        // Initialize the Boost
        BoostLib.Boost storage boost = _boosts.push();
        boost.owner = payload_.owner;
        boost.budget = payload_.budget;
        boost.protocolFee = protocolFee + payload_.protocolFee;
        boost.referralFee = referralFee + payload_.referralFee;
        boost.maxParticipants = payload_.maxParticipants;

        // Setup the Boost components
        boost.action = AAction(_makeTarget(type(AAction).interfaceId, payload_.action, true));
        boost.allowList = AAllowList(_makeTarget(type(AAllowList).interfaceId, payload_.allowList, true));
        boost.incentives = _makeIncentives(payload_.incentives, payload_.budget);
        boost.validator = AValidator(
            payload_.validator.instance == address(0)
                ? boost.action.supportsInterface(type(AValidator).interfaceId) ? address(boost.action) : address(0)
                : _makeTarget(type(AValidator).interfaceId, payload_.validator, true)
        );
        emit BoostCreated(
            _boosts.length - 1,
            boost.owner,
            address(boost.action),
            boost.incentives.length,
            address(boost.validator),
            address(boost.allowList),
            address(boost.budget)
        );
        return boost;
    }

    /// @notice Claim an incentive for a Boost
    /// @param boostId_ The ID of the Boost
    /// @param incentiveId_ The ID of the AIncentive
    /// @param referrer_ The address of the referrer (if any)
    /// @param data_ The data for the claim
    function claimIncentive(uint256 boostId_, uint256 incentiveId_, address referrer_, bytes calldata data_)
        external
        payable
    {
        claimIncentiveFor(boostId_, incentiveId_, referrer_, data_, msg.sender);
    }

    /// @notice Claim an incentive for a Boost on behalf of another user
    /// @param boostId_ The ID of the Boost
    /// @param incentiveId_ The ID of the AIncentive
    /// @param referrer_ The address of the referrer (if any)
    /// @param data_ The data for the claim
    /// @param claimant the address of the user eligible for the incentive payout
    function claimIncentiveFor(
        uint256 boostId_,
        uint256 incentiveId_,
        address referrer_,
        bytes calldata data_,
        address claimant
    ) public payable nonReentrant {
        BoostLib.Boost storage boost = _boosts[boostId_];
        if (msg.value < claimFee) revert BoostError.InsufficientFunds(address(0), msg.value, claimFee);
        _routeClaimFee(boost, referrer_);

        // wake-disable-next-line reentrancy (false positive, function is nonReentrant)
        if (!boost.validator.validate(boostId_, incentiveId_, claimant, data_)) revert BoostError.Unauthorized();
        if (!boost.incentives[incentiveId_].claim(claimant, data_)) {
            revert BoostError.ClaimFailed(claimant, data_);
        }
    }

    /// @notice Get a Boost by index
    /// @param index The index of the Boost
    /// @return The Boost at the specified index
    function getBoost(uint256 index) external view returns (BoostLib.Boost memory) {
        return _boosts[index];
    }

    /// @notice Get the number of Boosts
    /// @return The number of Boosts
    function getBoostCount() external view returns (uint256) {
        return _boosts.length;
    }

    /// @notice Set the createBoostAuth address
    /// @param auth_ The new createBoostAuth address
    function setCreateBoostAuth(address auth_) external onlyOwner {
        createBoostAuth = IAuth(auth_);
    }

    /// @notice Set the protocol fee receiver address
    /// @param protocolFeeReceiver_ The new protocol fee receiver address
    /// @dev This function is only callable by the owner
    function setProtocolFeeReceiver(address protocolFeeReceiver_) external onlyOwner {
        protocolFeeReceiver = protocolFeeReceiver_;
    }

    /// @notice Set the claim fee
    /// @param claimFee_ The new claim fee (in wei)
    /// @dev This function is only callable by the owner
    function setClaimFee(uint256 claimFee_) external onlyOwner {
        claimFee = claimFee_;
    }

    /// @notice Set the protocol fee
    /// @param protocolFee_ The new protocol fee (in bps)
    /// @dev This function is only callable by the owner
    function setProtocolFee(uint64 protocolFee_) external onlyOwner {
        protocolFee = protocolFee_;
    }

    /// @notice Set the referral fee
    /// @param referralFee_ The new referral fee (in bps)
    /// @dev This function is only callable by the owner
    function setReferralFee(uint64 referralFee_) external onlyOwner {
        referralFee = referralFee_;
    }

    /// @notice Check that the provided ABudget is valid and that the caller is authorized to use it
    /// @param budget_ The ABudget to check
    /// @dev This function will revert if the ABudget is invalid or the caller is unauthorized
    function _checkBudget(ABudget budget_) internal view {
        _checkTarget(type(ABudget).interfaceId, address(budget_));
        if (!budget_.isAuthorized(msg.sender)) revert BoostError.Unauthorized();
    }

    /// @notice Check that the provided Target is valid for the specified interface
    /// @param interfaceId The interface ID for the target
    /// @param instance The instance to check
    /// @dev This function will revert if the Target does not implement the expected interface
    /// @dev This check costs ~376 gas, which is worth it to validate the target
    function _checkTarget(bytes4 interfaceId, address instance) internal view {
        if (instance == address(0) || !ACloneable(instance).supportsInterface(interfaceId)) {
            revert BoostError.InvalidInstance(interfaceId, instance);
        }
    }

    /// @notice Create a target instance and optionally initialize it
    /// @param interfaceId The interface ID for the target
    /// @param target The target to create
    /// @param shouldInitialize Whether or not to initialize the target
    /// @return instance The target instance
    /// @dev This function will revert if the target does not implement the expected interface
    function _makeTarget(bytes4 interfaceId, BoostLib.Target memory target, bool shouldInitialize)
        internal
        returns (address instance)
    {
        _checkTarget(interfaceId, target.instance);
        instance = _maybeClone(target, shouldInitialize);
    }

    /// @notice Configure a set of incentives for a Boost using the given ABudget
    /// @param targets_ The set of incentives {Target<AIncentive>[]}
    /// @param budget_ The ABudget from which to allocate the incentives
    /// @return incentives The set of initialized incentives {AIncentive[]}
    function _makeIncentives(BoostLib.Target[] memory targets_, ABudget budget_)
        internal
        returns (AIncentive[] memory incentives)
    {
        incentives = new AIncentive[](targets_.length);
        for (uint256 i = 0; i < targets_.length; i++) {
            // Deploy the clone, but don't initialize until it we've preflighted
            _checkTarget(type(AIncentive).interfaceId, targets_[i].instance);

            // Ensure the target is a base implementation (incentive clones are not reusable)
            if (!targets_[i].isBase) {
                revert BoostError.InvalidInstance(type(AIncentive).interfaceId, targets_[i].instance);
            }

            incentives[i] = AIncentive(_makeTarget(type(AIncentive).interfaceId, targets_[i], false));

            bytes memory preflight = incentives[i].preflight(targets_[i].parameters);
            if (preflight.length != 0) {
                // wake-disable-next-line reentrancy (false positive, entrypoint is nonReentrant)
                assert(budget_.disburse(preflight));
            }

            // wake-disable-next-line reentrancy (false positive, entrypoint is nonReentrant)
            incentives[i].initialize(targets_[i].parameters);
        }
    }

    /// @notice Get the target instance, optionally cloning and initializing from a base implementation
    function _maybeClone(BoostLib.Target memory target_, bool shouldInitialize_) internal returns (address instance) {
        instance = target_.isBase ? target_.instance.clone() : target_.instance;
        if (target_.isBase && shouldInitialize_) {
            // wake-disable-next-line reentrancy (false positive, entrypoint is nonReentrant)
            ACloneable(instance).initialize(target_.parameters);
        }
    }

    /// @notice Route the claim fee to the creator, referrer, and protocol fee receiver
    /// @param boost The Boost for which to route the claim fee
    /// @param referrer_ The address of the referrer (if any)
    function _routeClaimFee(BoostLib.Boost storage boost, address referrer_) internal {
        if (claimFee == 0) return;
        uint256 netFee = claimFee;

        // If a referrer is provided, transfer the revshare and reduce the net fee
        if (referrer_ != address(0)) {
            uint256 referralShare = claimFee * boost.referralFee / FEE_DENOMINATOR;
            netFee -= referralShare;
            referrer_.safeTransferETH(referralShare);
        }

        // The remaining fee is split between the owner and the protocol
        boost.owner.safeTransferETH(netFee / 2);
        protocolFeeReceiver.safeTransferETH(address(this).balance);
    }
}
