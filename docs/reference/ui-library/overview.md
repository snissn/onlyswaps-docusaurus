# UI Library Overview: onlyswaps-ui

`onlyswaps-ui` is a React library providing hooks, providers, configuration, and validation schemas specifically designed for building interfaces for the OnlySwaps protocol. It leverages modern Web3 tooling including Wagmi, RainbowKit, Viem, and Zod.

[GitHub Repository](https://github.com/randa-mu/onlyswaps-ui)
**Version:** 0.1.0

## Key Features

*   **React Hooks:** `useOnlySwapsClient` and `useRusd` provide easy access to typed clients bound to the active wallet and chain.
*   **Configuration:** Pre-defined constants for supported chains, transports, and contract addresses.
*   **Providers:** Simplified setup for Wagmi and RainbowKit context.
*   **Validation:** Zod schemas for validating swap forms and user inputs.

## Guiding Principles

### 1. Prefer Hooks

Use the provided hooks to obtain client instances. These hooks automatically manage the connection state based on the active Wagmi context.

### 2. Use Configuration Constants

Always read chain-specific contract addresses (Router, RUSD) from the `chainConfigs` object. **Do not hard-code contract addresses**.

### 3. Validate Inputs with Zod

Use the provided Zod schemas (e.g., `SwapFormSchema`) to validate all user inputs before attempting on-chain actions.

### 4. Handle Loading States Gracefully

Hooks depend on the wallet connection. They may return `{}` (undefined fields) while loading. Ensure your components gracefully handle these `undefined` states.

## Installation

```bash
npm install onlyswaps-ui onlyswaps-js viem wagmi @rainbow-me/rainbowkit zod @hookform/resolvers
```

## Next Steps

[Hook Reference](./hooks.md) | [Configuration Reference](./configuration.md) | [Schema Reference](./schemas.md)
