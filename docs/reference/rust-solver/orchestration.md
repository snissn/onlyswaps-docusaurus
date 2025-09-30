---
title: App & Main Orchestration
---

# App & Main Orchestration

## App::start

> Multiplexes block streams across chains, solves, and executes trades; exits if stream ends.

### Definition

```rust
impl App {
    pub async fn start(networks: std::collections::HashMap<u64, Network<alloy::providers::DynProvider>>) -> eyre::Result<()> {
        /* see source */
    }
}
```

### Guidance

* Combine streams via `select_all` and drive one solve per incoming `BlockEvent`.
* Use `moka` TTL cache (~30s) to avoid duplicate executions while pending.

### Example

```rust
// App::start(networks).await?;
```

## main_async

> Process entrypoint wiring CLI, config, networks, HTTP server, and signals.

### Definition

```rust
#[tokio::main]
async fn main() -> eyre::Result<()> { /* see source */ }
```

### Guidance

* Use `tokio::select!` to race App, API server, and signal receivers; shut down cleanly on SIGINT/SIGTERM.

### Example

```bash
cargo run -- --config-path ./config-local.json --private-key 0x<hex>
```
