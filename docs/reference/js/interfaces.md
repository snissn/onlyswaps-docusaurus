---
title: Interfaces
---

# Interfaces

## OnlySwaps  
[Interface] · since v0.0.0

Router client abstraction. 

### Definition

```typescript
export interface OnlySwaps {
fetchRecommendedFee(
tokenAddress: `0x${string}`,
amount: bigint,
srcChainId: bigint,
dstChainId: bigint
): Promise<bigint>;
swap(request: SwapRequest, client?: RUSD): Promise<SwapResponse>;
updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>;
fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters>;
fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt>;
}
```

### Guidance

* Use a single instance per chain and account to keep state consistent and simple in applications.
* Ensure the ABI used matches the deployed Router to avoid event parsing and runtime failures.

### Example

```typescript
const only: OnlySwaps = new OnlySwapsViemClient(me, router, publicClient, walletClient);
```

## RUSD

[Interface] · since v0.0.0

RUSD token client abstraction.

### Definition

```typescript
export interface RUSD {
mint(to?: `0x${string}`): Promise<void>;
approveSpend(spender: `0x${string}`, value: bigint): Promise<void>;
balanceOf(owner: `0x${string}`): Promise<bigint>;
}
```

### Guidance

* Treat all values as 18‑dp fixed‑point `bigint` and format for UI with RUSD String helpers.
* Keep `to`/`owner` checks at the app layer; the client accepts any EVM address per usual ERC‑20 semantics.

### Example

```typescript
const rusd: RUSD = new RUSDViemClient(me, rusdAddr, publicClient, walletClient);
```
