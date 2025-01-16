// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {AManagedBudgetWithFeesV2} from "contracts/budgets/AManagedBudgetWithFeesV2.sol";
import {ManagedBudgetWithFees} from "contracts/budgets/ManagedBudgetWithFees.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostCore} from "contracts/BoostCore.sol";
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
import {ManagedBudgetWithFees, ManagedBudget} from "contracts/budgets/ManagedBudgetWithFees.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {IClaw} from "contracts/shared/IClaw.sol";

/// @title Managed Budget with Fees Version 2
/// @notice This contract inherits from AManagedBudgetWithFeesV2 and ManagedBudgetWithFees
contract ManagedBudgetWithFeesV2 is AManagedBudgetWithFeesV2, ManagedBudgetWithFees {
    using SafeTransferLib for address;

    /// @notice Construct a new ManagedBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ACloneable
    /// @param data_ The packed init data for the budget `(address owner, address[] authorized, uint256[] roles)`
    function initialize(bytes calldata data_) public virtual override(ACloneable, ManagedBudgetWithFees) initializer {
        InitPayloadWithFee memory init_ = abi.decode(data_, (InitPayloadWithFee));
        _initializeOwner(init_.owner);
        for (uint256 i = 1; i < init_.authorized.length; i++) {
            _setRoles(init_.authorized[i], init_.roles[i]);
        }

        if (init_.authorized.length == 0) revert("no core contract set");
        _setCore(init_.authorized[0]);
        managementFee = init_.managementFee;
        emit ManagementFeeSet(init_.managementFee);
    }

    function _setCore(address _core) internal {
        core = BoostCore(_core);
        coreAllowed[BoostCore(_core)] = true;
        _setRoles(_core, MANAGER_ROLE);
        emit BoostCoreUpdated(_core);
    }

    /// @inheritdoc AManagedBudgetWithFeesV2
    function payManagementFee(BoostCore core, uint256 boostId, uint256 incentiveId) public override {
        if (!coreAllowed[core]) revert BoostError.Unauthorized();
        BoostLib.Boost memory boost = core.getBoost(boostId);

        address validIncentive = address(boost.incentives[incentiveId]);

        if (AIncentive(validIncentive).supportsInterface(type(AERC20Incentive).interfaceId)) {
            uint256 claims = AERC20Incentive(validIncentive).claims();
            uint256 limit = AERC20Incentive(validIncentive).limit();
            _transferManagementFee(boostId, incentiveId, boost, claims, limit);
            return;
        }
        if (AIncentive(validIncentive).supportsInterface(type(AERC20VariableIncentive).interfaceId)) {
            uint256 totalClaimed = AERC20VariableIncentive(validIncentive).totalClaimed();
            uint256 limit = AERC20VariableIncentive(validIncentive).limit();
            _transferManagementFee(boostId, incentiveId, boost, totalClaimed, limit);
            return;
        }
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc ABudget
    function clawbackFromTarget(address target, bytes calldata data_, uint256 boostId, uint256 incentiveId)
        public
        virtual
        override(ABudget, ManagedBudgetWithFees)
        onlyAuthorized
        returns (uint256, address)
    {
        return ManagedBudgetWithFees.clawbackFromTarget(target, data_, boostId, incentiveId);
    }

    /// @inheritdoc AManagedBudgetWithFeesV2
    function clawbackFromTargetAndPayFee(
        address target,
        bytes calldata data_,
        BoostCore core,
        uint256 boostId,
        uint256 incentiveId
    ) external virtual override returns (uint256 amount, address asset) {
        (amount, asset) = ManagedBudgetWithFees.clawbackFromTarget(target, data_, boostId, incentiveId);
        payManagementFee(core, boostId, incentiveId);
    }

    function setCore(address core) external virtual override onlyOwnerOrRoles(ADMIN_ROLE) {
        _setCore(core);
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AManagedBudgetWithFeesV2, ManagedBudgetWithFees)
        returns (bool)
    {
        return AManagedBudgetWithFeesV2.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(AManagedBudgetWithFeesV2, ManagedBudgetWithFees)
        returns (bytes4)
    {
        return type(AManagedBudgetWithFeesV2).interfaceId;
    }
}
