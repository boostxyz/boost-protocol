pragma solidity ^0.8.0;

import {CallByUser} from "./Structs.sol";

/**
 * @notice Contains common functions used by Destination and Origin settler
 * to encode and decode an ERC7683 ResolvedCrossChainOrder.
 */
library ResolvedCrossChainOrderLib {
    // Returns a unique representation of the ERC7683 resolved cross chain order. The resolved cross chain order's
    // originData contains a CallByUser struct which contains a nonce, so the user can guarantee t
    // his order is unique by using the nonce+user combination.
    function getOrderId(CallByUser memory calls) internal pure returns (bytes32) {
        return keccak256(abi.encode(calls));
    }
}
