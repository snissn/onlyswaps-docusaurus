# OnlySwaps overview

## What is OnlySwaps?

OnlySwaps is a cross‑chain token transfer protocol and product suite built atop the dcipher network. It supports ERC‑20 tokens on EVM chains and provides a Router contract, a solver/verifier network, a fees recommendation API, and developer SDKs. :contentReference[oaicite:7]{index=7}

Key actors:

- User: initiates a swap request to move funds across chains. :contentReference[oaicite:8]{index=8}
- Solver: fulfills requests by paying on the destination chain in return for fees. :contentReference[oaicite:9]{index=9}
- dcipher committee member: participates in threshold verification; an aggregated BN254 BLS signature finalizes reimbursement on the source chain. :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11}

## What problems does it solve?

- Fast, like‑for‑like transfers: e.g., RUSD on Chain A → RUSD on Chain B, with no AMM slippage. (Non‑like pairs are on the roadmap.) :contentReference[oaicite:12]{index=12}
- Clear responsibilities: fulfillment by solvers, verification by committee, accounting by Router. :contentReference[oaicite:13]{index=13}
- Developer ergonomics: `onlyswaps-ui` hooks for React and `onlyswaps-js` for Node/servers. :contentReference[oaicite:14]{index=14} :contentReference[oaicite:15]{index=15}

## Who is OnlySwaps for?

- End users: use a web app (OnlyPortal) to request swaps, update fees, track status, cancel, and view solver details. :contentReference[oaicite:16]{index=16}
- Developers: build UIs with `onlyswaps-ui` or scripts/services with `onlyswaps-js`. :contentReference[oaicite:17]{index=17} :contentReference[oaicite:18]{index=18}
- Integrators/security auditors: work directly with the Router/IRouter, BLS validator, and UUPS upgrade flow. :contentReference[oaicite:19]{index=19} :contentReference[oaicite:20]{index=20}

## Product/SDKs at a glance

- Router (Solidity): upgradeable (UUPS), BLS‑gated admin, destination chain allow‑listing, token mapping, events for request/fulfillment, and verification fee accounting. :contentReference[oaicite:21]{index=21} :contentReference[oaicite:22]{index=22}
- `onlyswaps-js`: `OnlySwapsViemClient` (`swap`, `fetchRecommendedFee`, `updateFee`, `fetchStatus`, `fetchReceipt`) and `RUSDViemClient` (`mint`, `approveSpend`, `balanceOf`). All amounts are 18‑dp `bigint`. :contentReference[oaicite:23]{index=23} :contentReference[oaicite:24]{index=24}
- `onlyswaps-ui`: React hooks (`useOnlySwapsClient`, `useRusd`), chain config (`chainConfigs`, `supportedChains`, `supportedTransports`), and zod schemas (`SwapFormSchema`). :contentReference[oaicite:25]{index=25} :contentReference[oaicite:26]{index=26} :contentReference[oaicite:27]{index=27}

> Caveats (current release)  
> - Like‑for‑like token swaps only (e.g., RUSD↔RUSD across chains).  
> - Single committee today; envisioned marketplace of committees later.  
> - A single submitter uploads the aggregated signature; future releases may incentivize third‑party submitters. :contentReference[oaicite:28]{index=28}

