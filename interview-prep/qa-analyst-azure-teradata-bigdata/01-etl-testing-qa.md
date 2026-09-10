# ETL Testing — Interview Questions & Answers (Basic → Lead)

Focused on validating pipelines, transforms, loads, and reconciliations for large-scale environments (Azure + Teradata context).

**Total questions:** 55

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What is ETL?

**Answer:** ETL means Extract, Transform, Load. We pull data from source systems, apply business rules/cleaning, then load into a target warehouse or database.

**Example:** Extract orders from Teradata, convert currency to USD, load into Azure Synapse `fact_orders`.

**Say in interview:** “ETL is the controlled movement of data from sources to analytics stores with rules applied in between.”

---

## Q2. [B] What is the difference between ETL and ELT?

**Answer:** In ETL, transforms happen before load (often in an ETL tool/server). In ELT, raw data is loaded first, then transformed inside the target (SQL/Spark in Synapse/Snowflake/BigQuery).

**Example:** ADF copies Parquet to ADLS (load), then Synapse SQL creates curated tables (transform) → ELT style.

**Senior note:** Cloud warehouses favor ELT for scale; testing still validates rules either way.

---

## Q3. [B] What is a data pipeline?

**Answer:** A pipeline is an automated sequence of steps that moves and prepares data on a schedule or event trigger.

**Example:** Nightly ADF pipeline: Teradata extract → ADLS landing → transform notebook → curated Azure SQL → DQ checks → success email.

---

## Q4. [B] What is source-to-target (S2T) testing?

**Answer:** Comparing source data to target data using mapping rules to prove every required field and row landed correctly.

**Example:** `src.customer_id` maps to `tgt.customer_bk`; name trimmed; status coded A/I. You validate with joins and reconciliations, not guesswork.

---

## Q5. [B] What are the main stages you test in ETL?

**Answer:** Source readiness → extraction → staging/landing → transformation → loading → data quality → downstream consumption → operational checks (logs, restarts).

**Phrase:** “I test by layer so I can pinpoint where a defect was introduced.”

---

## Q6. [B] What is a mapping document?

**Answer:** The contract between source and target: column mappings, transformations, defaults, join keys, filters, SCD type, and load strategy.

**Lead note:** Ambiguous mappings are a top root cause of UAT defects—clarify before coding tests.

---

## Q7. [B] Full load vs incremental load?

**Answer:** Full load reloads the entire dataset. Incremental loads only new/changed records since the last successful run (watermark/CDC).

**Test focus:** Full = truncate/reload correctness; Incremental = boundary rows, missed updates, duplicate reprocessing.

---

## Q8. [B] What is a watermark?

**Answer:** A saved high-water mark (timestamp or ID) remembering how far the last incremental job processed.

**Example:** `last_success_ts = 2026-09-09 02:00:00`; next run pulls `update_ts > watermark` (define inclusive/exclusive clearly).

---

## Q9. [B] What is CDC?

**Answer:** Change Data Capture identifies inserts/updates/deletes from source so pipelines move only changes.

**Example:** Teradata change tables or Azure SQL CDC feed ADF.

**Test:** Verify insert/update/delete handling and late changes.

---

## Q10. [B] What is staging?

**Answer:** A temporary landing area holding raw or lightly cleansed data before business transforms.

**Why test it:** Confirms extract completeness before complex rules hide extraction bugs.

---

## Q11. [P] How do you design ETL test cases from a mapping?

**Answer:** Trace each mapping rule to at least one positive test; add negatives for rejects; cover PK/BK, mandatory fields, derived fields, filters, joins, and SCD behavior. Prioritize high-risk financial/PII fields first.

**Example:** Rule `full_name = trim(first||' '||last)` → cases for null first, double spaces, unicode names.

---

## Q12. [P] How do you validate row counts?

**Answer:** Compare source count (after same filters) to staging and target counts by batch/partition. Investigate mismatches by date/key before blaming the whole load.

**SQL idea:** `COUNT(*)` by `business_date` both sides.

---

## Q13. [P] How do you validate transformations?

**Answer:** Pick representative keys, compute expected values from source using the mapping rule in SQL, compare to target columns. Automate for critical rules; sample for low risk.

**Example:** discount = amount * rate; assert target equals computed expected within rounding rules.

---

## Q14. [P] What is data reconciliation?

**Answer:** Proving source and target agree at an agreed grain using counts, amounts, and key-level diffs.

**Senior practice:** Start aggregates for speed, then drill to anti-join on keys for mismatches.

---

## Q15. [P] How do you test joins in ETL?

**Answer:** Verify join keys, join type (left/inner), unmatched parent/child rows, and fan-out duplication.

**Example:** Left join customer to orders must not drop fee rows; inner join accidentally dropping orphans is a common defect.

---

## Q16. [P] How do you test filters and business rules?

**Answer:** Craft source rows that should be included and excluded; prove target contains only included set.

**Example:** `status='ACTIVE' AND country='US'` → inactive US and active CA must not land in US-active target.

---

## Q17. [P] What are audit columns and how do you test them?

**Answer:** Metadata like `batch_id`, `load_timestamp`, `source_system`, `record_hash`. Test they populate, stay consistent within a batch, and support lineage/debug.

---

## Q18. [P] How do you test duplicate handling?

**Answer:** Send duplicate business keys; verify dedupe rule (keep latest by update_ts, or fail batch). Assert one current row per BK if that is the rule.

**SQL:** `GROUP BY bk HAVING COUNT(*)>1`.

---

## Q19. [P] How do you test NULL handling?

**Answer:** For each nullable vs mandatory field, send nulls. Mandatory nulls should reject or default per mapping; optional nulls should remain null—not blank or zero unless specified.

---

## Q20. [P] What is referential integrity testing?

**Answer:** Ensure facts reference valid dimension keys.

**Example:** Every `fact_orders.customer_sk` exists in `dim_customer`. Orphans indicate late dims or bad surrogate assignment.

---

## Q21. [P] How do you test slowly changing dimensions (SCD)?

**Answer:** SCD1: overwrite attributes; SCD2: version history with effective dates/`is_current`. Test change events, closed old rows, no overlapping dates, exactly one current row.

---

## Q22. [P] SCD Type 1 vs Type 2 vs Type 3?

**Answer:** T1 overwrites; T2 keeps full history rows; T3 keeps limited previous value in extra columns. Most enterprise customer/address history uses T2.

---

## Q23. [P] How do you test delete logic?

**Answer:** Soft delete (flag/`end_date`) vs hard delete. Confirm CDC deletes propagate; historical reporting still correct for soft deletes.

---

## Q24. [P] What is idempotency in pipelines and how do you test it?

**Answer:** Re-running the same batch should not double-count. Re-execute pipeline for one `batch_id` and reconcile counts/amounts unchanged (or correctly upserted).

---

## Q25. [P] How do you test error/reject handling?

**Answer:** Inject bad records (type mismatch, missing FK, schema drift). Confirm rejects land in error table with reason codes; good rows still load; pipeline alerting works.

---

## Q26. [S] How do you test large ETL jobs efficiently?

**Answer:** Risk-based: partition/aggregate reconciliations for huge facts; full key compare for critical dimensions; stratified sampling; automate P0 DQ gates; deep dive only on failed partitions.

**Lead angle:** Optimize validation cost without lowering confidence on money fields.

---

## Q27. [S] Job succeeded but data is wrong—how do you approach?

**Answer:** Treat success status as insufficient. Reproduce with `batch_id`, compare control totals, check transform SQL/notebook logic, review schema casts, inspect rejects. Find whether bug is extract, map, or load.

**Phrase:** “Green pipeline is not green data.”

---

## Q28. [S] Source 10M vs target 9.8M—walk through investigation.

**Answer:** Align filters/watermark; compare by partition/date; anti-join missing keys; check reject/quarantine; confirm timezone cutoffs; verify soft deletes. Quantify business impact before severity call.

---

## Q29. [S] How do you validate incremental boundaries?

**Answer:** Test rows exactly on watermark, just below, just above; late-arriving updates; clock skew; inclusive vs exclusive predicates. Boundary bugs cause silent permanent loss or duplicates.

---

## Q30. [S] How do you handle late-arriving data in tests?

**Answer:** Define SLA and reprocessing strategy. Tests should prove re-load of partition corrects totals and remains idempotent. Add detection check for source max(ts) ahead of loaded max(ts).

---

## Q31. [S] How do you test end-to-end across multiple hops?

**Answer:** Track a golden business key from Teradata → ADLS → staging → curated → BI extract. Validate values at each hop to localize defects quickly.

---

## Q32. [S] What is control total testing?

**Answer:** Business aggregates (order count, sum amount, sum tax) compared source vs target for a period. Finance trusts control totals more than technical row counts alone.

---

## Q33. [S] How do you test data type and precision issues?

**Answer:** Compare source types to target; watch DECIMAL→FLOAT, CHAR trim, Unicode, date/timestamp zones. Example: money as FLOAT causes cent drift at scale—assert DECIMAL and SUM equality.

---

## Q34. [S] How do you prioritize ETL test coverage under time pressure?

**Answer:** P0: money, customer identity, regulatory fields, load completeness. P1: major transforms. P2: cosmetic attributes. Document residual risk for go-live decision.

---

## Q35. [S] How do you test restartability after mid-job failure?

**Answer:** Kill/fail mid-pipeline; restart; ensure no partial duplication; staging cleaned or upsert-safe; downstream only publishes after DQ pass.

---

## Q36. [S] Explain a production ETL defect you would highlight.

**Answer:** Use STAR: amounts mismatched after Azure migration due to float cast; counts matched; fixed DECIMAL; added precision reconciliation gate. Shows technical depth + prevention mindset.

---

## Q37. [S] How do ETL tests fit in CI/CD?

**Answer:** Post-load validation stage with automated SQL/Spark checks; fail promotion on P0 breach; publish DQ report artifact. Manual exploratory remains for new mappings.

---

## Q38. [S] How do you test historical reload / backfill?

**Answer:** Backfill specific date range; compare to legacy Teradata for that range; ensure adjacent dates untouched; verify watermark state after backfill.

---

## Q39. [S] What metrics show ETL quality is healthy?

**Answer:** Reconciliation pass rate, DQ defect density, mean time to detect mismatch, escaped production defects, pipeline freshness/SLA adherence, % automated P0 checks.

---

## Q40. [L] How do you build an ETL test strategy for a migration program?

**Answer:** Dual-run period, risk taxonomy by domain, quality gates per wave, entrance/exit criteria, environment data provisioning, automation backlog, RACI with DE/BA/business. Report readiness with evidence packs, not opinions.

---

## Q41. [L] How do you estimate ETL testing effort?

**Answer:** Factor source count, transform complexity, SCD, volume, environments, automation availability, and defect discovery buffer. Estimate by mapping complexity points + reconciliation automation build.

---

## Q42. [L] How do you define quality gates for release?

**Answer:** Example gates: 0 open Sev-1 data defects; control totals within tolerance; P0 automated checks green; SLA met 3 consecutive days; business sign-off on sample reconciliations.

---

## Q43. [L] How do you align ETL QA with data engineers?

**Answer:** Shared mapping source of truth, joint definition of done (includes DQ tests), shift-left unit tests on transforms, QA owns independent reconciliation as second line of defense.

---

## Q44. [L] How do you handle offshore/onshore ETL test teams?

**Answer:** Clear playbooks, golden datasets, centralized dashboards, overlap hours for Sev-1, avoid ambiguous tickets—give expected SQL evidence format.

---

## Q45. [L] When would you accept known data issues to production?

**Answer:** Only with documented business waiver, impact quantified, monitoring alert, fix date committed. Never silent acceptance on financial identity fields without sponsor sign-off.

---

## Q46. [L] How do you coach juniors on ETL testing?

**Answer:** Teach layer thinking, SQL proof habit, risk-based design, and storytelling. Review their reconciliations for false confidence (count-only checks).

---

## Q47. [L] ETL vs API vs UI testing—how do you explain boundary?

**Answer:** UI validates screens; API validates contracts; ETL validates data movement/rules/DQ at scale. Many “UI bugs” are upstream data issues—teach triage across layers.

---

## Q48. [L] How do you present go/no-go for a data release?

**Answer:** One-page: scope, gate results, residual risks, customer impact, rollback plan, recommendation. Speak business impact first, technical detail second.

---

## Q49. [L] What is your automation ROI approach for ETL QA?

**Answer:** Automate stable deterministic checks (counts, duplicates, nulls, RI, control totals). Keep volatile exploratory manual. Measure hours saved vs maintenance cost of flaky checks.

---

## Q50. [L] How do you design test data management for ETL?

**Answer:** Subset/prod-like masked data; synthetic edge cases; referential completeness across sources; refresh cadence; never unmasked PII in lower envs.

---

## Q51. [B] What is a fact table vs dimension table?

**Answer:** Facts store measurable events (orders, payments). Dimensions store descriptive context (customer, product, date). Tests differ: facts → amounts/counts; dims → SCD/uniqueness.

---

## Q52. [P] How do you test surrogate keys?

**Answer:** Ensure generated SKs are unique, stable for SCD2 versions as designed, and facts resolve to correct SK after lookup. Re-runs shouldn’t reshuffle history unexpectedly.

---

## Q53. [S] How do you validate cross-system reconciliations (Teradata vs Azure)?

**Answer:** Normalize data types/timezones; compare at business grain; maintain translation for known legitimate differences; automate daily control-total compare during hypercare.

---

## Q54. [S] What is checksum/hash based reconciliation?

**Answer:** Hash critical column sets per key or per partition to detect change quickly at scale. Useful when full row compare is too expensive; still drill down on hash mismatches.

---

## Q55. [L] How do you continuously improve ETL quality after go-live?

**Answer:** Convert every Sev-1/2 into a regression check; tune thresholds; retire noisy alerts; quarterly mapping audits; publish DQ scorecards to stakeholders.

---
