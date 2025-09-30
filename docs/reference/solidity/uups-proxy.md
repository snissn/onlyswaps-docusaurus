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

