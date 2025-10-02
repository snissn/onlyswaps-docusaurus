---
sidebar_position: 2
---

# Frontend Quickstart (React)

Goal: Ship a cross‑chain swap UI with Next.js, `ONLYSwaps-ui`, and `ONLYSwaps-js`.

## Prerequisites

- Node.js ≥ 18, a package manager (pnpm/npm/yarn), and a browser wallet (e.g., MetaMask).
- RPC access to at least two supported chains in test/dev.

## 1) Create the app

```bash
# with Next.js + TypeScript
npx create-next-app@latest ONLYSwaps-portal --ts
cd ONLYSwaps-portal
```

## 2) Install dependencies

```bash
# pick your manager; here: pnpm
pnpm add wagmi viem @rainbow-me/rainbowkit zod react-hook-form
pnpm add ONLYSwaps-ui ONLYSwaps-js
```

## 3) Providers & chain config

Mount Wagmi + RainbowKit using the ready‑made provider and chain helpers:

```tsx
// app/providers.tsx
'use client';
import { ReactNode } from 'react';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { supportedChains, supportedTransports } from 'ONLYSwaps-ui';

const wagmi = createConfig({
  chains: supportedChains,
  transports: supportedTransports,
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmi}>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
```

```tsx
// app/layout.tsx
import Providers from './providers';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body><Providers>{children}</Providers></body></html>
  );
}
```

Use `supportedChains` and `supportedTransports` from `ONLYSwaps-ui` to avoid per‑chain boilerplate. 

## 4) Build a swap form

Validate inputs with `SwapFormSchema` and `zodResolver`, then call `ONLYSwaps.swap()`.

```tsx
// app/swap/SwapForm.tsx
'use client';
import * as React from 'react';
import { useAccount } from 'wagmi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { rusdFromString } from 'ONLYSwaps-js';
import { useONLYSwapsClient } from 'ONLYSwaps-ui';
import { supportedChains, chainConfigs } from 'ONLYSwaps-ui';
import { SwapFormSchema } from 'ONLYSwaps-ui';
import type { z } from 'zod';

type FormValues = z.infer<typeof SwapFormSchema>;

export default function SwapForm() {
  const { address, chainId } = useAccount();
  const { ONLYSwaps } = useONLYSwapsClient({ chainId });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(SwapFormSchema),
    defaultValues: {
      currency: 'rusd',
      sourceChain: String(chainId ?? supportedChains[0].id),
      destinationChain: String(supportedChains[0].id),
      amount: 10.00,
      fee: 0.25,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!ONLYSwaps || !address) return;

    const src = Number(data.sourceChain);
    const dst = Number(data.destinationChain);

    const srcTokenAddress = chainConfigs[src].rusd;
    const destTokenAddress = chainConfigs[dst].rusd;

    const amount = rusdFromString(String(data.amount));
    const fee    = rusdFromString(String(data.fee));

    const { requestId } = await ONLYSwaps.swap({
      recipient: address,
      srcTokenAddress,
      destTokenAddress,
      amount,
      fee,
      destinationChainId: BigInt(dst),
    });

    console.log('requestId', requestId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* chain selects and amount/fee inputs */}
      <button type="submit">Swap</button>
      {errors.destinationChain && <p>{errors.destinationChain.message}</p>}
    </form>
  );
}
```

* `SwapFormSchema` enforces valid amounts (2dp UI), distinct source/destination chains, and supported chain IDs. 
* Read token/router addresses from `chainConfigs` and never hard‑code them. 
* Convert UI numbers to 18‑dp `bigint` using `rusdFromString`/`rusdFromNumber`.  

## 5) Fetch balances & mint test tokens

Use `useRusd` and `useAccount` to read balances and optionally mint from the faucet token on supported testnets.

```tsx
import * as React from 'react';
import { useAccount } from 'wagmi';
import { useRusd } from 'ONLYSwaps-ui';

export function RusdBalance() {
  const { address, chainId } = useAccount();
  const { rusd } = useRusd({ chainId: chainId!, address: address as `0x${string}` });

  const [balance, setBalance] = React.useState<bigint | null>(null);

  React.useEffect(() => {
    (async () => {
      if (!rusd || !address) return;
      const b = await rusd.balanceOf(address);
      setBalance(b);
    })();
  }, [rusd, address]);

  return <div>RUSD: {balance?.toString() ?? '…'}</div>;
}
```

`useRusd` returns a viem‑backed RUSD client; on test chains you can call `rusd.mint()` for faucet minting.  

## 6) Execute the swap

We already called `ONLYSwaps.swap(...)` in step 4. The hook returns `{ ONLYSwaps, walletClient }` once providers/wallet are ready. Guard for `undefined`. 

## 7) Track status across chains

Capture `requestId` and poll:

```tsx
import { useEffect, useState } from 'react';
import { useONLYSwapsClient } from 'ONLYSwaps-ui';

export function Track({ requestId, srcChainId, dstChainId }:
  { requestId: `0x${string}`; srcChainId: number; dstChainId: number }) {

  const { ONLYSwaps: src } = useONLYSwapsClient({ chainId: srcChainId });
  const { ONLYSwaps: dst } = useONLYSwapsClient({ chainId: dstChainId });
  const [executed, setExecuted] = useState(false);
  const [fulfilled, setFulfilled] = useState(false);

  useEffect(() => {
    let t = setInterval(async () => {
      if (src) {
        const s = await src.fetchStatus(requestId);
        setExecuted(s.executed);
      }
      if (dst) {
        const r = await dst.fetchReceipt(requestId);
        setFulfilled(r.fulfilled);
      }
    }, 3000);
    return () => clearInterval(t);
  }, [src, dst, requestId]);

  return <div>executed={String(executed)} fulfilled={String(fulfilled)}</div>;
}
```

Use `fetchStatus` on the source chain (watch `executed`, `solverFee`, `verificationFee`) and `fetchReceipt` on the destination chain (watch `fulfilled`, `amountOut`).  

