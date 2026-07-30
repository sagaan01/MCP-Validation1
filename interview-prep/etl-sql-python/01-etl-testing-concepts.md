# 1. ETL Testing Concepts — Interview Q&A + Scenarios

---

## Part A — Core concepts (say these cleanly)

### What is ETL?

**E – Extract:** Pull data from source (DB, API, CSV, custody file, queue).  
**T – Transform:** Clean, map, calculate, join, standardize.  
**L – Load:** Write into target (warehouse, reporting DB, data mart).

**Interview line:**  
> “ETL moves data from source systems into analytics/reporting stores. My job is to prove nothing important is lost, changed wrongly, or loaded twice.”

### What is ETL testing?

Validating that pipeline behavior matches business rules across:
- source → staging → transform → target
- including rejects, late arrivals, re-runs, and as-of dates

### ETL vs ELT

| | ETL | ELT |
|--|-----|-----|
| Transform where? | Before load (often ETL server) | After load (in warehouse) |
| Testing focus | Validate transform logic + load | Validate in-warehouse SQL transforms |

Same quality dimensions either way.

### Data quality dimensions (memorize)

| Dimension | Question | Example |
|-----------|----------|---------|
| Completeness | Anything missing? | 10,000 source rows → 9,970 target |
| Accuracy | Values correct? | Fee ≠ schedule math |
| Consistency | Systems agree? | Custody qty ≠ portfolio qty |
| Timeliness | Fresh enough? | Positions still yesterday’s at 9 AM |
| Uniqueness | Dupes? | Same `trade_id` twice |
| Validity | Allowed values? | `side` not in (`BUY`,`SELL`) |

---

## Part B — What to test at each stage

### 1) Pre-ETL / source checks

- File arrived (name pattern, time window)
- Not empty / not truncated
- Schema: columns, types, delimiters
- Checksum / row count vs control file
- Encoding / date formats

### 2) Staging checks

- Row count source ≈ staging
- Mandatory fields populated
- Rejects quarantined with reasons
- No unexpected null spikes

### 3) Transform checks

- Business mapping (status codes, account types)
- Calculations (fees, MV, FX)
- SCD / history logic if used
- Surrogate keys / lookups found
- Error handling for bad lookups

### 4) Load / target checks

- Insert/update/delete counts
- Incremental watermark correctness
- Idempotent re-run (no double load)
- Referential integrity to dimensions
- Aggregate recon (SUM qty by account)

### 5) Post-load business recon

- Source of truth vs target (custody vs warehouse)
- UI/API vs DB for critical fields
- Break report with severity

---

## Part C — Scenario-based questions

### Scenario 1 — Missing trades after overnight load

**Prompt:**  
“Business says 30 trades from yesterday’s file are missing in reporting. How do you investigate?”

**Strong answer structure:**
1. Confirm **as-of date** and source file name/version  
2. Source row count vs staging vs target  
3. Check **reject/quarantine** table for those trade IDs  
4. Check transform filters (cancelled trades excluded?)  
5. Check incremental watermark (did job skip file?)  
6. Produce break list: `trade_id` present in source not in target  
7. Classify severity + permanent automated check  

**Example SQL idea:**
```sql
SELECT s.trade_id
FROM staging.trades s
WHERE s.trade_date = @D
  AND NOT EXISTS (
    SELECT 1 FROM dw.fact_trades t WHERE t.trade_id = s.trade_id
  );
```

**Interview closer:**  
> “I’d automate this as a nightly completeness rule and fail the data-quality gate if blocker breaks remain.”

---

### Scenario 2 — Row counts match but amounts are wrong

**Prompt:**  
“Counts are equal, but total trade amount differs by $1.2M. What do you test?”

**Answer:**  
Counts alone are weak. Do **aggregate recon** and **column-level accuracy**.

```sql
SELECT
  'SOURCE' AS src, COUNT(*) cnt, SUM(trade_amount) amt
FROM staging.trades WHERE trade_date = @D
UNION ALL
SELECT
  'TARGET', COUNT(*), SUM(trade_amount)
FROM dw.fact_trades WHERE trade_date = @D;
```

Then find mismatched keys:

```sql
SELECT s.trade_id, s.trade_amount AS src_amt, t.trade_amount AS tgt_amt
FROM staging.trades s
JOIN dw.fact_trades t ON s.trade_id = t.trade_id
WHERE s.trade_date = @D
  AND ABS(s.trade_amount - t.trade_amount) > 0.01;
```

**Likely causes:** FX conversion, cents rounding, fee included/excluded, sign of SELL, decimal truncation.

---

### Scenario 3 — Pipeline re-run created duplicates

**Prompt:**  
“Job failed mid-way, ops re-ran it, now duplicates. How should ETL and tests handle this?”

**Answer:**  
Loads must be **idempotent** (run twice → same result).

Test design:
1. Run pipeline once → snapshot counts/checksums  
2. Run again with same input  
3. Assert counts unchanged; no duplicate natural keys  

```sql
SELECT trade_id, COUNT(*) 
FROM dw.fact_trades
GROUP BY trade_id
HAVING COUNT(*) > 1;
```

**Design note:** Use merge/upsert on business key, or delete+load by partition (`trade_date`).

---

### Scenario 4 — Late arriving file

**Prompt:**  
“Custody file arrived at 10 AM instead of 2 AM. Reports already ran. What’s your test/ops strategy?”

**Answer:**  
- SLA/timeliness check fails and alerts  
- Catch-up job / replay partition  
- Recon after replay  
- Report watermark: don’t publish “final” until data DQ = PASS  

**Test:** Simulate late file in lower env; assert alert + successful replay + recon green.

---

### Scenario 5 — Soft deletes / closed accounts still appearing

**Prompt:**  
“Closed accounts still show in active portfolio report.”

**Answer:**  
Validate transform filter and SCD end-dating.

```sql
SELECT account_id
FROM dw.dim_account
WHERE status = 'CLOSED'
  AND account_id IN (
    SELECT account_id FROM report.active_accounts WHERE as_of = @D
  );
```

Also check effective dates: `is_current = 1` only for open.

---

### Scenario 6 — Incremental load missed a day

**Prompt:**  
“Watermark jumped from Day 1 to Day 3; Day 2 missing.”

**Answer:**  
- Inspect control table watermark  
- Compare distinct `business_date` in target vs expected calendar  
- Backfill Day 2  
- Add test: no gaps in date spine for mandatory feeds  

```sql
-- Pseudo: expected dates minus loaded dates
SELECT d.expected_date
FROM ref.calendar d
WHERE d.expected_date BETWEEN @Start AND @End
  AND d.is_business_day = 1
  AND NOT EXISTS (
    SELECT 1 FROM dw.load_control c
    WHERE c.source_name = 'TRADES' AND c.loaded_date = d.expected_date
  );
```

---

### Scenario 7 — Rejects without reasons

**Prompt:**  
“100 rows rejected, reason blank. Acceptable?”

**Answer:**  
No. Rejects need actionable reasons (`UNKNOWN_ACCOUNT`, `BAD_DATE`, `FAILED_LOOKUP`).  
Test: every reject row has `reason_code` + sample payload.  
UAT/ops can’t fix blank reasons.

---

### Scenario 8 — Wealth positions recon

**Prompt:**  
“How do you validate positions after ETL from custody?”

**Answer:**  
FULL OUTER JOIN on (`account_id`,`symbol`) or CUSIP; qty delta ≠ 0 is a break; severity by abs(delta) or MV impact.

```sql
WITH c AS (
  SELECT account_id, symbol, SUM(qty) qty
  FROM staging.custody_positions
  WHERE as_of = @D GROUP BY 1,2
),
w AS (
  SELECT account_id, symbol, SUM(qty) qty
  FROM dw.fact_positions
  WHERE as_of = @D GROUP BY 1,2
)
SELECT
  COALESCE(c.account_id,w.account_id) account_id,
  COALESCE(c.symbol,w.symbol) symbol,
  c.qty custody_qty,
  w.qty warehouse_qty,
  COALESCE(c.qty,0) - COALESCE(w.qty,0) delta
FROM c
FULL OUTER JOIN w
  ON c.account_id = w.account_id AND c.symbol = w.symbol
WHERE COALESCE(c.qty,0) <> COALESCE(w.qty,0);
```

---

### Scenario 9 — What automated ETL tests belong in CI vs nightly?

| In PR/CI (fast) | Nightly / post-ETL |
|-----------------|--------------------|
| Transform unit tests with golden tiny datasets | Full recon vs custody |
| Schema contract tests | Volume completeness |
| Sample integration with testcontainers | Fee/performance heavy checks |
| SQL lint / dbt tests on models | Cross-system consistency |

**Interview line:**  
> “CI protects logic regressions with small fixtures; nightly protects production-like volume and source-of-truth recon.”

---

### Scenario 10 — Explain your ETL test plan for a new “fees” pipeline

**Answer outline:**
1. Requirements: fee schedule, breakpoints, household rules  
2. Source contract: invoice input fields  
3. Golden cases table (10–20 known accounts)  
4. Staging completeness  
5. Transform accuracy (expected fee SQL/Python)  
6. Load uniqueness on `invoice_id`  
7. Downstream statement feed check  
8. Gate: blocker if variance > $0.01 for in-scope sample  

---

## Part D — Classic short questions

**Q: Difference between verification and validation in ETL?**  
Verification = built right (schema, counts, pipeline ran).  
Validation = right data for business (fee formula, positions match custody).

**Q: What is a control table?**  
Metadata for pipeline runs: watermark, row counts, status, start/end time—used for ops and tests.

**Q: What is data thresholding?**  
Allow small tolerances (e.g. $0.01) agreed with finance; above threshold = fail.

**Q: How do you test SCD Type 2?**  
No overlapping effective dates; only one current row; history preserved on change.

**Q: Source of truth?**  
For holdings often custody/official books; for app state maybe ledger service—confirm per domain, never assume.
