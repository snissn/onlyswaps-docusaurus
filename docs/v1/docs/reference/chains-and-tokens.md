---
sidebar_position: 2
---

# Supported chains & tokens

Use `chainConfigs` as the source of truth for supported networks and contract addresses in your app. Do not hard‑code addresses. :contentReference[oaicite:67]{index=67}

| Chain (viem)        | Router address                              | RUSD address                                |
|---------------------|----------------------------------------------|---------------------------------------------|
| Avalanche           | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |
| Base                | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |
| Avalanche Fuji      | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |
| Base Sepolia        | `0x4cB630aAEA9e152db83A846f4509d83053F21078` | `0x1b0F6cF6f3185872a581BD2B5a738EB52CCd4d76` |

(Shown here from a snapshot for convenience—always read from `chainConfigs` at runtime.) :contentReference[oaicite:68]{index=68}

You can import the helpers:

```ts
import { chainConfigs, supportedChains, supportedTransports } from 'ONLYSwaps-ui';
```

* `supportedChains` drives Wagmi/RainbowKit config. 
* `supportedTransports` is a per‑chain default HTTP transport map. 

## Adding new chains/tokens (admin)

On the Router:

1. Permit the destination chain ID: `permitDestinationChainId(dstChainId)`
2. Map the token pair (dst ↔ src): `setTokenMapping(dstChainId, dstToken, srcToken)`

Calls revert if the chain isn’t permitted or a mapping exists. 

> See also: `blockDestinationChainId`, `removeTokenMapping`, and `withdrawVerificationFee` for lifecycle management. 

