# JS SDK Reference: Core Types

This document defines the core TypeScript types used in `onlyswaps-js`.

> **Note:** All monetary values (`amount`, `fee`) are 18-decimal fixed-point integers represented as `bigint`.

## SwapRequest

Input parameters required for initiating a swap via `OnlySwapsViemClient.swap()`.

```typescript
export type SwapRequest = {
  recipient: `0x${string}`;         // The address to receive funds on the destination chain.
  tokenAddress: `0x${string}`;      // The address of the token on the source chain.
  amount: bigint;                   // The amount of tokens to swap (e.g., 100n for 100 RUSD).
  fee: bigint;                      // The fee offered to the solver (e.g., 1n for 1 RUSD).
  destinationChainId: bigint;       // The chain ID of the destination network.
};
```

## SwapResponse

The return value from a successful `swap()` call.

```typescript
export type SwapResponse = {
  requestId: `0x${string}`; // The unique identifier for the swap request.
};
```

  * **Guidance:** Persist the `requestId` immediately for tracking and fee updates.

## SwapRequestParameters

The on-chain status of a swap request on the **source chain**. Returned by `fetchStatus()`.

```typescript
export type SwapRequestParameters = {
  sender: `0x${string}`,
  recipient: `0x${string}`,
  tokenIn: `0x${string}`,
  tokenOut: `0x${string}`,
  amountOut: bigint,
  srcChainId: bigint,
  dstChainId: bigint,
  verificationFee: bigint,
  solverFee: bigint,
  nonce: bigint,
  executed: boolean,   // True if verified by dcipher and solver reimbursed.
  requestedAt: bigint,
};
```

## SwapRequestReceipt

The on-chain receipt of fulfillment on the **destination chain**. Returned by `fetchReceipt()`.

```typescript
export type SwapRequestReceipt = {
  requestId: `0x${string}`,
  srcChainId: bigint,
  dstChainId: bigint,
  token: `0x${string}`,
  fulfilled: boolean,  // True if the solver completed the transfer to the user.
  solver: `0x${string}`,
  recipient: `0x${string}`,
  amountOut: bigint,
  fulfilledAt: bigint
};
```

``` 
