# Teradata — Interview Questions & Answers (Basic → Lead)

Teradata concepts and migration/reconciliation testing against Azure targets for Data/ETL QA Analysts.

**Total questions:** 55

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What is Teradata?

**Answer:** An enterprise Massively Parallel Processing (MPP) data warehouse designed for large-scale analytics SQL workloads.

**JD relevance:** Often the legacy system of record you extract from or reconcile against during Azure migrations.

---

## Q2. [B] What does MPP mean in Teradata?

**Answer:** Data and query processing are distributed across many Access Module Processors (AMPs). Each AMP owns a portion of the rows.

---

## Q3. [B] What is a Primary Index (PI) in Teradata?

**Answer:** The distribution key that decides which AMP stores a row. It is not the same as a Primary Key, though they can be identical.

**Example:** PI on `customer_id` spreads customers by that value’s hash.

---

## Q4. [B] Primary Index vs Primary Key?

**Answer:** PK enforces uniqueness (logical). PI controls physical distribution/retrieval. UPI is unique PI; NUPI is non-unique PI.

---

## Q5. [B] What is UPI vs NUPI?

**Answer:** UPI guarantees unique values and even retrieval of single rows. NUPI allows duplicates and can cause skew if many rows share popular values.

---

## Q6. [B] What is an AMP?

**Answer:** Access Module Processor—the parallel worker storing a slice of table data and executing its part of the query.

---

## Q7. [B] What is a Table in Teradata vs a View?

**Answer:** Tables store data; views are saved SELECT statements. Testing views means validating underlying logic and permissions.

---

## Q8. [B] What are common Teradata data types you must map carefully?

**Answer:** DECIMAL, INTEGER, BIGINT, VARCHAR/CHAR, DATE, TIMESTAMP, NUMBER. Watch CHAR padding and DECIMAL scale when moving to Azure.

---

## Q9. [B] What is a SET table vs MULTISET table?

**Answer:** SET rejects duplicate rows (based on row identity rules); MULTISET allows duplicate rows. Knowing table type explains “missing” duplicates after load.

---

## Q10. [B] What is a Collect Statistics and why care in QA?

**Answer:** Stats help optimizer. Stale stats can slow validation queries—not wrong results, but blocked test windows.

---

## Q11. [P] How do you write a basic reconciliation from Teradata?

**Answer:** Aggregate by business date in Teradata export; compare to Azure curated aggregates for same grain and filters.

```sql
SELECT order_dt, COUNT(*), SUM(amount)
FROM edw.orders
WHERE order_dt BETWEEN DATE '2026-09-01' AND DATE '2026-09-07'
GROUP BY 1;
```

---

## Q12. [P] How do you find duplicates in Teradata?

**Answer:** `SELECT bk, COUNT(*) FROM t GROUP BY 1 HAVING COUNT(*) > 1;` For current SCD rows include `AND is_current='Y'`.

---

## Q13. [P] What is QUALIFY in Teradata?

**Answer:** Filters window function results. Useful to keep latest row per key:

```sql
SELECT * FROM cust
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY upd_ts DESC) = 1;
```

---

## Q14. [P] How do you test Teradata joins for ETL extract queries?

**Answer:** Confirm join keys, left vs inner, and that extract SQL in ADF matches approved mapping SQL—version drift is common.

---

## Q15. [P] What is skew and how does it affect testing?

**Answer:** Uneven AMP distribution (hot PI values) slows queries. Your huge reconciliations may time out—mitigate with date filters or aggregate staging.

---

## Q16. [P] Explain volatile vs global temporary tables for test harnesses.

**Answer:** Volatile tables exist for session; GTTs have persistent def, session data. QA often stages expected results in volatiles for compares.

---

## Q17. [P] How do you compare CHAR/VARCHAR issues Teradata → Azure?

**Answer:** Teradata CHAR pads spaces; Azure may trim. Normalize with `TRIM` both sides before compare to avoid false mismatches.

---

## Q18. [P] How do you validate DATE vs TIMESTAMP migrations?

**Answer:** Check cast rules, midnight boundaries, and time zone. A DATE in Teradata becoming DATETIME in Azure can shift business_date grouping.

---

## Q19. [P] What are FastLoad / MultiLoad / TPump conceptually?

**Answer:** Bulk load utilities for Teradata. As QA you may not run them daily, but understand: FastLoad empty tables, MultiLoad maintenance, TPump near-real-time small volumes—and their failure/restart behaviors.

---

## Q20. [P] How do you test deletes/updates coming from Teradata CDC?

**Answer:** Apply known change scenarios; verify Azure applies same; confirm audit of deleted keys; check watermark of change capture.

---

## Q21. [P] How do you sample Teradata data for testing?

**Answer:** Use hash-based sample or RANDOM for exploratory; for proof use full aggregates + key-level diffs on failed partitions—not random-only as sole evidence.

---

## Q22. [P] What is a Join Index (concept)?

**Answer:** Prejoined/physical assist structure. Can speed reconciliations; QA shouldn’t assume indexes exist in all envs—validate performance separately.

---

## Q23. [S] How do you approach Teradata → Azure migration testing?

**Answer:** Dual-run control totals by domain, row counts, critical field compares, known difference register (legitimate variances), automated daily diffs, business sign-off per wave.

---

## Q24. [S] Teradata count matches Azure but SUM differs—what next?

**Answer:** Precision/type casting, filtered fees, duplicate partial lines, currency conversion, NULL treated as 0 inconsistently. Drill to key-level amount diffs ordered by absolute variance.

---

## Q25. [S] How do you validate historical history (SCD) moved from Teradata?

**Answer:** For sample BKs, compare version counts, effective dating, and current attributes. Spot-check that history wasn’t collapsed into SCD1 accidentally.

---

## Q26. [S] Extract from Teradata is slow and flaky—QA impact?

**Answer:** Build resilient test windows; cache extracts for repeatable tests; coordinate with DBAs on workload management; avoid full table pulls—partition by date.

---

## Q27. [S] How do you ensure extract SQL is deterministic?

**Answer:** Explicit filters, stable ordering only when required, no reliance on unset sessions formats; pin formatting of decimals/dates in landing files.

---

## Q28. [S] What is a “known difference” log in migrations?

**Answer:** Documented accepted variances (legacy bug not recreated, rounding policy change) with business approval. Prevents endless false defects while keeping transparency.

---

## Q29. [S] How do you test access/security from ADF to Teradata?

**Answer:** Verify service account least privilege (read-only extract schemas), network path via SHIR, password rotation doesn’t break pipelines, audit of extract queries.

---

## Q30. [S] Production mismatch only on month-end—how investigate?

**Answer:** Month-end late postings, special batches, fiscal calendar transforms, extra adjustment tables joined only then. Compare month-end specific jobs and adjustment feeds.

---

## Q31. [L] How do you plan Teradata decommission quality gates?

**Answer:** Parallel run acceptance thresholds, business owner sign-off, freeze period, rollback plan, archive of Teradata extracts, final reconcile certificate per domain.

---

## Q32. [L] How do you staff testing when Teradata SMEs are scarce?

**Answer:** Pair DE+QA, create SQL pattern library, record extract definitions as source of truth, invest automation so every test doesn’t need a Teradata guru.

---

## Q33. [L] How do you prioritize which Teradata subject areas migrate first for QA?

**Answer:** Choose high business value + manageable complexity first; avoid starting with most tangled finance until DQ framework proven—or do finance first if risk demands, with heavier gates.

---

## Q34. [B] What is a Database vs User in Teradata (high level)?

**Answer:** Databases/users are namespaces owning objects/space. QA needs correct database qualification `db.table` in extracts.

---

## Q35. [B] What is NULL handling difference you watch for?

**Answer:** Aggregates ignore NULLs; `NVL`/`COALESCE` defaults can change sums. Confirm mapping default rules explicitly.

---

## Q36. [P] Write SQL to find source rows not in target (logical).

**Answer:** Anti-join pattern using NOT EXISTS or LEFT JOIN IS NULL on business key and date—run on extracted staging compare DB if cross-platform.

---

## Q37. [P] How do you validate views used as ETL sources?

**Answer:** Check view definition changes, underlying grants, and that WHERE constraints aren’t silently filtering. Pin view version in change management.

---

## Q38. [S] Explain locking concerns during Teradata extracts.

**Answer:** Long extracts can conflict with ETL writers; access locks vs read. Coordinate schedule; test impact of lock timeouts on pipeline retries.

---

## Q39. [S] How do you prove completeness for a Teradata daily load?

**Answer:** Source operational control table counts vs extracted counts; watermark advanced; zero gaps in date spine; Azure matches within SLA.

---

## Q40. [L] What KPIs would you show for Teradata migration QA?

**Answer:** % entities reconciled, open severity defects, variance $ amount, freshness, automation coverage of P0 rules, escape rate post-wave.

---

## Q41. [B] What is BTEQ conceptually?

**Answer:** Classic CLI for SQL/scripts in Teradata environments. You may see legacy validation scripts in BTEQ—understand outputs.

---

## Q42. [P] How do you handle CHARACTER SET / Unicode issues?

**Answer:** Compare lengths and codepoints; watch multi-byte names; ensure landing encoding UTF-8; test special characters (accents, O’Brien).

---

## Q43. [S] Skewed PI on `country_code`—why bad for testing?

**Answer:** Most rows on few AMPs → slow. Recommend better PI for large compare tables; as QA call out performance risk early.

---

## Q44. [S] How do you validate incremental deletes when source uses soft delete flags?

**Answer:** Ensure extract includes flag; Azure applies end-date/`is_active=0`; historical queries still correct; hard-delete targets only if specified.

---

## Q45. [L] How do you create a Teradata regression pack for weekly runs?

**Answer:** Curated SQL templates per domain, parameterized dates, stored results, diff vs baseline, ADF-triggered after load, triage playbook for variances.

---

## Q46. [P] What is EXPLAIN used for (conceptually) in interviews?

**Answer:** Shows optimizer plan. QA leads mention using EXPLAIN with DBAs when reconciliation SQL is too slow—not for correctness alone.

---

## Q47. [S] Cross-platform decimal: Teradata DECIMAL(18,4) to Azure FLOAT.

**Answer:** Reject this mapping for money. Insist DECIMAL/NUMERIC; add SUM absolute difference threshold tests (expect 0).

---

## Q48. [B] What is a spool space error impact on QA?

**Answer:** Query fails due to intermediate space. Redesign validation SQL (aggregate earlier, fewer wide joins) with DBA help.

---

## Q49. [L] How do you communicate Teradata risks to Azure architects?

**Answer:** Provide evidence: type matrix, skew risks, extract window constraints, CDC reliability, dual-run needs. Propose concrete test gates tied to release waves.

---

## Q50. [P] How do you test role-based access on Teradata extracts?

**Answer:** Confirm ETL account cannot see unauthorized PII tables; verify column-level restrictions if used; document masking requirements in lower envs.

---

## Q51. [S] Data exists in Teradata but not Azure for some keys only—approach?

**Answer:** Check extract filters, join drops, reject table, SCD end dating, and whether keys fall outside watermark. Produce missing-key sample for DE.

---

## Q52. [L] Lead-level: define exit criteria for “Teradata extract certified.”

**Answer:** Extract rowcounts match source controls 7 consecutive days; zero Sev-1 mapping defects; schema contract tests green; SHIR health stable; runbook signed.

---

## Q53. [B] Why do interviewers ask Teradata if target is Azure?

**Answer:** Because hybrid reality—truth often still in Teradata. Strong candidates reconcile across both, not only test Azure in isolation.

---

## Q54. [S] How do you validate PARTITION BY / analytic results used in transforms?

**Answer:** Recreate window logic in independent SQL; compare for sample partitions; watch duplicate peer rows without deterministic ORDER BY tie-breakers.

---

## Q55. [P] What is a NO PRIMARY INDEX (NoPI) table?

**Answer:** Table without PI—often staging. Random distribution; good for landing, then redistribute. QA understands staging NoPI then curated PI design.

---
