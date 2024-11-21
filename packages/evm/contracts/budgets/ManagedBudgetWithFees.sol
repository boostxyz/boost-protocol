// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {BoostCore} from "contracts/BoostCore.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {AManagedBudgetWithFees} from "contracts/budgets/AManagedBudgetWithFees.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {IClaw} from "contracts/shared/IClaw.sol";

/// @title Managed ABudget
/// @notice A minimal budget implementation with RBAC that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
contract ManagedBudgetWithFees is AManagedBudgetWithFees, ManagedBudget {
    using SafeTransferLib for address;

    /// @notice The payload for initializing a ManagedBudget
    struct InitPayloadWithFee {
        address owner;
        address[] authorized;
        uint256[] roles;
        uint256 managementFee;
    }

    /// @notice Construct a new ManagedBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ACloneable
    /// @param data_ The packed init data for the budget `(address owner, address[] authorized, uint256[] roles)`
    function initialize(bytes calldata data_) public virtual override(ACloneable, ManagedBudget) initializer {
        InitPayloadWithFee memory init_ = abi.decode(data_, (InitPayloadWithFee));
        _initializeOwner(init_.owner);
        for (uint256 i = 0; i < init_.authorized.length; i++) {
            _setRoles(init_.authorized[i], init_.roles[i]);
        }

        if (init_.authorized.length == 0) revert("no core contract set");
        core = BoostCore(init_.authorized[0]);

        managementFee = init_.managementFee;
        emit ManagementFeeSet(init_.managementFee);
    }

    /// @inheritdoc ABudget
    /// @notice Allocates assets to the budget
    /// @param data_ The packed data for the {Transfer} request
    /// @return True if the allocation was successful
    /// @dev The caller must have already approved the contract to transfer the asset
    /// @dev If the asset transfer fails, the allocation will revert
    function allocate(bytes calldata data_) external payable virtual override(ABudget, ManagedBudget) returns (bool) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            // Ensure the value received is equal to the `payload.amount`
            if (msg.value != payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else if (request.assetType == AssetType.ERC20) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            // Transfer `payload.amount` of the token to this contract
            request.asset.safeTransferFrom(request.target, address(this), payload.amount);
            if (request.asset.balanceOf(address(this)) < payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(request.data, (ERC1155Payload));

            // Transfer `payload.amount` of `payload.tokenId` to this contract
            IERC1155(request.asset).safeTransferFrom(
                request.target, address(this), payload.tokenId, payload.amount, payload.data
            );
            if (IERC1155(request.asset).balanceOf(address(this), payload.tokenId) < payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else {
            // Unsupported asset type
            return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    function clawbackFromTarget(address target, bytes calldata data_, uint256 boostId, uint256 incentiveId)
        public
        virtual
        override(ABudget, ManagedBudget)
        onlyAuthorized
        returns (uint256, address)
    {
        AIncentive.ClawbackPayload memory payload = AIncentive.ClawbackPayload({target: address(this), data: data_});
        IClaw incentive = IClaw(target);
        (uint256 amount, address asset) = incentive.clawback(abi.encode(payload), boostId, incentiveId);
        _distributedFungible[asset] -= amount;
        return (amount, asset);
    }

    /// @inheritdoc ABudget
    /// @notice Disburses assets from the budget to a single recipient if sender is owner, admin, or manager
    /// @param data_ The packed {Transfer} request
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(bytes calldata data_)
        public
        virtual
        override(ABudget, ManagedBudget)
        onlyAuthorized
        returns (bool)
    {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ERC20 || request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            uint256 maxManagementFee = payload.amount * managementFee / 10_000;

            uint256 avail = available(request.asset);
            if ((payload.amount + maxManagementFee) > avail) {
                revert InsufficientFunds(request.asset, avail, payload.amount + maxManagementFee);
            }

            incentiveFees[request.target] = maxManagementFee;
            reservedFunds[request.asset] += maxManagementFee;
            _distributedFungible[request.asset] += payload.amount;
            _transferFungible(request.asset, request.target, payload.amount);
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(request.data, (ERC1155Payload));

            uint256 avail = IERC1155(request.asset).balanceOf(address(this), payload.tokenId);
            if (payload.amount > avail) {
                revert InsufficientFunds(request.asset, avail, payload.amount);
            }

            _transferERC1155(request.asset, request.target, payload.tokenId, payload.amount, payload.data);
        } else {
            return false;
        }

        return true;
    }

    /// @inheritdoc AManagedBudgetWithFees
    function payManagementFee(uint256 boostId, uint256 incentiveId) public override {
        BoostLib.Boost memory boost = core.getBoost(boostId);

        address validIncentive = address(boost.incentives[incentiveId]);

        if (AIncentive(validIncentive).supportsInterface(type(AERC20Incentive).interfaceId)) {
            uint256 claims = AERC20Incentive(validIncentive).claims();
            uint256 limit = AERC20Incentive(validIncentive).limit();
            uint256 balanceRemaining = AIncentive(validIncentive).asset().balanceOf(validIncentive);
            if (claims == limit || balanceRemaining == 0) {
                _transferManagementFee(boostId, incentiveId, boost, claims, limit);
                return;
            }
            revert BoostError.Unauthorized();
        }
        if (AIncentive(validIncentive).supportsInterface(type(AERC20VariableIncentive).interfaceId)) {
            uint256 balanceRemaining = AIncentive(validIncentive).asset().balanceOf(validIncentive);
            uint256 totalClaimed = AERC20VariableIncentive(validIncentive).totalClaimed();
            uint256 limit = AERC20VariableIncentive(validIncentive).limit();
            if (totalClaimed == limit || balanceRemaining == 0) {
                _transferManagementFee(boostId, incentiveId, boost, totalClaimed, limit);
                return;
            }
            revert BoostError.Unauthorized();
        }
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc AManagedBudgetWithFees
    function clawbackFromTargetAndPayFee(address target, bytes calldata data_, uint256 boostId, uint256 incentiveId)
        external
        virtual
        override
        returns (uint256 amount, address asset)
    {
        (amount, asset) = clawbackFromTarget(target, data_, boostId, incentiveId);
        payManagementFee(boostId, incentiveId);
    }

    /// @notice Transfers the management fee for a specific boost and incentive
    /// @param boostId The ID of the boost for which the management fee is being transferred
    /// @param incentiveId The ID of the incentive within the boost
    /// @param boost The Boost object containing details about the boost
    /// @param claim The number of claims made for the incentive
    /// @param limit The limit of claims allowed for the incentive
    /// @dev The function calculates the management fee based on the claims and
    /// limit, then transfers the fee to the boost owner
    function _transferManagementFee(
        uint256 boostId,
        uint256 incentiveId,
        BoostLib.Boost memory boost,
        uint256 claim,
        uint256 limit
    ) internal {
        address incentive = address(boost.incentives[incentiveId]);
        uint256 maxAmount = incentiveFees[incentive];
        uint256 amount = maxAmount * claim / limit;
        delete incentiveFees[incentive];
        address asset = AIncentive(incentive).asset();
        address manager = boost.owner;
        reservedFunds[asset] -= maxAmount;

        emit ManagementFeePaid(boostId, incentiveId, manager, amount);

        _transferFungible(asset, manager, amount);
    }

    /// @inheritdoc ABudget
    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    /// @dev This is simply the sum of the current balance and the distributed amount
    function total(address asset_) external view virtual override(ABudget, ManagedBudget) returns (uint256) {
        return available(asset_) + _distributedFungible[asset_] + reservedFunds[asset_];
    }

    /// @inheritdoc ManagedBudget
    /// @dev substracts the reservedFunds for Management Fees
    function available(address asset_) public view virtual override(ABudget, ManagedBudget) returns (uint256) {
        return super.available(asset_) - reservedFunds[asset_];
    }

    /// @notice Sets the management fee percentage
    /// @dev Only the owner can call this function. The fee is in basis points (100 = 1%)
    /// @param fee_ The new management fee percentage in basis points
    function setManagementFee(uint256 fee_) external onlyOwner {
        require(fee_ <= 10000, "Fee cannot exceed 100%");
        managementFee = fee_;
        emit ManagementFeeSet(fee_);
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AManagedBudgetWithFees, AManagedBudget)
        returns (bool)
    {
        return AManagedBudgetWithFees.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(AManagedBudget, AManagedBudgetWithFees)
        returns (bytes4)
    {
        return type(AManagedBudgetWithFees).interfaceId;
    }
}
