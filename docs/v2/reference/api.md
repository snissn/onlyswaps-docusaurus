# API and SDK Reference

This document provides a comprehensive reference for the public APIs of the OnlySwaps protocol, covering the Solidity contracts, the JavaScript/TypeScript SDK, and the React UI library.

---

## `onlyswaps-ui` (React/Next.js)

A library providing React hooks, providers, and configuration for building cross-chain swap UIs. Works seamlessly with `wagmi` and RainbowKit.

### Hooks

#### `useOnlySwapsClient(props?)`

React hook that returns an OnlySwaps client (`OnlySwaps` interface) bound to the current (or provided) chain.

*   **Props (`UseOnlySwapsProps`):**
    *   `chainId?: number`: Optional chain ID to target a specific network.
*   **Returns (`UseOnlySwapsReturn`):**
    *   `walletClient?: WalletClient`
    *   `onlyswaps?: OnlySwaps`
*   **Note:** Fields may be `undefined` while the wallet or clients are loading.

#### `useRusd(props)`

React hook that returns an RUSD client (`RUSD` interface) bound to a given chain for a wallet address.

*   **Props (`UseRusdProps`):**
    *   `chainId: number`: The target chain ID.
    *   `address?: Address`: The user's wallet address.
*   **Returns (`UseRusdReturn`):**
    *   `rusd?: RUSD`

### Configuration & ETH Helpers

#### `chainConfigs`

A record mapping supported chain IDs to their configuration, including contract addresses and `viem` Chain objects.

```typescript
export const chainConfigs: Record<number, ChainConfig>;
````

#### `supportedChains`

A tuple of supported `viem` `Chain` objects derived from `chainConfigs`. Used for configuring Wagmi and RainbowKit.

#### `supportedTransports`

A record mapping each supported chain ID to a default HTTP transport.

### Providers

#### `WagmiRainbowKitProviders({ children })`

Top-level provider that mounts Wagmi, React Query, and RainbowKit with configurations derived from `supportedChains` and `supportedTransports`.

### Validation Schemas (Zod)

#### `amountSchema`

Zod schema for UI amounts and fees. Enforces constraints: Min 0.01, Max 1,000,000,000, and at most 2 decimal places.

#### `SwapFormSchema`

Composite schema for the swap form. Includes a refinement to ensure `sourceChain` is different from `destinationChain`.

```typescript
export const SwapFormSchema = z.object({
  currency: currencySchema, // Currently only "rusd"
  sourceChain: chainIdSchema,
  destinationChain: chainIdSchema,
  amount: amountSchema,
  fee: amountSchema,
}).refine(/* ... */);
```

-----

## `onlyswaps-js` (TypeScript SDK)

A lightweight TypeScript client built on `viem` for interacting with the OnlySwaps Router and RUSD contracts.

### Clients

#### `OnlySwapsViemClient`

Viem-backed client for the OnlySwaps Router. Implements the `OnlySwaps` interface.

  * **Constructor:**
    ```typescript
    constructor(
      private account: `0x${string}`,
      private contractAddress: Address,
      private publicClient: PublicClient,
      private walletClient: WalletClient,
    );
    ```
  * **Methods:** See `OnlySwaps` interface below.

#### `RUSDViemClient`

Minimal ERC-20 faucet token (RUSD) client. Implements the `RUSD` interface.

  * **Methods:** See `RUSD` interface below.

### Interfaces

#### `OnlySwaps`

High-level Router operations.

```typescript
export interface OnlySwaps {
  // Initiates a swap. Handles approval automatically if an RUSD client is provided.
  swap(options: SwapRequest, client?: RUSD): Promise<SwapResponse>;
  // Updates the fee for a pending swap.
  updateFee(requestId: `0x${string}`, newFee: bigint): Promise<void>;
  // Fetches a suggested fee from the Fees API.
  fetchRecommendedFee(tokenAddress: `0x${string}`, amount: bigint, srcChainId: bigint, destChainId: bigint): Promise<bigint>;
  // Queries status on the source chain.
  fetchStatus(requestId: `0x${string}`): Promise<SwapRequestParameters>;
  // Queries fulfillment receipt on the destination chain.
  fetchReceipt(requestId: `0x${string}`): Promise<SwapRequestReceipt>;
}
```

#### `RUSD`

Narrow ERC-20 surface needed by the Router workflow.

```typescript
export interface RUSD {
  // Mints test tokens (testnets only).
  mint(): Promise<void>;
  // Reads balance.
  balanceOf(address: Address): Promise<bigint>;
  // Approves the Router to spend tokens.
  approveSpend(address: Address, amount: bigint): Promise<void>;
}
```

### Types

All `bigint` values represent 18-decimal fixed-point integers.

#### `SwapRequest`

Input parameters for the `swap` function.

```typescript
export type SwapRequest = {
  recipient: `0x${string}`;
  tokenAddress: `0x${string}`;
  amount: bigint;
  fee: bigint;
  destinationChainId: bigint;
};
```

#### `SwapRequestParameters`

Source-chain view of a swap request. Returned by `fetchStatus`.

```typescript
export type SwapRequestParameters = {
  // ... (other fields)
  verificationFee: bigint;
  solverFee: bigint;
  executed: boolean;   // True if verified by the dcipher network on the source chain
};
```

#### `SwapRequestReceipt`

Destination-chain receipt of fulfillment. Returned by `fetchReceipt`.

```typescript
export type SwapRequestReceipt = {
  // ... (other fields)
  fulfilled: boolean;  // True if the solver completed the transfer on the destination chain
  solver: `0x${string}`;
  amountOut: bigint;
};
```

### RUSD Formatting Helpers (18-dp)

Utilities for converting between `bigint` and human-readable formats.

  * `rusdToString(value, decimals?)`: Formats `bigint` to string. Truncates (does not round).
  * `rusdFromString(input)`: Parses string to `bigint`.
  * `rusdFromNumber(input)`: Converts JS `number` to `bigint`.

-----

## `onlyswaps/solidity`

The core smart contracts for the OnlySwaps protocol.

### Core Contracts

#### `Router.sol`

The main contract managing cross-chain swaps. Deployed behind a UUPS proxy and inherits from `ScheduledUpgradeable`.

  * **Key Functions (Admin):**
      * `initialize(...)`: Sets initial validators, owner, and fees.
      * `permitDestinationChainId(uint256 chainId)`: Whitelists a destination chain.
      * `setTokenMapping(uint256 dstChainId, address dstToken, address srcToken)`: Maps tokens between chains.
      * `withdrawVerificationFee(address token, address to)`: Withdraws accrued verification fees.

#### `ScheduledUpgradeable.sol`

Abstract base contract providing time-locked UUPS upgrades authorized by BLS (BN254) signatures.

  * **Key Features:**
      * Enforces `minimumContractUpgradeDelay` (default: 2 days).
  * **Upgrade Lifecycle Functions:**
      * `scheduleUpgrade(...)`: Schedules an upgrade. Requires BLS signature.
      * `cancelUpgrade(...)`: Cancels a pending upgrade. Requires BLS signature.
      * `executeUpgrade()`: Executes a scheduled upgrade after the time lock has expired.
  * **Helper Functions (Message Generation):**
      * `contractUpgradeParamsToBytes(...)`: Generates bytes (G1) for signing upgrade actions off-chain.

### Interfaces

#### `IRouter.sol`

Defines the core structs, events, and external functions of the Router.

  * **Key Functions (for Solvers/Integrators):**
      * `swapRequestParametersToBytes(bytes32 requestId, address solver)`: Generates message bytes for a solver to sign for rebalancing.
      * `relayTokens(...)`: Called on the destination chain by the solver to fulfill the swap.
      * `rebalanceSolver(address solver, bytes32 requestId, bytes calldata sigBytes)`: Called on the source chain to settle fees after fulfillment, requires solver's signature.

### Signature Schemes

#### `BLSBN254SignatureScheme.sol`

BN254 BLS signature verifier. It enforces application-scoped domain separation.

  * **Usage:** Separate instances are deployed for different applications (e.g., `application="swap-v1"` and `application="upgrade-v1"`) to prevent signature replay across functions.

### Libraries

#### `ErrorsLib.sol`

A library containing custom errors used across the contracts for precise, gas-efficient reverts (e.g., `BLSSignatureVerificationFailed`, `SameVersionUpgradeNotAllowed`).


