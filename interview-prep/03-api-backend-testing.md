# 3. API & Backend Automation

**Why this matters:** Principal SDET owns API/service quality alongside UI—microservices, REST/GraphQL, async jobs, and contract confidence.

---

## Core concepts

- REST vs GraphQL testing strategies
- Contract testing (Pact / OpenAPI schema validation)
- Auth: OAuth2 client credentials, JWT, API keys
- Idempotency, pagination, filtering
- Async: queues, webhooks, eventual consistency
- Negative testing & threat-minded validation
- Layering: API setup for UI; API as system under test

---

## Q1. “How do you approach API testing strategy at Principal level?”

### Answer

“Pyramid inside services:

1. **Unit/component** owned by devs  
2. **Contract / schema** on PRs (OpenAPI breaking-change gate)  
3. **Service integration** in shared lower env or testcontainers  
4. **Journey E2E** sparse, business-critical  
5. **Data reconciliation** after batch/ETL  

I define ownership: service teams own their API suites; platform SDET owns cross-service journeys, shared libraries, and quality gates.”

---

## Q2. “Show Playwright API testing example.”

```ts
import { test, expect } from '@playwright/test';

test('create account and fetch positions @api @smoke', async ({ request }) => {
  const create = await request.post('/api/accounts', {
    data: {
      type: 'BROKERAGE',
      ownerName: 'API Test User',
      baseCurrency: 'USD',
    },
    headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
  });
  expect(create.status()).toBe(201);
  const { id } = await create.json();

  const positions = await request.get(`/api/accounts/${id}/positions`);
  expect(positions.ok()).toBeTruthy();
  const body = await positions.json();
  expect(body).toEqual(
    expect.objectContaining({
      accountId: id,
      positions: expect.any(Array),
    })
  );
});
```

---

## Q3. “GraphQL specifics?”

```ts
const query = `
  query Portfolio($accountId: ID!) {
    account(id: $accountId) {
      id
      marketValue
      positions { symbol quantity marketValue }
    }
  }
`;

const res = await request.post('/graphql', {
  data: { query, variables: { accountId: 'ACC-9' } },
});
const json = await res.json();
expect(json.errors).toBeUndefined();
expect(json.data.account.marketValue).toEqual(expect.any(Number));
```

**Talking points:** assert `errors` array; test field-level auth; avoid over-fetching assertions that couple to UI needs only.

---

## Q4. “How do you test eventual consistency (trade → position)?”

```ts
async function waitForCondition<T>(
  fn: () => Promise<T>,
  predicate: (v: T) => boolean,
  { timeoutMs = 60_000, intervalMs = 2_000 } = {}
): Promise<T> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const value = await fn();
    if (predicate(value)) return value;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Condition not met within timeout');
}

test('buy order reflects in positions after settle @api', async ({ request }) => {
  await request.post('/api/orders', {
    data: { accountId: 'ACC-1', symbol: 'MSFT', qty: 5, side: 'BUY' },
  });

  const positions = await waitForCondition(
    async () => (await request.get('/api/accounts/ACC-1/positions')).json(),
    (body) => body.positions.some((p: any) => p.symbol === 'MSFT' && p.quantity >= 5)
  );

  expect(positions).toBeTruthy();
});
```

---

## Q5. “OpenAPI / schema gate in CI?”

### Answer

“Treat OpenAPI as a contract. On PR:

- Lint spec (`spectral`)
- Diff against main for breaking changes
- Generate types for clients
- Run schema validation tests against deployed swagger

Breaking change without version bump fails the quality gate.”

### Example spectral snippet (concept)

```yaml
# .spectral.yaml
extends: [[spectral:oas, all]]
rules:
  operation-operationId: error
  oas3-unused-component: warn
```

---

## Q6. “Negative API tests you always include for finance?”

| Case | Example |
|------|---------|
| Authz | Advisor A cannot read Advisor B’s account |
| Validation | Negative quantity rejected |
| Idempotency | Duplicate `Idempotency-Key` doesn’t double book |
| Limits | Page size max enforced |
| Precision | Money as string/decimal—not float surprises |

```ts
test('cannot access another advisor account @api @security', async ({ request }) => {
  const res = await request.get('/api/accounts/OTHER-ACC', {
    headers: { Authorization: `Bearer ${advisorAToken}` },
  });
  expect(res.status()).toBe(403);
});
```

---

## Q7. “Microservices testing challenges?”

### Answer

- **Environment drift** → contract tests + consumer stubs  
- **Data fan-out** → correlation IDs in assertions/logs  
- **Ordering** → outbox/event tests  
- **Ownership** → RACI for flaky cross-service tests  
- **Observability** → assert metrics/traces for critical paths in lower env when available  

“I push teams to test in isolation with contracts, then a thin journey suite for wealth workflows (open account → fund → trade → report).”

---

## Q8. “REST vs message-based validation?”

```ts
// After API call, validate event landing (Kafka/Service Bus) via test subscriber or DB outbox table
const outbox = await db.query(
  `SELECT * FROM outbox WHERE aggregate_id = $1 AND event_type = 'PositionUpdated'`,
  [accountId]
);
expect(outbox.rowCount).toBeGreaterThan(0);
```

---

## Q9. “How do you manage API test data cleanup?”

### Answer

- Prefer ephemeral accounts with `QA-` prefix and TTL job  
- `finally` / fixture teardown deletes when API supports  
- Soft-delete environments: mark `test_run_id` and batch purge nightly  
- Never delete production-like golden accounts used for reconciliation baselines  

---

## Q10. “Postman vs code-first API automation?”

“Postman/Newman is great for exploration and business UAT collections. For Principal-level engineering—versioning, reuse, types, PR gates—I standardize on code (Playwright request, RestAssured, pytest). I often export critical Postman flows into code during maturity upgrades.”
