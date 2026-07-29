# 8. UAT & Data Quality Strategy

**Why this matters:** JD asks you to **own and define UAT and data quality strategy** across wealth, asset management, trust, and advisory platforms.

---

## Core concepts

- UAT ≠ “users click around”; it’s risk-based business validation
- Align to **real workflows**: onboarding, servicing, portfolio, transactions, fees, reporting
- Combine human UAT + automated regression + data recon
- Entry/exit criteria, evidence, sign-off
- Strategy is living: update with platform changes

---

## Q1. “How would you define a UAT strategy for this client?”

### Answer framework

1. **Stakeholder map** — Product, Ops, Advisors, Trust officers, Compliance, Engineering, QE  
2. **Workflow catalog** — top business processes with risk rating  
3. **Coverage model** — which steps automated vs manual exploratory vs business UAT  
4. **Environments** — UAT data refresh policy, masked prod-like data  
5. **Cadence** — sprint UAT for features; release UAT window; post-deploy hypercare  
6. **Sign-off** — RACI, go/no-go board with quality metrics  
7. **Feedback loop** — defects → automation backfill  

### Sample workflow coverage matrix

| Workflow | Business UAT | Automated UI | API | Data recon |
|----------|--------------|--------------|-----|------------|
| Account onboarding | Yes | Smoke path | Yes | Account master |
| Advisory fee bill | Yes | View invoice | Yes | Fee accuracy SQL |
| Trade → position | Sample | Critical path | Yes | Positions recon |
| Statement gen | Spot check PDF | Job trigger | — | Completeness |
| Beneficiary change | Yes | Yes | Yes | Audit + DB |

---

## Q2. “UAT entry and exit criteria examples?”

### Entry
- QA regression green (or waived with risk)  
- UAT environment deployed + smoke passed  
- Test data prepared (personas: advisor, client, trust officer)  
- Known defects list published  

### Exit
- All P0/P1 UAT scenarios pass  
- No open Sev1/Sev2 without documented waiver  
- Data quality blockers = 0 for release scope  
- Business sign-off recorded on Azure work item  

---

## Q3. “How do you partner with business leaders?”

### Answer

“I translate risk into scenarios they recognize. Workshops:

- Shadow advisor desktop usage  
- Map ‘day in the life’ → test charter  
- Prefer business language in UAT packs (“Fund IRA, buy mutual fund, verify confirmation”)  
- Show dashboards: what automated already covers vs what needs their eyes  

I don’t ask them to write Selenium; I ask them to validate outcomes and exceptions.”

---

## Q4. “Design data quality strategy (Principal-level).”

### Pillars

1. **Rules catalog** (versioned, owned)  
2. **Automation** in CI + post-ETL  
3. **Monitoring** in prod/ops (observability cousin)  
4. **Triage process** (break → severity → owner)  
5. **Prevention** (contracts, schema gates upstream)  

### Sample operating model

| Layer | Owner | Cadence |
|-------|-------|---------|
| Pipeline unit rules | Data eng | PR |
| SDET recon suite | QE | Nightly + release |
| Business certification | Ops/Product | Release |
| Prod DQ monitors | Platform | Continuous |

---

## Q5. “UAT data management?”

### Answer

- Masked production subset refreshed on schedule  
- Synthetic households for P0 journeys (deterministic)  
- Golden accounts for statements/performance baselines  
- Data reset scripts between UAT cycles  
- Never use live client PII in offshore AI tools  

```text
Persona pack:
  ADV-01  Independent advisor with 5 households
  TRU-01  Trust officer with discretionary trust
  CLI-01  Client portal user (view-only)
  OPS-01  Back-office fee ops
```

---

## Q6. “How do you handle UAT defects vs production bugs?”

| | UAT defect | Prod escape |
|-|------------|-------------|
| Process | Azure Bug linked to User Story + Test Case | Sev + RCA |
| Automation | Add regression test before close | Same + monitoring |
| Comms | Daily UAT triage | Incident bridge |

---

## Q7. “Example UAT script — portfolio performance”

```text
Title: Verify YTD performance for advisory account
Persona: Advisor
Preconditions: Account ADV-100 funded; prices loaded for as-of date
Steps:
  1. Login to advisor workstation
  2. Open household Smith → account ADV-100
  3. Navigate to Performance → YTD
  4. Note TWR % and ending MV
Expected:
  - TWR matches Performance API within 0.01%
  - Ending MV matches Positions + Cash recon
  - Benchmark section shows agreed index
Attach: screenshot + API correlation id
```

---

## Q8. “Aligning UAT with Agile / continuous delivery?”

### Answer

“Shift left: acceptance criteria include testable outcomes. Continuous testing carries most regression; UAT focuses on **new risk** and **business judgment**. For regulated releases, keep a thin formal UAT gate even if CD is mature.”

---

## Q9. “Metrics for UAT effectiveness?”

- % P0 workflows certified each release  
- UAT defects found vs prod escapes  
- Time to UAT environment readiness  
- Business hours spent vs value (automation should reduce repetitive UAT)  
- Waiver aging  

---

## Q10. “First 90 days strategy outline (interview gold).”

**Days 1–30:** Assess frameworks, pipelines, flake rate, DQ gaps, meet business owners; produce heat map.  
**Days 31–60:** Publish automation standards; land Playwright smoke in PR gate; first nightly recon for positions/cash.  
**Days 61–90:** UAT workflow matrix signed; AI pilot with guardrails; mentor circles; report quality trend to leadership.
