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
