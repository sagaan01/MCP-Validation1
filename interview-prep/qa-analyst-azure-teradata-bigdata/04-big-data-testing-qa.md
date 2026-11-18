# Big Data Testing — Interview Questions & Answers (Basic → Lead)

Volume/velocity/variety testing strategies for lakehouse, Spark/ADLS, partitions, and scalable reconciliations.

**Total questions:** 55

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What is Big Data testing?

**Answer:** Validating correctness, quality, and performance of data processing when volume/velocity/variety exceed traditional row-by-row manual approaches.

**Key idea:** Same quality goals; different techniques (partitions, aggregates, sampling, automation).

---

## Q2. [B] What are the 3 Vs (or 5 Vs)?

**Answer:** Volume, Velocity, Variety; often Veracity and Value too. Testing maps to each: scale strategy, late data, multi-format schema, trust/DQ, business usefulness.

---

## Q3. [B] Hadoop vs modern Azure Big Data—how do you speak to it?

**Answer:** Classic Hadoop HDFS/Hive/Spark still appears; Azure often uses ADLS + Databricks/Synapse Spark. Concepts transfer: distributed files, partitions, eventual curated tables.

---

## Q4. [B] What is HDFS conceptually?

**Answer:** Distributed file system storing blocks across nodes. In Azure, ADLS plays a similar landing role.

---

## Q5. [B] What is Spark in testing context?

**Answer:** Distributed compute engine for transforms and large reconciliations. QA may run Spark SQL checks on billions of rows.

---

## Q6. [B] What is a partition in Big Data tables/files?

**Answer:** Physical split usually by date/region enabling prune. Example: `/orders/dt=2026-09-09/`. Tests often run per partition.

---

## Q7. [B] Structured vs semi-structured vs unstructured?

**Answer:** Tables/CSV; JSON/Parquet/XML; images/logs. Variety increases schema-validation needs.

---

## Q8. [B] What is schema-on-read?

**Answer:** Apply schema when querying files (data lake). Risk: bad data discovered late—DQ must shift left with explicit contracts.

---

## Q9. [B] What is a data lake vs warehouse?

**Answer:** Lake stores broad raw/refined files cheaply; warehouse stores curated modeled data for BI. Test both layers differently.

---

## Q10. [B] What is bronze/silver/gold (medallion)?

**Answer:** Bronze raw, silver cleansed/conformed, gold business marts. QA gates between layers.

---

## Q11. [P] How do you test a daily partition load?

**Answer:** Check landing files exist; schema; count vs source; curated partition count/sum; DQ rules; mark partition certified.

---

## Q12. [P] How do you validate Parquet schema?

**Answer:** Read schema from file; compare to contract; check nullability and types; test evolved columns don’t break readers.

---

## Q13. [P] Small file problem—why care?

**Answer:** Many tiny files slow jobs. QA observes job time regressions and flags landing design issues impacting SLA tests.

---

## Q14. [P] How do you do count validation at scale?

**Answer:** `COUNT` by partition both sides; avoid pulling all keys to driver; use Spark distributed aggregates.

---

## Q15. [P] How do you do key-level compare at scale?

**Answer:** Anti-join in Spark on keys for a partition; write mismatch delta table; sample for human review; never collect millions to local.

---

## Q16. [P] What is sampling strategy for Big Data QA?

**Answer:** Stratified by high-value segments (country, product line) + random; never replace control totals; use sampling for deep field checks.

---

## Q17. [P] How do you test Spark transformations?

**Answer:** Unit-like tests with small fixtures; integration on sample partitions; full aggregates on prod-like volume in performance env.

---

## Q18. [P] How do you validate joins that explode row counts?

**Answer:** Check pre/post join counts; detect unintended many-to-many; assert business grain uniqueness after join.

---

## Q19. [P] Late data arrival test cases?

**Answer:** Data for `dt` arrives after job; reprocess partition; ensure gold updates; downstream consumers notified if needed.

---

## Q20. [P] How do you test streaming vs batch (high level)?

**Answer:** Streaming: watermarking, exactly-once/at-least-once, lag SLAs. Batch: daily completeness. Many “Big Data” JD roles still focus batch unless stated.

---

## Q21. [P] What is idempotent partition overwrite?

**Answer:** Rewriting `dt=X` replaces results safely. Test double run yields same curated metrics.

---

## Q22. [P] How do you validate data skew in Spark jobs?

**Answer:** Look for long straggler tasks; hot keys. Correctness may still pass but SLA fails—report as quality of service risk.

---

## Q23. [S] Design a Big Data reconciliation framework.

**Answer:** Metadata rules + partition driver + Spark compare jobs + results table + severity thresholds + ADF orchestration + dashboard. Onboard new datasets via config.

---

## Q24. [S] When is full reconciliation mandatory vs aggregate-only?

**Answer:** Full/key-level for dimensions, balances, regulatory; aggregates for massive clickstream with defined tolerance—documented with business.

---

## Q25. [S] How do you test schema evolution safely?

**Answer:** Additive columns optional; breaking changes fail gate; consumer compatibility tests; contract registry.

---

## Q26. [S] Job processed 99% files—how do you catch partial success?

**Answer:** Compare expected file inventory vs processed list; control table of expected partitions; fail if missing without waiver.

---

## Q27. [S] How do you validate nested JSON/Parquet structures?

**Answer:** Flatten critical paths; assert types; test missing nested structs; compare exploded child counts to source events.

---

## Q28. [S] Performance testing vs functional testing in Big Data.

**Answer:** Functional = correct data; performance = SLA windows, cluster cost. Both needed for production readiness.

---

## Q29. [S] How do you manage test data for huge sources?

**Answer:** Partition subsets, masked prod slices, synthetic generators for edge cases, referential integrity across entities.

---

## Q30. [S] Explain exactly-once concerns for QA.

**Answer:** At-least-once pipelines can duplicate. Tests search duplicate event IDs and verify sink upserts/dedupe logic.

---

## Q31. [L] How do you set enterprise standards for Big Data QA?

**Answer:** Layered gates, naming, partition conventions, mandatory P0 rules catalog, tooling (Spark SQL), training, audit of escaped defects.

---

## Q32. [L] How do you balance cloud cost with validation depth?

**Answer:** Aggressive partition pruning, tiered checks (nightly light, weekly deep), spot/job clusters, stop redundant full scans.

---

## Q33. [L] Multi-team lakehouse—how prevent quality chaos?

**Answer:** Domain ownership, published data contracts, central DQ platform, break-glass only with waiver workflow.

---

## Q34. [B] What is MapReduce conceptually?

**Answer:** Older parallel programming model (map + reduce). Spark largely replaced it; knowing it shows fundamentals.

---

## Q35. [B] What is Hive?

**Answer:** SQL-on-Hadoop warehouse layer. Analogous thinking applies to Spark SQL / Synapse SQL on files.

---

## Q36. [P] How do you test compression/codec changes?

**Answer:** Validate readability by consumers; compare counts before/after; ensure no silent corruption; check job time impact.

---

## Q37. [P] What is a compaction job’s QA angle?

**Answer:** File layout changes shouldn’t change business data. Compare checksums/counts pre/post compaction.

---

## Q38. [S] How do you detect silent data corruption?

**Answer:** Row hashes, independent recompute of critical metrics from bronze, checksum files, canaries with known golden inputs.

---

## Q39. [S] Cross-region replication testing?

**Answer:** Lag SLAs, eventual consistency windows, failover read correctness—avoid comparing mid-replication.

---

## Q40. [L] Define readiness for “petabyte-scale” domain.

**Answer:** Automated partition certification, cost-budgeted deep checks, on-call runbooks, proven reprocess, business tolerances signed.

---

## Q41. [P] How do you validate ADLS ACLs don’t break jobs?

**Answer:** Jobs failing with 403 after ACL change; include permission smoke tests after security updates.

---

## Q42. [S] How do you test GDPR deletion in Big Data lakes?

**Answer:** Prove subject keys removed/anonymized across bronze/silver/gold; verify reprocessing doesn’t resurrect; audit logs retained per policy.

---

## Q43. [B] What is a data contract?

**Answer:** Agreed schema + SLAs + ownership between producer and consumer. QA validates contract adherence.

---

## Q44. [P] Empty partition on a business holiday—pass or fail?

**Answer:** Depends on calendar expectation. Maintain expected-partition calendar; empty may be valid—don’t false-fail.

---

## Q45. [S] How do you investigate mismatched cardinality after aggregation?

**Answer:** Check grain, filter pushdown bugs, null group keys, timezone date shifts, double counting from join fanout.

---

## Q46. [L] Lead a RCA for major Big Data outage.

**Answer:** Timeline, blast radius, detection gap, root cause, fix, backlog prevention tests, customer communication—blameless but accountable.

---

## Q47. [P] What tools might you mention for Big Data testing?

**Answer:** Spark SQL, Databricks notebooks, Great Expectations/Deequ-like DQ, custom PyTest, ADF, query on Synapse serverless—focus on method over brand.

---

## Q48. [S] How do you validate slowly changing data in lakehouse gold dims?

**Answer:** Same SCD tests; plus ensure merge conditions in Spark (`MERGE INTO`) behave; test concurrent updates to same BK.

---

## Q49. [B] Batch window vs micro-batch?

**Answer:** Daily/hourly batch vs frequent small batches. Testing cadence and late-data rules change with window size.

---

## Q50. [L] How do you mentor QA into Big Data competence?

**Answer:** Teach SQL→Spark SQL, partition thinking, cost awareness, and evidence via delta mismatch tables—pair on first three pipelines.

---

## Q51. [P] How do you assert uniqueness at scale?

**Answer:** `groupBy(keys).count().filter(count>1)` write violators; threshold fail if any for P0 keys.

---

## Q52. [S] Canary partitions—what are they?

**Answer:** Known synthetic partition processed each run to prove pipeline logic; if canary fails, block promotion even if prod-like data “looks ok.”

---

## Q53. [L] Executive question: Are we ready to scale 10x volume?

**Answer:** Answer with capacity evidence: validation runtime trend, cluster sizing, gate stability, reprocess ability, and which checks become sampling-only at 10x with business approval.

---

## Q54. [P] How do you test file arrival order dependencies?

**Answer:** If job needs file A before B, simulate reverse arrival; confirm waits/fails gracefully; no partial gold publish.

---

## Q55. [S] Validate column-level lineage at Big Data scale—why?

**Answer:** Speeds impact analysis when source column changes; QA uses lineage to target regression packs instead of testing everything blindly.

---
