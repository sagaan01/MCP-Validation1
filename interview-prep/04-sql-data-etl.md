# 4. SQL, Data Validation & ETL

**Why this matters:** The JD lists data quality as a **core expectation**—ETL, reconciliation, completeness/accuracy/consistency for wealth platforms.

---

## Core concepts

| Dimension | Meaning | Example |
|-----------|---------|---------|
| Completeness | All expected rows present | Every trade file row landed in `trades` |
| Accuracy | Values correct vs source | Fee = schedule(rate × AUM) |
| Consistency | Cross-system agreement | UI MV = API MV = ledger MV |
| Timeliness | Freshness SLA | Positions as-of by 6:00 AM ET |
| Uniqueness | No dup keys | One open lot key per tax lot |
| Validity | Domain rules | CUSIP format, account status enum |

---

## Q1. “How do you design a data validation framework?”

### Answer

“Treat data tests like product code:

1. **Source contracts** — file schema, API payload, CDC topic  
2. **Transformation rules catalog** — business rules versioned  
3. **Reusable assertions** — row counts, checksums, column profiles, reconciliations  
4. **Fixtures / known datasets** — controlled inputs in QA  
5. **Execution modes** — PR (small sample), nightly (full), post-ETL trigger  
6. **Reporting** — broken rule, sample bad keys, severity, owner  

Stack example: TypeScript/Python runners + SQL templates + Azure DevOps scheduled pipelines.”

### Example framework layout

```text
data-quality/
  rules/
    positions_recon.yml
    fees_accuracy.yml
  sql/
    positions_recon.sql
    orphan_transactions.sql
  runners/
    runRule.ts
  datasets/
    golden/
  reports/
```

---

## Q2. “Explain ETL testing phases with examples.”

### Pre-ETL (source)
- File arrived, name pattern, row count, checksum, not empty
- Schema: required columns, types, date formats

### In-ETL (transform)
- Business rules: status mapping, currency conversion, corporate actions
- Rejects/quarantine table populated with reasons

### Post-ETL (target)
- Row count source vs target (adjusting for intentional filters)
- Aggregate reconciliations (SUM quantity by account)
- Referential integrity to account master

### Sample checklist for trades file → warehouse

| Check | SQL / logic |
|-------|-------------|
| Completeness | `source_count = target_count + reject_count` |
| Accuracy | price × qty = trade_amount (± tolerance) |
| Consistency | account_id exists in `dim_account` |
| Dupes | `COUNT(*) vs COUNT(DISTINCT trade_id)` |

---

## Q3. “Write SQL for position reconciliation.”

```sql
-- Compare custody source vs portfolio warehouse
WITH source AS (
  SELECT account_id, symbol, SUM(quantity) AS qty
  FROM staging.custody_positions
  WHERE as_of_date = @AsOf
  GROUP BY account_id, symbol
),
target AS (
  SELECT account_id, symbol, SUM(quantity) AS qty
  FROM dw.fact_positions
  WHERE as_of_date = @AsOf
  GROUP BY account_id, symbol
)
SELECT
  COALESCE(s.account_id, t.account_id) AS account_id,
  COALESCE(s.symbol, t.symbol) AS symbol,
  s.qty AS source_qty,
  t.qty AS target_qty,
  COALESCE(s.qty, 0) - COALESCE(t.qty, 0) AS delta
FROM source s
FULL OUTER JOIN target t
  ON s.account_id = t.account_id AND s.symbol = t.symbol
WHERE COALESCE(s.qty, 0) <> COALESCE(t.qty, 0);
```

**Assertion:** result set must be empty (or only known breaks with tickets).

---

## Q4. “Market value / cash balance reconciliation example.”

```sql
SELECT
  a.account_id,
  a.cash_balance AS ledger_cash,
  p.cash_balance AS portfolio_cash,
  a.cash_balance - p.cash_balance AS delta
FROM ledger.account_balances a
JOIN portfolio.account_balances p
  ON a.account_id = p.account_id
 AND a.as_of = p.as_of
WHERE a.as_of = @AsOf
  AND ABS(a.cash_balance - p.cash_balance) > 0.01;
```

---

## Q5. “How do you validate fee calculations?”

### Business example

Advisory fee monthly = `AUM_average × annual_rate / 12` with breakpoints.

```sql
SELECT
  f.account_id,
  f.fee_amount AS actual_fee,
  ROUND(b.avg_aum * r.annual_rate / 12, 2) AS expected_fee,
  f.fee_amount - ROUND(b.avg_aum * r.annual_rate / 12, 2) AS delta
FROM fees.invoice_line f
JOIN fees.aum_basis b ON f.account_id = b.account_id AND f.period = b.period
JOIN fees.rate_schedule r ON f.schedule_id = r.schedule_id
WHERE f.period = @Period
  AND ABS(f.fee_amount - ROUND(b.avg_aum * r.annual_rate / 12, 2)) > 0.01;
```

**Interview tip:** Mention household aggregation, waived fees, prorated onboarding—ask BA for rule catalog.

---

## Q6. “File-based integration tests (CSV/JSON/XML)?”

```ts
import fs from 'fs';
import { parse } from 'csv-parse/sync';

test('trades file schema and mandatory fields @data', async () => {
  const raw = fs.readFileSync('inbound/trades_20260729.csv', 'utf8');
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  expect(rows.length).toBeGreaterThan(0);
  for (const row of rows) {
    expect(row.trade_id).toBeTruthy();
    expect(row.account_id).toMatch(/^ACC-/);
    expect(Number(row.quantity)).toBeGreaterThan(0);
    expect(row.side).toMatch(/BUY|SELL/);
  }
});
```

XML: validate against XSD; JSON: Ajv/Zod schema.

---

## Q7. “Completeness check for daily batch.”

```sql
-- Expected accounts vs accounts with positions for business day
SELECT e.account_id
FROM ref.expected_active_accounts e
WHERE e.as_of = @AsOf
  AND NOT EXISTS (
    SELECT 1 FROM dw.fact_positions p
    WHERE p.account_id = e.account_id AND p.as_of_date = @AsOf
  );
```

---

## Q8. “How do you handle floating point vs money?”

### Answer

“Never trust binary float for cash. Prefer DECIMAL/NUMERIC in DB, integer cents in code, or decimal libraries. Tests use exact DECIMAL compares or defined tolerances agreed with finance (e.g. $0.01).”

```ts
import Decimal from 'decimal.js';

const expected = new Decimal(price).mul(qty).toDecimalPlaces(2);
expect(new Decimal(actual).eq(expected)).toBe(true);
```

---

## Q9. “Python vs TypeScript for data testing?”

| Use Python when | Use TypeScript when |
|-----------------|---------------------|
| Heavy pandas profiling | Same repo as Playwright |
| Data engineering team stack | Unified CI & skills |
| Great Expectations / dbt tests | API+UI+SQL hybrid fixtures |

“I’m bilingual: Python for deep ETL analytics, TS for integrated SDET platform. Principal decision is **consistency + ownership**, not language purity.”

### Python sketch

```python
import pandas as pd

src = pd.read_csv("custody.csv")
tgt = pd.read_sql("SELECT * FROM fact_positions WHERE as_of_date=%s", conn, params=[as_of])

merged = src.merge(tgt, on=["account_id", "symbol"], how="outer", indicator=True)
breaks = merged[merged["_merge"] != "both"]
assert breaks.empty, breaks.head(20)
```

---

## Q10. “CDC / incremental load validation?”

```sql
-- Watermark sanity: no target rows newer than source max without match
SELECT COUNT(*) AS bad
FROM dw.fact_transactions t
WHERE t.ingested_at >= @WindowStart
  AND NOT EXISTS (
    SELECT 1 FROM staging.transactions s WHERE s.transaction_id = t.transaction_id
  );
```

Also verify **idempotent replay**: re-running pipeline doesn’t duplicate facts.

---

## Q11. “Data quality severity model?”

| Severity | Example | Gate |
|----------|---------|------|
| Blocker | Cash imbalance > $1 across book | Fail release |
| High | Fee variance for > N accounts | Fail nightly; patch |
| Medium | Optional attribute null spike | Ticket + trend |
| Low | Formatting anomaly | Backlog |

---

## Q12. “Explain slowly changing dimensions in testing.”

“For client risk profile SCD2: assert current row `is_current=1`, historical rows closed with `end_date`, and no overlapping effective ranges.”

```sql
SELECT client_id
FROM dim_client_risk
GROUP BY client_id, effective_start, effective_end
HAVING COUNT(*) > 1;
```
