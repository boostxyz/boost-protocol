// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC20} from "@solady/tokens/IERC20.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {FixedPointMathLib} from "@solady/utils/FixedPointMathLib.sol";
import {RBAC} from "contracts/shared/RBAC.sol";

/// @title Snapshot Share Token
/// @notice An ERC20 token that:
///         1) Implements Solady's IERC20 interface
///         2) Snapshots balances on every transfer
///         3) Allows distributing arbitrary ERC20s at snapshot blocks with no iteration over holders
///         Each holder calls claim(distributionId) individually to receive their share
contract bbbbb is IERC20, RBAC {
    using SafeTransferLib for address;
    using SafeTransferLib for IERC20;
    using FixedPointMathLib for uint256;

    event DistributionCreated(uint256 indexed distId, IERC20 indexed token, uint256 amount);
    event Claimed(uint256 indexed distId, address indexed user, uint256 amount);

    /// @dev ERC20 name
    string private _name;
    /// @dev ERC20 symbol
    string private _symbol;
    /// @dev ERC20 decimals
    uint8 private immutable _decimals;
    /// @dev Total token supply
    uint256 private _totalSupply;

    /// @dev Balances per ERC20 spec
    mapping(address => uint256) private _balances;
    /// @dev Allowances per ERC20 spec
    mapping(address => mapping(address => uint256)) private _allowances;

    /// @dev For each address, store arrays of (blockNumbers[], values[])
    struct Snapshots {
        uint256[] blockNumbers;
        uint256[] values;
    }

    /// @dev Each account's balance snapshots
    mapping(address => Snapshots) private _accountBalanceSnapshots;

    /// @dev For totalSupply snapshots
    uint256[] private _tsBlockNumbers;
    uint256[] private _tsValues;

    /// @dev Distribution data
    struct Distribution {
        IERC20 token; // The ERC20 being distributed
        uint256 blockNumber; // Snapshot block
        uint256 totalAmount; // Amount of tokens deposited
        bool active; // Whether distribution is active
    }

    /// @dev Array of all distributions
    Distribution[] public distributions;
    /// @dev distributionId -> (user -> bool) to track claims
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    /// @notice Initialize the token with RBAC roles
    /// @param name_ ERC20 name
    /// @param symbol_ ERC20 symbol
    /// @param decimals_ ERC20 decimals
    /// @param initSupply Initial supply minted to msg.sender
    /// @param authorized Initial authorized addresses
    /// @param roles Roles for each authorized address
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initSupply,
        address[] memory authorized,
        uint256[] memory roles
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;

        _initializeOwner(msg.sender);
        for (uint256 i = 0; i < authorized.length; i++) {
            _setRoles(authorized[i], roles[i]);
        }

        if (initSupply > 0) {
            _balances[msg.sender] = initSupply;
            _totalSupply = initSupply;
            _snapshotBalance(msg.sender, initSupply);
            _snapshotTotalSupply(initSupply);
            emit Transfer(address(0), msg.sender, initSupply);
        }
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return _decimals;
    }

    /// @inheritdoc IERC20
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    /// @inheritdoc IERC20
    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    /// @inheritdoc IERC20
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /// @inheritdoc IERC20
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /// @inheritdoc IERC20
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @inheritdoc IERC20
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        uint256 allowed = _allowances[from][msg.sender];
        if (allowed != type(uint256).max) {
            require(allowed >= amount, "Insufficient allowance");
            _allowances[from][msg.sender] = allowed - amount;
            emit Approval(from, msg.sender, allowed - amount);
        }
        _transfer(from, to, amount);
        return true;
    }

    /// @dev Internal transfer implementation
    function _transfer(address from, address to, uint256 amount) internal {
        require(to != address(0), "Zero address not allowed");
        require(_balances[from] >= amount, "Insufficient balance");

        // Sender
        _balances[from] -= amount;
        _snapshotBalance(from, _balances[from]);

        // Recipient
        _balances[to] += amount;
        _snapshotBalance(to, _balances[to]);

        emit Transfer(from, to, amount);
    }

    /// @dev Write or update the snapshot for `account`'s new balance in the current block
    function _snapshotBalance(address account, uint256 newBalance) internal {
        Snapshots storage snaps = _accountBalanceSnapshots[account];
        uint256 len = snaps.blockNumbers.length;

        if (len == 0 || snaps.blockNumbers[len - 1] < block.number) {
            snaps.blockNumbers.push(block.number);
            snaps.values.push(newBalance);
        } else {
            // same block => just update
            snaps.values[len - 1] = newBalance;
        }
    }

    /**
     * @dev Write or update totalSupply snapshot for the current block.
     *      Called in constructor or during mint/burn logic.
     */
    function _snapshotTotalSupply(uint256 newTotalSupply) internal {
        uint256 len = _tsBlockNumbers.length;
        if (len == 0 || _tsBlockNumbers[len - 1] < block.number) {
            _tsBlockNumbers.push(block.number);
            _tsValues.push(newTotalSupply);
        } else {
            _tsValues[len - 1] = newTotalSupply;
        }
    }

    /**
     * @notice Returns the balance of `account` at a given `blockNum` via binary search in snapshots.
     */
    function balanceOfAt(address account, uint256 blockNum) public view returns (uint256) {
        return _searchSnapshots(_accountBalanceSnapshots[account], blockNum);
    }

    /**
     * @notice Returns the totalSupply at a given `blockNum`.
     */
    function totalSupplyAt(uint256 blockNum) public view returns (uint256) {
        Snapshots memory s = Snapshots(_tsBlockNumbers, _tsValues);
        return _searchSnapshots(s, blockNum);
    }

    /// @dev Binary-search for the appropriate snapshot <= blockNum in Snapshots
    /// @param snaps The snapshots to search through
    /// @param blockNum The block number to search for
    /// @return The value at the found snapshot
    function _searchSnapshots(Snapshots memory snaps, uint256 blockNum) internal pure returns (uint256) {
        uint256 len = snaps.blockNumbers.length;
        if (len == 0) return 0;

        // If blockNum >= last snapshot's block => return last snapshot
        if (blockNum >= snaps.blockNumbers[len - 1]) {
            return snaps.values[len - 1];
        }

        // Binary search
        uint256 low = 0;
        uint256 high = len - 1;
        while (high > low) {
            // ceiling mid
            uint256 mid = (high + low + 1) >> 1;
            if (snaps.blockNumbers[mid] <= blockNum) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        return snaps.values[low];
    }

    /// @notice Mint new tokens to an address
    /// @param to Address to mint to
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external onlyOwnerOrRoles(MANAGER_ROLE) {
        require(to != address(0), "Zero address not allowed");

        _balances[to] += amount;
        _totalSupply += amount;

        _snapshotBalance(to, _balances[to]);
        _snapshotTotalSupply(_totalSupply);

        emit Transfer(address(0), to, amount);
    }

    /// @notice Burn tokens from an address
    /// @dev I would suggest removing burn logic from the contract
    /// @param from Address to burn from
    /// @param amount Amount to burn
    function burn(address from, uint256 amount) external onlyOwnerOrRoles(MANAGER_ROLE) {
        require(_balances[from] >= amount, "Insufficient balance");

        _balances[from] -= amount;
        _totalSupply -= amount;

        _snapshotBalance(from, _balances[from]);
        _snapshotTotalSupply(_totalSupply);

        emit Transfer(from, address(0), amount);
    }

    /// @notice Create a new distribution of tokens to snapshot holders
    /// @param token The ERC20 token to distribute
    /// @param amount Amount of tokens to distribute
    function distribute(IERC20 token, uint256 amount) external {
        require(amount > 0, "Nothing to distribute");
        require(_totalSupply > 0, "No supply, can't distribute");

        // Pull in the tokens
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Create a distribution referencing block.number
        distributions.push(Distribution({token: token, blockNumber: block.number, totalAmount: amount, active: true}));

        uint256 distId = distributions.length - 1;
        emit DistributionCreated(distId, token, amount);
    }

    /// @notice Claim tokens from a specific distribution
    /// @param distId The ID of the distribution to claim from
    function claim(uint256 distId) external {
        Distribution storage dist = distributions[distId];
        require(dist.active, "Distribution inactive");

        require(!hasClaimed[distId][msg.sender], "Already claimed");
        hasClaimed[distId][msg.sender] = true;

        // Calculate user's share of the distribution
        uint256 userBal = balanceOfAt(msg.sender, dist.blockNumber);
        if (userBal == 0) {
            emit Claimed(distId, msg.sender, 0);
            return;
        }

        uint256 tsAt = totalSupplyAt(dist.blockNumber);
        require(tsAt > 0, "No supply at that block?");

        // Calculate user's portion: (userBalance / totalSupply) * totalAmount
        uint256 userClaim = (dist.totalAmount * userBal) / tsAt;

        // Transfer tokens to user
        dist.token.safeTransfer(msg.sender, userClaim);

        emit Claimed(distId, msg.sender, userClaim);
    }

    /// @notice Create a distribution from any unaccounted tokens held by the contract
    /// @param token The ERC20 token to account for
    /// @return distId The ID of the created distribution
    function accountForTokens(IERC20 token) external returns (uint256 distId) {
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 distributedBalance = 0;

        // Sum up tokens in active distributions
        for (uint256 i = 0; i < distributions.length; i++) {
            Distribution storage dist = distributions[i];
            if (dist.active && dist.token == token) {
                distributedBalance += dist.totalAmount;
            }
        }

        // Calculate unaccounted balance
        uint256 unaccountedBalance = currentBalance - distributedBalance;
        require(unaccountedBalance > 0, "No unaccounted tokens");
        require(_totalSupply > 0, "No supply, can't distribute");

        // Create a distribution for the unaccounted tokens
        distributions.push(
            Distribution({token: token, blockNumber: block.number, totalAmount: unaccountedBalance, active: true})
        );

        distId = distributions.length - 1;
        emit DistributionCreated(distId, token, unaccountedBalance);
    }
}
