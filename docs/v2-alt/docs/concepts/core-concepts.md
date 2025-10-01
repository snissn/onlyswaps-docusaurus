# Core Concepts

## Source vs. Destination Chain
- **Source Chain** — where the user locks tokens and where the solver is reimbursed after verification. :contentReference[oaicite:26]{index=26}
- **Destination Chain** — where the solver sends tokens to the user. Committee observes the transfer here before signing on the source chain. :contentReference[oaicite:27]{index=27}

## Swap Request
An orderbook entry from a user indicating token, amount, destination, and the offered **solver fee**. Each request is uniquely addressed by `requestId` (derived from request details). Fees are adjustable while pending. :contentReference[oaicite:28]{index=28}

**SDK shape** (JS):  
```ts
export type SwapRequest = {
  recipient: `0x${string}`;
  tokenAddress: `0x${string}`;
  amount: bigint;           // 18‑dp units
  fee: bigint;              // 18‑dp units
  destinationChainId: bigint;
};
```

Avoid `number`; always pass 18‑dp `bigint`. Convert with `rusdFromString/Number`.  

## Swap Fulfilment

A solver signal + action that they have sent funds to the recipient on the destination chain. The first solver at the user’s price wins; subsequent attempts fail. 

## Swap Verification

The dcipher committee threshold‑signs that the destination‑chain transfer occurred. One operator uploads the aggregated signature to the Router on the source chain; the Router verifies it against the committee pubkey and reimburses the solver (plus fees). 

## Receipts & Status

* **Source‑chain status** (`SwapRequestParameters`): solver/verification fees, execution flag, timing. `executed` reflects committee verification. 
* **Destination‑chain receipt** (`SwapRequestReceipt`): solver, recipient, amount out, and `fulfilled` time on the destination chain. 

Track both to display end‑to‑end completion. 

