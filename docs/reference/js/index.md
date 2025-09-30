---
title: JS SDK Reference
---

# JS SDK Reference

Viem‑based clients, helpers, and types for interacting with OnlySwaps.

- **Clients** — high‑level classes for Router and RUSD.
- **Interfaces & Types** — request/receipt/status structures.
- **Helpers** — fixed‑point arithmetic and formatting.

> Library version: ^0.0.0 (spec 0.3.0)

## Quick Start

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
