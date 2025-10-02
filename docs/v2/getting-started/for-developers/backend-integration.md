---
sidebar_position: 3
title: "Backend Integration"
description: "Programmatic cross-chain swaps using ONLYSwaps-js SDK, viem, and Node.js for backend services"
keywords: ["backend", "programmatic", "Node.js", "viem", "ONLYSwaps-js", "TypeScript"]
date: "2024-01-15"
---

# Backend & Programmatic Swaps: ONLYSwaps-js & viem

This guide demonstrates how to initiate, monitor, and manage cross-chain swaps programmatically from a backend service or script using the `ONLYSwaps-js` SDK and `viem`.

**Objective:** Execute a full end-to-end cross-chain swap workflow, including minting test tokens, approving the router, initiating the swap, updating the fee, and tracking completion.

## Prerequisites

*   Node.js installed.
*   A Private Key for an EVM wallet funded with native gas tokens on the source testnet (e.g., AVAX on Fuji).
*   RPC URLs for the source and destination chains.

## Step 1: Project Setup

Set up a simple Node.js project with TypeScript.

```bash
mkdir ONLYSwaps-backend
cd ONLYSwaps-backend
npm init -y
npm install typescript ts-node viem ONLYSwaps-js dotenv
npx tsc --init
```

Update `tsconfig.json` to ensure `target` is at least `"ES2020"` for `bigint` support.

Create a `.env` file for sensitive information (and add it to `.gitignore`):

```bash
# .env
PRIVATE_KEY=0xYourPrivateKeyHere
# Example: Avalanche Fuji (Source)
SRC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
SRC_CHAIN_ID=43113
# Example: Base Sepolia (Destination)
DEST_RPC_URL=https://sepolia.base.org
DEST_CHAIN_ID=84532

# Contract addresses (Addresses for Fuji/Base Sepolia from the specification)
ROUTER_ADDRESS=0x4cB630aAEA9e152db83A846f4509d83053F21078
RUSD_ADDRESS=0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76
```

## Step 2: Client Initialization (viem)

We need `viem` clients (`publicClient` for reads, `walletClient` for writes) for the source chain, and a `publicClient` for the destination chain (for tracking).

Create `src/config.ts`.

```typescript
// src/config.ts
import { createPublicClient, createWalletClient, http, Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { avalancheFuji, baseSepolia } from "viem/chains";
import dotenv from 'dotenv';

dotenv.config();

// Configuration
export const CONFIG = {
  ROUTER: process.env.ROUTER_ADDRESS as `0x${string}`,
  RUSD: process.env.RUSD_ADDRESS as `0x${string}`,
  SRC_CHAIN_ID: parseInt(process.env.SRC_CHAIN_ID!),
  DEST_CHAIN_ID: parseInt(process.env.DEST_CHAIN_ID!),
  SRC_RPC: process.env.SRC_RPC_URL!,
  DEST_RPC: process.env.DEST_RPC_URL!,
  PRIVATE_KEY: process.env.PRIVATE_KEY as `0x${string}`,
};

// Helper to select the correct chain definition (simplified for this demo)
const getChain = (chainId: number): Chain => {
    if (chainId === avalancheFuji.id) return avalancheFuji;
    if (chainId === baseSepolia.id) return baseSepolia;
    throw new Error(`Unsupported Chain ID: ${chainId}`);
};

const SRC_CHAIN = getChain(CONFIG.SRC_CHAIN_ID);
const DEST_CHAIN = getChain(CONFIG.DEST_CHAIN_ID);

// Initialize Account
const account = privateKeyToAccount(CONFIG.PRIVATE_KEY);
export const MY_ADDRESS = account.address;

// Initialize viem Clients for Source Chain
export const srcPublicClient = createPublicClient({
  chain: SRC_CHAIN,
  transport: http(CONFIG.SRC_RPC),
});

export const srcWalletClient = createWalletClient({
  chain: SRC_CHAIN,
  transport: http(CONFIG.SRC_RPC),
  account,
});

// Initialize viem Clients for Destination Chain
export const destPublicClient = createPublicClient({
  chain: DEST_CHAIN,
  transport: http(CONFIG.DEST_RPC),
});

console.log(`Initialized clients for Account: ${MY_ADDRESS}`);
console.log(`Source: ${SRC_CHAIN.name}, Destination: ${DEST_CHAIN.name}`);
```

## Step 3: Instantiating ONLYSwaps Clients

Now we instantiate the `ONLYSwaps-js` clients using the `viem` clients.

Create `src/clients.ts`.

```typescript
// src/clients.ts
import { ONLYSwapsViemClient, RUSDViemClient } from "ONLYSwaps-js";
import {
  CONFIG,
  MY_ADDRESS,
  srcPublicClient,
  srcWalletClient,
  destPublicClient
} from "./config";

// RUSD Client (Source Chain)
// Used for minting, approvals, and balance checks.
export const rusdClient = new RUSDViemClient(
  MY_ADDRESS,
  CONFIG.RUSD,
  srcPublicClient,
  srcWalletClient
);

// ONLYSwaps Router Client (Source Chain)
// Used for initiating swaps and updating fees.
export const ONLYSwapsSrcClient = new ONLYSwapsViemClient(
  MY_ADDRESS,
  CONFIG.ROUTER,
  srcPublicClient,
  srcWalletClient
);

// ONLYSwaps Router Client (Destination Chain)
// Used for checking fulfillment status (receipts).
// Note: WalletClient is required by the constructor. We pass the source wallet client
// as a placeholder since we only intend to read (fetchReceipt) on the destination.
export const ONLYSwapsDestClient = new ONLYSwapsViemClient(
  MY_ADDRESS,
  CONFIG.ROUTER, // Assumes same router address on destination
  destPublicClient,
  srcWalletClient // Placeholder wallet client
);
```

## Step 4: Full End-to-End Workflow Script

We will now create the main script that executes the swap workflow.

Create `src/execute-swap.ts`.

```typescript
// src/execute-swap.ts
import { rusdClient, ONLYSwapsSrcClient, ONLYSwapsDestClient } from "./clients";
import { CONFIG, MY_ADDRESS } from "./config";
import { rusdFromNumber, rusdToString, SwapRequest } from "ONLYSwaps-js";

async function main() {
  console.log("Starting ONLYSwaps backend integration workflow...");

  const SWAP_AMOUNT_NUM = 10; // 10 RUSD
  const INITIAL_FEE_NUM = 0.1; // 0.1 RUSD
  const FEE_BUMP_NUM = 0.05; // Bump by 0.05 RUSD

  const swapAmount = rusdFromNumber(SWAP_AMOUNT_NUM);
  const initialFee = rusdFromNumber(INITIAL_FEE_NUM);
  const feeBump = rusdFromNumber(FEE_BUMP_NUM);

  // 1. Mint Test Tokens (RUSD)
  try {
    console.log("1. Attempting to mint RUSD...");
    await rusdClient.mint();
    console.log("Minting transaction sent. Waiting briefly for confirmation...");
    // Wait a moment for transaction confirmation
    await new Promise(resolve => setTimeout(resolve, 15000));
    const balance = await rusdClient.balanceOf(MY_ADDRESS);
    console.log(`New RUSD Balance: ${rusdToString(balance)}`);

    if (balance < swapAmount + initialFee) {
        throw new Error("Insufficient balance after minting.");
    }

  } catch (error) {
    console.error("Minting failed. Ensure you are on a testnet and haven't minted recently.", error);
    // Check balance anyway in case mint failed but balance is sufficient
    const balance = await rusdClient.balanceOf(MY_ADDRESS);
    if (balance < swapAmount + initialFee) {
        console.error("Exiting due to insufficient balance.");
        return;
    }
  }

  // 2. Approve the Router contract to spend tokens
  const totalAmountToApprove = swapAmount + initialFee;
  try {
    console.log(`2. Approving Router to spend ${rusdToString(totalAmountToApprove)} RUSD...`);
    await rusdClient.approveSpend(CONFIG.ROUTER, totalAmountToApprove);
    console.log("Approval successful.");
  } catch (error) {
    console.error("Approval failed.", error);
    return;
  }

  // 3. Fetch a suggested fee
  try {
    console.log("3. Fetching recommended fee...");
    const recommendedFee = await ONLYSwapsSrcClient.fetchRecommendedFee(
        CONFIG.RUSD,
        swapAmount,
        BigInt(CONFIG.SRC_CHAIN_ID),
        BigInt(CONFIG.DEST_CHAIN_ID)
    );
    console.log(`Recommended Fee: ${rusdToString(recommendedFee)}. Proceeding with initial fee: ${rusdToString(initialFee)}`);
  } catch (error) {
      console.warn("Could not fetch recommended fee.");
  }

  // 4. Initiate the swap
  let requestId: `0x${string}`;
  const swapRequest: SwapRequest = {
    recipient: MY_ADDRESS, // Swapping back to ourselves on the destination chain
    tokenAddress: CONFIG.RUSD,
    amount: swapAmount,
    fee: initialFee,
    destinationChainId: BigInt(CONFIG.DEST_CHAIN_ID),
  };

  try {
    console.log("4. Initiating swap...");
    // If we hadn't approved manually in Step 2, we could pass rusdClient here for automatic approval:
    // const response = await ONLYSwapsSrcClient.swap(swapRequest, rusdClient);
    const response = await ONLYSwapsSrcClient.swap(swapRequest);
    requestId = response.requestId;
    console.log(`Swap initiated successfully! Request ID: ${requestId}`);
  } catch (error) {
    console.error("Swap initiation failed.", error);
    return;
  }

  // 5. Demonstrate Fee Bumping
  try {
    console.log("5. Demonstrating fee update...");
    const newFee = initialFee + feeBump;

    // IMPORTANT: If you increase the fee, you must ensure the Router has enough allowance.
    // We must approve the new total (newFee + swapAmount).
    console.log(`Approving new total allowance for the increased fee...`);
    await rusdClient.approveSpend(CONFIG.ROUTER, newFee + swapAmount);

    await ONLYSwapsSrcClient.updateFee(requestId, newFee);
    console.log(`Fee updated to ${rusdToString(newFee)}.`);

    const statusAfterBump = await ONLYSwapsSrcClient.fetchStatus(requestId);
    console.log(`Current Solver Fee on record: ${rusdToString(statusAfterBump.solverFee)}`);

  } catch (error) {
      console.error("Fee update failed (request might already be executed).", error);
  }

  // 6. Polling loop for status tracking
  console.log("6. Starting status tracking... (Polling every 10 seconds)");

  let isComplete = false;
  while (!isComplete) {
    try {
      // Check status on source chain (dcipher verification)
      const status = await ONLYSwapsSrcClient.fetchStatus(requestId);
      // Check receipt on destination chain (Solver fulfillment)
      const receipt = await ONLYSwapsDestClient.fetchReceipt(requestId);

      console.log(`[Status] Source (Executed): ${status.executed}, Destination (Fulfilled): ${receipt.fulfilled}`);

      if (status.executed && receipt.fulfilled) {
        isComplete = true;
        console.log("🎉 Swap workflow complete!");
        console.log(`Amount Out: ${rusdToString(receipt.amountOut)}`);
      } else {
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (error) {
      console.error("Error during status tracking. Retrying...", error);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

main().catch(console.error);
```

To run the script:

```bash
npx ts-node src/execute-swap.ts
```

