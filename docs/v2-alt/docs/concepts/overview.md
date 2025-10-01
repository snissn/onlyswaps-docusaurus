# Protocol Overview

OnlySwaps is a cross‑chain token transfer protocol that combines an on‑chain **Router** (orderbook), **solver** liquidity, and **dcipher committee** verification. Users submit a **Swap Request** on the source chain; a solver sends funds to the user on the destination chain; the dcipher committee verifies fulfillment and authorizes reimbursement of the solver plus fees on the source chain.

## Actors

- **User** — initiates a swap to move tokens from chain A to chain B, paying a fee. Can use UI, JS client, or call contracts directly.
- **Solver** — provides liquidity across chains; fulfills requests and earns fees.
- **dcipher committee** — a threshold signer set (fewer than 50% malicious) that verifies completion and signs an aggregated signature uploaded on‑chain to settle with the solver.

## Components

- **Router Contract** — per‑chain orderbook: locks user funds, records solver fulfillments, accepts committee signatures, and reimburses solvers + fee.
- **Scheme / Signature Scheme** — holds committee public key and verification parameters; updateable with safeguards (timeouts & cancel).
- **Fees API** — central service suggesting a fee based on gas/liquidity/fulfillment stats.
- **ONLYportal** — reference web UI for swap, fee updates, and tracking.
- **onlyswaps‑js** — TypeScript client for fees, swaps, updates, and monitoring.
- **Solver & Verifier binaries** — off‑chain processes for fulfillment and verification.

## Supported Transfers (current)
Like‑for‑like ERC‑20 between supported EVM chains (e.g., RUSD on Base → RUSD on Avalanche). Roadmap includes more flexible assets/pairs.
