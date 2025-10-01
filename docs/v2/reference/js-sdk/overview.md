# JS SDK Overview: onlyswaps-js

`onlyswaps-js` is a lightweight TypeScript client library that enables applications to interact with the OnlySwaps protocol. It is built on top of Viem, providing a type-safe and efficient way to manage cross-chain swaps.

[GitHub Repository](https://github.com/randa-mu/onlyswaps-js)
**Version:** 0.3.0

## Key Features

*   **Viem Integration:** Utilizes Viem's `PublicClient` and `WalletClient`.
*   **Swap Management:** Functions to request swaps, check status, fetch receipts, and update fees.
*   **Fee Recommendation:** Integration with the Fees API.
*   **RUSD Faucet Client:** Includes a client for the test RUSD ERC-20 token for easy testing.
*   **Type Safety:** Comprehensive TypeScript types.

## Guiding Principles

### 1. Use Viem Clients

The SDK requires both a `PublicClient` (for reads) and a `WalletClient` (for writes/signing), configured for the same chain.

### 2. BigInt for All Token Values

All token amounts and fees are treated as 18-decimal fixed-point integers (`bigint`). **Never** use JavaScript `number` types for monetary values.

Use the provided [RUSD helpers](./helpers.md) for conversion:
*   Input: `rusdFromString()` or `rusdFromNumber()`
*   Output: `rusdToString()`

### 3. Approval Workflow

The Router contract must be approved as a spender. The SDK simplifies this: the `OnlySwapsViemClient.swap()` method can automatically perform an approval for `amount + fee` if provided with the RUSD client instance.

### 4. Fee Management

Use `fetchRecommendedFee()` to get an initial estimate. If the swap is not fulfilled quickly, use `updateFee()`.

### 5. Tracking Swaps

Differentiate between source chain status (`fetchStatus`) and destination chain fulfillment (`fetchReceipt`):
*   `executed` (Source): dcipher has verified the swap and the solver is reimbursed.
*   `fulfilled` (Destination): The solver has transferred funds to the user.

## Installation

```bash
npm install onlyswaps-js viem
```

## Next Steps

[Client Reference](./clients.md) | [Type Reference](./types.md)
