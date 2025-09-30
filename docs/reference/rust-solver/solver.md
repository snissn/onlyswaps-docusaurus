---
title: Solving Engine
---

# Solver

## Solver

> Thin wrapper around a `ChainStateProvider` that applies rules to derive trades.

### Definition

```rust
pub struct Solver<P> {
    pub provider: P,
}
```

### Guidance

* Keep `Solver` generic over providers for easy testing/mocking.

### Example

```rust
let solver = Solver { provider };
```

## Solver.fetch_state

> Helper that delegates to the underlying provider.

### Definition

```rust
impl<P: ChainStateProvider> Solver<P> {
    pub async fn fetch_state(&self, chain_id: u64) -> eyre::Result<ChainState> {
        self.provider.fetch_state(chain_id).await
    }
}
```

### Guidance

* Keep `Solver` thin; avoid embedding provider-specific logic here.

### Example

```rust
let snapshot = solver.fetch_state(1337).await?;
```

## calculate_trades

> Pure function applying solver rules to derive trades.

### Definition

```rust
pub fn calculate_trades(src: &ChainState, dest: &ChainState) -> Vec<Trade> {
    // apply rules: fee > 0, token match, dest has balance, not already fulfilled
    // ...
    vec![]
}
```

### Guidance

* Validate all preconditions before producing a `Trade`.
* Make it deterministic and unit-testable with fixed `ChainState` fixtures.

### Example

```rust
let trades = calculate_trades(&src, &dst);
```

## solve

> High-level entry that pulls snapshots and emits trades for execution.

### Definition

```rust
pub async fn solve<P: ChainStateProvider>(
    solver: &Solver<P>,
    src_chain: u64,
    dst_chain: u64
) -> eyre::Result<Vec<Trade>> {
    // fetch state, apply rules, return trades
    Ok(vec![])
}
```

### Guidance

* Always fetch a fresh snapshot per block; do not reuse across heights.
* Surface errors with context; fail early on invariant violations.

### Example

```rust
let trades = solve(&solver, 1337, 1338).await?;
```
