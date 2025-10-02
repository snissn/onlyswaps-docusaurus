---
sidebar_position: 1
---

# Getting Started for Developers

You’ve got two clean integration paths:

1) Frontend (React) with `onlyswaps-ui`  
   Drop in Wagmi/RainbowKit providers, use the hooks (`useOnlySwapsClient`, `useRusd`), schemas (`SwapFormSchema`), and chain helpers (`supportedChains`, `supportedTransports`) to build a swap UI fast. :contentReference[oaicite:43]{index=43} :contentReference[oaicite:44]{index=44} :contentReference[oaicite:45]{index=45}

2) Backend / scripts with `onlyswaps-js`  
   Create viem clients, mint faucet tokens for tests, approve the Router, request a swap, optionally bump fees, and poll status/receipt. :contentReference[oaicite:46]{index=46}

Pick your adventure:

- Frontend Quickstart → `frontend-quickstart.md`  
- Backend & Programmatic Swaps → `backend-integration.md`

> Working directly at the Solidity level? See the API / SDK Reference (Router, interfaces, validators, and upgrade surface). → `../../reference/api.md`

