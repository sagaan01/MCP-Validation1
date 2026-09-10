# Scenario-Based Problem Solving in Modern QE & the AI Era

A practical guide for Principal SDET / QE Lead interviews and day-to-day quality leadership.  
Focus: **how you think**, not just what tools you name.

---

## How to Answer Any Scenario (STAR + Quality Lens)

Use this structure every time:

1. **Clarify** — scope, risk, blast radius, SLAs, data sensitivity  
2. **Observe** — evidence: logs, metrics, traces, failed assertions, flaky history  
3. **Hypothesize** — ranked causes (env → data → code → test → infra)  
4. **Isolate** — smallest reproducible case; compare known-good vs failing  
5. **Fix / Contain** — short-term mitigation + long-term prevention  
6. **Prove** — regression coverage, quality gates, monitoring, postmortem  

**AI-era add-on:** treat LLM output as *untrusted draft*. Always define **human quality gates** (review, golden tests, schema checks, CI policy).

---

## Part 1 — Classic QE Scenarios (Still Asked Everywhere)

### 1) Flaky UI test in CI (passes locally)

**Scenario:** Playwright checkout test fails ~20% in CI, green on laptop.

**Approach**
- Separate **product flake** vs **test flake** vs **env flake**
- Check: parallel isolation, shared test data, timing (`waitFor` vs fixed sleep), network, auth cookies, video/trace artifacts
- Use Playwright trace + HAR; run with `--repeat-each` / quarantine tag
- Fix root cause (idempotent data setup, stable locators, deterministic waits)
- Gate: flake rate dashboard; auto-quarantine with ticket + expiry

**Good answer signals:** isolation, traces, quarantine policy, not “just add retry.”

---

### 2) Production bug escaped despite “100% automation”

**Scenario:** Critical pricing bug shipped; suite was green.

**Approach**
- Map bug to test gaps: wrong layer (UI-only), missing oracle (asserted UI text, not money), no contract test, no production telemetry
- Introduce risk-based coverage: critical paths × failure modes
- Add contract tests (OpenAPI/Schema), data assertions, canary checks
- Shift-left on requirements ambiguity; shift-right with synthetic monitors

**Good answer signals:** automation ≠ quality; oracles and risk matter more than case count.

---

### 3) ETL / data pipeline mismatch

**Scenario:** Downstream dashboard shows wrong totals after Glue/Airflow job.

**Approach**
- Trace lineage: source → transform → warehouse → BI
- Validate: row counts, null rates, PK uniqueness, referential integrity, business rules, late-arriving data, timezone/date grain
- Compare incremental vs full reload; check partition pruning / watermark
- Add data quality tests (Great Expectations / custom SQL gates) in pipeline
- Alert on anomaly thresholds, not only job success

**Good answer signals:** data contracts, freshness, idempotency, DQ gates in CI/CD of pipelines.

---

### 4) API contract break between services

**Scenario:** Mobile app breaks after backend deploy; status 200 but missing fields.

**Approach**
- Consumer-driven contracts / schema validation in CI
- Versioning strategy (additive changes first)
- Shadow traffic / canary with response schema checks
- Compatibility matrix in release checklist

---

### 5) Performance regression under load

**Scenario:** p95 latency jumped after release; functional tests green.

**Approach**
- Baseline vs current; isolate endpoint, DB, cache, downstream dependency
- Use APM + load test (JMeter/k6) with realistic data shape
- Check N+1 queries, lock contention, connection pool exhaustion
- Quality gate: performance budgets in CI for critical paths

---

## Part 2 — Modern QE in the AI Era (High-Value Scenarios)

### 6) LLM generates tests that “look correct” but miss bugs

**Scenario:** Cursor/Copilot wrote 40 Playwright tests; coverage looks high; critical bug still ships.

**Problem pattern**
- Tests assert implementation details / happy path only
- Weak oracles (“page loaded”) instead of business outcomes
- Hallucinated selectors / unstable CSS
- No negative, security, or data-boundary cases

**Resolution**
- Define **test intent** first (risk matrix), then let AI draft
- Require human review checklist: oracle strength, data setup, teardown, flake risk
- Keep golden fixtures and property-based / boundary cases as non-negotiable
- Add mutation testing or fault injection on critical modules
- CI policy: AI-generated PRs cannot merge without QE review label

---

### 7) AI agent changes production code; tests need to keep up

**Scenario:** Coding agent refactors auth; 30% suite fails overnight.

**Approach**
- Treat agent PRs like junior engineer PRs: small diffs, clear acceptance criteria
- Prefer resilient locators / API contracts over brittle UI coupling
- Auto-triage failures: classify compile/break vs behavior change vs flake
- Maintain a **characterization suite** before large refactors (capture current behavior)
- Quality gate: agent must update tests + run targeted suite; blocked if critical path red

---

### 8) Prompt / RAG system quality (AI product under test)

**Scenario:** Chatbot gives outdated policy answers; stakeholders ask “how do we test AI?”

**Approach**
- Separate layers:
  - Retrieval quality (precision/recall on eval set)
  - Groundedness (answer supported by retrieved docs)
  - Safety (PII, jailbreak, toxicity)
  - Latency/cost
- Build **golden eval sets** + regression eval harness (offline)
- Online: sampling + human feedback loop; canary prompts
- Never rely on “LLM-as-judge” alone without calibrated human labels

---

### 9) Synthetic data / PII in AI-assisted testing

**Scenario:** Engineer pastes prod logs into an LLM to debug a failing test.

**Approach**
- Policy: no prod PII/secrets in prompts; use redaction tooling
- Prefer synthetic or anonymized datasets
- Secrets scanning in CI; DLP awareness for AI tools
- Document approved tools and data classes

---

### 10) “AI wrote the SQL” — data validation risk

**Scenario:** LLM-generated reconciliation SQL is used as the source of truth for release sign-off.

**Approach**
- Dual-control: independent oracle (second method / known seed data)
- Explainability: every DQ rule maps to a business requirement ID
- Unit-test the SQL with fixtures; compare against handcrafted expected outputs
- Treat AI SQL as draft; QE owns the assertion semantics

---

## Part 3 — Common Problems & Issue Resolution Playbook

| Common problem | Early signals | First checks | Sustainable fix |
|---|---|---|---|
| Flaky automation | Intermittent CI red | Traces, isolation, shared state | Deterministic data + quarantine policy |
| False greens | Prod escapes | Oracle review, risk mapping | Stronger assertions + contract/DQ tests |
| Env drift | “Works in staging only” | Config/secrets/versions parity | Infra as code + ephemeral envs |
| Test debt explosion | Suite > 4h, low signal | Ownership, skip trends | Risk-based pruning + pyramid rebalance |
| Data freshness bugs | BI complaints | Watermarks, late data | DQ freshness SLOs + alerts |
| Ambiguous requirements | Late defects | Example mapping gaps | Acceptance criteria + living docs |
| AI hallucination in tests | Weird selectors / invented APIs | Dry-run against real app | Human gates + recorded fixtures |
| Prompt injection / unsafe AI | Odd agent actions | Tool permission audit | Least privilege + allowlists |
| CI bottleneck | Queue times | Parallelism, sharding | Smart test selection + caching |
| Ownership gaps | Bugs bounce teams | RACI unclear | Quality owned by feature teams + QE platform |

---

## Part 4 — Interview-Ready Scenario Bank (Ask → Probe → Strong Answer)

### A. Leadership / Strategy

**Q:** Your org wants “AI to replace QA in 6 months.” How do you respond?  
**Strong answer:** Reframe to **AI-augmented QE**. Automate low-judgment work (boilerplate cases, log clustering, draft SQL). Keep humans on risk, ethics, oracle design, release decisions. Propose a 90-day pilot with measurable cycle-time and escaped-defect metrics.

**Q:** Automation coverage is 85%, but customers still find severity-1 bugs. What do you change?  
**Strong answer:** Coverage % is vanity. Rebuild quality strategy around critical user journeys, data correctness, observability, and exploratory charters. Introduce quality gates tied to risk, not case counts.

---

### B. Debugging Under Pressure

**Q:** Black Friday: checkout error rate spikes; your canary is mixed. Walk me through the next 30 minutes.  
**Strong answer:**  
1) Declare severity / war room  
2) Confirm blast radius (region, payment method, new vs old version)  
3) Rollback/canary pause if clearly regressed  
4) Parallel tracks: logs/metrics, last deploy diff, third-party payment status  
5) Communicate ETA and customer impact  
6) After stabilize: defect + test gap + monitor gap

---

### C. Data Quality

**Q:** Snowflake table passed row-count checks but finance disputes revenue by 2%. Diagnose.  
**Strong answer:** Counts can match while amounts differ—duplicates with compensating filters, currency conversion, late refunds, timezone cutoffs, SCD Type 2 effective dating, null vs zero. Build amount-level reconciliations and business-rule tests, not only counts.

---

### D. AI-Assisted Delivery

**Q:** An agent opens a PR that “fixes” failing tests by weakening assertions. What is your policy?  
**Strong answer:** Reject. Treat assertion dilution as a quality incident. Require intent-preserving fixes; if product behavior changed, update specs explicitly with product sign-off. Add a CI check for suspicious assertion removals on critical paths.

---

### E. Framework Design

**Q:** Design a modern test architecture for microservices + web + data lake.  
**Strong answer:**  
- Unit + component at service  
- Contract tests between services  
- Selective E2E for critical journeys  
- Data quality gates on pipelines  
- Observability-based production checks  
- AI assists generation/maintenance; humans own strategy and gates  
- CI: fast feedback on PR, deeper suites nightly, release gates on risk tags

---

## Part 5 — “Issue Resolving” Patterns QE Leaders Use

### 1) Isolate the layer
UI failure ≠ UI bug. Check API, auth, data seed, feature flag, CDN, clock skew.

### 2) Prove with a minimal repro
One user, one account, one payload. If you can’t minimize, you don’t understand it yet.

### 3) Compare control vs experiment
Last known good build, same data, same region. Diff config and feature flags first.

### 4) Prefer detection over debate
Add a failing test or monitor that would have caught it—before arguing root cause in Jira.

### 5) Close the loop
Every Sev-1/2 gets: root cause, detection gap, prevention test/monitor, owner, due date.

### 6) AI-specific control loop
Prompt/tool → output → **validator** (schema, policy, golden eval) → human approve → merge.

---

## Part 6 — Practice Drills (Self or Mock Interview)

Work these out loud in 8–10 minutes each:

1. Staging pass, prod fail after feature-flag 10% rollout.  
2. Playwright suite suddenly 3× slower after dependency upgrade.  
3. Airflow success but empty partition for one tenant.  
4. LLM support bot leaks another customer’s ticket summary.  
5. CI is green but package has a known CVE; release manager wants to ship.  
6. Team wants 100% AI-generated regression pack with no humans reviewing.  
7. DynamoDB eventually consistent read causes intermittent API test failure.  
8. Multi-brand white-label UI: shared components, divergent business rules.

For each, force yourself to state: **risk, evidence, first hour actions, permanent fix, metric to watch.**

---

## Part 7 — Cheat Sheet: Modern QE Mindset

- Quality is a **system property**, not a test phase.  
- Automation is a **sensor**; strategy chooses what matters.  
- AI accelerates drafts; **oracles and gates** decide truth.  
- Prefer **fast, trustworthy signal** over massive brittle suites.  
- Data correctness is product correctness.  
- Observability is part of the test pyramid.  
- Psychological safety + clear ownership beats hero debugging.

---

## Quick Reference — Tools Mentioned in Real Interviews

| Area | Examples |
|---|---|
| UI / E2E | Playwright, Cypress, Selenium |
| API | Postman/Newman, REST Assured, Pact, schemathesis |
| Performance | JMeter, k6, Gatling |
| Data / ETL | SQL, Great Expectations, dbt tests, Spark/Glue job asserts |
| Cloud | AWS (S3, Lambda, EventBridge, DynamoDB), Snowflake, BigQuery |
| CI/CD | GitHub Actions, Jenkins, GitLab CI |
| AI-assisted QE | Cursor, Copilot, eval harnesses, LLM judges (with caution) |
| Observability | CloudWatch, OpenTelemetry, Datadog, logs/metrics/traces |

---

## Suggested Talking Point (Principal / Lead Level)

> “In the AI era, QE’s edge is not writing more cases faster—it’s designing trustworthy verification: strong oracles, risk-based gates, data contracts, and feedback loops from production. AI is a force multiplier inside that system, never a replacement for accountability.”

---

*Aligned to modern SDET / QE Lead practice: Playwright · Python · AWS · SQL · data quality · AI-assisted testing with human review.*
