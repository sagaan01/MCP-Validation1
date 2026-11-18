# SQL & Data Reconciliation — Interview Questions & Answers (Basic → Lead)

Practical SQL patterns for S2T compares, DQ checks, SCD, and scalable validation.

**Total questions:** 55

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] Why is SQL critical for ETL QA?

**Answer:** SQL is how you prove data correctness independently of tools. Interviewers expect you to design reconciliations and DQ checks in SQL/Spark SQL.

---

## Q2. [B] COUNT(*) vs COUNT(column)?

**Answer:** `COUNT(*)` counts rows; `COUNT(col)` ignores NULLs in that column. Using the wrong one causes false DQ conclusions.

---

## Q3. [B] What is a PRIMARY KEY vs BUSINESS KEY?

**Answer:** PK/SK is technical identity; business key is natural identity (customer_id). Uniqueness tests often apply to BK + current flag.

---

## Q4. [B] INNER vs LEFT JOIN in validation?

**Answer:** INNER drops non-matches; LEFT keeps left side. For “missing in target” use LEFT JOIN … WHERE target.key IS NULL.

---

## Q5. [B] What is GROUP BY used for in reconciliations?

**Answer:** Build control totals by date/region/product to localize mismatches quickly.

---

## Q6. [B] What is HAVING vs WHERE?

**Answer:** WHERE filters rows before aggregate; HAVING filters aggregates. Duplicates use HAVING COUNT(*)>1.

---

## Q7. [B] What is COALESCE / NVL?

**Answer:** Replace NULL with default. Dangerous if used inconsistently between source compare and target logic.

---

## Q8. [B] What is DISTINCT and its risk?

**Answer:** Removes duplicate rows. Masks underlying duplicate defects if used carelessly in reconciliations.

---

## Q9. [B] What are aggregate functions you use daily?

**Answer:** COUNT, SUM, MIN, MAX, AVG. For money prefer SUM with DECIMAL types.

---

## Q10. [B] What is a subquery?

**Answer:** Query nested in another. Useful for expected value computation vs target.

---

## Q11. [P] Write a duplicate finder.

**Answer:**
```sql
SELECT customer_bk, COUNT(*)
FROM dim_customer
WHERE is_current = 1
GROUP BY customer_bk
HAVING COUNT(*) > 1;
```
**Meaning:** Enforces one current version per customer.

---

## Q12. [P] Write missing keys query (source not in target).

**Answer:**
```sql
SELECT s.order_id
FROM src_orders s
LEFT JOIN tgt_orders t
  ON s.order_id = t.order_id AND t.batch_id = @batch
WHERE t.order_id IS NULL;
```

---

## Q13. [P] Write extra keys query (target not in source).

**Answer:** Reverse anti-join—target LEFT JOIN source WHERE source.key IS NULL for same batch filters.

---

## Q14. [P] Compare SUMs with tolerance.

**Answer:**
```sql
SELECT ABS(s.amt - t.amt) AS diff
FROM (SELECT SUM(amount) amt FROM src WHERE ...) s
CROSS JOIN (SELECT SUM(amount) amt FROM tgt WHERE batch_id=@b) t
WHERE ABS(s.amt - t.amt) > 0.01;
```

---

## Q15. [P] Null check for mandatory columns.

**Answer:** `SELECT COUNT(*) FROM tgt WHERE batch_id=@b AND email IS NULL;` Expect 0.

---

## Q16. [P] Referential integrity check.

**Answer:** Fact LEFT JOIN dim WHERE dim.sk IS NULL; orphans fail gate.

---

## Q17. [P] Use window functions for latest record.

**Answer:**
```sql
SELECT * FROM (
  SELECT t.*, ROW_NUMBER() OVER (PARTITION BY bk ORDER BY upd_ts DESC) rn
  FROM staging t
) x WHERE rn = 1;
```

---

## Q18. [P] Detect overlapping SCD2 dates.

**Answer:** Self-join versions of same BK where date ranges overlap; expect zero overlaps.

---

## Q19. [P] Validate length / pattern.

**Answer:** `WHERE LEN(phone) NOT BETWEEN 10 AND 15 OR phone LIKE '%[^0-9+]%'` (dialect-specific).

---

## Q20. [P] Minus/Except pattern.

**Answer:** `SELECT key, hash FROM src EXCEPT SELECT key, hash FROM tgt;` Quick set difference when supported.

---

## Q21. [P] Checksum/hash per row.

**Answer:** Hash concatenated critical columns; compare hashes by key to detect any field change without comparing each column first.

---

## Q22. [P] Date spine gap detection.

**Answer:** Generate calendar dates; LEFT JOIN loaded dates; find missing business days.

---

## Q23. [P] Percentile/outlier checks.

**Answer:** Flag amounts below 0 or above P99 historical threshold for anomaly DQ.

---

## Q24. [S] How do you structure a reusable reconciliation SQL template?

**Answer:** Parameters for table names, keys, measures, batch; standardized output columns: `check_name, grain, src_value, tgt_value, diff, status`.

---

## Q25. [S] Why can JOIN cause incorrect SUM?

**Answer:** One-to-many fanout duplicates measure rows before SUM. Always validate grain before aggregating.

---

## Q26. [S] NULL = NULL is unknown—impact?

**Answer:** Joins don’t match NULLs; equality filters drop them. Use IS NULL patterns explicitly.

---

## Q27. [S] How do you compare floating aggregates safely?

**Answer:** Prefer DECIMAL; if float unavoidable, define tolerance and investigate large diffs only—don’t ignore systematic bias.

---

## Q28. [S] Explain EXISTS vs IN for anti-patterns.

**Answer:** `NOT IN` with NULLs in subquery can return empty unexpectedly. Prefer `NOT EXISTS` for missing-key checks.

---

## Q29. [S] How do you optimize huge compare SQL?

**Answer:** Filter batch/date first; compare aggregates; restrict key diffs to failing partitions; index temp compare tables; avoid SELECT *.

---

## Q30. [S] Dynamic SQL for metadata-driven DQ—pros/cons?

**Answer:** Pros: scale rules. Cons: injection risk, harder review. Lead enforces allowlisted table names and code review.

---

## Q31. [S] How do you validate SCD2 current flag consistency with dates?

**Answer:** Current row `end_dt` null/high date; no other open rows; start_dt <= end_dt; contiguous history optional rule.

---

## Q32. [S] Cross-database compares (Teradata vs Azure).

**Answer:** Export control totals to neutral store; or linked compare DB; normalize types; never assume identical dialect functions.

---

## Q33. [L] Define SQL coding standards for QA team.

**Answer:** Formatting, mandatory batch filters, no silent DISTINCT, results logging pattern, peer review for P0 checks, performance budget.

---

## Q34. [L] How do you review a junior’s reconciliation for false confidence?

**Answer:** Look for count-only, missing grain, improper joins, ignored NULLs, no idempotent re-run proof, no business measure compare.

---

## Q35. [B] What is UNION vs UNION ALL?

**Answer:** UNION deduplicates; UNION ALL keeps duplicates. For stacking src/tgt metrics use UNION ALL.

---

## Q36. [B] What is a CTE (WITH clause)?

**Answer:** Named subquery for readable multi-step reconciliations—great in interviews to structure answers.

---

## Q37. [P] Example CTE reconciliation structure.

**Answer:**
```sql
WITH src AS (...),
tgt AS (...),
cmp AS (SELECT ...)
SELECT * FROM cmp WHERE status='FAIL';
```

---

## Q38. [P] Validate email format roughly.

**Answer:** `WHERE email NOT LIKE '%_@__%.__%'` as smoke check—business may need stricter rules.

---

## Q39. [P] Test case sensitivity / collation issues.

**Answer:** 'ABC' vs 'abc' may match differently across Teradata/Azure collations—normalize with UPPER if business says case-insensitive.

---

## Q40. [S] How do you detect silently rounded decimals?

**Answer:** Compare source scale to target; `amount - ROUND(amount,2)` checks; SUM diffs accumulation.

---

## Q41. [S] Window SUM for running control totals.

**Answer:** Use to explain cumulative loads in interviews; validate progressive daily totals match expected.

---

## Q42. [S] Pivot/unpivot testing scenarios.

**Answer:** Ensure measure columns unpivoted don’t drop null measures incorrectly; count rows = expected attribute cardinality.

---

## Q43. [L] When do you push checks into unit tests vs SQL gates?

**Answer:** Pure transform functions → unit tests; data-dependent cross-table rules → SQL/Spark gates on real batches.

---

## Q44. [B] What is referential integrity?

**Answer:** Children reference existing parents. Foundation DQ for warehouses.

---

## Q45. [P] Find parents without children (orphan dimensions optional).

**Answer:** Sometimes valid; if business requires every product sold, test accordingly—don’t assume.

---

## Q46. [S] Explain predicate pushdown conceptually.

**Answer:** Filters applied early in Spark/SQL engines. QA writes partition-friendly predicates so checks finish within SLA.

---

## Q47. [S] Validate slowly changing measures (corrections).

**Answer:** Restated facts: test that correction batch adjusts prior day with audit reason; downstream YTD rebuilds.

---

## Q48. [L] Build a library of 10 mandatory SQL checks for every entity.

**Answer:** Example set: rowcount, BK unique current, mandatory nulls, RI, amount sum, min/max dates, duplicates, schema contract, watermark sanity, reject rate.

---

## Q49. [P] Use CASE in mapping validation.

**Answer:** Recreate status decode with CASE and compare to target status_desc.

---

## Q50. [S] Detect duplicate loads of same batch_id.

**Answer:** Audit table shows two success loads; target counts double; gate on `batch_id` uniqueness in control table.

---

## Q51. [B] What is TRUNCATE vs DELETE in load patterns?

**Answer:** Truncate is bulk empty—test full reload paths carefully for accidental wipe beyond partition scope.

---

## Q52. [P] Validate partition overwrite didn’t touch other dates.

**Answer:** Snapshot counts for dt-1 and dt+1 before/after job; expect unchanged.

---

## Q53. [S] Hash join vs nested loop—why mention?

**Answer:** Shows you understand performance of validation queries when talking senior/lead—pair with EXPLAIN collaboration.

---

## Q54. [L] How do you ensure SQL checks are environment-portable?

**Answer:** Parameterize schema names; avoid proprietary functions when shared; document dialect variants Teradata vs T-SQL vs Spark SQL.

---

## Q55. [P] Example: percent completeness.

**Answer:** `1.0 * COUNT(col)/COUNT(*)` for optional fields monitoring fill rates over time.

---
