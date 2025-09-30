---
title: Troubleshooting & FAQ
---

# Troubleshooting & FAQ

## Troubleshooting Cheatsheet

**BLSSignatureVerificationFailed**

- **Cause:** Wrong domain (application), incorrect message bytes, or mismatched public key/curve order.
- **Fix:** Recreate message via helper (…ParamsToBytes), confirm chainId/DST, sign with BN254, and pass exact sig bytes. 

**SameVersionUpgradeNotAllowed**

- **Cause:** New implementation’s getVersion() equals current Router version.
- **Fix:** Deploy a new implementation that returns a different version; tests validate this behavior.  

**UpgradeTimeMustRespectDelay / UpgradeDelayTooShort**

- **Cause:** Scheduled timestamp earlier than minimumContractUpgradeDelay or initializing with < 2 days.
- **Fix:** Use now + delay + ε; keep minimum delay ≥ 2 days at init. 

**DestinationChainIdNotSupported / TokenMappingAlreadyExists**

- **Cause:** Missing permit for chain ID or duplicate token mapping.
- **Fix:** Call permitDestinationChainId first; check mapping existence before setting. 

**AccessControlUnauthorizedAccount**

- **Cause:** Non‑admin calling admin‑only method.
- **Fix:** Ensure ADMIN role; use onlyAdmin‑protected entrypoints.

## Frequently Asked Questions (FAQ)

**Is Router upgradeable and how is authorization enforced?**

Yes. Router inherits ScheduledUpgradeable (UUPS). Schedule/execute are authorized via BN254 BLS signatures with domain separation.

**What’s the default minimum upgrade delay?**

Two days by default; attempts below this revert. Adjust via setMinimumContractUpgradeDelay. 

**Where do I get the message to sign for upgrades or validator updates?**

Call contractUpgradeParamsToBytes or blsValidatorUpdateParamsToBytes and sign the returned G1 bytes off‑chain. 

**How do I map tokens across chains?**

As ADMIN, call permitDestinationChainId(dstChainId) then setTokenMapping(dstChainId, dstToken, srcToken).
