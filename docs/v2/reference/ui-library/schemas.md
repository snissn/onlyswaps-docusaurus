# UI Library Reference: Validation Schemas

`onlyswaps-ui` utilizes Zod for robust form validation.

## Core Schemas

### currencySchema

A Zod enum for supported currencies. Currently limited to 'rusd'.

```typescript
import { z } from "zod";
export const currencySchema = z.enum(["rusd"]);
```

### chainIdSchema

A Zod enum of supported chain IDs (as strings), inferred from `supportedChains`.

```typescript
export const chainIdSchema = z.enum(supportedChains.map(it => it.id + "") as [string, ...string[]]);
```

### amountSchema

A schema for validating monetary amounts (swap amounts and fees). It coerces input to a number and enforces constraints.

```typescript
export const amountSchema = z
  .coerce.number()
  .max(1_000_000_000, { message: "Must be ≤ 1,000,000,000" })
  .min(0.01, { message: "Cannot be 0" })
  .refine(val => Number.isInteger(val * 100), {
    message: "Must have at most 2 decimal places",
  });
```

  * **Guidance:** After validation, convert the resulting `number` to `bigint` using `rusdFromNumber` (from `onlyswaps-js`) before passing it to the SDK.

## Composite Schema

### SwapFormSchema

The main schema for validating the entire swap form, including cross-field validation.

```typescript
export const SwapFormSchema = z.object({
  currency: currencySchema,
  sourceChain: chainIdSchema,
  destinationChain: chainIdSchema,
  amount: amountSchema,
  fee: amountSchema,
}).refine(data => data.sourceChain !== data.destinationChain, {
  path: ["destinationChain"],
  message: "Destination chain must be different from source chain",
});
```

### Usage with React Hook Form

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SwapFormSchema } from "onlyswaps-ui/ui/schemas";

function SwapForm() {
  const form = useForm({
    resolver: zodResolver(SwapFormSchema),
  });
  // ...
}
```
