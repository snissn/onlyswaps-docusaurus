---
title: Fee Management
---

# Recipe: Manage and Bump Fees

# Fee management best practice

1. Seed `fee` with `fetchRecommendedFee(token, amount, src, dst)` (18‑dp bigint).
2. If the request lingers unfulfilled, bump with `updateFee(requestId, newFee)` and verify via `fetchStatus`.

**Policy**: Your app may implement a backoff (e.g., +10% after 5 minutes idle) and cap the max fee.
