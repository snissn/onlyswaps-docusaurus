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
