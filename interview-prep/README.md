# Principal SDET Interview Preparation Guide

**Role:** Principal SDET — Financial Client (Hamilton, NJ)  
**Focus:** Playwright architecture, data quality, Azure DevOps, AI-assisted testing, Wealth Management  
**Format:** In-person interview

---

## Standalone wealth & finance domain pack

Deep domain prep (separate from general SDET topics):

**[wealth-finance-domain/README.md](./wealth-finance-domain/README.md)**

| File | Contents |
|------|----------|
| Glossary | Wealth & financial terms in plain English |
| Basics → Advanced Q&A | Progressive interview Q&A with examples |
| Layman stories | Stories weaving concepts + testing involvement |
| Testing map | UI/API/Data testing for every wealth area |
| Quick revision | Day-of refresh |

---

## ETL · SQL · Python interview pack

Scenario-based prep for data validation interviews:

**[etl-sql-python/README.md](./etl-sql-python/README.md)**

| File | Contents |
|------|----------|
| ETL testing concepts | Stages, DQ dimensions, scenario Q&A |
| SQL scenarios | Recon, duplicates, fees, window functions |
| Python scenarios | pandas/pytest/Decimal file & DB validation |
| End-to-end cases | Combined whiteboard/mock interview cases |
| Quick revision | Day-of cheat sheet |

---

## How to use this guide

### Step A — Understand in layman terms first (recommended)

Start here: **[layman/README.md](./layman/README.md)**

Every JD topic is explained in plain English with everyday analogies and self-explanatory examples (no jargon left unexplained).

### Step B — Interview Q&A + code samples

1. Read each topic’s **Core concepts**.
2. Practice answering out loud using the **STAR / architecture narrative** style answers.
3. Rehearse the **sample code / SQL / pipeline** snippets so you can whiteboard them.
4. End every technical answer with **impact** (flakes reduced, pipeline speed, risk prevented, mentorship outcome).

---

## Layman guides (plain English)

| Topic | Layman file |
|-------|-------------|
| What is SDET / Principal SDET? | [layman/00-what-is-sdet.md](./layman/00-what-is-sdet.md) |
| Playwright & frameworks | [layman/01-playwright-simple.md](./layman/01-playwright-simple.md) |
| TypeScript / JavaScript | [layman/02-typescript-simple.md](./layman/02-typescript-simple.md) |
| API & backend | [layman/03-api-simple.md](./layman/03-api-simple.md) |
| SQL, data, ETL | [layman/04-data-etl-simple.md](./layman/04-data-etl-simple.md) |
| Azure DevOps / CI/CD / gates | [layman/05-cicd-simple.md](./layman/05-cicd-simple.md) |
| AI-assisted testing | [layman/06-ai-simple.md](./layman/06-ai-simple.md) |
| Wealth management | [layman/07-wealth-simple.md](./layman/07-wealth-simple.md) |
| UAT & data quality strategy | [layman/08-uat-strategy-simple.md](./layman/08-uat-strategy-simple.md) |
| Leadership & mentoring | [layman/09-leadership-simple.md](./layman/09-leadership-simple.md) |
| Mobile, Java, cross-stack | [layman/10-mobile-java-simple.md](./layman/10-mobile-java-simple.md) |
| Big picture + glossary | [layman/11-big-picture.md](./layman/11-big-picture.md) |
| Analogies cheat sheet | [layman/12-analogies-cheatsheet.md](./layman/12-analogies-cheatsheet.md) |

---

## Interview Q&A topic index

| # | Topic | File |
|---|--------|------|
| 1 | Playwright Architecture & Framework Design | [01-playwright-architecture.md](./01-playwright-architecture.md) |
| 2 | TypeScript / JavaScript for SDETs | [02-typescript-javascript.md](./02-typescript-javascript.md) |
| 3 | API & Backend Automation | [03-api-backend-testing.md](./03-api-backend-testing.md) |
| 4 | SQL, Data Validation & ETL | [04-sql-data-etl.md](./04-sql-data-etl.md) |
| 5 | Azure DevOps, CI/CD & Quality Gates | [05-azure-devops-cicd.md](./05-azure-devops-cicd.md) |
| 6 | AI-Driven Quality Engineering | [06-ai-quality-engineering.md](./06-ai-quality-engineering.md) |
| 7 | Wealth Management Domain | [07-wealth-management-domain.md](./07-wealth-management-domain.md) |
| 8 | UAT & Data Quality Strategy | [08-uat-data-quality-strategy.md](./08-uat-data-quality-strategy.md) |
| 9 | Leadership, Mentorship & Principal Influence | [09-leadership-mentorship.md](./09-leadership-mentorship.md) |
| 10 | Mobile, Java & Cross-Stack Automation | [10-mobile-java-crossstack.md](./10-mobile-java-crossstack.md) |
| 11 | Behavioral & Scenario Deep-Dives | [11-behavioral-scenarios.md](./11-behavioral-scenarios.md) |
| 12 | Cheat Sheet — 60-Second Answers | [12-cheat-sheet.md](./12-cheat-sheet.md) |
| 13 | Quick Drill Cards | [13-drill-cards.md](./13-drill-cards.md) |

---

## Suggested study order

1. **Layman guides first** (`layman/`) so every concept is clear in plain English
2. Pitch + cheat sheet (12, 13)
3. Playwright architecture (1) — primary focus for this role
4. SQL / ETL / data (4) — core expectation
5. Azure DevOps gates (5)
6. Wealth domain + UAT strategy (7, 8)
7. API + TypeScript (3, 2)
8. AI governance (6)
9. Leadership + behavioral scenarios (9, 11)
10. Mobile / Java depth if panel includes it (10)

---

## Interview narrative (your opening pitch — ~90 seconds)

> “I’m a Principal SDET who builds quality platforms, not just test suites. Over the last decade I’ve owned UI, API, and data-layer automation for complex financial systems. My deepest recent work is Playwright + TypeScript frameworks designed from scratch—fixture-driven, contract-aware, and wired into Azure DevOps with quality gates. I treat data quality as a first-class product: ETL reconciliation, position/balance/fee validation, and UAT strategies mapped to account lifecycle and portfolio workflows. I mentor senior SDETs, set framework standards, and I’m actively embedding AI-assisted testing with guardrails—Copilot for acceleration, not unchecked generation. I’m looking for a role where I can modernize QE across wealth platforms and raise the org’s automation maturity.”

Memorize and customize this with your real metrics.
