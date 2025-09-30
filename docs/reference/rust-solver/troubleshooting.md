---
title: Troubleshooting (Solver)
---

# Troubleshooting & FAQ

## Troubleshooting Cheatsheet

* **Symptom:** stream of blocks ended unexpectedly
  **Cause:** WS subscription terminated or provider dropped.
  **Fix:** Restart process or reconnect provider; ensure WS endpoint stability
* **Symptom:** error approving trade: `<e>`
  **Cause:** Allowance/nonce/RPC issue during ERC20 approve.
  **Fix:** Retry after TTL; check signer funds and network gas estimation
* **Symptom:** No trades produced despite pending transfers
  **Cause:** Preconditions failed (fee==0, token mismatch, insufficient dest balance, already fulfilled).
  **Fix:** Inspect solver rules and chain state fields; correct config or balances

## Frequently Asked Questions

### Why maintain an in‑flight cache if trades are idempotent?

To avoid redundant relay attempts while previous txs are pending or reorged; entries expire after ~30s TTL

### Can I add more chains dynamically?

Not at runtime in this design; build the `networks` map upfront via `Network::create_many` before constructing the solver

### Where do Router parameters come from?

From on‑chain queries via generated bindings (`getUnfulfilledSolverRefunds`, `getSwapRequestParameters`).
