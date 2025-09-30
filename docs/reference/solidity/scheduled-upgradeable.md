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
