---
title: Types
---

```
# Types

- `type Address = `0x${string}`` — EVM address
- `type Amount = bigint` — 18‑dp fixed‑point integer
- `type ChainId = number`
- `type RequestId = `0x${string}``

## SwapRequest

```ts
export interface SwapRequest {
  token: Address;
  amount: Amount;
  dstChainId: ChainId;
  recipient: Address;
  fee: Amount;
}
```

## SwapStatus & SwapReceipt

```ts
export interface SwapStatus {
  solverFee: Amount;
  verificationFee: Amount;
  executed: boolean;
}

export interface SwapReceipt {
  fulfilled: boolean;
  amountOut: Amount;
}
```
