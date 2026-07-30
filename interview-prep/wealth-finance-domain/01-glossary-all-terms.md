# 1. Wealth & Financial Terms Glossary (Plain English)

Use this as your dictionary. Each term: **meaning → tiny example → why testers care**.

---

## A

### Account
A container that holds cash and investments for a client.  
**Example:** Brokerage account `ACC-100` holds $5,000 cash + 10 AAPL.  
**Testing:** Create/open/close; correct registration; correct permissions.

### Account registration / ownership type
Legal form of ownership (Individual, Joint, Trust, IRA, etc.).  
**Example:** Joint tenants vs Individual changes who can trade/withdraw.  
**Testing:** Rules and documents differ by registration.

### ACATS (Automated Customer Account Transfer Service)
Industry process to move assets between brokerage firms.  
**Example:** Client leaves Firm A → assets move to Firm B.  
**Testing:** Status flow, partial transfers, residuals, final positions.

### Accrued interest
Interest earned but not yet paid (often on bonds).  
**Example:** Bond MV may include or exclude accrued interest depending on convention.  
**Testing:** UI/API/DB must use the same convention.

### Advisor / Financial advisor
Professional who advises or manages client investments.  
**Example:** Advisor Pat manages 40 households.  
**Testing:** Advisor A must not see Advisor B’s book.

### Advisory account
Account under an advisory relationship (often fee based on AUM).  
**Example:** Discretionary advisory: advisor can trade within mandate.  
**Testing:** Fee calculation, mandate/IPS constraints, permissions.

### Allocation
How a portfolio is split across asset types/sectors.  
**Example:** 60% stocks / 40% bonds.  
**Testing:** Rebalance triggers when drift exceeds threshold.

### AML (Anti-Money Laundering)
Rules/processes to detect illicit money flows.  
**Example:** Large unexplained wire triggers review.  
**Testing:** Workflow statuses, holds, audit evidence (not legal advice).

### AUM (Assets Under Management)
Total value of assets being managed.  
**Example:** $1.2M AUM at 1%/year ≈ $12k annual fee before adjustments.  
**Testing:** Fee basis accuracy and as-of timing.

### As-of date
The date a balance/position/performance is calculated for.  
**Example:** “Positions as of 2026-07-29.”  
**Testing:** Wrong as-of = wrong report.

### Asset class
Category of investment (equity, fixed income, cash, alternatives…).  
**Example:** AAPL = equity; Treasury bond = fixed income.  
**Testing:** Classification feeds reporting and models.

---

## B

### Balance / cash balance
Money in the account (definitions vary: available vs settled).  
**Example:** Settled cash $9,000; unsettled $1,000.  
**Testing:** Screens and APIs must label which cash type.

### Benchmark
Reference index used to compare performance.  
**Example:** Portfolio YTD +8%, S&P 500 +10%.  
**Testing:** Correct benchmark mapping and calculation inputs.

### Beneficiary
Person/entity designated to receive assets (common in IRA/trust).  
**Example:** Spouse primary beneficiary 100%.  
**Testing:** Updates audited; rules enforced.

### Bond
Loan to issuer that pays interest and returns principal.  
**Example:** $1,000 face bond paying 4% coupon.  
**Testing:** Pricing, accrued interest, maturity, corporate actions.

### Books and records
Official records a firm must maintain accurately.  
**Example:** Positions and cash that match custody truth.  
**Testing:** Reconciliation and audit trails.

### Brokerage account
Investment account used to buy/sell securities.  
**Example:** Self-directed brokerage with online trading.  
**Testing:** Order → fill → position/cash updates.

### Buy / Sell (side)
Trade direction.  
**Example:** BUY 10 AAPL; SELL 5 MSFT.  
**Testing:** Signed quantity effects on positions/cash.

---

## C

### Cash sweep
Idle cash moved into a money-market/sweep vehicle.  
**Example:** End-of-day cash swept to interest-bearing fund.  
**Testing:** Sweep balances and statements.

### CIP (Customer Identification Program)
Identity verification during onboarding.  
**Example:** Name, DOB, address, ID document checks.  
**Testing:** Required fields/docs block incomplete opens.

### Clearing
Process of confirming trade details before settlement.  
**Example:** Trade matched between parties.  
**Testing:** Status transitions; exceptions.

### Contribution
Money added (esp. retirement accounts).  
**Example:** $6,500 IRA contribution for tax year.  
**Testing:** Limits/tax-year tagging (rules are product-specific).

### Corporate action
Issuer event that changes holdings/cash (split, dividend, merger…).  
**Example:** 2-for-1 split doubles shares, roughly halves price.  
**Testing:** Overnight position/cost-basis adjustments.

### Cost basis
Original cost used to compute gain/loss.  
**Example:** Bought at $100; sold at $120; gain depends on lot method.  
**Testing:** Tax lot selection and realized gain.

### Coupon
Bond interest payment rate/amount.  
**Example:** 5% annual coupon on face value.  
**Testing:** Payment posting dates and amounts.

### CUSIP / ISIN / Symbol / Ticker
Identifiers for securities (different standards).  
**Example:** AAPL ticker vs CUSIP code.  
**Testing:** Mapping consistency across systems.

### Custody / Custodian
Party that safekeeps assets and often provides official holdings.  
**Example:** Custody file is source of truth for positions.  
**Testing:** Custody vs portfolio warehouse recon.

---

## D

### Discretionary vs non-discretionary
Discretionary: advisor can trade without trade-by-trade client approval (within mandate).  
Non-discretionary: client approval needed.  
**Testing:** Permission and workflow differences.

### Distribution
Withdrawal/payout from account/trust/IRA.  
**Example:** Trust income distribution to beneficiary.  
**Testing:** Authorization rules; principal vs income (trust).

### Dividend
Company profit share paid to shareholders (cash or stock).  
**Example:** $0.24 cash dividend per share.  
**Testing:** Entitlement based on holdings on record date.

### Drift
How far a portfolio moved from target allocation.  
**Example:** Target 60/40; actual 68/32 → rebalance.  
**Testing:** Threshold logic and proposed trades.

---

## E

### Equity (account equity)
Roughly: cash + market value of positions − liabilities (model-dependent).  
**Example:** $9k cash + $11k stocks = ~$20k equity.  
**Testing:** Identity reconciliations across systems.

### ETF (Exchange-Traded Fund)
Fund traded like a stock on exchange.  
**Example:** Buy 20 shares of an S&P 500 ETF.  
**Testing:** Trading + corporate actions like stocks/funds.

### ETL
Extract–Transform–Load data pipeline.  
**Example:** Custody file → cleanse → warehouse.  
**Testing:** Completeness/accuracy/recon after load.

---

## F

### Fee / expense
Charges to client (advisory, wrap, commission, account fee…).  
**Example:** Monthly advisory fee $1,000.  
**Testing:** Expected vs actual invoice lines.

### Fee schedule / breakpoints
Rate table; large AUM may get lower rates.  
**Example:** 1.0% up to $1M; 0.80% above.  
**Testing:** Tier math and household aggregation rules.

### Fill / execution
Order was actually traded (full/partial).  
**Example:** Order 100 shares; filled 60 then 40.  
**Testing:** Partial fills update positions correctly.

### Fixed income
Debt investments (bonds, etc.).  
**Testing:** Accrued interest and pricing conventions.

### FX / foreign exchange
Currency conversion.  
**Example:** CAD security valued in USD account.  
**Testing:** Rate as-of and conversion accuracy.

---

## G–H

### Gain / loss (realized vs unrealized)
Unrealized = paper gain while still holding; realized = after sell.  
**Example:** Bought $100, now $120 unrealized; sell locks realized.  
**Testing:** Lot method impacts realized numbers.

### Gross vs net performance
Gross = before fees; net = after fees.  
**Testing:** Labels and formula consistency.

### Household
Group of related accounts for reporting/fees/advice.  
**Example:** Pat + spouse IRAs + joint taxable = one household.  
**Testing:** No cross-household data leakage; fee aggregation.

---

## I

### IPS (Investment Policy Statement)
Mandate describing goals, risk, constraints.  
**Example:** No more than 70% equities.  
**Testing:** Model/rebalance respects constraints.

### IRA (Individual Retirement Account)
Tax-advantaged retirement account (Traditional/Roth types differ).  
**Testing:** Contribution/distribution workflow flags (product rules).

### IRR / MWR (Money-Weighted Return)
Return reflecting investor cash-flow timing.  
**Testing:** Sensitive to contribution/withdrawal dates.

---

## J–K

### Journal / internal transfer
Move cash/assets between accounts at same firm.  
**Example:** Journal $2,000 from Brokerage to IRA (if allowed).  
**Testing:** Double-entry style effects; restrictions.

### KYC (Know Your Customer)
Know client identity/profile/risk for onboarding/servicing.  
**Testing:** Incomplete KYC blocks account activation.

---

## L

### Lot / tax lot
Slice of a position with its own buy date and cost basis.  
**Example:** Lot1: 5 AAPL @ $90 (Jan); Lot2: 5 AAPL @ $110 (Jun).  
**Testing:** Sell methods (FIFO, SpecID, etc.).

### Liquidity
How easily an asset converts to cash.  
**Testing:** Product restrictions, warnings.

---

## M

### Managed account / SMA
Account managed to a strategy/model.  
**Testing:** Model assignment, drift, rebalance orders.

### Margin
Borrowing against portfolio (higher risk).  
**Testing:** Buying power, calls, restrictions.

### Market value (MV)
Holdings × prices (+ conventions).  
**Example:** 10 AAPL × $190 = $1,900.  
**Testing:** UI = API = valuation engine.

### Model portfolio
Target mix used to manage many accounts.  
**Testing:** Mapping accounts → model; trade generation.

### Mutual fund
Pooled fund bought/sold via fund process (NAV-based).  
**Testing:** Trade cutoffs, NAV as-of, settlement.

---

## N–O

### NAV (Net Asset Value)
Per-share value of a fund.  
**Example:** Fund NAV $25.10 on trade date.  
**Testing:** Correct NAV date used for amount.

### Nominee / street name
Assets held in firm/custodian name for client benefit.  
**Testing:** Beneficial ownership reporting still correct.

### Order
Instruction to buy/sell.  
**Example:** Limit buy 10 AAPL @ $185.  
**Testing:** States: new → partial → filled/canceled/rejected.

### OFAC / sanctions screening
Check parties against restricted lists.  
**Testing:** Hit/hold workflows and audit.

---

## P

### Performance
How investments did over a period.  
**Testing:** Golden portfolios vs engine; UI/API match.

### Position
Current holding of a security.  
**Example:** ACC-100 long 10 AAPL.  
**Testing:** After trades/corporate actions, qty correct.

### Price / mark
Valuation price used for MV.  
**Testing:** Price feed as-of; missing price handling.

### Principal vs income (trust accounting)
Trust concept: corpus (principal) vs earnings (income).  
**Testing:** Distribution source rules.

### Prospectus / disclosures
Required product/legal information shown to clients.  
**Testing:** Presence and versioning in journeys.

---

## R

### Rebalance
Trades to bring portfolio back to target.  
**Testing:** Drift threshold, constraints, proposed vs executed.

### Reconciliation (recon)
Compare two sources; list breaks.  
**Example:** Custody qty vs warehouse qty.  
**Testing:** Automated break reports as quality gates.

### Reg BI / suitability (high level)
Standards around recommendations in client’s interest/suitability (jurisdiction-specific).  
**Testing:** Evidence/workflow completeness where platform supports — speak carefully.

### RIA (Registered Investment Advisor)
Advisory firm registration category (US context).  
**Testing:** Firm/advisor entitlements on platform.

### Realized gain/loss
Gain/loss after closing a lot via sell.  
**Testing:** Method + fees impact.

---

## S

### Settlement (T+1 / T+2 historically)
When trade legally completes and cash/securities exchange.  
**Example:** Buy today; settles next business day (equity T+1 in many markets now).  
**Testing:** Available cash vs traded cash timing.

### SMA
Separately Managed Account.  
**Testing:** Same family as managed models.

### Soft dollar (concept)
Research/services paid via commissions (complex/policy-heavy).  
**Testing:** Usually policy/reporting if in scope.

### Statement
Periodic official client report.  
**Testing:** Completeness, period bounds, PDF generation.

### Stock / equity security
Ownership share in a company.  
**Testing:** Trading, dividends, splits.

### Sweep
See cash sweep.

### Symbol / ticker
Trading shorthand (AAPL).  
**Testing:** Mapping to CUSIP/internal IDs.

---

## T

### Tax lot method
FIFO, LIFO, HIFO, SpecID, average cost (product-dependent).  
**Testing:** Chosen method applied on sell.

### TWR (Time-Weighted Return)
Performance measure that reduces cash-flow timing distortion; good for comparing managers.  
**Testing:** Known sample cash flows → expected TWR.

### Trade date vs settlement date
Trade date = when deal done; settlement date = when it finalizes.  
**Testing:** Balances/positions depend on which date view.

### Trade / transaction
Event changing cash and/or positions.  
**Testing:** End-to-end posting correctness.

### Transfer
Move assets/cash between firms or accounts.  
**Testing:** ACATS/wires/journals each have rules.

### Trust
Legal arrangement: trustee manages assets for beneficiaries.  
**Testing:** Roles, distributions, fiduciary reporting.

### Trustee / successor trustee
Person/entity with authority over trust.  
**Testing:** Permission boundaries.

---

## U–Z

### Unrealized gain/loss
Paper gain/loss on open positions.  
**Testing:** Price changes update correctly without inventing trades.

### Wash sale (concept)
Tax rule that can disallow loss if substantially identical security repurchased in window.  
**Testing:** If platform warns/blocks, validate behavior with fixtures.

### Wire
Electronic cash transfer.  
**Testing:** Amount, beneficiary bank info, status, ledger posting.

### Withdrawal
Cash/assets leaving account.  
**Testing:** Restrictions (IRA, trust, holds).

### YTD / QTD / ITD
Year-to-date / quarter-to-date / inception-to-date performance periods.  
**Testing:** Period boundaries and as-of.

### Yield
Income return measure (bonds/funds).  
**Testing:** Display/calculation consistency if shown.

---

## Mini relationship cheat

```text
Transactions change Positions and Cash
Positions × Prices ≈ Market Value
Cash + MV (− liabilities) ≈ Equity
Fees reduce cash / affect net performance
Corporate actions alter Positions/Cost basis overnight
Transfers move Positions/Cash across accounts/firms
Statements report all of the above for a period
```
