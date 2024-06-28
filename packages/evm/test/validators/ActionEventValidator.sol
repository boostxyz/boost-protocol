// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {ECDSA} from "@solady/utils/ECDSA.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {MockERC1271Wallet} from "lib/solady/test/utils/mocks/MockERC1271Wallet.sol";
import {MockERC1271Malicious} from "lib/solady/test/utils/mocks/MockERC1271Malicious.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {Validator} from "contracts/validators/Validator.sol";
import {SignerValidator} from "contracts/validators/SignerValidator.sol";
import {ActionEventValidator} from "contracts/validators/ActionEventValidator.sol";

contract ActionEventValidatorTest is Test {
    ActionEventValidator baseValidator = new ActionEventValidator();
    ActionEventValidator validator;

    uint256 testSignerKey = uint256(vm.envUint("TEST_SIGNER_PRIVATE_KEY"));
    address testSigner = vm.addr(testSignerKey);

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

        Criteria[4] memory criteria;
        for (uint i = 0; i < 4; i++) {
            criteria[i] = Criteria({
                filterType: FilterType.EQUAL,
                fieldType: PrimitiveType.BYTES,
                filterData: bytes("")
            });
        }

        ActionEvent memory actionEvent = ActionEvent({
            eventSignature: bytes4(keccak256("TestEvent")),
            actionType: 1,
            actionParameters: criteria
        });

        bytes memory data = abi.encode(signers, actionEvent);
        validator = ActionEventValidator(LibClone.clone(address(baseValidator)));
        validator.initialize(data);
    }

    ////////////////////////////////
    // ActionEventValidator.initialize //
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

        // The action event should be initialized correctly
        ActionEvent memory actionEvent = validator.getActionEvent();
        assertEq(actionEvent.eventSignature, bytes4(keccak256("TestEvent")));
        assertEq(actionEvent.actionType, 1);
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

}
