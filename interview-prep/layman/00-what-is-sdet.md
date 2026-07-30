# 0. What is an SDET / Principal SDET? (Layman terms)

## What is software testing?

Imagine a bank builds a new “View My Portfolio” screen.

Before real customers use it, someone must check:
- Does the button work?
- Does the balance look right?
- Does Advisor A accidentally see Advisor B’s clients?

That checking is **testing**.

---

## What is an SDET?

**SDET** = Software Development Engineer in Test.

In plain English:

> An SDET is a tester who **writes code** to test software automatically, instead of only clicking by hand every time.

### Everyday analogy

| Manual tester | SDET |
|---------------|------|
| Like a person who taste-tests every cookie by hand | Like building a machine that taste-tests 1,000 cookies overnight |

### Example

Instead of logging in and checking 50 accounts every Monday, an SDET writes a script:

1. Log in  
2. Open account  
3. Read market value  
4. Compare with the database  
5. Fail if numbers don’t match  

Then the computer runs that every night.

---

## What does “Principal” mean?

**Principal** is a senior leadership level (above senior).

In plain English:

> You’re not only writing tests. You’re deciding **how the whole company should test**, teaching others, and influencing architecture (how systems are built so they can be tested well).

### Principal SDET vs regular SDET

| Regular SDET | Principal SDET |
|--------------|----------------|
| Writes good automated tests | Designs the testing system everyone uses |
| Fixes flaky tests | Sets the policy for flaky tests |
| Tests one feature | Owns quality strategy across UI + API + data |
| Follows standards | Creates standards and mentors others |
| Uses Playwright | Builds Playwright frameworks from scratch |

---

## What this specific job wants (plain English)

The financial client wants someone who can:

1. **Build a Playwright testing system from zero** (not just use someone else’s).
2. **Check money data carefully** (balances, positions, fees, ETL).
3. **Wire tests into Azure DevOps** so bad builds get blocked.
4. **Use AI tools wisely** (faster work, not reckless shortcuts).
5. **Understand wealth management workflows** (accounts, portfolios, reports).
6. **Lead and mentor** other QA/SDET engineers.

---

## Simple story of a day in this role

1. Morning: Check overnight test results — did any money mismatches appear?  
2. Meet product/business: map a new “open trust account” flow into test scenarios.  
3. Code: improve Playwright framework so login happens once and reuses session.  
4. Pipeline: add a “quality gate” so PRs can’t merge if smoke tests fail.  
5. Mentor: review a junior’s test PR and teach better locator choices.  
6. AI: use Copilot to draft boilerplate, then manually verify fee assertions.

That’s Principal SDET work in real life.
