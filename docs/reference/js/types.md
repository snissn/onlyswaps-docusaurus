---
title: Types
---

# Types

## SwapRequest  
[Type] · since v0.0.0

Request parameters for a cross‑chain swap. 

### Definition

```typescript
export type SwapRequest = {
recipient: `0x${string}`;
tokenAddress: `0x${string}`;
amount: bigint;
fee: bigint;
destinationChainId: bigint;
};
```

### Guidance

* All numeric fields use 18‑decimal fixed‑point `bigint`.
* `fee` should be seeded with `fetchRecommendedFee` and may be adjusted with `updateFee`.

### Example

```typescript
const req: SwapRequest = { recipient: me, tokenAddress: RUSD, amount: 100n, fee: 1n, destinationChainId: 1338n };
```

## SwapResponse

[Type] · since v0.0.0

Result of a swap request.

### Definition

```typescript
export type SwapResponse = {
requestId: `0x${string}`;
txHash: `0x${string}`;
};
```

### Guidance

* `requestId` is parsed from the `SwapRequested` event.
* `txHash` is the submission transaction hash on the source chain.

### Example

```typescript
const { requestId, txHash } = await only.swap(req, rusd);
```

## SwapRequestParameters

[Type] · since v0.0.0

On‑chain parameters and execution status on the source chain.

### Definition

```typescript
export type SwapRequestParameters = {
requester: `0x${string}`;
recipient: `0x${string}`;
tokenAddress: `0x${string}`;
amount: bigint;
solverFee: bigint;
verificationFee: bigint;
executed: boolean;
};
```

### Guidance

* Poll this on the source chain to track solver fee/verification fee and execution status.
* `executed` reflects solver execution, not destination fulfillment; use receipt for fulfillment.

### Example

```typescript
const s: SwapRequestParameters = await only.fetchStatus(requestId);
```

## SwapRequestReceipt

[Type] · since v0.0.0

Fulfillment status and output amount on the destination chain.

### Definition

```typescript
export type SwapRequestReceipt = {
fulfilled: boolean;
amountOut: bigint;
};
```

### Guidance

* Query this on the destination chain to confirm fulfillment.
* `amountOut` is 18‑dp fixed‑point `bigint`.

### Example

```typescript
const r: SwapRequestReceipt = await only.fetchReceipt(requestId);
```
