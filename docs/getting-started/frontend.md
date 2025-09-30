---
title: Frontend & dApp Quickstart (JS SDK)
---

# JS SDK Quickstart

This path gets a dApp developer to their **first cross‑chain swap** using the TypeScript SDK.

## Install

```bash
npm install onlyswaps-js viem
# or
pnpm add onlyswaps-js viem
```

## Initialize a client

```ts
import { createPublicClient, createWalletClient, http } from \"viem\";
import { OnlySwapsViemClient, RUSDViemClient, rusdFromString } from \"onlyswaps-js\";

const publicClient = createPublicClient({ chain: /* your chain */, transport: http(\"RPC_URL\") });
const walletClient  = createWalletClient({ account: \"0xYourEOA\", chain: /* your chain */, transport: http(\"RPC_URL\") });

const only = new OnlySwapsViemClient(
  \"0xYourEOA\",
  \"0xRouterAddress\",      // Router proxy on the source chain
  publicClient,
  walletClient
);

const rusd = new RUSDViemClient(\"0xRUSDToken\", publicClient, walletClient);
```

## Approve, request, track

```ts
// 1) Prepare amounts and seed fee
const amount = rusdFromString(\"100.00\"); // 18‑dp bigint
const fee    = await only.fetchRecommendedFee(\"0xRUSDToken\", amount, /*src*/ 1337, /*dst*/ 1338);

// 2) Ensure allowance
await rusd.approveSpend(\"0xRouterAddress\", amount + fee);

// 3) Request a cross‑chain swap
const req = {
  token: \"0xRUSDToken\",
  amount,
  dstChainId: 1338,
  recipient: \"0xRecipientOnDst\",
  fee
};
const requestId = await only.swap(req);

// 4) Track status on source, receipt on destination
const status  = await only.fetchStatus(requestId);
const receipt = await only.fetchReceipt(requestId);
```

### Recipes

- [Approve and swap](../recipes/js/first-swap.md)
- [Track request](../recipes/js/track-request.md)
- [Fee management](../recipes/js/fee-management.md)

### Troubleshooting

See [JS Troubleshooting](../reference/js/troubleshooting.md).
