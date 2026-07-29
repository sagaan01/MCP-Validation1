# 8. UAT & Data Quality Strategy (Layman terms)

## What is UAT?

**UAT** = User Acceptance Testing.

In plain English:

> Real business users (or business proxies) check whether the system works for real-life work — not just “technically runs.”

### Analogy

Builders say the house wiring works.  
Homeowners try living in it: lights, water, doors, kitchen flow.

UAT is the homeowner walkthrough.

---

## UAT is not the same as QA automation

| QA / SDET automation | UAT |
|----------------------|-----|
| Scripts check known rules repeatedly | Business judges fitness for real workflows |
| Fast, frequent | Often around release windows |
| Great for regression | Great for new risk + judgment calls |

Best organizations use **both**.

---

## What “own UAT and data quality strategy” means

You’re asked to design the plan:

1. What business workflows must be covered?  
2. What is automated vs manual UAT?  
3. What data checks are mandatory before go-live?  
4. Who signs off?  
5. What evidence do we keep?  

Not just “execute someone else’s checklist.”

---

## Workflow-based UAT (how to think)

Map real work:

| Business workflow | Example check |
|-------------------|---------------|
| Account onboarding | Trust account opens with required trustee info |
| Servicing | Beneficiary update saves and audits |
| Portfolio management | Holdings and market value make sense |
| Transactions | Buy/sell appears correctly after settlement |
| Fees | Invoice matches schedule |
| Client reporting | Statement complete and accurate |

### Example matrix (simple)

| Workflow | Business UAT needed? | Automated UI | API | Data recon |
|----------|----------------------|--------------|-----|------------|
| Open account | Yes | Smoke path | Yes | Account created in DB |
| Fee billing | Yes | View fee screen | Yes | Fee SQL expected vs actual |
| Statement | Spot-check PDFs | Job trigger | — | All accounts produced |

---

## Entry and exit criteria (plain English)

**Entry criteria** = “Are we ready to start UAT?”  
Examples:
- QA smoke passed
- UAT environment is up
- test users/data ready
- known issues list shared

**Exit criteria** = “Are we ready to go live?”  
Examples:
- all critical UAT scenarios passed
- no open Sev-1/Sev-2 without waiver
- data blocker breaks = 0
- business sign-off recorded

---

## What is a data quality strategy?

A deliberate plan to keep numbers trustworthy:

1. Define rules (what “correct” means)  
2. Automate checks  
3. Run them at the right time (after ETL, before release)  
4. Assign owners for breaks  
5. Prevent repeats (fix upstream contracts, add monitoring)

### Analogy

Restaurant hygiene plan:
- checklist
- daily inspections
- severity (hair in food = close kitchen)
- training so issues don’t return

---

## Personas (test users that represent real roles)

Examples:
- Independent advisor
- Trust officer
- Client portal user
- Back-office fee operations

UAT with the wrong persona misses permission bugs.

---

## 90-day plan in layman words (great interview answer)

**First 30 days:** Learn current tests, pipelines, biggest money risks, meet business owners. Make a heat map.

**Days 31–60:** Set standards; put smoke tests on PR gate; start nightly position/cash recon.

**Days 61–90:** Agree UAT workflow matrix with business; pilot AI with guardrails; show leadership a quality trend report.

---

## Partnering with business leaders (tone)

Don’t say: “Please write Selenium scripts.”  
Do say: “Please confirm these real outcomes and exceptions.”

Example ask:
> “If an advisor funds an IRA then buys a fund, what must be true on the same day vs next day?”

You translate that into automation + UAT scripts.

---

## Interview answer in layman words

> “UAT should follow real wealth workflows, not random screens. Automation handles repetitive regression and data reconciliation. Business UAT focuses on judgment and new risk. I define entry/exit criteria, evidence, and sign-off so releases are confidence-based, not hope-based.”
