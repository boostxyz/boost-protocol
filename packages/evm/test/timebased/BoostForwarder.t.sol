// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {ERC20} from "@solady/tokens/ERC20.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {BoostForwarder} from "contracts/timebased/BoostForwarder.sol";
import {
    BoostForwarderAdapters,
    IERC4626,
    IAaveV3Pool,
    IComet,
    IStakedToken,
    ICErc20
} from "contracts/timebased/BoostForwarderAdapters.sol";

/// @notice Minimal ERC-4626 mock that accepts deposits and mints 1:1 shares
contract MockERC4626 is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock Vault Shares";
    }

    function symbol() public pure override returns (string memory) {
        return "mVAULT";
    }

    function asset() external view returns (address) {
        return underlying;
    }

    function deposit(uint256 assets, address receiver) external returns (uint256 shares) {
        ERC20(underlying).transferFrom(msg.sender, address(this), assets);
        shares = assets; // 1:1 for simplicity
        _mint(receiver, shares);
    }
}

/// @notice Minimal Aave v3 pool mock that accepts supply calls and mints aTokens 1:1
contract MockAaveV3Pool {
    MockAToken public immutable aToken;

    constructor(address underlying_) {
        aToken = new MockAToken(underlying_);
    }

    function supply(address supplyAsset, uint256 amount, address onBehalfOf, uint16) external {
        ERC20(supplyAsset).transferFrom(msg.sender, address(aToken), amount);
        aToken.mint(onBehalfOf, amount);
    }
}

contract MockAToken is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock aToken";
    }

    function symbol() public pure override returns (string memory) {
        return "maToken";
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Minimal Compound v3 Comet mock that accepts supplyTo calls
contract MockComet {
    MockCometReceipt public immutable receipt;

    constructor(address underlying_) {
        receipt = new MockCometReceipt(underlying_);
    }

    function supplyTo(address dst, address supplyAsset, uint256 amount) external {
        ERC20(supplyAsset).transferFrom(msg.sender, address(receipt), amount);
        receipt.mint(dst, amount);
    }
}

contract MockCometReceipt is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock Comet Receipt";
    }

    function symbol() public pure override returns (string memory) {
        return "mCOMET";
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @notice Minimal Aave staked token mock that pulls tokens and mints staked tokens
contract MockStakedToken is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock Staked Token";
    }

    function symbol() public pure override returns (string memory) {
        return "mSTK";
    }

    function stake(address onBehalfOf, uint256 amount) external {
        ERC20(underlying).transferFrom(msg.sender, address(this), amount);
        _mint(onBehalfOf, amount);
    }
}

/// @notice Minimal Compound v2 cToken mock — mint() sends cTokens to msg.sender (the forwarder)
contract MockCErc20 is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock cToken";
    }

    function symbol() public pure override returns (string memory) {
        return "mcTOKEN";
    }

    function mint(uint256 mintAmount) external returns (uint256) {
        ERC20(underlying).transferFrom(msg.sender, address(this), mintAmount);
        _mint(msg.sender, mintAmount); // cTokens go to caller, not end user
        return 0; // 0 = success in Compound v2
    }
}

/// @notice cToken mock that always fails mint
contract MockCErc20Failing is ERC20 {
    address public immutable underlying;

    constructor(address underlying_) {
        underlying = underlying_;
    }

    function name() public pure override returns (string memory) {
        return "Mock cToken Failing";
    }

    function symbol() public pure override returns (string memory) {
        return "mcFAIL";
    }

    function mint(uint256) external pure returns (uint256) {
        return 1; // Non-zero = failure in Compound v2
    }
}

contract BoostForwarderTest is Test {
    BoostForwarder forwarder;
    MockERC20 token;
    MockERC4626 vault;
    MockAaveV3Pool aavePool;
    MockComet comet;
    MockStakedToken stakedToken;
    MockCErc20 cToken;

    address constant USER = address(0xCAFE);
    address constant ATTACKER = address(0xDEAD);

    function setUp() public {
        // Deploy mock token and protocols
        token = new MockERC20();
        vault = new MockERC4626(address(token));
        aavePool = new MockAaveV3Pool(address(token));
        comet = new MockComet(address(token));
        stakedToken = new MockStakedToken(address(token));
        cToken = new MockCErc20(address(token));

        // Deploy forwarder via UUPS proxy
        BoostForwarder impl = new BoostForwarder();
        address proxy = LibClone.deployERC1967(address(impl));
        forwarder = BoostForwarder(proxy);
        forwarder.initialize(address(this));

        // Fund user
        token.mint(USER, 100 ether);
        vm.prank(USER);
        token.approve(address(forwarder), type(uint256).max);
    }

    // --- ERC4626 ---

    function test_DepositERC4626_Success() public {
        uint256 amount = 10 ether;

        vm.expectEmit(true, true, true, true);
        emit BoostForwarderAdapters.Deposit(USER, address(vault), address(token), amount);

        vm.prank(USER);
        forwarder.depositERC4626(IERC4626(address(vault)), amount);

        // User received vault shares
        assertEq(vault.balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 90 ether);
    }

    function test_DepositERC4626_RevertInsufficientBalance() public {
        vm.prank(USER);
        vm.expectRevert(); // SafeTransferLib reverts on insufficient balance
        forwarder.depositERC4626(IERC4626(address(vault)), 200 ether);
    }

    function test_DepositERC4626_RevertNoApproval() public {
        address noApprovalUser = address(0xBEEF);
        token.mint(noApprovalUser, 10 ether);
        // User has tokens but hasn't approved forwarder

        vm.prank(noApprovalUser);
        vm.expectRevert(); // SafeTransferLib reverts on insufficient allowance
        forwarder.depositERC4626(IERC4626(address(vault)), 1 ether);
    }

    // --- Aave V3 ---

    function test_DepositAaveV3_Success() public {
        uint256 amount = 5 ether;

        vm.expectEmit(true, true, true, true);
        emit BoostForwarderAdapters.Deposit(USER, address(aavePool), address(token), amount);

        vm.prank(USER);
        forwarder.depositAaveV3(IAaveV3Pool(address(aavePool)), address(token), amount);

        // User received aTokens
        assertEq(aavePool.aToken().balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 95 ether);
    }

    // --- Compound V3 ---

    function test_DepositCompoundV3_Success() public {
        uint256 amount = 8 ether;

        vm.expectEmit(true, true, true, true);
        emit BoostForwarderAdapters.Deposit(USER, address(comet), address(token), amount);

        vm.prank(USER);
        forwarder.depositCompoundV3(IComet(address(comet)), address(token), amount);

        // User received receipt tokens
        assertEq(comet.receipt().balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 92 ether);
    }

    // --- Aave Staked Token ---

    function test_StakeAaveToken_Success() public {
        uint256 amount = 3 ether;

        vm.expectEmit(true, true, true, true);
        emit BoostForwarderAdapters.Deposit(USER, address(stakedToken), address(token), amount);

        vm.prank(USER);
        forwarder.stakeAaveToken(IStakedToken(address(stakedToken)), address(token), amount);

        // User received staked tokens
        assertEq(stakedToken.balanceOf(USER), amount);
        // Forwarder holds nothing
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 97 ether);
    }

    // --- Compound V2 ---

    function test_DepositCompoundV2_Success() public {
        uint256 amount = 6 ether;

        vm.expectEmit(true, true, true, true);
        emit BoostForwarderAdapters.Deposit(USER, address(cToken), address(token), amount);

        vm.prank(USER);
        forwarder.depositCompoundV2(ICErc20(address(cToken)), amount);

        // User received cTokens (1:1 in mock)
        assertEq(cToken.balanceOf(USER), amount);
        // Forwarder holds no cTokens or underlying
        assertEq(cToken.balanceOf(address(forwarder)), 0);
        assertEq(token.balanceOf(address(forwarder)), 0);
        // User's token balance decreased
        assertEq(token.balanceOf(USER), 94 ether);
    }

    function test_DepositCompoundV2_RevertMintFailed() public {
        MockCErc20Failing failingCToken = new MockCErc20Failing(address(token));

        vm.prank(USER);
        vm.expectRevert(abi.encodeWithSelector(BoostForwarderAdapters.MintFailed.selector, 1));
        forwarder.depositCompoundV2(ICErc20(address(failingCToken)), 1 ether);
    }

    // --- Upgrade ---

    function test_Upgrade_Success() public {
        BoostForwarder newImpl = new BoostForwarder();
        forwarder.upgradeToAndCall(address(newImpl), "");

        // Forwarder still works after upgrade — deposit succeeds
        vm.prank(USER);
        forwarder.depositERC4626(IERC4626(address(vault)), 1 ether);
    }

    function test_Upgrade_RevertNotOwner() public {
        BoostForwarder newImpl = new BoostForwarder();

        vm.prank(ATTACKER);
        vm.expectRevert(abi.encodeWithSignature("Unauthorized()"));
        forwarder.upgradeToAndCall(address(newImpl), "");
    }

    // --- Initialization ---

    function test_Initialize_CannotReinitialize() public {
        vm.expectRevert(); // Initializable reverts on re-init
        forwarder.initialize(address(this));
    }
}
