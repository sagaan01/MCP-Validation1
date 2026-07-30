# 9. Leadership, Mentorship & Principal Influence (Layman terms)

## What leadership means for a Principal SDET

You may not manage everyone’s HR career, but you still lead by:
- setting standards
- making technical decisions
- mentoring
- influencing priorities
- communicating risk clearly

### Analogy

You’re the head chef of quality:
- you cook (hands-on)
- you design the kitchen process
- you train cooks
- you stop bad dishes from leaving the pass

---

## Mentorship in plain English

**Mentoring** = helping others get better faster.

Examples:
- pair-program on a difficult Playwright test
- review PRs kindly but firmly
- teach SQL recon patterns
- create a skills ladder (Junior → Mid → Senior)

### Mini story

Junior writes tests with `wait 5 seconds` everywhere.  
You teach “wait for the positions table,” do 2 pairing sessions, and give a checklist.  
Two weeks later their flake rate drops.

That’s mentorship with impact.

---

## Influence without “being the boss”

Often you need architects/developers to change design for testability.

### What “testability” means

Build software so it can be checked easily:
- stable test IDs on key buttons
- APIs to create test accounts
- clear job status (“settlement complete”)
- ability to delete/reset test data

### How to influence

1. Show pain with numbers (“flake 18%, release delayed twice”)  
2. Offer options, not complaints  
3. Pilot with one team  
4. Share before/after results  
5. Write a short standard everyone can follow  

---

## Setting standards (examples)

- “No hard sleeps in UI tests”  
- “Money assertions need explicit tolerance policy”  
- “Every PR runs smoke tests”  
- “AI-generated fee logic requires human review”  

Standards prevent 10 people inventing 10 styles.

---

## Stakeholder communication (say the right thing to the right person)

| Audience | They care about | How you speak |
|----------|-----------------|---------------|
| Executives | Risk, cost, release confidence | Trends + business impact |
| Product | Feature readiness, UAT needs | Workflow coverage |
| Developers | Clear failures, testability | Concrete engineering asks |
| Business ops | Real-life correctness | Scenarios + exceptions |

### Example exec sentence

> “Nightly recon now catches position mismatches in under an hour instead of after client complaints. Remaining risk is FX timing; mitigation is in progress.”

---

## Conflict example (classic interview)

Developer: “Automation is QA’s problem.”

Your layman response:
> “We share ownership. Developers own fast unit/contract checks. QE owns cross-system journeys and data reconciliation. Definition of Done should include the agreed test layer, because production risk is shared.”

Calm, clear, business-focused.

---

## Prioritization when everything is “urgent”

Ask:
- Can this lose money?
- Can this leak another client’s data?
- How often does it happen?
- Would we detect it quickly otherwise?

First priority: money movement + permissions + books/records accuracy.

---

## What interviewers listen for

Not “I am a nice mentor.”  
They want:

> problem → action you took → people grew / risk dropped / standard stuck

Bring 2 real stories with numbers if you have them.
