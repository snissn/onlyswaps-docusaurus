# Guide: Smart Contract Integration & Upgrades

This page is for Solidity developers and protocol administrators.

## Router: Admin surfaces you’ll use

- **Chain & token mapping**: permit destination chain IDs, then map token pairs `(dstChainId, dstToken, srcToken)` before allowing swaps.  
  ```solidity
  function permitDestinationChainId(uint256 chainId) external;
  function setTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
  ```

Reverts on unsupported chain or duplicate mapping. 

* **Verify & settle (solver side)**: after the solver relays tokens on the destination chain, settle on the source chain using BLS message bytes from `swapRequestParametersToBytes` and call `rebalanceSolver(solver, requestId, sig)`. 

* **Fees & versioning**: `withdrawVerificationFee`, `getVersion()` (implementation version checks are enforced to prevent same‑version upgrades).  

## Upgrade model (UUPS + BLS gating)

OnlySwaps contracts are upgradeable via **UUPS** with **BLS (BN254)‑gated** authorization and a **minimum upgrade delay**. Admin actions are authorized by domain‑separated messages built on‑chain and signed off‑chain. 

### ScheduledUpgradeable API (excerpt)

```solidity
function scheduleUpgrade(address newImplementation, bytes calldata upgradeCalldata, uint256 upgradeTime, bytes calldata signature) external;
function cancelUpgrade(bytes calldata signature) external;
function executeUpgrade() external;

// Message formation helpers
function contractUpgradeParamsToBytes(
  string memory action,
  address pendingImplementation,
  address newImplementation,
  bytes memory upgradeCalldata,
  uint256 upgradeTime,
  uint256 nonce
) external view returns (bytes memory message, bytes memory messageAsG1Bytes);
function blsValidatorUpdateParamsToBytes(address blsValidator, uint256 nonce) external view returns (bytes memory, bytes memory);
```

Use these helpers to compute the exact bytes to sign; signatures use the BN254 scheme and include nonces and chain IDs to prevent replay. Enforce `upgradeTime ≥ now + minimumContractUpgradeDelay` (default ≥ 2 days). 

### End‑to‑end: Schedule → Execute an upgrade

```ts
import { ethers } from "ethers";

const abi = [
  "function contractUpgradeParamsToBytes(string,address,address,bytes,uint256,uint256) view returns (bytes,bytes)",
  "function scheduleUpgrade(address,bytes,uint256,bytes)",
  "function executeUpgrade()",
  "function getImplementation() view returns (address)",
];

const rpc = new ethers.JsonRpcProvider(process.env.RPC_URL);
const proxy = new ethers.Contract(process.env.ROUTER_PROXY!, abi, new ethers.Wallet(process.env.ADMIN_KEY!, rpc));

// 1) Build message bytes for 'schedule'
const action = "schedule";
const pendingImpl = await proxy.getAddress(); // or 0x0
const newImpl = process.env.NEW_IMPL!;
const calldata = "0x";
const minDelaySecs = 2n * 24n * 60n * 60n;
const T = BigInt(Math.floor(Date.now()/1000)) + minDelaySecs + 1n;
const nonce = 1n; // typically currentNonce()+1

const [message, g1] = await proxy.contractUpgradeParamsToBytes(action, pendingImpl, newImpl, calldata, T, nonce);

// 2) Sign `g1` off‑chain with your BN254 BLS key (committee side), obtain `signature`
// 3) Call scheduleUpgrade(newImpl, calldata, T, signature)
// 4) After T, call executeUpgrade(); verify new implementation address / Router.getVersion()
```

This flow is enforced by `ScheduledUpgradeable`; attempts to bypass delay or reuse version will revert (`UpgradeTimeMustRespectDelay`, `SameVersionUpgradeNotAllowed`).  

### Custom Errors (debugging)

`ErrorsLib` centralizes precise revert reasons (e.g., `BLSSignatureVerificationFailed`, `DestinationChainIdNotSupported`, `SameVersionUpgradeNotAllowed`). Use them in tests and error decoding. 

### Solver settlement messages

Solvers derive message bytes via `swapRequestParametersToBytes(requestId, solver)` and present the signature in `rebalanceSolver`. 

> **FAQ**
>
> * **Default min. upgrade delay?** Two days; adjust via `setMinimumContractUpgradeDelay`.
> * **Where do I get bytes to sign?** `contractUpgradeParamsToBytes` / `blsValidatorUpdateParamsToBytes`.
> * **How to map tokens?** `permitDestinationChainId(dst)` then `setTokenMapping(dst, dstToken, srcToken)`. 

