---
title: CLI & Configuration
---

```
# CLI & Configuration

## CliArgs

```rust
#[derive(Parser, Debug)]
pub(crate) struct CliArgs {
    #[arg(short = 'c', long = \"config-path\", env = \"SOLVER_CONFIG_PATH\", default_value = \"~/.solver/config.json\")]
    pub config_path: String,
    #[arg(short = 's', long = \"private-key\", env = \"SOLVER_PRIVATE_KEY\")]
    pub private_key: String,
...

```

## NetworkConfig

```rust
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct NetworkConfig {
    pub chain_id: u64,
    pub rpc_url: String,
    pub rusd_address: Address,
    pub router_address: Address,
}
```
```
