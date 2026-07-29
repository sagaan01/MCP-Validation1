# 9. Leadership, Mentorship & Principal Influence

**Why this matters:** Title is **Principal**—they want architecture influence and mentoring, not only IC coding speed.

---

## What “Principal SDET” means (say this)

> “I set the quality engineering vision, make framework and pipeline decisions that scale across teams, mentor senior SDETs, and translate business risk into an executable test strategy—while still being hands-on on the hardest problems.”

---

## Q1. “How do you mentor SDETs?”

### Answer (STAR-ready)

**Situation:** Mixed skill team, Selenium spaghetti, high flake.  
**Task:** Raise maturity without blocking delivery.  
**Action:**

- Pairing hours twice weekly  
- Architecture Decision Records (ADRs) for framework choices  
- PR review rubrics (locators, isolation, assertions)  
- Brown-bags: Playwright fixtures, SQL recon  
- Career paths: SDET I→II→Senior skills matrix  

**Result:** Flake ↓, PR cycle time ↓, two engineers promoted.

### Mentorship tactics

| Level | Approach |
|-------|----------|
| Junior | Guided kata: write one POM + one API test |
| Mid | Own a journey pack + CI health |
| Senior | Lead design reviews; rotate on-call for test infra |

---

## Q2. “How do you influence architecture without authority?”

### Answer

“Bring data and options:

1. Measure pain (flake, duration, escapes)  
2. Propose 2–3 options with trade-offs  
3. Pilot on one squad  
4. Show before/after metrics  
5. Codify in standards + templates  

I partner with architects early on testability: `data-testid`, API for setup, idempotent DELETE, observable job statuses.”

---

## Q3. “Conflict: Dev says ‘automation is QA’s job’.”

### Answer

“I reframe to shared ownership: developers own unit/contract; QE owns cross-cutting journeys, data recon, and gates. I negotiate definition of done: ‘story not done without automated tests at agreed layer.’ Escalate with risk language, not blame.”

---

## Q4. “How do you set coding standards for automation?”

### Artifacts you’d create

- Framework contribution guide  
- ESLint rules  
- PR template  
- Example tests (golden paths)  
- “Do not use `waitForTimeout`” rule  
- CODEOWNERS on `/automation`  

---

## Q5. “Prioritization when everything is P0?”

### Answer

“Risk × frequency × detectability. Money movement, authz leakage, books-and-records first. I publish a risk catalog with Product sign-off so priorities aren’t personal opinions.”

---

## Q6. “Tell me about a time you reduced production risk.”

Use this template with your real story:

```text
Context: [platform]
Risk: [data mismatch / fee / wrong account]
Action: [recon framework / gate / design change]
Impact: [defect prevented / $ risk / time saved]
Learning: [standard added]
```

---

## Q7. “How do you run a community of practice?”

- Biweekly QE guild  
- Demo failed/fixed flakes (blameless)  
- Share Copilot prompt library  
- Rotate “pipeline sheriff”  
- Maintain internal docs site  

---

## Q8. “Hiring / interviewing other SDETs?”

### What you assess

- Debugging mindset  
- Code sample quality  
- Data literacy (SQL)  
- Collaboration stories  
- Ability to design, not just script  

### Sample interview task you give candidates

“Design tests for ‘transfer cash between accounts’ including API, UI, and DB recon—and explain CI placement.”

---

## Q9. “Build vs buy test tools?”

### Answer

“Prefer open ecosystem (Playwright) + thin internal libraries. Buy when vendor accelerates compliance reporting or device farm. Avoid mega-suites that hide code from engineers. Decision via ADR.”

---

## Q10. “Principal stakeholder communication examples.”

| Audience | Message style |
|----------|---------------|
| CTO | Risk, trend, investment ask |
| Product | Coverage of workflows, UAT ask |
| Devs | Testability & DoD |
| Business | Confidence language + exceptions |

**Example one-liner to exec:**  
“Nightly recon cut undetected position breaks from multi-day to under one hour; remaining risk is FX rate latency—mitigation planned.”
