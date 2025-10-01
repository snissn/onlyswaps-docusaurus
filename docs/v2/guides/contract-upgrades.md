# Guide: Smart Contract Integration & Upgrades

This guide explains the upgrade mechanism used by the OnlySwaps protocol for its core contracts, focusing on the UUPS pattern, time-locks, and the BLS signature authorization process.

**Target Audience:** Protocol Administrators, Security Auditors, and Advanced Solidity Developers.

## Upgrade Architecture Overview

OnlySwaps utilizes the **Universal Upgradeable Proxy Standard (UUPS)** for the `Router.sol` contract.

*   **`UUPSProxy`**: A lightweight proxy that delegates calls to the implementation contract. This is the address users interact with.
*   **`Router.sol`**: The implementation contract containing the core logic.

In the UUPS pattern, the upgrade authorization logic resides within the implementation contract itself. OnlySwaps implements this logic in the `ScheduledUpgradeable` abstract contract.

## The `ScheduledUpgradeable` Mechanism

The `ScheduledUpgradeable` contract introduces critical security measures for upgrades:

1.  **Time-Locks (Delays):** Upgrades cannot be executed immediately. They must be scheduled in advance, respecting the `minimumContractUpgradeDelay` (default: 2 days). This provides a window for review and reaction.
2.  **BLS Gated Authorization:** Scheduling or canceling an upgrade requires a valid threshold BLS signature (BN254) from the authorized dcipher committee.
3.  **Nonce Protection:** An incrementing nonce prevents the replay of old signatures.
4.  **Domain Separation:** Signatures for upgrades use a distinct domain (`"upgrade-v1"`) separate from swap verifications (`"swap-v1"`).

[Read the ScheduledUpgradeable Reference](../reference/solidity/scheduled-upgradeable.md)

## The Upgrade Process

Performing an upgrade involves several steps, including off-chain signature generation.

### Step 1: Deploy New Implementation

Deploy the new version of the `Router.sol` contract. Ensure the new implementation returns a different version string via `getVersion()`; otherwise, the upgrade will fail with `SameVersionUpgradeNotAllowed`.

### Step 2: Prepare the Upgrade Message Bytes

To authorize the upgrade, the dcipher committee must sign a specific message. This message **must** be generated using the helper function `contractUpgradeParamsToBytes` on the existing Router proxy.

```solidity
function contractUpgradeParamsToBytes(
  string memory action, // "schedule"
  address pendingImplementation,
  address newImplementation,
  bytes memory upgradeCalldata,
  uint256 upgradeTime,
  uint256 nonce
) external view returns (bytes memory message, bytes memory messageAsG1Bytes);
```

**Example (using JavaScript/Ethers.js):**

```javascript
import { ethers } from "ethers";

// Assume 'router' is an ethers Contract instance connected to the Router Proxy
const newImplementationAddress = "0x..."; // Address of the newly deployed contract

// Calculate the upgrade time (e.g., Now + 2 days + 1 hour)
const minDelay = await router.minimumContractUpgradeDelay();
const upgradeTime = BigInt(Math.floor(Date.now() / 1000)) + minDelay + 3600n;

// Get the next nonce
const nonce = (await router.currentNonce()) + 1n;
const pendingImpl = await router.scheduledImplementation();

const [message, g1Bytes] = await router.contractUpgradeParamsToBytes(
    "schedule",
    pendingImpl,
    newImplementationAddress,
    "0x",               // upgradeCalldata (usually empty)
    upgradeTime,
    nonce
);

// g1Bytes is the data that needs to be signed by the dcipher committee.
```

### Step 3: Off-chain BLS Signing

The `g1Bytes` generated must be signed by the dcipher committee using their BN254 BLS keys. This results in an aggregated threshold signature.

### Step 4: Schedule the Upgrade

Submit the aggregated signature and parameters to the `scheduleUpgrade` function on the Router proxy.

```solidity
function scheduleUpgrade(
    address newImplementation,
    bytes calldata upgradeCalldata,
    uint256 upgradeTime,
    bytes calldata signature
) public virtual;
```

If the signature is valid and the `upgradeTime` respects the delay, the upgrade is scheduled, emitting `UpgradeScheduled`.

### Step 5: Execute the Upgrade

After the `upgradeTime` has passed, anyone can call the `executeUpgrade` function to finalize the process.

```solidity
function executeUpgrade() public virtual;
```

This function performs the actual UUPS switch to the new implementation.

## Canceling an Upgrade

If an upgrade needs to be canceled before execution:

1.  Generate message bytes using `contractUpgradeParamsToBytes` with `action = "cancel"`.
2.  Obtain the BLS signature from the committee.
3.  Call `cancelUpgrade(signature)`.

This must be done before the `upgradeTime` has passed.
