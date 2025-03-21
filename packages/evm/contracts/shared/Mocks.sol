// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibString} from "@solady/utils/LibString.sol";
import {ERC20} from "@solady/tokens/ERC20.sol";
import {ERC721} from "@solady/tokens/ERC721.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IAuth} from "contracts/auth/IAuth.sol";
import {IProtocolFeeModule} from "contracts/shared/IProtocolFeeModule.sol";

/**
 * 🚨 WARNING: The mocks in this file are for testing purposes only. DO NOT use
 * ANY of this code in production, ever, or you will lose all of your money,
 * friends, and credibility. Also, your cat might run away for fear of being
 * associated with someone who makes such poor life choices.
 */

/// @title MockERC721
/// @notice A mock ERC721 token (FOR TESTING PURPOSES ONLY)
contract MockERC721 is ERC721 {
    uint256 public totalSupply;
    uint256 public mintPrice = 0.1 ether;

    function name() public pure override returns (string memory) {
        return "Mock ERC721";
    }

    function symbol() public pure override returns (string memory) {
        return "MOCK";
    }

    function mint(address to) public payable {
        require(msg.value >= mintPrice, "MockERC721: gimme more money!");
        // pre-increment so IDs start at 1
        _mint(to, ++totalSupply);
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        return string(abi.encodePacked("https://example.com/token/", LibString.toString(id)));
    }
}

/// @title MockERC20
/// @notice A mock ERC20 token (FOR TESTING PURPOSES ONLY)
contract MockERC20 is ERC20 {
    function name() public pure override returns (string memory) {
        return "Mock ERC20";
    }

    function symbol() public pure override returns (string memory) {
        return "MOCK";
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function mintPayable(address to, uint256 amount) public payable {
        require(msg.value >= amount / 100, "MockERC20: gimme more money!");
        _mint(to, amount);
    }
}

/// @title MockERC1155
/// @notice A mock ERC1155 token (FOR TESTING PURPOSES ONLY)
contract MockERC1155 is ERC1155 {
    constructor() ERC1155("https://example.com/token/{id}") {}

    function mint(address to, uint256 id, uint256 amount) public {
        _mint(to, id, amount, "");
    }

    function burn(address from, uint256 id, uint256 value) public {
        _burn(from, id, value);
    }
}

/// @title Mock Authorization Contract
/// @dev Mock implementation of the IAuth interface for testing purposes.
/// Allows setting authorized addresses via the constructor.
contract MockAuth is IAuth {
    mapping(address => bool) private _isAuthorized;

    /// @notice Initializes the contract with a list of authorized addresses.
    /// @param authorizedAddresses An array of addresses to be marked as authorized.
    /// @dev Addresses not included in the list will default to unauthorized.
    constructor(address[] memory authorizedAddresses) {
        for (uint256 i = 0; i < authorizedAddresses.length; i++) {
            _isAuthorized[authorizedAddresses[i]] = true;
        }
    }

    /// @notice Checks if an address is authorized.
    /// @param addr The address to check for authorization.
    /// @return bool Returns true if the address is authorized, false otherwise.
    /// @dev This function overrides the isAuthorized function in the IAuth interface.
    function isAuthorized(address addr) external view override returns (bool) {
        return _isAuthorized[addr];
    }
}

/// @title MockProtocolFeeModule
/// @notice A mock implementation of the IProtocolFeeModule interface (FOR TESTING PURPOSES ONLY)
contract MockProtocolFeeModule is IProtocolFeeModule {
    uint64 private protocolFee;
    address private protocolAsset;

    /// @notice Initializes the contract with a protocol fee.
    /// @param _protocolFee The protocol fee to set.
    constructor(uint64 _protocolFee) {
        protocolFee = _protocolFee;
    }

    /// @notice Returns the protocol fee.
    /// @return uint64 The protocol fee.
    function getProtocolFee(bytes calldata) external view override returns (uint64) {
        return protocolFee;
    }

    /// @notice Sets the protocol fee.
    /// @param _protocolFee The new protocol fee.
    function setProtocolFee(uint64 _protocolFee) external {
        protocolFee = _protocolFee;
    }

    /// @notice Returns the protocol asset to be used based on the boost configuration.
    /// @return address The protocol asset address.
    function getProtocolAsset(bytes calldata) external pure override returns (address) {
        return address(0);
    }

    /// @notice Sets the protocol asset to be used based on the boost configuration.
    /// @param _protocolAsset The new protocol asset address.
    function setProtocolAsset(address _protocolAsset) external {
        protocolAsset = _protocolAsset;
    }
}

/// @title MockProtocolFeeModule
/// @notice A mock implementation of the IProtocolFeeModule interface (FOR TESTING PURPOSES ONLY)
contract MockProtocolFeeModuleBadReturn {
    uint256 private protocolFee;

    /// @notice Initializes the contract with a protocol fee.
    /// @param _protocolFee The protocol fee to set.
    constructor(uint256 _protocolFee) {
        protocolFee = _protocolFee;
    }

    /// @notice Returns the protocol fee.
    /// @return uint64 The protocol fee.
    function getProtocolFee(bytes calldata) external view returns (uint256) {
        return protocolFee;
    }

    /// @notice Sets the protocol fee.
    /// @param _protocolFee The new protocol fee.
    function setProtocolFee(uint256 _protocolFee) external {
        protocolFee = _protocolFee;
    }

    /// @notice Returns the protocol asset to be used based on the boost configuration.
    /// @return address The protocol asset address.
    function getProtocolAsset(bytes calldata) external view returns (uint256) {
        return protocolFee;
    }
}

/// @title MockProtocolFeeModule
/// @notice A mock implementation of the IProtocolFeeModule interface (FOR TESTING PURPOSES ONLY)
contract MockProtocolFeeModuleNoReturn {
    uint256 private protocolFee;

    /// @notice Returns the protocol fee.
    function getProtocolFee(bytes calldata) external view {}

    function getProtocolAsset(bytes calldata) external view {}
}

// Target contract interface to probe
interface IVictim {
    function disburse(bytes calldata _data) external;
}

contract MaliciousFungibleToken is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;

    string private constant _name = "Malicious Token";
    string private constant _symbol = "MTKN";

    IVictim private _victim;
    bytes private _disburseData;

    constructor(uint256 _initSupply) {
        _totalSupply = _initSupply;
        _balances[msg.sender] = _totalSupply;
    }

    function setVictim(address victim_) external {
        _victim = IVictim(victim_);
    }

    function setDisburseData(bytes calldata data_) external {
        _disburseData = data_;
    }

    function name() public pure returns (string memory) {
        return _name;
    }

    function symbol() public pure returns (string memory) {
        return _symbol;
    }

    function decimals() public pure returns (uint8) {
        return 18;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);

        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);

        // Malicious reentrancy
        if (to == address(_victim) && _disburseData.length > 0) {
            // Try to reenter the calling contract
            IVictim(to).disburse(_disburseData);
        }

        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");

        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "Transfer amount exceeds balance");

        _balances[from] = fromBalance - amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "Approve from zero address");
        require(spender != address(0), "Approve to zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "Insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    // Helper function to check if address is a contract
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
