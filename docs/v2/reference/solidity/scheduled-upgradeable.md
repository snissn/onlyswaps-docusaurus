# Contract Reference: ScheduledUpgradeable

`ScheduledUpgradeable` is an abstract contract that provides a secure mechanism for managing UUPS upgrades. It implements time-locks, replay protection (nonces), and BLS (BN254) signature gating. The `Router` contract inherits from this.

## State Variables

| Name                               | Type               | Description                                                     |
| ---------------------------------- | ------------------ | --------------------------------------------------------------- |
| `currentNonce`                     | `uint256`          | Replay protection nonce for signatures.                         |
| `scheduledImplementation`          | `address`          | Address of the pending implementation upgrade.                  |
| `scheduledTimestampForUpgrade`     | `uint256`          | Timestamp after which the upgrade can be executed.              |
| `minimumContractUpgradeDelay`      | `uint256`          | Minimum required delay (default: 2 days).                       |
| `contractUpgradeBlsValidator`      | `ISignatureScheme` | The BLS validator used for authorizing upgrades.                |

## Core Functions

### scheduleUpgrade

Schedules a new implementation upgrade. Requires a valid BLS signature.

```solidity
function scheduleUpgrade(
    address newImplementation,
    bytes calldata upgradeCalldata,
    uint256 upgradeTime,
    bytes calldata signature
) public virtual;
```

  * **Guidance:** `upgradeTime` must respect `minimumContractUpgradeDelay`. The `signature` must be generated using `contractUpgradeParamsToBytes` with action `"schedule"`.

### cancelUpgrade

Cancels a pending upgrade. Requires a valid BLS signature.

```solidity
function cancelUpgrade(bytes calldata signature) public virtual;
```

  * **Guidance:** The `signature` must be generated using `contractUpgradeParamsToBytes` with action `"cancel"`.

### executeUpgrade

Executes the scheduled upgrade after the `upgradeTime` has passed. Can be called by anyone.

```solidity
function executeUpgrade() public virtual;
```

## Helper Functions (Message Generation)

These functions generate the exact message bytes (G1 bytes) required for off-chain BLS signing.

### contractUpgradeParamsToBytes

Generates message bytes for scheduling or canceling an upgrade.

```solidity
function contractUpgradeParamsToBytes(
  string memory action, // "schedule" or "cancel"
  address pendingImplementation,
  address newImplementation,
  bytes memory upgradeCalldata,
  uint256 upgradeTime,
  uint256 nonce
) external view returns (bytes memory message, bytes memory messageAsG1Bytes);
```

### blsValidatorUpdateParamsToBytes

Generates message bytes for updating the BLS validator contract.

```solidity
function blsValidatorUpdateParamsToBytes(
    address blsValidator,
    uint256 nonce
) external view returns (bytes memory message, bytes memory messageAsG1Bytes);
```
