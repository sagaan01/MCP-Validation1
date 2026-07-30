# 7. Quick Revision — Wealth & Finance Before Interview

## 60-second domain pitch

> “Wealth platforms manage client households and accounts through onboarding, funding, trading, settlements, corporate actions, fees, performance, trusts, transfers, and statements. As a Principal SDET I prove financial truth with API and data reconciliation, use Playwright for critical journeys and permissions, and put blocker checks into Azure quality gates.”

---

## Must-know identities

```text
Transactions change cash & positions
Positions × prices ≈ market value
Cash + MV ≈ account value (simplified)
Custody/source ≈ warehouse ≈ API ≈ UI (same as-of, same definition)
```

---

## Term lightning round

| Term | One-liner |
|------|-----------|
| AUM | Money being managed |
| Position | What you own |
| Lot | Slice of position with its cost date |
| TWR | Manager-style return |
| MWR | Investor cash-flow-aware return |
| ACATS | Move assets between firms |
| ETL | Extract-transform-load pipeline |
| Recon | Compare two books; find breaks |
| Settlement | When trade finalizes |
| IPS | Investment rules/mandate |
| Drift | Off-target allocation |
| Breakpoint | Fee rate tier |
| Custody | Safekeeping / holdings source |
| Authz | Who is allowed to see/do |

---

## Story trio to remember

1. **Patel onboarding → fund → buy → fee → statement**  
2. **Nightly ETL missing rows caught by recon**  
3. **Wrong advisor book = highest severity**

---

## Basics → advanced progression (how you sound)

| Level | Sound like |
|-------|------------|
| Basic | I know accounts, cash, positions, trades, statements |
| Intermediate | I test settlement timing, lots, ACATS, fees, TWR/MWR carefully |
| Advanced | I own risk-ranked strategy, recon gates, authz packs, evidence for release |

---

## Testing involvement in one glance

| Area | Primary proof |
|------|----------------|
| Onboarding | Status + required data |
| Money in/out | Ledger delta + idempotency |
| Trading | Order state + position/cash |
| Overnight events | Pre/post data snapshots |
| Fees/performance | Expected math fixtures |
| Trust | Permissions + distribution rules |
| Statements | Batch completeness |
| Security | Cross-client denial |

---

## Questions to ask *them*

1. What is your source of truth for positions — custody feed or internal ledger?  
2. Which workflows cause the most production incidents?  
3. Is fee calculation in a dedicated service?  
4. How is UAT currently owned between ops and QA?  
5. Do you already run overnight recon, or is that a gap for this role?
