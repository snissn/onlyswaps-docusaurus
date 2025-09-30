---
title: Solver Operator Quickstart (Rust)
---

# Rust Solver Quickstart

Run a local solver against two dev chains to execute a full end‑to‑end swap.

## Prerequisites

- Rust toolchain (1.76+), `cargo`
- Two EVM nodes (e.g., **Anvil**) on ports **1337** and **1338**
- Deployed Router & RUSD contracts on both chains

## Launch test chains

```bash
anvil --port 1337 --chain-id 1337 --block-time 3
anvil --port 1338 --chain-id 1338 --block-time 3
```

## Configure the solver

Create `config-local.json`:

```json
{
  \"networks\": [
    {
      \"chain_id\": 1337,
      \"rpc_url\": \"ws://127.0.0.1:1337\",
      \"rusd_address\": \"0x...\",
      \"router_address\": \"0x...\"
    },
    {
      \"chain_id\": 1338,
      \"rpc_url\": \"ws://127.0.0.1:1338\",
      \"rusd_address\": \"0x...\",
      \"router_address\": \"0x...\"
    }
  ],
  \"api\": {
    \"bind\": \"127.0.0.1:8080\"
  }
}
```

## Run

```bash
cargo run --release -- --config-path ./config-local.json --private-key 0xYourDevKey
```

Watch logs for `SwapRequested` on 1337 and `SwapFulfilled` on 1338.

### Common workflows

- Restart after WS drop — solver reconnects providers automatically.
- Fee bump handling — solver re‑evaluates pending intents upon `updateFee`.

See the full [Solver API Reference](../reference/rust-solver/index.md) and [Troubleshooting](../reference/rust-solver/troubleshooting.md).
