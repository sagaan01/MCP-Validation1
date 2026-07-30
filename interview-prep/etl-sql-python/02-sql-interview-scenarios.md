# 2. SQL Interview Scenarios — Concepts + Q&A + Examples

Focus: what Principal/Senior SDETs get asked for **data validation / ETL / finance**.

---

## Part A — SQL concepts interviewers expect

| Concept | Why it matters in testing |
|---------|---------------------------|
| `JOIN` / `LEFT` / `FULL OUTER` | Recon source vs target |
| `GROUP BY` + aggregates | Completeness/accuracy of sums |
| `HAVING` | Duplicates, threshold breaches |
| Window functions | Rank lots, running cash, detect gaps |
| `CASE` | Business mapping validation |
| NULL handling | Missing data vs zero |
| Subqueries / CTEs | Readable recon scripts |
| Indexes (basic) | Why a recon query is slow |
| Transactions isolation (basic) | Dirty reads during load |

**Interview tip:** Speak in business outcomes (“find position breaks”), then write SQL.

---

## Part B — Scenario Q&A with SQL

### Scenario 1 — Find duplicates

**Prompt:** “How do you find duplicate trades in the target table?”

```sql
SELECT trade_id, COUNT(*) AS cnt
FROM dw.fact_trades
GROUP BY trade_id
HAVING COUNT(*) > 1
ORDER BY cnt DESC;
```

**Follow-up:** “Show the duplicate rows.”

```sql
SELECT *
FROM dw.fact_trades t
WHERE EXISTS (
  SELECT 1 FROM dw.fact_trades x
  WHERE x.trade_id = t.trade_id
  GROUP BY x.trade_id
  HAVING COUNT(*) > 1
);
```

---

### Scenario 2 — Completeness: source not in target

**Prompt:** “Write SQL to find accounts in source missing in target.”

```sql
SELECT s.account_id
FROM staging.accounts s
LEFT JOIN dw.dim_account d ON d.account_id = s.account_id
WHERE d.account_id IS NULL;
```

Or:

```sql
SELECT account_id FROM staging.accounts
EXCEPT
SELECT account_id FROM dw.dim_account;
```

---

### Scenario 3 — Cash reconciliation

**Prompt:** “Ledger cash and portfolio cash disagree. SQL?”

```sql
SELECT
  l.account_id,
  l.cash_balance AS ledger_cash,
  p.cash_balance AS portfolio_cash,
  l.cash_balance - p.cash_balance AS delta
FROM ledger.account_balances l
JOIN portfolio.account_balances p
  ON l.account_id = p.account_id
 AND l.as_of = p.as_of
WHERE l.as_of = @AsOf
  AND ABS(l.cash_balance - p.cash_balance) > 0.01;
```

**Say out loud:** “Tolerance $0.01 agreed with finance; I never invent rounding policy alone.”

---

### Scenario 4 — Position recon with FULL OUTER JOIN

**Prompt:** “Catch missing on either side and qty mismatches.”

```sql
SELECT
  COALESCE(c.account_id, w.account_id) AS account_id,
  COALESCE(c.symbol, w.symbol) AS symbol,
  c.qty AS custody_qty,
  w.qty AS warehouse_qty
FROM (
  SELECT account_id, symbol, SUM(quantity) qty
  FROM staging.custody_positions
  WHERE as_of_date = @AsOf
  GROUP BY account_id, symbol
) c
FULL OUTER JOIN (
  SELECT account_id, symbol, SUM(quantity) qty
  FROM dw.fact_positions
  WHERE as_of_date = @AsOf
  GROUP BY account_id, symbol
) w
  ON c.account_id = w.account_id AND c.symbol = w.symbol
WHERE COALESCE(c.qty, 0) <> COALESCE(w.qty, 0);
```

**Why FULL OUTER?**  
Left-only = missing in warehouse; right-only = extra in warehouse; both = mismatch.

---

### Scenario 5 — NULL vs zero (fee trap)

**Prompt:** “Why is `WHERE fee_amount <> 0` dangerous?”

**Answer:**  
SQL three-valued logic: `NULL <> 0` is UNKNOWN → row filtered out. Missing fees disappear from the check.

**Better:**
```sql
SELECT invoice_id, account_id, fee_amount
FROM fees.invoice_line
WHERE fee_amount IS NULL
   OR ABS(fee_amount - expected_fee) > 0.01;
```

---

### Scenario 6 — Fee expected vs actual

**Prompt:** “Validate advisory fee for a period.”

```sql
SELECT
  f.account_id,
  f.fee_amount AS actual_fee,
  ROUND(b.avg_aum * r.annual_rate / 12.0, 2) AS expected_fee,
  f.fee_amount - ROUND(b.avg_aum * r.annual_rate / 12.0, 2) AS delta
FROM fees.invoice_line f
JOIN fees.aum_basis b
  ON f.account_id = b.account_id AND f.period = b.period
JOIN fees.rate_schedule r
  ON f.schedule_id = r.schedule_id
WHERE f.period = @Period
  AND ABS(
    f.fee_amount - ROUND(b.avg_aum * r.annual_rate / 12.0, 2)
  ) > 0.01;
```

**Interview note:** Real schedules have breakpoints—mention you’d encode BA rules, not invent math.

---

### Scenario 7 — Window function: latest price per symbol

**Prompt:** “Get latest price as-of each day.”

```sql
SELECT symbol, price_date, price
FROM (
  SELECT
    symbol,
    price_date,
    price,
    ROW_NUMBER() OVER (
      PARTITION BY symbol, price_date
      ORDER BY ingested_at DESC
    ) AS rn
  FROM market.prices
  WHERE price_date = @AsOf
) x
WHERE rn = 1;
```

---

### Scenario 8 — Running / ordered cash check (simplified)

**Prompt:** “Detect accounts where transaction sum doesn’t explain cash change.”

```sql
SELECT
  a.account_id,
  a.opening_cash,
  a.closing_cash,
  COALESCE(SUM(t.cash_amount), 0) AS txn_sum,
  a.opening_cash + COALESCE(SUM(t.cash_amount), 0) AS implied_closing,
  a.closing_cash - (a.opening_cash + COALESCE(SUM(t.cash_amount), 0)) AS delta
FROM dw.account_cash_daily a
LEFT JOIN dw.fact_transactions t
  ON t.account_id = a.account_id
 AND t.txn_date = a.as_of
WHERE a.as_of = @AsOf
GROUP BY a.account_id, a.opening_cash, a.closing_cash
HAVING ABS(
  a.closing_cash - (a.opening_cash + COALESCE(SUM(t.cash_amount), 0))
) > 0.01;
```

---

### Scenario 9 — Referential integrity orphans

**Prompt:** “Positions referencing missing accounts.”

```sql
SELECT p.account_id, p.symbol, p.quantity
FROM dw.fact_positions p
LEFT JOIN dw.dim_account a ON a.account_id = p.account_id
WHERE a.account_id IS NULL;
```

---

### Scenario 10 — Top breaks by money impact

**Prompt:** “Prioritize recon breaks for triage.”

```sql
SELECT
  account_id,
  symbol,
  custody_qty,
  warehouse_qty,
  (custody_qty - warehouse_qty) * COALESCE(price, 0) AS mv_impact
FROM recon.position_breaks b
LEFT JOIN market.prices p
  ON p.symbol = b.symbol AND p.price_date = b.as_of
ORDER BY ABS((custody_qty - warehouse_qty) * COALESCE(price, 0)) DESC;
```

**Principal angle:** Triage by **financial impact**, not row count alone.

---

### Scenario 11 — SCD2 overlap detection

**Prompt:** “Find overlapping effective ranges for client risk profile.”

```sql
SELECT a.client_id, a.effective_start, a.effective_end,
       b.effective_start AS other_start, b.effective_end AS other_end
FROM dim_client_risk a
JOIN dim_client_risk b
  ON a.client_id = b.client_id
 AND a.sk <> b.sk
 AND a.effective_start <= COALESCE(b.effective_end, '9999-12-31')
 AND b.effective_start <= COALESCE(a.effective_end, '9999-12-31');
```

---

### Scenario 12 — COUNT(*) vs COUNT(col)

**Prompt:** “Difference?”

```sql
SELECT
  COUNT(*) AS all_rows,
  COUNT(fee_amount) AS non_null_fees,
  COUNT(DISTINCT account_id) AS distinct_accounts
FROM fees.invoice_line
WHERE period = @Period;
```

`COUNT(col)` ignores NULLs — useful for completeness of mandatory fields.

---

## Part C — Quick-fire SQL interview answers

**Q: INNER vs LEFT JOIN?**  
INNER = matches only. LEFT = all left + matches; unmatched right side NULL — used to find missing targets.

**Q: WHERE vs HAVING?**  
WHERE filters rows before aggregation; HAVING filters groups after `GROUP BY`.

**Q: What is a CTE?**  
`WITH` clause — readable steps for recon (source CTE, target CTE, compare).

**Q: How do you handle money in SQL?**  
`DECIMAL`/`NUMERIC`, not float. Compare with absolute tolerance.

**Q: How do you make recon queries CI-friendly?**  
Parameterize `@AsOf`; return zero rows = pass; publish row count as metric.

---

## Part D — Whiteboard pattern (use every time)

```text
1) Define grain (account+symbol+as_of)
2) Aggregate each side to that grain
3) FULL OUTER JOIN
4) Filter deltas / nulls
5) Order by business impact
6) Empty result = PASS
```

Practice drawing this; then fill SQL.
