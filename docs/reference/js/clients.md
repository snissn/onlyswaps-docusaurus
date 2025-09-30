---
title: Clients
---

# Clients

## OnlySwapsViemClient  
[Class] · since v0.0.0

Viem‑backed client for the OnlySwaps Router: request swaps, suggest/update fees, and query status/receipt. 

### Definition

```typescript
export class OnlySwapsViemClient implements OnlySwaps {
constructor(
private account: `0x${string}`,
private contractAddress: Address,
private publicClient: PublicClient,
private walletClient: WalletClient,
private abi: Abi = DEFAULT_ABI,
);
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

* Provide both a `PublicClient` and `WalletClient` from viem with the same chain configuration (e.g., Foundry/Anvil in tests).
* Before swapping, ensure the Router is approved to spend RUSD and fee; the client path invokes `approveSpend` to cover both.
* `fetchRecommendedFee` returns a suggested fee (18‑dp bigint); use as a starting point and let users override with `updateFee`.
* The client extracts `requestId` by parsing the `SwapRequested` event from the transaction receipt; handle the rare case of no matching event.
* Use `fetchStatus` on the source chain to watch parameters and execution; use `fetchReceipt` on the destination chain to check `fulfilled` and `amountOut`.

### Example

Minimal end‑to‑end swap flow on a local Anvil chain.

```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import { OnlySwapsViemClient, RUSDViemClient, type SwapRequest } from "onlyswaps-js";

(async () => {
const account = privateKeyToAccount("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
const publicClient = createPublicClient({ chain: foundry, transport: http("http://localhost:31337") });
const walletClient  = createWalletClient({ chain: foundry, transport: http("http://localhost:31337"), account });

const MY = account.address as `0x${string}`;
const RUSD = "0xEFdbe33D9014FFde884Bf055D5202e3851213805" as const;
const ROUTER = "0x3d86B64a0f09Ca611edbcfB68309dFdEed87Ad89" as const;

const rusd = new RUSDViemClient(MY, RUSD, publicClient, walletClient);
const only = new OnlySwapsViemClient(MY, ROUTER, publicClient, walletClient);

await rusd.mint();
const req: SwapRequest = { recipient: MY, tokenAddress: RUSD, amount: 100n, fee: 1n, destinationChainId: 1338n };
const { requestId } = await only.swap(req, rusd);
const before = await only.fetchStatus(requestId);
await only.updateFee(requestId, before.solverFee + 1n);
const after = await only.fetchStatus(requestId);
console.log({ requestId, before: before.solverFee, after: after.solverFee });
})();
```

## RUSDViemClient

[Class] · since v0.0.0

Minimal ERC‑20 faucet token (RUSD) viem client for minting, approving, and reading balances.

### Definition

```typescript
export class RUSDViemClient implements RUSD {
constructor(
private account: `0x${string}`,
private contractAddress: Address,
private publicClient: PublicClient,
private walletClient: WalletClient,
private abi: Abi = DEFAULT_ABI,
);
mint(to?: `0x${string}`): Promise<void>;
approveSpend(spender: `0x${string}`, value: bigint): Promise<void>;
balanceOf(owner: `0x${string}`): Promise<bigint>;
}
```

### Guidance

* Provide both a `PublicClient` and `WalletClient` and keep the same chain configuration (e.g., Foundry/Anvil in tests).
* Before swapping, ensure the Router is approved to spend RUSD and fee; the client path invokes `approveSpend` to cover both.
* Prefer formatting balances with `rusdToString(balance, dp)` when displaying to users; keep raw `bigint` for arithmetic.

### Example

```typescript
import { RUSDViemClient } from "onlyswaps-js";
// assume publicClient/walletClient and addresses are prepared
async function demo(rusdAddr: `0x${string}`, me: `0x${string}`, router: `0x${string}`, pc: any, wc: any) {
const rusd = new RUSDViemClient(me, rusdAddr, pc, wc);
await rusd.mint();
const bal = await rusd.balanceOf(me);
console.log("Minted:", bal);
await rusd.approveSpend(router, bal);
}
```

