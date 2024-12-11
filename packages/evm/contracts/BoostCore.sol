// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {IProtocolFeeModule} from "contracts/shared/IProtocolFeeModule.sol";

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

    event BoostCreated(
        uint256 indexed boostId,
        address indexed owner,
        address indexed action,
        uint256 incentiveCount,
        address validator,
        address allowList,
        address budget
    );

    event ProtocolFeesCollected(
        uint256 indexed boostId, uint256 indexed incentiveId, uint256 amount, address indexed recipient
    );

    struct IncentiveDisbursalInfo {
        ABudget.AssetType assetType; // ERC20, ERC1155, or ETH
        address asset; // Token address or zero address for ETH
        uint256 protocolFeesRemaining; // Remaining protocol fees for this incentive
        uint256 protocolFee; // Total protocol fees reserved for this incentive
        uint256 tokenId; // Token ID for ERC1155 incentives; unusued for fungible assets
    }

    event BoostClaimed(
        uint256 indexed boostId, uint256 indexed incentiveId, address indexed claimant, address referrer, bytes data
    );

    /// @notice The list of boosts
    BoostLib.Boost[] private _boosts;

    /// @notice The BoostRegistry contract
    BoostRegistry public registry;

    IAuth public createBoostAuth;

    /// @notice The protocol fee receiver
    address public protocolFeeReceiver;

    address public protocolFeeModule;

    /// @notice The base protocol fee (in bps)
    uint64 public protocolFee = 1_000; // 10%

    /// @notice The fee denominator (basis points, i.e. 10000 == 100%)
    uint64 public constant FEE_DENOMINATOR = 10_000;

    /// @notice the max erc20 amount that can be cleared as dust
    uint64 public DUST_THRESHOLD = 1_000;

    address private constant ZERO_ADDRESS = address(0);

    // @notice The set of incentives for the Boost
    mapping(bytes32 => IncentiveDisbursalInfo) public incentivesFeeInfo;

    modifier canCreateBoost(address sender) {
        if (address(createBoostAuth) != address(0) && !createBoostAuth.isAuthorized(sender)) {
            revert BoostError.Unauthorized();
        }
        _;
    }

    /// @notice Constructor to initialize the owner
    constructor(BoostRegistry registry_, address protocolFeeReceiver_, address owner_) {
        _initializeOwner(owner_);
        registry = registry_;
        protocolFeeReceiver = protocolFeeReceiver_;
    }

    /// @notice Create a new Boost
    /// @param data_ The compressed data for the Boost `(ABudget, Target<AAction>, Target<Validator>, Target<AAllowList>, Target<AIncentive>[], protocolFee, maxParticipants, owner)`
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
    ///         - `uint256` for the maxParticipants
    ///         - `address` for the owner of the Boost
    function createBoost(bytes calldata data_)
        external
        canCreateBoost(msg.sender)
        nonReentrant
        returns (BoostLib.Boost memory)
    {
        BoostLib.CreateBoostPayload memory payload_ = abi.decode(data_.cdDecompress(), (BoostLib.CreateBoostPayload));

        // Validate the Budget
        _checkBudget(payload_.budget);

        // Initialize the Boost
        BoostLib.Boost storage boost = _boosts.push();
        boost.owner = payload_.owner;
        boost.budget = payload_.budget;
        boost.protocolFee = address(protocolFeeModule) != address(0)
            ? IProtocolFeeModule(protocolFeeModule).getProtocolFee(data_) + payload_.protocolFee
            : protocolFee + payload_.protocolFee;
        boost.maxParticipants = payload_.maxParticipants;

        // Setup the Boost components
        boost.action = AAction(_makeTarget(type(AAction).interfaceId, payload_.action, true));
        boost.allowList = AAllowList(_makeTarget(type(AAllowList).interfaceId, payload_.allowList, true));
        address protocolAsset =
            protocolFeeModule != address(0) ? IProtocolFeeModule(protocolFeeModule).getProtocolAsset(data_) : address(0);
        boost.incentives = _makeIncentives(payload_.incentives, payload_.budget, boost.protocolFee, protocolAsset);
        boost.validator = AValidator(
            payload_.validator.instance == address(0)
                ? boost.action.supportsInterface(type(AValidator).interfaceId) ? address(boost.action) : address(0)
                : _makeTarget(type(AValidator).interfaceId, payload_.validator, true)
        );

        if (address(boost.validator) == address(0)) {
            revert BoostError.InvalidInstance(type(AValidator).interfaceId, address(0));
        }

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
        bytes32 key = _generateKey(boostId_, incentiveId_);
        IncentiveDisbursalInfo storage incentive = incentivesFeeInfo[key];
        AIncentive incentiveContract = boost.incentives[incentiveId_];

        // Validate the claimant against the allow list and the validator
        if (!boost.allowList.isAllowed(claimant, data_)) revert BoostError.Unauthorized();

        // Call validate and pass along the value
        if (!boost.validator.validate{value: msg.value}(boostId_, incentiveId_, claimant, data_)) {
            revert BoostError.Unauthorized();
        }
        // Get the balance of the asset before the claim
        uint256 initialBalance = incentive.asset != ZERO_ADDRESS ? _getAssetBalance(incentive, incentiveContract) : 0;

        // Execute the claim
        // wake-disable-next-line reentrancy (protected)
        if (!incentiveContract.claim(claimant, data_)) {
            revert BoostError.ClaimFailed(claimant, data_);
        }

        // Get the balance of the asset after the claim
        uint256 finalBalance = incentive.asset != ZERO_ADDRESS ? _getAssetBalance(incentive, incentiveContract) : 0;

        // Calculate the change in balance and the protocol fee amount
        uint256 balanceChange = initialBalance > finalBalance ? initialBalance - finalBalance : 0;
        uint256 protocolFeeAmount = (balanceChange * incentive.protocolFee) / FEE_DENOMINATOR;

        // Transfer the protocol fee to the protocol fee receiver if applicable
        if (protocolFeeAmount > 0) {
            _transferProtocolFee(incentive, protocolFeeAmount);
            incentive.protocolFeesRemaining -= protocolFeeAmount;
            emit ProtocolFeesCollected(boostId_, incentiveId_, protocolFeeAmount, protocolFeeReceiver);
        }

        emit BoostClaimed(boostId_, incentiveId_, claimant, referrer_, data_);
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

    /// @notice Get the incentives for a Boost
    /// @param key The key composed of the Boost ID and the Incentive ID - keccak256(abi.encodePacked(boostId, incentiveId))
    function getIncentiveFeesInfo(bytes32 key) external view returns (IncentiveDisbursalInfo memory) {
        return incentivesFeeInfo[key];
    }

    /// @notice Returns the protocol fee and any remaining incentive value to the owner or budget
    /// @param boostId The ID of the Boost
    function clawback(bytes calldata data_, uint256 boostId, uint256 incentiveId)
        external
        nonReentrant
        returns (uint256, address)
    {
        BoostLib.Boost memory boost = _boosts[boostId];

        if (msg.sender != address(boost.budget)) {
            revert BoostError.Unauthorized();
        }

        // Generate the unique key for the incentive
        bytes32 key = _generateKey(boostId, incentiveId);
        IncentiveDisbursalInfo storage incentive = incentivesFeeInfo[key];

        // Decode the data for clawback
        AIncentive.ClawbackPayload memory claim_ = abi.decode(data_, (AIncentive.ClawbackPayload));
        uint256 amount = abi.decode(claim_.data, (uint256));

        // Calculate the protocol fee based on the clawback amount and the protocol fee percentage
        uint256 protocolFeeAmount = (amount * incentive.protocolFee) / FEE_DENOMINATOR;

        // Transfer the protocol fee to the target of the clawback
        if (protocolFeeAmount > 0) {
            if (incentive.assetType == ABudget.AssetType.ERC20 || incentive.assetType == ABudget.AssetType.ETH) {
                incentive.asset.safeTransfer(claim_.target, protocolFeeAmount);
            } else if (incentive.assetType == ABudget.AssetType.ERC1155) {
                // wake-disable-next-line reentrancy (false positive, function is nonReentrant)
                IERC1155(incentive.asset).safeTransferFrom(
                    address(this), claim_.target, incentive.tokenId, protocolFeeAmount, ""
                );
            }
            emit ProtocolFeesCollected(boostId, incentiveId, protocolFeeAmount, claim_.target);
        }

        (uint256 clawbackAmount, address asset) = boost.incentives[incentiveId].clawback(abi.encode(claim_));
        // Throw a custom error here
        if (clawbackAmount == 0) {
            revert BoostError.ClawbackFailed(msg.sender, data_);
        }
        incentive.protocolFeesRemaining -= protocolFeeAmount;
        return (clawbackAmount, asset);
    }

    /// @notice Settle any outstanding protocol fees for a Boost incentive
    /// @param boostId The ID of the Boost
    /// @param incentiveId The ID of the AIncentive
    function settleProtocolFees(uint256 boostId, uint256 incentiveId) external nonReentrant {
        // Generate the unique key for the incentive
        bytes32 key = _generateKey(boostId, incentiveId);
        IncentiveDisbursalInfo storage incentive = incentivesFeeInfo[key];
        AIncentive incentiveContract = _boosts[boostId].incentives[incentiveId];

        // Get the expected balance based on protocolFeesRemaining and the specific incentive.protocolFee
        uint256 expectedFeeBalance = (incentive.protocolFeesRemaining * FEE_DENOMINATOR) / incentive.protocolFee;

        // Get the actual balance of the asset
        uint256 actualBalance = _getAssetBalance(incentive, incentiveContract);

        // Check if there is any discrepancy between the expected and actual balance
        if (actualBalance > expectedFeeBalance) {
            uint256 discrepancy = actualBalance - expectedFeeBalance;

            // Scale the amount to transfer based on the specific incentive protocol fee
            uint256 feeToCollect = (discrepancy * incentive.protocolFee) / FEE_DENOMINATOR;

            // Transfer the discrepancy to the protocol fee receiver
            _transferProtocolFee(incentive, feeToCollect);

            // Update protocolFeesRemaining based on the amount collected
            if (incentive.protocolFeesRemaining >= feeToCollect) {
                incentive.protocolFeesRemaining -= feeToCollect;
            } else {
                incentive.protocolFeesRemaining = 0;
            }

            emit ProtocolFeesCollected(boostId, incentiveId, feeToCollect, protocolFeeReceiver);
        }
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

    /// @notice Set the protocol fee
    /// @param protocolFee_ The new protocol fee (in bps)
    /// @dev This function is only callable by the owner
    function setProtocolFee(uint64 protocolFee_) external onlyOwner {
        protocolFee = protocolFee_;
    }

    /// @notice Set the dust threshold
    /// @param newThreshold The new Threshold
    /// @dev This function is only callable by the owner
    /// @dev This function will revert if `newThreshold >= FEE_DENOMINATOR` for security purposes
    function setDustThreshold(uint64 newThreshold) external onlyOwner {
        if (newThreshold >= FEE_DENOMINATOR) revert BoostError.Unauthorized();
        DUST_THRESHOLD = newThreshold;
    }

    /// @notice Set the protocol fee module address
    /// @param protocolFeeModule_ The new protocol fee module address
    /// @dev This function is only callable by the owner
    function setProtocolFeeModule(address protocolFeeModule_) external onlyOwner {
        protocolFeeModule = protocolFeeModule_;
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
    /// @return newIncentives The set of initialized incentives {AIncentive[]}

    function _makeIncentives(
        BoostLib.Target[] memory targets_,
        ABudget budget_,
        uint64 protocolFee_,
        address protocolAsset
    ) internal returns (AIncentive[] memory newIncentives) {
        uint256 boostId = _boosts.length - 1;
        newIncentives = new AIncentive[](targets_.length);

        for (uint256 i = 0; i < targets_.length; i++) {
            newIncentives[i] = _createSingleIncentive(targets_[i], budget_, protocolFee_, protocolAsset, boostId, i);
        }
    }

    /// @notice Create a single incentive for a Boost
    /// @param target The target for the incentive
    /// @param budget_ The ABudget from which to allocate the incentive
    /// @param protocolFee_ The protocol fee for the incentive
    /// @param protocolAsset The protocol asset for the incentive
    /// @param boostId The ID of the Boost
    /// @param incentiveId The ID of the incentive
    /// @return incentive The initialized incentive
    function _createSingleIncentive(
        BoostLib.Target memory target,
        ABudget budget_,
        uint64 protocolFee_,
        address protocolAsset,
        uint256 boostId,
        uint256 incentiveId
    ) private returns (AIncentive incentive) {
        bytes memory incentiveParams = target.parameters;

        _checkTarget(type(AIncentive).interfaceId, target.instance);

        if (!target.isBase) {
            revert BoostError.InvalidInstance(type(AIncentive).interfaceId, target.instance);
        }

        incentive = AIncentive(_makeTarget(type(AIncentive).interfaceId, target, false));

        bytes memory preflight = incentive.preflight(incentiveParams);
        if (preflight.length != 0) {
            (bytes memory disbursal, uint256 feeAmount) = _getFeeDisbursal(preflight, protocolFee_);
            if (!budget_.disburse(disbursal)) revert BoostError.InvalidInitialization();
            if (!budget_.disburse(preflight)) revert BoostError.InvalidInitialization();

            ABudget.Transfer memory request = abi.decode(preflight, (ABudget.Transfer));

            _addIncentive(
                boostId,
                incentiveId,
                protocolAsset != address(0) ? protocolAsset : request.asset,
                feeAmount,
                protocolFee_,
                request.assetType,
                incentiveParams
            );
        }

        // We initialize the incentive after the preflight check so it has the necesary value
        // wake-disable-next-line reentrancy (false positive, function is nonReentrant)
        incentive.initialize(incentiveParams);
    }

    /// @notice Internal helper function to calculate the protocol fee and prepare the modified disbursal
    /// @param preflight The encoded data for the original disbursement
    /// @return The modified preflight data for the protocol fee disbursement
    function _getFeeDisbursal(bytes memory preflight, uint64 _protocolFee)
        internal
        view
        returns (bytes memory, uint256)
    {
        // Decode the preflight data to extract the transfer details
        ABudget.Transfer memory request = abi.decode(preflight, (ABudget.Transfer));
        uint64 totalFee = _protocolFee;

        if (request.assetType == ABudget.AssetType.ERC20 || request.assetType == ABudget.AssetType.ETH) {
            // Decode the fungible payload
            ABudget.FungiblePayload memory payload = abi.decode(request.data, (ABudget.FungiblePayload));

            // Calculate the protocol fee based on BIPS
            uint256 feeAmount = (payload.amount * totalFee) / FEE_DENOMINATOR;

            // Create a new fungible payload for the protocol fee
            ABudget.FungiblePayload memory feePayload = ABudget.FungiblePayload({amount: feeAmount});

            // Modify the original request for the fee disbursal
            request.data = abi.encode(feePayload);
            request.target = address(this); // Set the target to BoostCore (this contract)

            // Encode and return the modified request as bytes
            return (abi.encode(request), feeAmount);
        } else if (request.assetType == ABudget.AssetType.ERC1155) {
            // Decode the ERC1155 payload
            ABudget.ERC1155Payload memory payload = abi.decode(request.data, (ABudget.ERC1155Payload));

            // Calculate the protocol fee based on BIPS
            uint256 feeAmount = (payload.amount * totalFee) / FEE_DENOMINATOR;

            // Create a new ERC1155 payload for the protocol fee
            ABudget.ERC1155Payload memory feePayload = ABudget.ERC1155Payload({
                tokenId: payload.tokenId,
                amount: feeAmount,
                data: payload.data // Keep the additional data unchanged
            });

            // Modify the original request for the fee disbursal
            request.data = abi.encode(feePayload);
            request.target = address(this); // Set the target to BoostCore (this contract)

            // Encode and return the modified request as bytes
            return (abi.encode(request), feeAmount);
        } else {
            revert BoostError.NotImplemented();
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

    /// @notice Generate a unique key for an incentive
    function _generateKey(uint256 boostId, uint256 incentiveId) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(boostId, incentiveId));
    }

    /// @notice Decode the ERC1155 data
    function _decodeERC1155Data(bytes memory data)
        internal
        pure
        returns (uint256 tokenId, bytes memory additionalData)
    {
        return abi.decode(data, (uint256, bytes));
    }

    function _addIncentive(
        uint256 boostId,
        uint256 incentiveId,
        address asset,
        uint256 totalProtocolFees,
        uint256 protocolFee_,
        ABudget.AssetType assetType,
        bytes memory extraData
    ) internal {
        uint256 tokenId;

        if (assetType == ABudget.AssetType.ERC1155) {
            (tokenId,) = abi.decode(extraData, (uint256, bytes));
        }

        IncentiveDisbursalInfo memory info = IncentiveDisbursalInfo(
            assetType,
            asset,
            totalProtocolFees,
            protocolFee_, // We store the current protocol fee in case it changes in the future
            tokenId
        );

        incentivesFeeInfo[_generateKey(boostId, incentiveId)] = info;
    }

    // Helper function to get the balance of the asset depending on its type
    function _getAssetBalance(IncentiveDisbursalInfo storage incentive, AIncentive incentiveContract)
        internal
        view
        returns (uint256)
    {
        if (incentive.assetType == ABudget.AssetType.ERC20 || incentive.assetType == ABudget.AssetType.ETH) {
            return IERC20(incentive.asset).balanceOf(address(incentiveContract));
        } else if (incentive.assetType == ABudget.AssetType.ERC1155) {
            return IERC1155(incentive.asset).balanceOf(address(incentiveContract), incentive.tokenId);
        }
        return 0;
    }

    // Helper function to transfer the protocol fee based on the asset type
    function _transferProtocolFee(IncentiveDisbursalInfo storage incentive, uint256 amount) internal {
        if (incentive.assetType == ABudget.AssetType.ERC20 || incentive.assetType == ABudget.AssetType.ETH) {
            incentive.asset.safeTransfer(protocolFeeReceiver, amount);
            _dustHatch(incentive.asset);
        } else if (incentive.assetType == ABudget.AssetType.ERC1155) {
            IERC1155(incentive.asset).safeTransferFrom(
                address(this), protocolFeeReceiver, incentive.tokenId, amount, ""
            );
        }
    }

    // helper that transfers dust to protocolFeeReceiver
    function _dustHatch(address asset) internal {
        uint256 balance = IERC20(asset).balanceOf(address(this));
        if (balance < DUST_THRESHOLD) {
            asset.safeTransfer(protocolFeeReceiver, balance);
        }
    }
}
