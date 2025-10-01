# Quickstart: Building a Swap UI (Next.js + Wagmi + RainbowKit)

This tutorial gets you from zero to a working cross‑chain swap UI using `onlyswaps-ui` hooks and `onlyswaps-js` helpers.

## 1) Create the project

~~~bash
npx create-next-app@latest onlyswaps-ui --ts --eslint
cd onlyswaps-ui
npm i onlyswaps-ui onlyswaps-js wagmi viem @rainbow-me/rainbowkit zod
~~~

## 2) Configure Wagmi & RainbowKit

Use OnlySwaps’ exported chain helpers to avoid address drift across chains.

~~~tsx
// app/providers.tsx
"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { supportedChains, supportedTransports } from "onlyswaps-ui";

const config = createConfig({
  chains: supportedChains,
  transports: supportedTransports, // matches supportedChains
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider chains={supportedChains}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
~~~

`supportedChains` and `supportedTransports` are derived from `chainConfigs` in the UI package; use them to seed Wagmi/RainbowKit.  

## 3) Add the swap button

~~~tsx
// app/swap/SwapButton.tsx
"use client";
import * as React from "react";
import { useAccount } from "wagmi";
import { rusdFromNumber } from "onlyswaps-js";
import { useOnlySwapsClient } from "onlyswaps-ui";
import { chainConfigs } from "onlyswaps-ui";

export default function SwapButton() {
  const { address, chainId } = useAccount();
  const { onlyswaps } = useOnlySwapsClient({ chainId });

  const onClick = async () => {
    if (!onlyswaps || !address || !chainId) return;

    const srcTokenAddress = chainConfigs[chainId].rusd;
    const destChainId = chainId; // demo: choose a different chain in real flows
    const destTokenAddress = chainConfigs[destChainId].rusd;

    const { requestId } = await onlyswaps.swap({
      recipient: address,
      tokenAddress: srcTokenAddress,
      amount: rusdFromNumber(1),
      fee: rusdFromNumber(0.1),
      destinationChainId: BigInt(destChainId),
    });

    console.log("swap requestId:", requestId);
  };

  return <button onClick={onClick}>Swap 1 RUSD</button>;
}
~~~

`useOnlySwapsClient` returns a viem‑backed client bound to the current chain; values may be undefined until Wagmi is ready—guard your calls. 

## 4) Validate form input with zod

~~~ts
// app/swap/validation.ts
import { z } from "zod";
import { amountSchema, chainIdSchema, currencySchema } from "onlyswaps-ui";

export const SwapFormSchema = z.object({
  srcChainId: chainIdSchema,
  dstChainId: chainIdSchema,
  amount: amountSchema,
  currency: currencySchema,
}).refine(
  (v) => v.srcChainId !== v.dstChainId,
  { message: "Source and destination must differ", path: ["dstChainId"] }
);
~~~

`amountSchema`, `chainIdSchema`, and `currencySchema` keep user inputs safe and consistent with supported chains/currencies. Use the package’s `SwapFormSchema` if available in your version. 

## 5) Track status & receipt

Poll the source chain for `executed` and the destination chain for `fulfilled` to show end‑to‑end progress. 

> **Troubleshooting**
>
> * Hook returns `{}` → Wait for Wagmi connection; render guards.
> * Fee/amount off by 10^x → Convert to/from 18‑dp `bigint` via helpers (`rusdFromNumber`, `rusdToString`).
> * Same chain picked twice → enforce with `SwapFormSchema` refinement. 
