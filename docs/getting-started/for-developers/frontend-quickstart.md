---
sidebar_position: 2
title: "Frontend Quickstart"
description: "Build a cross-chain swap UI with React, Next.js, ONLYSwaps-ui, wagmi, and RainbowKit"
keywords: ["frontend", "React", "Next.js", "UI", "wagmi", "RainbowKit", "quickstart"]
date: "2024-01-15"
---

# Frontend Quickstart: React & ONLYSwaps-ui

This guide walks through building a fully functional cross-chain swap UI using React (specifically Next.js), TypeScript, and the `ONLYSwaps-ui` library. We will leverage `wagmi` and RainbowKit for wallet connectivity.

**Objective:** Create a UI that allows users to select chains, enter an amount, mint test RUSD tokens, and execute a cross-chain swap.

## Prerequisites

*   Node.js installed.
*   A package manager (e.g., `npm`, `yarn`, or `pnpm`).
*   A browser wallet (e.g., MetaMask) configured for testnets like Avalanche Fuji and Base Sepolia.

## Step 1: Project Setup

We will start with a standard Next.js project using TypeScript.

```bash
npx create-next-app@latest ONLYSwaps-frontend --typescript --eslint --tailwind --src-dir --app --import-alias="@/*"
cd ONLYSwaps-frontend
````

## Step 2: Install Dependencies

Install the necessary Web3 libraries (`wagmi`, `viem`, RainbowKit) and the ONLYSwaps libraries (`ONLYSwaps-ui`, `ONLYSwaps-js`). We also install `zod` and `@hookform/resolvers` for form validation.

```bash
npm install wagmi viem @rainbow-me/rainbowkit ONLYSwaps-ui ONLYSwaps-js zod @hookform/resolvers react-hook-form
```

## Step 3: Provider Configuration

The `ONLYSwaps-ui` library exports `WagmiRainbowKitProviders`, which wraps Wagmi and RainbowKit. It is automatically configured with the `supportedChains` and `supportedTransports` defined in the library.

Create a `Providers` component that we can use in the root layout.

```tsx
// src/app/providers.tsx
"use client";

import { WagmiRainbowKitProviders } from 'ONLYSwaps-ui';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // WagmiRainbowKitProviders handles WagmiConfig, QueryClient, and RainbowKitProvider setup internally.
  return (
    <WagmiRainbowKitProviders>
      {children}
    </WagmiRainbowKitProviders>
  );
}
```

Now, wrap the application in `src/app/layout.tsx`.

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import Providers from "./providers";
import { ConnectButton } from '@rainbow-me/rainbowkit';
// Remember to import RainbowKit styles if not handled globally
// import '@rainbow-me/rainbowkit/styles.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "ONLYSwaps Frontend Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <ConnectButton />
          </header>
          <main style={{ padding: '1rem' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
```

## Step 4: Build the Swap Component (Form Setup)

We will create the main swap interface. This involves setting up `react-hook-form` and using the validation schemas provided by `ONLYSwaps-ui`.

```tsx
// src/app/SwapForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwapFormSchema, supportedChains, chainConfigs, useONLYSwapsClient } from "ONLYSwaps-ui";
import { z } from "zod";
import { useAccount } from "wagmi";
import { useState } from 'react';
import { rusdFromNumber } from 'ONLYSwaps-js';

type SwapFormData = z.infer<typeof SwapFormSchema>;

export default function SwapForm() {
  const { address, chainId, isConnected } = useAccount();
  const [isSwapping, setIsSwapping] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const form = useForm<SwapFormData>({
    resolver: zodResolver(SwapFormSchema),
    defaultValues: {
      currency: "rusd",
      amount: 0.01,
      fee: 0.01,
      // Initialize chains dynamically if connected, otherwise use defaults
      sourceChain: chainId?.toString() || supportedChains[0].id.toString(),
      destinationChain: supportedChains[1].id.toString(),
    },
  });

  const { register, handleSubmit, formState: { errors }, watch } = form;
  const sourceChainId = watch("sourceChain");
  const sourceChainIdNum = parseInt(sourceChainId);

  // Get the ONLYSwaps client bound to the source chain
  const { ONLYSwaps } = useONLYSwapsClient({ chainId: sourceChainIdNum });

  // Implementation detailed in Step 6
  const onSubmit = async (data: SwapFormData) => {
     if (!ONLYSwaps || !address) {
      alert("Clients not ready or wallet not connected.");
      return;
    }

    setIsSwapping(true);
    setRequestId(null);

    try {
      const srcChainId = parseInt(data.sourceChain);
      const destChainId = parseInt(data.destinationChain);

      // 1. Resolve Token Addresses using chainConfigs
      const srcTokenAddress = chainConfigs[srcChainId].rusd;
      const destTokenAddress = chainConfigs[destChainId].rusd;

      // 2. Convert UI amounts (number) to on-chain units (bigint, 18 decimals)
      const amountBigInt = rusdFromNumber(data.amount);
      const feeBigInt = rusdFromNumber(data.fee);

      // 3. Execute the swap
      const response = await ONLYSwaps.swap({
        recipient: address,
        srcTokenAddress,
        destTokenAddress,
        amount: amountBigInt,
        fee: feeBigInt,
        destinationChainId: BigInt(destChainId),
      });

      setRequestId(response.requestId);
      alert(`Swap initiated successfully! Request ID: ${response.requestId}`);

    } catch (error) {
      console.error("Swap failed:", error);
      alert(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSwapping(false);
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet to swap.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      {/* Source Chain Selector */}
      <div>
        <label>Source Chain</label>
        <select {...register("sourceChain")}>
          {supportedChains.map(chain => (
            <option key={chain.id} value={chain.id.toString()}>{chain.name}</option>
          ))}
        </select>
        {errors.sourceChain && <p style={{ color: 'red' }}>{errors.sourceChain.message}</p>}
      </div>

      {/* Destination Chain Selector */}
      <div>
        <label>Destination Chain</label>
        <select {...register("destinationChain")}>
          {supportedChains.map(chain => (
            <option key={chain.id} value={chain.id.toString()}>{chain.name}</option>
          ))}
        </select>
        {/* Display cross-field validation error (source must differ from destination) */}
        {errors.destinationChain && <p style={{ color: 'red' }}>{errors.destinationChain.message}</p>}
      </div>

      {/* Amount and Fee Inputs */}
      <div>
        <label>Amount (RUSD)</label>
        <input type="number" step="0.01" {...register("amount")} />
        {errors.amount && <p style={{ color: 'red' }}>{errors.amount.message}</p>}
      </div>
      <div>
        <label>Fee (RUSD)</label>
        <input type="number" step="0.01" {...register("fee")} />
        {errors.fee && <p style={{ color: 'red' }}>{errors.fee.message}</p>}
      </div>

       <button type="submit" disabled={!ONLYSwaps || isSwapping}>
           {isSwapping ? 'Swapping...' : 'Execute Swap'}
       </button>
    </form>
  );
}
```

Integrate the `SwapForm` into `src/app/page.tsx`.

```tsx
// src/app/page.tsx
import SwapForm from './SwapForm';

export default function Home() {
  return (
    <div>
      <h1>ONLYSwaps Demo</h1>
      <SwapForm />
    </div>
  );
}
```

## Step 5: Fetching Data & Minting

Before a user can swap, they need RUSD tokens (the test currency). We use the `useRusd` hook from `ONLYSwaps-ui` to check the balance and mint tokens on the selected source chain.

Update `src/app/SwapForm.tsx` to include balance display and minting functionality.

```tsx
// src/app/SwapForm.tsx (Updated - Partial)
"use client";

// ... (other imports)
import { useEffect } from 'react';
import { useRusd } from 'ONLYSwaps-ui';
import { rusdToString } from 'ONLYSwaps-js';

export default function SwapForm() {
  // ... (existing setup: useAccount, useForm, sourceChainIdNum)

  // Get the RUSD client for the source chain
  const { rusd } = useRusd({
    chainId: sourceChainIdNum,
    address: address as `0x${string}`
  });

  const [balance, setBalance] = useState<bigint | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  // Fetch balance
  const fetchBalance = async () => {
    if (!rusd || !address) return;
    const b = await rusd.balanceOf(address);
    setBalance(b);
  };

  useEffect(() => {
    fetchBalance();
  }, [rusd, address, sourceChainIdNum]);

  // Handle minting
  const handleMint = async () => {
    if (!rusd) return;
    setIsMinting(true);
    try {
      await rusd.mint();
      alert("Minting successful! Waiting for confirmation...");
      // Wait briefly then refetch balance
      setTimeout(fetchBalance, 15000);
    } catch (error) {
      alert("Minting failed. Ensure you are on a supported testnet (Fuji or Base Sepolia) and haven't minted recently.");
    } finally {
      setIsMinting(false);
    }
  };

  // Update onSubmit to refetch balance after a successful swap
  const onSubmit = async (data: SwapFormData) => {
      // ... (existing onSubmit logic)
      // After setRequestId(response.requestId);
      await fetchBalance();
      // ...
  };

  // ... (existing checks for isConnected)

  return (
    <div>
      {/* RUSD Balance Manager */}
      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>RUSD Balance</h3>
        <p>Balance: {balance !== null ? rusdToString(balance, 2) : 'Loading...'}</p>
        <button onClick={handleMint} disabled={isMinting || !rusd}>
          {isMinting ? 'Minting...' : 'Mint Test RUSD'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} ...>
        {/* ... (form fields) ... */}
      </form>

      {/* ... (requestId display) ... */}
    </div>
  );
}
```

## Step 6: Executing the Swap

The execution logic was implemented within the `onSubmit` handler in Step 4 and refined in Step 5. Key actions include:

1.  Using `useONLYSwapsClient` to get the client instance.
2.  Validating input using `zodResolver(SwapFormSchema)`.
3.  Converting UI amounts (`number`) to `bigint` using `rusdFromNumber`.
4.  Resolving `srcTokenAddress` and `destTokenAddress` from `chainConfigs`.
5.  Calling `ONLYSwaps.swap()` with the validated request object. The SDK handles the necessary ERC20 approval.

## Step 7: Tracking Status

After initiating the swap, we need to monitor its progress using the `requestId`. We must check the source chain (`fetchStatus`) and the destination chain (`fetchReceipt`).

Create a new component `SwapStatusTracker.tsx`.

```tsx
// src/app/SwapStatusTracker.tsx
"use client";

import { useState, useEffect } from 'react';
import { useONLYSwapsClient } from 'ONLYSwaps-ui';

interface SwapStatusTrackerProps {
  requestId: `0x${string}`;
  sourceChainId: number;
  destinationChainId: number;
}

export default function SwapStatusTracker({ requestId, sourceChainId, destinationChainId }: SwapStatusTrackerProps) {
  const [statusMsg, setStatusMsg] = useState('Pending...');
  const [isComplete, setIsComplete] = useState(false);

  // Get clients for both source and destination chains
  const { ONLYSwaps: onlySrc } = useONLYSwapsClient({ chainId: sourceChainId });
  const { ONLYSwaps: onlyDest } = useONLYSwapsClient({ chainId: destinationChainId });

  useEffect(() => {
    if (!onlySrc || !onlyDest) return;

    const interval = setInterval(async () => {
      try {
        // 1. Poll status on the source chain
        const currentStatus = await onlySrc.fetchStatus(requestId);
        // 2. Poll receipt on the destination chain
        const currentReceipt = await onlyDest.fetchReceipt(requestId);

        let msg = 'Waiting for Fulfillment...';
        if (currentReceipt.fulfilled) msg = 'Fulfilled (Awaiting Verification)';
        if (currentStatus.executed) msg = 'Verified (Executed)';

        setStatusMsg(msg);

        // 3. Stop polling if complete
        if (currentStatus.executed && currentReceipt.fulfilled) {
          setIsComplete(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch status:", err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [onlySrc, onlyDest, requestId]);

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid blue' }}>
      <h4>Swap Tracking</h4>
      <p>Request ID: {requestId.substring(0, 10)}...</p>
      <p>Status: <strong>{statusMsg}</strong></p>
      {isComplete && <p>🎉 Swap Complete!</p>}
    </div>
  );
}
```

Finally, integrate the tracker into the `SwapForm.tsx` when a `requestId` is available.

```tsx
// src/app/SwapForm.tsx (Partial)
import SwapStatusTracker from './SwapStatusTracker';
// ... other imports

export default function SwapForm() {
    // ... (existing component logic)

    return (
        <div>
            {/* ... (Balance Manager and Form) ... */}

            {requestId && (
                <SwapStatusTracker
                    requestId={requestId as `0x${string}`}
                    sourceChainId={parseInt(watch("sourceChain"))}
                    destinationChainId={parseInt(watch("destinationChain"))}
                />
            )}
        </div>
    );
}
```

