# UI Library Reference: Hooks

This document details the React hooks provided by `onlyswaps-ui`.

## useOnlySwapsClient

A React hook that returns an initialized `OnlySwaps` client (`OnlySwapsViemClient`) and the underlying Viem `WalletClient`, bound to the active chain or a specified `chainId`.

### Definition

```typescript
import { WalletClient } from "viem";
import { OnlySwaps } from "onlyswaps-js";

export type UseOnlySwapsProps = {
  chainId?: number
}

export type UseOnlySwapsReturn = {
    walletClient?: WalletClient
    onlyswaps?: OnlySwaps,
}

export function useOnlySwapsClient(props: UseOnlySwapsProps = {}): UseOnlySwapsReturn
```

### Guidance

  * Must be used within a component wrapped by the Wagmi providers.
  * The `onlyswaps` and `walletClient` fields will be `undefined` until the wallet is connected and the clients are ready.
  * Pass an explicit `chainId` in `props` to target a specific network, overriding the user's active wallet chain if necessary.

### Example

```tsx
import { useOnlySwapsClient } from "onlyswaps-ui/hooks/useOnlySwaps";

export default function SwapStatus() {
  const { onlyswaps } = useOnlySwapsClient();

  const checkStatus = async (requestId: string) => {
    if (!onlyswaps) return;
    const status = await onlyswaps.fetchStatus(requestId);
    console.log("Status:", status);
  };

  return (
    <button onClick={() => checkStatus("0x...")} disabled={!onlyswaps}>
      Check Status
    </button>
  );
}
```

-----

## useRusd

A React hook that returns an initialized RUSD client (`RUSDViemClient`) bound to a specific chain and wallet address.

### Definition

```typescript
import { RUSD } from "onlyswaps-js";

type UseRusdProps = {
  chainId: number
  address?: `0x${string}`
}

type UseRusdReturn = {
  rusd?: RUSD
}

export function useRusd(props: UseRusdProps): UseRusdReturn
```

### Guidance

  * Requires `chainId` and the user's `address` (typically from `useAccount`).
  * The `rusd` field will be `undefined` until the clients are ready.
  * Useful for checking balances, approving spend, and minting test tokens.

### Example

```tsx
import { useRusd } from "onlyswaps-ui/hooks/useRusd";
import { useAccount } from "wagmi";
import { rusdToString } from "onlyswaps-js";
import React from "react";

export function RusdBalance() {
  const { address, chainId } = useAccount();
  const { rusd } = useRusd({ chainId: chainId!, address: address });
  const [balance, setBalance] = React.useState<bigint | null>(null);

  // ... useEffect to fetch balance ...

  return (
    <div>
      RUSD balance: {balance !== null ? rusdToString(balance) : "Loading..."}
    </div>
  );
}
```
