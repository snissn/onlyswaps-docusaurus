---
sidebar_position: 2
---

# Architecture

This section walks through the on‑chain/off‑chain flow and the core components: Router, BLS signature scheme, dcipher committee, solvers, and fees.

## Cross‑chain sequence

```mermaid
sequenceDiagram
  participant User
  participant ONLYportal
  participant ONLYSwaps-js
  participant FeesAPI
  participant Router as Router(Source Chain)
  participant Scheme as Scheme(Source Chain)
  participant Solver
  participant Verifier as Verifier(dcipher committee)
  participant DestinationChain

  %% Step 0: Fee discovery
  User->>ONLYportal: Connect wallet & enter params
  ONLYportal->>FeesAPI: Request suggested fee
  FeesAPI-->>ONLYportal: Suggested fee
  ONLYportal->>ONLYSwaps-js: Forward fee & params
  ONLYSwaps-js-->>User: Display suggested fee

  %% Step 1: Create Swap Request
  User->>ONLYSwaps-js: Submit swap (amount, dstChain, minFee)
  ONLYSwaps-js->>Router: Lock tokens & create SwapRequest
  Router-->>Solver: Emit SwapRequest event
  Router-->>Verifier: Emit SwapRequest event

  %% Step 2: Solver Fulfilment
  Solver->>Router: Post fulfilment intent
  Solver->>DestinationChain: Send tokens to user's address
  DestinationChain-->>Verifier: Transfer/log visible

  %% Step 3: Committee Verification
  Verifier->>Verifier: Threshold-sign Swap Verification off-chain
  Verifier->>Router: Submit aggregated signature
  Router->>Scheme: Verify signature with committee pubkey
  Router->>Solver: Reimburse locked funds + fee
  Router->>Router: Mark SwapRequest complete
```

The diagram reflects the protocol lifecycle: user request, solver fulfillment on destination, then committee verification and solver reimbursement on the source chain. 

## Components

### Router (source chain)

* Order book & escrow: holds user funds when a request is created; emits `SwapRequested`. 
* Admin surface: allow‑list destination chain IDs and manage token mappings. (`permitDestinationChainId`, `setTokenMapping`, `block…`, `remove…`). 
* Verification fee: protocol BPS‑based fee charged on swap amount (bounded by `MAX_FEE_BPS`). 
* Upgrades: UUPS behind `ScheduledUpgradeable`, gated by BLS signatures (domain‑separated).  

### Signature scheme and domain separation

ONLYSwaps uses a BN254 BLS signature scheme with application‑scoped domain separation (e.g., `"swap-v1"`, `"upgrade-v1"`). A dedicated contract wraps the library:

```solidity
contract BLSBN254SignatureScheme is BN254SignatureScheme {
  constructor(uint256[2] memory x, uint256[2] memory y, string memory application)
    BN254SignatureScheme(BLS.g2Marshal(BLS.PointG2({x: x, y: y})), application) {}
}
```

Deploy separate instances per domain, and inject addresses into `Router.initialize` so the Router verifies the correct domain for each action. 

### Cross‑chain routing primitives

* Message formation: derive BLS messages with `swapRequestParametersToBytes` and sign off‑chain; `rebalanceSolver` settles the solver after fulfillment. 
* Destination configuration: allow‑list the destination chain and set token mappings before enabling swaps. 

### Fees path

* User‑chosen solver fee (suggested by the Fees API) motivates solvers to fulfill quickly. 
* Verification fee compensates the dcipher committee for threshold verification on the source chain.  

### Upgrade and validator rotation

Upgrades and validator changes are scheduled and require BLS authorization over a canonical message (`contractUpgradeParamsToBytes` / `blsValidatorUpdateParamsToBytes`), with an enforced minimum delay (default two days).  

