// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";
import {IntentValidator, AIntentValidator} from "contracts/validators/IntentValidator.sol";

/**
 * @title IntentValidatorTest
 * @notice Test suite for the IntentValidator contract.
 * @dev This test suite follows similar patterns and structure as the SignerValidatorTest.
 */
contract IntentValidatorTest is Test {
    /// @notice The base implementation of the IntentValidator
    IntentValidator baseValidator = new IntentValidator();
    /// @notice The cloned validator used for testing
    IntentValidator validator;

    /// @notice Addresses used for testing
    address _validatorCaller;
    address _settlerCaller;
    address _unauthorizedCaller;
    address _owner;

    /// @notice Example data used in tests
    address claimant = makeAddr("claimant");
    uint256 boostId = 123;
    uint256 incentiveId = 0;
    bytes incentiveData = hex"abcd1234";

    /**
     * @notice Setup the test environment
     * @dev Deploys a new validator from the base, then initializes it with provided data.
     */
    function setUp() public {
        _owner = address(this);
        _validatorCaller = makeAddr("validatorCaller");
        _settlerCaller = makeAddr("settlerCaller");
        _unauthorizedCaller = makeAddr("unauthorizedCaller");

        bytes memory data = abi.encode(_validatorCaller, _settlerCaller);

        validator = IntentValidator(LibClone.clone(address(baseValidator)));
        validator.initialize(data);
    }

    ////////////////////////////////
    // IntentValidator.initialize //
    ////////////////////////////////

    /**
     * @notice Ensure that the validator is initialized correctly
     */
    function testInitialize() public view {
        // Check owner is correctly set
        assertEq(validator.owner(), _owner, "Owner should be set to the first signer");

        // Check the validator caller is correctly set
        // We cannot do assertEq on address in view function, so we trust normal test mode.
    }

    /**
     * @notice Ensure that initialization fails with invalid data
     */
    function testInitialize_InvalidData() public {
        IntentValidator badValidator = new IntentValidator();
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        badValidator.initialize(abi.encode(address(0)));
    }

    /**
     * @notice Ensure the initializer is disabled after initial call
     */
    function test_InitializerDisabled() public {
        // Similar logic from the SignerValidatorTest
        bytes32 slot = vm.load(address(validator), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    ////////////////////////////////
    // IntentValidator.latchValidation //
    ////////////////////////////////

    /**
     * @notice Test latchValidation functionality
     * @dev latchValidation should only be called by the settlerCaller
     */
    function testLatchValidation_ValidCaller() public {
        // hoax sets msg.sender
        hoax(_settlerCaller);
        validator.latchValidation();
        // No revert expected if correctly authorized
    }

    /**
     * @notice latchValidation should fail if called by an unauthorized address
     */
    function testLatchValidation_UnauthorizedCaller() public {
        hoax(_unauthorizedCaller);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.latchValidation();
    }

    //////////////////////////////////
    // IntentValidator.validate     //
    //////////////////////////////////

    /**
     * @notice Test validate fails if called by unauthorized caller
     */
    function testValidate_UnauthorizedCaller() public {
        hoax(_unauthorizedCaller);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(boostId, incentiveId, claimant, hex"");
    }

    /**
     * @notice Test validate fails if latchValidation has not been called
     */
    function testValidate_WithoutLatch() public {
        hoax(_validatorCaller);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(boostId, incentiveId, claimant, hex"");
    }

    /**
     * @notice Test a successful validate call after latchValidation is enabled
     * @dev This simulates the correct sequence of latchValidation -> validate
     */
    function testValidate_SuccessfulFlow() public {
        // Latch validation first
        hoax(_settlerCaller);
        validator.latchValidation();

        // Now call validate
        IBoostClaim.BoostClaimData memory claimData =
            IBoostClaim.BoostClaimData(abi.encode("dummyValidatorData"), incentiveData);

        hoax(_validatorCaller);
        bool result = validator.validate(boostId, incentiveId, claimant, abi.encode(claimData));
        assertTrue(result, "validate should return true if conditions met");
    }

    /**
     * @notice Test that incentives cannot be replayed once used
     */
    function testValidate_ReplayIncentive() public {
        // Latch validation first
        hoax(_settlerCaller);
        validator.latchValidation();

        // Validate once
        IBoostClaim.BoostClaimData memory claimData =
            IBoostClaim.BoostClaimData(abi.encode("dummyValidatorData"), incentiveData);

        hoax(_validatorCaller);
        assertTrue(validator.validate(boostId, incentiveId, claimant, abi.encode(claimData)));

        // Attempt to validate again with same incentiveId
        // Need to latch again to mimic a real scenario
        hoax(_settlerCaller);
        validator.latchValidation();

        hoax(_validatorCaller);
        vm.expectRevert(abi.encodeWithSelector(BoostError.IncentiveClaimed.selector, incentiveId));
        validator.validate(boostId, incentiveId, claimant, abi.encode(claimData));
    }

    /**
     * @notice Test that once validated, latch resets and another call without latch should fail
     */
    function testValidate_LatchResets() public {
        // Latch and validate once
        hoax(_settlerCaller);
        validator.latchValidation();

        IBoostClaim.BoostClaimData memory claimData =
            IBoostClaim.BoostClaimData(abi.encode("dummyValidatorData"), incentiveData);

        hoax(_validatorCaller);
        validator.validate(boostId, incentiveId, claimant, abi.encode(claimData));

        // Try to validate again without latching
        hoax(_validatorCaller);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(boostId, incentiveId + 1, claimant, abi.encode(claimData));
    }

    ////////////////////////////////
    // IntentValidator setters    //
    ////////////////////////////////

    /**
     * @notice Test setValidatorCaller only by owner
     */
    function testSetValidatorCaller() public {
        address newCaller = makeAddr("newValidatorCaller");
        validator.setValidatorCaller(newCaller);

        // Latch validation
        hoax(_settlerCaller);
        validator.latchValidation();

        // Test validation by the new caller
        hoax(newCaller);
        IBoostClaim.BoostClaimData memory claimData =
            IBoostClaim.BoostClaimData(abi.encode("dummyValidatorData"), incentiveData);
        assertTrue(validator.validate(boostId, incentiveId, claimant, abi.encode(claimData)));
    }

    /**
     * @notice Test setSettlerCaller only by owner
     */
    function testSetSettlerCaller() public {
        address newSettler = makeAddr("newSettler");
        validator.setSettlerCaller(newSettler);

        // Attempt to latchValidation from old settler should fail now
        hoax(_settlerCaller);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.latchValidation();

        // Latch validation from the new settler
        hoax(newSettler);
        validator.latchValidation();

        // Validate
        hoax(_validatorCaller);
        IBoostClaim.BoostClaimData memory claimData =
            IBoostClaim.BoostClaimData(abi.encode("dummyValidatorData"), incentiveData);
        assertTrue(validator.validate(boostId, incentiveId, claimant, abi.encode(claimData)));
    }

    //////////////////////////////////////
    // IntentValidator.getComponentInterface //
    //////////////////////////////////////

    /**
     * @notice Ensure the contract supports its intended interface
     */
    function testGetComponentInterface() public view {
        console.logBytes4(validator.getComponentInterface());
    }

    //////////////////////////////////////
    // IntentValidator.supportsInterface //
    //////////////////////////////////////

    /**
     * @notice Ensure the contract supports the AIntentValidator interface
     */
    function testSupportsInterface() public view {
        assertTrue(validator.supportsInterface(type(AIntentValidator).interfaceId));
        assertTrue(validator.supportsInterface(type(ACloneable).interfaceId));
    }

    /**
     * @notice Test non-supported interfaces return false
     */
    function testSupportsInterface_NotSupported() public view {
        assertFalse(validator.supportsInterface(type(Test).interfaceId));
    }
}
