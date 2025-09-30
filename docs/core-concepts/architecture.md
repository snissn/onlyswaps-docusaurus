---
title: System Architecture
---

# Core Concepts: Architecture

This section connects the on‑chain contracts, the off‑chain solver, and the SDK into one coherent model.

## Components

### Router (Solidity)

An **upgradeable UUPS** contract that exposes user‑facing entry points (e.g., `requestSwap`) and emits events that drive asynchronous settlement. Admin‑level operations (e.g., upgrades, validator changes, fee policy) are protected by **BLS signatures over BN254** and scheduled with a **minimum upgrade delay**. The Router also stores **destination chain permissions** and **token mappings** and enforces them during execution.

### Solver Agent (Rust)

A long‑running service that **subscribes to new blocks** on each configured chain, ingests `SwapRequested` events, checks liquidity and policy, **derives an executable plan**, and submits the **fulfillment transaction** on the destination chain. It keeps an *in‑flight cache* to deduplicate work and uses idempotent operations guarded by on‑chain **nonces**.

### JS/TS SDK

A Viem‑based client that **requests swaps** (and subsequent **fee bumps**), and **tracks status/receipts** by reading Router storage and events. It packages the ABI, event parsers, 18‑dp fixed‑point helpers, and wallet/public client integration to minimize your setup.

## End‑to‑End Flow

1. **Request:** A dApp calls `OnlySwapsViemClient.swap(...)` on **Chain A**. The Router validates token mapping and allowed **destination chain ID**, stores the intent, and emits `SwapRequested(requestId, ...)`.
2. **Plan:** The solver, subscribed to Chain A, picks up the request. It checks **fees** and **preconditions** (balances, approvals, route availability).
3. **Execute:** The solver submits the **fulfillment** on **Chain B**. The Router on Chain B verifies the parameters, moves funds, and emits `SwapFulfilled(requestId, amountOut, ...)`.
4. **Track:** The dApp polls `fetchStatus(requestId)` on Chain A and `fetchReceipt(requestId)` on Chain B using the SDK until `executed/fulfilled` are true.
5. **Bump (optional):** If execution lingers, the dApp may call `updateFee(requestId, newFee)` on Chain A to incentivize routing. The solver observes and may re‑plan.

```
Chain A (source)                    Off‑chain                    Chain B (destination)
┌──────────────┐   SwapRequested     ┌──────────┐    Fulfill tx   ┌──────────────┐
│  Router A    │ ───────────────▶    │  Solver  │  ───────────▶   │  Router B    │
└──────────────┘                      └──────────┘                 └──────────────┘
       ▲                                     │                             ▲
       │  swap() via SDK                     │ monitors ws/block stream    │ emits SwapFulfilled
       │                                     ▼                             │
      dApp                           logs/metrics                          dApp reads receipt
```

## Messages, Nonces, and Idempotency

Routers track a **monotonic `currentNonce`** for upgrade/admin messages. User swap requests are validated against **replay‑safe IDs** and **domain‑separated signatures**. The solver treats all external calls as **at‑least‑once** and uses *idempotent* patterns to tolerate retries.

## Fees

Two fee notions appear consistently:

- **Solver fee:** Portion earmarked to compensate solver execution.
- **Verification fee:** Router‑level fee for validation or settlement.

Use the SDK’s `fetchRecommendedFee(token, amount, src, dst)` to seed a sensible total and later call `updateFee` if needed.

See [Security Model](security.md) for trust boundaries and failure modes.
