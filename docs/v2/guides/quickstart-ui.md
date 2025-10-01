# Quickstart: Building a Swap UI

This guide walks you through setting up a new Next.js project and integrating the `onlyswaps-ui` library to create a functional cross-chain swap interface. We will use React hooks to connect wallets, mint test tokens, and execute a swap.

**Target Audience:** Frontend Developers familiar with React, Next.js, Wagmi, and RainbowKit.

## Prerequisites

*   Node.js and npm/yarn installed.
*   A Web3 wallet (e.g., MetaMask) configured for testnets (e.g., Avalanche Fuji, Base Sepolia).

## 1. Project Setup

Create a new Next.js application:

```bash
npx create-next-app@latest onlyswaps-frontend --typescript --eslint --tailwind --src-dir --app --import-alias "@/*"
cd onlyswaps-frontend
```

Install dependencies, including OnlySwaps libraries and Web3 tooling:

```bash
npm install onlyswaps-ui onlyswaps-js viem wagmi @rainbow-me/rainbowkit @tanstack/react-query
```

## 2. Configure Providers

The `onlyswaps-ui` library provides a pre-configured wrapper, `WagmiRainbowKitProviders`, which sets up Wagmi, React Query, and RainbowKit using the protocol's supported chains and transports.

In your Next.js root layout (`src/app/layout.tsx`), wrap the application with this provider.

```tsx
// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
// Import the provider from the library (adjust the path based on actual library structure)
import WagmiRainbowKitProviders from 'onlyswaps-ui/eth/wagmi-rainbowkit-providers';
import '@rainbow-me/rainbowkit/styles.css'; // Ensure RainbowKit styles are imported

export const metadata: Metadata = {
  title: 'OnlySwaps UI Quickstart',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the application */}
        <WagmiRainbowKitProviders>
          {children}
        </WagmiRainbowKitProviders>
      </body>
    </html>
  );
}
```

## 3. Create the Swap Interface

We will create a comprehensive component that allows connecting a wallet, checking balances, minting test RUSD, selecting a destination chain, and executing the swap.

Create `src/components/SwapInteraction.tsx`:

```tsx
// src/components/SwapInteraction.tsx
'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useOnlySwapsClient } from 'onlyswaps-ui/hooks/useOnlySwaps';
import { useRusd } from 'onlyswaps-ui/hooks/useRusd';
import { chainConfigs, supportedChains } from 'onlyswaps-ui/eth/chains';
import { rusdFromNumber, rusdToString } from 'onlyswaps-js';
import { useState, useEffect } from 'react';

export default function SwapInteraction() {
  const { address, chainId, isConnected } = useAccount();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [destinationChainId, setDestinationChainId] = useState<number | null>(null);

  // Initialize the hooks
  const { onlyswaps } = useOnlySwapsClient({ chainId });
  const { rusd } = useRusd({
    chainId: chainId!,
    address: address as `0x${string}`
  });

  // Helper to fetch/refresh balance
  const refreshData = async () => {
      if (rusd && address) {
          const b = await rusd.balanceOf(address);
          setBalance(b);
      }
  }

  useEffect(() => {
    refreshData();
  }, [rusd, address, chainId]);

  // Mint test RUSD (for testnets)
  const handleMint = async () => {
    if (!rusd) return;
    setIsLoading(true);
    try {
      await rusd.mint();
      alert('Mint successful! Waiting for balance update...');
      // Wait a moment then refresh balance
      setTimeout(refreshData, 5000);
    } catch (error) {
      console.error(error);
      alert('Mint failed. Ensure you are on a supported testnet (e.g., Fuji/Base Sepolia) and respect the faucet cooldown.');
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Swap
  const handleSwap = async () => {
    if (!onlyswaps || !rusd || !address || !chainId || !destinationChainId) {
      alert('Client not ready or parameters missing.');
      return;
    }

    const amount = rusdFromNumber(10); // 10 RUSD
    const fee = rusdFromNumber(0.5);   // 0.5 RUSD fee
    const totalCost = amount + fee;

    if (balance !== null && balance < totalCost) {
        alert('Insufficient balance. Please mint more RUSD.');
        return;
    }

    const tokenAddress = chainConfigs[chainId].rusd;

    setIsLoading(true);
    try {
      // The onlyswaps.swap method handles approval automatically if the RUSD client is provided.
      const response = await onlyswaps.swap({
        recipient: address, // Sending to self on destination
        tokenAddress: tokenAddress,
        amount: amount,
        fee: fee,
        destinationChainId: BigInt(destinationChainId),
      }, rusd); // Pass rusd client for automatic approval

      setRequestId(response.requestId);
      alert(`Swap initiated! Request ID: ${response.requestId}`);
      setTimeout(refreshData, 5000); // Refresh balance after swap
    } catch (error) {
      console.error(error);
      alert('Swap failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to find available destination chains
  const availableDestinations = supportedChains.filter(c => c.id !== chainId);

  return (
    <div className="p-6 border rounded-lg shadow-lg space-y-4 max-w-lg mx-auto mt-10 bg-white">
      <ConnectButton />

      {isConnected && (
        <>
          <h2 className="text-xl font-bold">Swap 10 RUSD</h2>
          <p>Source Chain ID: {chainId}</p>
          <p>RUSD Balance: {balance !== null ? rusdToString(balance) : 'Loading...'}</p>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Destination Chain:</label>
            <select
              className="border p-2 w-full rounded text-black"
              onChange={(e) => setDestinationChainId(Number(e.target.value))}
              value={destinationChainId || ''}
            >
              <option value="" disabled>Select destination</option>
              {availableDestinations.map(chain => (
                <option key={chain.id} value={chain.id}>{chain.name} ({chain.id})</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleMint}
              disabled={isLoading || !rusd}
              className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 flex-1"
            >
              Mint Test RUSD
            </button>
            <button
              onClick={handleSwap}
              disabled={isLoading || !onlyswaps || !rusd || !destinationChainId}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 flex-1"
            >
              {isLoading ? "Processing..." : "Execute Swap"}
            </button>
          </div>

          {requestId && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded text-sm break-all">
              Last Request ID: <code>{requestId}</code>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

## 4. Integrate the Component

Add the `SwapInteraction` component to your main page (`src/app/page.tsx`).

```tsx
// src/app/page.tsx
import SwapInteraction from '@/components/SwapInteraction';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">OnlySwaps UI Quickstart</h1>
      <SwapInteraction />
    </main>
  );
}
```

## 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000). Connect your wallet, switch to a supported testnet (e.g., Avalanche Fuji), mint RUSD, select a destination (e.g., Base Sepolia), and execute the swap.
