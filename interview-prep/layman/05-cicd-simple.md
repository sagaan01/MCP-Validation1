# 5. Azure DevOps, CI/CD & Quality Gates (Layman terms)

## What is Azure DevOps?

**Azure DevOps** is Microsoft’s platform teams use to:
- store code
- track work items (stories/bugs)
- run automated pipelines
- manage releases/tests

Think of it as a **project control room + assembly line**.

---

## What is CI/CD?

### CI — Continuous Integration

Every time someone proposes a code change, computers automatically:
- build the software
- run fast tests
- report pass/fail

### CD — Continuous Delivery/Deployment

After checks pass, software can be automatically (or semi-automatically) moved to QA/UAT/Production.

### Everyday analogy

Car factory:
- **CI** = every part is checked as soon as it’s made  
- **CD** = approved cars move to the next station / shipping lot  

Without CI/CD, people manually copy files around and hope nothing broke.

---

## What is a pipeline?

A **pipeline** is a scripted recipe of steps:

```text
1) Install tools
2) Build app
3) Run unit tests
4) Run Playwright smoke tests
5) Publish results
6) Deploy to QA (if green)
```

### Analogy

A cooking checklist that a robot follows the same way every time.

---

## What is a quality gate?

A **quality gate** is a checkpoint that can **stop** the release if quality is not good enough.

### Analogy

Airport security.
- If bag check fails, you don’t board.
- A report that says “bag maybe suspicious” but still lets you board is **not** a gate.

### Examples of gates

| Gate | Rule example |
|------|----------------|
| PR gate | Smoke tests must pass before merge |
| Release gate | No open Severity-1 bugs |
| Data gate | Overnight position recon has zero blocker breaks |
| Approval gate | Business UAT sign-off required for production |

---

## PR / merge in plain English

**PR (Pull Request)** = “Please review and accept my code change.”

Good practice:
- automated checks run on the PR
- if smoke tests fail, merge is blocked

This prevents broken code from entering the main branch.

---

## Stages you’ll hear in interviews

```text
Developer changes code
        ↓
PR pipeline (fast checks)
        ↓
Merge to main
        ↓
Deploy to DEV/QA
        ↓
Deeper tests + data recon
        ↓
UAT / approvals
        ↓
Production
```

---

## Smoke vs regression vs nightly (simple)

| Suite | Meaning | When |
|-------|---------|------|
| **Smoke** | Small “is it basically alive?” set | Every PR |
| **Regression** | Broader “did old stuff break?” | Daily / pre-release |
| **Nightly data** | Heavy money recon after batch jobs | Overnight schedule |

---

## Why pipelines matter for Principal SDET

You’re not only writing tests. You’re deciding:
- which tests block merges
- which tests run nightly
- how results are published
- how secrets are handled
- what “good enough to release” means

That’s leadership through engineering.

---

## Secrets (passwords/tokens)

Pipelines need passwords and API tokens.

**Bad:** store them in code.  
**Good:** secret variables / Azure Key Vault.

### Analogy

Hotel keycards stored in a safe, not taped to the door.

---

## Flaky tests in CI (plain English)

If the gate fails randomly, teams lose trust and start bypassing checks.

Principal approach:
1. Measure flake rate  
2. Fix top offenders  
3. Quarantine with owners and deadlines  
4. Keep true P0 money/security checks blocking  

---

## Traceability (audit-friendly explanation)

**Traceability** means you can answer:

> “For requirement X, which tests ran, in which build, with what result, and who signed off?”

Important in financial/regulated environments.

### Simple chain

```text
Business requirement
   → test cases / automated tests
      → pipeline run evidence
         → release approval
```

---

## Interview answer in layman words

> “I put fast Playwright and API smoke tests on every pull request as a quality gate. Heavier data reconciliation runs after nightly ETL. Releases can’t go out with blocker data breaks or open critical defects. Azure DevOps is the system that runs and records all of that.”
