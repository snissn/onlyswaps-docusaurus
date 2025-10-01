# OnlySwaps Docs

**OnlySwaps** is a solver‑based, cross‑chain token transfer protocol built on the dcipher network. It moves value from a **source chain** to a **destination chain** using an on‑chain orderbook (`Router`) for **swap requests**, off‑chain liquidity provided by **solvers**, and threshold signatures from a **dcipher committee** to verify completion and reimburse solvers. :contentReference[oaicite:0]{index=0}

Today OnlySwaps supports like‑for‑like ERC‑20 transfers across EVM chains (e.g., RUSD on Base → RUSD on Avalanche) with a roadmap to more exotic routes. :contentReference[oaicite:1]{index=1}

---

## Why OnlySwaps?

- **Devs first.** Typed JS & React hooks, zod schemas, and viem‑based clients make integration boringly straightforward. :contentReference[oaicite:2]{index=2}
- **Robust security.** Admin operations and upgrade paths are **BLS‑gated** and **time‑locked** via `ScheduledUpgradeable` (UUPS). Swap completion is verified by a dcipher committee via threshold signatures. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}
- **Market‑based fulfillment.** Solvers compete to fulfill requests and earn fees; a Fees API suggests competitive fees to users. :contentReference[oaicite:5]{index=5}

---

## Choose Your Path

- **Frontend/UI developers** → **[Quickstart: Build a Swap UI](./guides/quickstart-ui.md)**  
  Use `Wagmi` + `RainbowKit` and the `useOnlySwapsClient` / `useRusd` hooks to ship a cross‑chain swap flow. :contentReference[oaicite:6]{index=6}
- **Backend integrators & scripters** → **[Programmatic swaps with onlyswaps‑js](./guides/programmatic-js.md)**  
  Mint test tokens, approve spend, and initiate/track swaps using `OnlySwapsViemClient` & `RUSDViemClient`. :contentReference[oaicite:7]{index=7}
- **Smart‑contract teams & protocol admins** → **[Contract Integration & Upgrades](./guides/contract-integration-upgrades.md)**  
  Understand Router’s public API, scheduling BLS‑gated upgrades, token mappings, and errors. :contentReference[oaicite:8]{index=8}

---

## What’s Inside

- **Concepts**: roles (User, Solver, Committee), lifecycle, and core terminology. :contentReference[oaicite:9]{index=9}  
- **Guides**: end‑to‑end setups for UI, scripts, and admin workflows. :contentReference[oaicite:10]{index=10}  
- **Reference**: polished API pages for `onlyswaps‑ui`, `onlyswaps‑js`, and `onlyswaps/solidity`. :contentReference[oaicite:11]{index=11} :contentReference[oaicite:12]{index=12} :contentReference[oaicite:13]{index=13}

> **Note**  
> In this release, swaps are like‑for‑like per chain pair; additional routes are planned. :contentReference[oaicite:14]{index=14}

