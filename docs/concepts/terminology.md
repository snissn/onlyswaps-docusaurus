# Core Terminology

This document defines the key concepts and terms used throughout the OnlySwaps protocol documentation.

## Swap Lifecycle

### Swap Request

An on-chain record created by a User signaling their intent to move funds. The request locks the user's funds and specifies the fee they are willing to pay. It is uniquely identified by a `requestId`.

### `requestId`

A unique `bytes32` identifier for a Swap Request, derived by hashing the parameters of the request. This ID is used to track the swap across both chains.

### Swap Fulfillment

The action taken by a Solver to complete the request by transferring the requested tokens to the recipient on the Destination Chain.

### Swap Verification

The process by which the dcipher committee attests that a Swap Fulfillment has successfully occurred. This involves generating and submitting a Threshold BLS signature to the Source Chain.

### Reimbursement

Once Swap Verification is successful, the Router contract on the Source Chain releases the user's locked funds, plus the fee, to the Solver.

## Chains

### Source Chain

The blockchain where the Swap Request originates and the user's funds are initially locked.

### Destination Chain

The blockchain where the user receives their funds, and where Solvers execute the Swap Fulfillment.

## Fees

### Solver Fee

The fee offered by the User to incentivize a Solver. This fee is paid in the source token upon successful verification. Users can update this fee if market conditions change.

### Verification Fee

A small protocol fee accrued by the dcipher committee members for performing the verification service, typically calculated in basis points (BPS) of the swap amount.

## Technical Concepts

### Router Contract

The primary smart contract deployed on each supported chain that manages the order book, escrow, and verification processes.

### UUPS (Universal Upgradeable Proxy Standard)

The proxy pattern used for the `Router` contract, allowing the contract logic to be upgraded while preserving its address and storage.

### ScheduledUpgradeable

An abstract contract that manages the UUPS upgrade process. It implements time-locks (minimum delays) and requires BLS signatures from the dcipher committee to authorize an upgrade.

[Guide: Contract Upgrades](../guides/contract-upgrades.md)

### BLS Signatures (BN254)

The cryptographic signature scheme used by the dcipher committee for verification and authorization. OnlySwaps uses the BN254 curve. BLS allows multiple signatures to be aggregated into a single threshold signature.

### Domain Separation

A security practice used when generating BLS signatures. By including an application-specific string (e.g., `"swap-v1"` vs `"upgrade-v1"`) in the message being signed, the protocol prevents signatures intended for one purpose from being replayed for another.

