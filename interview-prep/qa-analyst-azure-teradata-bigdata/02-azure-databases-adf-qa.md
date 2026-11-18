# Azure Databases & Data Factory — Interview Questions & Answers (Basic → Lead)

Covers Azure SQL, Synapse, ADLS, ADF, security, and validation patterns aligned to Azure + ETL QA roles.

**Total questions:** 55

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What Azure data services are common in ETL testing?

**Answer:** Azure Data Factory (orchestration), ADLS Gen2 (landing), Azure SQL Database, Azure Synapse Analytics, sometimes Databricks, Event Hubs for streaming.

**JD fit:** “Azure databases” usually means Azure SQL and/or Synapse tables you validate with SQL.

---

## Q2. [B] What is Azure SQL Database?

**Answer:** A managed relational database service in Azure—SQL Server engine as a service. Used for curated/app databases.

**Testing:** Schema, constraints, stored procedures, ETL loads, index impacts on validation queries.

---

## Q3. [B] What is Azure Synapse Analytics?

**Answer:** Analytics platform combining enterprise data warehousing and big data. Dedicated SQL pools resemble MPP warehouses; serverless SQL can query ADLS files.

**Example:** Curated star schema in dedicated SQL pool fed by ADF.

---

## Q4. [B] What is Azure Data Lake Storage Gen2?

**Answer:** Hierarchical object storage for big data landing zones—raw/bronze files (CSV/Parquet) before curation.

**Test:** folder partitions, file presence, schema of Parquet, bad file handling.

---

## Q5. [B] What is Azure Data Factory (ADF)?

**Answer:** Cloud ETL/ELT orchestration: pipelines, activities, datasets, linked services, triggers, integration runtimes.

**QA focus:** correct parameters, watermark logic, retries, monitoring, and post-load data correctness.

---

## Q6. [B] Linked Service vs Dataset in ADF?

**Answer:** Linked service = connection (where). Dataset = structured view of data (what). Pipeline activities use both.

---

## Q7. [B] What is an Integration Runtime (IR)?

**Answer:** Compute bridge ADF uses to move data—Azure IR, Self-hosted IR (on-prem/Teradata access), Azure-SSIS IR.

**Interview tip:** Teradata often needs Self-hosted IR connectivity—mention firewall/network testing readiness.

---

## Q8. [B] Pipeline vs Activity vs Trigger?

**Answer:** Pipeline groups activities (Copy, Lookup, Stored Proc, Notebook). Triggers schedule or event-start pipelines.

---

## Q9. [P] How do you test an ADF Copy activity?

**Answer:** Verify source query/filters, row counts written, column mapping, fault tolerance settings, logging of skipped rows, and landing file/table schema. Then reconcile to target.

---

## Q10. [P] How do you validate ADF watermark logic?

**Answer:** Check watermark store table before/after run; confirm next extract predicate; test boundary timestamps; simulate failure before watermark commit (should not advance).

---

## Q11. [P] What do you look for in ADF monitoring?

**Answer:** Pipeline status, activity durations, rows read/written, error codes, retry counts, integration runtime health, and output parameters used for lineage.

---

## Q12. [P] How do you test parameterized pipelines?

**Answer:** Run with multiple parameter sets (date, source system). Confirm correct folder paths and table loads; negative test invalid parameters fail fast with clear error.

---

## Q13. [P] Azure SQL vs Synapse—testing differences?

**Answer:** Synapse has distributions (HASH/ROUND_ROBIN/REPLICATE) and often larger volumes; explain plans differ. Validation queries must respect distribution keys for performance; logic of reconciliation stays similar.

---

## Q14. [P] What is ROUND_ROBIN vs HASH distribution?

**Answer:** ROUND_ROBIN spreads rows evenly; HASH collocates by key for joins. Mis-hashing causes data movement and slow tests/reports—not wrong results necessarily, but can cause timeouts in QA.

---

## Q15. [P] How do you test PolyBase / external tables?

**Answer:** Validate external data source credentials, file paths, rejected row location, and that SELECT from external matches ADLS file counts/schema.

---

## Q16. [P] How do you test ADLS partitions?

**Answer:** For `dt=2026-09-09` ensure files exist, are non-empty when expected, schema consistent, and curated table partition matches file-derived counts.

---

## Q17. [P] CSV vs Parquet testing concerns?

**Answer:** CSV: delimiters, quotes, encodings, header mismatch. Parquet: schema evolution, nulls, nested types, compression. Prefer Parquet for reliable typed landing.

---

## Q18. [P] How do you test Azure SQL constraints?

**Answer:** Attempt violating PK/FK/CHECK loads; confirm ETL rejects or prevents; ensure constraints match business rules in mapping.

---

## Q19. [P] How do you handle secrets in ADF testing?

**Answer:** Expect Key Vault references, not plaintext. QA verifies pipelines run with MI/Key Vault; never commit secrets in ARM/parameter files.

---

## Q20. [P] What is Managed Identity and why mention it?

**Answer:** Azure AD identity for services—removes password sprawl. Senior candidates mention MI for ADF→ADLS/SQL access as a security best practice.

---

## Q21. [S] How do you design post-load validation in Azure pipelines?

**Answer:** Add validation activity (Stored Proc/Notebook) after load; write results to DQ table; Fail pipeline activity if P0 thresholds breached; alert via Logic Apps/email/Teams.

---

## Q22. [S] ADF shows rows written = source rows, but curated wrong—why?

**Answer:** Copy only landed raw data; transform rules buggy; or wrong notebook version deployed. Always reconcile curated layer, not only copy metrics.

---

## Q23. [S] How do you test cross-environment promotion (dev/test/prod)?

**Answer:** Same pipeline code with env-specific parameters/linked services; compare DQ results; verify no prod connection strings in lower envs; smoke test after release.

---

## Q24. [S] How do you troubleshoot slow Azure SQL validation queries?

**Answer:** Check indexing, statistics, batch filters, avoid scans on full history; validate by partition/`batch_id`; consider staging compare tables indexed on join keys.

---

## Q25. [S] Synapse query returns intermittent mismatch—possible causes?

**Answer:** Reading mid-load without snapshot isolation/consistency; using serverless over changing files; timezone conversion; CTAS race. Stabilize by batch_id watermark and load-complete flags.

---

## Q26. [S] How do you validate MERGE/upsert into Azure SQL?

**Answer:** Seed existing rows; send insert/update sets; verify matched updates, non-matched inserts, unchanged others; re-run for idempotency; check output rowcounts of MERGE.

---

## Q27. [S] How do you test schema drift in Azure landing?

**Answer:** Add unexpected column / remove column / type change in file; confirm pipeline drift policy (fail vs evolve); curated contracts should fail closed for breaking changes.

---

## Q28. [S] Explain security testing for Azure data platforms.

**Answer:** RBAC on ADLS paths, SQL AAD auth, column masking/PII, network isolation, audit logs. QA verifies least privilege: test identity cannot read unrelated containers.

---

## Q29. [S] How do you validate time zones between on-prem Teradata and Azure?

**Answer:** Document source TZ; convert explicitly to UTC in transform; test DST boundaries; compare `CAST` rules both sides for same business date.

---

## Q30. [S] What is your hypercare plan after Azure go-live?

**Answer:** Daily automated Teradata vs Azure control totals, dashboard of failed partitions, on-call rotation, rollback to legacy reports if gates fail, defect SLAs.

---

## Q31. [L] How do you choose validation architecture on Azure?

**Answer:** Small/medium: SQL scripts in Azure SQL. Large: Spark notebooks on Databricks/Synapse. Store results in DQ metrics DB; integrate fail gates in ADF. Prefer independent compute from transform when possible for objectivity.

---

## Q32. [L] How do you set DQ SLAs with business on Azure analytics?

**Answer:** Define freshness (T+1 by 6am), accuracy tolerance (e.g., $0.01 or 0%), completeness %. Translate to pipeline deadlines and alert severity.

---

## Q33. [L] How do you govern multiple ADF factories/environments?

**Answer:** Infra as code (ARM/Bicep/Terraform), CI for pipelines, naming standards, separate prod factory, code review for linked services, prevent manual prod edits.

---

## Q34. [L] Cost vs quality—how do you test smart on Azure?

**Answer:** Partition pruning, sample detailed compares, serverless SQL for ad-hoc file checks carefully (cost), schedule heavy reconciliations off-peak, cache expected aggregates.

---

## Q35. [L] How do you lead Azure data QA for a multi-domain program?

**Answer:** Domain owners, shared DQ framework, reusable reconciliation templates, onboarding checklist for new pipelines, executive scorecard by domain readiness.

---

## Q36. [B] What is a Synapse dedicated SQL pool?

**Answer:** Provisioned MPP warehouse compute in Synapse for high-volume curated SQL analytics.

---

## Q37. [B] What is CTAS?

**Answer:** CREATE TABLE AS SELECT—common ELT pattern to build curated tables. Test that CTAS logic matches mapping and swaps atomically if used.

---

## Q38. [P] How do you test Lookup + ForEach patterns in ADF?

**Answer:** Ensure Lookup returns expected set; ForEach processes each item once; failure in one item handled per batch policy (sequential vs parallel).

---

## Q39. [P] How do you validate stored procedure activities?

**Answer:** Check proc parameters, return status, side effects on tables, and logging. Run proc with known input and reconcile table deltas.

---

## Q40. [S] How do you detect silent truncation in Azure SQL loads?

**Answer:** Compare lengths source vs target; enable checks for ANSI truncation behavior; assert `LEN`/`DATALENGTH` for critical strings; prefer reject over silent truncate.

---

## Q41. [S] Describe testing incremental load from ADLS snapshots.

**Answer:** Determine if folders are daily snapshots or change files; test that curated MERGE uses correct business keys; ensure deleted files/partitions handled.

---

## Q42. [L] How do you define Definition of Done for an Azure data pipeline?

**Answer:** Mapping reviewed, unit transform tests, ADF monitoring alerts, automated P0 DQ, reconciliation evidence attached to release, runbook for failure/restart, security review.

---

## Q43. [P] What is Get Metadata activity used for in testing?

**Answer:** Engineers use it to check file exists/count/size. QA can validate control-flow decisions based on metadata (empty file skip vs fail).

---

## Q44. [S] How do you verify row-level security or views don’t break reconciliations?

**Answer:** Run compares with an account that sees full data; document if BI users see filtered subsets—don’t confuse security filters with ETL loss.

---

## Q45. [B] What is Azure Databricks in this context?

**Answer:** Spark-based platform often used for big transforms on ADLS. QA validates notebook outputs and data quality similar to other transform engines.

---

## Q46. [P] How do you test notebook-based transforms?

**Answer:** Fix input fixture paths; run notebook; assert output tables/files; check parameters; verify cluster/runtime version in higher envs matches tested one.

---

## Q47. [S] Pipeline fails intermittently—how do you investigate as QA lead?

**Answer:** Correlate IR CPU/memory, throttling, source locks, transient network to Teradata, concurrent loads. Ask for retry storm metrics; harden with idempotent design + alerts.

---

## Q48. [L] How do you report Azure data quality to executives?

**Answer:** Business language: “99.8% of order partitions reconciled; 2 partitions delayed; finance impact $X; ETA fix.” Avoid tool jargon in the first slide.

---

## Q49. [B] What is a linked service to Teradata used for?

**Answer:** Lets ADF extract from Teradata via Self-hosted IR into Azure landing—core hybrid pattern for this JD.

---

## Q50. [P] How do you validate staging vs curated in Azure?

**Answer:** Staging ≈ raw fidelity to source; curated ≈ business rules applied. Separate reconciliations prevent mis-attributing defects.

---

## Q51. [S] How do you test CDC into Azure SQL?

**Answer:** Apply insert/update/delete streams; verify target state; check LSN/watermark progression; ensure deletes don’t remove history if SCD2 required.

---

## Q52. [L] What risks appear when “lift and shift” SSIS to ADF?

**Answer:** Different error handling, datatype mappings, parallel copy behavior, logging gaps. QA should rebuild reconciliations and not assume SSIS test packs transfer 1:1.

---

## Q53. [S] How do you validate data freshness SLAs?

**Answer:** Monitor max(load_timestamp)/business_date vs clock; alert on breach; distinguish pipeline failure vs empty legitimate source day.

---

## Q54. [P] What is soft assert vs hard fail in DQ gates?

**Answer:** Hard fail blocks downstream on P0. Soft assert warns on P2 anomalies. Lead defines which checks are which with business input.

---

## Q55. [L] How do you build a reusable Azure DQ framework?

**Answer:** Metadata-driven rules table (table, column, rule, threshold), execution engine (proc/notebook), results store, ADF wrapper, dashboard. Onboard new datasets by config, not new code each time.

---
