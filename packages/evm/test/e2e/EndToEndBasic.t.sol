// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibZip} from "@solady/utils/LibZip.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {MockERC20, MockERC721} from "contracts/shared/Mocks.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {SimpleBudget} from "contracts/budgets/SimpleBudget.sol";

import {AAction} from "contracts/actions/AAction.sol";
import {AContractAction, ContractAction} from "contracts/actions/ContractAction.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";

import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";

import {AValidator} from "contracts/validators/AValidator.sol";

/**
 * @title EndToEnd
 * @notice This test suite is designed to test specific user stories related to the creation of a new Boost
 *
 * The supported user stories are as follows:
 *
 * - As a creator, I want to incentivize users to engage with my content so that I can grow my audience.
 *   - I can create a budget
 *   - Given that I have a budget
 *     - When I allocate assets to my budget
 *       - And the asset is an ERC20 token
 *         - My budget's balance should reflect the transferred amount
 *       - And the asset is ETH
 *         - My budget's balance should reflect the transferred amount
 *     - When I create a new Boost with my budget
 *       - I can specify the action of 'Mint an NFT'
 *         - And I can specify the address of my ERC721
 *         - And I can specify the selector of the mint function
 *         - And I can specify the mint price
 *         - And I don't have to specify a validator
 *       - I can specify the incentive of '100 ERC20' with a max of 5 participants
 *         - Then 500 ERC20 should be debited from my budget
 *       - I can specify a list of allowed addresses
 *       - I can specify an additional protocol fee
 *       - I can specify an additional referral fee
 *       - I can specify a maximum number of participants
 *       - I can specify the owner of the Boost
 *       - Then the Boost should be live
 *
 * - As a user, I want to complete a Boost so that I can earn the rewards.
 *   - Given that I am eligible for a Boost
 *     - When I complete the action
 *       - Then I can claim the rewards to my wallet
 */
contract EndToEndBasic is Test {
    BoostRegistry public registry = new BoostRegistry();
    BoostCore public core = new BoostCore(registry, address(1));

    MockERC20 public erc20 = new MockERC20();
    MockERC721 public erc721 = new MockERC721();

    SimpleBudget public _budget;

    function setUp() public {
        // Before we can fulfill our stories, we need to get some setup out of the way...
        erc20.mint(address(this), 1000 ether);

        // "I can specify the action of 'Mint an NFT'" => ERC721MintAction
        registry.register(BoostRegistry.RegistryType.ACTION, "ERC721MintAction", address(new ERC721MintAction()));

        // "I can specify the incentive of '100 ERC20' with a max of 5 participants" => ERC20Incentive
        registry.register(BoostRegistry.RegistryType.INCENTIVE, "ERC20Incentive", address(new ERC20Incentive()));

        // "I can specify a list of allowed addresses" => SimpleAllowList
        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList", address(new SimpleAllowList()));

        // "I can create a budget" => SimpleBudget
        registry.register(BoostRegistry.RegistryType.BUDGET, "SimpleBudget", address(new SimpleBudget()));
        _budget = _given_that_I_have_a_budget();
    }

    /// @notice As a creator, I want to incentivize users to engage with my content so that I can grow my audience.
    function test__As_a_creator() public {
        // "Given that I have a budget"
        SimpleBudget budget = _budget;
        _when_I_allocate_assets_to_my_budget(budget);

        // "When I create a boost with my budget"
        BoostLib.Boost memory boost = _when_I_create_a_new_boost_with_my_budget(budget);

        // "Then 500 ERC20 should be debited from my budget"
        assertEq(erc20.balanceOf(address(budget)), 0);

        // "Then the Boost should be live"
        assertEq(boost.owner, address(1));

        // Let's spot check the Boost we just created
        // - ABudget == SimpleBudget
        assertEq(address(boost.budget), address(budget));
        assertEq(SimpleBudget(payable(address(boost.budget))).owner(), address(this));
        assertTrue(budget.isAuthorized(address(this)));
        assertFalse(budget.isAuthorized(address(0xdeadbeef)));

        // - AAction == Validator
        assertEq(boost.action.supportsInterface(type(AAction).interfaceId), true);
        assertEq(boost.action.supportsInterface(type(AValidator).interfaceId), true);
        assertEq(address(boost.validator), address(boost.action));

        // - AAction == ERC721MintAction
        assertEq(ERC721MintAction(address(boost.action)).target(), address(erc721));
        assertEq(ERC721MintAction(address(boost.action)).selector(), erc721.mint.selector);
        assertEq(ERC721MintAction(address(boost.action)).value(), erc721.mintPrice());

        // - AllowList == SimpleAllowList
        assertTrue(boost.allowList.isAllowed(address(0xdeadbeef), bytes("")));
        assertTrue(boost.allowList.isAllowed(address(0xc0ffee), bytes("")));
        assertFalse(boost.allowList.isAllowed(address(this), bytes("")));

        // - AIncentive[0] == ERC20Incentive
        assertEq(ERC20Incentive(address(boost.incentives[0])).asset(), address(erc20));
        assertEq(ERC20Incentive(address(boost.incentives[0])).currentReward(), 100 ether);
        assertEq(ERC20Incentive(address(boost.incentives[0])).limit(), 5);

        // - Protocol Fee == 1,000 bps (custom fee) + 1,000 bps (base fee) = 2,000 bps = 20%
        assertEq(boost.protocolFee, 2_000);

        // - Referral Fee == 500 bps (custom fee) + 1,000 bps (base fee) = 1,500 bps = 15%
        assertEq(boost.referralFee, 1_500);

        // - Max Participants == 5
        assertEq(boost.maxParticipants, 5);
    }

    /// @notice As a user, I want to complete a Boost so that I can earn the rewards.
    function test__As_a_user() public {
        // "Given that I am eligible for a Boost"
        BoostLib.Boost memory boost = _given_that_I_am_eligible_for_a_boost();

        // "When I complete the action"
        // NOTE: We're emulating an EOA here by fetching the mint fee, then fetching the payload, then making the call
        // (all but the actual "send" would be handled by the UI)
        uint256 mintFee = ERC721MintAction(address(boost.action)).value();
        bytes memory mintPayload = boost.action.prepare(abi.encode(address(this)));
        (bool success,) = ERC721MintAction(address(boost.action)).target().call{value: mintFee}(mintPayload);
        assertTrue(success);

        // "Then I can claim the rewards to my wallet"
        uint256 boostId = 0; // This is the only Boost we've created = 0
        uint256 incentiveId = 0; // This is the only AIncentive in that Boost = 0
        uint256 tokenId = 1; // This is the tokenId we just minted = 1
        core.claimIncentive{value: core.claimFee()}(
            boostId, incentiveId, address(0), abi.encode(address(this), abi.encode(tokenId))
        );
    }

    //////////////////
    // Test Helpers //
    //////////////////

    function _given_that_I_have_a_budget() internal returns (SimpleBudget budget) {
        // 1. Let's find the budget implementation we want to use (this should be handled by the UI)
        //   - In this case, we're using the registered SimpleBudget implementation
        //   - Budgets require an owner and a list of initially authorized addresses
        address[] memory authorized = new address[](1);
        authorized[0] = address(core);

        budget = SimpleBudget(
            payable(
                address(
                    registry.deployClone(
                        BoostRegistry.RegistryType.BUDGET,
                        address(
                            registry.getBaseImplementation(
                                registry.getIdentifier(BoostRegistry.RegistryType.BUDGET, "SimpleBudget")
                            )
                        ),
                        "My Simple ABudget",
                        abi.encode(SimpleBudget.InitPayload({owner: address(this), authorized: authorized}))
                    )
                )
            )
        );

        assertTrue(budget.isAuthorized(address(this)));
    }

    function _when_I_allocate_assets_to_my_budget(ABudget budget) internal {
        // "When I allocate assets to my budget"
        // "And the asset is an ERC20 token"
        erc20.approve(address(budget), 500 ether);
        assertTrue(
            budget.allocate(
                abi.encode(
                    ABudget.Transfer({
                        assetType: ABudget.AssetType.ERC20,
                        asset: address(erc20),
                        target: address(this),
                        data: abi.encode(ABudget.FungiblePayload({amount: 500 ether}))
                    })
                )
            )
        );

        // "Then my budget's balance should reflect the transferred amount"
        assertEq(erc20.balanceOf(address(budget)), 500 ether);
        assertEq(budget.available(address(erc20)), 500 ether);

        // "When I allocate assets to my budget"
        // "And the asset is ETH"
        assertTrue(
            budget.allocate{value: 10.5 ether}(
                abi.encode(
                    ABudget.Transfer({
                        assetType: ABudget.AssetType.ETH,
                        asset: address(0),
                        target: address(this),
                        data: abi.encode(ABudget.FungiblePayload({amount: 10.5 ether}))
                    })
                )
            )
        );

        // "Then my budget's balance should reflect the transferred amount"
        assertEq(address(budget).balance, 10.5 ether);
        assertEq(budget.available(address(0)), 10.5 ether);
    }

    function _given_that_I_am_eligible_for_a_boost() internal returns (BoostLib.Boost memory) {
        _when_I_allocate_assets_to_my_budget(_budget);
        return _when_I_create_a_new_boost_with_my_budget(_budget);
    }

    /// @notice When I create a new Boost with my budget
    /// @param budget The budget to use for the Boost
    /// @return The Boost that was created
    function _when_I_create_a_new_boost_with_my_budget(ABudget budget) internal returns (BoostLib.Boost memory) {
        // NOTES:
        // - this looks super complicated, but the UI would handling all the encoding, registry lookups, etc.
        // - solidity stumbles on encoding array literals, so we pre-build those in memory

        // "I can specify a list of allowed addresses"
        address[] memory allowList = new address[](2);
        allowList[0] = address(0xdeadbeef);
        allowList[1] = address(0xc0ffee);

        // "I can specify the incentive of '100 ERC20' with a max of 5 participants"
        BoostLib.Target[] memory incentives = new BoostLib.Target[](1);
        incentives[0] = BoostLib.Target({
            // "I can specify the incentive..."
            isBase: true,
            instance: address(
                registry.getBaseImplementation(
                    registry.getIdentifier(BoostRegistry.RegistryType.INCENTIVE, "ERC20Incentive")
                )
            ),
            // "... of '100 ERC20' with a max of 5 participants"
            parameters: abi.encode(erc20, AERC20Incentive.Strategy.POOL, 100 ether, 5)
        });

        return core.createBoost(
            LibZip.cdCompress(
                abi.encode(
                    BoostCore.InitPayload(
                        // "... with my budget"
                        budget,
                        BoostLib.Target({
                            // "I can specify the action of 'Mint an NFT'"
                            // "... and I can specify the address of my ERC721"
                            // "... and I can specify the selector of the mint function"
                            // "... and I can specify the mint price"
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(BoostRegistry.RegistryType.ACTION, "ERC721MintAction")
                                )
                            ),
                            parameters: abi.encode(
                                AContractAction.InitPayload({
                                    chainId: block.chainid,
                                    target: address(erc721),
                                    selector: MockERC721.mint.selector,
                                    value: erc721.mintPrice()
                                })
                            )
                        }),
                        BoostLib.Target({
                            // "... and I don't have to specify a validator"
                            isBase: false,
                            instance: address(0),
                            parameters: bytes("")
                        }),
                        BoostLib.Target({
                            // "I can specify a list of allowed addresses"
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleAllowList")
                                )
                            ),
                            parameters: abi.encode(address(this), allowList)
                        }),
                        incentives, // "I can specify the incentive..."
                        1_000, // "I can specify an additional protocol fee" => 1,000 bps == 10%
                        500, // "I can specify an additional referral fee" => 500 bps == 5%
                        5, // "I can specify a maximum number of participants" => 5
                        address(1) // "I can specify the owner of the Boost" => address(1)
                    )
                )
            )
        );
    }
}
