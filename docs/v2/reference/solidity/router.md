# Contract Reference: Router.sol

**Version:** 1.0.0
**Inherits:** `IRouter`, `ScheduledUpgradeable`, `AccessControlEnumerableUpgradeable`, `ReentrancyGuard`

The `Router` contract is the core of the OnlySwaps protocol. It manages the cross-chain swap lifecycle, handles user funds escrow, facilitates solver interaction, and verifies dcipher committee signatures. It is designed to be deployed behind a UUPS proxy.

## Initialization

The `initialize` function must be called once via the proxy after deployment.

```solidity
function initialize(
  address _owner,
  address _swapRequestBlsValidator,
  address _contractUpgradeBlsValidator,
  uint256 _verificationFeeBps
) public initializer;
```

| Parameter | Description |
| :--- | :--- |
| `_owner` | The address granted the `ADMIN_ROLE`. |
| `_swapRequestBlsValidator` | The BLS scheme contract for verifying swap fulfillments (domain: `swap-v1`). |
| `_contractUpgradeBlsValidator` | The BLS scheme contract for authorizing upgrades (domain: `upgrade-v1`). |
| `_verificationFeeBps` | The protocol fee rate in Basis Points (BPS). |

## Configuration and State Variables

```solidity
// Constants
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
uint256 public constant BPS_DIVISOR = 10_000;
uint256 public constant MAX_FEE_BPS = 5_000; // 50%

// Configuration
uint256 public verificationFeeBps;
ISignatureScheme public swapRequestBlsValidator;
```

## Core Swap Functions

*(These functions implement the logic defined in the [IRouter interface](https://www.google.com/search?q=./interfaces.md).)*

### relayTokens

Called by Solvers on the **Destination Chain** to fulfill the swap request.

```solidity
function relayTokens(address token, address recipient, uint256 amount, bytes32 requestId, uint256 srcChainId) external;
```

### rebalanceSolver

Called on the **Source Chain** with the dcipher committee's BLS signature to verify fulfillment and reimburse the solver.

```solidity
function rebalanceSolver(address solver, bytes32 requestId, bytes calldata sigBytes) external;
```

## Administrative Functions

These functions are restricted to addresses with the `ADMIN_ROLE`.

### Chain Management

```solidity
function permitDestinationChainId(uint256 chainId) external;
function blockDestinationChainId(uint256 chainId) external;
```

### Token Mapping

```solidity
function setTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
function removeTokenMapping(uint256 dstChainId, address dstToken, address srcToken) external;
```

  * **Guidance:** `permitDestinationChainId` must be called before `setTokenMapping` for a given chain.

### Fee Withdrawal

```solidity
function withdrawVerificationFee(address token, address to) external;
```

## BLS Validator Management

Updates the BLS validator used for contract upgrades. This action itself requires a valid BLS signature.

```solidity
function setContractUpgradeBlsValidator(address _contractUpgradeBlsValidator, bytes calldata signature) public override;
```

## Versioning

```solidity
function getVersion() public pure returns (string memory);
```

Returns the current version of the Router implementation (e.g., "1.0.0"). Used during upgrades to prevent same-version deployments.
```
