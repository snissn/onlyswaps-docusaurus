---
title: Interfaces
---

```
# Interfaces

## OnlySwaps

```ts
export interface OnlySwaps {
  swap(req: SwapRequest): Promise<RequestId>;
  fetchStatus(id: RequestId): Promise<SwapStatus>;
  fetchReceipt(id: RequestId): Promise<SwapReceipt>;
  updateFee(id: RequestId, fee: Amount): Promise<void>;
  fetchRecommendedFee(token: Address, amount: Amount, src: ChainId, dst: ChainId): Promise<Amount>;
}
```

## RUSD

```ts
export interface RUSD {
  mint(): Promise<void>;
  balanceOf(addr: Address): Promise<bigint>;
  approveSpend(spender: Address, amount: Amount): Promise<void>;
}
```
