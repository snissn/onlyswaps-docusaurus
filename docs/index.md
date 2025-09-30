---
title: OnlySwaps Developer Portal
description: Build, integrate, and operate cross‑chain swaps with the OnlySwaps protocol.
---

# OnlySwaps Developer Portal

OnlySwaps is a **cross‑chain swap protocol** composed of three cooperating parts:

- **Upgradeable Solidity Router** (on every chain) — verifies BLS‑gated admin actions, holds mappings of supported tokens and chains, and emits/consumes events for swaps.
- **Rust Solver Agent** (off‑chain) — listens to multiple chains, matches pending requests to feasible routes, orchestrates approvals/transfers, and finalizes fulfillment on the destination chain.
- **TypeScript SDK** — a friendly front‑end and server‑side client for requesting swaps, managing fees, and tracking status/receipts.

This portal is crafted for four developer personas. Jump straight to the path that fits your job to be done:

- **dApp & Frontend** → [Get started with the JS SDK](getting-started/frontend.md), then browse the [SDK reference](reference/js/index.md) and [recipes](recipes/js/first-swap.md).
- **Backend & Integration (Solvers)** → [Run the Rust solver](getting-started/solver.md) and see the [solver API](reference/rust-solver/index.md).
- **Smart Contract & Protocol** → Review [core concepts](core-concepts/architecture.md), then the [Solidity contracts](reference/solidity/index.md) and [upgrade model](core-concepts/security.md#uups--bls-governance).
- **DevOps & Operators** → Follow the [production runbook](operations/deployment.md) and [monitoring](operations/monitoring.md).

> Versions: Solidity **1.0.0**, Rust solver **0.1.0**, JS SDK **^0.0.0** · Spec v0.3.0 (2025-09-29)

## Why OnlySwaps?

- **Security by design:** *BLS‑gated UUPS upgrades* and domain‑separated signatures keep control paths simple and auditable.
- **Execution you can observe:** Off‑chain solver emits clear logs/metrics and uses idempotent, nonce‑protected messages.
- **DX that ships:** Viem‑based SDK with typed helpers for 18‑dp fixed‑point, event parsing, and status tracking.

## What’s inside

- [Core Concepts](core-concepts/architecture.md): mental model of how the pieces fit together.
- [Getting Started](getting-started/): persona‑specific quickstarts.
- [Reference](reference/): exhaustive APIs for Solidity, Rust solver, and JS SDK.
- [Operations](operations/): deploying, upgrading, monitoring, and troubleshooting.

If you’re migrating from a previous version, see [CHANGELOG](changelog.md).
