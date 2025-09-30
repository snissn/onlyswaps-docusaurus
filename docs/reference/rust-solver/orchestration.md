---
title: Process Orchestration
---

```
# Orchestration

## run()

> Top‑level entry; wires config, networks, solver loop, and API server.

```rust
pub async fn run(args: CliArgs) -> eyre::Result<()> { ... }
```
```
