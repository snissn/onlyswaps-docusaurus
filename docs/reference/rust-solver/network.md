---
title: Chain Connectivity & State
---

# Chain Connectivity & State

## Network&lt;P&gt;

> Network wrapper over an Alloy provider with contract bindings and helpers.

### Definition

```rust
pub struct Network<P> {
    pub chain_id: u64,
    pub provider: P,
    pub router: Router,
    pub token: ERC20FaucetToken,
}
```

### Guidance

* Keep per-chain instances stateless aside from provider/contract handles.
* Clone cheaply for concurrent use.

### Example

```rust
let net = Network::new(1337, provider, router, token)?;
```

## Network::create_many

> Factory that builds a map of `chain_id -> Network`.

### Definition

```rust
pub fn create_many<P>(cfgs: &[NetworkConfig]) -> eyre::Result<HashMap<u64, Network<P>>> {
    // iterate cfgs, create providers & bindings
    // ...
}
```

### Guidance

* Fail fast on any invalid config; return an error rather than partial sets.

### Example

```rust
let nets = Network::create_many(&config.networks)?;
```

## Network::new

> Constructs a single `Network` from config.

### Definition

```rust
pub fn new<P>(cfg: &NetworkConfig) -> eyre::Result<Network<P>> {
    // validate addresses, build ProviderBuilder ws client, attach wallet
    // ...
}
```

### Guidance

* Prefer WS transport and shared retry/backoff configuration.

### Example

```rust
let net = Network::new(&cfg)?;
```

## stream_block_numbers

> Streams new block numbers for this network (WS subscription).

### Definition

```rust
pub async fn stream_block_numbers(&self) -> impl Stream<Item = u64> {
    // WS subscribe to newHeads; map to block numbers
    // ...
}
```

### Guidance

* Reconnect gracefully on dropped subscriptions; surface as an error to terminate App if desired.

### Example

```rust
let mut s = net.stream_block_numbers().await;
```

## impl_ChainStateProvider_for_Network&lt;DynProvider&gt;

> Implementation of `ChainStateProvider` using `Network<DynProvider>`.

### Definition

```rust
#[async_trait]
impl ChainStateProvider for Network<DynProvider> {
    async fn fetch_state(&self, chain_id: u64) -> eyre::Result<ChainState> {
        // query token/native balance, router state, unfulfilled requests
        // ...
    }
}
```

### Guidance

* Fetch token & native balances and router parameters atomically per block.

### Example

```rust
let cs = network.fetch_state(1337).await?;
```
