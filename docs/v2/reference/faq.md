```markdown
# Frequently Asked Questions (FAQ)

## General Questions

### What is the difference between `executed` and `fulfilled`?

These terms refer to the status of a swap on different chains:

*   **`fulfilled`** (Destination Chain): This status is found in the `SwapRequestReceipt` (queried via `fetchReceipt`). It means the Solver has successfully completed the transfer of tokens to the user on the destination chain.
*   **`executed`** (Source Chain): This status is found in the `SwapRequestParameters` (queried via `fetchStatus`). It means the dcipher committee has verified the fulfillment and the Router on the source chain has reimbursed the Solver.

A swap is considered complete only when both statuses are `true`.

### Which chains are supported?

The set of supported chains is defined by the protocol's configuration. Currently, this includes Avalanche, Base, and their respective testnets (Fuji and Sepolia). [See the full list here](./chains-and-tokens.md).

### What tokens are supported?

Currently, OnlySwaps primarily supports swapping like-for-like tokens (e.g., RUSD on Base to RUSD on Avalanche). Support for more 'exotic' pairs (swapping different tokens) is planned for future releases.

## Developer Questions (SDK & UI)

### What units do `amount` and `fee` use in `onlyswaps-js`?

Both `amount` and `fee` must be 18-decimal fixed-point `bigint`s. For example, `1000000000000000000n` (or `10n**18n`) represents 1.0 RUSD.

### How should I represent amounts in the UI?

Keep UI amounts as standard JavaScript `number`s and validate them using the `amountSchema` from `onlyswaps-ui` (which enforces limits and 2 decimal places). Before calling the SDK clients, convert these numbers to `bigint` using the `rusdFromNumber()` helper from `onlyswaps-js`.

### Does `rusdToString` round the values?

No. The output of `rusdToString` is truncated to the requested number of decimals.

### My UI hook (e.g., `useOnlySwapsClient`) is returning `{}` (undefined clients). Why?

This means the underlying Wagmi Wallet Client or Public Client is not yet available, or the user has not connected their wallet. You must guard your calls until the `onlyswaps` or `rusd` clients are defined in the hook's return object.

### Do I need to handle ERC20 approvals before swapping?

Yes, the Router must be approved to spend the user's tokens (amount + fee). However, the `OnlySwapsViemClient.swap()` method (used by the UI hook) handles this approval automatically before initiating the swap, provided the necessary context is available.

### How is the `requestId` obtained after a swap?

The `requestId` is generated on-chain and emitted via the `SwapRequested` event. The `onlyswaps-js` client parses this event from the transaction receipt logs and returns the `requestId`.

## Smart Contract Questions (Solidity)

### Is the Router contract upgradeable?

Yes. The Router utilizes the UUPS proxy pattern and inherits from `ScheduledUpgradeable`.

### How are upgrades authorized and secured?

Upgrades are subject to a mandatory time lock (default: 2 days) and must be authorized by the dcipher committee. Scheduling or canceling requires a valid BN254 BLS threshold signature with appropriate domain separation (e.g., "upgrade-v1").

### What is the default minimum upgrade delay?

The default delay is two days. Attempts to schedule an upgrade sooner than this will revert. The delay can be adjusted by the admin via `setMinimumContractUpgradeDelay`.

### How do I generate the message to sign for upgrades or validator updates?

On the Router contract, call the helper functions `contractUpgradeParamsToBytes` or `blsValidatorUpdateParamsToBytes`. These functions return the message bytes (specifically, the message as G1 bytes) which must then be signed off-chain using the committee's BLS keys.
```

