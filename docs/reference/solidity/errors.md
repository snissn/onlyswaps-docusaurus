# Contract Reference: Custom Errors (ErrorsLib.sol)

The OnlySwaps protocol uses custom errors defined in `ErrorsLib.sol` for precise, gas-efficient reverts.

## Swap Flow Errors

| Error | Description |
| :--- | :--- |
| `AlreadyFulfilled()` | The swap request has already been fulfilled. |
| `ZeroAmount()` | The swap amount or fee is zero. |
| `FeeTooLow()` | The provided fee is below the minimum required. |
| `NewFeeTooLow(uint256 newFee, uint256 currentFee)` | Attempted to update the fee to a value lower than the current fee. |
| `InvalidTokenOrRecipient()` | Token or recipient address is invalid (e.g., zero address). |
| `TokenNotSupported()` | The token is not mapped for the destination chain. |
| `DestinationChainIdNotSupported(uint256 dstChainId)` | The destination chain ID is not whitelisted. |
| `SwapRequestParametersMismatch()` | Parameters provided during fulfillment/rebalancing do not match the original request. |

## BLS Verification Errors

| Error | Description |
| :--- | :--- |
| `BLSSignatureVerificationFailed()` | The provided BLS signature is invalid, does not match the message, or the signing key is incorrect. |
| `SourceChainIdMismatch(...)` | Chain ID mismatch between the request and the contract environment. |

## Administration Errors

| Error | Description |
| :--- | :--- |
| `UnauthorisedCaller()` | The caller does not have the required role (e.g., `ADMIN_ROLE`). |
| `TokenMappingAlreadyExists()` | Attempted to set a duplicate token mapping. |
| `InvalidFeeBps()` / `FeeBpsExceedsThreshold(...)` | The verification fee BPS is invalid or exceeds the maximum. |

## Upgrade Mechanism Errors

| Error | Description |
| :--- | :--- |
| `NoUpgradePending()` | Attempted to execute or cancel an upgrade when none is scheduled. |
| `UpgradeTooEarly(uint256 upgradeTime)` | Attempted to execute an upgrade before the scheduled time. |
| `UpgradeTimeMustRespectDelay(...)` | Scheduled time is earlier than the minimum required delay. |
| `SameVersionUpgradeNotAllowed()` | New implementation has the same `getVersion()` as the current one. |
| `UpgradeFailed()` | The UUPS upgrade process failed during execution. |
