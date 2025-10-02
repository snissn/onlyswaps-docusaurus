---
sidebar_position: 1
title: "Getting Started for Developers"
description: "Learn how to integrate OnlySwaps into your application with onlyswaps-ui and onlyswaps-js SDKs"
keywords: ["developer", "integration", "SDK", "onlyswaps-ui", "onlyswaps-js", "React"]
date: "2024-01-15"
---

# Getting Started for Developers

Integrating OnlySwaps into your application allows you to offer seamless cross-chain token transfers to your users. The protocol provides a robust suite of tools tailored for different integration paths.

## Integration Paths

OnlySwaps provides two primary libraries for integration:

### 1. onlyswaps-ui (Frontend)

This library is designed for React and Next.js applications. It provides React hooks, configuration helpers, and providers that work seamlessly with popular Web3 tooling like `wagmi` and RainbowKit. This is the fastest way to build a functional cross-chain swap UI.

*   **Best for:** dApp frontends, wallets, and user interfaces.
*   **Key Tools:** `useOnlySwapsClient`, `useRusd`, `WagmiRainbowKitProviders`, `SwapFormSchema`.

[**Go to Frontend Quickstart →**](./frontend-quickstart.md)

### 2. onlyswaps-js (Backend/Programmatic)

This is a lightweight, framework-agnostic TypeScript SDK built on top of `viem`. It allows you to initiate swaps, manage fees, and monitor transaction status from backend services, scripts, or non-React frontends.

*   **Best for:** Backend services, automated scripts, programmatic trading bots.
*   **Key Tools:** `OnlySwapsViemClient`, `RUSDViemClient`, `rusdFromNumber`.

[**Go to Backend Integration Guide →**](./backend-integration.md)

## Core Concepts for Integration

Regardless of the path you choose, several principles apply:

*   **Client Initialization:** You must initialize clients (either via hooks in the UI or manually in the backend) using `viem` or `wagmi` providers configured for the relevant chains.
*   **Token Handling (18 Decimals):** OnlySwaps tokens (like RUSD) use 18 decimals. All amounts and fees in the SDKs are handled as `bigint`. Always use the provided helpers (e.g., `rusdFromNumber`, `rusdFromString`) for conversions. Never pass floating-point numbers directly to the SDK.
*   **Approvals:** The Router contract must be approved to spend the user's tokens (amount + fee). The `OnlySwapsViemClient.swap()` method can handle this automatically if provided with the necessary context.
*   **Swap Lifecycle:** A swap generates a unique `requestId`. This ID is used to track the status on the source chain (`fetchStatus` -> `executed`) and the destination chain (`fetchReceipt` -> `fulfilled`).
*   **Fees:** Fees are crucial for timely fulfillment. Use `fetchRecommendedFee` to get a starting point, and implement logic to `updateFee` if a swap is delayed.

