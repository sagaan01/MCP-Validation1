# 2. Basics Q&A (Wealth & Finance)

Beginner questions with plain answers and examples. Practice saying these out loud.

---

## Q1. What is wealth management in one minute?

**Answer:**  
Helping clients grow and protect money through accounts, investments, advice, reporting, and ongoing servicing — not just a checking account.

**Example:**  
A family has a joint brokerage, two IRAs, and a trust. An advisor manages allocation, charges an advisory fee, and sends quarterly statements/performance.

**Testing angle:**  
Validate journeys across onboarding → funding → investing → fees → statements, and reconcile money data.

---

## Q2. What is an account vs a household?

**Answer:**  
An **account** holds assets. A **household** groups related accounts for advice/reporting/fees.

**Example:**  
Household “Patel Family” includes:
- Joint taxable ACC-1  
- Pat IRA ACC-2  
- Sam IRA ACC-3  

**Testing:**  
Household dashboard totals = sum of accounts; no leakage to another household.

---

## Q3. What are cash, position, and market value?

**Answer:**  
- **Cash:** money in the account  
- **Position:** holdings (e.g., 10 AAPL)  
- **Market value:** holdings × price  

**Example:**  
Cash $5,000 + 10 AAPL × $200 = $5,000 + $2,000 → about $7,000 invested wealth (simplified).

**Testing:**  
UI MV = API MV = valuation table for same as-of date.

---

## Q4. What is a transaction?

**Answer:**  
An event that changes cash and/or positions.

**Examples:**  
Buy, sell, deposit, withdrawal, fee, dividend, transfer in/out.

**Testing:**  
After each transaction type, assert expected cash/position deltas.

---

## Q5. What happens when you buy a stock? (simple)

**Answer:**  
1. Place order  
2. Order fills (trade executes)  
3. Position quantity increases  
4. Cash decreases (price × qty + fees, simplified)  
5. After settlement, records finalize  

**Example:**  
Buy 10 AAPL @ $100 → +10 AAPL, −$1,000 cash (ignore fees).

**Testing:**  
API order states; wait for position; SQL cash/position recon; UI confirmation.

---

## Q6. Trade date vs settlement date?

**Answer:**  
**Trade date:** deal happened.  
**Settlement date:** cash/securities officially finish exchanging.

**Example:**  
Buy Monday (trade date); settles Tuesday (T+1 example). Available cash rules may differ before settlement.

**Testing:**  
Don’t assert “settled cash” too early; use correct date views.

---

## Q7. What is a portfolio?

**Answer:**  
The collection of positions (and cash) in an account or across a household.

**Example:**  
Portfolio shows AAPL, MSFT, bond fund, and cash percentage.

**Testing:**  
Completeness of holdings list; totals match sum of lines.

---

## Q8. Brokerage vs advisory vs IRA vs trust (basics)?

| Type | Simple meaning |
|------|----------------|
| Brokerage | Invest/trade account |
| Advisory | Advisor-managed relationship; often AUM fees |
| IRA | Retirement account with special tax rules |
| Trust | Trustee manages for beneficiaries under legal terms |

**Testing:**  
Different onboarding docs, permissions, fee logic, distribution rules.

---

## Q9. What is AUM and why fees use it?

**Answer:**  
AUM = value of assets managed. Many advisory fees = rate × AUM (with schedules).

**Example:**  
$1,000,000 AUM × 1% / year = $10,000/year ≈ $833.33/month (before proration/breakpoints).

**Testing:**  
Fee engine vs expected formula; invoice line items; statement display.

---

## Q10. What is performance reporting (basic)?

**Answer:**  
Shows how investments did over a period (YTD, QTD, since inception), sometimes vs a benchmark.

**Example:**  
“YTD return +6.2% vs benchmark +5.0%.”

**Testing:**  
Golden sample portfolio with known flows → expected return; UI matches API.

---

## Q11. What is KYC / onboarding?

**Answer:**  
Collect and verify client identity/profile before activating services.

**Example:**  
ID docs uploaded → checks pass → account status becomes Open.

**Testing:**  
Incomplete application cannot fund/trade; status transitions audited.

---

## Q12. What is a statement?

**Answer:**  
Official periodic report of holdings, transactions, and often performance/fees.

**Example:**  
July statement PDF for ACC-100.

**Testing:**  
Job produced file for all expected accounts; period boundaries correct; key sections present.

---

## Q13. What is custody?

**Answer:**  
Where assets are safekept; custody extracts often act as source of truth for holdings.

**Example:**  
Nightly custody file says ACC-100 has 10 AAPL.

**Testing:**  
Reconcile custody → portfolio DB → client UI.

---

## Q14. What is a dividend (basic)?

**Answer:**  
Company pays shareholders cash (or stock).

**Example:**  
Own 10 shares; $1 dividend/share → +$10 cash.

**Testing:**  
Only accounts holding shares on entitlement date receive it.

---

## Q15. What should an SDET memorize as the basic money identity?

**Answer:**  
```text
Transactions → change positions & cash
Positions × prices ≈ market value
Cash + MV ≈ account value (simplified)
```

If these disagree across systems, it’s a defect worth blocking releases.
