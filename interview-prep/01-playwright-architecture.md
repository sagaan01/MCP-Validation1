# 1. Playwright Architecture & Framework Design

**Why this matters for the role:** They want someone who built Playwright frameworks from scratch, not someone who only wrote Page Object tests inside an existing harness.

---

## Core concepts to master

| Concept | What interviewers listen for |
|---------|------------------------------|
| Fixtures vs Page Objects | Composition, DI, test isolation |
| Project / browser matrix | Chromium, Firefox, WebKit, mobile viewports |
| Trace / video / screenshot strategy | Debugging without noise |
| Auth / storageState | SSO, MFA workarounds, session reuse |
| Parallelism & sharding | CI speed, flake control |
| Component vs E2E boundaries | What belongs in Playwright vs API/unit |
| Network interception | Stubbing vs contract testing |
| Soft assertions & retries | Financial UIs: never hide data bugs |

---

## Q1. “Walk me through how you would design a Playwright framework from scratch.”

### Strong answer

“I start with outcomes: stable CI, readable tests, reusable domain helpers, and clear ownership. Layers:

1. **Config & environments** — `playwright.config.ts` with projects per browser/env, tags for smoke/regression/data-heavy.
2. **Fixtures** — inject `page`, authenticated contexts, API clients, DB helpers, test data factories.
3. **Page Objects / Screen Objects** — thin UI locators + actions; no business assertions inside POMs.
4. **Domain services** — e.g. `AccountService`, `PortfolioService` that call APIs to seed state (UI only validates user journeys).
5. **Assertions / matchers** — custom expect helpers for money, dates, status badges.
6. **Reporting & observability** — Allure/HTML, Azure DevOps test results, traces on failure only.
7. **CI contract** — quality gates: smoke must pass; flaky quarantine; shard strategy.

I deliberately keep UI tests thin and push setup to API/SQL so E2E stays fast and deterministic.”

### Example: skeleton layout

```text
automation/
  playwright.config.ts
  package.json
  src/
    fixtures/
      index.ts              # merge fixtures
      auth.fixture.ts
      api.fixture.ts
      db.fixture.ts
    pages/
      LoginPage.ts
      AccountOverviewPage.ts
      PortfolioPage.ts
    services/
      AccountApi.ts
      PortfolioApi.ts
    data/
      factories/
        account.factory.ts
      schemas/
        position.schema.ts
    utils/
      money.ts
      waits.ts
    reporters/
      ado.reporter.ts
  tests/
    smoke/
    regression/
    data-quality/
```

### Example: merged fixtures

```ts
// src/fixtures/index.ts
import { test as base, expect } from '@playwright/test';
import { AccountOverviewPage } from '../pages/AccountOverviewPage';
import { AccountApi } from '../services/AccountApi';

type Fixtures = {
  accountOverview: AccountOverviewPage;
  accountApi: AccountApi;
  wealthUser: { username: string; storageState: string };
};

export const test = base.extend<Fixtures>({
  wealthUser: async ({}, use) => {
    await use({
      username: process.env.WM_USER!,
      storageState: 'storage/wm-advisor.json',
    });
  },

  context: async ({ browser, wealthUser }, use) => {
    const context = await browser.newContext({
      storageState: wealthUser.storageState,
      baseURL: process.env.BASE_URL,
    });
    await use(context);
    await context.close();
  },

  accountApi: async ({ request }, use) => {
    await use(new AccountApi(request));
  },

  accountOverview: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },
});

export { expect };
```

---

## Q2. “Page Object Model vs fixtures — which do you prefer?”

### Answer

“Both. **POMs** encapsulate UI structure. **Fixtures** encapsulate lifecycle and dependencies. Anti-pattern: fat POMs that create accounts, hit DBs, and assert business rules. Prefer:

- POM = locators + navigation + UI actions
- Fixture = auth, seeded data, API client
- Test = journey + assertions

That keeps tests readable and makes mentorship easier—juniors copy the pattern.”

### Example: thin POM

```ts
export class PortfolioPage {
  constructor(private readonly page: Page) {}

  readonly totalMarketValue = this.page.getByTestId('total-mv');
  readonly positionsTable = this.page.getByRole('table', { name: /positions/i });

  async goto(accountId: string) {
    await this.page.goto(`/accounts/${accountId}/portfolio`);
    await expect(this.totalMarketValue).toBeVisible();
  }

  async getPositionRow(symbol: string) {
    return this.positionsTable.getByRole('row', { name: new RegExp(symbol) });
  }
}
```

### Example: test using fixture + POM

```ts
test('advisor sees reconciled market value after trade settle', async ({
  accountApi,
  accountOverview,
  page,
}) => {
  const account = await accountApi.createManagedAccount({ type: 'TRUST' });
  await accountApi.postTrade(account.id, { symbol: 'AAPL', qty: 10, side: 'BUY' });
  await accountApi.waitForSettlement(account.id);

  await accountOverview.goto(account.id);
  const uiMv = await accountOverview.getMarketValue();
  const apiMv = await accountApi.getMarketValue(account.id);

  expect(uiMv).toEqualMoney(apiMv); // custom matcher
});
```

---

## Q3. “How do you handle authentication (SSO / MFA) in Playwright?”

### Answer

“Never automate MFA every run. Pattern:

1. One-time (or scheduled) **auth setup project** that completes login and saves `storageState`.
2. Tests reuse storage state via fixture/project dependency.
3. For SSO: use test IdP / bypass header in lower envs when security allows.
4. Rotate tokens; treat secrets via Azure Key Vault / pipeline secret variables.
5. Negative auth tests remain separate and rare.”

### Example: setup project

```ts
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storage/advisor.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

```ts
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate advisor', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill(process.env.ADVISOR_USER!);
  await page.getByLabel('Password').fill(process.env.ADVISOR_PASS!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  // If MFA: inject OTP from secure test hook in lower env
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'storage/advisor.json' });
});
```

---

## Q4. “How do you reduce flaky Playwright tests?”

### Answer (structure)

1. **Root-cause taxonomy:** timing, data, env, selectors, parallelism collisions.
2. **Ban hard sleeps** — use web-first assertions / locator auto-wait.
3. **Stable selectors** — `data-testid`, roles; avoid CSS chained to layout.
4. **Isolate data** — unique account IDs per worker; no shared mutable accounts.
5. **Network readiness** — wait for specific API responses, not spinners alone.
6. **Quarantine with SLA** — flaky tag + owner + fix-by date; don’t silently retry forever.
7. **Trace on first retry only** — cost control.

### Example: wait on API, not sleep

```ts
await Promise.all([
  page.waitForResponse(
    (r) => r.url().includes('/api/positions') && r.status() === 200
  ),
  page.getByRole('button', { name: 'Refresh' }).click(),
]);
await expect(page.getByTestId('positions-count')).toHaveText('12');
```

### Example: worker-scoped unique data

```ts
test.beforeEach(async ({ accountApi }, testInfo) => {
  const suffix = `${testInfo.workerIndex}-${Date.now()}`;
  testInfo.annotations.push({ type: 'account', description: suffix });
  // create account with suffix to avoid collisions under fullyParallel
});
```

---

## Q5. “Explain Playwright projects, workers, sharding.”

### Answer

- **Projects** = configurations (browser, device, setup dependency, grep).
- **Workers** = parallel processes on one machine.
- **Sharding** = split suite across CI agents (`--shard=1/4`).

“For wealth apps I often run: smoke on every PR (Chromium only), nightly full matrix, data-reconciliation suite on schedule after ETL window.”

### Example config excerpt

```ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { open: 'never' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
});
```

### Azure pipeline shard example

```yaml
strategy:
  parallel: 4
steps:
  - script: npx playwright test --shard=$(System.JobPosition)/$(System.JobTotal)
    displayName: Playwright shard
```

---

## Q6. “When do you use network interception / route mocking?”

### Answer

“Use mocking for **UI contract isolation** and negative UI states (500, empty portfolio). Do **not** mock away the integration you claim to test. For financial truth (balances, fees), prefer real lower-env services or consumer-driven contracts + separate data tests.”

### Example: mock empty portfolio for UI empty-state

```ts
await page.route('**/api/accounts/*/positions', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ positions: [], asOf: '2026-07-29' }),
  });
});
await page.goto('/accounts/ACC-1/portfolio');
await expect(page.getByText('No positions')).toBeVisible();
```

---

## Q7. “How do you design locators for enterprise apps (dynamic grids, iframes)?”

### Answer

- Prefer role + name, then test id.
- For grids: scope by row key (account number / symbol).
- Frames: `frameLocator`.
- Shadow DOM: Playwright pierces open shadow; closed shadow needs app test hooks.

### Example

```ts
const row = page.getByRole('row', { name: /AAPL/ });
await expect(row.getByTestId('quantity')).toHaveText('10');
await expect(row.getByTestId('market-value')).toHaveText('$1,900.00');

const frame = page.frameLocator('#statements-frame');
await frame.getByRole('button', { name: 'Download PDF' }).click();
```

---

## Q8. “Compare Playwright vs Selenium vs Cypress — why Playwright for this role?”

### Answer

| Dimension | Playwright | Selenium | Cypress |
|-----------|------------|----------|---------|
| Languages | TS/JS/Python/Java/.NET | Many | JS/TS |
| Auto-wait | Excellent | Manual/explicit | Good (same origin limits historically) |
| Multi-browser | Strong first-class | Strong | Chromium-family historically |
| Trace viewer | Excellent | Limited | Time-travel |
| API testing | Built-in `request` | Separate | Built-in |
| Parallel | Native | Grid complexity | Parallel paid/CI setup |

“I’d pick Playwright for greenfield enterprise UI + API hybrid frameworks. I still respect Selenium estates and migration plans—don’t rewrite overnight; strangler pattern: new journeys in Playwright, critical legacy in Selenium until parity.”

---

## Q9. “How do you structure test tags and suites for a Principal-level strategy?”

### Example

```ts
test.describe('Portfolio @smoke @ui', () => { /* ... */ });
test('fee accrual @regression @data @nightly', async () => { /* ... */ });
```

```bash
npx playwright test --grep @smoke
npx playwright test --grep-invert @nightly
```

**Strategy:** PR = `@smoke` + changed-area tests; merge = `@regression` UI/API; nightly = `@data` reconciliation after batch; release = full + UAT checklist.

---

## Q10. “Show a custom expect matcher for money.”

```ts
// src/utils/money.ts
import { expect } from '@playwright/test';

expect.extend({
  toEqualMoney(received: string | number, expected: string | number) {
    const a = Number(String(received).replace(/[$,]/g, ''));
    const b = Number(String(expected).replace(/[$,]/g, ''));
    const pass = Math.abs(a - b) < 0.005; // half-cent tolerance policy
    return {
      pass,
      message: () => `expected ${received} to equal money ${expected}`,
    };
  },
});
```

**Interview tip:** Call out tolerance policy with finance stakeholders—never invent penny rules alone.

---

## Whiteboard challenge you may get

**Prompt:** “Design Playwright automation for an account onboarding wizard with 6 steps, document upload, and backend KYC checks.”

**Talking points:**
- Seed partially completed applications via API.
- UI tests only for step navigation, validation messages, upload happy path.
- API/async job tests for KYC status transitions.
- Data test: application row + document metadata in DB.
- Traceability: requirement IDs as annotations → Azure Test Plans.
