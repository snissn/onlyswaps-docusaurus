# Protocol Overview

OnlySwaps facilitates the transfer of ERC-20 tokens across different EVM blockchains. It operates as an intent-based system where users express their desire to move funds, and specialized actors (Solvers) fulfill these intents in exchange for a fee. The entire process is secured by a decentralized verification network (dcipher).

## The Actors

The OnlySwaps ecosystem consists of three primary actors:

### 1. Users

Users are the individuals or contracts initiating a cross-chain transfer. They want to move funds from a Source Chain to a Destination Chain and are willing to pay a fee for the service.

Users interact with the protocol by locking their funds in the `Router` contract on the source chain and creating a [Swap Request](./terminology.md#swap-request).

### 2. Solvers

Solvers are liquidity providers (typically automated bots) that monitor the `Router` contracts across various chains. They compete to fulfill Swap Requests.

When a Solver sees a request with an acceptable fee, they fulfill the request by transferring the requested tokens to the user on the destination chain. After fulfillment, the Solver is reimbursed (plus the fee) on the source chain upon verification.

### 3. dcipher Committee Members

The dcipher committee is a decentralized group responsible for verifying the actions of the Solvers. They ensure that a swap was correctly fulfilled on the destination chain before authorizing the reimbursement on the source chain.

The committee operates under the assumption of an honest majority (fewer than 50% malicious members) and uses a Threshold BLS signature scheme to attest to the validity of a fulfillment.

## Core Components

### Router Contract (`Router.sol`)

The central component of the protocol, deployed on every supported chain. It serves as:

1.  **An Escrow:** Where users lock funds when initiating a swap.
2.  **An Order Book:** Managing the lifecycle of Swap Requests and Fulfillments.
3.  **A Verification Gateway:** Verifying dcipher committee signatures to authorize the reimbursement of Solvers.

The Router contract is implemented using the UUPS upgradeable proxy pattern.

[Read the Router.sol Reference](../reference/solidity/router.md)

### Scheme Contract (BLSBN254SignatureScheme)

This contract holds the cryptographic details necessary for verification, primarily the public key of the dcipher committee. The `Router` consults the `Scheme` contract to validate BLS signatures. The scheme itself is upgradeable by the committee, with built-in time delays for security.

### Fees API

A centralized service that monitors network conditions, gas prices, liquidity, and solver activity to suggest an optimal fee for users. This ensures a high likelihood of fast fulfillment at a competitive price.

### SDKs and UI

*   **`onlyswaps-js`:** A TypeScript SDK for programmatic interaction.
*   **`onlyswaps-ui`:** A React library with hooks and components for easy integration into dApps.
*   **ONLYportal:** A reference web UI implementation.

## Next Steps

To understand the end-to-end flow of a swap, proceed to the Architecture Deep Dive.

[Architecture Deep Dive](./architecture.md)

