// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

interface IToppable {
    event ToppedUp(address sender, uint256 amount);
    /**
     * @notice Tops up the contract with the specified amount. Should modify all local variables accordingly.
     * @param amount The amount to top up, in wei.
     */

    function topup(uint256 amount) external;
}
