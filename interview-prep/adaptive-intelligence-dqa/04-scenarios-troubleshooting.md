# 4. Scenarios, Production Incidents & STAR Stories

## Production incident playbooks

Format: **Symptom → Investigation → SQL checks → Logs → Root cause → Fix → Validation → Prevention**

---

### Incident A — Count mismatch after “green” adaptive run

**Symptom:** Dashboard orders = 9.8M; source = 10M. Last night adaptive DQ was green (sample).

**Investigation:** Confirm grain/time window; check reject/quarantine; compare partition list; verify watermark.

**SQL checks:** Full count by `business_date`; anti-join keys source vs target; reject reason tallies.

**Logs:** Orchestrator shows L2 sample selected; schema deploy at 18:00 not ingested as signal.

**Root cause:** New filter dropped rows; sample missed sparse bad partition; schema/deploy connector gap.

**Fix:** Hotfix transform; backfill; force L3 on lineage neighbors.

**Validation:** Full reconcile + BI certify.

**Prevention:** Deploy events → uncertainty shock; partition-coverage rule as must-run for facts; escape labeled into priors.

---

### Incident B — Duplicate customers after SCD2 bug

**Symptom:** Unique customer count inflated; marketing spend anomaly.

**Investigation:** Current-flag duplicates; overlapping effective dates.

**SQL:** `COUNT(*)` vs `COUNT(DISTINCT bk)` where `is_current`; window check on dates.

**Root cause:** Merge key incomplete after source change.

**Adaptive angle:** Uniqueness rule was demoted (long green history). Escape shocks prior; uniqueness on identity dims returns to must-run floor.

---

### Incident C — Null spike in amount; job succeeded

**Symptom:** `order_amount` null % 0.2% → 8%.

**Investigation:** Profile history; upstream optional field; API version.

**Root cause:** Producer omitted field; ETL coerced null without fail.

**Prevention:** L0 contract on required fields; completeness rule impact=money → hard fail; adaptive system should have promoted on schema/version signal.

---

### Incident D — Incremental load duplicated yesterday

**Symptom:** Revenue 2× for one day.

**Investigation:** Watermark not advanced; idempotency key missing.

**Fix:** Dedup reload; repair watermark; add batch_id uniqueness must-run.

**Adaptive:** Costly full scan not always needed — uniqueness on `(order_id, batch_id)` is high value / medium cost arm.

---

### Incident E — Decision engine outage

**Symptom:** No DQ selections emitted.

**Fail-closed policy:** Fall back to static P0/P1 pack; page on-call; do not interpret “empty selection” as “all healthy.”

---

## Scenario bank (2–3 minute answers)

### S1. “AI will replace our DQ team.”

Clarify → AI allocates effort and drafts; humans own risk, oracles, release. Propose 90-day pilot metrics. Reframe to AI-augmented QE.

### S2. Suite 4 hours; SLA 2 hours.

Portfolio optimization problem. Tag cost/impact; adaptive select; parallelize; push L0 left; cut duplicate rules; report residual risk.

### S3. Auditors ask why a control was not run on Tuesday.

Show explainability record: score, budget, next-eligible, must-run status. Show compensating control (canary / monthly deep audit). Never shrug.

### S4. Vendor demo claims “autonomous data quality.”

Ask: oracle ownership, FP labeling, must-run floors, escape feedback, cost model, fail-closed behavior. Map vendor features onto your loop; buy sensors, keep decision policy accountable.

### S5. Two domains fight for DQ budget.

Impact scoring + shared executive tiers; publish portfolio; rotate exploration; escalate true conflicts to data council.

---

## STAR answers (speak naturally)

### Tell me about yourself (angle for this topic)

I am a senior ETL / data testing lead. I focus on making sure data is fit for use — not just that jobs are green. Lately I care a lot about **risk-based validation**: we never have infinite time, so we should spend deeper tests where uncertainty and business impact are highest, and learn from what we find.

### Difficult production defect

**S:** Revenue mart under-reported after a “successful” load.  
**T:** Restore trust before business open.  
**A:** Full count + key reconcile; found late filter; checked why shallow DQ missed it; patched, backfilled, added deploy-signal to DQ prioritization.  
**R:** Numbers certified; process change reduced similar misses.

### Improved testing / process

**S:** 4,000 noisy rules, missed SLA.  
**T:** Cut noise without raising escapes.  
**A:** Impact/cost tags, P0 floors, outcome feedback, weekly FP triage.  
**R:** Large compute drop, better signal; stakeholders re-engaged with alerts.

### Conflict with developers

**S:** Devs wanted to skip reconcile to hit a release.  
**T:** Protect money path without blind blockage.  
**A:** Offered sample reconcile in CI + full post-deploy with rollback criteria; documented risk.  
**R:** Shipped with eyes open; full reconcile caught edge case same day; relationship stayed constructive.

### Prioritizing testing under deadline

Three steps: blast radius, irreplaceable oracles (money/identity), then everything else as budget allows. Adaptive thinking is explicit prioritization — even without ML.

### Mentoring

Teach juniors the depth ladder and “green job ≠ correct data.” Pair on writing oracles before writing automation. Review skip explanations so they learn risk language.

### Why should we hire you?

I combine classic ETL validation discipline with a modern operating model: cost-aware, feedback-driven quality. I can whiteboard the system, implement the SQL oracles, and lead the trust conversation with business and audit.

---

## Test case generation (for an adaptive pilot)

For asset `fact_orders` include:

1. **Positive** — Known seed day fully reconciles at L3.  
2. **Negative** — Inject null amounts → hard fail completeness.  
3. **Edge** — Late-arriving partition appears after watermark.  
4. **Boundary** — Amount precision at scale boundaries.  
5. **Regression** — Prior Sev-1 filter bug fixture.  
6. **DQ** — Freshness SLA + uniqueness of order_id.  
7. **Integration** — Upstream staging vs mart.  
8. **Failure/recovery** — Decision engine down → static pack runs.  
9. **Performance** — L3 finishes within budget cap.  
10. **Production validation** — Canary metric vs finance file.

Each case: scenario, preconditions, data, steps, expected result, why it matters (trust in adaptive policy).
