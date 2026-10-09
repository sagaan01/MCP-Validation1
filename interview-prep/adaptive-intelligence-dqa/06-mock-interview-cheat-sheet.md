# 6. Mock Interview & One-Page Cheat Sheet

## Mock interview structure

For each question: **Ideal answer cues** · **Why strong** · **Self-score 1–10** · **Improve**

Practice out loud. Record yourself if possible.

---

### Round 1 – Basics (10)

1. What is data quality?  
2. Six DQ dimensions with examples.  
3. ETL testing vs DQ monitoring.  
4. What is a data quality rule?  
5. Hard fail vs warning.  
6. What is reconciliation?  
7. Full load vs incremental.  
8. What is CDC at a high level?  
9. Green job but wrong data — why possible?  
10. What does “oracle” mean in testing?

**Ideal cue:** Clear definitions + tiny examples.  
**Strong if:** You map each answer to business impact in one clause.

---

### Round 2 – Adaptive / concept (15)

1. Explain the core hypothesis in plain English.  
2. Draw the decision loop.  
3. Define marginal value of a test.  
4. Method/depth ladder.  
5. What is uncertainty here?  
6. Must-run floors — why?  
7. Explore vs exploit.  
8. Where do LLMs fit / not fit?  
9. How do escaped defects update the system?  
10. Fail-closed behavior when the engine dies.  
11. How is this different from anomaly detection?  
12. What KPIs prove a pilot worked?  
13. Auditor asks why a control was skipped.  
14. Cold-start strategy.  
15. Why not run everything?

**Ideal cue:** Restaurant-inspector story → formula → governance.  
**Strong if:** You never claim magic AI or patent novelty.

---

### Round 3 – SQL (15)

1. Count source vs target for a date.  
2. Find duplicate current SCD2 rows.  
3. Null rate for a column.  
4. Anti-join missing keys.  
5. SUM amount compare.  
6. Hash sample 1% keys.  
7. RI orphans fact → dim.  
8. Detect double-loaded batch.  
9. Freshness: max date vs yesterday.  
10. Top failing rules from `dq_results`.  
11. Window function for overlapping SCD dates.  
12. Precision mismatch example.  
13. Late-arriving data query idea.  
14. Partition coverage check.  
15. Performance: rewrite a full scan safely.

**Ideal cue:** Correct grain + partition predicates.  
**Strong if:** You state assumptions before writing SQL.

---

### Round 4 – Architecture / design (15)

1. Whiteboard adaptive DQ on a lakehouse.  
2. CI vs nightly vs serving checks.  
3. Catalog data model.  
4. Outcome store fields.  
5. Cost model inputs.  
6. Impact scoring with business.  
7. Multi-domain budget conflict.  
8. Integration with Airflow/ADF/dbt.  
9. Lineage’s role in blast radius.  
10. Static tier bootstrap → adaptive.  
11. Security/PII in samples.  
12. Explainability requirements.  
13. Kill switch design.  
14. Vendor build-vs-buy.  
15. 90-day rollout plan.

---

### Round 5 – Automation (10)

1. Framework folders.  
2. Pytest gate for must-run.  
3. How to unit-test the scorer.  
4. FP labeling workflow.  
5. Preventing flaky DQ.  
6. Secrets/PII in AI tooling.  
7. CI policy for AI-drafted rules.  
8. Idempotent reruns.  
9. Alert routing.  
10. Dashboard metrics.

---

### Round 6 – Scenario / troubleshooting (10)

1. 10M vs 9.8M after sample-only night.  
2. Null spike, job green.  
3. Decision job selected nothing.  
4. Costs doubled after rollout.  
5. Schema change ignored by engine.  
6. FP fatigue.  
7. CDC missed records.  
8. BI ≠ warehouse.  
9. Sev-1 escape postmortem.  
10. 50% budget cut.

**Ideal cue:** Symptom → isolate → oracle → fix → prevention → prior update.

---

### Round 7 – Senior / Lead (10)

1. Quality strategy for a new mart.  
2. Estimation of DQ effort.  
3. Release readiness checklist.  
4. Stakeholder communication of residual risk.  
5. Metrics for leadership.  
6. Mentoring juniors on adaptive thinking.  
7. Offshore/onshore ownership split.  
8. Conflict: speed vs depth.  
9. Continuous improvement backlog.  
10. Why hire you for this vision?

---

### Round 8 – Behavioral (10)

Use STAR from `04-scenarios-troubleshooting.md`:

1. Tell me about yourself.  
2. Current/recent project.  
3. Hardest production defect.  
4. Data mismatch you found.  
5. Automation you led.  
6. Process improvement.  
7. Conflict with developers.  
8. Tight deadline prioritization.  
9. Defect that escaped.  
10. Why this role / why change?

---

## One-page cheat sheet

### Pitch
Portfolio of tests under budget: maximize uncertain risk reduction; learn from outcomes; humans own oracles.

### Loop
**Estimate → Select (method/depth) → Execute → Update priors**

### Value sketch
`score ≈ P(find) × Impact × UncertaintyWeight − Cost`  
(+ must-run floors, + explore bonus)

### Depth ladder
L0 contract/freshness → L1 profile → L2 sample → L3 full → L4 forensic

### DQ dimensions
Completeness · Accuracy · Consistency · Uniqueness · Timeliness · Validity

### ETL checklist keywords
Source · extract (full/incr/CDC) · transform (SCD, joins) · target reconcile · quarantine · control totals · restartability

### Uncertainty triggers
New asset · schema/deploy · volume drift · sparse history · escaped defect · noisy FP history

### Governance
P0 floors · explainable skips · human override · fail-closed fallback · monthly deep audits

### KPI pack
Escaped defects · DQ compute · actionable alert % · FP rate · SLA attainment · time-to-detect

### SQL reflexes
Counts · SUM · nulls · dupes · anti-join · RI · sample hash · watermark · partition coverage

### Troubleshooting sequence
Clarify grain → counts → keys → transforms → rejects → logs/lineage → fix → certify → raise priors

### Leadership phrases
“I would approach this in three steps…”  
“Green pipeline is necessary, not sufficient…”  
“Skip means defer with control, not ignore…”  
“LLMs draft; QE owns the oracle…”  
“Fail closed when the decision engine is unhealthy…”

### Do not say
“AI replaces QA.”  
“We patented this.”  
“Coverage % proves quality.”  
“We always run everything.” / “We trust the model blindly.”

### Comparison one-liner
Static tiers bootstrap; adaptive intelligence keeps tiers honest as the platform changes.
