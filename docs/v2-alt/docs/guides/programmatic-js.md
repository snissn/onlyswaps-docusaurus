# Guide: Programmatic Swaps with `onlyswaps-js`

This guide shows how to mint test tokens, approve spend, and initiate a swap using viem clients.

## 1) Setup viem clients

~~~ts
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";

const account = privateKeyToAccount(process.env.PRIVATE_KEY!);
export const publicClient = createPublicClient({ chain: foundry, transport: http("http://localhost:31337") });
export const walletClient = createWalletClient({ chain: foundry, transport: http("http://localhost:31337"), account });
~~~

## 2) Mint RUSD (test) & approve Router

~~~ts
import { RUSDViemClient } from "onlyswaps-js";

const me = account.address as `0x${string}`;
const RUSD_ADDR = process.env.RUSD as `0x${string}`;
const ROUTER_ADDR = process.env.ROUTER as `0x${string}`;

const rusd = new RUSDViemClient(me, RUSD_ADDR, publicClient, walletClient);
await rusd.mint(); // faucet-like; available on supported test deployments
const bal = await rusd.balanceOf(me);
await rusd.approveSpend(ROUTER_ADDR, bal);
~~~

`RUSDViemClient` exposes `mint`, `balanceOf`, `approveSpend` over an 18‑dp test token. 

## 3) Request a swap & manage fees

~~~ts
import { OnlySwapsViemClient, rusdFromNumber, type SwapRequest } from "onlyswaps-js";

const only = new OnlySwapsViemClient(me, ROUTER_ADDR, publicClient, walletClient);

// Optional: start with a recommended fee
const amount = rusdFromNumber(100);
const fee = await only.fetchRecommendedFee(RUSD_ADDR, amount, 1337n, 1338n);

const req: SwapRequest = {
  recipient: me,
  tokenAddress: RUSD_ADDR,
  amount,
  fee,
  destinationChainId: 1338n,
};

const { requestId } = await only.swap(req, rusd); // approves amount+fee if needed
const before = await only.fetchStatus(requestId);
if (!before.executed) {
  await only.updateFee(requestId, before.solverFee + rusdFromNumber(1));
}
const receipt = await only.fetchReceipt(requestId);
console.log({ requestId, executed: before.executed, fulfilled: receipt.fulfilled });
~~~

The OnlySwaps client parses `SwapRequested` logs to obtain `requestId`, differentiates source‑chain `status` vs destination‑chain `receipt`, and provides helpers to fetch/update fees. Keep values in 18‑dp `bigint`.   

> **Common pitfalls**
>
> * Missing allowance → ensure `approveSpend(router, amount + fee)` or pass your RUSD client to `swap`.
> * Fee seems ignored → the request is likely already `executed`/`fulfilled`. Check both chains before bumping. 
