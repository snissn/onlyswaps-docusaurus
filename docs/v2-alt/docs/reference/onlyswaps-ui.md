# `onlyswaps-ui` Reference

Typed React hooks, chain configuration, and zod schemas for building a production swap UI.

Install

~~~bash
npm i onlyswaps-ui
~~~

---

## Hooks

### `useOnlySwapsClient`

**Purpose**: Returns an OnlySwaps client and WalletClient bound to the current (or provided) chain.  
**Signature**:  
~~~ts
export type UseOnlySwapsProps = { chainId?: number };
export type UseOnlySwapsReturn = {
  walletClient?: WalletClient;
  onlyswaps?: OnlySwaps;
};
export function useOnlySwapsClient(props?: UseOnlySwapsProps): UseOnlySwapsReturn;
~~~

Call inside a React component wrapped by Wagmi/RainbowKit providers. Returns `{ onlyswaps, walletClient }` once ready; otherwise fields may be `undefined`. Pass an explicit `chainId` to target a specific network. 

**Example**

~~~tsx
import { useAccount } from "wagmi";
import { rusdFromNumber } from "onlyswaps-js";
import { useOnlySwapsClient } from "onlyswaps-ui";
import { chainConfigs } from "onlyswaps-ui";

export function SwapButton() {
  const { address, chainId } = useAccount();
  const { onlyswaps } = useOnlySwapsClient({ chainId });

  const onClick = async () => {
    if (!onlyswaps || !address || !chainId) return;
    const srcTokenAddress = chainConfigs[chainId].rusd;
    const destChainId = chainId;
    const { requestId } = await onlyswaps.swap({
      recipient: address,
      tokenAddress: srcTokenAddress,
      amount: rusdFromNumber(1),
      fee: rusdFromNumber(0),
      destinationChainId: BigInt(destChainId),
    });
    console.log("requestId:", requestId);
  };
  return <button onClick={onClick}>Swap</button>;
}
~~~



---

### `useRusd`

**Purpose**: Returns an RUSD client bound to a chain for a wallet address.
**Signature**:

~~~ts
type UseRusdProps = { chainId: number; address?: `0x${string}` };
type UseRusdReturn = { rusd?: RUSD };
export function useRusd(props: UseRusdProps): UseRusdReturn;
~~~

Provide `chainId` and `address`; returns `{}` until clients are ready. Resolve token address via `chainConfigs[chainId].rusd`. Use `onlyswaps-js` helpers for 18‑dp conversions. 

**Example**

~~~tsx
import { useRusd } from "onlyswaps-ui";
import { useAccount } from "wagmi";
export function RusdBalance() {
  const { address, chainId } = useAccount();
  const { rusd } = useRusd({ chainId: chainId!, address: address as `0x${string}` });
  // ...
}
~~~



---

## Chain configuration

### `chainConfigs`

Per‑chain config: router & RUSD addresses and viem `Chain` object. Always read addresses from here—do not hard‑code. 

### `supportedChains`

Tuple of supported `Chain` objects derived from `chainConfigs`. Use when creating Wagmi/RainbowKit configs. 

### `SupportedChainId`

Union type of supported chain IDs inferred from `supportedChains`. Safer than `number` for IDs used in forms and state. 

### `supportedTransports`

Record mapping each supported chain ID to a default HTTP transport; pass to `wagmi/createConfig({ chains, transports })`. 

---

## UI Schemas (zod)

* `currencySchema` — enum of supported currencies (currently `"rusd"`). 
* `chainIdSchema` — enum of supported chain IDs as strings; inferred from `supportedChains`. 
* `amountSchema` — number coercion with 2‑dp validation and sensible bounds; use for UI inputs. 
* `SwapFormSchema` — cross‑field validation for swap forms (e.g., prevent same source/destination); use with `zodResolver`. 

**FAQ & Troubleshooting**

* “Which chains are supported?” → The set in `chainConfigs` and surfaced via `supportedChains`.
* “Why does my hook return `{}`?” → Clients not ready; guard renders until defined.
* “Amounts look wrong on‑chain.” → Convert UI numbers to 18‑dp `bigint` with `rusdFromNumber`. 
