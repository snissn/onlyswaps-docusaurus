# Protocol Overview

OnlySwaps is a cross‑chain token transfer protocol that combines an on‑chain **Router** (orderbook), **solver** liquidity, and **dcipher committee** verification. Users submit a **Swap Request** on the source chain; a solver sends funds to the user on the destination chain; the dcipher committee verifies fulfillment and authorizes reimbursement of the solver plus fees on the source chain. :contentReference[oaicite:15]{index=15}

## Actors

- **User** — initiates a swap to move tokens from chain A to chain B, paying a fee. Can use UI, JS client, or call contracts directly. :contentReference[oaicite:16]{index=16}
- **Solver** — provides liquidity across chains; fulfills requests and earns fees. :contentReference[oaicite:17]{index=17}
- **dcipher committee** — a threshold signer set (fewer than 50% malicious) that verifies completion and signs an aggregated signature uploaded on‑chain to settle with the solver. :contentReference[oaicite:18]{index=18}

## Components

- **Router Contract** — per‑chain orderbook: locks user funds, records solver fulfillments, accepts committee signatures, and reimburses solvers + fee. :contentReference[oaicite:19]{index=19}
- **Scheme / Signature Scheme** — holds committee public key and verification parameters; updateable with safeguards (timeouts & cancel). :contentReference[oaicite:20]{index=20}
- **Fees API** — central service suggesting a fee based on gas/liquidity/fulfillment stats. :contentReference[oaicite:21]{index=21}
- **ONLYportal** — reference web UI for swap, fee updates, and tracking. :contentReference[oaicite:22]{index=22}
- **onlyswaps‑js** — TypeScript client for fees, swaps, updates, and monitoring. :contentReference[oaicite:23]{index=23}
- **Solver & Verifier binaries** — off‑chain processes for fulfillment and verification. :contentReference[oaicite:24]{index=24}

## Supported Transfers (current)
Like‑for‑like ERC‑20 between supported EVM chains (e.g., RUSD on Base → RUSD on Avalanche). Roadmap includes more flexible assets/pairs. :contentReference[oaicite:25]{index=25}

