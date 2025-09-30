---
title: ScheduledUpgradeable
---

### ScheduledUpgradeable

```
  ScheduledUpgradeable:
  kind: class
  summary: Abstract base for time‑locked UUPS upgrades with BLS (BN254) gating and replay‑safe nonces.
  definition:
  lang: solidity
  source: src/ScheduledUpgradeable.sol + IScheduledUpgradeable.sol.  &#x20;
  code: |
  abstract contract ScheduledUpgradeable is IScheduledUpgradeable, Initializable, UUPSUpgradeable {
  // State
  uint256 public currentNonce;
```
