// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {BoostCore} from "contracts/BoostCore.sol";
import {ExperimentalDelegation} from "contracts/intents/account/ExperimentalDelegation.sol";
import {SignatureVerification} from "contracts/intents/SignatureVerification.sol";
import {ECDSA} from "contracts/intents/utils/ECDSA.sol";

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

contract SetupIntents is ScriptUtils {
    using stdJson for string;

    BoostCore core;
    BoostRegistry registry;
    ManagedBudget public budget;
    ExperimentalDelegation public delegation;
    MockERC721 public erc721;
    uint256 p256privateKey;
    MockERC20 erc20 = MockERC20(0x238c8CD93ee9F8c7Edf395548eF60c0d2e46665E);
    // TODO: don't hardcode
    DestinationSettler destinationSettler =
        DestinationSettler(0x854D9E0C135b44e609d42B01Dca690010fEbe8De);
    // EIP-7212 compliant deploy from mainnet https://github.com/daimo-eth/p256-verifier
    bytes verifierCode =
        hex"60e06040523461001a57610012366100c7565b602081519101f35b600080fd5b6040810190811067ffffffffffffffff82111761003b57604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60e0810190811067ffffffffffffffff82111761003b57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761003b57604052565b60a08103610193578060201161001a57600060409180831161018f578060601161018f578060801161018f5760a01161018c57815182810181811067ffffffffffffffff82111761015f579061013291845260603581526080356020820152833560203584356101ab565b15610156575060ff6001915b5191166020820152602081526101538161001f565b90565b60ff909161013e565b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b80fd5b5080fd5b5060405160006020820152602081526101538161001f565b909283158015610393575b801561038b575b8015610361575b6103585780519060206101dc818301938451906103bd565b1561034d57604051948186019082825282604088015282606088015260808701527fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc63254f60a08701527fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551958660c082015260c081526102588161006a565b600080928192519060055afa903d15610345573d9167ffffffffffffffff831161031857604051926102b1857fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8401160185610086565b83523d828585013e5b156102eb57828280518101031261018c5750015190516102e693929185908181890994099151906104eb565b061490565b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526001600452fd5b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526041600452fd5b6060916102ba565b505050505050600090565b50505050600090565b507fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc6325518310156101c4565b5082156101bd565b507fffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc6325518410156101b6565b7fffffffff00000001000000000000000000000000ffffffffffffffffffffffff90818110801590610466575b8015610455575b61044d577f5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b8282818080957fffffffff00000001000000000000000000000000fffffffffffffffffffffffc0991818180090908089180091490565b505050600090565b50801580156103f1575082156103f1565b50818310156103ea565b7f800000000000000000000000000000000000000000000000000000000000000081146104bc577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b909192608052600091600160a05260a05193600092811580610718575b61034d57610516838261073d565b95909460ff60c05260005b600060c05112156106ef575b60a05181036106a1575050507f4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5957f6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c2969594939291965b600060c05112156105c7575050505050507fffffffff00000001000000000000000000000000ffffffffffffffffffffffff91506105c260a051610ca2565b900990565b956105d9929394959660a05191610a98565b9097929181928960a0528192819a6105f66080518960c051610722565b61060160c051610470565b60c0528061061b5750505050505b96959493929196610583565b969b5061067b96939550919350916001810361068857507f4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5937f6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c29693610952565b979297919060a05261060f565b6002036106985786938a93610952565b88938893610952565b600281036106ba57505050829581959493929196610583565b9197917ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd0161060f575095508495849661060f565b506106ff6080518560c051610722565b8061070b60c051610470565b60c052156105215761052d565b5060805115610508565b91906002600192841c831b16921c1681018091116104bc5790565b8015806107ab575b6107635761075f91610756916107b3565b92919091610c42565b9091565b50507f6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296907f4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f590565b508115610745565b919082158061094a575b1561080f57507f6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c29691507f4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5906001908190565b7fb01cbd1c01e58065711814b583f061e9d431cca994cea1313449bf97c840ae0a917fffffffff00000001000000000000000000000000ffffffffffffffffffffffff808481600186090894817f94e82e0c1ed3bdb90743191a9c5bbf0d88fc827fd214cc5f0b5ec6ba27673d6981600184090893841561091b575050808084800993840994818460010994828088600109957f6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c29609918784038481116104bc5784908180867fffffffff00000001000000000000000000000000fffffffffffffffffffffffd0991818580090808978885038581116104bc578580949281930994080908935b93929190565b9350935050921560001461093b5761093291610b6d565b91939092610915565b50506000806000926000610915565b5080156107bd565b91949592939095811580610a90575b15610991575050831580610989575b61097a5793929190565b50600093508392508291508190565b508215610970565b85919294951580610a88575b610a78577fffffffff00000001000000000000000000000000ffffffffffffffffffffffff968703918783116104bc5787838189850908938689038981116104bc5789908184840908928315610a5d575050818880959493928180848196099b8c9485099b8c920999099609918784038481116104bc5784908180867fffffffff00000001000000000000000000000000fffffffffffffffffffffffd0991818580090808978885038581116104bc578580949281930994080908929190565b965096505050509093501560001461093b5761093291610b6d565b9550509150915091906001908190565b50851561099d565b508015610961565b939092821580610b65575b61097a577fffffffff00000001000000000000000000000000ffffffffffffffffffffffff908185600209948280878009809709948380888a0998818080808680097fffffffff00000001000000000000000000000000fffffffffffffffffffffffc099280096003090884808a7fffffffff00000001000000000000000000000000fffffffffffffffffffffffd09818380090898898603918683116104bc57888703908782116104bc578780969481809681950994089009089609930990565b508015610aa3565b919091801580610c3a575b610c2d577fffffffff00000001000000000000000000000000ffffffffffffffffffffffff90818460020991808084800980940991817fffffffff00000001000000000000000000000000fffffffffffffffffffffffc81808088860994800960030908958280837fffffffff00000001000000000000000000000000fffffffffffffffffffffffd09818980090896878403918483116104bc57858503928584116104bc5785809492819309940890090892565b5060009150819081908190565b508215610b78565b909392821580610c9a575b610c8d57610c5a90610ca2565b9182917fffffffff00000001000000000000000000000000ffffffffffffffffffffffff80809581940980099009930990565b5050509050600090600090565b508015610c4d565b604051906020918281019183835283604083015283606083015260808201527fffffffff00000001000000000000000000000000fffffffffffffffffffffffd60a08201527fffffffff00000001000000000000000000000000ffffffffffffffffffffffff60c082015260c08152610d1a8161006a565b600080928192519060055afa903d15610d93573d9167ffffffffffffffff83116103185760405192610d73857fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8401160185610086565b83523d828585013e5b156102eb57828280518101031261018c5750015190565b606091610d7c56fea2646970667358221220fa55558b04ced380e93d0a46be01bb895ff30f015c50c516e898c341cd0a230264736f6c63430008150033";

    string constant deployJsonKey = "deployJsonKey";
    string deployJson;
    VmSafe.Wallet bob =
        vm.createWallet(
            0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
        );
    VmSafe.Wallet alice =
        vm.createWallet(
            0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
        );

    VmSafe.Wallet deployer;

    function setUp() public {
        string memory mnemonic = vm.envString("MNEMONIC");
        deployer = vm.createWallet(vm.deriveKey(mnemonic,0));
        vm.etch(address(0x14), verifierCode);
        //P256KeyGenerator generator = new P256KeyGenerator();
        //p256privateKey = generator.generatePrivateKey();
        p256privateKey = 100366595829038452957523597440756290436854445761208339940577349703440345778405;
        console.log("pk: ", p256privateKey);
        registry = _getRegistry();
        core = _getBoostCore();
    }

    /*
        call sequence:
        0. export MNEMONIC='test test test test test test test test test test test junk'
        1. pn deploy:core:local
        2. pn deploy:modules:local
        3. `createIntentionalBoost()` forge script script/solidity/SetupIntents.s.sol:SetupIntents -f http://127.0.0.1:8545 --mnemonics $MNEMONIC --sig "createIntentionalBoost()" --broadcast
        4. `createDelegationWallet()` forge script script/solidity/SetupIntents.s.sol:SetupIntents -f http://127.0.0.1:8545 --mnemonics $MNEMONIC --sig "createDelegationWallet()" --skip-simulation --broadcast
        5. `fillIntentionalBoost()` forge script script/solidity/SetupIntents.s.sol:SetupIntents -f http://127.0.0.1:8545 --mnemonics $MNEMONIC --sig "fillIntentionalBoost()" -vvvvv

    */

    function createIntentionalBoost() public {
        vm.broadcast();
        erc721 = new MockERC721();
        vm.broadcast();
        erc20.mint(
            deployer.addr,
            1000 ether
        );
        vm.broadcast();
        erc20.approve(address(destinationSettler), 1000 ether);
        budget = _given_that_I_have_a_budget();

        _when_I_allocate_assets_to_my_budget(budget);
        BoostLib.Boost memory boost = _when_I_create_a_new_boost_with_my_budget(
            budget
        );
    }

    function createDelegationWallet() public {
        VmSafe.Wallet memory bob = vm.createWallet(
            0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97
        );
        VmSafe.Wallet memory alice = vm.createWallet(
            0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6
        );
        ExperimentalDelegation aliceAbstracted = ExperimentalDelegation(
            payable(address(alice.addr))
        );
        // restart if alice already has a 7702 contract
        if (vm.load(alice.addr, bytes32(uint(2))) > 0)
            revert("restart anvil to clear code");
        vm.broadcast(alice.privateKey);
        delegation = new ExperimentalDelegation(address(destinationSettler));
        (uint256 x, uint256 y) = vm.publicKeyP256(p256privateKey);
        SignatureVerification.Key[]
            memory keys = new SignatureVerification.Key[](1);
        keys[0] = SignatureVerification.Key(
            0,
            SignatureVerification.KeyType.P256,
            ECDSA.PublicKey(x, y)
        );

        bytes32 digest = keccak256(abi.encode(1, "shiny new wallet", keys));
        console.log("digest");
        console.logBytes32(digest);
        console.log("alice addr: ", alice.addr);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            alice.privateKey,
            keccak256(abi.encode(0, "shiny new wallet", keys))
        );

        vm.signAndAttachDelegation(address(delegation), alice.privateKey);
        vm.broadcast(bob.privateKey);
        aliceAbstracted.initialize(
            "shiny new wallet",
            keys,
            ECDSA.Signature(uint256(r), uint256(s), v)
        );

        aliceAbstracted.getKeys();
        SignatureVerification.Key[]
            memory nextKeys = new SignatureVerification.Key[](1);
        nextKeys[0] = SignatureVerification.Key(
            0,
            SignatureVerification.KeyType.P256,
            ECDSA.PublicKey(x, y)
        );

        bytes32 hash = keccak256(abi.encode(aliceAbstracted.nonce(), nextKeys));
        (r, s) = vm.signP256(p256privateKey, hash);

        SignatureVerification.WrappedSignature
            memory wrappedSignature = SignatureVerification.WrappedSignature(
                0,
                ECDSA.Signature(uint256(r), uint256(s), 0),
                false,
                "0xf00d"
            );

        console.log("r: ", uint(r));
        console.log("s: ", uint(s));
        console.logBytes32(hash);
        console.logBytes(abi.encode(hash, r, s, x, y));

        // prove that we can delegate arbitrary calls using P256 signatures
        vm.broadcast(bob.privateKey);
        aliceAbstracted.authorize(nextKeys, abi.encodePacked(r, s, bytes1(0)));
        delegation = aliceAbstracted;
    }

    function fillIntentionalBoost() public {
        // Validate scenario:
        // - latchValidation will be called inside fill.
        // - The user calls require a correct signature. We have a dummy signature and a single key.
        //   We'll rely on `ExperimentalDelegation` defaults. Let's set it up properly.

        // filler calls fill

        // Prepare user call
        // This is what the incentive is stripping amounts off of
        Asset memory userAsset = Asset({
            token: address(erc20),
            amount: 1 ether
        });
        Call[] memory userCalls;

        userCalls = new Call[](1);
        userCalls[0] = Call({
            target: address(erc20),
            callData: abi.encodeWithSelector(
                MockERC20.mint.selector,
                alice.addr,
                10 ether
            ),
            value: 0
        });
        CallByUser memory callsByUser;
        callsByUser = CallByUser({
            user: alice.addr,
            nonce: 3,
            asset: userAsset,
            chainId: uint64(block.chainid),
            signature: bytes("dummy_signature"), // We'll rely on no revert scenario for signature check
            calls: userCalls
        });

        bytes32 orderId = keccak256(abi.encode(callsByUser));
        console.log('orderId');
        console.logBytes32(orderId);
        console.log('callsByUser');
        console.logBytes(abi.encode(callsByUser));
        console.log('FillerData');
        console.logBytes(abi.encode(FillerData({boostId: 0, incentiveId: 0})));
        // Expect event
        vm.startBroadcast();
        destinationSettler.fill(
            orderId,
            abi.encode(callsByUser),
            abi.encode(FillerData({boostId: 0, incentiveId: 0}))
        );

        // Check that incentive was claimed
        // The user is specified as final recipient. The incentive was from `variableIncentive`.
        // `fill` calls `claimIncentiveFor(...)` directing incentive to `settler` then from settler to user.
        // Actually, in code: `claimIncentiveFor` final param is `callsByUser.user` - user gets the incentive.
        // Note: Need to shure up this accounting. I don't know what the flow of funds is right now but this value seems off.
    }

    function _getBoostCore() internal returns (BoostCore) {
        string memory path = string(
            abi.encodePacked(
                vm.projectRoot(),
                "/deploys/",
                vm.toString(block.chainid),
                ".json"
            )
        );
        deployJson = vm.readFile(path);
        deployJson = deployJsonKey.serialize(deployJson);
        if (!vm.keyExistsJson(deployJson, ".BoostCore")) {
            revert("No Boost Core deployed: run `pnpm deploy:core:local");
        }
        return BoostCore(deployJson.readAddress(".BoostCore"));
    }

    function _getRegistry() internal returns (BoostRegistry registry) {
        string memory path = string(
            abi.encodePacked(
                vm.projectRoot(),
                "/deploys/",
                vm.toString(block.chainid),
                ".json"
            )
        );
        deployJson = vm.readFile(path);
        deployJson = deployJsonKey.serialize(deployJson);
        if (!vm.keyExistsJson(deployJson, ".BoostRegistry")) {
            revert("No registry deployed: run `pnpm deploy:core:local");
        }
        return BoostRegistry(deployJson.readAddress(".BoostRegistry"));
    }

    function _given_that_I_have_a_budget()
        internal
        returns (ManagedBudget budget_)
    {
        // 1. Let's find the budget implementation we want to use (this should be handled by the UI)
        //   - In this case, we're using the registered ManagedBudget implementation
        //   - Budgets require an owner and a list of initially authorized addresses
        address[] memory authorized = new address[](2);
        authorized[0] = address(core);
        authorized[1] = address(this);

        uint256[] memory roles = new uint256[](2);
        roles[0] = 1 << 0;
        roles[1] = 1 << 0;

        address base = address(
            registry.getBaseImplementation(
                registry.getIdentifier(
                    ABoostRegistry.RegistryType.BUDGET,
                    "ManagedBudget"
                )
            )
        );
        vm.broadcast();
        budget_ = ManagedBudget(
            payable(
                address(
                    registry.deployClone(
                        ABoostRegistry.RegistryType.BUDGET,
                        base,
                        string(abi.encode("My Managed ABudget ", block.number)),
                        abi.encode(
                            ManagedBudget.InitPayload({
                                owner: deployer.addr,
                                authorized: authorized,
                                roles: roles
                            })
                        )
                    )
                )
            )
        );
    }

    function _when_I_allocate_assets_to_my_budget(ABudget budget_) internal {
        // Allocate ERC20
        vm.startBroadcast();
        erc20.approve(address(budget_), 600 ether);
        budget_.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(erc20),
                    target: deployer.addr,
                    data: abi.encode(
                        ABudget.FungiblePayload({amount: 600 ether})
                    )
                })
            )
        );

        // Allocate ETH
        budget_.allocate{value: 10.5 ether}(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ETH,
                    asset: address(0),
                    target: deployer.addr,
                    data: abi.encode(
                        ABudget.FungiblePayload({amount: 10.5 ether})
                    )
                })
            )
        );
        vm.stopBroadcast();
    }

    ///////////////////////
    // Incentive Setup
    ///////////////////////

    /// @notice When I create a new Boost with my budget
    /// @param budget_ The budget to use for the Boost
    /// @return The Boost that was created
    function _when_I_create_a_new_boost_with_my_budget(
        ABudget budget_
    ) internal returns (BoostLib.Boost memory) {
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
                    registry.getIdentifier(
                        ABoostRegistry.RegistryType.INCENTIVE,
                        "ERC20VariableIncentive_2"
                    )
                )
            ),
            // "... of '100 ERC20' with a max spend of 5 Ether, set core as manager"
            parameters: abi.encode(erc20, 0 ether, 500 ether, address(core))
        });

        address action = address(
            registry.getBaseImplementation(
                registry.getIdentifier(
                    ABoostRegistry.RegistryType.ACTION,
                    "ERC721MintAction"
                )
            )
        );

        address validator = address(
            registry.getBaseImplementation(
                registry.getIdentifier(
                    ABoostRegistry.RegistryType.VALIDATOR,
                    "IntentValidator"
                )
            )
        );

        address denyList = address(
            registry.getBaseImplementation(
                registry.getIdentifier(
                    ABoostRegistry.RegistryType.ALLOW_LIST,
                    "SimpleDenyList"
                )
            )
        );

        vm.startBroadcast();
        return
            core.createBoost(
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
                                instance: action,
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
                                instance: validator,
                                parameters: abi.encode(
                                    address(core),
                                    address(destinationSettler)
                                )
                            }),
                            BoostLib.Target({
                                // "I can specify a list of blocked addresses"
                                isBase: true,
                                instance: denyList,
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
}

contract P256KeyGenerator {
    // P256 curve order (n)
    uint256 private constant P256_N =
        0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551;

    function generatePrivateKey() public view returns (uint256) {
        // Generate random bytes using keccak256
        bytes32 randomBytes = keccak256(
            abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender,
                blockhash(block.number - 1)
            )
        );

        // Convert to uint256 and ensure it's within valid range (1 to n-1)
        uint256 privateKey = (uint256(randomBytes) % (P256_N - 1)) + 1;

        return privateKey;
    }
}
