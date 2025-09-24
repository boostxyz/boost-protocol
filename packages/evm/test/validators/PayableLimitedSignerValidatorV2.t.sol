// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibClone} from "@solady/utils/LibClone.sol";
import {Test, console, Vm} from "lib/forge-std/src/Test.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";
import {PayableLimitedSignerValidatorV2} from "contracts/validators/PayableLimitedSignerValidatorV2.sol";
import {APayableLimitedSignerValidatorV2} from "contracts/validators/APayableLimitedSignerValidatorV2.sol";
import {ASignerValidatorV2} from "contracts/validators/ASignerValidatorV2.sol";
import {IBoostCore} from "contracts/validators/PayableLimitedSignerValidatorV2.sol";

contract MockBoostCore is IBoostCore {
    address public protocolFeeReceiver;

    constructor(address _protocolFeeReceiver) {
        protocolFeeReceiver = _protocolFeeReceiver;
    }

    receive() external payable {}
}

contract PayableLimitedSignerValidatorV2Test is Test {
    struct TestParams {
        uint256 boostId;
        uint256 incentiveId;
        uint8 incentiveQuantity;
        bytes incentiveData;
        bytes32 msgHash;
        bytes signature;
        bytes claimData;
        address referrer;
    }

    PayableLimitedSignerValidatorV2 baseValidator;
    PayableLimitedSignerValidatorV2 validator;
    PayableLimitedSignerValidatorV2 clonedValidator;
    MockBoostCore mockBoostCore;

    address owner = makeAddr("owner");
    address signer1 = makeAddr("signer1");
    address signer2 = makeAddr("signer2");
    address claimant = makeAddr("claimant");
    address protocolFeeReceiver = makeAddr("protocolFeeReceiver");

    uint256 signerKey = 1;
    address signer = vm.addr(signerKey);
    uint256 maxClaims = 5;
    uint256 claimFee = 0.01 ether;

    event ClaimFeeUpdated(uint256 newFee);
    event ClaimFeePaid(
        address indexed claimant, uint256 indexed boostId, uint256 indexed incentiveId, uint256 fee, address feeReceiver
    );

    function hashClaimantData(uint256 boostId, uint256 incentiveId, address claimant_) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(boostId, incentiveId, claimant_));
    }

    function setUp() public {
        // Create mock BoostCore
        mockBoostCore = new MockBoostCore(protocolFeeReceiver);

        // Deploy the base validator with owner and initial claim fee
        baseValidator = new PayableLimitedSignerValidatorV2(owner, claimFee);

        // Prepare initialization data (now includes base implementation address instead of claim fee)
        address[] memory signers = new address[](2);
        signers[0] = owner;
        signers[1] = signer;

        bytes memory data = abi.encode(signers, address(mockBoostCore), maxClaims, address(baseValidator));

        // Create and initialize a clone
        validator = PayableLimitedSignerValidatorV2(LibClone.clone(address(baseValidator)));
        validator.initialize(data);

        // Create and initialize another clone
        clonedValidator = PayableLimitedSignerValidatorV2(LibClone.clone(address(baseValidator)));
        clonedValidator.initialize(data);
    }

    function testInitialize() public view {
        assertEq(validator.owner(), owner);
        assertEq(validator.maxClaimCount(), maxClaims);
        assertEq(validator.getClaimFee(), claimFee); // Clone reads from base
        assertTrue(validator.signers(owner));
        assertTrue(validator.signers(signer));
    }

    function createTestParams(uint8 incentiveQuantity) internal returns (TestParams memory params) {
        params.boostId = 1;
        params.incentiveId = 0;
        params.incentiveQuantity = incentiveQuantity;
        params.incentiveData = hex"def456232173821931823712381232131391321934";
        params.referrer = makeAddr("referrer");

        // Create signature using hashSignerData
        params.msgHash = validator.hashSignerData(
            params.boostId, params.incentiveQuantity, claimant, params.incentiveData, params.referrer
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, params.msgHash);
        params.signature = abi.encodePacked(r, s, v);

        // Create validator data
        ASignerValidatorV2.SignerValidatorInputParams memory validatorData =
            ASignerValidatorV2.SignerValidatorInputParams(signer, params.signature, params.incentiveQuantity);

        // Create claim data
        params.claimData = abi.encode(
            IBoostClaim.BoostClaimDataWithReferrer(abi.encode(validatorData), params.incentiveData, params.referrer)
        );
    }

    function testValidateWithFee() public {
        TestParams memory params = createTestParams(1);

        // Give the mockBoostCore some ETH
        vm.deal(address(mockBoostCore), 1 ether);

        // Track protocol fee receiver balance
        uint256 protocolBalanceBefore = protocolFeeReceiver.balance;

        // Validate with exact fee (must be called from validatorCaller)
        vm.prank(address(mockBoostCore));
        bool result =
            validator.validate{value: claimFee}(params.boostId, params.incentiveId, claimant, params.claimData);

        assertTrue(result);
        assertEq(protocolFeeReceiver.balance, protocolBalanceBefore + claimFee);
        assertEq(validator.quantityClaimed(hashClaimantData(params.boostId, params.incentiveId, claimant)), 1);
    }

    function testClaimFeePaidEvent() public {
        TestParams memory params = createTestParams(1);

        // Give the mockBoostCore some ETH
        vm.deal(address(mockBoostCore), 1 ether);

        // Expect the ClaimFeePaid event to be emitted
        vm.expectEmit(true, true, true, true);
        emit ClaimFeePaid(claimant, params.boostId, params.incentiveId, claimFee, protocolFeeReceiver);

        // Validate with exact fee (must be called from validatorCaller)
        vm.prank(address(mockBoostCore));
        validator.validate{value: claimFee}(params.boostId, params.incentiveId, claimant, params.claimData);
    }

    function testValidateWithExcessFee() public {
        TestParams memory params = createTestParams(1);
        uint256 excessAmount = 0.05 ether;

        // Give the mockBoostCore some ETH
        vm.deal(address(mockBoostCore), 1 ether);

        // Try to validate with excess fee - should revert with InvalidClaimFee
        vm.prank(address(mockBoostCore));
        vm.expectRevert(APayableLimitedSignerValidatorV2.InvalidClaimFee.selector);
        validator.validate{value: claimFee + excessAmount}(
            params.boostId, params.incentiveId, claimant, params.claimData
        );
    }

    function testValidateInsufficientFee() public {
        TestParams memory params = createTestParams(1);

        // Give the mockBoostCore some ETH
        vm.deal(address(mockBoostCore), 1 ether);

        // Try to validate with insufficient fee (must be called from validatorCaller)
        vm.prank(address(mockBoostCore));
        vm.expectRevert(APayableLimitedSignerValidatorV2.InvalidClaimFee.selector);
        validator.validate{value: claimFee - 1}(params.boostId, params.incentiveId, claimant, params.claimData);
    }

    function testValidateZeroFee() public {
        // Set claim fee to 0 on base
        vm.prank(owner);
        baseValidator.setClaimFee(0);

        TestParams memory params = createTestParams(1);

        // Validate with no value sent (must be called from validatorCaller)
        vm.prank(address(mockBoostCore));
        bool result = validator.validate(params.boostId, params.incentiveId, claimant, params.claimData);

        assertTrue(result);
        assertEq(validator.quantityClaimed(hashClaimantData(params.boostId, params.incentiveId, claimant)), 1);
    }

    function testNoEventWhenZeroFee() public {
        // Set claim fee to 0 on base
        vm.prank(owner);
        baseValidator.setClaimFee(0);

        TestParams memory params = createTestParams(1);

        // Expect NO ClaimFeePaid event to be emitted when fee is 0
        vm.recordLogs();

        // Validate with no value sent (must be called from validatorCaller)
        vm.prank(address(mockBoostCore));
        bool result = validator.validate(params.boostId, params.incentiveId, claimant, params.claimData);

        assertTrue(result);

        // Check that no ClaimFeePaid event was emitted
        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 claimFeePaidSelector = keccak256("ClaimFeePaid(address,uint256,uint256,uint256,address)");
        for (uint256 i = 0; i < logs.length; i++) {
            // ClaimFeePaid event selector
            assertNotEq(logs[i].topics[0], claimFeePaidSelector);
        }
    }

    function testMaxClaimsPerUser() public {
        // Test that each user has their own independent claim limit
        address claimant2 = makeAddr("claimant2");

        // Create params for claimant1
        TestParams memory params1 = createTestParams(1);

        // Give the mockBoostCore some ETH
        vm.deal(address(mockBoostCore), 10 ether);

        // Claimant1 claims once
        vm.prank(address(mockBoostCore));
        assertTrue(
            validator.validate{value: claimFee}(params1.boostId, params1.incentiveId, claimant, params1.claimData)
        );
        assertEq(validator.quantityClaimed(hashClaimantData(params1.boostId, params1.incentiveId, claimant)), 1);

        // Create new params for claimant2 with same boostId and incentiveId
        TestParams memory params2;
        params2.boostId = params1.boostId;
        params2.incentiveId = params1.incentiveId;
        params2.incentiveQuantity = 2;
        params2.incentiveData = params1.incentiveData;
        params2.referrer = params1.referrer;

        // Create signature for claimant2
        params2.msgHash = validator.hashSignerData(
            params2.boostId, params2.incentiveQuantity, claimant2, params2.incentiveData, params1.referrer
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, params2.msgHash);
        params2.signature = abi.encodePacked(r, s, v);

        // Create validator data for claimant2
        ASignerValidatorV2.SignerValidatorInputParams memory validatorData2 =
            ASignerValidatorV2.SignerValidatorInputParams(signer, params2.signature, params2.incentiveQuantity);

        // Create claim data for claimant2
        params2.claimData = abi.encode(
            IBoostClaim.BoostClaimDataWithReferrer(abi.encode(validatorData2), params2.incentiveData, params1.referrer)
        );

        // Claimant2 can also claim (independent limit)
        vm.prank(address(mockBoostCore));
        assertTrue(
            validator.validate{value: claimFee}(params2.boostId, params2.incentiveId, claimant2, params2.claimData)
        );
        assertEq(validator.quantityClaimed(hashClaimantData(params2.boostId, params2.incentiveId, claimant2)), 1);

        // Verify both claimants have independent counts
        assertEq(validator.quantityClaimed(hashClaimantData(params1.boostId, params1.incentiveId, claimant)), 1);
        assertEq(validator.quantityClaimed(hashClaimantData(params2.boostId, params2.incentiveId, claimant2)), 1);
    }

    function testSetClaimFee() public {
        uint256 newFee = 0.02 ether;

        // Clone cannot set claim fee
        vm.prank(owner);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.setClaimFee(newFee);

        // Only base implementation owner can set claim fee
        vm.prank(claimant);
        vm.expectRevert();
        baseValidator.setClaimFee(newFee);

        // Base owner sets claim fee
        vm.prank(owner);
        vm.expectEmit(true, true, true, true);
        emit ClaimFeeUpdated(newFee);
        baseValidator.setClaimFee(newFee);

        assertEq(baseValidator.claimFee(), newFee);
        assertEq(baseValidator.getClaimFee(), newFee);

        // Verify clones see the updated fee
        assertEq(validator.getClaimFee(), newFee);
        assertEq(clonedValidator.getClaimFee(), newFee);
    }

    function testGetClaimFee() public view {
        assertEq(validator.getClaimFee(), claimFee);
    }

    function testInvalidSignature() public {
        uint256 boostId = 1;
        uint256 incentiveId = 0;
        uint8 incentiveQuantity = 1;
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";
        address referrer = makeAddr("referrer");

        // Create invalid signature (wrong signer)
        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData, referrer);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(999, msgHash); // Wrong key
        bytes memory signature = abi.encodePacked(r, s, v);

        // Create validator data (with valid signer address but wrong signature)
        ASignerValidatorV2.SignerValidatorInputParams memory validatorData =
            ASignerValidatorV2.SignerValidatorInputParams(signer, signature, incentiveQuantity);

        // Create claim data
        bytes memory claimData =
            abi.encode(IBoostClaim.BoostClaimDataWithReferrer(abi.encode(validatorData), incentiveData, referrer));

        // Give the mockBoostCore some ETH
        vm.deal(address(mockBoostCore), 1 ether);

        // Try to validate with invalid signature - should fail signature validation
        vm.prank(address(mockBoostCore));
        assertFalse(validator.validate{value: claimFee}(boostId, incentiveId, claimant, claimData));

        // Check that fee was not transferred
        assertEq(protocolFeeReceiver.balance, 0);
    }

    function testSupportsInterface() public view {
        assertTrue(validator.supportsInterface(type(APayableLimitedSignerValidatorV2).interfaceId));
    }

    function testGetComponentInterface() public view {
        assertEq(validator.getComponentInterface(), type(APayableLimitedSignerValidatorV2).interfaceId);
    }

    function testClonedValidatorBehavior() public {
        // Test that cloned validator behaves the same as the original
        assertEq(clonedValidator.owner(), owner);
        assertEq(clonedValidator.maxClaimCount(), maxClaims);
        assertEq(clonedValidator.getClaimFee(), claimFee); // Clone reads from base
        assertTrue(clonedValidator.signers(owner));
        assertTrue(clonedValidator.signers(signer));

        // Test validation on clone - need to create params using cloned validator's domain
        TestParams memory params;
        params.boostId = 1;
        params.incentiveId = 0;
        params.incentiveQuantity = 1;
        params.incentiveData = hex"def456232173821931823712381232131391321934";
        params.referrer = makeAddr("referrer");

        // Create signature using cloned validator's hashSignerData (different domain)
        params.msgHash = clonedValidator.hashSignerData(
            params.boostId, params.incentiveQuantity, claimant, params.incentiveData, params.referrer
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, params.msgHash);
        params.signature = abi.encodePacked(r, s, v);

        // Create validator data
        ASignerValidatorV2.SignerValidatorInputParams memory validatorData =
            ASignerValidatorV2.SignerValidatorInputParams(signer, params.signature, params.incentiveQuantity);

        // Create claim data
        params.claimData = abi.encode(
            IBoostClaim.BoostClaimDataWithReferrer(abi.encode(validatorData), params.incentiveData, params.referrer)
        );

        vm.deal(address(mockBoostCore), 1 ether);
        vm.prank(address(mockBoostCore));
        bool result =
            clonedValidator.validate{value: claimFee}(params.boostId, params.incentiveId, claimant, params.claimData);

        assertTrue(result);
        assertEq(protocolFeeReceiver.balance, claimFee);
    }

    function testGlobalFeeUpdate() public {
        // Initial fee is 0.01 ether
        assertEq(validator.getClaimFee(), claimFee);
        assertEq(clonedValidator.getClaimFee(), claimFee);

        // Update fee on base to 0.02 ether
        uint256 newFee = 0.02 ether;
        vm.prank(owner);
        baseValidator.setClaimFee(newFee);

        // All clones should see the new fee
        assertEq(validator.getClaimFee(), newFee);
        assertEq(clonedValidator.getClaimFee(), newFee);

        // Validation should now require the new fee
        TestParams memory params = createTestParams(1);
        vm.deal(address(mockBoostCore), 1 ether);

        // Old fee should fail
        vm.prank(address(mockBoostCore));
        vm.expectRevert(APayableLimitedSignerValidatorV2.InvalidClaimFee.selector);
        validator.validate{value: claimFee}(params.boostId, params.incentiveId, claimant, params.claimData);

        // New fee should succeed
        vm.prank(address(mockBoostCore));
        bool result = validator.validate{value: newFee}(params.boostId, params.incentiveId, claimant, params.claimData);
        assertTrue(result);
    }

    receive() external payable {}
}
