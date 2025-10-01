# UI Library Reference: Configuration and Providers

`onlyswaps-ui` provides centralized configuration objects and React context providers for consistent setup.

## Chain Configuration

### chainConfigs

A record mapping supported chain IDs to their configurations, including contract addresses and Viem `Chain` objects.

```typescript
import { Chain } from "viem";

type ChainConfig = {
  router: `0x${string}` // Router contract address
  rusd: `0x${string}`   // RUSD token address
  chain: Chain
}

export const chainConfigs: Record<number, ChainConfig>;
// Example (from spec):
// [avalancheFuji.id]: {
//   router: "0x4cB630aAEA9e152db83A846f4509d83053F21078",
//   rusd:   "0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76",
//   chain: avalancheFuji
// }
```

  * **Guidance:** Always reference contract addresses via this map. Do not hard-code addresses.

### supportedChains

A tuple of Viem `Chain` objects derived from `chainConfigs`. Used to configure Wagmi and RainbowKit.

```typescript
export const supportedChains: [Chain, ...Chain[]];
```

### SupportedChainId

A TypeScript union type representing the IDs of all supported networks.

```typescript
type SupportedChainId = (typeof supportedChains)[number]["id"];
```

### supportedTransports

A record mapping each supported chain ID to a default Viem transport (e.g., `http()`).

```typescript
export const supportedTransports: Record<SupportedChainId, Transport>;
```

## Providers

### WagmiRainbowKitProviders

A top-level provider component that sets up the necessary context for Wagmi, React Query, and RainbowKit, configured using `supportedChains` and `supportedTransports`.

```typescript
export default function WagmiRainbowKitProviders({ children }: { children: ReactNode });
```

  * **Guidance:** Mount this once near the root of your application (e.g., in Next.js `layout.tsx`).

### Providers

An application-level wrapper that typically composes `WagmiRainbowKitProviders` with other providers (e.g., `ThemeProvider`).

```typescript
export default function Providers({ children }: { children: ReactNode });
```
