# Data Quality — Interview Questions & Answers (Basic → Lead)

DQ dimensions, rules, gates, scorecards, and operating models for large-scale data platforms.

**Total questions:** 55

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What is data quality?

**Answer:** Fitness of data for business use—accurate, complete, timely, consistent, unique, and valid enough for decisions and downstream systems.

---

## Q2. [B] Name six DQ dimensions.

**Answer:** Completeness, Accuracy, Consistency, Uniqueness, Timeliness, Validity. Map every critical field to dimensions in interviews.

---

## Q3. [B] Completeness example.

**Answer:** Mandatory `customer_bk` never null; daily partition present for each business day.

---

## Q4. [B] Accuracy example.

**Answer:** `order_amount` matches source after stated transforms within $0.00 tolerance.

---

## Q5. [B] Consistency example.

**Answer:** Customer status same in `dim_customer` and `fact_orders` current attributes for same BK.

---

## Q6. [B] Uniqueness example.

**Answer:** One current row per account number in account dimension.

---

## Q7. [B] Timeliness / freshness example.

**Answer:** T+1 data available by 06:00 local; max(business_date) equals yesterday.

---

## Q8. [B] Validity example.

**Answer:** `country_code` in ISO list; email matches pattern; age between 0 and 120.

---

## Q9. [B] DQ vs ETL testing?

**Answer:** ETL testing proves pipeline rules/movement; DQ proves ongoing fitness including rules beyond a single mapping—both overlap heavily in data QA roles.

---

## Q10. [B] What is a data quality rule?

**Answer:** Testable assertion with severity and action (alert/fail/quarantine).

---

## Q11. [P] How do you implement DQ checks technically?

**Answer:** SQL/Spark rules → results table → threshold evaluation → pipeline gate/alert → ticket if fail.

---

## Q12. [P] What belongs in a DQ results table?

**Answer:** `run_id, table, rule_id, grain, metric, threshold, status, severity, sample_keys, logged_at`.

---

## Q13. [P] Hard fail vs warning rules.

**Answer:** P0 (money/identity) hard fail; P2 anomaly warnings. Lead agrees thresholds with business.

---

## Q14. [P] How do you test DQ for incremental loads?

**Answer:** Scope rules to batch/partition; also run cross-batch uniqueness for current dims.

---

## Q15. [P] Quarantine pattern.

**Answer:** Bad rows diverted to reject table with reasons; good rows proceed; metrics track reject rate spikes.

---

## Q16. [P] Profile a new dataset—what do you look for?

**Answer:** Rowcounts, null %, distinct counts, min/max, patterns, unexpected values—feeds rule design.

---

## Q17. [P] How do you validate reference data?

**Answer:** Domain tables (currency, country) complete; facts only use valid codes; versioned reference updates tested.

---

## Q18. [P] DQ for free-text fields?

**Answer:** Length bounds, banned characters, optional fuzzy checks; don’t over-constrain names incorrectly.

---

## Q19. [P] How do you handle known bad historical data?

**Answer:** Baseline waiver with end date; suppress noisy rules on history; enforce strictly on new loads.

---

## Q20. [P] Measure DQ trends.

**Answer:** Track null rates, reject rates, reconcile pass % over time—detect slow degradation.

---

## Q21. [S] Build a DQ scorecard for executives.

**Answer:** % critical tables green, freshness SLA, top failing rules, business impact $, trend week-over-week—plain language.

---

## Q22. [S] False positives in DQ—how reduce?

**Answer:** Tune thresholds, fix grain, exclude holidays, improve reference data, separate new vs legacy.

---

## Q23. [S] False negatives risk?

**Answer:** Too-loose thresholds miss real issues. Pair automation with periodic deep audits and canaries.

---

## Q24. [S] How do you prioritize which DQ rules to automate first?

**Answer:** Highest business damage × frequency × cheap to automate. Start: uniqueness, null mandatory, RI, control totals.

---

## Q25. [S] Data quality vs data observability.

**Answer:** Observability watches pipelines/freshness/anomalies continuously; DQ rules assert semantic correctness. Mature teams use both.

---

## Q26. [S] Incident: sudden null spike in phone.

**Answer:** Check upstream schema/API change, transform bug, source outage defaulting nulls; quarantine; communicate CRM impact; add contract test.

---

## Q27. [S] How do you align DQ with privacy?

**Answer:** Mask PII in lower envs; limit who sees failing-row samples; store samples carefully; deletion requests reflected in DQ inventories.

---

## Q28. [S] Cross-system consistency testing.

**Answer:** Same KPI from Teradata legacy report vs Azure gold within tolerance during dual run.

---

## Q29. [L] Establish enterprise DQ operating model.

**Answer:** Owners per domain, rule catalog, severity model, waiver workflow, tooling platform, monthly quality council.

---

## Q30. [L] How do you fund DQ work?

**Answer:** Tie to risk reduction (regulatory fines, wrong payments, customer trust) and incident cost avoided—not abstract “quality.”

---

## Q31. [L] Definition of Done includes DQ—how?

**Answer:** No release without green P0 rules, documented waivers, and owner acknowledgment of residual risk.

---

## Q32. [B] What is a threshold?

**Answer:** Allowed deviation before fail—e.g., 0 rows violating uniqueness; 0.01 currency diff.

---

## Q33. [B] What is data profiling?

**Answer:** Statistical discovery of content/structure to design tests and find anomalies early.

---

## Q34. [P] Validity vs accuracy difference?

**Answer:** Valid = conforms to format/domain; Accurate = matches real-world/source truth. Phone can be valid format but wrong number.

---

## Q35. [P] Consistency across grains.

**Answer:** Daily totals must equal sum of hourly; header amount equals sum of lines—classic consistency checks.

---

## Q36. [S] How do you test machine-learning feature tables’ DQ?

**Answer:** Null rates, leakage checks, distribution shift monitors, training/serving skew—still DQ mindset.

---

## Q37. [S] Regulatory reporting DQ bar.

**Answer:** Near-zero tolerance, complete lineage, immutable audit of checks, dual control of waivers.

---

## Q38. [L] Vendor DQ tools vs custom SQL—decision?

**Answer:** Tools accelerate catalog/UI; custom fits unique transforms. Many teams hybrid: platform + SQL for complex reconciliations.

---

## Q39. [P] SLA breach playbook.

**Answer:** Detect → assess impact → notify consumers → reprocess → RCA → prevent. QA validates reprocess correctness.

---

## Q40. [S] How do you prove DQ after backfill?

**Answer:** Re-run rules on backfilled partitions; compare to pre-backfill baselines for untouched partitions.

---

## Q41. [L] Cultural issue: DE says “QA owns quality.” Response?

**Answer:** Quality is shared; DE owns preventive unit checks; QA owns independent validation & gates; business owns definitions.

---

## Q42. [B] What is an outlier?

**Answer:** Value far from expected distribution—may be defect or true rare event; investigate before auto-failing.

---

## Q43. [P] Duplicate customers across sources.

**Answer:** Fuzzy match beyond exact BK; golden record rules; test survivorship logic carefully.

---

## Q44. [S] DQ in real time streaming sinks.

**Answer:** Micro-batch rules, lag monitors, exactly-once duplicates, window completeness—harder than batch.

---

## Q45. [L] Set KRIs for data risk.

**Answer:** Escape defect rate, time-to-detect, % tables with P0 coverage, waiver aging, SLA misses.

---

## Q46. [P] Example completeness SQL.

**Answer:** `SELECT SUM(CASE WHEN col IS NULL THEN 1 ELSE 0 END)*1.0/COUNT(*) FROM t WHERE batch_id=@b;`

---

## Q47. [S] Contract testing between producers/consumers.

**Answer:** Schema + semantic checks in CI when producer changes; consumers subscribe to versioned contracts.

---

## Q48. [B] Why business glossary matters for DQ?

**Answer:** Shared meaning of “active customer” prevents building accurate-but-wrong checks.

---

## Q49. [L] How do you handle conflicting business rules between teams?

**Answer:** Facilitate decision with examples/impact; document authoritative definition; version the rule; don’t silently pick one.

---

## Q50. [P] Test data masking quality.

**Answer:** Ensure masked data still referentially consistent and useful for tests; verify no residual PII patterns.

---

## Q51. [S] Canary DQ records.

**Answer:** Inject known good/bad synthetic rows each run to prove rules fire—guards against silently disabled checks.

---

## Q52. [L] Quarterly DQ audit approach.

**Answer:** Sample deep dives beyond automation; remap critical fields; retire noisy rules; publish improvements.

---

## Q53. [B] What is integrity in DQ talk tracks?

**Answer:** Often means referential + internal consistency—be precise which you mean.

---

## Q54. [S] Link DQ failures to pipeline retries.

**Answer:** Don’t infinite-retry semantic DQ fails; alert humans. Infra retries for transient IO only.

---

## Q55. [L] Board-level question: Can we trust this dashboard?

**Answer:** Answer with evidence: last reconcile status, known issues, freshness, and confidence statement—not vague assurance.

---
