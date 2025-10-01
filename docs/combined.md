./changelog.md
```
---
title: Changelog
---

# Changelog

## 0.3.0 — 2025-09-29

- First unified developer portal.
- Introduced Core Concepts section (architecture, security).
- Consolidated JS, Rust, and Solidity references.
- Added production runbook and monitoring guidance.
```
./contributing/index.md
```
---
title: Contributing
---

# Contributing

We welcome PRs that improve docs, examples, and developer tooling.

## Style

- Use clear, active voice.
- Show complete, copy‑paste‑able snippets.
- Prefer **Links to source** over long code dumps.

## Testing

- For contracts: add Foundry/Hardhat tests.
- For solver: add unit tests and run E2E against two dev chains.
- For SDK: add Jest/Vitest tests for helpers and clients.

## Release process

- Bump versions in lockstep when ABI or event shapes change.
- Update [CHANGELOG](../changelog.md).
```
./glossary.md
```
---
title: Glossary
---

# Glossary

- **BLS (BN254)**: Signature scheme used for admin gating; gas‑efficient and aggregatable.
- **UUPS**: Upgradeable proxy pattern where implementation authorizes upgrades.
- **Domain separation**: App‑specific tag ('swap‑v1') included in signatures to prevent replay.
- **RequestId**: Unique identifier emitted with `SwapRequested` and tracked across chains.
- **Solver fee / Verification fee**: Economic parameters that guide off‑chain execution and on‑chain validation.
```
./operations/troubleshooting.md
```
---
title: Operations Troubleshooting
---

# Troubleshooting (Ops)

Common symptoms and fixes across the stack.

- **WS stream ended unexpectedly** → Provider drop. Reconnect and consider backoff; alert on churn.
- **Approve reverted** → Missing allowance or wrong nonce. Retry after TTL; verify signer funds.
- **No trades produced** → Preconditions failed (fee = 0, token mismatch, insufficient dest balance). Check mappings and balances.

See component‑specific pages:
- [Solver Troubleshooting](../reference/rust-solver/troubleshooting.md)
- [JS Troubleshooting](../reference/js/troubleshooting.md)
- [Solidity Support](../reference/solidity/support.md)
```
./operations/deployment.md
```
---
title: Deployment & Upgrades
---

# Deployment & Upgrades

This runbook covers deploying contracts, publishing artifacts, and rolling out solver/SDK.

## Deploy contracts

1. Deploy **Router** implementation and **UUPS** proxy on each chain.
2. Register **BLS validator** for `swap-v1`.
3. Configure **destination chains** and **token mappings**.

## Upgrades

See the next section for scheduling and executing.

## Schedule an upgrade

1. Derive bytes with `contractUpgradeParamsToBytes`.
2. Collect BLS signature from the authorized key holder.
3. Call `scheduleUpgrade(...)` (admin) with ETA ≥ `minimumContractUpgradeDelay`.
4. After ETA, **execute** the upgrade. Verify with `proxiableUUID`.

## Roll out the solver

- Deploy with **systemd**, **Kubernetes**, or your scheduler of choice.
- Expose `/healthz` and `/metrics`; set reasonable memory/CPU limits.
- Use **WS endpoints** for reads; keep **HTTP endpoints** for writes.

## Roll out the dApp

- Provide chain and Router addresses to the SDK.
- Pin ABI versions; watch release notes for breaking events.

See also: [Monitoring](monitoring.md), [Troubleshooting](troubleshooting.md).
```
./operations/monitoring.md
```
---
title: Monitoring & Observability
---

# Monitoring & Observability

## Solver process

- **Liveness**: `/healthz` returns 200 when main loop runs.
- **Readiness**: `/readyz` exposes provider connectivity per chain.
- **Metrics** (suggested):
  - `onlyswaps_pending_requests` (gauge)
  - `onlyswaps_trades_executed_total` (counter)
  - `onlyswaps_execution_latency_seconds` (histogram)
  - `onlyswaps_ws_restarts_total` (counter)

## On‑chain

- Watch `SwapRequested` and `SwapFulfilled` rates.
- Alert on revert spikes and long‑pending requests.

## Logs

- Emit structured JSON; include `requestId`, `srcChain`, `dstChain`, and tx hashes.
- Sample log lines:
  - `request.new` / `request.fee.bump` / `execute.start` / `execute.ok` / `execute.err`.
```
./getting-started/contracts.md
```
---
title: Contract Developer Quickstart (Solidity)
---

# Solidity Quickstart

This path orients auditors and protocol developers to the on‑chain layer.

## Repo & build

- Build with **Foundry** or **Hardhat**.
- Contracts live behind a **UUPS** proxy; use interfaces (`IRouter`, `IScheduledUpgradeable`) for integration.

## Local deployment steps

1. Deploy BLS validator and register with `application = \"swap-v1\"`.
2. Deploy Router implementation and UUPS proxy.
3. Configure initial policy:
   - `permitDestinationChainId(dstChainId)`
   - `setTokenMapping(dstChainId, dstToken, srcToken)`
   - set fees as required

## Admin messages

Derive bytes to sign:

```solidity
(bytes memory msg, bytes memory domain) =
  router.contractUpgradeParamsToBytes(action, pendingImpl, admin, extra, eta, nonce);
// or
(bytes memory msg, bytes memory domain) = 
  router.blsValidatorUpdateParamsToBytes(newValidator, eta, nonce);
```

Sign off‑chain with BN254/BLS and submit the schedule; execute after the delay. See [Security](../core-concepts/security.md) and [Solidity Reference](../reference/solidity/index.md).
```
./getting-started/solver.md
```
---
title: Solver Operator Quickstart (Rust)
---

# Rust Solver Quickstart

Run a local solver against two dev chains to execute a full end‑to‑end swap.

## Prerequisites

- Rust toolchain (1.76+), `cargo`
- Two EVM nodes (e.g., **Anvil**) on ports **1337** and **1338**
- Deployed Router & RUSD contracts on both chains

## Launch test chains

```bash
anvil --port 1337 --chain-id 1337 --block-time 3
anvil --port 1338 --chain-id 1338 --block-time 3
```

## Configure the solver

Create `config-local.json`:

```json
{
  \"networks\": [
    {
      \"chain_id\": 1337,
      \"rpc_url\": \"ws://127.0.0.1:1337\",
      \"rusd_address\": \"0x...\",
      \"router_address\": \"0x...\"
    },
    {
      \"chain_id\": 1338,
      \"rpc_url\": \"ws://127.0.0.1:1338\",
      \"rusd_address\": \"0x...\",
      \"router_address\": \"0x...\"
    }
  ],
  \"api\": {
    \"bind\": \"127.0.0.1:8080\"
  }
}
```

## Run

```bash
cargo run --release -- --config-path ./config-local.json --private-key 0xYourDevKey
```

Watch logs for `SwapRequested` on 1337 and `SwapFulfilled` on 1338.

### Common workflows

- Restart after WS drop — solver reconnects providers automatically.
- Fee bump handling — solver re‑evaluates pending intents upon `updateFee`.

See the full [Solver API Reference](../reference/rust-solver/index.md) and [Troubleshooting](../reference/rust-solver/troubleshooting.md).
```
./getting-started/frontend.md
```
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
```
./getting-started/devops.md
```
---
title: DevOps & Operator Quickstart
---

# Operations Quickstart

## Minimal production checklist

- [ ] Separate **read WS** and **write HTTP** RPC endpoints per chain.
- [ ] Configure solver **liveness** (`/healthz`) and **readiness** (`/readyz`) probes.
- [ ] Persist logs (JSON) and forward metrics.
- [ ] Pin Router proxy & implementation addresses in a manifest.
- [ ] Keep BLS key material in HSM or equivalent; **never** embed in code.

## Deploy sequence

1. Bring up chains/RPC infrastructure.
2. Deploy contracts and publish addresses/ABIs.
3. Roll out solver (blue/green).
4. Roll out front‑end with SDK config.

Continue to [Deployment Runbook](../operations/deployment.md).
```
./index.md
```
---
title: OnlySwaps Developer Portal
description: Build, integrate, and operate cross‑chain swaps with the OnlySwaps protocol.
---

# OnlySwaps Developer Portal

OnlySwaps is a **cross‑chain swap protocol** composed of three cooperating parts:

- **Upgradeable Solidity Router** (on every chain) — verifies BLS‑gated admin actions, holds mappings of supported tokens and chains, and emits/consumes events for swaps.
- **Rust Solver Agent** (off‑chain) — listens to multiple chains, matches pending requests to feasible routes, orchestrates approvals/transfers, and finalizes fulfillment on the destination chain.
- **TypeScript SDK** — a friendly front‑end and server‑side client for requesting swaps, managing fees, and tracking status/receipts.

This portal is crafted for four developer personas. Jump straight to the path that fits your job to be done:

- **dApp & Frontend** → [Get started with the JS SDK](getting-started/frontend.md), then browse the [SDK reference](reference/js/index.md) and [recipes](recipes/js/first-swap.md).
- **Backend & Integration (Solvers)** → [Run the Rust solver](getting-started/solver.md) and see the [solver API](reference/rust-solver/index.md).
- **Smart Contract & Protocol** → Review [core concepts](core-concepts/architecture.md), then the [Solidity contracts](reference/solidity/index.md) and [upgrade model](core-concepts/security.md#uups--bls-governance).
- **DevOps & Operators** → Follow the [production runbook](operations/deployment.md) and [monitoring](operations/monitoring.md).

> Versions: Solidity **1.0.0**, Rust solver **0.1.0**, JS SDK **^0.0.0** · Spec v0.3.0 (2025-09-29)

## Why OnlySwaps?

- **Security by design:** *BLS‑gated UUPS upgrades* and domain‑separated signatures keep control paths simple and auditable.
- **Execution you can observe:** Off‑chain solver emits clear logs/metrics and uses idempotent, nonce‑protected messages.
- **DX that ships:** Viem‑based SDK with typed helpers for 18‑dp fixed‑point, event parsing, and status tracking.

## What’s inside

- [Core Concepts](core-concepts/architecture.md): mental model of how the pieces fit together.
- [Getting Started](getting-started/): persona‑specific quickstarts.
- [Reference](reference/): exhaustive APIs for Solidity, Rust solver, and JS SDK.
- [Operations](operations/): deploying, upgrading, monitoring, and troubleshooting.

If you’re migrating from a previous version, see [CHANGELOG](changelog.md).
```
./recipes/js/fee-management.md
```
---
title: Fee Management
---

# Recipe: Manage and Bump Fees

# Fee management best practice

1. Seed `fee` with `fetchRecommendedFee(token, amount, src, dst)` (18‑dp bigint).
2. If the request lingers unfulfilled, bump with `updateFee(requestId, newFee)` and verify via `fetchStatus`.

**Policy**: Your app may implement a backoff (e.g., +10% after 5 minutes idle) and cap the max fee.
```
./recipes/js/first-swap.md
```
---
title: Approve and Request a Swap
---

# Recipe: Approve and Request a Swap

This is the shortest path from balances to a pending cross‑chain swap.

# Approve and request a swap

1. Mint RUSD on the local faucet contract using `RUSDViemClient.mint()`.
2. Approve the Router to spend `amount + fee` via `approveSpend(router, total)`.
3. Call `OnlySwapsViemClient.swap(req)` and store the returned `requestId`.

**Why these steps?** The Router never pulls funds implicitly. Explicit approvals avoid surprise allowances and make retries idempotent.

**Gotchas**

- Use 18‑dp `bigint` for all amounts; format with `rusdToString` only for UI.
- Ensure the Router ABI matches the deployed proxy version when parsing events.
```
./recipes/js/track-request.md
```
---
title: Track a Swap Across Chains
---

# Recipe: Track a Swap Across Chains

# Track status and receipt across chains

1. Poll `fetchStatus(requestId)` on the source chain to observe `solverFee`, `verificationFee`, and `executed`.
2. Check `fetchReceipt(requestId)` on the destination chain for `fulfilled` and `amountOut`.

**Tip**: For event‑driven UIs, subscribe to the destination chain for `SwapFulfilled` and reconcile with the local request id.
```
./core-concepts/architecture.md
```
---
title: System Architecture
---

# Core Concepts: Architecture

This section connects the on‑chain contracts, the off‑chain solver, and the SDK into one coherent model.

## Components

### Router (Solidity)

An **upgradeable UUPS** contract that exposes user‑facing entry points (e.g., `requestSwap`) and emits events that drive asynchronous settlement. Admin‑level operations (e.g., upgrades, validator changes, fee policy) are protected by **BLS signatures over BN254** and scheduled with a **minimum upgrade delay**. The Router also stores **destination chain permissions** and **token mappings** and enforces them during execution.

### Solver Agent (Rust)

A long‑running service that **subscribes to new blocks** on each configured chain, ingests `SwapRequested` events, checks liquidity and policy, **derives an executable plan**, and submits the **fulfillment transaction** on the destination chain. It keeps an *in‑flight cache* to deduplicate work and uses idempotent operations guarded by on‑chain **nonces**.

### JS/TS SDK

A Viem‑based client that **requests swaps** (and subsequent **fee bumps**), and **tracks status/receipts** by reading Router storage and events. It packages the ABI, event parsers, 18‑dp fixed‑point helpers, and wallet/public client integration to minimize your setup.

## End‑to‑End Flow

1. **Request:** A dApp calls `OnlySwapsViemClient.swap(...)` on **Chain A**. The Router validates token mapping and allowed **destination chain ID**, stores the intent, and emits `SwapRequested(requestId, ...)`.
2. **Plan:** The solver, subscribed to Chain A, picks up the request. It checks **fees** and **preconditions** (balances, approvals, route availability).
3. **Execute:** The solver submits the **fulfillment** on **Chain B**. The Router on Chain B verifies the parameters, moves funds, and emits `SwapFulfilled(requestId, amountOut, ...)`.
4. **Track:** The dApp polls `fetchStatus(requestId)` on Chain A and `fetchReceipt(requestId)` on Chain B using the SDK until `executed/fulfilled` are true.
5. **Bump (optional):** If execution lingers, the dApp may call `updateFee(requestId, newFee)` on Chain A to incentivize routing. The solver observes and may re‑plan.

```
Chain A (source)                    Off‑chain                    Chain B (destination)
┌──────────────┐   SwapRequested     ┌──────────┐    Fulfill tx   ┌──────────────┐
│  Router A    │ ───────────────▶    │  Solver  │  ───────────▶   │  Router B    │
└──────────────┘                      └──────────┘                 └──────────────┘
       ▲                                     │                             ▲
       │  swap() via SDK                     │ monitors ws/block stream    │ emits SwapFulfilled
       │                                     ▼                             │
      dApp                           logs/metrics                          dApp reads receipt
```

## Messages, Nonces, and Idempotency

Routers track a **monotonic `currentNonce`** for upgrade/admin messages. User swap requests are validated against **replay‑safe IDs** and **domain‑separated signatures**. The solver treats all external calls as **at‑least‑once** and uses *idempotent* patterns to tolerate retries.

## Fees

Two fee notions appear consistently:

- **Solver fee:** Portion earmarked to compensate solver execution.
- **Verification fee:** Router‑level fee for validation or settlement.

Use the SDK’s `fetchRecommendedFee(token, amount, src, dst)` to seed a sensible total and later call `updateFee` if needed.

See [Security Model](security.md) for trust boundaries and failure modes.
```
./core-concepts/security.md
```
---
title: Security Model
---

# Core Concepts: Security

This document explains the upgrade and validation model and the key invariants that keep OnlySwaps safe.

## UUPS + BLS Governance

OnlySwaps Routers are deployed behind a **UUPS proxy**. Administrative actions (upgrades, validator set changes) are **gated by BLS signatures on BN254** and subject to a **minimum upgrade delay** (default ≥ 2 days). The flow is:

1. Construct the message bytes via `contractUpgradeParamsToBytes(...)` or `blsValidatorUpdateParamsToBytes(...)` on the proxy.
2. The authorized **BLS validator** signs the returned bytes with the **domain** `swap-v1` to enforce **domain separation** and prevent cross‑app replay.
3. Schedule the change (e.g., **schedule upgrade**) with the signature and a timelock that respects `minimumContractUpgradeDelay`.
4. After the delay, **execute** the action. Attempts below the delay revert.

**Why BLS?** Aggregatable, gas‑efficient signatures with on‑chain verification using the well‑vetted BN254 curve.

## Roles and Permissions

- **ADMIN** — can permit destination chains, set token mappings, and manage fees.
- **Upgrader** — the UUPS upgrader role, further gated by BLS signatures & timelock.
- **Public** — can request swaps and bump fees within configured bounds.

Routers revert with clear errors such as `AccessControlUnauthorizedAccount`, `DestinationChainIdNotSupported`, or `TokenMappingAlreadyExists` when invariants fail.

## Replay Safety & Domain Separation

Every admin message includes the **current nonce**, the **chain id**, and the **domain tag** (e.g., `swap-v1`). User swaps bind the **(src, dst, token pair)** to avoid ambiguous execution paths across chains.

## Solver Trust Boundary

The solver is **untrusted by design**: it cannot mutate Router state without satisfying Router’s checks. Its responsibilities are observational (planning) and transactional (submitting valid fulfillments). Failures are bounded:

- If execution fails, the request remains pending; users may **bump fees**.
- If the solver crashes, another instance can resume thanks to **idempotency** and **event‑sourced state**.

## Upgrade Safety Checklist

- [ ] Use `contractUpgradeParamsToBytes` to derive exact bytes to sign.
- [ ] Sign with **application = \"swap-v1\"** and **chain‑specific domain**.
- [ ] Respect `minimumContractUpgradeDelay ≥ 2 days`.
- [ ] Bump `currentNonce` once per executed admin message.
- [ ] Verify new implementation with `proxiableUUID` before executing.

See [Solidity Contracts](../reference/solidity/index.md) for error types and admin methods, and [Operations → Upgrades](../operations/deployment.md#upgrades) for runbooks.
```
./reference/js/clients.md
```
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

```
./reference/js/troubleshooting.md
```
---
title: Troubleshooting (JS)
---

# Troubleshooting & FAQ

## Troubleshooting Cheatsheet

**Symptom:** Swap write reverted with an unhelpful error string.
**Cause:** The revert reason wasn’t decoded.
**Fix:** Simulate and decode revert data like `throwOnError` does to surface the specific contract error. 

---

**Symptom:** `requestId` is undefined after `swap`.
**Cause:** The `SwapRequested` event wasn’t found in the receipt logs.
**Fix:** Ensure the Router ABI matches the deployed contract and that the event is emitted; the client parses that event to extract the id. 

---

**Symptom:** Fee values look off by powers of ten.
**Cause:** Mixing JS `number`/string with 18‑dp `bigint` amounts.
**Fix:** Convert inputs with `rusdFromString`/`rusdFromNumber` and format outputs with `rusdToString`. 

---

**Symptom:** Increasing fee has no effect.
**Cause:** The request is already fulfilled/executed.
**Fix:** Check `fetchStatus(requestId).executed` and `fetchReceipt(requestId).fulfilled` before calling `updateFee`. 

---

## Frequently Asked Questions

### What units do `amount` and `fee` use?

Both are 18‑decimal fixed‑point bigints (e.g., `100n` means 100 wei‑RUSD, i.e., 1e-16 RUSD). Comments in the type definitions clarify this. 

### Does `rusdToString` round?

No—output is truncated to the requested decimals; more than 18 requested decimals are clamped to 18. 

### How is `requestId` obtained?

The client parses the `SwapRequested` event from the transaction receipt and returns its `requestId` argument. 

### What’s the difference between `executed` and `fulfilled`?

`executed` in `SwapRequestParameters` indicates solver execution; `fulfilled` in the receipt indicates destination chain settlement.
```
./reference/js/helpers.md
```
---
title: Helpers
---

```
# Helpers

- `rusdFromString(s: string): bigint`
- `rusdFromNumber(n: number): bigint`
- `rusdToString(a: bigint, dp?: number): string`
- `parseEventLog(...)`
- `withRetries(fn, opts)`
```
```
./reference/js/index.md
```
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
```
./reference/js/interfaces.md
```
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
```
./reference/js/guiding-principles.md
```
---
title: Guiding Principles
---

# Guiding Principles

> Use viem’s `PublicClient` (reads) and `WalletClient` (writes) against the same chain; keep chain configuration consistent between both.
>
> Treat all token values as 18‑decimal fixed‑point integers (bigint). Convert inputs with `rusdFromString`/`rusdFromNumber` and format for UI with `rusdToString`.
>
> Always approve the Router as spender before calling a swap; the `swap` path performs an approval of `amount + fee` for safety.
>
> Use `fetchRecommendedFee` to seed a reasonable `fee`, then update with `updateFee` if network conditions change. Units are RUSD (18 dp).
>
> After sending a swap, rely on the emitted `SwapRequested` event to obtain `requestId`; handle the edge case where no event is found.
>
> Differentiate status on source chain (`fetchStatus`) vs. fulfillment on destination chain (`fetchReceipt`); `executed` (status) vs. `fulfilled` (receipt) mean different things.
>
> For clearer error messages on failed writes, simulate and decode revert data (as done by `throwOnError`) instead of surfacing generic failures.

## Design Notes

This page distills patterns from the TypeScript sources and tests. Contracts and router interactions come from `onlyswaps-js` router client; RUSD client and 18‑dp helpers from the same package; request/receipt types from the model; integration usage patterns from tests. The structure aims to keep code identifiers authoritative while adding practical guidance.

```
./reference/js/types.md
```
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
```
./reference/rust-solver/workflows.md
```
---
title: Common Workflows
---

# Common Workflows

## local-two-anvil-e2e

Spin up two Anvil chains, deploy contracts, run solver, and request a swap end‑to‑end.

1. Start two Anvil nodes with block time: `anvil --port 1337 --chain-id 1337 --block-time 3` and `anvil --port 1338 --chain-id 1338 --block-time 3`.
2. Deploy solidity contracts to both chains using Forge scripts (see project README).
3. Run solver with local config and a dev private key.
4. Trigger a swap using a helper script and observe logs.

```bash
anvil --port 1337 --chain-id 1337 --block-time 3
anvil --port 1338 --chain-id 1338 --block-time 3

# ... deploy contracts per README ...

cargo run -- --config-path ./config-local.json --private-key 0x59c6...
./request-swap.sh 1337 1338
```

> Notes: See the Solidity README for exact Forge commands and env vars.

## docker-build-run

Build the container image and run with a baked config.

1. `docker build .`
2. `docker run -p 8080:8080 -e SOLVER_PRIVATE_KEY=... onlyswaps-solver`

> Notes: Runtime image copies `config-default.json` and sets entrypoint accordingly.

## healthcheck

Probe liveness over HTTP.

1. Start the solver (or the API server in isolation).
2. `curl http://127.0.0.1:8080/health`  # returns `ok`

```
./reference/rust-solver/network.md
```
---
title: Chain Connectivity & State
---

# Chain Connectivity & State

## Network&lt;P&gt;

> Network wrapper over an Alloy provider with contract bindings and helpers.

### Definition

```rust
pub struct Network<P> {
    pub chain_id: u64,
    pub provider: P,
    pub router: Router,
    pub token: ERC20FaucetToken,
}
```

### Guidance

* Keep per-chain instances stateless aside from provider/contract handles.
* Clone cheaply for concurrent use.

### Example

```rust
let net = Network::new(1337, provider, router, token)?;
```

## Network::create_many

> Factory that builds a map of `chain_id -> Network`.

### Definition

```rust
pub fn create_many<P>(cfgs: &[NetworkConfig]) -> eyre::Result<HashMap<u64, Network<P>>> {
    // iterate cfgs, create providers & bindings
    // ...
}
```

### Guidance

* Fail fast on any invalid config; return an error rather than partial sets.

### Example

```rust
let nets = Network::create_many(&config.networks)?;
```

## Network::new

> Constructs a single `Network` from config.

### Definition

```rust
pub fn new<P>(cfg: &NetworkConfig) -> eyre::Result<Network<P>> {
    // validate addresses, build ProviderBuilder ws client, attach wallet
    // ...
}
```

### Guidance

* Prefer WS transport and shared retry/backoff configuration.

### Example

```rust
let net = Network::new(&cfg)?;
```

## stream_block_numbers

> Streams new block numbers for this network (WS subscription).

### Definition

```rust
pub async fn stream_block_numbers(&self) -> impl Stream<Item = u64> {
    // WS subscribe to newHeads; map to block numbers
    // ...
}
```

### Guidance

* Reconnect gracefully on dropped subscriptions; surface as an error to terminate App if desired.

### Example

```rust
let mut s = net.stream_block_numbers().await;
```

## impl_ChainStateProvider_for_Network&lt;DynProvider&gt;

> Implementation of `ChainStateProvider` using `Network<DynProvider>`.

### Definition

```rust
#[async_trait]
impl ChainStateProvider for Network<DynProvider> {
    async fn fetch_state(&self, chain_id: u64) -> eyre::Result<ChainState> {
        // query token/native balance, router state, unfulfilled requests
        // ...
    }
}
```

### Guidance

* Fetch token & native balances and router parameters atomically per block.

### Example

```rust
let cs = network.fetch_state(1337).await?;
```
```
./reference/rust-solver/api.md
```
---
title: HTTP Health Server
---

# HTTP Health Server

## ApiServer

> Thin Axum-based HTTP server exposing `/health`.

### Definition

```rust
pub struct ApiServer {
    pub addr: SocketAddr,
}
```

### Guidance

* Keep the surface minimal and unauthenticated for liveness checks.

### Example

```rust
let api = ApiServer::new("127.0.0.1:8080".parse()?);
```

## ApiServer::new

> Constructs the server with bind address.

### Definition

```rust
pub fn new(addr: SocketAddr) -> Self {
    ApiServer { addr }
}
```

### Guidance

* Accept address from CLI arg `--port` or env for container runs.

### Example

```rust
let api = ApiServer::new(([127,0,0,1], 8080).into());
```

## ApiServer::start

> Starts the Axum server and serves routes.

### Definition

```rust
pub async fn start(self) -> eyre::Result<()> {
    // axum::serve(...).await
    Ok(())
}
```

### Guidance

* Run alongside `App` using `tokio::select!` to handle shutdown signals.

### Example

```rust
api.start().await?;
```

## GET_/health

> Health route returning `200 ok`.

### Definition

```rust
pub async fn get_health() -> &'static str { "ok" }
```

### Guidance

* Use for container liveness/readiness probes.

### Example

```bash
curl http://127.0.0.1:8080/health
```
```
./reference/rust-solver/orchestration.md
```
---
title: App & Main Orchestration
---

# App & Main Orchestration

## App::start

> Multiplexes block streams across chains, solves, and executes trades; exits if stream ends.

### Definition

```rust
impl App {
    pub async fn start(networks: std::collections::HashMap<u64, Network<alloy::providers::DynProvider>>) -> eyre::Result<()> {
        /* see source */
    }
}
```

### Guidance

* Combine streams via `select_all` and drive one solve per incoming `BlockEvent`.
* Use `moka` TTL cache (~30s) to avoid duplicate executions while pending.

### Example

```rust
// App::start(networks).await?;
```

## main_async

> Process entrypoint wiring CLI, config, networks, HTTP server, and signals.

### Definition

```rust
#[tokio::main]
async fn main() -> eyre::Result<()> { /* see source */ }
```

### Guidance

* Use `tokio::select!` to race App, API server, and signal receivers; shut down cleanly on SIGINT/SIGTERM.

### Example

```bash
cargo run -- --config-path ./config-local.json --private-key 0x<hex>
```
```
./reference/rust-solver/model.md
```
---
title: Domain Model
---

# Domain Model

## ChainState

> Snapshot of chain balances and router parameters used for solving.

### Definition

```rust
pub struct ChainState {
    pub chain_id: u64,
    pub token_balance: U256,
    pub native_balance: U256,
    pub params: SwapRequestParameters,
}
```

### Guidance

* Keep as a single immutable snapshot per block height.

### Example

```rust
let cs = ChainState { chain_id: 1337, token_balance: U256::ZERO, native_balance: U256::ZERO, params };
```

## Trade

> A candidate relay operation against Router/ERC20.

### Definition

```rust
pub struct Trade {
    pub request_id: B256,
    pub amount: U256,
    pub fee: U256,
}
```

### Guidance

* Ensure fee > 0 and sufficient balances before emitting.

### Example

```rust
let t = Trade { request_id, amount: 100.into(), fee: 1.into() };
```

## SwapRequestParameters

> Source-chain parameters and execution status.

### Definition

```rust
pub struct SwapRequestParameters {
    pub requester: Address,
    pub recipient: Address,
    pub token_address: Address,
    pub amount: U256,
    pub solver_fee: U256,
    pub verification_fee: U256,
    pub executed: bool,
}
```

### Guidance

* Use to track fee and execution status across retries.
```
./reference/rust-solver/troubleshooting.md
```
---
title: Troubleshooting (Solver)
---

# Troubleshooting & FAQ

## Troubleshooting Cheatsheet

* **Symptom:** stream of blocks ended unexpectedly
  **Cause:** WS subscription terminated or provider dropped.
  **Fix:** Restart process or reconnect provider; ensure WS endpoint stability
* **Symptom:** error approving trade: `<e>`
  **Cause:** Allowance/nonce/RPC issue during ERC20 approve.
  **Fix:** Retry after TTL; check signer funds and network gas estimation
* **Symptom:** No trades produced despite pending transfers
  **Cause:** Preconditions failed (fee==0, token mismatch, insufficient dest balance, already fulfilled).
  **Fix:** Inspect solver rules and chain state fields; correct config or balances

## Frequently Asked Questions

### Why maintain an in‑flight cache if trades are idempotent?

To avoid redundant relay attempts while previous txs are pending or reorged; entries expire after ~30s TTL

### Can I add more chains dynamically?

Not at runtime in this design; build the `networks` map upfront via `Network::create_many` before constructing the solver

### Where do Router parameters come from?

From on‑chain queries via generated bindings (`getUnfulfilledSolverRefunds`, `getSwapRequestParameters`).
```
./reference/rust-solver/executor.md
```
---
title: Trade Execution
---

# Trade Execution

## TradeExecutor&lt;P&gt;

> Executes approved `Trade`s against Router/ERC20 with a signer.

### Definition

```rust
pub struct TradeExecutor<P> {
    pub provider: P,
    pub wallet: Wallet,
}
```

### Guidance

* Separate construction from execution; allows mocking in tests.

### Example

```rust
let exec = TradeExecutor::new(provider, wallet);
```

## TradeExecutor::new

> Creates a new executor with provider and wallet/signer.

### Definition

```rust
pub fn new<P>(provider: P, wallet: Wallet) -> Self {
    // ...
}
```

### Guidance

* Validate signer chain and nonce space before first execution.

### Example

```rust
let exec = TradeExecutor::new(provider, wallet);
```

## TradeExecutor::execute

> Approves and calls Router to perform the relay; idempotent under TTL caching.

### Definition

```rust
pub async fn execute(&self, trade: &Trade) -> eyre::Result<TxHash> {
    // approve if needed, then call router with request params
    // ...
}
```

### Guidance

* Retry on nonce errors with backoff; rely on external TTL cache to avoid duplicates.

### Example

```rust
let tx = exec.execute(&trade).await?;
```
```
./reference/rust-solver/api-ref.md
```
---
title: API Reference
---

# API Reference

This directory contains the structured reference for onlyswaps-solver, organized by module.

Contents:

- [CLI & Configuration](./config.md)
- [Domain Model](./model.md)
- [Solving Engine](./solver.md)
- [Chain Connectivity & State](./network.md)
- [Trade Execution](./executor.md)
- [HTTP Health Server](./api.md)
- [On-chain Bindings](./eth.md)
- [Utilities](./util.md)
- [App & Main Orchestration](./orchestration.md)
```
./reference/rust-solver/solver.md
```
---
title: Solving Engine
---

# Solver

## Solver

> Thin wrapper around a `ChainStateProvider` that applies rules to derive trades.

### Definition

```rust
pub struct Solver<P> {
    pub provider: P,
}
```

### Guidance

* Keep `Solver` generic over providers for easy testing/mocking.

### Example

```rust
let solver = Solver { provider };
```

## Solver.fetch_state

> Helper that delegates to the underlying provider.

### Definition

```rust
impl<P: ChainStateProvider> Solver<P> {
    pub async fn fetch_state(&self, chain_id: u64) -> eyre::Result<ChainState> {
        self.provider.fetch_state(chain_id).await
    }
}
```

### Guidance

* Keep `Solver` thin; avoid embedding provider-specific logic here.

### Example

```rust
let snapshot = solver.fetch_state(1337).await?;
```

## calculate_trades

> Pure function applying solver rules to derive trades.

### Definition

```rust
pub fn calculate_trades(src: &ChainState, dest: &ChainState) -> Vec<Trade> {
    // apply rules: fee > 0, token match, dest has balance, not already fulfilled
    // ...
    vec![]
}
```

### Guidance

* Validate all preconditions before producing a `Trade`.
* Make it deterministic and unit-testable with fixed `ChainState` fixtures.

### Example

```rust
let trades = calculate_trades(&src, &dst);
```

## solve

> High-level entry that pulls snapshots and emits trades for execution.

### Definition

```rust
pub async fn solve<P: ChainStateProvider>(
    solver: &Solver<P>,
    src_chain: u64,
    dst_chain: u64
) -> eyre::Result<Vec<Trade>> {
    // fetch state, apply rules, return trades
    Ok(vec![])
}
```

### Guidance

* Always fetch a fresh snapshot per block; do not reuse across heights.
* Surface errors with context; fail early on invariant violations.

### Example

```rust
let trades = solve(&solver, 1337, 1338).await?;
```
```
./reference/rust-solver/config.md
```
---
title: CLI & Configuration
---

# CLI & Configuration

## CliArgs

> Command-line arguments for configuring the solver process (config path, private key, port).

### Definition

```rust
#[derive(Parser, Debug)]
pub(crate) struct CliArgs {
    #[arg(short = 'c', long = "config-path", env = "SOLVER_CONFIG_PATH", default_value = "~/.solver/config.json")]
    pub config_path: String,
    #[arg(short = 's', long = "private-key", env = "SOLVER_PRIVATE_KEY")]
    pub private_key: String,
    #[arg(short = 'p', long = "port", env = "SOLVER_PORT", default_value = "8080")]
    pub port: u16,
}
```

### Guidance

* Load secrets from env for non-interactive runs; clap already wires `SOLVER_*` variables.
* Keep the port small and the health route unauthenticated; process-level signals handle shutdown.

### Example

```rust
use clap::Parser;
use onlyswaps_solver::config::CliArgs;

fn main() {
    let args = CliArgs::parse();
    println!("config: {}, port: {}", args.config_path, args.port);
}
```

## ConfigFile

> Top-level JSON config holding a list of networks to connect to.

### Definition

```rust
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct ConfigFile {
    pub networks: Vec<NetworkConfig>,
}
```

### Guidance

* Validate addresses before boot to fail fast on typos; `Network::new` will parse/validate.
* Keep per-chain settings small: ws URL + token/router addresses + chain id.

### Example

```json
{ "networks": [{
  "chain_id": 1337,
  "rpc_url": "ws://127.0.0.1:1337",
  "rusd_address": "0x0000000000000000000000000000000000000001",
  "router_address": "0x0000000000000000000000000000000000000002"
}] }
```

## NetworkConfig

> Per-network connection and contract addresses.

### Definition

```rust
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct NetworkConfig {
    pub chain_id: u64,
    pub rpc_url: String,
    pub rusd_address: Address,
    pub router_address: Address,
}
```

### Guidance

* Keep `rpc_url` using WS for subscriptions.
* `rusd_address` and `router_address` must match deployments per chain; use checksum format in JSON.

### Example

```rust
use alloy::primitives::Address;

let nc = NetworkConfig {
    chain_id: 1337,
    rpc_url: "ws://127.0.0.1:1337".into(),
    rusd_address: Address::ZERO,
    router_address: Address::ZERO,
};
```

## load_config_file

> Reads and deserializes the JSON config file, expanding `~` and panicking on error.

### Definition

```rust
pub(crate) fn load_config_file(cli: &CliArgs) -> ConfigFile {
    println!("loading config file {}", cli.config_path);
    match fs::read(tilde(&cli.config_path).into_owned()) {
        Ok(contents) => serde_json::from_slice(&contents)
            .unwrap_or_else(|_| panic!("failed to parse config file at {}", cli.config_path)),
        Err(err) => panic!("failed to read config file at {}: {:?}", cli.config_path, err.to_string()),
    }
}
```

### Guidance

* Prefer failing fast on invalid JSON; run a JSON schema check in CI if configs are shared.
* Consider surfacing errors as `eyre::Result<ConfigFile>` if embedding in larger processes.

### Example

```rust
let cfg = load_config_file(&CliArgs { /* ... */ });
assert!(!cfg.networks.is_empty());
```

```
./reference/rust-solver/index.md
```
---
title: Rust Solver Reference
---

# Rust Solver Reference

Public types and modules for building and operating the OnlySwaps solver.

> Library version: 0.1.0 (spec 0.3.0, generated 2025-09-23)

Modules:

- [Network](network.md) — provider and chain bindings.
- [Model](model.md) — domain types (Request, Status, Transfer).
- [Executor](executor.md) — sending approvals/transfers.
- [Solver](solver.md) — orchestration loop.
- [Eth](eth.md) — Ethereum types and helpers.
- [Config](config.md) — CLI & JSON configuration.
- [API Server](api.md) — health and admin endpoints.
- [Orchestration](orchestration.md) — lifecycle management.

```
./reference/rust-solver/eth.md
```
---
title: On‑chain Bindings (alloy::sol!)
---

# On‑chain Bindings (alloy::sol!)

## ERC20FaucetToken

> Generated binding for ERC20 test token with faucet/mint helpers.

### Definition

```rust
alloy::sol! {
    contract ERC20FaucetToken { /* ... */ }
}
```

### Guidance

* Use in local dev to mint balances for testing cross-chain flows.

### Example

```rust
let bal = token.balanceOf(addr).call().await?;
```

## Router

> Generated binding for on-chain Router contract supplying swap parameters and refunds.

### Definition

```rust
alloy::sol! {
    contract Router { /* ... */ }
}
```

### Guidance

* Call `getUnfulfilledSolverRefunds` and `getSwapRequestParameters` to drive solver inputs.

### Example

```rust
let params = router.getSwapRequestParameters(rid).call().await?;
```
```
./reference/rust-solver/util.md
```
---
title: Utilities
---

# Utilities

## normalise_chain_id

> Helper to convert EVM `U256` chain ids into `u64` consistently across the codebase.

### Definition

```rust
pub fn normalise_chain_id(id: U256) -> u64 {
    id.try_into().unwrap_or_default()
}
```

### Guidance

* Apply at module boundaries to avoid mismatched types in maps and logs.

### Example

```rust
let cid = normalise_chain_id(U256::from(1337));
```
```
./reference/solidity/workflows.md
```
---
title: Common Workflows
---

# Common Workflows

## Deploy validators and Router behind UUPS

1. Deploy BN254 swap‑request validator with application='swap-v1'.
2. Deploy BN254 upgrade validator with application='upgrade-v1'.
3. Deploy Router implementation via CREATE2, then UUPSProxy, then call initialize(owner, swapBLS, upgradeBLS, feeBps).
4. Persist addresses to JSON (`DEPLOYMENT_CONFIG_DIR/<chainId>.json`) for later scripts.

## Configure Router for a destination chain and token mapping

1. permitDestinationChainId(dstChainId) as ADMIN.
2. setTokenMapping(dstChainId, dstToken, srcToken). Reverts if chain not permitted or mapping exists.

## Form a swap message and relay/settle

1. On source chain, after SwapRequested, call swapRequestParametersToBytes(requestId, solver) to get message/g1Bytes.
2. Sign g1Bytes with solver’s BN254 key.
3. On dest chain, relayTokens(tokenDst, recipient, amount, requestId, srcChainId).
4. On source chain, rebalanceSolver(solver, requestId, sigBytes) to settle fees.

## Schedule → execute a UUPS upgrade

1. Compute message via contractUpgradeParamsToBytes('schedule', pendingImpl, newImpl, calldata, T, nonce).
2. Sign off‑chain (BN254) and call scheduleUpgrade(..., signature). Enforce T ≥ now + minimumContractUpgradeDelay.
3. After timestamp passes, call executeUpgrade(). Verify new getImplementation() and Router.getVersion().

## Update BLS validators (admin)

1. Build validator‑update message via blsValidatorUpdateParamsToBytes(newValidator, nonce).
2. Sign and call setContractUpgradeBlsValidator(newValidator, signature) or Router.setSwapRequestBlsValidator(...) as applicable.

## Withdraw verification fees

1. Call withdrawVerificationFee(token, to) as ADMIN; reverts if balance is zero. Track per‑token balances off‑chain.
```
./reference/solidity/uups-proxy.md
```
---
title: UUPS Proxy
---

# UUPSProxy

> Minimal ERC1967 UUPS proxy with implementation introspection helper.

## Definition

```solidity
contract UUPSProxy is ERC1967Proxy {
    constructor(address _implementation, bytes memory _data)
        ERC1967Proxy(_implementation, _data) {}

    function getImplementation() external view returns (address) {
        return _implementation();
    }
}
```

## Usage Guidance

- Use `upgradeToAndCall` on the proxy’s implementation logic (via UUPS) from the authorized upgrader when executing upgrades.
- `getImplementation` is a convenience view to introspect the current implementation for audits and CI checks.

```
./reference/solidity/router.md
```
---
title: Router
---

# Router

Upgradeable cross‑chain swap router with BLS‑gated admin ops and scheduled upgrades.

## Definition

```solidity
// Key external/public API distilled from Router.sol
contract Router is IRouter, ScheduledUpgradeable, AccessControlEnumerableUpgradeable, ReentrancyGuard {
    // Roles & fee constants
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant BPS_DIVISOR = 10_000;
    uint256 public constant MAX_FEE_BPS = 5_000;

    // Config
    uint256 public verificationFeeBps;
    ISignatureScheme public swapRequestBlsValidator;

    // Initialization
    function initialize(
      address _owner,
      address _swapRequestBlsValidator,
      address _contractUpgradeBlsValidator,
      uint256 _verificationFeeBps
    ) public initializer;

    // Admin: destination chains & token mappings
    function permitDestinationChainId(uint256 chainId) external;
    function blockDestinationChainId(uint256 chainId) external;
    function setTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
    function removeTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
    function withdrawVerificationFee(address token, address to) external;

    // BLS validator admin (overrides ScheduledUpgradeable)
    function setContractUpgradeBlsValidator(address _contractUpgradeBlsValidator, bytes calldata signature) public override;

    // Upgrades (ScheduledUpgradeable overrides)
    function scheduleUpgrade(address newImplementation, bytes calldata data, uint256 upgradeTime, bytes calldata signature) public override;
    function cancelUpgrade(bytes calldata signature) public override;
    function executeUpgrade() public override;

    // Versioning
    function getVersion() public pure returns (string memory);
}
```

## Usage Guidance

* Use deploy-time `initialize(owner, swapBLS, upgradeBLS, feeBps)` and restrict admin methods with AccessControl.
* Always compute and sign domain‑separated messages for schedule/cancel/update operations; signatures must match BN254 domain.
* Permit destination chain IDs and map token pairs before initiating swaps; Router enforces `allowedDstChainIds` & mapping existence.
* Use custom errors (ErrorsLib) for precise reverts and assert those in tests; assert upgrade invariants using `getVersion()`.
* Keep Router behind UUPS proxy; verify current implementation via `getImplementation()` when executing upgrades.

## Example (JS upgrade scheduling)

```javascript
import { ethers } from "ethers";
const abi = [
  "function scheduleUpgrade(address,bytes,uint256,bytes)",
  "function executeUpgrade()",
  "function getScheduledUpgrade() view returns (address,bytes,uint256,uint256)"
];
const sc = new ethers.Contract(process.env.ROUTER_PROXY, abi, new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(process.env.RPC_URL)));
// ... build message via contractUpgradeParamsToBytes, sign off‑chain ...
await (await sc.scheduleUpgrade(process.env.NEW_IMPL, "0x", BigInt(process.env.TS), process.env.SIG)).wait();
const [impl,, when] = await sc.getScheduledUpgrade();
console.log("Pending:", impl, "at", when.toString());
// after time:
await (await sc.executeUpgrade()).wait();
```
```
./reference/solidity/support.md
```
---
title: Troubleshooting & FAQ
---

# Troubleshooting & FAQ

## Troubleshooting Cheatsheet

**BLSSignatureVerificationFailed**

- **Cause:** Wrong domain (application), incorrect message bytes, or mismatched public key/curve order.
- **Fix:** Recreate message via helper (…ParamsToBytes), confirm chainId/DST, sign with BN254, and pass exact sig bytes. 

**SameVersionUpgradeNotAllowed**

- **Cause:** New implementation’s getVersion() equals current Router version.
- **Fix:** Deploy a new implementation that returns a different version; tests validate this behavior.  

**UpgradeTimeMustRespectDelay / UpgradeDelayTooShort**

- **Cause:** Scheduled timestamp earlier than minimumContractUpgradeDelay or initializing with < 2 days.
- **Fix:** Use now + delay + ε; keep minimum delay ≥ 2 days at init. 

**DestinationChainIdNotSupported / TokenMappingAlreadyExists**

- **Cause:** Missing permit for chain ID or duplicate token mapping.
- **Fix:** Call permitDestinationChainId first; check mapping existence before setting. 

**AccessControlUnauthorizedAccount**

- **Cause:** Non‑admin calling admin‑only method.
- **Fix:** Ensure ADMIN role; use onlyAdmin‑protected entrypoints.

## Frequently Asked Questions (FAQ)

**Is Router upgradeable and how is authorization enforced?**

Yes. Router inherits ScheduledUpgradeable (UUPS). Schedule/execute are authorized via BN254 BLS signatures with domain separation.

**What’s the default minimum upgrade delay?**

Two days by default; attempts below this revert. Adjust via setMinimumContractUpgradeDelay. 

**Where do I get the message to sign for upgrades or validator updates?**

Call contractUpgradeParamsToBytes or blsValidatorUpdateParamsToBytes and sign the returned G1 bytes off‑chain. 

**How do I map tokens across chains?**

As ADMIN, call permitDestinationChainId(dstChainId) then setTokenMapping(dstChainId, dstToken, srcToken).
```
./reference/solidity/index.md
```
---
title: Solidity Contracts Reference
---

# Solidity Reference

Contracts, interfaces, and admin entry points for the OnlySwaps Router stack.

> Library version: 1.0.0 (spec 0.3.0, generated 2025-09-22)

- [Router](router.md) — user entry points, events, and admin methods.
- [ScheduledUpgradeable](scheduled-upgradeable.md) — UUPS + timelock + BLS gating.
- [Interfaces](interfaces.md) — IRouter, IScheduledUpgradeable, and others.
- [Workflows](workflows.md) — common admin/ops tasks.
- [Support](support.md) — FAQs and known issues.
```
./reference/solidity/interfaces.md
```
---
title: Interfaces
---

### Interfaces

IRouter, IScheduledUpgradeable, IERC20‑like helpers.
```
./reference/solidity/scheduled-upgradeable.md
```
---
title: ScheduledUpgradeable (UUPS + BLS)
---

# ScheduledUpgradeable (UUPS + BLS)

Abstract base for time‑locked UUPS upgrades with BLS (BN254) gating and replay‑safe nonces.

## Definition (selected overrides)

```solidity
abstract contract ScheduledUpgradeable is IScheduledUpgradeable, Initializable, UUPSUpgradeable {
    // State
    uint256 public currentNonce;

    // Upgrades
    function scheduleUpgrade(address newImplementation, bytes calldata data, uint256 upgradeTime, bytes calldata signature) public virtual;
    function cancelUpgrade(bytes calldata signature) public virtual;
    function executeUpgrade() public virtual;
}
```

## Usage Guidance

- Enforce domain separation for BLS signatures and increment nonces per action.
- Respect `minimumContractUpgradeDelay` (≥ 2 days recommended).
- Verify scheduled upgrade via `getScheduledUpgrade()` and confirm version post‑execution with `getVersion()`.

## Example (JS)

```javascript
const abi = [
  "function scheduleUpgrade(address,bytes,uint256,bytes)",
  "function executeUpgrade()",
  "function getScheduledUpgrade() view returns (address,bytes,uint256,uint256)"
];
// see Router example for usage
```
```
