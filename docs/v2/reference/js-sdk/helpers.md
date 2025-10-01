# JS SDK Reference: RUSD Formatting Helpers

`onlyswaps-js` provides helper functions to convert between human-readable formats (strings, numbers) and the 18-decimal fixed-point `bigint` format required by the smart contracts.

## rusdFromNumber

Converts a JavaScript `number` to an 18-decimal `bigint`. Uses Decimal.js internally for precise rounding.

```typescript
export function rusdFromNumber(input: number): bigint;
```

  * **Guidance:** Prefer `rusdFromString` for direct user input to avoid potential JavaScript floating-point inaccuracies.
  * **Example:** `rusdFromNumber(1.1)` returns `1100000000000000000n`.

## rusdFromString

Parses a human-readable decimal string into an 18-decimal `bigint`. Extra fractional digits beyond 18 places are truncated (not rounded).

```typescript
export function rusdFromString(input: string): bigint;
```

  * **Guidance:** Throws an error if the input string cannot be parsed.
  * **Example:** `rusdFromString("1.123")` returns `1123000000000000000n`.

## rusdToString

Formats an 18-decimal `bigint` as a human-readable decimal string. The output is truncated (not rounded) to the requested number of decimal places.

```typescript
export function rusdToString(value: bigint, decimals: number = 2): string;
```

  * **Guidance:** The maximum number of decimals is clamped to 18.
  * **Example:** `rusdToString(1111000000000000000n, 3)` returns `"1.111"`.
  * **Example (Truncation):** `rusdToString(1999900000000000000n, 2)` returns `"1.99"`.

<!-- end list -->
