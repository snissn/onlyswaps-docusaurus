---
title: Troubleshooting (JS)
---

# Troubleshooting & FAQ

## Troubleshooting Cheatsheet

**Symptom:** Swap write reverted with an unhelpful error string.
**Cause:** The revert reason wasn’t decoded.
**Fix:** Simulate and decode revert data like `throwOnError` does to surface the specific contract error. 

---

**Symptom:** `requestId` is undefined after `swap`.
**Cause:** The `SwapRequested` event wasn’t found in the receipt logs.
**Fix:** Ensure the Router ABI matches the deployed contract and that the event is emitted; the client parses that event to extract the id. 

---

**Symptom:** Fee values look off by powers of ten.
**Cause:** Mixing JS `number`/string with 18‑dp `bigint` amounts.
**Fix:** Convert inputs with `rusdFromString`/`rusdFromNumber` and format outputs with `rusdToString`. 

---

**Symptom:** Increasing fee has no effect.
**Cause:** The request is already fulfilled/executed.
**Fix:** Check `fetchStatus(requestId).executed` and `fetchReceipt(requestId).fulfilled` before calling `updateFee`. 

---

## Frequently Asked Questions

### What units do `amount` and `fee` use?

Both are 18‑decimal fixed‑point bigints (e.g., `100n` means 100 wei‑RUSD, i.e., 1e-16 RUSD). Comments in the type definitions clarify this. 

### Does `rusdToString` round?

No—output is truncated to the requested decimals; more than 18 requested decimals are clamped to 18. 

### How is `requestId` obtained?

The client parses the `SwapRequested` event from the transaction receipt and returns its `requestId` argument. 

### What’s the difference between `executed` and `fulfilled`?

`executed` in `SwapRequestParameters` indicates solver execution; `fulfilled` in the receipt indicates destination chain settlement.
