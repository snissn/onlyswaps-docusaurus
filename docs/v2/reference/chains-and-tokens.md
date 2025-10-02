---
sidebar_position: 2
---

# Supported Chains and Tokens

This document lists the currently supported chains and tokens on the ONLYSwaps protocol and outlines the administrative process for adding new support.

## Supported Chains

The following EVM chains are currently supported by the ONLYSwaps protocol and integrated into the `ONLYSwaps-ui` configuration (`chainConfigs`).

| Chain Name | Chain ID | Type | Router Address | RUSD (Test Token) Address |
| :--- | :--- | :--- | :--- | :--- |
| Avalanche | 43114 | Mainnet | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |
| Base | 8453 | Mainnet | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |
| Avalanche Fuji | 43113 | Testnet | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |
| Base Sepolia | 84532 | Testnet | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |

*Developers should always reference the `chainConfigs` object exported by `ONLYSwaps-ui` for the most up-to-date information. Do not hard-code these addresses.*

## Supported Tokens

Currently, the protocol primarily focuses on like-for-like swaps. The primary token used for integration testing and demonstration is **RUSD**, an 18-decimal ERC20 faucet token.

## Adding Support for New Chains and Tokens

Adding support for new chains and tokens is an administrative function restricted to the `ADMIN_ROLE` on the Router contract. The Router enforces checks to ensure swaps only occur between permitted chains and correctly mapped tokens.

### Process Overview

1.  **Permit Destination Chain:** On the source chain's Router, the admin must whitelist the new destination chain ID.
2.  **Map Tokens:** The admin must establish a mapping between the source token address and the destination token address for that specific destination chain ID.

### Administrative Functions (Solidity)

These functions are available on the `Router.sol` contract and require the `ADMIN_ROLE`.

#### `permitDestinationChainId(uint256 chainId)`

Whitelists a destination chain ID, enabling swaps to that chain.

```solidity
function permitDestinationChainId(uint256 chainId) external;
````

#### `setTokenMapping(uint256 dstChainId, address dstToken, address srcToken)`

Creates a mapping between a source token and a destination token for a specific destination chain.

  * Reverts if `dstChainId` is not permitted.
  * Reverts with `TokenMappingAlreadyExists` if the mapping is already set.

<!-- end list -->

```solidity
function setTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
```

#### `blockDestinationChainId(uint256 chainId)` and `removeTokenMapping(...)`

These functions are used to remove support for chains or tokens, respectively.


