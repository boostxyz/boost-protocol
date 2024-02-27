// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {ECDSA} from "lib/solady/src/utils/ECDSA.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SignatureCheckerLib} from "lib/solady/src/utils/SignatureCheckerLib.sol";

import {MockERC1271Wallet} from "lib/solady/test/utils/mocks/MockERC1271Wallet.sol";
import {MockERC1271Malicious} from "lib/solady/test/utils/mocks/MockERC1271Malicious.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {Cloneable} from "src/Cloneable.sol";
import {Validator} from "src/validators/Validator.sol";
import {SignerValidator} from "src/validators/SignerValidator.sol";

contract SignerValidatorTest is Test {
    SignerValidator baseValidator = new SignerValidator();
    SignerValidator validator;

    uint256 testSignerKey = uint256(vm.envUint("TEST_SIGNER_PRIVATE_KEY"));
    address testSigner = vm.addr(testSignerKey);

    uint256 fakeSignerKey = uint256(0xdeadbeef);
    address fakeSigner = vm.addr(fakeSignerKey);

    MockERC1271Wallet smartSignerMock = new MockERC1271Wallet(testSigner);
    MockERC1271Malicious maliciousSignerMock = new MockERC1271Malicious();

    bytes32 MESSAGE_HASH = keccak256(abi.encodePacked("test"));
    bytes TRUSTED_EOA_SIGNATURE = _signHash(MESSAGE_HASH, testSignerKey);
    bytes UNTRUSTED_EOA_SIGNATURE = _signHash(MESSAGE_HASH, fakeSignerKey);

    bytes PACKED_EOA_SIGNATURE = LibZip.cdCompress(abi.encode(testSigner, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE));
    bytes PACKED_1271_SIGNATURE = LibZip.cdCompress(abi.encode(smartSignerMock, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE));

    bytes PACKED_MALICIOUS_SIGNATURE =
        LibZip.cdCompress(abi.encode(maliciousSignerMock, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE));
    bytes PACKED_WRONG_SIGNATURE = LibZip.cdCompress(abi.encode(testSigner, MESSAGE_HASH, UNTRUSTED_EOA_SIGNATURE));
    bytes PACKED_UNTRUSTED_SIGNATURE = LibZip.cdCompress(abi.encode(fakeSigner, MESSAGE_HASH, UNTRUSTED_EOA_SIGNATURE));

    function setUp() public {
        address[] memory signers = new address[](3);
        signers[0] = address(this);
        signers[1] = testSigner;
        signers[2] = address(smartSignerMock);

        bytes memory data = LibZip.cdCompress(abi.encode(signers));
        validator = SignerValidator(LibClone.clone(address(baseValidator)));
        validator.initialize(data);
    }

    ////////////////////////////////
    // SignerValidator.initialize //
    ////////////////////////////////

    function testInitialize() public {
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

    function test_InitializerDisabled() public {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot =
            vm.load(address(validator), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    /////////////////////////////
    // SignerValidator.signers //
    /////////////////////////////

    function testSigners() public {
        assertTrue(validator.signers(address(this)));
        assertTrue(validator.signers(testSigner));
        assertTrue(validator.signers(address(smartSignerMock)));
        assertFalse(validator.signers(fakeSigner));
    }

    //////////////////////////////
    // SignerValidator.validate //
    //////////////////////////////

    function testValidate() public {
        assertTrue(validator.validate(PACKED_EOA_SIGNATURE));

        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(PACKED_UNTRUSTED_SIGNATURE);
    }

    function testValidate_UnauthorizedSigner() public {
        bytes32 hash = keccak256(abi.encodePacked("test"));
        bytes memory signature = _signHash(hash, fakeSignerKey);
        bytes memory data = LibZip.cdCompress(abi.encode(fakeSigner, hash, signature));
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(data);
    }

    function testValidate_ReplayedSignature() public {
        // First validation should pass
        assertTrue(validator.validate(PACKED_EOA_SIGNATURE));

        // Second (replayed) validation should revert
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.Replayed.selector, testSigner, MESSAGE_HASH, TRUSTED_EOA_SIGNATURE)
        );
        validator.validate(PACKED_EOA_SIGNATURE);
    }

    function testValidate_SmartContractSigner() public {
        assertTrue(validator.validate(PACKED_1271_SIGNATURE));
    }

    function testValidate_SmartContractSigner_WrongSigner() public {
        assertFalse(validator.validate(PACKED_WRONG_SIGNATURE));
    }

    function testValidate_SmartContractSigner_Malicious() public {
        vm.expectRevert(BoostError.Unauthorized.selector);
        validator.validate(PACKED_MALICIOUS_SIGNATURE);
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

    ///////////////////////////////////////
    // SignerValidator.supportsInterface //
    ///////////////////////////////////////

    function testSupportsInterface() public {
        assertTrue(validator.supportsInterface(type(Cloneable).interfaceId));
        assertTrue(validator.supportsInterface(type(Validator).interfaceId));
    }

    function testSupportsInterface_NotSupported() public {
        assertFalse(validator.supportsInterface(type(Test).interfaceId));
    }

    /////////////////////
    // Test Helpers    //
    /////////////////////

    function _signHash(bytes32 msgHash, uint256 privateKey) internal pure returns (bytes memory) {
        bytes32 digest = SignatureCheckerLib.toEthSignedMessageHash(msgHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }
}
