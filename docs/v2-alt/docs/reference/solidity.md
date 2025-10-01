# `onlyswaps/solidity` Reference

Upgradeable Router + BLS‑gated admin flows and helper libraries. Keep Router behind a **UUPS proxy** and authorize sensitive actions via **BN254 BLS** signatures. :contentReference[oaicite:95]{index=95}

---

## Router (public/external API, distilled)

```solidity
contract Router /* ... */ {
  // Roles & constants
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  uint256 public constant BPS_DIVISOR = 10_000;
  uint256 public constant MAX_FEE_BPS = 5_000;

  // Config
  uint256 public verificationFeeBps;
  ISignatureScheme public swapRequestBlsValidator;

  // Init
  function initialize(
    address _owner,
    address _swapRequestBlsValidator,
    address _contractUpgradeBlsValidator,
    uint256 _verificationFeeBps
  ) public initializer;

  // Admin: chains & tokens
  function permitDestinationChainId(uint256 chainId) external;
  function blockDestinationChainId(uint256 chainId) external;
  function setTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
  function removeTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;

  // Fees
  function withdrawVerificationFee(address token, address to) external;

  // BLS validator admin (overrides ScheduledUpgradeable)
  function setContractUpgradeBlsValidator(address _contractUpgradeBlsValidator, bytes calldata signature) public;

  // Upgrades (ScheduledUpgradeable)
  function scheduleUpgrade(address newImplementation, bytes calldata upgradeCalldata, uint256 upgradeTime, bytes calldata signature) public;
  function cancelUpgrade(bytes calldata signature) public;
  function executeUpgrade() public;

  // Versioning
  function getVersion() public pure returns (string memory);
}
```

Initialize behind a UUPS proxy; whitelist chains and map token pairs before enabling swaps. Keep `verificationFeeBps` under `MAX_FEE_BPS`. 

**Selected events & swap settlement helpers**

```solidity
event SwapRequested(bytes32 indexed requestId, uint256 indexed srcChainId, uint256 indexed dstChainId);
function swapRequestParametersToBytes(bytes32 requestId, address solver) external view returns (bytes memory, bytes memory);
function relayTokens(address token, address recipient, uint256 amount, bytes32 requestId, uint256 srcChainId) external;
function rebalanceSolver(address solver, bytes32 requestId, bytes calldata sigBytes) external;
```

Solvers derive message bytes via `swapRequestParametersToBytes` (sign off‑chain BN254), then call `rebalanceSolver` on the source chain to settle. 

---

## ScheduledUpgradeable (UUPS + BLS)

Abstract base for time‑locked upgrades with validator update flows and replay‑safe nonces. Message helpers produce domain‑separated bytes for BN254 signatures; use `getChainId()` in message formation to prevent cross‑chain replay. 

**Key functions (excerpt)**

```solidity
function scheduleUpgrade(address newImplementation, bytes calldata upgradeCalldata, uint256 upgradeTime, bytes calldata signature) external;
function cancelUpgrade(bytes calldata signature) external;
function executeUpgrade() external;

function contractUpgradeParamsToBytes(string action, address pendingImplementation, address newImplementation, bytes upgradeCalldata, uint256 upgradeTime, uint256 nonce) external view returns (bytes, bytes);
function blsValidatorUpdateParamsToBytes(address blsValidator, uint256 nonce) external view returns (bytes, bytes);
```

Respect `minimumContractUpgradeDelay` (default ≥ 2 days). Use `currentNonce()+1` when preparing an upgrade message. 

---

## UUPSProxy (introspection helper)

Thin ERC1967 proxy with `getImplementation()` for audits/CI validation. 

---

## Faucet RUSD (for local/testing)

A faucet token with `mint()` (once per 24h) used by `RUSDViemClient`. 

---

## Libraries

### ErrorsLib

Custom errors used across Router and upgrade flows:

```
AlreadyFulfilled
InvalidTokenOrRecipient
ZeroAmount
FeeTooLow
TokenMappingAlreadyExists
InvalidFeeBps
TokenNotSupported
UnauthorisedCaller
NewFeeTooLow(uint256 newFee, uint256 currentFee)
DestinationChainIdNotSupported(uint256 dstChainId)
FeeBpsExceedsThreshold(uint256 maxFeeBps)
BLSSignatureVerificationFailed
SwapRequestParametersMismatch
SourceChainIdMismatch(uint256 swapRequestParamsSrcChainId, uint256 contractChainId)
NoUpgradePending
UpgradeTooEarly(uint256 upgradeTime)
TooLateToCancelUpgrade(uint256 upgradeTime)
ZeroAddress
GrantRoleFailed
UpgradeMustGoThroughExecuteUpgrade
UpgradeFailed
UpgradeDelayTooShort
UpgradeTimeMustRespectDelay(uint256 earliestTime)
SameVersionUpgradeNotAllowed
```



**Troubleshooting examples**

* `BLSSignatureVerificationFailed` → wrong domain/bytes/key. Rebuild bytes with helper and re‑sign.
* `DestinationChainIdNotSupported` / `TokenMappingAlreadyExists` → missing permit or duplicate mapping.
* `SameVersionUpgradeNotAllowed` → deploy a new implementation with a different `getVersion()`. 

---

## Admin Scripts (snippets)

Read version; permit a chain; set a token mapping:

```js
import { ethers } from "ethers";
const rpc = process.env.RPC_URL;
const routerAddr = process.env.ROUTER_PROXY;
const dstChainId = BigInt(process.env.DST_CHAIN_ID || "84532");
const srcToken = process.env.SRC_ERC20;
const dstToken = process.env.DST_ERC20;

const abi = [
  "function getVersion() view returns (string)",
  "function permitDestinationChainId(uint256)",
  "function setTokenMapping(uint256,address,address)"
];

const provider = new ethers.JsonRpcProvider(rpc);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const router = new ethers.Contract(routerAddr!, abi, signer);

console.log("Router version:", await router.getVersion());
await (await router.permitDestinationChainId(dstChainId)).wait();
await (await router.setTokenMapping(dstChainId, dstToken, srcToken)).wait();
```



