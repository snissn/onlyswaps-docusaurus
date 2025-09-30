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
