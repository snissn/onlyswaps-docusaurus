# JS SDK Reference: Clients

This document details the primary client classes provided by `onlyswaps-js`.

## OnlySwapsViemClient

The main client for interacting with the OnlySwaps Router contract.

### Constructor

```typescript
import { PublicClient, WalletClient, Address, Abi } from "viem";

export class OnlySwapsViemClient implements OnlySwaps {
  constructor(
    private account: `0x${string}`,
    private contractAddress: Address, // Router Address
    private publicClient: PublicClient,
    private walletClient: WalletClient,
    private abi: Abi = DEFAULT_ABI,
  );
}
```

### Methods

#### swap

Initiates a cross-chain swap request.

```typescript
swap(request: SwapRequest, client?: RUSD): Promise<SwapResponse>;
```

  * **Parameters:**
      * `request`: A `SwapRequest` object.
      * `client` (Optional): An `RUSD` client instance. If provided, handles the necessary ERC-20 approval (`amount + fee`) automatically.
  * **Returns:** A `SwapResponse` containing the unique `requestId`.

#### fetchRecommendedFee

Queries the Fees API to get a suggested solver fee.

```typescript
fetchRecommendedFee(
  tokenAddress: `0x${string}`,
  amount: bigint,
  srcChainId: bigint,
  dstChainId: bigint
): Promise<bigint>;
```

  * **Returns:** The recommended fee (18-decimal `bigint`).

#### updateFee

Updates the solver fee for a pending swap request.

```typescript
updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>;
```

#### fetchStatus

Queries the status of a swap request on the source chain.

```typescript
fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters>;
```

  * **Returns:** `SwapRequestParameters`, including the `executed` status.

#### fetchReceipt

Queries the fulfillment receipt on the destination chain.

```typescript
fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt>;
```

  * **Returns:** `SwapRequestReceipt`, including the `fulfilled` status.

-----

## RUSDViemClient

A minimal client for interacting with the RUSD ERC-20 faucet token (or any compatible 18-decimal ERC-20).

### Constructor

```typescript
export class RUSDViemClient implements RUSD {
  constructor(
    private account: Address,
    private contractAddr: Address, // RUSD Address
    private publicClient: PublicClient,
    private walletClient: WalletClient,
    private abi: Abi = DEFAULT_ABI
  );
}
```

### Methods

#### mint

Calls the faucet-style mint function. Typically only works on testnets/local environments.

```typescript
mint(): Promise<void>;
```

#### balanceOf

Queries the RUSD balance of a specific address.

```typescript
balanceOf(address: Address): Promise<bigint>;
```

  * **Returns:** The balance (18-decimal `bigint`).

#### approveSpend

Approves a spender (e.g., the Router contract) to spend a certain amount of RUSD.

```typescript
approveSpend(address: Address, amount: bigint): Promise<void>;
```
