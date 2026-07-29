# 7. Wealth Management Domain (Layman terms)

## What is wealth management?

**Wealth management** is helping people/families/institutions invest and manage money over time.

Includes things like:
- investment accounts
- retirement accounts (IRA)
- trusts
- advisory relationships (an advisor manages/invests for you)
- reporting on performance and fees
- statements and tax-related outputs

### Everyday analogy

If a regular banking app is “checking account + debit card,”  
wealth platforms are closer to “my investments, advisor, performance, fees, and official reports.”

---

## Key building blocks (memorize this map)

```text
Client / Household
   └── Accounts
         ├── Cash / balances
         ├── Positions (holdings like AAPL, funds, bonds)
         ├── Transactions (buys, sells, fees, dividends, deposits)
         ├── Performance (how investments did over time)
         ├── Fees / billing
         └── Statements / reports
```

---

## What is an account lifecycle?

Lifecycle = stages from birth to close.

### Simple stages

1. **Onboarding / KYC** — prove identity, collect documents, compliance checks  
2. **Account open** — account number created, legal registration set  
3. **Funding** — money/assets come in (wire, transfer, ACATS)  
4. **Servicing** — updates (address, beneficiaries, restrictions)  
5. **Investing/trading** — buy/sell, models, rebalances  
6. **Reporting** — statements, performance, tax lots  
7. **Close / transfer out** — residual cash handled, final reports  

### Tester’s view

Each stage can break.  
Your tests and UAT should mirror real business journeys, not only random screens.

---

## Positions, balances, transactions (plain English)

- **Position** = what you own (e.g., 10 shares of AAPL)  
- **Cash balance** = money available/settled (depending on rules)  
- **Transaction** = an event that changes cash and/or positions  

### Tiny story

```text
Start: $10,000 cash, 0 AAPL
Buy 10 AAPL at $100 (ignore fees for simplicity)
After settle: $9,000 cash, 10 AAPL
Market price rises to $110
Market value of AAPL = $1,100
Approximate equity ≈ cash + position market value
```

Data tests often check these relationships after batch jobs.

---

## What is a portfolio?

A **portfolio** is the collection of holdings in an account (or across accounts in a household).

Portfolio screens usually show:
- total market value
- holdings list
- gains/losses
- allocation (stocks vs bonds, etc.)

---

## Advisory vs brokerage vs trust (simple)

| Type | Plain meaning |
|------|---------------|
| **Brokerage** | Investment account; client/advisor can trade |
| **Advisory** | Advisor manages according to mandate/IPS; fees often on AUM |
| **Trust** | Legal arrangement with trustee/beneficiaries; special rules/distributions |
| **IRA** | Retirement account with contribution/withdrawal rules |

You don’t need to be a lawyer. You need to know **permissions and workflows differ**.

---

## Fees (why testers care)

Clients pay fees such as:
- advisory AUM fees
- account fees
- trading commissions
- trust fiduciary fees

### Example

1% per year on $1,200,000 AUM ≈ $12,000/year ≈ $1,000/month (before breakpoints/proration).

Wrong fees = angry clients + compliance pain.

---

## Performance reporting (plain English)

**Performance** answers: “How did my investments do?”

Common terms:
- **TWR** (time-weighted return): useful to judge manager performance; reduces cash-flow distortion  
- **MWR/IRR** (money-weighted): reflects the investor’s personal timing of deposits/withdrawals  
- **Benchmark**: comparison index (e.g., vs S&P 500)  
- **Gross vs net**: before fees vs after fees  

### Tester approach

Use a known sample portfolio with expected results (“golden data”), then compare engine/UI/API output.

---

## ACATS / transfers (simple)

**ACATS** is a common industry process to move assets between firms.

Like transferring your investments from Old Broker to New Broker.

Tests check statuses, partial failures, residuals, and final positions.

---

## Corporate actions (simple)

Company events that change holdings:
- stock split (1 share → 2 shares, price roughly halves)
- dividend (cash or stock)
- merger

Overnight batch can change positions. Data recon must catch mistakes.

---

## Client reporting / statements

Official PDFs/reports clients rely on.

Checks include:
- correct name/registration
- correct period
- complete positions/transactions
- disclosures present
- generation job succeeded

---

## Why domain knowledge helps interviews

When you say:

> “I’d validate onboarding through funding, then trade-to-position settlement, then fee invoice accuracy, then statement completeness — with UI for journeys and SQL recon for money truth.”

…you sound like someone who understands **their business**, not only buttons.
