# Architecture Deep Dive

The swap lifecycle involves fee discovery, request creation, solver fulfillment, and committee verification:

~~~mermaid
sequenceDiagram
  participant User
  participant ONLYportal
  participant onlyswaps-js
  participant FeesAPI
  participant Router as Router(Source Chain)
  participant Scheme as Scheme(Source Chain)
  participant Solver
  participant Verifier as Verifier(dcipher committee)
  participant DestinationChain

  %% Step 0: Fee discovery
  User->>ONLYportal: Connect wallet & enter params
  ONLYportal->>FeesAPI: Request suggested fee
  FeesAPI-->>ONLYportal: Suggested fee
  ONLYportal->>onlyswaps-js: Forward fee & params
  onlyswaps-js-->>User: Display suggested fee

  %% Step 1: Create Swap Request
  User->>onlyswaps-js: Submit swap (amount, dstChain, minFee)
  onlyswaps-js->>Router: Lock tokens & create SwapRequest
  Router-->>Solver: Emit SwapRequest event
  Router-->>Verifier: Emit SwapRequest event

  %% Step 2: Solver Fulfilment
  Solver->>Router: Post fulfilment intent
  Solver->>DestinationChain: Send tokens to user's address
  DestinationChain-->>Verifier: Transfer/log visible

  %% Step 3: Committee Verification
  Verifier->>Verifier: Threshold-sign Swap Verification off-chain
  Verifier->>Router: Submit aggregated signature
  Router->>Scheme: Verify signature with committee pubkey
  Router->>Solver: Reimburse locked funds + fee
  Router->>Router: Mark SwapRequest complete
~~~

**How it fits together**

1. **Fees** — UI queries a **Fees API** for a recommended solver fee based on gas/liquidity; users can override and later bump with `updateFee`.  
2. **Request** — The user locks tokens on the **Router**; an event advertises the open request to solvers. 
3. **Fulfilment** — The first solver to transfer funds on the **destination chain** at or above the user’s price “wins.” 
4. **Verification** — The **dcipher committee** observes the fulfillment and posts a threshold signature to the source‑chain Router. The Router verifies the signature and reimburses the solver (plus the verification fee). 

> **Caveats**
>
> * Current scope: like‑for‑like tokens. 
> * Single committee (for now), but designed for multiple committees later. 
> * Signature upload is currently by a single party; future releases incentivize others to post it for a bounty. 
