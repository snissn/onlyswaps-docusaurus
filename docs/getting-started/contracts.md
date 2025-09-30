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
