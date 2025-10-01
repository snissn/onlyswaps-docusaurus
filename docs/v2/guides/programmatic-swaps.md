# Guide: Programmatic Swaps with `onlyswaps-js`

This guide demonstrates how to use the `onlyswaps-js` SDK to interact with the OnlySwaps protocol programmatically. This is ideal for backend services, scripts, or bots.

We will cover initializing the clients, minting test RUSD tokens, and executing a cross-chain swap using Viem.

**Target Audience:** Backend Developers and Scripters familiar with TypeScript and Viem.

## Prerequisites

*   Node.js environment set up.
*   `onlyswaps-js` and `viem` installed (`npm install onlyswaps-js viem`).
*   Access to RPC endpoints for the target chains.
*   A private key with funds for gas.

## Core Concepts

> **Important:** All token amounts and fees in `onlyswaps-js` are treated as 18-decimal fixed-point integers (`bigint`). Always use the provided [RUSD helpers](../reference/js-sdk/helpers.md) for conversion.

The SDK provides two main classes:
1.  **`RUSDViemClient`:** For ERC-20 interactions (minting, balances, approvals).
2.  **`OnlySwapsViemClient`:** For Router interactions (swaps, fee updates, status checks).

## Example: End-to-End Swap Script

The following script demonstrates a complete swap flow. We will use a local Foundry (Anvil) environment for demonstration purposes, based on the example provided in the specification.

```typescript
import { createPublicClient, createWalletClient, http, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains"; // Local Anvil chain
import {
  OnlySwapsViemClient,
  RUSDViemClient,
  type SwapRequest,
  rusdFromNumber,
  rusdToString
} from "onlyswaps-js";

// Configuration for local Anvil/Foundry environment (from spec 0.3.03.yaml)
const ANVIL_RPC = "http://localhost:31337";
// Pre-funded private key provided by Anvil
const PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

// REPLACE with actual deployed addresses on your network (from spec 0.3.03.yaml)
const RUSD_ADDRESS = "0xEFdbe33D9014FFde884Bf055D5202e3851213805" as const;
const ROUTER_ADDRESS = "0x3d86B64a0f09Ca611edbcfB68309dFdEed87Ad89" as const;

const DESTINATION_CHAIN_ID = 1338n; // Example destination chain ID

async function executeSwap() {
  console.log("Initializing clients...");

  // 1. Initialize Viem Clients
  const account = privateKeyToAccount(PRIVATE_KEY);
  const publicClient = createPublicClient({ chain: foundry, transport: http(ANVIL_RPC) });
  const walletClient = createWalletClient({ chain: foundry, transport: http(ANVIL_RPC), account });

  const MY_ADDRESS = account.address;

  // 2. Initialize OnlySwaps Clients
  const rusdClient = new RUSDViemClient(MY_ADDRESS, RUSD_ADDRESS, publicClient, walletClient);
  const onlySwapsClient = new OnlySwapsViemClient(MY_ADDRESS, ROUTER_ADDRESS, publicClient, walletClient);

  // 3. Mint Test RUSD (for testing environments)
  console.log("Minting RUSD...");
  try {
    await rusdClient.mint();
    const balance = await rusdClient.balanceOf(MY_ADDRESS);
    console.log(`RUSD Balance: ${rusdToString(balance)}`);
  } catch (error) {
    console.error("Failed to mint RUSD.", error);
    // Continue if minting fails, assuming existing balance might be sufficient
  }

  // 4. Define Swap Parameters
  const swapAmount = rusdFromNumber(100); // 100 RUSD
  const swapFee = rusdFromNumber(1);      // 1 RUSD fee

  const request: SwapRequest = {
    recipient: MY_ADDRESS, // Swapping back to ourselves on the destination chain
    tokenAddress: RUSD_ADDRESS,
    amount: swapAmount,
    fee: swapFee,
    destinationChainId: DESTINATION_CHAIN_ID,
  };

  // 5. Execute Swap
  // The `swap` method automatically handles the approval for `amount + fee`
  // when the RUSD client is provided as the second argument.
  console.log("Initiating swap (includes approval)...");
  try {
    const { requestId } = await onlySwapsClient.swap(request, rusdClient);
    console.log(`Swap successfully initiated. Request ID: ${requestId}`);

    // 6. Track Status
    await trackStatus(onlySwapsClient, requestId);

  } catch (error) {
    console.error("Swap initiation failed:", error);
  }
}

async function trackStatus(client: OnlySwapsViemClient, requestId: `0x${string}`) {
  console.log(`Fetching status for ${requestId}...`);
  const status = await client.fetchStatus(requestId);
  console.log(`Status: ${status.executed ? "Executed (Verified)" : "Pending"}`);
  console.log(`Solver Fee: ${rusdToString(status.solverFee)}`);

  // Example: Updating the fee if pending
  if (!status.executed) {
    const newFee = status.solverFee + rusdFromNumber(0.5);
    console.log(`Swap pending. Updating fee to ${rusdToString(newFee)}...`);
    await client.updateFee(requestId, newFee);
    const updatedStatus = await client.fetchStatus(requestId);
    console.log(`Fee updated to: ${rusdToString(updatedStatus.solverFee)}`);
  }
}

executeSwap().catch(console.error);
```

