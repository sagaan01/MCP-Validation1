# 3. Intermediate Q&A (Wealth & Finance)

Questions that show you understand real platform workflows — not just definitions.

---

## Q1. Explain account lifecycle end-to-end.

**Answer:**  
Prospect → KYC/CIP → account open → funding → servicing → trading/investing → fees/reporting → close/transfer-out.

**Example story beat:**  
Client applies for Trust → documents approved → account number created → wire $250k → buy model portfolio → monthly fee → quarterly statement → years later ACATS out.

**Testing:**  
Hybrid journey: API seeds steps; UI covers critical user path; data checks confirm account master + cash + positions.

---

## Q2. Available cash vs settled cash vs buying power?

**Answer:**  
Different balances answer different questions:
- Settled cash: fully settled funds  
- Available to trade/withdraw: may include rules/holds  
- Buying power: may include margin (if enabled)

**Example:**  
Just sold stock; proceeds may not be withdrawable instantly depending on settlement/product rules.

**Testing:**  
Assert the **named** balance field; never compare mismatched balance types across UI/API.

---

## Q3. How do tax lots affect a sell?

**Answer:**  
Selling uses one or more lots; method decides which cost basis is used → realized gain/loss changes.

**Example:**  
Lots: 5@90 and 5@110. Sell 5.  
- FIFO might use 5@90 → larger gain  
- SpecID might pick 5@110 → smaller gain  

**Testing:**  
Create multi-lot position; sell; verify chosen method and realized gain in API/DB/tax extract.

---

## Q4. What is ACATS and what can go wrong?

**Answer:**  
Transfer of assets between firms. Failures: rejects, partials, residual cash, snags on unsupported assets, timing gaps.

**Example:**  
Transfer 10 AAPL + $2,000 cash; AAPL moves, cash residual delayed.

**Testing:**  
State machine (requested → in progress → complete/fail); final recon at both sides if accessible; client notifications.

---

## Q5. Corporate action: 2-for-1 split — what do you validate?

**Answer:**  
Quantity roughly doubles; price roughly halves; market value approximately continuous; cost basis per share adjusts; no “random” cash created.

**Example:**  
10 shares @ $200 → 20 shares @ ~$100.

**Testing:**  
Pre/post snapshots; cost basis totals conserved (policy-dependent); statements explain action.

---

## Q6. Advisory fee with breakpoints — how do you test?

**Answer:**  
Build table-driven cases from fee schedule: AUM bands, household aggregation, proration for mid-period open/close, waivers.

**Example:**  
Schedule: 1.0% to $1M; 0.8% above.  
AUM $1.5M → blended/expected per published rule (don’t invent).

**Testing:**  
Billing job → invoice lines; SQL expected vs actual; UI fee disclosure matches.

---

## Q7. TWR vs MWR — when each matters?

**Answer:**  
- **TWR:** compare manager performance; reduces impact of client deposit timing  
- **MWR/IRR:** client’s personal experience including their cash-flow timing  

**Example:**  
Client dumps cash right before a rally — MWR may look better than TWR.

**Testing:**  
Golden portfolio fixtures for both metrics; assert API and report labels aren’t swapped.

---

## Q8. How do you test rebalancing?

**Answer:**  
Given model targets and current holdings, drift above threshold should propose trades that move toward targets without violating constraints (cash buffer, wash-sale warnings, min trade size, IPS limits).

**Example:**  
Target 60/40; equity drifted to 70% → sell equities/buy bonds suggestions.

**Testing:**  
Deterministic portfolio seed; assert proposed orders; optionally execute in lower env and recon.

---

## Q9. Trust distribution testing focus?

**Answer:**  
Who is allowed; principal vs income source; beneficiary details; audit; resulting cash/position; statement wording.

**Example:**  
Successor trustee tries unauthorized distribution → rejected.

**Testing:**  
Positive path + authz negative path + ledger posting.

---

## Q10. How do overnight batches change the test strategy?

**Answer:**  
Many wealth truths arrive via ETL/batch (prices, custody, corporate actions, fees, statements). UI tests alone are insufficient.

**Example:**  
Trade today appears in warehouse after nightly load.

**Testing:**  
Trigger or wait for job; then SQL recon; schedule Azure DevOps nightly suite after ETL window.

---

## Q11. Multi-currency account risks?

**Answer:**  
FX rate as-of, conversion method, which currency is base, rounding.

**Example:**  
CAD stock in USD account: MV depends on FX rate date.

**Testing:**  
Fix FX rate in test data; assert converted MV; check statement currency labels.

---

## Q12. Permissions matrix you should always mention

**Answer:**  
Advisor, associate, client portal user, trust officer, ops — each sees/does different things.

**Example:**  
Client can view but not change IPS; advisor can rebalance discretionary account.

**Testing:**  
Role-based UI/API tests; especially cross-book access denied.

---

## Q13. What is “books and records” risk in testing language?

**Answer:**  
If official positions/cash/transactions are wrong or unprovable, firm has serious operational/regulatory exposure.

**Testing:**  
Recon gates, audit logs for privileged changes, release evidence packs.

---

## Q14. Statement vs performance screen mismatch — how do you triage?

**Answer:**  
Compare as-of dates, gross/net flags, included accounts (household vs single), pending transactions, accrued interest conventions.

**Example:**  
Performance includes accrued interest; statement MV excludes it → apparent break.

**Testing:**  
Add explicit convention checks; align expected definitions with product docs.

---

## Q15. Intermediate interview closer

**Answer pattern:**  
“I’d map the business workflow, identify money-impacting steps, automate API+data for truth, keep UI for journey/permissions, and put blocker recon on the release gate.”
