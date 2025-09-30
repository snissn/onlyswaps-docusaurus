---
title: Approve and Request a Swap
---

# Recipe: Approve and Request a Swap

This is the shortest path from balances to a pending cross‑chain swap.

# Approve and request a swap

1. Mint RUSD on the local faucet contract using `RUSDViemClient.mint()`.
2. Approve the Router to spend `amount + fee` via `approveSpend(router, total)`.
3. Call `OnlySwapsViemClient.swap(req)` and store the returned `requestId`.

**Why these steps?** The Router never pulls funds implicitly. Explicit approvals avoid surprise allowances and make retries idempotent.

**Gotchas**

- Use 18‑dp `bigint` for all amounts; format with `rusdToString` only for UI.
- Ensure the Router ABI matches the deployed proxy version when parsing events.
