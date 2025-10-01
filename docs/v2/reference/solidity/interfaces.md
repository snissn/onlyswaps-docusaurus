# Contract Reference: Interfaces

## IRouter

`IRouter` defines the core structures, events, and external functions for the `Router` contract.

### Structs

#### SwapRequestParameters

The source-chain view of a swap request.

```solidity
struct SwapRequestParameters {
    address sender;
    address recipient;
    // ... amounts, chain IDs, fees ...
    uint256 verificationFee;
    uint256 solverFee;
    uint256 nonce;
    bool executed; // True if verified by dcipher and solver reimbursed
    uint256 requestedAt;
}
```

#### SwapRequestReceipt

The destination-chain receipt of fulfillment.

```solidity
struct SwapRequestReceipt {
    bytes32 requestId;
    // ... chain IDs, token, recipient ...
    bool fulfilled; // True if solver completed transfer
    address solver;
    uint256 amountOut;
    uint256 fulfilledAt;
}
```

### Events

```solidity
event SwapRequested(bytes32 indexed requestId, uint256 indexed srcChainId, uint256 indexed dstChainId);
```

### Key Functions (Subset)

```solidity
// Generate message bytes for rebalanceSolver signature
function swapRequestParametersToBytes(bytes32 requestId, address solver)
  external view returns (bytes memory message, bytes memory messageAsG1Bytes);

// Called by Solver on Destination Chain
function relayTokens(address token, address recipient, uint256 amount, bytes32 requestId, uint256 srcChainId) external;

// Called on Source Chain with BLS signature
function rebalanceSolver(address solver, bytes32 requestId, bytes calldata sigBytes) external;
```

## IScheduledUpgradeable

Defines the interface for scheduling, canceling, and executing UUPS upgrades with BLS authorization.

[See the ScheduledUpgradeable Reference](./scheduled-upgradeable.md) for details.

```solidity
interface IScheduledUpgradeable {
    // Events
    event UpgradeScheduled(address indexed newImplementation, uint256 executeAfter);
    event UpgradeCancelled(address indexed cancelledImplementation);
    event UpgradeExecuted(address indexed newImplementation);

    // Functions
    function scheduleUpgrade(...) external;
    function cancelUpgrade(bytes calldata signature) external;
    function executeUpgrade() external;
    // ...
}
```
