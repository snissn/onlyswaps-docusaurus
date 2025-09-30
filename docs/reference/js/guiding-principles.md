---
title: Guiding Principles
---

# Guiding Principles

> Use viem’s `PublicClient` (reads) and `WalletClient` (writes) against the same chain; keep chain configuration consistent between both.
>
> Treat all token values as 18‑decimal fixed‑point integers (bigint). Convert inputs with `rusdFromString`/`rusdFromNumber` and format for UI with `rusdToString`.
>
> Always approve the Router as spender before calling a swap; the `swap` path performs an approval of `amount + fee` for safety.
>
> Use `fetchRecommendedFee` to seed a reasonable `fee`, then update with `updateFee` if network conditions change. Units are RUSD (18 dp).
>
> After sending a swap, rely on the emitted `SwapRequested` event to obtain `requestId`; handle the edge case where no event is found.
>
> Differentiate status on source chain (`fetchStatus`) vs. fulfillment on destination chain (`fetchReceipt`); `executed` (status) vs. `fulfilled` (receipt) mean different things.
>
> For clearer error messages on failed writes, simulate and decode revert data (as done by `throwOnError`) instead of surfacing generic failures.

## Design Notes

This page distills patterns from the TypeScript sources and tests. Contracts and router interactions come from `onlyswaps-js` router client; RUSD client and 18‑dp helpers from the same package; request/receipt types from the model; integration usage patterns from tests. The structure aims to keep code identifiers authoritative while adding practical guidance.

