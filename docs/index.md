# Welcome to OnlySwaps

**The secure, solver-based protocol for cross-chain token transfers.**

OnlySwaps is a decentralized cross-chain protocol designed to facilitate the seamless transfer of ERC-20 tokens across EVM-compatible blockchains. Built on the security infrastructure of the **dcipher network**, OnlySwaps leverages an intent-based architecture to provide fast, secure, and capital-efficient bridging.

## How OnlySwaps Works

OnlySwaps replaces traditional lock-and-mint mechanisms with an innovative model:

1.  **Intent:** Users broadcast their intent to swap tokens by locking funds in the `Router` contract on the source chain and offering a fee.
2.  **Fulfillment:** Specialized liquidity providers, called **Solvers**, observe this intent and compete to fulfill the request immediately on the destination chain.
3.  **Verification:** The decentralized **dcipher committee** verifies the fulfillment using threshold BLS signatures.
4.  **Settlement:** Upon verification, the `Router` contract reimburses the solver (plus the fee) on the source chain.

## Key Features

*   **Intent-Based Liquidity:** Solvers provide just-in-time liquidity, optimizing capital efficiency and speed.
*   **dcipher Security Model:** Relies on decentralized threshold cryptography (BLS BN254) for verification, minimizing custodial risk and single points of failure.
*   **Upgradeable Architecture:** Core contracts utilize the UUPS pattern with time-locked, BLS-gated upgrades, ensuring robust governance and future-proofing.
*   **Developer-First Tooling:** Comprehensive SDKs (`onlyswaps-js`) and React libraries (`onlyswaps-ui`) streamline the integration process.

---

## Get Started

Choose your path to integrating OnlySwaps.

### 💻 UI Developers (React/Next.js)

Build a front-end interface allowing users to connect wallets, request swaps, and track status using our React hooks and components.

[**Quickstart: Building a Swap UI →**](./guides/quickstart-ui.md)
[**`onlyswaps-ui` Reference →**](./reference/ui-library/overview.md)

### 🔧 Backend & Scripting (TypeScript/Viem)

Integrate OnlySwaps directly into your backend services, scripts, or bots using the lightweight `onlyswaps-js` SDK.

[**Guide: Programmatic Swaps →**](./guides/programmatic-swaps.md)
[**`onlyswaps-js` Reference →**](./reference/js-sdk/overview.md)

### 🧱 Smart Contract Developers & Auditors

Understand the core contracts, the UUPS upgrade mechanism, and the BLS verification process for deep integrations or security audits.

[**Architecture Deep Dive →**](./concepts/architecture.md)
[**Guide: Contract Upgrades →**](./guides/contract-upgrades.md)
[**Solidity Reference →**](./reference/solidity/router.md)

---

## Resources

*   [Protocol Overview](./concepts/overview.md)
*   [Core Terminology](./concepts/terminology.md)
*   [GitHub: onlyswaps-js](https://github.com/randa-mu/onlyswaps-js)
*   [GitHub: onlyswaps-solidity](https://github.com/randa-mu/onlyswaps-solidity)
*   [GitHub: onlyswaps-ui](https://github.com/randa-mu/onlyswaps-ui)

