---
title: DevOps & Operator Quickstart
---

# Operations Quickstart

## Minimal production checklist

- [ ] Separate **read WS** and **write HTTP** RPC endpoints per chain.
- [ ] Configure solver **liveness** (`/healthz`) and **readiness** (`/readyz`) probes.
- [ ] Persist logs (JSON) and forward metrics.
- [ ] Pin Router proxy & implementation addresses in a manifest.
- [ ] Keep BLS key material in HSM or equivalent; **never** embed in code.

## Deploy sequence

1. Bring up chains/RPC infrastructure.
2. Deploy contracts and publish addresses/ABIs.
3. Roll out solver (blue/green).
4. Roll out front‑end with SDK config.

Continue to [Deployment Runbook](../operations/deployment.md).
