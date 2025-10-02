---
sidebar_position: 1
title: "ONLYSwaps Overview"
description: "Learn about ONLYSwaps cross-chain token transfer protocol, its architecture, and key features for developers and end users"
keywords: ["cross-chain", "DeFi", "token transfer", "EVM", "blockchain", "ONLYSwaps"]
date: "2024-01-15"
---

# ONLYSwaps Overview

## What is ONLYSwaps?

ONLYSwaps is a cross-chain token transfer protocol designed to facilitate the seamless movement of ERC-20 tokens across various EVM-compatible blockchains. It is built utilizing the underlying infrastructure of the dcipher network, especially the BLS threshold signature scheme.

ONLYSwaps distinguishes itself from traditional cross-chain protocols through its innovative use of BLS Threshold Signatures and decentralized verification. Unlike pool-based models that require pre-existing liquidity pools or oracle + relayer models that depend on external data sources and trusted intermediaries, ONLYSwaps leverages the dcipher network's threshold signature scheme to create a trustless, efficient, and secure cross-chain transfer system. This approach eliminates single points of failure, reduces reliance on external oracles, and enables dynamic fee structures while maintaining cryptographic security guarantees.

The protocol operates on an intent-based model:
1.  **Swap Request:** Users lock their funds on a source chain and publish a "Swap Request"—an order book entry signaling their intent to move funds to a destination chain and the fee they are willing to pay.
2.  **Swap Fulfillment:** Liquidity providers, known as **Solvers**, compete to fulfill this request on the destination chain.
3.  **Swap Verification:** The decentralized **dcipher committee** verifies the fulfillment using threshold signatures.
4.  **Reimbursement:** Once verified, the solver is reimbursed on the source chain with the user's locked funds plus the fee.

### Protocol Actors

The ONLYSwaps protocol involves three primary actors, each with distinct roles and responsibilities in the cross-chain token transfer process.

#### User
The end user who initiates cross-chain token transfers by locking funds on a source chain and specifying their desired destination chain and fee. Users can interact with the protocol through multiple interfaces:

- **Web Interface**: Via the ONLYportal web application
- **API Integration**: Using the official JavaScript SDK (`ONLYSwaps-js`)
- **Smart Contract**: Direct contract calls or integration from other contracts

#### Solver
Liquidity providers who fulfill user swap requests by providing the required tokens on the destination chain. Solvers compete in a market-driven environment to earn fees by:

- Monitoring pending swap requests across supported chains
- Providing liquidity for token transfers
- Earning fees based on the user-specified amount

#### dcipher Committee Member
Trusted validators who secure the protocol through threshold signature verification within the dcipher network. Committee members:

- **Verify Transactions**: Validate solver fulfillments and user actions
- **Maintain Security**: Use BLS threshold signatures (BN254 curve) for cryptographic security
- **Distributed Trust**: Operate under the assumption that fewer than 50% of members are malicious

Committee membership requires completing a distributed key generation protocol and maintaining active participation in the verification process.

## Key Features

Unlike traditional pool-based models or oracle + relayer approaches, ONLYSwaps uses BLS Threshold Signatures for trustless, efficient cross-chain transfers without external dependencies or pre-existing liquidity requirements.

### Core Protocol Features

- **EVM Compatibility:** Supports a wide range of EVM blockchains (e.g., Avalanche, Base, and their testnets) with seamless cross-chain token transfers.
- **Intent-Based Architecture:** Users specify their desired outcome and fee, fostering a competitive market of solvers for efficient fulfillment without requiring pre-existing liquidity pools.
- **Threshold Security:** Swaps and protocol upgrades are verified by the dcipher committee using BLS threshold signatures (BN254 curve), ensuring robust security without a single trusted intermediary.
- **Dynamic Fee Management:** Users can update the fee offered for a pending swap if market conditions change or if they desire faster fulfillment, providing flexibility in volatile market conditions.

### Developer Experience

- **Comprehensive SDK:** TypeScript SDK (`ONLYSwaps-js`) with full TypeScript support, comprehensive error handling, and extensive documentation.
- **React UI Library:** Pre-built React components (`ONLYSwaps-ui`) for rapid frontend development with customizable themes and responsive design.
- **Smart Contract Integration:** Upgradeable Solidity contracts with clear interfaces for easy integration into existing DeFi protocols.
- **Multiple Integration Methods:** Support for web interfaces, API clients, direct contract calls, and programmatic access through various interfaces.

### Security & Trust

- **Decentralized Verification:** No single point of failure through distributed threshold signature verification by the dcipher committee.
- **Cryptographic Security:** BLS threshold signatures provide mathematical guarantees of security under the assumption that fewer than 50% of committee members are malicious.
- **Transparent Operations:** All protocol operations are verifiable on-chain, ensuring complete transparency and auditability.

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

