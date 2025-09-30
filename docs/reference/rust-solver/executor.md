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
