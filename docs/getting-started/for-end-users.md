---
sidebar_position: 1
title: "For End Users"
description: "Learn how to use ONLYSwaps via the ONLYportal web interface to move tokens across blockchain networks"
keywords: ["end users", "ONLYportal", "web interface", "token swap", "user guide"]
date: "2024-01-15"
---

# Getting Started for End Users

This guide explains how to use the ONLYSwaps protocol via the ONLYportal web interface to move tokens across different blockchain networks.

## Accessing the ONLYSwaps App (ONLYportal)

The primary interface for interacting with ONLYSwaps is the **ONLYportal**. This is a web UI provided by Randamu that simplifies the process of executing cross-chain swaps, tracking status, and managing fees.

*(Please consult the official ONLYSwaps website for the current URL of the ONLYportal.)*

## Wallet Setup and Connection

To use ONLYSwaps, you need a compatible EVM wallet (such as MetaMask, Rainbow, or Coinbase Wallet).

1.  **Install a Wallet:** If you don't have one, install a browser extension or mobile app for your preferred wallet.
2.  **Configure Networks:** Ensure your wallet is configured to connect to the networks supported by ONLYSwaps (e.g., Avalanche, Base, and their testnets).
3.  **Connect to ONLYportal:**
    *   Navigate to the ONLYportal website.
    *   Click the "Connect Wallet" button.
    *   Approve the connection request in your wallet interface.

## Swapping Tokens Across Chains

Once your wallet is connected, you can initiate a cross-chain swap.

1.  **Select Source Chain:** Choose the network where your tokens currently reside. Ensure your wallet is switched to this network.
2.  **Select Destination Chain:** Choose the network you want to move your tokens to.
3.  **Select Token:** Choose the token you wish to swap.
    *   *Note: Currently, ONLYSwaps primarily supports swapping like-for-like tokens (e.g., RUSD on Base to RUSD on Avalanche). Support for exotic pairs is planned for future releases.*
4.  **Enter Amount:** Specify the amount of the token you want to transfer.
5.  **Set Fee:** The ONLYportal integrates with the Fees API to suggest an optimal fee. This fee is paid to the Solver. A higher fee generally results in a faster transfer.
6.  **Approve Tokens:** If this is your first time swapping this token, you will need to approve the ONLYSwaps Router contract to spend your tokens. Your wallet will prompt you for this approval.
7.  **Execute Swap:** Click the "Swap" button and confirm the transaction in your wallet.

### Tracking the Swap

After initiating the swap, the ONLYportal will provide a unique `requestId` and a status tracker.

*   **Pending Fulfillment:** Waiting for a Solver to provide liquidity on the destination chain.
*   **Fulfilled:** A Solver has sent the tokens to your address on the destination chain.
*   **Verified/Executed:** The dcipher committee has verified the fulfillment, and the transaction is finalized.

### Updating the Fee

If your swap is taking longer than expected, the fee you offered might be too low. You can increase the fee associated with your pending `requestId` via the ONLYportal interface to incentivize Solvers.

## Fees and Limits

### Fees

The total cost of a swap involves two main components, paid in the token being swapped:

1.  **Solver Fee:** The primary fee set by the user (or suggested by the API) to compensate the Solver for providing liquidity. This fee is dynamic and market-driven.
2.  **Verification Fee:** A small percentage-based fee collected by the protocol to compensate the dcipher committee members for verifying the transaction.

[Read more about the fee structure in the Reference section.](../reference/fees.md)

### Limits

The `ONLYSwaps-ui` enforces certain limits on the amount that can be entered in the interface:

*   **Minimum Amount:** 0.01 tokens.
*   **Maximum Amount:** 1,000,000,000 tokens.
*   **Precision:** Amounts must have at most 2 decimal places for UI input validation, although the underlying contracts handle 18 decimals.

