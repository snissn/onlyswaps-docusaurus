---
sidebar_position: 3
title: "Fee Structure"
description: "Learn about ONLYSwaps transparent fee structure including solver fees, verification fees, and how fees are calculated and distributed"
keywords: ["fees", "solver fee", "verification fee", "BPS", "gas costs", "dcipher committee"]
date: "2024-01-15"
---

# Fee Structure

The ONLYSwaps protocol incorporates a transparent fee structure designed to incentivize participation from both liquidity providers (Solvers) and the decentralized verification network (dcipher committee). Fees are paid by the user initiating the swap and are denominated in the token being transferred.

## Overview

When a user initiates a swap, the total amount locked on the source chain is `Swap Amount + Total Fee`. The total fee is divided into two components: the Verification Fee and the Solver Fee.

### 1. Solver Fee

**Purpose:** To compensate the Solver for providing immediate liquidity on the destination chain and taking on the associated risks and gas costs.

**Calculation:** The Solver Fee is dynamic and market-driven. Users set this fee when initiating the swap.

*   **Incentives:** If the fee is too low, Solvers may not find the transaction profitable, leading to delays.
*   **Dynamic Updates:** Users can dynamically increase the fee for a pending swap using the `updateFee()` function (accessible via the SDK or UI) to incentivize faster fulfillment.

**Fee Recommendation:** ONLYSwaps provides a centralized Fees API (accessible via `ONLYSwaps.fetchRecommendedFee()` in the SDK) that monitors gas prices, liquidity, and fulfillment rates to suggest an optimal fee.

### 2. Verification Fee

**Purpose:** To compensate the dcipher committee members for monitoring the chains, generating threshold signatures, and verifying the fulfillment of the swap.

**Calculation:** The Verification Fee is calculated as a percentage (Basis Points, BPS) of the swap `amount`.

*   The percentage is configured in the `Router` contract via the `verificationFeeBps` state variable.
*   The protocol enforces a maximum limit via `MAX_FEE_BPS` (currently 5,000 BPS or 50%).
*   The `BPS_DIVISOR` is 10,000.

```solidity
// Calculation logic (conceptual)
verificationFee = (amount * verificationFeeBps) / BPS_DIVISOR;
````

**Collection and Withdrawal:** Verification fees accumulate in the Router contract. The contract administrator (`ADMIN_ROLE`) can withdraw these accrued fees using the `withdrawVerificationFee()` function.

## Summary

The final distribution of funds upon successful swap completion is:

  * **User Receives:** `Swap Amount` (on the destination chain).
  * **Solver Receives:** `Swap Amount` + `Solver Fee` (on the source chain).
  * **Protocol Retains:** `Verification Fee` (on the source chain).

<!-- end list -->


