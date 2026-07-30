# 5. Simple Stories (Layman Terms) — All Concepts + Testing

These stories are designed so you can **see** wealth concepts working together.  
After each story: what an SDET / Principal SDET would test.

---

## Story 1 — “The Patel Family Opens Money Doors”

### Story

The Patel family wants help managing money.

1. They meet **Advisor Priya**.  
2. They complete **KYC/CIP**: IDs, address, basic profile.  
3. Priya opens a **household** called “Patel Family.”  
4. Under it she opens:
   - a joint **brokerage account**
   - a Traditional **IRA** for Pat  
5. They **wire** $100,000 into brokerage (funding).  
6. Priya buys an **ETF** and some cash remains.  
7. The account now has **cash + positions**.  
8. Prices update; **market value** changes.  
9. Month-end, an **advisory fee** based on **AUM** is charged.  
10. They get a **statement** showing transactions, holdings, and fee.

### Concepts used
Household, advisor, KYC/CIP, brokerage, IRA, wire/funding, ETF, cash, position, market value, AUM, fee, statement.

### Testing involvement
| Step | What to test |
|------|----------------|
| KYC | Required docs block incomplete open (UI + status API) |
| Household/account create | Data created correctly; permissions for Priya only |
| Wire | Cash balance increases once; duplicate wire blocked |
| Buy ETF | Order fill → position qty; cash down |
| MV | UI/API/DB match for as-of price |
| Fee | Expected fee math vs invoice |
| Statement | PDF/job completeness for period |

### Layman one-liner
> “We check the family can open correctly, money goes in once, investments appear, fees are fair-math, and the monthly report tells the truth.”

---

## Story 2 — “Buy Now, Settle Later”

### Story

Pat clicks **Buy 10 AAPL** at $200.

- **Trade date:** today — order is filled.  
- Portfolio may show 10 AAPL quickly.  
- **Settlement** happens on the settlement cycle (e.g., T+1).  
- **Settled cash** and withdrawable cash rules may differ until settlement.  
- A **transaction** exists: buy.  
- If prices rise to $210, **unrealized gain** appears.  
- If Pat sells later, gain may become **realized**, depending on **tax lots**.

### Concepts used
Order, fill, trade date, settlement, transaction, position, cash types, unrealized/realized gain, tax lots.

### Testing involvement
- Don’t assert settled cash immediately after trade.  
- Poll until position appears (eventual consistency).  
- Compare trade qty and cash delta.  
- Multi-lot sell: verify lot method.  
- UI labels: “pending settle” vs “settled.”

### Layman one-liner
> “Buying is like checkout now and bank finalization later — tests must respect both clocks.”

---

## Story 3 — “The Night the Shares Multiplied” (Corporate Action)

### Story

Pat owns 10 shares of SplitCo at about $200 each (~$2,000 value).

Overnight, SplitCo announces a **2-for-1 stock split**.

In the morning:
- Pat owns **20 shares**
- Price is about **$100**
- Total value still ~$2,000
- **Cost basis per share** adjusts
- Statement shows a **corporate action** explanation  
No magic cash should appear out of nowhere.

### Concepts used
Corporate action, split, position quantity, price, market value continuity, cost basis, statement disclosure.

### Testing involvement
- Snapshot positions before/after batch.  
- Assert qty×price continuity within tolerance.  
- Assert cost basis total policy.  
- Ensure ETL loaded corporate action file (completeness).  
- UI explanation present.

### Layman one-liner
> “A split is pizza cut into more slices — more slices, smaller slices, same pizza. Tests prove nobody stole or baked an extra pizza.”

---

## Story 4 — “Fee Day at the Advisory Firm”

### Story

Advisor Priya manages the Patel household.

Fee schedule:
- 1.0% per year on first $1M **AUM**
- 0.8% above $1M  

Month average AUM = $1,500,000.

Ops runs **billing**:
- Engine calculates expected fee  
- **Invoice** posts  
- **Fee transaction** reduces cash  
- Client **statement** shows management fee  
If household grouping is wrong (IRA excluded by mistake), fee is wrong.

### Concepts used
AUM, fee schedule, breakpoints, household aggregation, billing job, invoice, fee transaction, statement.

### Testing involvement
- Table-driven fee cases (including breakpoints).  
- SQL expected vs actual invoice lines.  
- Confirm which accounts are billable.  
- Proration if account opened mid-month.  
- Release gate: blocker fee breaks.

### Layman one-liner
> “Fees are rent charged on the size of the money pile — tests recalculate rent with the lease rules and compare to the bill.”

---

## Story 5 — “Moving to a New Firm” (ACATS)

### Story

Pat leaves Firm A for Firm B.

They start an **ACATS** transfer:
- Request submitted  
- Assets validated  
- **Positions** and cash move  
- Some mutual funds might **snag**/delay  
- Partial transfer possible  
- At the end, Firm B must show correct holdings  
- Firm A should not still report those positions as active client holdings

### Concepts used
ACATS, transfer states, positions, residual cash, partials, custody truth.

### Testing involvement
- State transitions and failure paths.  
- Final recon of expected assets.  
- Notifications/status UI.  
- No duplicate positions across firms in test books.  
- Audit trail of transfer.

### Layman one-liner
> “ACATS is moving furniture between apartments — tests check nothing is lost in the truck and both apartments aren’t claiming the same sofa.”

---

## Story 6 — “The Trust That Protects Kids”

### Story

Grandparent creates a **trust** for grandchildren.

- **Trustee** Maya can invest and distribute under rules  
- **Beneficiaries** are the kids  
- Some money is **principal** (the core)  
- Some is **income** (earnings)  
- Maya makes an allowed **distribution** to a beneficiary  
- An unauthorized user tries and is blocked  
- Trust **reporting** shows activity  

### Concepts used
Trust, trustee, successor trustee, beneficiary, principal vs income, distribution, permissions, fiduciary reporting.

### Testing involvement
- Role-based authz matrix.  
- Distribution posting source (principal/income).  
- Negative permission tests.  
- Report completeness.  
- Audit log of privileged actions.

### Layman one-liner
> “A trust is a locked box with rules and a keyholder — tests prove only the keyholder can take money out the allowed way.”

---

## Story 7 — “Did We Beat the Benchmark?” (Performance)

### Story

Over a year, Patel brokerage:
- Started at $100k  
- Added $20k contribution mid-year  
- Ended at $130k  

Questions:
- How much return did the **investments** make (**TWR** style thinking)?  
- How did Pat personally do including deposit timing (**MWR**)?  
- Versus **benchmark** S&P-like index?  
- **Gross vs net** after fees?

Different answers can all be “correct” if definitions differ — confusion creates false bugs.

### Concepts used
Performance, contribution cash flow, TWR, MWR/IRR, benchmark, gross/net, YTD/ITD.

### Testing involvement
- Golden portfolio with known expected returns.  
- Assert correct metric type on each screen.  
- Period boundaries (YTD start).  
- Fee inclusion flags.  
- UI/API consistency.

### Layman one-liner
> “Performance is a report card — but there are different report cards. Tests make sure we grade with the announced scoring system.”

---

## Story 8 — “Rebalance Tuesday”

### Story

Pat’s advisory account target model is **60% stocks / 40% bonds**.

After a stock rally, actual mix is **72/28** (**drift**).

System proposes a **rebalance**:
- Sell some stocks  
- Buy bonds  
Respect **IPS** constraint: never above 75% stocks anyway.  
If tax-aware, prefer selling specific **tax lots**.

### Concepts used
Model portfolio, allocation, drift, rebalance, IPS, tax lots, advisory discretionary trading.

### Testing involvement
- Seed drifted portfolio.  
- Assert proposals toward target.  
- Constraint adherence.  
- Lot picks if tax-aware.  
- After execution, recon weights/cash.

### Layman one-liner
> “Rebalance is tidying a closet back to the plan — tests check the tidy-up list follows the household rules.”

---

## Story 9 — “The Missing Trades Morning” (ETL / Data Quality)

### Story

Every night:
1. **Custody** sends a positions file (**extract**)  
2. Platform **transforms** codes/dates  
3. **Loads** into warehouse for reporting  

One morning, advisors see wrong totals.

Investigation:
- Source file had 10,000 rows  
- Warehouse loaded 9,970  
- 30 rows rejected due to unknown account IDs  
- **Completeness** failed  
- **Reconciliation** listed breaks  

### Concepts used
Custody, ETL, completeness, accuracy, consistency, rejects/quarantine, reconciliation, as-of date.

### Testing involvement
- Pre-ETL: file arrived, checksum, schema.  
- Post-ETL: source vs target counts + qty recon.  
- Reject reason quality.  
- Nightly Azure quality gate.  
- Severity: blocker if client-facing reports affected.

### Layman one-liner
> “ETL is laundry — tests count socks in the basket vs drawers and explain missing ones.”

---

## Story 10 — “Wrong Client, Right Button” (The Nightmare Bug)

### Story

Advisor Priya opens portfolio view. Due to a bug, she briefly sees another advisor’s client balances.

This is not a cosmetic issue. It’s **wrong-account / authz leakage** — top severity in wealth.

Even if market value math is perfect, permissions failure is a release blocker.

### Concepts used
Advisor entitlements, household isolation, authz, audit, client confidentiality.

### Testing involvement
- API negative tests: Advisor A token on Advisor B account → 403.  
- UI tests for masked/empty unauthorized access.  
- Automated security pack in PR smoke for critical endpoints.  
- Audit event recorded on denial/access.

### Layman one-liner
> “In wealth, seeing the wrong client’s money is like opening the wrong safe — tests treat that as a fire alarm.”

---

## Story 11 — Mega Story (Almost Everything Together)

### Story (“One Year With the Garcias”)

1. **Onboarding/KYC** for Garcia household.  
2. Open **brokerage + Roth IRA + trust** account.  
3. **Wire** and **ACATS** in assets.  
4. Advisor assigns **model**, places **orders**, waits for **settlement**.  
5. **Dividends** post; a **split** happens on one holding.  
6. Portfolio **drift** triggers **rebalance**.  
7. Monthly **AUM fee** with **breakpoints**.  
8. **Performance vs benchmark** reviewed (net of fees).  
9. Quarterly **statement** and tax **lot** export.  
10. Beneficiary update on IRA; trustee **distribution** from trust.  
11. Nightly **custody ETL recon** stays clean.  
12. Year later, partial **ACATS out**.

### Testing involvement (Principal view)
- Risk-based automation across the year-journey building blocks.  
- UI for critical human paths.  
- API for rules/state machines.  
- SQL recon for money truth.  
- UAT with business for trust distribution and statement judgment.  
- Quality gates on authz + recon blockers.  
- Evidence pack for release.

### Layman one-liner
> “A real wealth year is many small money moments — testing proves each moment keeps the books honest and the wrong people out.”

---

## How to use these stories in an interview

When asked “Tell me how you’d test wealth platforms,” pick **Story 1 + Story 9 + Story 10**:

1. Lifecycle happy path (Story 1)  
2. Data truth via ETL recon (Story 9)  
3. Permission nightmare prevention (Story 10)  

That trio sounds practical, domain-aware, and Principal-level.
