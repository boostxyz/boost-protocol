// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "lib/solady/src/auth/Ownable.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {ReentrancyGuard} from "lib/solady/src/utils/ReentrancyGuard.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {BoostLib} from "src/shared/BoostLib.sol";
import {BoostRegistry} from "src/BoostRegistry.sol";
import {Cloneable} from "src/shared/Cloneable.sol";

import {Action} from "src/actions/Action.sol";
import {AllowList} from "src/allowlists/AllowList.sol";
import {Budget} from "src/budgets/Budget.sol";
import {Incentive} from "src/incentives/Incentive.sol";
import {Validator} from "src/validators/Validator.sol";

/// @title Boost Core
/// @notice The core contract for the Boost protocol
/// @dev This contract is currently `Ownable` for simplicity, but this will be replaced with a decentralized governance mechanism prior to GA
contract BoostCore is Ownable, ReentrancyGuard {
    using LibClone for address;
    using LibZip for bytes;

    /// @notice The list of boosts
    BoostLib.Boost[] private _boosts;

    /// @notice The BoostRegistry contract
    BoostRegistry public registry;

    /// @notice The base protocol fee (in bps)
    uint64 public protocolFee = 1_000; // 10%

    /// @notice The base referral fee (in bps)
    uint64 public referralFee = 500; // 5%

    /// @notice Constructor to initialize the owner
    constructor(BoostRegistry registry_) {
        _initializeOwner(msg.sender);
        registry = registry_;
    }

    /// @notice Create a new Boost
    /// @param data_ The compressed data for the Boost `(Budget, Target<Action>, Target<Validator>, Target<AllowList>, Target<Incentive>[], protocolFee, referralFee, maxParticipants, owner)`
    /// @dev The data is expected to:
    ///     - be packed using `abi.encode()` and compressed using [Solady's LibZip calldata compression](https://github.com/Vectorized/solady/blob/main/src/utils/LibZip.sol)
    ///     - properly decode to the following types (in order):
    ///         - `Budget` to be used for the Boost
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
    function createBoost(bytes calldata data_) external onlyOwner nonReentrant returns (BoostLib.Boost memory) {
        (
            Budget budget_,
            BoostLib.Target memory action_,
            BoostLib.Target memory validator_,
            BoostLib.Target memory allowList_,
            BoostLib.Target[] memory incentives_,
            uint64 protocolFee_,
            uint64 referralFee_,
            uint256 maxParticipants_,
            address owner_
        ) = abi.decode(
            data_.cdDecompress(),
            (
                Budget,
                BoostLib.Target,
                BoostLib.Target,
                BoostLib.Target,
                BoostLib.Target[],
                uint64,
                uint64,
                uint256,
                address
            )
        );

        // Validate the Budget
        _checkBudget(budget_);

        // Initialize the Boost
        BoostLib.Boost storage boost = _boosts.push();
        boost.owner = owner_;
        boost.budget = budget_;
        boost.protocolFee = protocolFee + protocolFee_;
        boost.referralFee = referralFee + referralFee_;
        boost.maxParticipants = maxParticipants_;

        // Setup the Boost components
        boost.action = Action(_makeTarget(type(Action).interfaceId, action_, true));
        boost.allowList = AllowList(_makeTarget(type(AllowList).interfaceId, allowList_, true));
        boost.incentives = _makeIncentives(incentives_, budget_);
        boost.validator = Validator(
            validator_.instance == address(0)
                ? boost.action.supportsInterface(type(Validator).interfaceId) ? address(boost.action) : address(0)
                : _makeTarget(type(Validator).interfaceId, validator_, true)
        );

        return boost;
    }

    function claimReward(uint256 boostId_, uint256 incentiveId_, bytes calldata data_) external nonReentrant {
        BoostLib.Boost storage boost = _boosts[boostId_];

        // wake-disable-next-line reentrancy (false positive, function is nonReentrant)
        if (!boost.action.validate(data_)) revert BoostError.Unauthorized();
        if (
            !boost.incentives[incentiveId_].claim(
                LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: msg.sender, data: data_})))
            )
        ) revert BoostError.ClaimFailed(msg.sender, data_);
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

    /// @notice Check that the provided Budget is valid and that the caller is authorized to use it
    /// @param budget_ The Budget to check
    /// @dev This function will revert if the Budget is invalid or the caller is unauthorized
    function _checkBudget(Budget budget_) internal view {
        _checkTarget(type(Budget).interfaceId, address(budget_));
        if (!budget_.isAuthorized(msg.sender)) revert BoostError.Unauthorized();
    }

    /// @notice Check that the provided Target is valid for the specified interface
    /// @param interfaceId The interface ID for the target
    /// @param instance The instance to check
    /// @dev This function will revert if the Target does not implement the expected interface
    /// @dev This check costs ~376 gas, which is worth it to validate the target
    function _checkTarget(bytes4 interfaceId, address instance) internal view {
        if (instance == address(0) || !Cloneable(instance).supportsInterface(interfaceId)) {
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

    /// @notice Configure a set of incentives for a Boost using the given Budget
    /// @param targets_ The set of incentives {Target<Incentive>[]}
    /// @param budget_ The Budget from which to allocate the incentives
    /// @return incentives The set of initialized incentives {Incentive[]}
    function _makeIncentives(BoostLib.Target[] memory targets_, Budget budget_)
        internal
        returns (Incentive[] memory incentives)
    {
        incentives = new Incentive[](targets_.length);
        for (uint256 i = 0; i < targets_.length; i++) {
            // Deploy the clone, but don't initialize until it we've preflighted
            incentives[i] = Incentive(_makeTarget(type(Incentive).interfaceId, targets_[i], false));

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
            Cloneable(instance).initialize(target_.parameters);
        }
    }
}
