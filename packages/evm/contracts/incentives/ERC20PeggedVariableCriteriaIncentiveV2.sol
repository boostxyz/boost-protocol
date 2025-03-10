// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {AERC20PeggedVariableCriteriaIncentiveV2} from "contracts/incentives/AERC20PeggedVariableCriteriaIncentiveV2.sol";
import {AERC20PeggedIncentive} from "contracts/incentives/AERC20PeggedIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {RBAC} from "contracts/shared/RBAC.sol";
import {IToppable} from "contracts/shared/IToppable.sol";

contract ERC20PeggedVariableCriteriaIncentiveV2 is
    RBAC,
    AERC20PeggedVariableCriteriaIncentiveV2,
    IToppable
{
    using SafeTransferLib for address;

    event ERC20PeggedIncentiveInitialized(
        address indexed asset,
        address indexed peg,
        uint256 reward,
        uint256 limit,
        address manager,
        uint256 maxReward,
        IncentiveCriteria criteria
    );

    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        address peg;
        uint256 reward;
        uint256 limit;
        address manager;
        uint256 maxReward;
        IncentiveCriteria criteria;
    }

    /// @inheritdoc AIncentive
    address public override asset;

    /// @inheritdoc AIncentive
    uint256 public override claims;

    /// @inheritdoc AERC20PeggedIncentive
    uint256 public override limit;

    /// @inheritdoc AERC20PeggedIncentive
    uint256 public override totalClaimed;

    // Asset for the peg
    address public peg;

    // Maximum reward amount per claim, if claim is more it will ratchet down to this amount
    uint256 maxReward;

    /// @notice Construct a new ERC20Incentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address asset, Strategy strategy, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        if (init_.limit == 0) revert BoostError.InvalidInitialization();

        // Ensure the maximum reward amount has been allocated
        uint256 maxTotalReward = init_.limit;
        uint256 available = init_.asset.balanceOf(address(this));
        if (available < maxTotalReward) {
            revert BoostError.InsufficientFunds(
                init_.asset,
                available,
                maxTotalReward
            );
        }

        IncentiveCriteria memory criteria_ = init_.criteria;

        asset = init_.asset;
        peg = init_.peg;
        reward = init_.reward;
        limit = init_.limit;
        maxReward = init_.maxReward;
        incentiveCriteria = criteria_;
        _initializeOwner(msg.sender);
        _setRoles(init_.manager, MANAGER_ROLE);
        emit ERC20PeggedIncentiveInitialized(
            init_.asset,
            init_.peg,
            init_.reward,
            init_.limit,
            init_.manager,
            init_.maxReward,
            init_.criteria
        );
    }

    /// @inheritdoc AIncentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The {InitPayload} for the incentive
    /// @return budgetData The {Transfer} payload to be passed to the {ABudget} for interpretation
    function preflight(
        bytes calldata data_
    ) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        uint256 amount = init_.limit;

        return
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: init_.asset,
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: amount}))
                })
            );
    }

    /// @notice Claim the incentive with variable rewards
    /// @param data_ The data payload for the incentive claim `(uint256signedAmount)`
    /// @return True if the incentive was successfully claimed
    function claim(
        address claimTarget,
        bytes calldata data_
    ) external override onlyOwner returns (bool) {
        BoostClaimData memory boostClaimData = abi.decode(
            data_,
            (BoostClaimData)
        );
        uint256 signedAmount = abi.decode(
            boostClaimData.incentiveData,
            (uint256)
        );
        uint256 claimAmount;

        if (reward == 0) {
            claimAmount = signedAmount;
        } else {
            // NOTE: this is assuming that the signed scalar is in ETH decimal format
            claimAmount = (reward * signedAmount) / 1e18;
        }
        if (maxReward != 0 && claimAmount > maxReward) {
            claimAmount = maxReward;
        }

        if (!_isClaimable(claimAmount)) revert NotClaimable();

        if (totalClaimed + claimAmount > limit) revert ClaimFailed();

        totalClaimed += claimAmount;
        claims += 1;
        asset.safeTransfer(claimTarget, claimAmount);

        emit Claimed(
            claimTarget,
            abi.encodePacked(asset, claimTarget, claimAmount)
        );
        return true;
    }

    /// @inheritdoc AIncentive
    function clawback(
        bytes calldata data_
    )
        external
        override
        onlyOwnerOrRoles(MANAGER_ROLE)
        returns (uint256, address)
    {
        ClawbackPayload memory claim_ = abi.decode(data_, (ClawbackPayload));
        uint256 amount = abi.decode(claim_.data, (uint256));

        limit -= amount;

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(
            claim_.target,
            abi.encodePacked(asset, claim_.target, amount)
        );

        return (amount, asset);
    }

    /// @notice Top up the incentive with more ERC20 tokens
    /// @dev Uses `msg.sender` as the token source, and uses `asset` to identify which token.
    ///      Caller must approve this contract to spend at least `amount` prior to calling.
    /// @param amount The number of tokens to top up
    function topup(
        uint256 amount
    ) external virtual override onlyOwnerOrRoles(MANAGER_ROLE) {
        if (amount == 0) {
            revert BoostError.InvalidInitialization();
        }
        // Transfer tokens from the caller into this contract
        asset.safeTransferFrom(msg.sender, address(this), amount);

        // Increase the total incentive limit
        limit += amount;

        emit ToppedUp(msg.sender, amount);
    }

    /// @notice Check if an incentive is claimable
    /// @param claimTarget the address that could receive the claim
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(
        address claimTarget,
        bytes calldata data_
    ) public view override returns (bool) {
        uint256 claimAmount;
        BoostClaimData memory boostClaimData = abi.decode(
            data_,
            (BoostClaimData)
        );

        uint256 signedAmount = abi.decode(
            boostClaimData.incentiveData,
            (uint256)
        );
        if (reward == 0) {
            claimAmount = signedAmount;
        } else {
            // NOTE: this is assuming that the signed scalar is in ETH decimal format
            claimAmount = (reward * signedAmount) / 1e18;
        }
        return _isClaimable(claimAmount);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(uint256 amount) internal view returns (bool) {
        return (totalClaimed + amount) <= limit;
    }

    function getPeg() external view override returns (address) {
        return peg;
    }

    /// @notice Returns the incentive criteria
    /// @return The stored IncentiveCriteria struct
    function getIncentiveCriteria()
        external
        view
        override
        returns (IncentiveCriteria memory)
    {
        return incentiveCriteria;
    }

    /// @notice Returns the maximum reward amount per claim
    /// @return The maximum reward amount per claim
    function getMaxReward() external view virtual returns (uint256) {
        return maxReward;
    }
}
