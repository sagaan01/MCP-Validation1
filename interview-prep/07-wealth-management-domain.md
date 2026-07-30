# 7. Wealth Management Domain

**Why this matters:** Strong wealth/asset management/trust/advisory background is a major differentiator for this client role.

---

## Domain map (speak this fluently)

```text
Client / Household
  └── Accounts (Brokerage, IRA, Trust, Advisory, Custody)
        ├── Positions & Lots
        ├── Cash & Balances
        ├── Transactions (trades, contributions, withdrawals, fees, dividends)
        ├── Performance (TWR, MWR, benchmarks)
        ├── Fees & Billing
        └── Statements / Client Reporting / Tax
```

**Platforms often involved:** account opening/onboarding (KYC/CIP), portfolio management, trading/order management, performance reporting, trust accounting, advisor desktop, client portal.

---

## Q1. “Explain account lifecycle testing.”

### Stages & quality focus

| Stage | What to validate |
|-------|------------------|
| Prospect / lead | Data capture, consent |
| Onboarding / KYC | Required docs, CIP, OFAC, status workflow |
| Account open | Account numbers, registrations, beneficiaries |
| Funding | ACATS, wires, checks; cash available |
| Servicing | Address changes, trusted contacts, restrictions |
| Trading / investing | Orders, allocates, corporates |
| Reporting | Statements, performance, tax lots |
| Close / transfer out | Residual balances, final statement, tax |

### Sample E2E journey test (hybrid)

```ts
test('trust account onboarding to funded @smoke @wm', async ({
  accountApi,
  onboardingPage,
}) => {
  const appId = await accountApi.startApplication({ type: 'TRUST' });
  await onboardingPage.completeKyc(appId);
  await accountApi.approveKyc(appId);
  const accountId = await accountApi.getAccountId(appId);
  await accountApi.fund(accountId, { amount: 100000, method: 'WIRE' });
  const bal = await accountApi.getCashBalance(accountId);
  expect(bal).toEqualMoney(100000);
});
```

---

## Q2. “Positions, balances, transactions — how do they relate?”

### Answer

“Transactions change positions and cash. Positions × prices (and FX) ≈ market value. Cash + MV ≈ account equity (model-dependent). Tests reconcile these identities after batches.”

### Identity checks

```text
Ending Cash = Beginning Cash + Σ cash transactions
Ending Qty  = Beginning Qty  + Σ signed qty transactions
Equity ≈ Cash + Market Value of positions − liabilities
```

---

## Q3. “What is ACATS / asset transfer testing?”

### Answer

“Automated Customer Account Transfer Service moves assets between firms. Validate: request states, partial vs full, residual cash, position snags, timeline, client notifications, and books/records after settle.”

---

## Q4. “Performance reporting — what do you test?”

| Concept | Pitfall |
|---------|---------|
| TWR (time-weighted) | Cash flow timing |
| MWR / IRR | Sensitive to flows |
| Benchmarks | Wrong index mapping |
| Net vs gross | Fee inclusion |
| As-of vs inception | Date boundaries |

### Example validation approach

- Golden portfolio with known flows → expected TWR fixture  
- Compare engine output to independently calculated expected in Python/Excel fixture  
- UI shows same as API within rounding policy  

```ts
expect(ui.ytdTwr).toBeCloseTo(api.ytdTwr, 4); // bps policy agreed
```

---

## Q5. “Fees and billing scenarios.”

- AUM-based advisory fees  
- Wrap fees  
- Transaction commissions  
- Fee waivers / householder breakpoints  
- Proration mid-period open/close  
- Trust fiduciary fees  

**Test idea:** seed AUM history + schedule → run billing job → invoice lines match SQL expected → client statement shows fee.

---

## Q6. “Trust & advisory specifics?”

| Trust | Advisory |
|-------|----------|
| Trustee powers, beneficiaries | IPS / risk profile |
| Principal vs income accounting | Discretionary vs non-discretionary |
| Court/fiduciary reporting | Model portfolios / rebalance |
| Distribution rules | Suitability / Reg BI overlays |

“I validate role-based permissions: successor trustee cannot perform unauthorized distributions; advisory rebalance respects wash-sale or tax constraints if configured.”

---

## Q7. “Corporate actions — why SDETs care?”

Splits, mergers, dividends, spin-offs change positions overnight. Data tests verify:

- Quantity adjustments  
- Cost basis updates  
- Cash dividends posted  
- Client reporting explanations  

```sql
-- Post 2-for-1 split: quantity doubled, price halved (approx)
SELECT account_id, symbol
FROM positions_before b
JOIN positions_after a USING (account_id, symbol)
WHERE a.quantity <> b.quantity * 2;
```

---

## Q8. “Client reporting / statements UAT angles.”

- Correct legal name / registration  
- Period boundaries  
- Disclosures present  
- Positions & transactions sections complete  
- PDF generation job success  
- Delivery preferences (e-delivery)  

---

## Q9. “Regulatory / compliance-aware testing (high level).”

Speak carefully—not legal advice:

- Access control & audit trails  
- Data retention  
- KYC/AML workflow completeness  
- Best interest / suitability evidence where platform supports  
- Change evidence for auditors  

“Quality strategy includes immutable audit logs for privileged actions and evidence packs for releases touching books and records.”

---

## Q10. “Sample data model questions you can answer.”

**Q: What’s a tax lot?**  
“A tax lot is a slice of a position with its own acquire date and cost basis. Method (FIFO, SpecID, HIFO) affects gain/loss on sell.”

**Q: Household vs account?**  
“Household groups related accounts for reporting/fees; tests must not leak cross-household data.”

**Q: Soft dollar / model drift?**  
“Rebalance tests assert drift thresholds trigger trades within constraints.”

---

## Q11. “Risk-based test prioritization for WM.”

| Priority | Journeys |
|----------|----------|
| P0 | Login/authz, cash movement, trading, wrong-account leakage |
| P1 | Onboarding complete, fees, statements, performance |
| P2 | Preferential UI, notifications, cosmetic |

---

## Q12. “Story you can tell in interview.”

> “We found a production-severity issue in UAT where UI market value excluded accrued interest for bonds while API included it. I added a reconciliation assertion across UI/API/DB and a data rule for fixed income MV components. Escape prevented on next release; became a standard matcher in the framework.”
