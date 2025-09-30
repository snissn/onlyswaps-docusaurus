---
title: Troubleshooting (JS)
---

```
# Troubleshooting & FAQ (JS)

**Symptom:** `requestId` is undefined after `swap`.
**Cause:** The `SwapRequested` event wasn’t found in the receipt logs.
**Fix:** Ensure the Router ABI matches the deployed contract and that the event is emitted; the client parses that event to extract the id. 

**Symptom:** Fee values look off by powers of ten.
**Cause:** Mixing JS `number`/string with 18‑dp `bigint` amounts.
**Fix:** Convert inputs with `rusdFromString`/`rusdFromNumber` and format outputs with `rusdToString`. 
```
