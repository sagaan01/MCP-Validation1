# 4. SQL, Data Validation & ETL (Layman terms)

## Why this topic is core for this job

Wealth platforms live or die on **correct numbers**:
- balances
- positions (what you own)
- fees
- transactions
- statements

A pretty UI with wrong money is still a failure.

---

## What is SQL?

**SQL** is the language used to ask questions to a database.

### Analogy

A database is a giant set of Excel-like tables.  
SQL is how you ask:

> “Show me all accounts where cash in System A doesn’t match cash in System B.”

### Tiny example (idea, not syntax focus)

```text
Find rows where portfolio cash ≠ ledger cash
```

If that list is not empty, you found a data problem.

---

## What is data validation?

**Data validation** = checking that data is complete, correct, and consistent.

### The 4 big questions (easy to remember)

| Question | Plain meaning | Example |
|----------|---------------|---------|
| **Completeness** | Is anything missing? | 1,000 trades in file, only 995 in database |
| **Accuracy** | Are values correct? | Fee calculated wrong |
| **Consistency** | Do systems agree? | UI says $10k, DB says $9,800 |
| **Timeliness** | Is it fresh enough? | Positions should be ready by 6 AM, still old at 8 AM |

Also common:
- **Uniqueness** (no duplicate trade IDs)
- **Validity** (status must be OPEN/CLOSED, not “BANANA”)

---

## What is ETL?

**ETL** = Extract, Transform, Load.

In plain English:

1. **Extract** — pull data from a source (file, system, database)  
2. **Transform** — clean/convert it (map codes, calculate fields, format dates)  
3. **Load** — put it into the target system (warehouse, reporting DB)

### Everyday analogy

Laundry:
1. Collect dirty clothes (Extract)  
2. Wash/dry/sort (Transform)  
3. Put into drawers (Load)  

If a sock disappears between basket and drawer, that’s an ETL bug.

---

## What is reconciliation? (recon)

**Reconciliation** means comparing two sources and finding differences (“breaks”).

### Analogy

Balancing your checkbook:
- Bank says $2,000
- Your notebook says $1,950
- Find the missing $50 transaction

### Wealth example

Custody system says:
- ACC-100 owns 10 AAPL

Portfolio warehouse says:
- ACC-100 owns 8 AAPL

Difference = **break**. Investigate.

---

## Simple position reconciliation example

**Source (custody):**

| Account | Symbol | Qty |
|---------|--------|-----|
| ACC-1 | AAPL | 10 |
| ACC-1 | MSFT | 5 |

**Target (reporting DB):**

| Account | Symbol | Qty |
|---------|--------|-----|
| ACC-1 | AAPL | 10 |
| ACC-1 | MSFT | 4 |

**Break:** MSFT quantity off by 1.

A data test fails and lists that break clearly.

---

## Fee validation in plain English

Suppose advisory fee rule is:

> Monthly fee = average AUM × annual rate / 12

Example:
- Average AUM = $1,200,000  
- Annual rate = 1% (0.01)  
- Expected monthly fee = 1,200,000 × 0.01 / 12 = **$1,000**

If invoice shows **$1,150**, test fails.

### Important layman point

Testers don’t invent fee math.  
They get rules from business/BA docs, then automate the check.

---

## File-based integrations (CSV / JSON / XML)

Systems often exchange files overnight.

### Example morning checklist

1. Did `trades_20260729.csv` arrive?  
2. Is it empty? (bad)  
3. Are required columns present? (`trade_id`, `account_id`, `quantity`)  
4. Did every row load, except known rejects?  
5. Do reject rows have clear error reasons?

---

## What is a data quality framework?

Same idea as a UI framework, but for data checks:

- reusable SQL templates  
- severity levels (blocker vs warning)  
- scheduled runs after ETL  
- clear reports: which rule failed, sample bad keys, who owns it  

### Analogy

A factory quality station that measures every batch — not one person randomly tasting soup.

---

## Severity (how bad is the break?)

| Severity | Example | Action |
|----------|---------|--------|
| Blocker | Cash imbalance across many accounts | Stop release |
| High | Fee wrong for many households | Fix before prod |
| Medium | Optional nickname missing often | Ticket + trend |
| Low | Extra spaces in a non-critical field | Backlog |

---

## Floating point warning (plain English)

Computers can be weird with decimals:

```text
0.1 + 0.2 = 0.30000000000000004
```

For money, teams use precise decimal types or “cents” integers, and agree tolerances like **$0.01**.

Never casually “round until it looks fine” without a finance rule.

---

## Interview answer in layman words

> “I treat data quality like a product. After ETL runs, automated checks compare source vs target for positions, cash, and fees. Breaks are severity-rated and can block release. UI tests confirm the screen, but the source of truth for money is still validated in data.”
