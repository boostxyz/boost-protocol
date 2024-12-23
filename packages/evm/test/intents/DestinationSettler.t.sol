// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";
import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {MockERC20, MockERC721} from "contracts/shared/Mocks.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry, ABoostRegistry} from "contracts/BoostRegistry.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

import {ASignerValidator, IBoostClaim as IValidatorBoostClaim} from "contracts/validators/ASignerValidator.sol";
import {SignerValidator} from "contracts/validators/SignerValidator.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

import {AAction} from "contracts/actions/AAction.sol";
import {AContractAction} from "contracts/actions/AContractAction.sol";
import {ERC721MintAction} from "contracts/actions/ERC721MintAction.sol";

import {AIncentive, IBoostClaim} from "contracts/incentives/AIncentive.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";

import {ILatchValidator} from "contracts/shared/ILatchValidator.sol";

import {SignatureVerification} from "contracts/intents/SignatureVerification.sol";
import {ExperimentalDelegation} from "contracts/intents/account/ExperimentalDelegation.sol";
import {ECDSA} from "contracts/intents/utils/ECDSA.sol";

import {CallByUser, Call, Asset, FillerData} from "contracts/intents/Structs.sol";
import {IntentValidator} from "contracts/validators/IntentValidator.sol";
import {DestinationSettler} from "contracts/intents/DestinationSettler.sol";

/**
 * @title DestinationSettlerBoostTest
 *
 * @dev Runs through as close as possible to a realistic scenario for the DestinationSettler
 *      Uses a variable incentive, and the intent validator
 */
contract DestinationSettlerBoostTest is Test {
    /////////////////////////////
    // State
    /////////////////////////////

    BoostRegistry public registry;
    BoostCore public core;

    DestinationSettler settler;

    address fee_recipient = address(1);
    address boost_core_owner = address(this);

    address validatorSigner;
    uint256 validatorSignerKey;

    uint256 incentiveLimitAmount = 500 ether;
    uint256 rewardAmount = 0; // We'll rely on variable claim amounts without the multiplier

    MockERC20 public erc20 = new MockERC20();
    MockERC721 public erc721 = new MockERC721();
    ManagedBudget public budget;
    ERC20VariableIncentive public variableIncentive;

    // We'll need addresses for the scenario
    address user = makeAddr("user");
    address filler = makeAddr("filler");
    address boostOwner = makeAddr("boostOwner");

    uint256 boostId;
    uint256 incentiveId = 0; // single incentive
    uint8 incentiveQuantity = 1; // We'll set 1 for simplicity

    // Calls
    Asset userAsset;
    bytes32 orderId;

    /////////////////////////////
    // Setup
    /////////////////////////////
    function setUp() public {
        // Deploy registry and core just like in the example
        registry = new BoostRegistry();
        core = new BoostCore(registry, fee_recipient, boost_core_owner);

        // Now we have a BoostCore at fixed address with correct code and storage.

        // Deploy settler now that core code is in place
        settler = new DestinationSettler(address(core));

        // // Setup ERC20 and budget
        erc20.mint(address(this), 1000 ether);
        erc20.approve(address(settler), 1000 ether);
        registry.register(ABoostRegistry.RegistryType.BUDGET, "ManagedBudget", address(new ManagedBudget()));
        budget = _given_that_I_have_a_budget();

        // Fund budget
        _when_I_allocate_assets_to_my_budget(budget);

        // Register action, incentive, validator, allowList
        registry.register(ABoostRegistry.RegistryType.ACTION, "ERC721MintAction", address(new ERC721MintAction()));
        registry.register(
            ABoostRegistry.RegistryType.INCENTIVE, "ERC20VariableIncentive", address(new ERC20VariableIncentive())
        );
        registry.register(ABoostRegistry.RegistryType.VALIDATOR, "SignerValidator", address(new SignerValidator()));
        registry.register(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleDenyList", address(new SimpleDenyList()));
        registry.register(ABoostRegistry.RegistryType.VALIDATOR, "IntentValidator", address(new IntentValidator()));

        // Create Boost
        BoostLib.Boost memory boost = _when_I_create_a_new_boost_with_my_budget(budget);

        // // Give filler tokens to fund user
        erc20.mint(filler, 100 ether);
        vm.prank(filler);
        erc20.approve(address(settler), 100 ether);
    }

    /////////////////////////////////
    // Tests
    /////////////////////////////////

    function testFill_Success() public {
        // Validate scenario:
        // - latchValidation will be called inside fill.
        // - The user calls require a correct signature. We have a dummy signature and a single key.
        //   We'll rely on `ExperimentalDelegation` defaults. Let's set it up properly.

        _setupUserAccount();

        // filler calls fill
        vm.prank(filler);

        // Prepare user call
        // This is what the incentive is stripping amounts off of
        userAsset = Asset({token: address(erc20), amount: 1 ether});
        Call[] memory userCalls;

        userCalls = new Call[](1);
        userCalls[0] = Call({
            target: address(erc20),
            callData: abi.encodeWithSelector(MockERC20.mint.selector, user, 10 ether),
            value: 0
        });
        CallByUser memory callsByUser;
        callsByUser = CallByUser({
            user: user,
            nonce: 0,
            asset: userAsset,
            chainId: uint64(block.chainid),
            signature: bytes("dummy_signature"), // We'll rely on no revert scenario for signature check
            calls: userCalls
        });

        orderId = keccak256(abi.encode(callsByUser));
        // Expect event
        vm.expectEmit(true, true, true, true);
        emit Executed(orderId);

        settler.fill(
            orderId, abi.encode(callsByUser), abi.encode(FillerData({boostId: boostId, incentiveId: incentiveId}))
        );

        // Check that incentive was claimed
        // The user is specified as final recipient. The incentive was from `variableIncentive`.
        // `fill` calls `claimIncentiveFor(...)` directing incentive to `settler` then from settler to user.
        // Actually, in code: `claimIncentiveFor` final param is `callsByUser.user` - user gets the incentive.
        // Note: Need to shure up this accounting. I don't know what the flow of funds is right now but this value seems off.
        // Also of not since the call we're triggering is a mint, the amount should be 10 greater than the reward.
        assertEq(erc20.balanceOf(user), 12 ether, "User should have received incentive tokens");
    }

    /////////////////////////////////////
    // Helpers
    /////////////////////////////////////

    function _setupUserAccount() internal {
        // We simulate a user account with keys and signature verification
        // We'll deploy an ExperimentalDelegation contract for the user.
        // The code `fill()` calls `xExecute(userCalls)`, which implies user is a contract.
        // Let's make `user` a contract by deploying a proxy or a simple test contract.
        // For simplicity, deploy a minimal ExperimentalDelegation at `user`.

        // We'll just assume `user` is a contract that supports getKeys, nonce, xExecute
        // The example sets them via mocking, but we cannot mock now.
        // Instead, deploy a minimal ExperimentalDelegation and configure it.

        ExperimentalDelegation userAccount = new ExperimentalDelegation(address(settler));
        erc20.approve(address(userAccount), 100 ether);
        // Transfer `user` address' balance to userAccount if needed
        // Actually, `user` is just an address. Let's reassign `user` to be address(userAccount).
        user = address(userAccount);

        string memory label_ = "MyLabel";

        SignatureVerification.Key[] memory keys_ = new SignatureVerification.Key[](1);
        keys_[0] = SignatureVerification.Key({
            expiry: 0,
            keyType: SignatureVerification.KeyType.WebAuthnP256,
            publicKey: ECDSA.PublicKey({
                x: 0x776a9fd8201f0d3e009f11a620ca9092440e1df71ef2d157d0a84bd8efedd6f4,
                y: 0x130f0c359d2efb2a3ebb4be1e275dc343745b233bd4557ff7ca2405fa639d9d3
            })
        });

        uint256 nonce = 0; // initial nonce
        bytes32 digest = keccak256(abi.encode(nonce, label_, keys_));
    }

    function _given_that_I_have_a_budget() internal returns (ManagedBudget budget_) {
        // 1. Let's find the budget implementation we want to use (this should be handled by the UI)
        //   - In this case, we're using the registered ManagedBudget implementation
        //   - Budgets require an owner and a list of initially authorized addresses
        address[] memory authorized = new address[](2);
        authorized[0] = address(core);
        authorized[1] = address(this);

        uint256[] memory roles = new uint256[](2);
        roles[0] = 1 << 0;
        roles[1] = 1 << 0;

        budget_ = ManagedBudget(
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

        assertTrue(budget_.isAuthorized(address(this)));
    }

    function _when_I_allocate_assets_to_my_budget(ABudget budget_) internal {
        // Allocate ERC20
        erc20.approve(address(budget_), 600 ether);
        budget_.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(erc20),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: 600 ether}))
                })
            )
        );

        // Allocate ETH
        budget_.allocate{value: 10.5 ether}(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ETH,
                    asset: address(0),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: 10.5 ether}))
                })
            )
        );
    }

    ///////////////////////
    // Incentive Setup
    ///////////////////////

    /// @notice When I create a new Boost with my budget
    /// @param budget_ The budget to use for the Boost
    /// @return The Boost that was created
    function _when_I_create_a_new_boost_with_my_budget(ABudget budget_) internal returns (BoostLib.Boost memory) {
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
                    registry.getIdentifier(ABoostRegistry.RegistryType.INCENTIVE, "ERC20VariableIncentive")
                )
            ),
            // "... of '100 ERC20' with a max spend of 5 Ether, set core as manager"
            parameters: abi.encode(erc20, 0 ether, 5 ether, address(core))
        });

        return core.createBoost(
            LibZip.cdCompress(
                abi.encode(
                    BoostLib.CreateBoostPayload(
                        // "... with my budget"
                        budget_,
                        // TODO: We'll want to lock down the action so it's validating the asset and calldata
                        BoostLib.Target({
                            // "I can specify the action of 'Mint an NFT'"
                            // "... and I can specify the address of my ERC721"
                            // "... and I can specify the selector of the mint function"
                            // "... and I can specify the mint price"
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
                                    registry.getIdentifier(ABoostRegistry.RegistryType.VALIDATOR, "IntentValidator")
                                )
                            ),
                            parameters: abi.encode(address(core), address(settler))
                        }),
                        BoostLib.Target({
                            // "I can specify a list of blocked addresses"
                            isBase: true,
                            instance: address(
                                registry.getBaseImplementation(
                                    registry.getIdentifier(ABoostRegistry.RegistryType.ALLOW_LIST, "SimpleDenyList")
                                )
                            ),
                            parameters: abi.encode(address(this), allowList)
                        }),
                        incentives, // "I can specify the variable incentive we setup earlier..."
                        0, // "I don't care about additional protocol fee testing in this context
                        5, // "I can specify a maximum number of participants" => 5
                        address(1) // "I can specify the owner of the Boost" => address(1)
                    )
                )
            )
        );
    }

    ///////////////////////
    // Payloads
    ///////////////////////
    event Executed(bytes32 indexed orderId);
}
