# 3. Interview Questions & Answers

Levels: **L1** Fundamentals · **L2** Practical · **L3** Senior · **L4** Lead · **L5** Scenario · **L6** Troubleshooting · **L7** Follow-up

For major questions: Short → Senior → Layman → Example → Deep dive → Follow-ups → Keywords → Common mistake.

---

## L1 – Fundamentals

### Q1. What is Adaptive Intelligence for Data Quality Assurance?

**Short answer:**  
It’s a system that chooses *which* data tests to run, *how deep*, and *when*, by estimating each test’s expected risk reduction versus cost, then learning from results.

**Senior answer:**  
Traditional DQ runs a mostly static catalog. Adaptive intelligence adds a closed loop: estimate marginal value under uncertainty, select method and depth within a budget, execute, then update priors from outcomes and human false-positive labels. Humans still own oracles and P0 floors; the model allocates scarce effort.

**Layman:** Health inspector who schedules restaurants by risk and past complaints, then updates the schedule after each visit.

**Keywords:** marginal value, uncertainty, method/depth, feedback loop, budget  

**Common mistake:** “AI writes all the tests and we trust it.”

---

### Q2. What is the “marginal value” of a test?

**Short:** Extra risk you expect to remove by running that test now, after accounting for cost and what you already know.

**Senior:** Approximate as probability of useful detection × business impact × uncertainty weight, minus execution cost (compute, latency, analyst triage). Marginal means compared with not running it or running a cheaper sibling test.

**Keywords:** expected value of information, impact, cost, diminishing returns  

**Common mistake:** Equating value with “number of asserts.”

---

### Q3. Name six data quality dimensions.

Completeness, accuracy, consistency, uniqueness, timeliness, validity. Adaptive systems still map rules to these; they only prioritize execution.

---

### Q4. Adaptive DQ vs classic ETL testing?

ETL testing proves a pipeline’s mappings and loads for a release. DQ proves ongoing fitness in production/ops. Adaptive intelligence is an **allocation layer** on top of both — it does not replace source-to-target oracles.

---

### Q5. What signals feed the decision engine?

Schema diffs, deploy/transform changes, volume/distribution drift, freshness breaches, prior fail rates, lineage blast radius, SLA remaining budget, recent escaped defects, human FP/TP labels.

---

## L2 – Practical

### Q6. How would you classify validation depth?

**Short:** L0 contract/freshness → L1 profile → L2 sample reconcile → L3 full reconcile → L4 forensic.

**Senior:** Each asset has a default depth from impact tier. The engine promotes/demotes depth when uncertainty or incidents rise. Promotion is automatic; demotion requires a stability window so we don’t flap.

---

### Q7. What belongs in a candidate test catalog?

`rule_id, asset, dimension, sql/method, default_depth, cost_class, impact_score, owner, must_run_flag, last_outcome, prior_fail_rate`.

---

### Q8. Hard fail vs warn under adaptive selection?

P0 must-run hard fails always scheduled. Warnings can be sampled or rotated. Adaptive selection never silently converts a hard fail into “skip” without policy exception + audit.

---

### Q9. How do you handle cold-start tables?

High uncertainty prior → prefer L1 profile + L2 sample early; explore more until stable green history exists; require human sign-off before demoting to L0-only.

---

### Q10. What do you store after each run?

`run_id, rule_id, depth, selected_reason, metric, threshold, status, severity, sample_keys, cost_ms, human_label, logged_at`.

---

## L3 – Senior

### Q11. How do you prevent the model from starving rare failure modes?

**Short:** Keep exploration budget and periodic deep audits on critical assets.

**Senior:** Use explore/exploit: ε-greedy or uncertainty bonus so low-frequency arms still run. Add calendar deep-audits (e.g., monthly L3 on revenue facts) independent of the bandit. Feed escaped defects as strong prior shocks.

**Follow-ups:** How large is ε? Who owns the monthly audit list?

---

### Q12. False positives destroy trust — how does learning help?

Label FPs in the outcome store; down-weight noisy rules; suggest threshold or grain fixes; optionally quarantine the rule from hard gates until retuned. Track FP rate as a first-class KPI next to escape rate.

---

### Q13. How is this different from anomaly detection products?

Anomaly tools mostly watch metric drift. Adaptive intelligence also chooses **semantic** tests (reconcile, RI, business rules) and **depth**, using cost and uncertainty. You can combine both: anomalies raise uncertainty → promote deeper semantic tests.

---

### Q14. Where do LLMs fit?

LLMs draft candidate rules, summarize failures, propose depths. They do **not** own pass/fail semantics. Human quality gates, golden fixtures, and dual-control for money paths remain mandatory.

---

### Q15. How do you prove the system works in 90 days?

Baseline: escape rate, DQ compute hours, alert FP rate, SLA miss rate. Pilot one domain. Target: reduce compute/alert noise without increasing escapes; show audit explanations for skips; stakeholder survey on alert usefulness.

---

## L4 – Lead / Architect

### Q16. Design quality gates for CI vs nightly prod.

**CI (changed pipelines):** High floors — contracts + targeted L2/L3 for touched assets; fail merge on P0.  
**Nightly:** Budgeted portfolio across the estate with adaptive selection.  
**Serving layer:** Cheap continuous freshness/canaries.  
Lead owns the RACI and the kill switch to static tiers.

---

### Q17. Executive says “skipping tests is reckless.” Response?

Reframe: we are not skipping risk; we are **sequencing** finite capacity toward highest uncertain risk, with P0 floors, exploration, and incident feedback. Show restaurant-inspector analogy and pilot metrics. Offer override + monthly deep audit commitment.

---

### Q18. How do you estimate Impact(issue)?

Work with business: revenue, regulatory, customer trust tiers. Proxy with table criticality, downstream consumer count, PII/money flags, historical incident severity. Imperfect scores beat treating all tables equal.

---

### Q19. Multi-team operating model?

Central platform owns engine + outcome store; domains own oracles and impact tags; QE lead chairs weekly FP triage; SRE owns cost budgets; audit gets explainability export.

---

### Q20. What would you do differently after a Sev-1 escape?

Blameless postmortem → map missed detection to catalog gap or bad prior → force prior shock + temporary L3 on lineage neighbors → add must-run if systemic → adjust exploration. Communicate timeline to stakeholders.

---

## L5 – Scenario-based

### Q21. 10M source rows, 9.8M target — adaptive system ran only a sample yesterday.

**Approach:** Symptom is count mismatch. Immediately elevate asset + upstream to L3 full counts and key reconcile regardless of model. Check watermark, filters, reject table, late files. After fix, label event as escape/near-miss so priors rise. Review why sample didn’t catch (sample frame excluded bad partition?).

---

### Q22. Schema change deployed; model still scheduled shallow profiles.

**Approach:** Schema diff should spike uncertainty. If it didn’t, fix feature pipeline (deploy/schema connectors). Manually override promote to L2/L3. Add regression test: schema events must boost score.

---

### Q23. Budget cut: 50% less DQ compute.

**Approach:** Recompute portfolio with tighter budget; protect P0 floors; increase sampling efficiency; push more L0 contract checks left; negotiate business impact retags; publish risk acceptance for demoted assets.

---

### Q24. Two rules conflict — one pass, one fail on same grain.

**Approach:** Don’t average blindly. Investigate oracle conflict; check grain/time window; human resolves rule ownership; outcome store records conflict; temporarily force deep forensic; fix catalog semantics.

---

### Q25. Business wants “100% validation” on all PII tables.

**Approach:** Agree PII tables get must-run floors and higher default depth; clarify 100% means dimensions covered with appropriate methods, not infinite compute; document residual risk for non-P0 attributes.

---

## L6 – Troubleshooting

### Q26. Decision job selected zero tests for a mart.

Check budget config, tag completeness, must-run flags, score NaNs, connector failures. Fail closed for P0 assets: if scoring breaks, fall back to static tier pack.

---

### Q27. Costs explode after adaptive rollout.

Look for depth flapping, explore rate too high, duplicate overlapping rules, full scans mis-tagged as cheap. Add cost feedback into scoring; cap L3 concurrency.

---

### Q28. Alert volume unchanged.

Selection may still prefer noisy rules. Improve FP labeling loop; suppress known-bad history; retune thresholds; measure “actionable alert %.”

---

### Q29. Model never promotes a silent inaccurate transform (job green).

Semantic accuracy needs oracles, not only anomalies. Ensure reconcile rules exist in catalog; use BI mismatch tickets as outcome signals; add canary metrics with known seeds.

---

### Q30. Analysts disagree with skip explanations.

Improve explanation UX (top features); involve them in impact tagging; allow one-click force-run; review skips in standup until trust builds.

---

## L7 – Follow-ups / cross-questioning

| If you say… | Expect… |
|-------------|---------|
| “We use uncertainty” | How quantified? Prior from what window? |
| “Bandit / Bayesian” | What is the reward? How handle delayed labels? |
| “P0 floors” | Who defines P0? How often reviewed? |
| “LLM drafts rules” | How prevent hallucinated thresholds? |
| “Reduced compute 45%” | Escape rate? Statistical significance? |
| “Sample reconcile” | Stratification key? Confidence statement? |

---

## Cross-technology questions (short answers)

**ETL + adaptive DQ:** Pipeline success ≠ data correct; adaptive layer schedules oracles after load events.  

**SQL + adaptive DQ:** Engine chooses which SQL class to run; engineers still write correct grains.  

**CI/CD + adaptive DQ:** Changed files/lineage → uncertainty shock → deeper CI validation.  

**CDC + adaptive DQ:** Watermark anomalies raise uncertainty; uniqueness checks on current image stay must-run.  

**Cloud cost + adaptive DQ:** Cost class per method (bytes scanned, slot-ms) enters the value formula.  

**API sources + adaptive DQ:** Contract tests are cheap L0 arms; payload sampling is L2.  

**Production support + adaptive DQ:** Incident tickets write high-impact outcomes that reshape tomorrow’s portfolio.
