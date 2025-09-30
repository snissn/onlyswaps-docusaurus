---
title: CLI & Configuration
---

# CLI & Configuration

## CliArgs

> Command-line arguments for configuring the solver process (config path, private key, port).

### Definition

```rust
#[derive(Parser, Debug)]
pub(crate) struct CliArgs {
    #[arg(short = 'c', long = "config-path", env = "SOLVER_CONFIG_PATH", default_value = "~/.solver/config.json")]
    pub config_path: String,
    #[arg(short = 's', long = "private-key", env = "SOLVER_PRIVATE_KEY")]
    pub private_key: String,
    #[arg(short = 'p', long = "port", env = "SOLVER_PORT", default_value = "8080")]
    pub port: u16,
}
```

### Guidance

* Load secrets from env for non-interactive runs; clap already wires `SOLVER_*` variables.
* Keep the port small and the health route unauthenticated; process-level signals handle shutdown.

### Example

```rust
use clap::Parser;
use onlyswaps_solver::config::CliArgs;

fn main() {
    let args = CliArgs::parse();
    println!("config: {}, port: {}", args.config_path, args.port);
}
```

## ConfigFile

> Top-level JSON config holding a list of networks to connect to.

### Definition

```rust
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct ConfigFile {
    pub networks: Vec<NetworkConfig>,
}
```

### Guidance

* Validate addresses before boot to fail fast on typos; `Network::new` will parse/validate.
* Keep per-chain settings small: ws URL + token/router addresses + chain id.

### Example

```json
{ "networks": [{
  "chain_id": 1337,
  "rpc_url": "ws://127.0.0.1:1337",
  "rusd_address": "0x0000000000000000000000000000000000000001",
  "router_address": "0x0000000000000000000000000000000000000002"
}] }
```

## NetworkConfig

> Per-network connection and contract addresses.

### Definition

```rust
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct NetworkConfig {
    pub chain_id: u64,
    pub rpc_url: String,
    pub rusd_address: Address,
    pub router_address: Address,
}
```

### Guidance

* Keep `rpc_url` using WS for subscriptions.
* `rusd_address` and `router_address` must match deployments per chain; use checksum format in JSON.

### Example

```rust
use alloy::primitives::Address;

let nc = NetworkConfig {
    chain_id: 1337,
    rpc_url: "ws://127.0.0.1:1337".into(),
    rusd_address: Address::ZERO,
    router_address: Address::ZERO,
};
```

## load_config_file

> Reads and deserializes the JSON config file, expanding `~` and panicking on error.

### Definition

```rust
pub(crate) fn load_config_file(cli: &CliArgs) -> ConfigFile {
    println!("loading config file {}", cli.config_path);
    match fs::read(tilde(&cli.config_path).into_owned()) {
        Ok(contents) => serde_json::from_slice(&contents)
            .unwrap_or_else(|_| panic!("failed to parse config file at {}", cli.config_path)),
        Err(err) => panic!("failed to read config file at {}: {:?}", cli.config_path, err.to_string()),
    }
}
```

### Guidance

* Prefer failing fast on invalid JSON; run a JSON schema check in CI if configs are shared.
* Consider surfacing errors as `eyre::Result<ConfigFile>` if embedding in larger processes.

### Example

```rust
let cfg = load_config_file(&CliArgs { /* ... */ });
assert!(!cfg.networks.is_empty());
```

