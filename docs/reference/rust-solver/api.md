---
title: HTTP Health Server
---

# HTTP Health Server

## ApiServer

> Thin Axum-based HTTP server exposing `/health`.

### Definition

```rust
pub struct ApiServer {
    pub addr: SocketAddr,
}
```

### Guidance

* Keep the surface minimal and unauthenticated for liveness checks.

### Example

```rust
let api = ApiServer::new("127.0.0.1:8080".parse()?);
```

## ApiServer::new

> Constructs the server with bind address.

### Definition

```rust
pub fn new(addr: SocketAddr) -> Self {
    ApiServer { addr }
}
```

### Guidance

* Accept address from CLI arg `--port` or env for container runs.

### Example

```rust
let api = ApiServer::new(([127,0,0,1], 8080).into());
```

## ApiServer::start

> Starts the Axum server and serves routes.

### Definition

```rust
pub async fn start(self) -> eyre::Result<()> {
    // axum::serve(...).await
    Ok(())
}
```

### Guidance

* Run alongside `App` using `tokio::select!` to handle shutdown signals.

### Example

```rust
api.start().await?;
```

## GET_/health

> Health route returning `200 ok`.

### Definition

```rust
pub async fn get_health() -> &'static str { "ok" }
```

### Guidance

* Use for container liveness/readiness probes.

### Example

```bash
curl http://127.0.0.1:8080/health
```
