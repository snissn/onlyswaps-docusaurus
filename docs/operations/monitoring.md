---
title: Monitoring & Observability
---

# Monitoring & Observability

## Solver process

- **Liveness**: `/healthz` returns 200 when main loop runs.
- **Readiness**: `/readyz` exposes provider connectivity per chain.
- **Metrics** (suggested):
  - `onlyswaps_pending_requests` (gauge)
  - `onlyswaps_trades_executed_total` (counter)
  - `onlyswaps_execution_latency_seconds` (histogram)
  - `onlyswaps_ws_restarts_total` (counter)

## On‑chain

- Watch `SwapRequested` and `SwapFulfilled` rates.
- Alert on revert spikes and long‑pending requests.

## Logs

- Emit structured JSON; include `requestId`, `srcChain`, `dstChain`, and tx hashes.
- Sample log lines:
  - `request.new` / `request.fee.bump` / `execute.start` / `execute.ok` / `execute.err`.
