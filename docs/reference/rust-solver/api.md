---
title: HTTP API Server
---

```
# HTTP API

## ApiServer

> Small axum server exposing health/readiness endpoints.

### ApiServer::new

```rust
pub fn new(addr: SocketAddr) -> Self { ... }
```

### Endpoints

- `GET /healthz` → 200 when loop is alive
- `GET /readyz` → chain connectivity snapshot
```
