---
title: Track a Swap Across Chains
---

# Recipe: Track a Swap Across Chains

# Track status and receipt across chains

1. Poll `fetchStatus(requestId)` on the source chain to observe `solverFee`, `verificationFee`, and `executed`.
2. Check `fetchReceipt(requestId)` on the destination chain for `fulfilled` and `amountOut`.

**Tip**: For event‑driven UIs, subscribe to the destination chain for `SwapFulfilled` and reconcile with the local request id.
