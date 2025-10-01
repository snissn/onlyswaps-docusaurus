# Backend & Programmatic Swaps (Node/TypeScript)

Goal: Kick off and monitor swaps from a backend or script using `viem` + `onlyswaps-js`.

## Prerequisites

- Node.js ≥ 18
- A funded private key for the source chain
- RPC URLs for source and destination chains

## 1) Project setup

```bash
mkdir onlyswaps-script && cd $_
pnpm init -y
pnpm add typescript ts-node viem onlyswaps-js
pnpm exec tsc --init
```

## 2) Create viem clients

```ts
// client.ts
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

export function makeClients(pk: `0x${string}`) {
  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({ chain: baseSepolia, transport: http() });
  const walletClient = createWalletClient({ chain: baseSepolia, transport: http(), account });
  return { account, publicClient, walletClient };
}
```

## 3) Instantiate OnlySwaps & RUSD clients

```ts
// only.ts
import { OnlySwapsViemClient, RUSDViemClient } from 'onlyswaps-js';

export function makeOnly(account: `0x${string}`, router: `0x${string}`, rusd: `0x${string}`, pc: any, wc: any) {
  const rusdClient = new RUSDViemClient(account, rusd, pc, wc);
  const only = new OnlySwapsViemClient(account, router, pc, wc);
  return { only, rusdClient };
}
```

The JS client exposes: `swap`, `fetchRecommendedFee`, `updateFee`, `fetchStatus`, `fetchReceipt`; the RUSD client supports `mint`, `approveSpend`, `balanceOf`. All amounts are 18‑dp `bigint`.  

## 4) Full end‑to‑end script

```ts
// run.ts
import { rusdFromString } from 'onlyswaps-js';
import type { SwapRequest } from 'onlyswaps-js';
import { makeClients } from './client';
import { makeOnly } from './only';

const PK = process.env.PRIVATE_KEY as `0x${string}`;
const ROUTER = process.env.ROUTER as `0x${string}`;
const RUSD   = process.env.RUSD as `0x${string}`;
const DST_ID = BigInt(process.env.DST_CHAIN_ID || '84532'); // example: Base Sepolia

(async () => {
  const { account, publicClient, walletClient } = makeClients(PK);
  const { only, rusdClient } = makeOnly(account.address as `0x${string}`, ROUTER, RUSD, publicClient, walletClient);

  // 1) Mint faucet tokens (dev/test networks)
  await rusdClient.mint();

  // 2) Approve Router to spend amount + fee
  const amount = rusdFromString('100.00');
  const feeRec = await only.fetchRecommendedFee(RUSD, amount, BigInt(publicClient.chain!.id), DST_ID); // optional but handy
  const fee = feeRec; // let users override if needed
  await rusdClient.approveSpend(ROUTER, amount + fee);

  // 3) Initiate the swap
  const req: SwapRequest = {
    recipient: account.address as `0x${string}`,
    tokenAddress: RUSD,
    amount,
    fee,
    destinationChainId: DST_ID,
  };
  const { requestId } = await only.swap(req, rusdClient);

  // 4) Optional: bump fee if not moving
  const status1 = await only.fetchStatus(requestId);
  if (!status1.executed) {
    await only.updateFee(requestId, status1.solverFee + 1n);
  }

  // 5) Poll until executed/fulfilled
  let executed = false, fulfilled = false;
  while (!executed || !fulfilled) {
    const s = await only.fetchStatus(requestId);
    const r = await only.fetchReceipt(requestId);
    executed = s.executed;
    fulfilled = r.fulfilled;
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('Swap complete', requestId);
})();
```

* Fee lifecycle: seed from `fetchRecommendedFee`, allow user to increase with `updateFee` if fulfillment lags. 
* Status vs receipt: source chain `executed` vs destination chain `fulfilled`. 

