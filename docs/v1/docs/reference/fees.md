---
sidebar_position: 3
---

# Fees

ONLYSwaps uses two fee dimensions:

1) Solver fee (a.k.a. resolver fee): user‑chosen incentive that motivates a solver to fulfill quickly on the destination chain. A Fees API can suggest a recommended fee based on gas, liquidity, solver count, and fill rates. You can increase this fee later with `updateFee`. :contentReference[oaicite:97]{index=97} :contentReference[oaicite:98]{index=98}

2) Verification fee: protocol fee paid to the dcipher committee for threshold verification and settlement on the source chain. It is expressed in basis points (`verificationFeeBps`) and bounded by `MAX_FEE_BPS` (BPS divisor = 10,000). :contentReference[oaicite:99]{index=99}

## How they’re calculated

- Verification fee amount (charged on the source side):

```
verificationFee = amountOut * verificationFeeBps / BPS_DIVISOR
```

Where `BPS_DIVISOR = 10_000`, and `MAX_FEE_BPS = 5_000` caps the setting. :contentReference[oaicite:100]{index=100}

- Solver fee is the absolute 18‑dp amount you offer to solvers. Start from `fetchRecommendedFee(...)` and let users override. :contentReference[oaicite:101]{index=101}

## Operational guidance

- Prefer `rusdFromString`/`rusdFromNumber` for amounts/fees; never pass JS `number` to contract calls. :contentReference[oaicite:102]{index=102}  
- If fulfillment lags, bump the fee with `updateFee(requestId, newFee)`. :contentReference[oaicite:103]{index=103}  
- Use `fetchStatus` (source) to monitor `solverFee`, `verificationFee`, `executed`, and `fetchReceipt` (destination) for `fulfilled` and `amountOut`. :contentReference[oaicite:104]{index=104}

