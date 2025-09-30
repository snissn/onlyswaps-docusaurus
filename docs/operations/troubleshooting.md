---
title: Operations Troubleshooting
---

# Troubleshooting (Ops)

Common symptoms and fixes across the stack.

- **WS stream ended unexpectedly** → Provider drop. Reconnect and consider backoff; alert on churn.
- **Approve reverted** → Missing allowance or wrong nonce. Retry after TTL; verify signer funds.
- **No trades produced** → Preconditions failed (fee = 0, token mismatch, insufficient dest balance). Check mappings and balances.

See component‑specific pages:
- [Solver Troubleshooting](../reference/rust-solver/troubleshooting.md)
- [JS Troubleshooting](../reference/js/troubleshooting.md)
- [Solidity Support](../reference/solidity/support.md)
