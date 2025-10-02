---
sidebar_position: 1
title: "ONLYSwaps Overview"
description: "Learn about ONLYSwaps cross-chain token transfer protocol, its architecture, and key features for developers and end users"
keywords: ["cross-chain", "DeFi", "token transfer", "EVM", "blockchain", "ONLYSwaps"]
date: "2024-01-15"
---

# ONLYSwaps Overview

## What is ONLYSwaps?

ONLYSwaps is a cross-chain token transfer protocol designed to facilitate the seamless movement of ERC-20 tokens across various EVM-compatible blockchains. It is built utilizing the underlying infrastructure of the dcipher network.

The protocol operates on an intent-based model:
1.  **Request:** Users lock their funds on a source chain and publish a "Swap Request"—an order book entry signaling their intent to move funds to a destination chain and the fee they are willing to pay.
2.  **Fulfillment:** Liquidity providers, known as **Solvers**, compete to fulfill this request on the destination chain.
3.  **Verification:** The decentralized **dcipher committee** verifies the fulfillment using threshold signatures.
4.  **Reimbursement:** Once verified, the solver is reimbursed on the source chain with the user's locked funds plus the fee.

## Key Features

*   **EVM Compatibility:** Supports a wide range of EVM blockchains (e.g., Avalanche, Base, and their testnets).
*   **Intent-Based Architecture:** Users specify their desired outcome and fee, fostering a competitive market of solvers for efficient fulfillment.
*   **Threshold Security:** Swaps and protocol upgrades are verified by the dcipher committee using BLS threshold signatures (BN254 curve), ensuring robust security without a single trusted intermediary.
*   **Dynamic Fees:** Users can update the fee offered for a pending swap if market conditions change or if they desire faster fulfillment.
*   **Developer-First Tooling:** A comprehensive suite including a TypeScript SDK (`ONLYSwaps-js`), a React UI library (`ONLYSwaps-ui`), and upgradeable Solidity contracts.
*   **Upgradeable Contracts:** The core Router contract uses the UUPS proxy pattern, allowing for secure, time-locked upgrades (default minimum 2 days) authorized by the dcipher committee.

## Who is ONLYSwaps For?

### For Developers

dApp developers, wallet providers, and DeFi platforms can integrate ONLYSwaps to offer native cross-chain functionality.

*   **Frontend Integration:** Use `ONLYSwaps-ui` and React hooks to quickly build intuitive cross-chain swap interfaces.
*   **Backend/Programmatic Access:** Use `ONLYSwaps-js` with `viem` to manage swaps, track status, and handle fees programmatically from backend services or scripts.
*   **Smart Contract Integration:** Developers can call the Router contract directly from other smart contracts.

### For End Users

Individuals looking to move assets between supported chains. Users can access the protocol via the **ONLYportal**, a web UI provided by Randamu, to execute swaps, track status, and manage fees.

### For Liquidity Providers (Solvers)

Individuals or organizations with available capital can earn fees by running the `ONLYSwaps-solver` binary. Solvers provide the necessary liquidity to fulfill user swap requests.

