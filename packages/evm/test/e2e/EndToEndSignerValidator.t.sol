// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibZip} from "@solady/utils/LibZip.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {MockERC20, MockERC721} from "contracts/shared/Mocks.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {AllowList} from "contracts/allowlists/AllowList.sol";
import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

import {ASignerValidator, IBoostClaim} from "contracts/validators/ASignerValidator.sol";
import {SignerValidator} from "contracts/validators/SignerValidator.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

import {Action} from "contracts/actions/Action.sol";
import {ContractAction} from "contracts/actions/ContractAction.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";

import {Incentive} from "contracts/incentives/Incentive.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";

import {AValidator} from "contracts/validators/AValidator.sol";

contract EndToEndSigner is Test, OwnableRoles {
    BoostRegistry public registry = new BoostRegistry();
    address fee_recipient = address(1);
    BoostCore public core = new BoostCore(registry, fee_recipient);

    address budgetManager = makeAddr("Budget Manager");
    address budgetAdmin = makeAddr("Budget Admin");

    address validatorSigner;
    uint256 validatorSignerKey;

    // set to zero so we can set amounts at signing time
    uint256 rewardAmount = 0;
    uint256 incentiveLimitAmount = 500 ether;

    MockERC20 public erc20 = new MockERC20();
    MockERC721 public erc721 = new MockERC721();

    ManagedBudget public _budget;

    function setUp() public {
        // Before we can fulfill our stories, we need to get some setup out of the way...
        erc20.mint(address(this), 1000 ether);

        // "I can specify the action of 'Mint an NFT'" => ERC721MintAction
        registry.register(BoostRegistry.RegistryType.ACTION, "ERC721MintAction", address(new ERC721MintAction()));

        // "I can specify the incentive of '100 ERC20' with a max of 5 participants" => ERC20Incentive
        registry.register(
            BoostRegistry.RegistryType.INCENTIVE, "ERC20VariableIncentive", address(new ERC20VariableIncentive())
        );

        registry.register(BoostRegistry.RegistryType.VALIDATOR, "SignerValidator", address(new SignerValidator()));

        // "I can specify a list of allowed addresses" => SimpleAllowList
        registry.register(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleDenyList", address(new SimpleDenyList()));

        // "I can create a budget" => SimpleBudget
        registry.register(BoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(new ManagedBudget()));
        _budget = _given_that_I_have_a_budget();
    }

    function test__As_a_creator() public {
        // given the budget
        ManagedBudget budget = _budget;
        _when_I_allocate_assets_to_my_budget(budget);

        // "When I create a boost with my budget"
        BoostLib.Boost memory boost = _when_I_create_a_new_boost_with_my_budget(budget);

        // "Then 500 ERC20 should be debited from my budget"
        assertEq(erc20.balanceOf(address(budget)), 0);

        // "Then the Boost should be live"
        assertEq(boost.owner, address(1));

        // Let's spot check the Boost we just created
        // - Budget == ManagedBudget
        assertEq(address(boost.budget), address(budget));
        assertEq(boost.budget.owner(), address(this));
        assertTrue(budget.isAuthorized(address(this)));
        assertTrue(budget.isAuthorized(address(core)));
        assertFalse(budget.isAuthorized(address(0xdeadbeef)));

        // - Action == ERC721MintAction
        assertEq(ERC721MintAction(address(boost.action)).target(), address(erc721));
        assertEq(ERC721MintAction(address(boost.action)).selector(), erc721.mint.selector);
        assertEq(ERC721MintAction(address(boost.action)).value(), erc721.mintPrice());

        // - AllowList == SimpleBlockList
        assertFalse(boost.allowList.isAllowed(address(0xdeadbeef), bytes("")));
        assertFalse(boost.allowList.isAllowed(address(0xc0ffee), bytes("")));
        assertTrue(boost.allowList.isAllowed(address(this), bytes("")));

        // - Validator == SignerValidator
        assertEq(boost.action.supportsInterface(type(Action).interfaceId), true);
        assertEq(boost.action.supportsInterface(type(AValidator).interfaceId), true);
        assertEq(SignerValidator(address(boost.validator)).getComponentInterface(), type(ASignerValidator).interfaceId);

        // - Incentive[0] == ERC20VariableIncentive
        assertEq(ERC20VariableIncentive(address(boost.incentives[0])).asset(), address(erc20));
        assertEq(ERC20VariableIncentive(address(boost.incentives[0])).currentReward(), rewardAmount);
        assertEq(ERC20VariableIncentive(address(boost.incentives[0])).limit(), incentiveLimitAmount);

        // - Protocol Fee == 1,000 bps (custom fee) + 1,000 bps (base fee) = 2,000 bps = 20%
        assertEq(boost.protocolFee, 2_000);

        // - Referral Fee == 500 bps (custom fee) + 1,000 bps (base fee) = 1,500 bps = 15%
        assertEq(boost.referralFee, 1_500);

        // - Max Participants == 5
        assertEq(boost.maxParticipants, 5);
    }

    function test__As_a_user() public {
        address claimer = makeAddr("claimer");
        uint256 claimAmount = 100 ether;
        // "Given that I am eligible for a Boost"
        BoostLib.Boost memory boost = _given_that_I_am_eligible_for_a_boost();

        _i_can_complete_an_action(boost, claimer);

        // create Incentive Payload
        uint256 boostId = 0;
        uint256 incentiveId = 0;
        uint8 incentiveQuantity = 1;

        // claim an amount of 100 tokens
        bytes memory claimBytes = abi.encode(claimAmount);

        // create Validator Payload containing Incentive Payload
        bytes32 msgHash =
            SignerValidator(address(boost.validator)).hashSignerData(boostId, incentiveQuantity, claimer, claimBytes);

        bytes memory signature = _signHash(msgHash, validatorSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(validatorSigner, signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), claimBytes));

        // pass it into claimIncentive
        startHoax(claimer);
        core.claimIncentive{value: core.claimFee()}(boostId, incentiveId, address(0), claimData);

        assertEq(erc20.balanceOf(claimer), claimAmount);
    }

    //////////////////
    // Test Helpers //
    //////////////////

    function _given_that_I_have_a_budget() internal returns (ManagedBudget budget) {
        // 1. Let's find the budget implementation we want to use (this should be handled by the UI)
        //   - In this case, we're using the registered SimpleBudget implementation
        //   - Budgets require an owner and a list of initially authorized addresses
        address[] memory authorized = new address[](1);
        authorized[0] = address(core);

        uint256[] memory roles = new uint256[](1);
        roles[0] = _ROLE_0;

        budget = ManagedBudget(
            payable(
                address(
                    registry.deployClone(
                        BoostRegistry.RegistryType.BUDGET,
                        address(
                            registry.getBaseImplementation(
                                registry.getIdentifier(BoostRegistry.RegistryType.BUDGET, "ManagedBudget")
                            )
                        ),
                        "My Managed Budget",
                        abi.encode(
                            ManagedBudget.InitPayload({owner: address(this), authorized: authorized, roles: roles})
                        )
                    )
                )
            )
        );

        assertTrue(budget.isAuthorized(address(this)));
    }

    function _when_I_allocate_assets_to_my_budget(Budget budget) internal {
        // "When I allocate assets to my budget"
        // "And the asset is an ERC20 token"
        erc20.approve(address(budget), 500 ether);
        assertTrue(
            budget.allocate(
                abi.encode(
                    Budget.Transfer({
                        assetType: Budget.AssetType.ERC20,
                        asset: address(erc20),
                        target: address(this),
                        data: abi.encode(Budget.FungiblePayload({amount: 500 ether}))
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
                    Budget.Transfer({
                        assetType: Budget.AssetType.ETH,
                        asset: address(0),
                        target: address(this),
                        data: abi.encode(Budget.FungiblePayload({amount: 10.5 ether}))
                    })
                )
            )
        );

        // "Then my budget's balance should reflect the transferred amount"
        assertEq(address(budget).balance, 10.5 ether);
        assertEq(budget.available(address(0)), 10.5 ether);
    }

    function _when_I_create_a_new_boost_with_my_budget(Budget budget) internal returns (BoostLib.Boost memory) {
        // NOTES:
        // - this looks super complicated, but the UI would handling all the encoding, registry lookups, etc.
        // - solidity stumbles on encoding array literals, so we pre-build those in memory

        (validatorSigner, validatorSignerKey) = makeAddrAndKey("SignerValidator Signer");
        address[] memory signers = new address[](1);
        signers[0] = validatorSigner;

        // "I can specify a list of allowed addresses"
        address[] memory denyList = new address[](2);
        denyList[0] = address(0xdeadbeef);
        denyList[1] = address(0xc0ffee);

        // "I can specify the incentive of '100 ERC20' with a max of 5 participants"
        BoostLib.Target[] memory incentives = new BoostLib.Target[](1);
        incentives[0] = BoostLib.Target({
            // "I can specify the incentive..."
            isBase: true,
            instance: address(
                registry.getBaseImplementation(
                    registry.getIdentifier(BoostRegistry.RegistryType.INCENTIVE, "ERC20VariableIncentive")
                )
            ),
            // "... of '5 ERC20'"
            //address asset_, uint256 reward_, uint256 limit_
            // reward (second param) is unused
            parameters: abi.encode(erc20, rewardAmount, incentiveLimitAmount)
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
                                ContractAction.InitPayload({
                                    chainId: block.chainid,
                                    target: address(erc721),
                                    selector: MockERC721.mint.selector,
                                    value: erc721.mintPrice()
                                })
                            )
                        }),
                        BoostLib.Target({
                            // "... and I can specify a SignerValidator to sign off on claims"
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(BoostRegistry.RegistryType.VALIDATOR, "SignerValidator")
                                )
                            ),
                            parameters: abi.encode(signers, address(core))
                        }),
                        BoostLib.Target({
                            // "I can specify a list of allowed addresses"
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(BoostRegistry.RegistryType.ALLOW_LIST, "SimpleDenyList")
                                )
                            ),
                            parameters: abi.encode(address(this), denyList)
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

    function _given_that_I_am_eligible_for_a_boost() internal returns (BoostLib.Boost memory) {
        _when_I_allocate_assets_to_my_budget(_budget);
        return _when_I_create_a_new_boost_with_my_budget(_budget);
    }

    function _i_can_complete_an_action(BoostLib.Boost memory boost, address claimer) internal {
        // "When I complete the action"
        // NOTE: We're emulating an EOA here by fetching the mint fee, then fetching the payload, then making the call
        // (all but the actual "send" would be handled by the UI)
        uint256 mintFee = ERC721MintAction(address(boost.action)).value();
        bytes memory mintPayload = boost.action.prepare(abi.encode(claimer));
        hoax(claimer);
        (bool success,) = ERC721MintAction(address(boost.action)).target().call{value: mintFee}(mintPayload);
        assertTrue(success);
        assertEq(erc721.balanceOf(claimer), 1);
    }

    function _signHash(bytes32 digest, uint256 privateKey) internal pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }
}
