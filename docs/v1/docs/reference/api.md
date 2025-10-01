# API / SDK Reference

This page lists the public surface across UI hooks, JS clients, and Solidity interfaces. Use it alongside the examples in Getting Started.

---

## onlyswaps-ui (React)

### Hooks

`useOnlySwapsClient(props?: { chainId?: number })` → `{ onlyswaps?, walletClient? }`  
Returns a client bound to the current (or provided) chain when Wagmi providers and wallet are ready. Use `chainConfigs[chainId].router` to build requests. :contentReference[oaicite:73]{index=73}

`useRusd({ chainId: number, address?: 0x… })` → `{ rusd? }`  
Returns a viem‑backed RUSD client bound to the given chain/address. :contentReference[oaicite:74]{index=74}

### Chain helpers

- `chainConfigs: Record<number, { router: 0x…, rusd: 0x…, chain: Chain }>` – authoritative per‑chain config. :contentReference[oaicite:75]{index=75}  
- `supportedChains: [Chain, …]` – tuple for Wagmi. :contentReference[oaicite:76]{index=76}  
- `supportedTransports: Record<SupportedChainId, Transport>` – defaults for `http()` transports. :contentReference[oaicite:77]{index=77}  
- `SupportedChainId` – union type of supported chain IDs. :contentReference[oaicite:78]{index=78}

### Validation schemas (zod)

- `currencySchema = z.enum(['rusd'])` – extend when new currencies are supported. :contentReference[oaicite:79]{index=79}  
- `chainIdSchema` – inferred from `supportedChains`. :contentReference[oaicite:80]{index=80}  
- `amountSchema` – number coercion, ≤1e9, ≥0.01, 2dp. :contentReference[oaicite:81]{index=81}  
- `SwapFormSchema` – `{ currency, sourceChain, destinationChain, amount, fee }` + cross‑field refinement (source ≠ destination). :contentReference[oaicite:82]{index=82}

---

## onlyswaps-js (TypeScript)

### Clients

OnlySwapsViemClient  
`constructor(account, routerAddress, publicClient, walletClient, abi?)`
- `fetchRecommendedFee(tokenAddress, amount, srcId, dstId) → bigint`  
- `swap(request: SwapRequest, client?: RUSD) → Promise<SwapResponse>`  
- `updateFee(requestId, newFee)`  
- `fetchStatus(requestId) → SwapRequestParameters`  
- `fetchReceipt(requestId) → SwapRequestReceipt` :contentReference[oaicite:83]{index=83}

RUSDViemClient  
`constructor(account, tokenAddress, publicClient, walletClient, abi?)`
- `mint()`  
- `balanceOf(address) → bigint`  
- `approveSpend(spender, amount)` :contentReference[oaicite:84]{index=84}

### Types

```ts
export type SwapRequest = {
  recipient: 0x…;
  tokenAddress: 0x…;
  amount: bigint;           // 18‑dp
  fee: bigint;              // 18‑dp
  destinationChainId: bigint;
}
export type SwapResponse = { requestId: 0x… }
export type SwapRequestParameters = {
  sender: 0x…; recipient: 0x…; tokenIn: 0x…; tokenOut: 0x…;
  amountOut: bigint; srcChainId: bigint; dstChainId: bigint;
  verificationFee: bigint; solverFee: bigint; nonce: bigint;
  executed: boolean; requestedAt: bigint;
}
export type SwapRequestReceipt = {
  requestId: 0x…; srcChainId: bigint; dstChainId: bigint; token: 0x…;
  fulfilled: boolean; solver: 0x…; recipient: 0x…;
  amountOut: bigint; fulfilledAt: bigint;
}
```

All numeric fields are 18‑decimal `bigint`. For UI, format with `rusdToString`; for input, prefer `rusdFromString`.  

### RUSD helpers

* `rusdToString(value: bigint, decimals = 2) → string` – truncates, clamps >18 dp. 
* `rusdFromString(input: string) → bigint` – parses to 18‑dp `bigint`. 
* `rusdFromNumber(input: number) → bigint` – scales by 1e18 with rounding. 

---

## Solidity (protocol)

### Router (implements `IRouter`)

Key externals (distilled):

* `getVersion() → string`
* `swapRequestParametersToBytes(requestId, solver) → (bytes message, bytes g1Bytes)`
* `relayTokens(token, recipient, amount, requestId, srcChainId)`
* `rebalanceSolver(solver, requestId, sigBytes)`
* Admin: `permitDestinationChainId`, `blockDestinationChainId`, `setTokenMapping`, `removeTokenMapping`, `withdrawVerificationFee`
* UUPS/upgrade admin: `scheduleUpgrade`, `cancelUpgrade`, `executeUpgrade`, `setContractUpgradeBlsValidator`  

Constants & fees:

* `BPS_DIVISOR = 10_000`, `MAX_FEE_BPS = 5_000`, `verificationFeeBps` (config). 

### Signature schemes

* `BLSBN254SignatureScheme` – deploy per application domain (e.g., `"swap-v1"`, `"upgrade-v1"`), pass to Router init. 

### Upgrades

* `ScheduledUpgradeable` – time‑locked UUPS upgrades, min delay (default 2 days), BLS‑gated messages from `contractUpgradeParamsToBytes`/`blsValidatorUpdateParamsToBytes`.  

### Common errors (selected)

`DestinationChainIdNotSupported`, `TokenMappingAlreadyExists`, `BLSSignatureVerificationFailed`, `SameVersionUpgradeNotAllowed`, `UpgradeDelayTooShort`. Map these to friendly messages in apps. 

