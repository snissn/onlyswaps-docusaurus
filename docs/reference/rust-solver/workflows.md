---
title: Common Workflows
---

# Common Workflows

## local-two-anvil-e2e

Spin up two Anvil chains, deploy contracts, run solver, and request a swap end‑to‑end.

1. Start two Anvil nodes with block time: `anvil --port 1337 --chain-id 1337 --block-time 3` and `anvil --port 1338 --chain-id 1338 --block-time 3`.
2. Deploy solidity contracts to both chains using Forge scripts (see project README).
3. Run solver with local config and a dev private key.
4. Trigger a swap using a helper script and observe logs.

```bash
anvil --port 1337 --chain-id 1337 --block-time 3
anvil --port 1338 --chain-id 1338 --block-time 3

# ... deploy contracts per README ...

cargo run -- --config-path ./config-local.json --private-key 0x59c6...
./request-swap.sh 1337 1338
```

> Notes: See the Solidity README for exact Forge commands and env vars.

## docker-build-run

Build the container image and run with a baked config.

1. `docker build .`
2. `docker run -p 8080:8080 -e SOLVER_PRIVATE_KEY=... onlyswaps-solver`

> Notes: Runtime image copies `config-default.json` and sets entrypoint accordingly.

## healthcheck

Probe liveness over HTTP.

1. Start the solver (or the API server in isolation).
2. `curl http://127.0.0.1:8080/health`  # returns `ok`

