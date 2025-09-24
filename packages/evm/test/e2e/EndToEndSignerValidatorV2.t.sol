// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {MockERC20, MockERC721} from "contracts/shared/Mocks.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry, ABoostRegistry} from "contracts/BoostRegistry.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

import {ASignerValidatorV2, IBoostClaim} from "contracts/validators/ASignerValidatorV2.sol";
import {SignerValidatorV2} from "contracts/validators/SignerValidatorV2.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

import {AAction} from "contracts/actions/AAction.sol";
import {AContractAction} from "contracts/actions/AContractAction.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";

import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";

contract EndToEndSignerValidatorV2 is Test, OwnableRoles {
    BoostRegistry public registry = new BoostRegistry();
    address fee_recipient = address(1);
    address boost_core_owner = address(this);
    BoostCore public core;

    address budgetManager = makeAddr("ABudget Manager");
    address budgetAdmin = makeAddr("ABudget Admin");

    address validatorSigner;
    uint256 validatorSignerKey;

    // set to zero so we can set amounts at signing time
    uint256 rewardAmount = 0;
    uint256 incentiveLimitAmount = 500 ether;

    MockERC20 public erc20 = new MockERC20();
    MockERC721 public erc721 = new MockERC721();

    ManagedBudget public _budget;

    function setUp() public {
        // Deploy and initialize BoostCore proxy
        BoostCore boostCoreImpl = new BoostCore();
        address proxy = LibClone.deployERC1967(address(boostCoreImpl));
        BoostCore(proxy).initialize(registry, address(1), address(this));
        core = BoostCore(proxy);

        // Set referral fee to 5% (500 bps)
        core.setReferralFee(500);

        // Before we can fulfill our stories, we need to get some setup out of the way...
        erc20.mint(address(this), 1000 ether);

        // Register components
        registry.register(ABoostRegistry.RegistryType.ACTION, "ERC721MintAction", address(new ERC721MintAction()));
        registry.register(
            ABoostRegistry.RegistryType.INCENTIVE, "ERC20VariableIncentive", address(new ERC20VariableIncentive())
        );
        registry.register(ABoostRegistry.RegistryType.VALIDATOR, "SignerValidatorV2", address(new SignerValidatorV2()));
        registry.register(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleDenyList", address(new SimpleDenyList()));
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(new ManagedBudget()));

        _budget = _given_that_I_have_a_budget();
    }

    function test__As_a_user_with_referral() public {
        address claimer = makeAddr("claimer");
        address referrer = makeAddr("referrer");

        // Given that I am eligible for a Boost with V2 validator
        BoostLib.Boost memory boost = _given_that_I_am_eligible_for_a_boost_v2();
        _i_can_complete_an_action(boost, claimer);

        // Record balances before claim
        uint256 claimerBalanceBefore = erc20.balanceOf(claimer);
        uint256 referrerBalanceBefore = erc20.balanceOf(referrer);

        // Create and execute claim
        bytes memory claimData = _createClaimDataWithReferrer(boost, claimer, referrer, 100 ether);

        startHoax(claimer);
        core.claimIncentive(0, 0, referrer, claimData);

        // Verify claimer received the full claim amount
        assertEq(erc20.balanceOf(claimer), claimerBalanceBefore + 100 ether);

        // Verify referrer received 5% referral fee
        assertEq(erc20.balanceOf(referrer), referrerBalanceBefore + 5 ether);
    }

    function test__Referral_fee_cannot_be_redirected() public {
        address claimer = makeAddr("claimer");
        address legit_referrer = makeAddr("legit_referrer");
        address malicious_referrer = makeAddr("malicious_referrer");

        // Given that I am eligible for a Boost with V2 validator
        BoostLib.Boost memory boost = _given_that_I_am_eligible_for_a_boost_v2();
        _i_can_complete_an_action(boost, claimer);

        // Create claim data with legitimate referrer signed in
        bytes memory claimData = _createClaimDataWithReferrer(boost, claimer, legit_referrer, 100 ether);

        // Attempt to redirect referral fee by passing different referrer in function parameter
        startHoax(claimer);
        vm.expectRevert(BoostError.Unauthorized.selector);
        core.claimIncentive(0, 0, malicious_referrer, claimData);
    }

    function test__V2_validator_rejects_claims_without_referrer_in_signature() public {
        address claimer = makeAddr("claimer");
        address referrer = makeAddr("referrer");

        // Given that I am eligible for a Boost with V2 validator
        BoostLib.Boost memory boost = _given_that_I_am_eligible_for_a_boost_v2();
        _i_can_complete_an_action(boost, claimer);

        // Create claim data with INVALID signature (V1 format without referrer)
        bytes memory claimData = _createInvalidClaimData(claimer, referrer, 100 ether);

        // This should fail because the signature doesn't include the referrer
        startHoax(claimer);
        vm.expectRevert(BoostError.Unauthorized.selector);
        core.claimIncentive(0, 0, referrer, claimData);
    }

    //////////////////
    // Test Helpers //
    //////////////////

    function _given_that_I_have_a_budget() internal returns (ManagedBudget budget) {
        address[] memory authorized = new address[](1);
        authorized[0] = address(core);

        uint256[] memory roles = new uint256[](1);
        roles[0] = _ROLE_0;

        budget = ManagedBudget(
            payable(
                address(
                    registry.deployClone(
                        ABoostRegistry.RegistryType.BUDGET,
                        address(
                            registry.getBaseImplementation(
                                registry.getIdentifier(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget")
                            )
                        ),
                        "My Managed ABudget",
                        abi.encode(
                            ManagedBudget.InitPayload({owner: address(this), authorized: authorized, roles: roles})
                        )
                    )
                )
            )
        );

        assertTrue(budget.isAuthorized(address(this)));
    }

    function _when_I_allocate_assets_to_my_budget(ABudget budget) internal {
        erc20.approve(address(budget), 600 ether);
        assertTrue(
            budget.allocate(
                abi.encode(
                    ABudget.Transfer({
                        assetType: ABudget.AssetType.ERC20,
                        asset: address(erc20),
                        target: address(this),
                        data: abi.encode(ABudget.FungiblePayload({amount: 600 ether}))
                    })
                )
            )
        );

        assertEq(erc20.balanceOf(address(budget)), 600 ether);
        assertEq(budget.available(address(erc20)), 600 ether);

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

        assertEq(address(budget).balance, 10.5 ether);
        assertEq(budget.available(address(0)), 10.5 ether);
    }

    function _when_I_create_a_new_boost_with_my_budget_v2(ABudget budget) internal returns (BoostLib.Boost memory) {
        (validatorSigner, validatorSignerKey) = makeAddrAndKey("SignerValidatorV2 Signer");
        address[] memory signers = new address[](1);
        signers[0] = validatorSigner;

        address[] memory denyList = new address[](2);
        denyList[0] = address(0xdeadbeef);
        denyList[1] = address(0xc0ffee);

        BoostLib.Target[] memory incentives = new BoostLib.Target[](1);
        incentives[0] = BoostLib.Target({
            isBase: true,
            instance: address(
                registry.getBaseImplementation(
                    registry.getIdentifier(ABoostRegistry.RegistryType.INCENTIVE, "ERC20VariableIncentive")
                )
            ),
            parameters: abi.encode(erc20, rewardAmount, incentiveLimitAmount, address(budget))
        });

        return core.createBoost(
            LibZip.cdCompress(
                abi.encode(
                    BoostLib.CreateBoostPayload(
                        budget,
                        BoostLib.Target({
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(ABoostRegistry.RegistryType.ACTION, "ERC721MintAction")
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
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(ABoostRegistry.RegistryType.VALIDATOR, "SignerValidatorV2")
                                )
                            ),
                            parameters: abi.encode(signers, address(core))
                        }),
                        BoostLib.Target({
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleDenyList")
                                )
                            ),
                            parameters: abi.encode(address(this), denyList)
                        }),
                        incentives,
                        1_000, // 10% protocol fee
                        5, // max participants
                        address(1) // boost owner
                    )
                )
            )
        );
    }

    function _given_that_I_am_eligible_for_a_boost_v2() internal returns (BoostLib.Boost memory) {
        _when_I_allocate_assets_to_my_budget(_budget);
        return _when_I_create_a_new_boost_with_my_budget_v2(_budget);
    }

    function _i_can_complete_an_action(BoostLib.Boost memory boost, address claimer) internal {
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

    function _createClaimDataWithReferrer(
        BoostLib.Boost memory boost,
        address claimer,
        address referrer,
        uint256 claimAmount
    ) internal view returns (bytes memory) {
        bytes memory claimBytes = abi.encode(claimAmount);

        bytes32 msgHash =
            SignerValidatorV2(address(boost.validator)).hashSignerData(0, 1, claimer, claimBytes, referrer);

        bytes memory signature = _signHash(msgHash, validatorSignerKey);

        ASignerValidatorV2.SignerValidatorInputParams memory validatorData =
            ASignerValidatorV2.SignerValidatorInputParams(validatorSigner, signature, 1);

        return abi.encode(IBoostClaim.BoostClaimDataWithReferrer(abi.encode(validatorData), claimBytes, referrer));
    }

    function _createInvalidClaimData(address claimer, address referrer, uint256 claimAmount)
        internal
        view
        returns (bytes memory)
    {
        bytes memory claimBytes = abi.encode(claimAmount);

        // Create invalid signature using V1 format (without referrer)
        bytes32 invalidMsgHash = keccak256(
            abi.encode(
                keccak256(
                    "SignerValidatorData(uint256 boostId,uint8 incentiveQuantity,address claimant,bytes incentiveData)"
                ),
                0,
                1,
                claimer,
                keccak256(claimBytes)
            )
        );

        bytes memory invalidSignature = _signHash(invalidMsgHash, validatorSignerKey);

        ASignerValidatorV2.SignerValidatorInputParams memory validatorData =
            ASignerValidatorV2.SignerValidatorInputParams(validatorSigner, invalidSignature, 1);

        return abi.encode(IBoostClaim.BoostClaimDataWithReferrer(abi.encode(validatorData), claimBytes, referrer));
    }
}
