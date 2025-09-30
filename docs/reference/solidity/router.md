---
title: Router
---

# Router

Upgradeable cross‑chain swap router with BLS‑gated admin ops and scheduled upgrades.

## Definition

```solidity
// Key external/public API distilled from Router.sol
contract Router is IRouter, ScheduledUpgradeable, AccessControlEnumerableUpgradeable, ReentrancyGuard {
    // Roles & fee constants
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant BPS_DIVISOR = 10_000;
    uint256 public constant MAX_FEE_BPS = 5_000;

    // Config
    uint256 public verificationFeeBps;
    ISignatureScheme public swapRequestBlsValidator;

    // Initialization
    function initialize(
      address _owner,
      address _swapRequestBlsValidator,
      address _contractUpgradeBlsValidator,
      uint256 _verificationFeeBps
    ) public initializer;

    // Admin: destination chains & token mappings
    function permitDestinationChainId(uint256 chainId) external;
    function blockDestinationChainId(uint256 chainId) external;
    function setTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
    function removeTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
    function withdrawVerificationFee(address token, address to) external;

    // BLS validator admin (overrides ScheduledUpgradeable)
    function setContractUpgradeBlsValidator(address _contractUpgradeBlsValidator, bytes calldata signature) public override;

    // Upgrades (ScheduledUpgradeable overrides)
    function scheduleUpgrade(address newImplementation, bytes calldata data, uint256 upgradeTime, bytes calldata signature) public override;
    function cancelUpgrade(bytes calldata signature) public override;
    function executeUpgrade() public override;

    // Versioning
    function getVersion() public pure returns (string memory);
}
```

## Usage Guidance

* Use deploy-time `initialize(owner, swapBLS, upgradeBLS, feeBps)` and restrict admin methods with AccessControl.
* Always compute and sign domain‑separated messages for schedule/cancel/update operations; signatures must match BN254 domain.
* Permit destination chain IDs and map token pairs before initiating swaps; Router enforces `allowedDstChainIds` & mapping existence.
* Use custom errors (ErrorsLib) for precise reverts and assert those in tests; assert upgrade invariants using `getVersion()`.
* Keep Router behind UUPS proxy; verify current implementation via `getImplementation()` when executing upgrades.

## Example (JS upgrade scheduling)

```javascript
import { ethers } from "ethers";
const abi = [
  "function scheduleUpgrade(address,bytes,uint256,bytes)",
  "function executeUpgrade()",
  "function getScheduledUpgrade() view returns (address,bytes,uint256,uint256)"
];
const sc = new ethers.Contract(process.env.ROUTER_PROXY, abi, new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider(process.env.RPC_URL)));
// ... build message via contractUpgradeParamsToBytes, sign off‑chain ...
await (await sc.scheduleUpgrade(process.env.NEW_IMPL, "0x", BigInt(process.env.TS), process.env.SIG)).wait();
const [impl,, when] = await sc.getScheduledUpgrade();
console.log("Pending:", impl, "at", when.toString());
// after time:
await (await sc.executeUpgrade()).wait();
```
