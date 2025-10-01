# `onlyswaps-js` Reference

A lightweight TypeScript client built on viem for swaps, fee management, and request tracking. All token values use **18‑decimal `bigint`**.

Install

~~~bash
npm i onlyswaps-js
~~~

---

## Clients

### `OnlySwapsViemClient`

**Summary**: Request swaps through the Router, fetch/update fees, and query status/receipts.

**Constructor**
~~~ts
new OnlySwapsViemClient(
  account: `0x${string}`,
  contractAddress: Address,
  publicClient: PublicClient,
  walletClient: WalletClient,
  abi?: Abi
)
~~~

**Methods**

~~~ts
fetchRecommendedFee(tokenAddress: `0x${string}`, amount: bigint, srcChainId: bigint, dstChainId: bigint): Promise<bigint>;
swap(request: SwapRequest, client?: RUSD): Promise<SwapResponse>;
updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>;
fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters>;
fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt>;
~~~

Use a matching `PublicClient` and `WalletClient` for the same chain; `swap` can auto‑approve `amount + fee` when given an RUSD client. `requestId` is parsed from `SwapRequested` logs. 

---

### `RUSDViemClient`

**Summary**: Faucet/test ERC‑20 wrapper with `mint`, `balanceOf`, and `approveSpend`. 

**Constructor**

~~~ts
new RUSDViemClient(account: Address, contractAddr: Address, publicClient: PublicClient, walletClient: WalletClient, abi?: Abi)
~~~

**Methods**

~~~ts
mint(): Promise<void>;
balanceOf(address: Address): Promise<bigint>;
approveSpend(address: Address, amount: bigint): Promise<void>;
~~~

Minting requires a signer and is supported on specific networks (e.g., local Anvil). Approvals typically cover `amount + fee`. 

---

## Interfaces

~~~ts
export interface OnlySwaps {
  swap(options: SwapRequest): Promise<SwapResponse>;
  updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>;
  fetchRecommendedFee(tokenAddress: `0x${string}`, amount: bigint, srcChainId: bigint, destChainId: bigint): Promise<bigint>;
  fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters>;
  fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt>;
}

export interface RUSD {
  mint(): Promise<void>;
  balanceOf(address: Address): Promise<bigint>;
  approveSpend(address: Address, amount: bigint): Promise<void>;
}
~~~



---

## Types

### `SwapRequest`

~~~ts
export type SwapRequest = {
  recipient: `0x${string}`;
  tokenAddress: `0x${string}`;
  amount: bigint;           // 18‑dp units
  fee: bigint;              // 18‑dp units
  destinationChainId: bigint;
};
~~~

Convert UI input using `rusdFromString`/`rusdFromNumber`; never pass `number`. 

### `SwapResponse`

~~~ts
export type SwapResponse = { requestId: `0x${string}` };
~~~

Persist `requestId`—it’s used to query and update swaps. 

### `SwapRequestParameters` (source‑chain status)

Includes sender/recipient, token in/out, amounts, verification & solver fees, `executed`, `requestedAt`. 

### `SwapRequestReceipt` (destination‑chain receipt)

Includes `fulfilled`, solver/recipient, `amountOut`, and time. Use `rusdToString` for display. 

---

## RUSD Formatting Helpers (18‑dp)

~~~ts
rusdToString(value: bigint, decimals = 2): string;     // truncates, does not round
rusdFromString(input: string): bigint;                 // truncates extra fractional digits beyond 18
rusdFromNumber(input: number): bigint;                 // rounds to nearest wei-style unit
~~~

Examples:

~~~ts
rusdToString(1111000000000000000n, 3) // "1.111"
rusdFromString("1.123456789012345678") // 1123456789012345678n
rusdFromNumber(1.1) // 1100000000000000000n
~~~

 

---

## Common Workflows & Troubleshooting

* **Local loop**: deploy contracts → enable transfers & map tokens → run integration tests and inspect `requestId`. 
* **Approve & swap**: `mint()` → `approveSpend(router, amount+fee)` → `swap(req)` → store `requestId`. 
* **Track**: `fetchStatus` on source (for `solverFee`, `verificationFee`, `executed`), `fetchReceipt` on destination (for `fulfilled`, `amountOut`). 

**Pitfalls**

* Revert without message → simulate & decode like `throwOnError`.
* Missing `requestId` → ensure ABI/event match.
* Mixed `number`/`bigint` → always convert to/from 18‑dp helpers.
* Fee bump ignored → already fulfilled/executed. 
