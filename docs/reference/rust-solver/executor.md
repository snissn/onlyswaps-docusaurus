---
title: Trade Execution
---

```
# Trade Execution

## TradeExecutor<P>

> Sends token approvals and fulfillment transactions.

### TradeExecutor::execute

```rust
pub async fn execute(&self, plan: Plan) -> eyre::Result<TxHash> { ... }
```
```
