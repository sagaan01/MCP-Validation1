# Databricks — Interview Questions & Answers (Basic → Lead)

Lakehouse, Spark, Delta Lake, jobs/notebooks, Autoloader, Unity Catalog, and ETL/DQ testing patterns for Azure Databricks interviews.

**Total questions:** 62

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What is Databricks?

**Answer:** Databricks is a unified lakehouse platform built on Apache Spark for large-scale data engineering, analytics, and ML.

**QA angle:** You validate notebooks/jobs that transform ADLS data into curated Delta tables—counts, rules, DQ, and idempotent re-runs.

**Say:** “Databricks is where big transforms run; I still prove correctness with SQL/Spark reconciliations.”

---

## Q2. [B] What is a Databricks workspace?

**Answer:** The collaboration environment containing notebooks, repos, jobs, clusters, SQL warehouses, catalogs, and permissions for a team or project.

---

## Q3. [B] What is Apache Spark in Databricks?

**Answer:** The distributed compute engine underneath. Jobs split work across executors. QA cares that transforms are correct at scale and finish within SLA.

---

## Q4. [B] Notebook vs Job in Databricks?

**Answer:** Notebooks are interactive development. Jobs schedule notebooks/JARs/wheels in production with parameters, retries, and alerts.

**Test:** Same notebook logic under Job run with prod-like params.

---

## Q5. [B] What is a cluster?

**Answer:** Compute (drivers/workers) that runs Spark code. All-purpose for interactive; job clusters for scheduled runs.

**QA note:** Results must be reproducible across cluster versions/runtimes.

---

## Q6. [B] What is Databricks Runtime (DBR)?

**Answer:** The versioned software stack (Spark + libraries + optimizations). Pin runtime in higher envs; test upgrades before prod.

---

## Q7. [B] What is Delta Lake?

**Answer:** Open table format on the lake providing ACID transactions, time travel, schema enforcement/evolution, and scalable MERGE/UPDATE/DELETE.

**Why it matters for QA:** Enables reliable upserts and rollback/time-travel validation.

---

## Q8. [B] Data lake vs lakehouse (Databricks view)?

**Answer:** Lake stores files; lakehouse adds warehouse-like reliability (Delta + governance) on the same storage. Gold tables behave like curated warehouse tables.

---

## Q9. [B] What is DBFS?

**Answer:** Databricks File System—abstraction over cloud storage. Prefer Unity Catalog volumes / direct `abfss://` paths in modern designs; know DBFS for legacy.

---

## Q10. [B] What languages can you use in notebooks?

**Answer:** Python, SQL, Scala, R. Data QA most often uses PySpark and Spark SQL for checks.

---

## Q11. [B] What is a Spark DataFrame?

**Answer:** Distributed table-like dataset with schema. Transforms are lazy until an action (`count`, `write`, `collect` carefully).

---

## Q12. [B] Lazy evaluation—why care in testing?

**Answer:** Defining transforms doesn’t run them. Your assertion triggers compute. Avoid `collect()` on huge data; use distributed aggregates.

---

## Q13. [P] How do you test a Databricks ETL notebook?

**Answer:** 1) Fix input path/table for a known partition. 2) Run notebook/job. 3) Assert output Delta counts/sums. 4) Key-level anti-join for mismatches. 5) Re-run for idempotency. 6) Check job logs/metrics.

---

## Q14. [P] How do you parameterize tests for jobs?

**Answer:** Use widgets/job parameters (`dt`, `source_system`). Run for multiple dates including empty day and holiday; negative-test bad params fail clearly.

---

## Q15. [P] What is MERGE INTO and how do you test it?

**Answer:** Delta upsert pattern matching keys for update/insert/delete.

**Tests:** new keys insert; changed attributes update; deletes handled; re-run does not duplicate; whenMatched/whenNotMatched branches covered.

---

## Q16. [P] How do you validate Delta table schema?

**Answer:** `DESCRIBE TABLE` / `printSchema()` vs contract; nullability; partition columns; check schema enforcement rejects bad types when enabled.

---

## Q17. [P] Partitioned Delta tables—what do you verify?

**Answer:** Partition column values correct (`dt=YYYY-MM-DD`), no data in wrong partition, overwrite affects only target partition, prune filters used in checks.

---

## Q18. [P] Overwrite vs append—testing differences?

**Answer:** Append can duplicate if re-run unsafe. Dynamic partition overwrite should replace only selected partitions—assert neighbor partitions unchanged.

---

## Q19. [P] How do you do count reconciliation in Spark SQL?

**Answer:**
```sql
SELECT 'src' s, COUNT(*) c FROM src WHERE dt='2026-09-09'
UNION ALL
SELECT 'tgt', COUNT(*) FROM gold.orders WHERE dt='2026-09-09';
```

---

## Q20. [P] How do you find duplicates in a Delta table?

**Answer:**
```sql
SELECT order_id, COUNT(*)
FROM gold.orders
WHERE dt='2026-09-09'
GROUP BY order_id
HAVING COUNT(*) > 1;
```

---

## Q21. [P] Anti-join missing keys at scale.

**Answer:**
```python
missing = src.select('order_id').subtract(tgt.select('order_id'))
assert missing.count() == 0
```
Or left anti join in Spark SQL; write deltas to a QA mismatch table.

---

## Q22. [P] What is OPTIMIZE / ZORDER (concept for QA)?

**Answer:** Compaction and data-skipping layout. Should not change business data. Test counts/hashes before vs after OPTIMIZE.

---

## Q23. [P] What is VACUUM and the risk?

**Answer:** Removes old files beyond retention. Risk: breaks time travel / readers needing old versions. QA validates retention policy and that vacuum doesn’t delete current data.

---

## Q24. [P] How do you test schema evolution?

**Answer:** Add optional column with mergeSchema/evolution enabled; ensure old readers still work; breaking type changes should fail closed per contract.

---

## Q25. [P] Unity Catalog vs Hive metastore (high level)?

**Answer:** Unity Catalog is centralized governance (catalog.schema.table), lineage, grants. QA validates correct 3-level names and permissions in each env.

---

## Q26. [P] How do you test job retries?

**Answer:** Simulate transient failure; confirm retry; ensure idempotent writes (no double gold rows); alert only after final failure.

---

## Q27. [P] Cluster sizing impact on QA?

**Answer:** Undersized clusters timeout checks; oversized waste cost. Track validation runtime trends; fail build if SLA exceeded.

---

## Q28. [P] How do you validate PySpark null handling?

**Answer:** Explicit tests for null keys in joins (nulls don’t match); `na.fill`/`fillna` rules; mandatory fields remain non-null in gold.

---

## Q29. [P] Broadcast join—when mention in interview?

**Answer:** Small dimension joined to huge fact. Correctness same if keys right; wrong broadcast hints don’t usually change answers but can OOM—note as performance risk.

---

## Q30. [P] How do you integrate Databricks tests with ADF?

**Answer:** ADF Notebook/Job activity → on success run validation notebook → fail pipeline if DQ status != PASS. Pass `batch_id`/`dt` through.

---

## Q31. [S] Explain time travel and how QA uses it.

**Answer:** Query `@v` or timestamp to compare pre/post load.

```sql
SELECT COUNT(*) FROM gold.orders VERSION AS OF 10;
```
Useful for RCA and proving a load changed only expected partitions.

---

## Q32. [S] How do you test SCD Type 2 with Delta MERGE?

**Answer:** Seed current row; send attribute change; assert old row closed (`end_dt`/`is_current=0`), new row current; no overlap; re-MERGE idempotent; history count +1.

---

## Q33. [S] Job succeeded but gold wrong—investigation steps.

**Answer:** Confirm input partition; check notebook revision deployed; compare bronze→silver→gold; review MERGE condition; inspect duplicate streams; use time travel to see before/after.

---

## Q34. [S] How do you prevent duplicate processing of the same files?

**Answer:** Autoloader checkpoints / commit logs / processed-file registry. Tests: replay same files → no duplicate gold; delete checkpoint carefully in lower envs only.

---

## Q35. [S] What is Autoloader (cloudFiles) from a QA view?

**Answer:** Incremental file ingestion with schema inference/evolution options. Test: new file pickup, schema drift policies, rescue data column for bad records, exactly-once into bronze.

---

## Q36. [S] How do you design a Databricks DQ notebook framework?

**Answer:** Metadata rules table → run checks in Spark → write `dq_results` → raise exception on P0 fail → optional ADF gate. Include canary rows proving rules are armed.

---

## Q37. [S] Skewed keys causing wrong tests?

**Answer:** Skew usually slows, not wrong counts—but timeouts cause false negatives. Salting/repartition may be needed; separate functional pass from performance pass.

---

## Q38. [S] How do you validate streaming Delta tables?

**Answer:** Check watermark/lag, append-only assumptions, duplicate event_ids, foreachBatch MERGE idempotency, and that batch DQ still applies on micro-batches.

---

## Q39. [S] Runtime upgrade testing checklist.

**Answer:** Pin candidate DBR in QA; run regression jobs; compare gold hashes for golden partitions; watch deprecated configs; performance + correctness sign-off.

---

## Q40. [S] Secrets and security testing in Databricks.

**Answer:** Use secret scopes / Azure Key Vault backed secrets; no tokens in notebooks; verify table ACLs/UC grants; row filters/masks if used; ensure QA can’t read unrelated catalogs.

---

## Q41. [S] How do you reconcile Teradata → Databricks gold?

**Answer:** Align filters/types/timezones; control totals by date; Spark anti-join sample for diffs; maintain known-difference register during migration hypercare.

---

## Q42. [S] What is a liquid clustering / partitioning tradeoff (speakable)?

**Answer:** Partitioning helps prune by known columns; over-partitioning creates tiny files. QA watches file counts and query prune effectiveness after design changes.

---

## Q43. [L] Define Definition of Done for a Databricks pipeline.

**Answer:** Code in Repos with review; job in higher env; P0 DQ automated; idempotent re-run proven; monitoring/alerts; runbook for reprocess; UC permissions set; cost/runtime within budget.

---

## Q44. [L] How do you organize multi-team Databricks QA governance?

**Answer:** Shared DQ library, catalog naming standards, env isolation (dev/test/prod workspaces or catalogs), release trains, mandatory gates before promoting jobs.

---

## Q45. [L] Cost vs quality strategy on Databricks.

**Answer:** Job clusters over always-on for prod ETL; partition-pruned checks; nightly light vs weekly deep reconcile; cache golden expected aggregates; kill orphan clusters.

---

## Q46. [L] How do you lead RCA for a bad gold table in prod?

**Answer:** Incident commander; freeze downstream; time-travel to last good; quantify blast radius; fix MERGE/logic; backfill; add DQ; publish timeline & prevention.

---

## Q47. [L] Medallion architecture testing strategy.

**Answer:** Bronze: land fidelity + schema rescue. Silver: conform keys/types/dedupe. Gold: business rules + RI + control totals. Gates between layers; don’t only test gold.

---

## Q48. [L] How do you estimate Databricks QA effort?

**Answer:** # notebooks/jobs × transform complexity × streaming vs batch × UC permission matrix × DQ automation build × dual-run vs legacy if migrating.

---

## Q49. [B] What is a SQL Warehouse in Databricks?

**Answer:** Managed compute for Databricks SQL queries/dashboards. BI users query gold tables; QA may run reconciliations here too.

---

## Q50. [B] What is a catalog / schema / table (UC)?

**Answer:** Three-level namespace: `main.silver.orders`. Always qualify names in tests across envs.

---

## Q51. [P] How do you assert idempotency of a daily job?

**Answer:** Run job twice for same `dt`; compare row counts, sums, and row hashes; expect identical gold for that partition.

---

## Q52. [P] What is a widget in notebooks?

**Answer:** Parameter input for interactive runs. Jobs pass parameters equivalently—test both paths don’t diverge.

---

## Q53. [S] How do you handle late files with Autoloader + gold MERGE?

**Answer:** Ingest to bronze when late; re-MERGE into gold for affected keys/partitions; DQ detects source max timestamp > loaded max; prove reprocess.

---

## Q54. [S] Explain checkpointing failure scenarios.

**Answer:** Corrupt/missing checkpoint can reprocess or stall. Tests document recovery procedure; verify no silent duplication after recovery.

---

## Q55. [L] Executive one-liner: Why Databricks for ETL QA confidence?

**Answer:** “Delta gives us ACID and time travel, so we can prove loads, rewind mistakes, and automate hard quality gates on the same lakehouse the business reads.”

---

## Q56. [P] Sample PySpark expectation check.

**Answer:**
```python
from pyspark.sql import functions as F
agg = gold.filter(F.col('dt')==dt).agg(F.count('*').alias('c'), F.sum('amount').alias('s')).collect()[0]
assert agg['c'] == expected_count
assert abs(agg['s'] - expected_sum) < 0.01
```

---

## Q57. [S] How do you test Change Data Feed (CDF) if used?

**Answer:** Enable CDF; consume change rows; assert insert/update/delete types correct; ensure downstream applies once; validate version ranges.

---

## Q58. [L] Hiring bar: Databricks-ready data QA.

**Answer:** Strong Spark SQL, Delta MERGE intuition, partition thinking, DQ automation, calm production triage, and can explain lakehouse layers without buzzword salad.

---

## Q59. [B] What is a library / wheel dependency risk?

**Answer:** Cluster libraries can differ by env → different results. Pin versions; test after library changes.

---

## Q60. [P] How do you validate decimal precision in Spark?

**Answer:** Check schema `DecimalType(p,s)`; avoid float; compare SUMs; test values near scale boundaries (0.005 rounding).

---

## Q61. [S] Photon / performance features—QA stance?

**Answer:** Should not change business answers. Regression compare critical partitions when enabling engine accelerations.

---

## Q62. [L] Multi-workspace promotion model.

**Answer:** Dev workspace experiments → test workspace integration/DQ → prod jobs only via CI/CD (Repos/bundle), no manual prod notebook edits.

---
