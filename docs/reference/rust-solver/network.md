---
title: Chain Connectivity & State
---

```
# Chain Connectivity & State

## Network<P>

> Network wrapper over an Alloy provider with contract bindings and helpers.

### Definition

```rust
pub struct Network<P> {
    pub chain_id: u64,
    pub provider: P,
    pub router: Router,
    pub token: ERC20FaucetToken,
}
...

```

```rust
let mut s = net.stream_block_numbers().await;
```

## impl_ChainStateProvider_for_Network&lt;DynProvider&gt;

> Implementation of `ChainStateProvider` using `Network<DynProvider>`.

### Definition

```rust
#[async_trait]
impl ChainStateProvider for Network<DynProvider> {
    async fn fetch_state(&self, chain_id: u64) -> e
```
