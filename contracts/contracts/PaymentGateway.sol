// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentGateway
 * @notice Minimal payment gateway to accept native MATIC or allowlisted ERC20 tokens.
 *         Emits Payment events for off-chain indexing. Supports direct-forward mode.
 */
contract PaymentGateway is Ownable {
    struct TokenInfo {
        bool isAllowed;
        uint8 decimals; // informational only
    }

    mapping(address => TokenInfo) public allowedTokens; // token => info; address(0) means native MATIC

    event TokenAllowlistUpdated(address indexed token, bool isAllowed, uint8 decimals);
    event Payment(
        address indexed payer,
        address indexed receiver,
        address indexed token, // address(0) for MATIC
        uint256 amount,
        string slug, // off-chain receiver identifier
        string memo,
        uint256 timestamp
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setAllowedToken(address token, bool isAllowed, uint8 decimals_) external onlyOwner {
        allowedTokens[token] = TokenInfo({isAllowed: isAllowed, decimals: decimals_});
        emit TokenAllowlistUpdated(token, isAllowed, decimals_);
    }

    /// @notice Pay in native MATIC and forward to receiver immediately.
    function payNative(address receiver, string calldata slug, string calldata memo) external payable {
        require(msg.value > 0, "NO_VALUE");
        _forwardNative(receiver, msg.value);
        emit Payment(msg.sender, receiver, address(0), msg.value, slug, memo, block.timestamp);
    }

    /// @notice Pay with an ERC20 token that is allowlisted. Requires prior approval to this contract.
    function payERC20(address token, uint256 amount, address receiver, string calldata slug, string calldata memo) external {
        TokenInfo memory info = allowedTokens[token];
        require(info.isAllowed, "TOKEN_NOT_ALLOWED");
        require(amount > 0, "NO_AMOUNT");
        bool ok = IERC20(token).transferFrom(msg.sender, receiver, amount);
        require(ok, "TRANSFER_FAILED");
        emit Payment(msg.sender, receiver, token, amount, slug, memo, block.timestamp);
    }

    function _forwardNative(address to, uint256 amount) internal {
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "NATIVE_SEND_FAILED");
    }

    receive() external payable {
        revert("DIRECT_TRANSFER_BLOCKED");
    }
}


