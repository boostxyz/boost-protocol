// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20, MockERC721} from "src/shared/Mocks.sol";

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

// Actions
import {Action} from "src/actions/Action.sol";
import {ContractAction} from "src/actions/ContractAction.sol";
import {ERC721MintAction} from "src/actions/ERC721MintAction.sol";

// Allowlists
import {AllowList} from "src/allowlists/AllowList.sol";
import {SimpleAllowList} from "src/allowlists/SimpleAllowList.sol";

// Budgets
import {Budget} from "src/budgets/Budget.sol";
import {SimpleBudget} from "src/budgets/SimpleBudget.sol";

// Incentives
import {Incentive} from "src/incentives/Incentive.sol";
import {ERC20Incentive} from "src/incentives/ERC20Incentive.sol";

// Validators
import {Validator} from "src/validators/Validator.sol";
import {SignerValidator} from "src/validators/SignerValidator.sol";

// Core and Shared
import {BoostCore} from "src/BoostCore.sol";
import {BoostRegistry} from "src/BoostRegistry.sol";
import {BoostError} from "src/shared/BoostError.sol";
import {BoostLib} from "src/shared/BoostLib.sol";
import {Cloneable} from "src/shared/Cloneable.sol";

contract BoostCoreTest is Test {
    using LibClone for address;

    MockERC20 mockERC20 = new MockERC20();
    MockERC721 mockERC721 = new MockERC721();

    BoostCore boostCore = new BoostCore(new BoostRegistry());
    BoostLib.Target action = _makeAction(address(mockERC721), MockERC721.mint.selector, mockERC721.mintPrice());
    BoostLib.Target allowList = _makeAllowList(address(this));

    address[] authorized = [address(boostCore)];
    Budget budget = _makeBudget(address(this), authorized);

    bytes validCreateCalldata = LibZip.cdCompress(
        abi.encode(
            budget,
            action,
            BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
            allowList,
            _makeIncentives(1),
            0.01 ether,
            0.001 ether,
            10_000,
            address(this)
        )
    );

    function setUp() public {
        mockERC20.mint(address(this), 100 ether);
        mockERC20.approve(address(budget), 100 ether);
        budget.allocate(
            LibZip.cdCompress(
                abi.encode(
                    Budget.Transfer({
                        assetType: Budget.AssetType.ERC20,
                        asset: address(mockERC20),
                        target: address(this),
                        data: abi.encode(Budget.FungiblePayload({amount: 100 ether}))
                    })
                )
            )
        );
    }

    /////////////////////////////
    // BoostCore Initial State //
    /////////////////////////////

    function testInitialOwner() public {
        assertEq(address(this), boostCore.owner());
    }

    function testInitialBoostCount() public {
        assertEq(0, boostCore.getBoostCount());
    }

    ///////////////////////////
    // BoostCore.createBoost //
    ///////////////////////////

    function testCreateBoost() public {
        boostCore.createBoost(validCreateCalldata);
        assertEq(1, boostCore.getBoostCount());
    }

    function testCreateBoost_FullValidation() public {
        // Create the Boost
        BoostLib.Boost memory boost = boostCore.createBoost(validCreateCalldata);

        // Check the basics
        assertEq(boost.owner, address(this));
        assertEq(boost.protocolFee, boostCore.protocolFee() + 0.01 ether);
        assertEq(boost.referralFee, boostCore.referralFee() + 0.001 ether);
        assertEq(boost.maxParticipants, 10_000);

        // Check the Budget
        assertEq(address(boost.budget), address(budget));
        assertTrue(boost.budget.isAuthorized(address(this)));

        // Check the Action
        ERC721MintAction _action = ERC721MintAction(address(boost.action));
        assertTrue(_action.supportsInterface(type(Action).interfaceId));
        assertEq(_action.target(), address(mockERC721));
        assertEq(_action.selector(), MockERC721.mint.selector);
        assertEq(_action.value(), mockERC721.mintPrice());

        // Check the AllowList
        SimpleAllowList _allowList = SimpleAllowList(address(boost.allowList));
        assertTrue(_allowList.supportsInterface(type(AllowList).interfaceId));
        assertEq(_allowList.owner(), address(this));
        assertTrue(_allowList.isAllowed(address(this), bytes("")));
        assertFalse(_allowList.isAllowed(address(1), bytes("")));

        // Check the Incentives
        assertEq(1, boost.incentives.length);
        ERC20Incentive _incentive = ERC20Incentive(address(boost.incentives[0]));
        assertTrue(_incentive.supportsInterface(type(Incentive).interfaceId));
        assertTrue(_incentive.strategy() == ERC20Incentive.Strategy.POOL);
        assertEq(_incentive.asset(), address(mockERC20));
        assertEq(_incentive.reward(), 1 ether);
        assertEq(_incentive.limit(), 100);
        assertEq(_incentive.claims(), 0);

        // Check the Validator (which should be the Action)
        assertTrue(boost.validator.supportsInterface(type(Validator).interfaceId));
        assertEq(address(boost.validator), address(boost.action));
    }

    function testCreateBoost_NoBudget() public {
        // Try to create a Boost without a Budget (should fail)
        bytes memory invalidBudgetCalldata = LibZip.cdCompress(
            abi.encode(
                address(0),
                action,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList,
                _makeIncentives(1),
                0.01 ether,
                0.001 ether,
                10_000,
                address(this)
            )
        );

        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(Budget).interfaceId, address(0))
        );
        boostCore.createBoost(invalidBudgetCalldata);
    }

    function testCreateBoost_InvalidBudgetNoERC165() public {
        // Try to create a Boost with an address that doesn't respond to ERC165 (should fail)
        bytes memory calldata_ = LibZip.cdCompress(
            abi.encode(
                address(1),
                action,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList,
                _makeIncentives(1),
                0.01 ether,
                0.001 ether,
                10_000,
                address(this)
            )
        );

        // No ERC165 support => Generic EVM exception
        vm.expectRevert(bytes(""));
        boostCore.createBoost(calldata_);

        // Nothing should be created
        assertEq(0, boostCore.getBoostCount());
    }

    function testCreateBoost_InvalidBudgetNoSupport() public {
        // Try to create a Boost with an address that doesn't support the Budget interface (should fail)
        bytes memory calldata_ = LibZip.cdCompress(
            abi.encode(
                action.instance,
                action,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                allowList,
                _makeIncentives(1),
                0.01 ether,
                0.001 ether,
                10_000,
                address(this)
            )
        );

        // Supports ERC165, but is not a Budget => InvalidBudget
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(Budget).interfaceId, action.instance)
        );
        boostCore.createBoost(calldata_);

        // Nothing should be created
        assertEq(0, boostCore.getBoostCount());
    }

    function testCreateBoost_InvalidAction() public {
        // Try to create a Boost with an invalid Action (should fail)
        bytes memory invalidActionCalldata = LibZip.cdCompress(
            abi.encode(
                budget,
                BoostLib.Target({isBase: true, instance: address(0), parameters: ""}),
                action,
                allowList,
                _makeIncentives(1),
                0.01 ether,
                0.001 ether,
                10_000,
                address(this)
            )
        );

        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InvalidInstance.selector, type(Action).interfaceId, address(0))
        );
        boostCore.createBoost(invalidActionCalldata);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _makeAction(address target, bytes4 selector, uint256 value) internal returns (BoostLib.Target memory) {
        return BoostLib.Target({
            isBase: true,
            instance: address(new ERC721MintAction()),
            parameters: LibZip.cdCompress(
                abi.encode(
                    ContractAction.InitPayload({chainId: block.chainid, target: target, selector: selector, value: value})
                )
                )
        });
    }

    function _makeAllowList(address addr) internal returns (BoostLib.Target memory) {
        address[] memory list = new address[](1);
        list[0] = addr;
        return BoostLib.Target({
            isBase: true,
            instance: address(new SimpleAllowList()),
            parameters: LibZip.cdCompress(abi.encode(address(this), list))
        });
    }

    function _makeBudget(address owner_, address[] memory authorized_) internal returns (Budget _budget) {
        _budget = Budget(payable(address(new SimpleBudget()).clone()));
        _budget.initialize(
            LibZip.cdCompress(abi.encode(SimpleBudget.InitPayload({owner: owner_, authorized: authorized_})))
        );
    }

    function _makeIncentives(uint256 count) internal returns (BoostLib.Target[] memory) {
        BoostLib.Target[] memory incentives = new BoostLib.Target[](count);
        for (uint256 i = 0; i < count; i++) {
            incentives[i] = BoostLib.Target({
                isBase: true,
                instance: address(new ERC20Incentive()),
                parameters: LibZip.cdCompress(
                    abi.encode(
                        ERC20Incentive.InitPayload({
                            asset: address(mockERC20),
                            strategy: ERC20Incentive.Strategy.POOL,
                            reward: 1 ether,
                            limit: 100
                        })
                    )
                    )
            });
        }
        return incentives;
    }
}
