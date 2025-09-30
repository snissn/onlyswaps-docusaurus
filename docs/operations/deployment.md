---
title: Deployment & Upgrades
---

# Deployment & Upgrades

This runbook covers deploying contracts, publishing artifacts, and rolling out solver/SDK.

## Deploy contracts

1. Deploy **Router** implementation and **UUPS** proxy on each chain.
2. Register **BLS validator** for `swap-v1`.
3. Configure **destination chains** and **token mappings**.

## Schedule an upgrade

1. Derive bytes with `contractUpgradeParamsToBytes`.
2. Collect BLS signature from the authorized key holder.
3. Call `scheduleUpgrade(...)` (admin) with ETA ≥ `minimumContractUpgradeDelay`.
4. After ETA, **execute** the upgrade. Verify with `proxiableUUID`.

## Roll out the solver

- Deploy with **systemd**, **Kubernetes**, or your scheduler of choice.
- Expose `/healthz` and `/metrics`; set reasonable memory/CPU limits.
- Use **WS endpoints** for reads; keep **HTTP endpoints** for writes.

## Roll out the dApp

- Provide chain and Router addresses to the SDK.
- Pin ABI versions; watch release notes for breaking events.

See also: [Monitoring](monitoring.md), [Troubleshooting](troubleshooting.md).
