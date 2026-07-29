# 11. Behavioral & Scenario Deep-Dives

Practice these out loud. Keep answers **2–3 minutes**, structured, with metrics.

---

## Scenario A — Framework from scratch

**Prompt:** “We have brittle Selenium tests and no CI gates. What do you do in the first quarter?”

### Model answer

“Week 1–2: baseline metrics—duration, flake, escape defects, ownership. Interview teams on pain.  

Then propose target architecture: Playwright+TS, API seeding, Azure DevOps PR smoke.  

Pilot one critical wealth workflow (e.g., account overview + positions).  

Land quality gate on PR.  

Publish standards and train.  

Migrate P0 paths; quarantine legacy.  

Report monthly to leadership on flake and escape trends.”

---

## Scenario B — Production data incident

**Prompt:** “Positions in client portal don’t match custody. How do you respond as Principal SDET?”

### Model answer

1. **Stabilize:** severity, blast radius, communications with incident lead.  
2. **Detectability:** can our recon catch this? If not, write emergency SQL compare source vs portal API vs DB.  
3. **Contain:** feature flag / banner if needed (with product).  
4. **Fix verification:** automated recon becomes release gate.  
5. **RCA:** contract gap, ETL late run, price feed—drive permanent test.  
6. **Mentorship:** blameless postmortem; add to rules catalog.

---

## Scenario C — Flaky pipeline blocking releases

**Prompt:** “Playwright fails 30% on main. Business wants to ship.”

### Model answer

“Don’t delete tests silently. Triage top failures; separate product bugs vs harness. Temporarily shift non-P0 to nightly with visibility; keep P0 money/authz on gate. Fix isolation (shared accounts). Add trace-on-retry. Publish flake burndown. Negotiate explicit risk waiver only with named owner and expiry.”

---

## Scenario D — AI enthusiasm vs compliance

**Prompt:** “CTO wants Copilot generating all tests. Compliance worries about data.”

### Model answer

“I support acceleration with a policy: enterprise Copilot, no PII, human review, pilot metrics. Show a safe win (boilerplate POMs). Reject unsupervised generation of fee assertions. Offer compliance a written AI-QE standard.”

---

## Scenario E — UAT vs automation tension

**Prompt:** “Business UAT takes 2 weeks every release. Leadership wants continuous delivery.”

### Model answer

“Analyze UAT scripts—automate repetitive checks; keep business judgment scenarios. Introduce risk-based UAT: full for major books-and-records changes, thin for low-risk UI. Provide evidence dashboard so business trusts automation. Co-create the matrix so they own the trade-off.”

---

## Scenario F — Cross-team ownership of API tests

**Prompt:** “Three services; integration tests orphaned and flaky.”

### Model answer

“Propose RACI: each service owns contract tests in their repo; platform QE owns journey pack. Shared library for auth/token. Test environment SLA with DevOps. Flaky journey tests get an executive sponsor. Architecture review for testability (ready endpoints, delete APIs).”

---

## Scenario G — Whiteboard: fee billing

**Prompt:** “Design test strategy for new advisory fee schedule with breakpoints.”

### Talking points

- Unit tests for pure calculation functions (dev)  
- Table-driven cases: AUM tiers, proration, waivers  
- API: invoice preview + finalize  
- Data: SQL expected vs actual line items  
- UI: statement/fee disclosure  
- UAT: ops runs billing in UAT with known households  
- Gate: zero fee breaks > $0.01 for sampled book  

---

## Scenario H — Mentoring pushback

**Prompt:** “Senior SDET refuses TypeScript standards, prefers recording tools.”

### Model answer

“Seek to understand constraints. Pair on a hard test where code-first wins. Offer migration path. Standards approved by guild—not personal taste. If still blocked, escalate on risk (maintainability) with examples of recorded tests failing silently.”

---

## Classic behavioral bank (short prompts)

Prepare STAR for each:

1. Time you influenced design for testability  
2. Hardest production bug you helped prevent/find  
3. Conflict with a developer  
4. Mentored someone who leveled up  
5. Delivered under ambiguous requirements  
6. Made a mistake—how you handled it  
7. Introduced a new tool/framework  
8. Dealt with offshore/onshore collaboration  
9. Handled regulatory/audit evidence request  
10. Prioritized when understaffed  

---

## Questions **you** should ask them

1. What’s the current Playwright vs Selenium split?  
2. How is data quality owned today—QE, data eng, or ops?  
3. What does the PR quality gate look like in Azure DevOps?  
4. Which wealth workflows cause the most production pain?  
5. How mature is AI tooling adoption / any restrictions?  
6. What does success look like at 6 months for this Principal role?  
7. Team size, mentoring expectations, onsite collaboration culture?  
8. UAT ownership—business ops or QA-driven?
