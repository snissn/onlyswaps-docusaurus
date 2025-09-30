---
title: Router
---

### Router

```
# API Reference

## Core Contracts

### Router

> Upgradeable cross‑chain swap router with BLS‑gated admin ops and scheduled upgrades.

#### Definition

```solidity
// Key external/public API distilled from Router.sol
contract Router is IRouter, ScheduledUpgradeable, AccessControlEnumerableUpgradeable, ReentrancyGuard {
// Roles & fee constants
...
- **Fix:** Use now + delay + ε; keep minimum delay ≥ 2 days at init. 

**DestinationChainIdNotSupported / TokenMappingAlreadyExists**

- **Cause:** Missing permit for chain ID or duplicate token mapping.
- **Fix:** Call permitDestinationChainId first; check mapping existence before setting. 

**AccessControlUnauthorizedAccount**

- **Cause:** Non‑admin calling admin‑only method.
- **Fix:** Ensure ADMIN role; use onlyAdmin‑protected entrypoints.

## Frequently Asked Questions (FAQ)

**Is Router
```
