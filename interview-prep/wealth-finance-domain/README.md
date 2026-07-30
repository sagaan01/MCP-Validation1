# Wealth Management & Financial Domain Pack

A **standalone** guide for the Principal SDET interview: wealth/finance terms, basics → advanced Q&A, simple stories, and where testing fits.

---

## How to use

1. Skim the **glossary** so terms stop sounding foreign.
2. Read the **stories** — they connect concepts in layman language.
3. Drill **Q&A** from basic → advanced.
4. Use the **testing map** to answer “How would you test this?” in interviews.

---

## Contents

| # | File | What it covers |
|---|------|----------------|
| 1 | [01-glossary-all-terms.md](./01-glossary-all-terms.md) | Wealth & financial terms A→Z (plain English) |
| 2 | [02-basics-qa.md](./02-basics-qa.md) | Beginner Q&A with examples |
| 3 | [03-intermediate-qa.md](./03-intermediate-qa.md) | Mid-level domain Q&A |
| 4 | [04-advanced-qa.md](./04-advanced-qa.md) | Advanced / Principal-level Q&A |
| 5 | [05-layman-stories.md](./05-layman-stories.md) | Simple stories weaving many concepts |
| 6 | [06-testing-involvement-map.md](./06-testing-involvement-map.md) | Testing role in every domain area |
| 7 | [07-quick-revision.md](./07-quick-revision.md) | One-page revision before interview |

---

## Domain map (keep this in your head)

```text
Client / Household
 └── Accounts (Brokerage, IRA, Trust, Advisory, Custodial…)
       ├── Cash & balances
       ├── Positions & tax lots
       ├── Transactions (trades, contributions, fees, dividends…)
       ├── Orders / trading / settlement
       ├── Portfolio & performance
       ├── Fees & billing
       ├── Transfers (ACATS, wires, journals)
       ├── Corporate actions
       ├── Statements / tax / client reporting
       └── Permissions, KYC/AML, audit
```

---

## One-line role of an SDET in this domain

> Prove that **money, holdings, fees, and reports stay correct** as clients onboard, fund, trade, transfer, and receive statements — across UI, API, and data pipelines.
