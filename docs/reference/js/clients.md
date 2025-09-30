---
title: Clients
---

# Clients

## OnlySwapsViemClient  
[Class] · since v0.0.0

Viem‑backed client for the OnlySwaps Router: request swaps, suggest/update fees, and query status/receipt. 

### Definition

```typescript
export class OnlySwapsViemClient implements OnlySwaps {
constructor(
private account: `0x${string}`,
private contractAddress: Address,
...
---

**Symptom:** `requestId` is undefined after `swap`.
**Cause:** The `SwapRequested` event wasn’t found in the receipt logs.
**Fix:** Ensure the Router ABI matches the deployed contract a...is emitted; the client parses that event to extract the id. 

---

**Symptom:** Fee values look off by powers of ten.
**Cause:** Mixing JS `number`/string with 18‑dp `bigint` amounts.
**Fix:** Convert inputs with `rusdFromString`/`rusdFromNumber` and format outputs with `rusdToString`. 

---

**Symptom:** Increasing fee has no 
