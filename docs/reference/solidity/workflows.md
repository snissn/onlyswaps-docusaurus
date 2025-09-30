---
title: Common Workflows
---

# Common Workflows

## Deploy validators and Router behind UUPS

1. Deploy BN254 swap‑request validator with application='swap-v1'.
2. Deploy BN254 upgrade validator with application='upgrade-v1'.
3. Deploy Router implementation via CREATE2, then UUPSProxy, then call initialize(owner, swapBLS, upgradeBLS, feeBps).
4. Persist addresses to JSON (`DEPLOYMENT_CONFIG_DIR/<chainId>.json`) for later scripts.

## Configure Router for a destination chain and token mapping

1. permitDestinationChainId(dstChainId) as ADMIN.
2. setTokenMapping(dstChainId, dstToken, srcToken). Reverts if chain not permitted or mapping exists.

## Form a swap message and relay/settle

1. On source chain, after SwapRequested, call swapRequestParametersToBytes(requestId, solver) to get message/g1Bytes.
2. Sign g1Bytes with solver’s BN254 key.
3. On dest chain, relayTokens(tokenDst, recipient, amount, requestId, srcChainId).
4. On source chain, rebalanceSolver(solver, requestId, sigBytes) to settle fees.

## Schedule → execute a UUPS upgrade

1. Compute message via contractUpgradeParamsToBytes('schedule', pendingImpl, newImpl, calldata, T, nonce).
2. Sign off‑chain (BN254) and call scheduleUpgrade(..., signature). Enforce T ≥ now + minimumContractUpgradeDelay.
3. After timestamp passes, call executeUpgrade(). Verify new getImplementation() and Router.getVersion().

## Update BLS validators (admin)

1. Build validator‑update message via blsValidatorUpdateParamsToBytes(newValidator, nonce).
2. Sign and call setContractUpgradeBlsValidator(newValidator, signature) or Router.setSwapRequestBlsValidator(...) as applicable.

## Withdraw verification fees

1. Call withdrawVerificationFee(token, to) as ADMIN; reverts if balance is zero. Track per‑token balances off‑chain.
