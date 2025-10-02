---
sidebar_position: 1
---

# Getting Started for End Users

## Access the app

Use the OnlySwaps web app (OnlyPortal) to connect your wallet, create swap requests, update fees, track status, see solver details, and cancel swaps if needed. :contentReference[oaicite:61]{index=61}

## Wallet setup & connection

1) Install a Web3 wallet (e.g., MetaMask).  
2) Add the supported networks you plan to use (see Supported chains & tokens).  
3) Connect your wallet in the app header; the app will show your balances and supported networks.

## Perform a cross‑chain swap

1) Choose source and destination networks.  
2) Select currency (currently RUSD).  
3) Enter amount and your fee (the app can suggest a fee). :contentReference[oaicite:62]{index=62}  
4) Submit the swap; you’ll receive a requestId to track progress.  
5) Watch status (source chain) and receipt (destination chain) until they show executed/fulfilled. :contentReference[oaicite:63]{index=63}

> Note: OnlySwaps currently supports like‑for‑like tokens across chains (e.g., RUSD → RUSD). Non‑like pairs are planned. :contentReference[oaicite:64]{index=64}

## Fees & limits

- Solver fee: what you pay to incentivize a solver to fulfill quickly (suggested by Fees API; you can increase later). :contentReference[oaicite:65]{index=65}  
- Verification fee: small protocol fee to pay the dcipher committee for verification (basis points of the amount). :contentReference[oaicite:66]{index=66}  
- Per‑chain/token limits: depend on network configuration and available liquidity; if a request lingers, try increasing your solver fee.

