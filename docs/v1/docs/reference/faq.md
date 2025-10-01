# FAQ

**Which chains are supported?**  
The set is defined by `chainConfigs` and surfaced via `supportedChains`. Use those values; don’t assume mainnet/testnet coverage. :contentReference[oaicite:105]{index=105}

**Do I need to pass my own RPC URLs?**  
By default we provide `supportedTransports` with plain `http()` transports; you can substitute custom/transacted transports as needed. :contentReference[oaicite:106]{index=106}

**What units do `amount` and `fee` use?**  
18‑decimal fixed‑point `bigint` values (e.g., `100n` = 100.000000000000000000 RUSD). :contentReference[oaicite:107]{index=107}

**How do I format/parse amounts?**  
Use `rusdToString` (truncates, clamps >18 dp) and `rusdFromString`/`rusdFromNumber`. :contentReference[oaicite:108]{index=108}

**How is the request ID obtained?**  
From the `SwapRequested` event parsed out of the transaction receipt. Clients return `{ requestId }` after `swap`. :contentReference[oaicite:109]{index=109}

**What’s the difference between `executed` and `fulfilled`?**  
`executed` (source chain) reflects dcipher verification; `fulfilled` (destination chain) indicates the solver completed payment. Track both for end‑to‑end confirmation. :contentReference[oaicite:110]{index=110}

**Router upgradeability & authorization?**  
Router is UUPS‑upgradeable; upgrade/validator operations are BLS‑gated with domain separation and a minimum delay (default two days). :contentReference[oaicite:111]{index=111}

**Common admin pitfalls?**  
- Reverts like `DestinationChainIdNotSupported` or `TokenMappingAlreadyExists`: call `permitDestinationChainId` first and check mappings before setting.  
- `SameVersionUpgradeNotAllowed`: deploy a new implementation version before scheduling. :contentReference[oaicite:112]{index=112}

**Can I swap different assets (e.g., RUSD → USDC)?**  
Not yet; current releases support like‑for‑like assets across chains. (Non‑like pairs are planned.) :contentReference[oaicite:113]{index=113}

**Troubleshooting in the UI**  
- Hook returns `{}`: Wallet/public client not ready; guard usage until clients exist.  
- Amounts “off by decimals”: convert with `rusdFromString` / `rusdFromNumber`.  
- “Same chain” accepted: ensure `SwapFormSchema` refinement is applied. :contentReference[oaicite:114]{index=114}

