// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {ECDSA} from "@solady/utils/ECDSA.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {Initializable} from "@solady/utils/Initializable.sol";

import {MockERC1271Wallet} from "lib/solady/test/utils/mocks/MockERC1271Wallet.sol";
import {MockERC1271Malicious} from "lib/solady/test/utils/mocks/MockERC1271Malicious.sol";

import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {AValidator} from "contracts/validators/AValidator.sol";
import {SignerValidator, ASignerValidator, IncentiveBits} from "contracts/validators/SignerValidator.sol";

contract SignerValidatorTest is Test {
    SignerValidator baseValidator = new SignerValidator();
    SignerValidator validator;
    address _validatorCaller;

    uint256 testSignerKey = uint256(vm.envUint("TEST_SIGNER_PRIVATE_KEY"));
    address testSigner = vm.addr(testSignerKey);

    uint256 private _MAX_SECP256K_CURVE_VALUE =
        115792089237316195423570985008687907852837564279074904382605163141518161494336;

    uint256 fakeSignerKey = uint256(0xdeadbeef);
    address fakeSigner = vm.addr(fakeSignerKey);

    MockERC1271Wallet smartSignerMock = new MockERC1271Wallet(testSigner);
    MockERC1271Malicious maliciousSignerMock = new MockERC1271Malicious();

    bytes32 MESSAGE_HASH = keccak256(abi.encodePacked("test"));
    bytes TRUSTED_EOA_SIGNATURE = _signHash(MESSAGE_HASH, testSignerKey);
    bytes UNTRUSTED_EOA_SIGNATURE = _signHash(MESSAGE_HASH, fakeSignerKey);

    bytes PACKED_EOA_SIGNATURE = abi.encode(testSigner, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE);
    bytes PACKED_1271_SIGNATURE = abi.encode(smartSignerMock, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE);

    bytes PACKED_MALICIOUS_SIGNATURE = abi.encode(maliciousSignerMock, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE);
    bytes PACKED_WRONG_SIGNATURE = abi.encode(testSigner, MESSAGE_HASH, UNTRUSTED_EOA_SIGNATURE);
    bytes PACKED_UNTRUSTED_SIGNATURE = abi.encode(fakeSigner, MESSAGE_HASH, UNTRUSTED_EOA_SIGNATURE);

    function setUp() public {
        address[] memory signers = new address[](3);
        signers[0] = address(this);
        signers[1] = testSigner;
        signers[2] = address(smartSignerMock);
        _validatorCaller = address(this);

        bytes memory data = abi.encode(signers, _validatorCaller);
        validator = SignerValidator(LibClone.clone(address(baseValidator)));
        validator.initialize(data);
    }

    ////////////////////////////////
    // SignerValidator.initialize //
    ////////////////////////////////

    function testInitialize() public view {
        // The initializer should have set 3 signers:
        assertTrue(validator.signers(address(this)));
        assertTrue(validator.signers(testSigner));
        assertTrue(validator.signers(address(smartSignerMock)));

        // Other signers should not be authorized
        assertFalse(validator.signers(fakeSigner));
        assertFalse(validator.signers(address(maliciousSignerMock)));

        // The owner of the contract should be the first signer
        assertEq(validator.owner(), address(this));
    }

    function testInitialize_InvalidData() public {
        SignerValidator badValidator = new SignerValidator();
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        badValidator.initialize(abi.encode(address(0)));
    }

    function test_InitializerDisabled() public {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot = vm.load(address(validator), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    /////////////////////////////
    // SignerValidator.signers //
    /////////////////////////////

    function testSigners() public view {
        assertTrue(validator.signers(address(this)));
        assertTrue(validator.signers(testSigner));
        assertTrue(validator.signers(address(smartSignerMock)));
        assertFalse(validator.signers(fakeSigner));
    }

    //////////////////////////////
    // SignerValidator.validate //
    //////////////////////////////

    function testValidate_ValidSignature() public {
        uint256 boostId = 5;
        uint256 incentiveId = 1;
        uint8 incentiveQuantity = 2;
        address claimant = makeAddr("claimant");
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";
        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, testSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(testSigner, signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));
        assertTrue(validator.validate(boostId, incentiveId, claimant, claimData));
    }

    function testValidate_UnauthorizerCaller() public {
        address badCaller = makeAddr("badValidatorCaller");

        hoax(badCaller);
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(0, 0, address(0), hex"");
    }

    function testValidate_UnauthorizedSigner() public {
        uint256 boostId = 5;
        uint8 incentiveQuantity = 2;
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";

        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, address(0), incentiveData);
        bytes memory signature = _signHash(msgHash, fakeSignerKey);
        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(fakeSigner, signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));

        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(0, 0, address(0), claimData);
    }

    function testValidate_ReplayedSignature() public {
        uint256 boostId = 0;
        uint256 incentiveId = 0;
        uint8 incentiveQuantity = 1;
        address claimant = address(0);
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";
        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, testSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(testSigner, signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));
        // First validation should pass
        assertTrue(validator.validate(boostId, incentiveId, claimant, claimData));

        // Second (replayed) validation should revert
        vm.expectRevert(abi.encodeWithSelector(BoostError.IncentiveClaimed.selector, incentiveId));
        validator.validate(boostId, incentiveId, claimant, claimData);
    }

    function testValidate_SmartContractSigner() public {
        uint256 boostId = 5;
        uint256 incentiveId = 1;
        uint8 incentiveQuantity = 2;
        address claimant = makeAddr("claimant");
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";
        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, testSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(address(smartSignerMock), signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));
        assertTrue(validator.validate(boostId, incentiveId, claimant, claimData));
    }

    function testValidate_SmartContractSigner_WrongSigner() public {
        uint256 boostId = 5;
        uint256 incentiveId = 1;
        uint8 incentiveQuantity = 2;
        address claimant = makeAddr("claimant");
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";
        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, fakeSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(address(smartSignerMock), signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));
        assertFalse(validator.validate(boostId, incentiveId, claimant, claimData));
    }

    function testValidate_SmartContractSigner_Malicious() public {
        uint256 boostId = 5;
        uint256 incentiveId = 1;
        uint8 incentiveQuantity = 2;
        address claimant = makeAddr("claimant");
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";
        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, fakeSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(address(maliciousSignerMock), signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(boostId, incentiveId, claimant, claimData);
    }

    function testValidate_FuzzValidInputs(
        uint256 boostId,
        uint256 incentiveId,
        uint256 pk,
        uint8 incentiveQuantity,
        address claimant,
        bytes memory incentiveData
    ) public {
        incentiveQuantity = uint8(bound(incentiveQuantity, 1, 7));
        incentiveId = bound(incentiveId, 0, incentiveQuantity - 1);
        pk = bound(pk, 1, _MAX_SECP256K_CURVE_VALUE);

        bool[] memory signers_authorized = new bool[](1);
        signers_authorized[0] = true;
        address[] memory signers = new address[](1);
        signers[0] = vm.addr(pk);

        validator.setAuthorized(signers, signers_authorized);

        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, pk);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(signers[0], signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));

        validator.validate(boostId, incentiveId, claimant, claimData);
    }

    function testValidate_FuzzMaliciousSigner(
        uint256 boostId,
        uint256 incentiveId,
        uint8 incentiveQuantity,
        address claimant,
        bytes memory incentiveData
    ) public {
        incentiveQuantity = uint8(bound(incentiveQuantity, 1, 7));
        incentiveId = bound(incentiveId, 0, incentiveQuantity - 1);

        bytes32 msgHash = validator.hashSignerData(boostId, incentiveQuantity, claimant, incentiveData);
        bytes memory signature = _signHash(msgHash, fakeSignerKey);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(testSigner, signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));
        assertFalse(validator.validate(boostId, incentiveId, claimant, claimData));
    }

    function testValidate_FuzzMaliciousSignature(uint8 v, bytes32 r, bytes32 s) public {
        v = uint8(bound(v, 27, 28));
        uint256 boostId = 5;
        uint256 incentiveId = 1;
        uint8 incentiveQuantity = 2;
        address claimant = makeAddr("claimant");
        bytes memory incentiveData = hex"def456232173821931823712381232131391321934";

        bytes memory signature = _packSignature(v, r, s);

        ASignerValidator.SignerValidatorInputParams memory validatorData =
            ASignerValidator.SignerValidatorInputParams(testSigner, signature, incentiveQuantity);
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(abi.encode(validatorData), incentiveData));

        assertFalse(validator.validate(boostId, incentiveId, claimant, claimData));
    }

    ///////////////////////////////////
    // SignerValidator.setAuthorized //
    ///////////////////////////////////

    function testSetAuthorized() public {
        address[] memory signers = new address[](1);
        signers[0] = fakeSigner;

        bool[] memory authorized = new bool[](1);
        authorized[0] = true;

        validator.setAuthorized(signers, authorized);

        assertTrue(validator.signers(fakeSigner));
    }

    /////////////////////////////////////////
    // VestingBudget.getComponentInterface //
    /////////////////////////////////////////

    function testGetComponentInterface() public view {
        // Ensure the contract supports the Budget interface
        console.logBytes4(validator.getComponentInterface());
    }

    ///////////////////////////////////////
    // SignerValidator.supportsInterface //
    ///////////////////////////////////////

    function testSupportsInterface() public view {
        assertTrue(validator.supportsInterface(type(Cloneable).interfaceId));
        assertTrue(validator.supportsInterface(type(AValidator).interfaceId));
    }

    function testSupportsInterface_NotSupported() public view {
        assertFalse(validator.supportsInterface(type(Test).interfaceId));
    }

    /////////////////////
    // Test Helpers    //
    /////////////////////

    function _signHash(bytes32 digest, uint256 privateKey) internal pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return _packSignature(v, r, s);
    }

    function _packSignature(uint8 v, bytes32 r, bytes32 s) internal pure returns (bytes memory) {
        return abi.encodePacked(r, s, v);
    }
}

///////////////////////////////////////
//      IncentiveBits Library        //
///////////////////////////////////////

contract IncentiveBitsTest is Test {
    using IncentiveBits for IncentiveBits.IncentiveMap;

    IncentiveBits.IncentiveMap _used;

    bytes32 private fakeHash = hex"123abc";

    function testIncentiveBitsWorks() public {
        for (uint8 x = 0; x < 8; x++) {
            _used.setOrThrow(fakeHash, x);
        }
        uint8 map = _used.map[fakeHash];
        assertEq(type(uint8).max, map);
    }

    function testIncentiveBitsBitTooLarge(uint8 badIndex) public {
        vm.assume(badIndex > 7);
        vm.expectRevert(abi.encodeWithSelector(BoostError.IncentiveToBig.selector, badIndex));
        _used.setOrThrow(fakeHash, badIndex);
    }

    function testIncentiveRevertsIfToggledAgain() public {
        _used.setOrThrow(fakeHash, 7);
        vm.expectRevert(abi.encodeWithSelector(BoostError.IncentiveClaimed.selector, 7));
        _used.setOrThrow(fakeHash, 7);
    }
}
