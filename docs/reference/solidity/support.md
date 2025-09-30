---
title: Support
---

```
# Support / FAQ

* q: \"What’s the default minimum upgrade delay?\"\n  a: \"Two days by default; attempts below this revert. Adjust via setMinimumContractUpgradeDelay. \"\n* q: \"Where do I get the message to sign for upgrades or validator updates?\"\n  a: \"Call contractUpgradeParamsToBytes or blsValidatorUpdateParamsToBytes and sign the returned G1 bytes off‑chain. \"\n* q: \"How do I map tokens across chains?\"\n  a: \"As ADMIN, call permitDestinationChainId(dstChainId) then setTokenMapping(dstChainId, dstToken, srcToken). \"
```
