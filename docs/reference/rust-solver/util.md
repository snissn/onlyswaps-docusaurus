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
