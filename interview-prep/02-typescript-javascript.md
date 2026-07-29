# 2. TypeScript / JavaScript for SDETs

**Why this matters:** Principal SDETs must write production-quality automation code, review PRs, and set coding standards—not just record-and-playback scripts.

---

## Core concepts

- Types for Page Objects, API responses, fixtures
- Async/await, promises, race conditions
- Generics for reusable API clients
- Zod / JSON Schema for runtime validation
- Module design, barrel exports, path aliases
- Error handling that surfaces actionable CI failures
- ESLint + Prettier + strict `tsconfig`

---

## Q1. “Why TypeScript over plain JavaScript for Playwright?”

### Answer

“Types catch contract drift early—account DTOs, position shapes, enum status codes. Autocomplete speeds mentorship. At Principal level, TS is a quality gate: PRs that `any`-escape financial payloads get rejected. We still validate at runtime with Zod because APIs lie.”

### Example: typed API client + Zod

```ts
import { z } from 'zod';
import { APIRequestContext, expect } from '@playwright/test';

const PositionSchema = z.object({
  symbol: z.string(),
  quantity: z.number(),
  marketValue: z.number(),
  asOf: z.string().datetime().or(z.string()),
});

const PositionsResponseSchema = z.object({
  accountId: z.string(),
  positions: z.array(PositionSchema),
});

export type PositionsResponse = z.infer<typeof PositionsResponseSchema>;

export class PortfolioApi {
  constructor(private readonly request: APIRequestContext) {}

  async getPositions(accountId: string): Promise<PositionsResponse> {
    const res = await this.request.get(`/api/accounts/${accountId}/positions`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    return PositionsResponseSchema.parse(json); // fails fast on shape drift
  }
}
```

---

## Q2. “Explain async/await pitfalls in test automation.”

### Answer

Common failures:
1. Missing `await` → assertion runs too early (silent flake).
2. `forEach(async ...)` → doesn’t wait.
3. Floating promises in helpers.
4. Shared mutable state across parallel workers.

### Bad vs good

```ts
// BAD
symbols.forEach(async (s) => {
  await page.getByText(s).click(); // test continues immediately
});

// GOOD
for (const s of symbols) {
  await page.getByText(s).click();
}

// GOOD parallel when independent
await Promise.all(symbols.map((s) => page.getByTestId(`row-${s}`).isVisible()));
```

---

## Q3. “How do you model test data factories in TypeScript?”

```ts
type AccountType = 'BROKERAGE' | 'IRA' | 'TRUST' | 'ADVISORY';

type CreateAccountInput = {
  type: AccountType;
  ownerName?: string;
  baseCurrency?: 'USD' | 'CAD';
};

let seq = 0;

export function buildAccount(
  overrides: Partial<CreateAccountInput> & { type: AccountType }
) {
  seq += 1;
  return {
    ownerName: `Auto User ${seq}`,
    baseCurrency: 'USD' as const,
    externalRef: `QA-${Date.now()}-${seq}`,
    ...overrides,
  };
}

// usage
const ira = buildAccount({ type: 'IRA', ownerName: 'Pat Advisor Client' });
```

**Talking point:** Factories + API create beat UI form-fill for setup 90% of the time.

---

## Q4. “Generics for reusable request helpers?”

```ts
export async function getJson<T>(
  request: APIRequestContext,
  url: string,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const res = await request.get(url);
  if (!res.ok()) {
    throw new Error(`GET ${url} failed: ${res.status()} ${await res.text()}`);
  }
  return schema.parse(await res.json());
}
```

---

## Q5. “Strict TypeScript settings you enforce?”

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "module": "commonjs",
    "types": ["node"]
  }
}
```

“I also ban `as any` via ESLint except in a documented escape hatch file.”

---

## Q6. “How do you handle environment config safely?”

```ts
import { z } from 'zod';

const EnvSchema = z.object({
  BASE_URL: z.string().url(),
  ADO_PAT: z.string().min(1).optional(),
  DB_CONN: z.string().min(1),
  WM_USER: z.string(),
  WM_PASS: z.string(),
});

export const env = EnvSchema.parse(process.env);
```

Fail the suite at boot if config is wrong—don’t fail 200 tests with cryptic auth errors.

---

## Q7. “Map / reduce / functional patterns in assertions?”

```ts
const symbols = positions.map((p) => p.symbol).sort();
const unique = new Set(symbols);
expect(unique.size).toBe(symbols.length); // no duplicate symbols

const total = positions.reduce((sum, p) => sum + p.marketValue, 0);
expect(total).toBeCloseTo(account.marketValue, 2);
```

---

## Q8. “Error handling that helps CI triage?”

```ts
try {
  await reconcilePositions(accountId);
} catch (err) {
  const e = err as Error;
  throw new Error(
    `[DATA-RECON] account=${accountId} asOf=${asOf} :: ${e.message}`
  );
}
```

Prefix tags (`[DATA-RECON]`, `[UI-SMOKE]`) make Azure DevOps failure grouping easier.

---

## Q9. “Optional chaining and nullish coalescing—when wrong for finance?”

```ts
// Dangerous for balances
const fee = invoice.feeAmount ?? 0; // hides missing fee as zero!

// Better
if (invoice.feeAmount == null) {
  throw new Error(`Missing feeAmount for invoice ${invoice.id}`);
}
```

**Interview gold:** “In wealth systems, silent defaults on money fields are defects.”

---

## Q10. “Package scripts you standardize?”

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke",
    "test:data": "playwright test --grep @data",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "format": "prettier -c ."
  }
}
```

PR pipeline: `lint` → `typecheck` → `test:smoke`.
