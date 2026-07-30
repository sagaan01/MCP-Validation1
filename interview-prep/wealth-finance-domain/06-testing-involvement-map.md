# 6. Testing Involvement Map (Every Wealth Area)

For each domain area: **what can go wrong**, **what to test**, **best layer** (UI / API / Data), **example**.

---

## 1) Client onboarding / KYC / CIP / AML screening

| | |
|--|--|
| **Risk** | Incomplete identity, bad status transitions, blocked lists missed |
| **UI** | Form validations, document upload, status messages |
| **API** | Application state machine; approve/reject |
| **Data** | Customer/account rows; audit events |
| **Example** | Application without ID doc cannot become `OPEN` |

---

## 2) Account opening & registration types

| | |
|--|--|
| **Risk** | Wrong ownership type, missing beneficiaries, bad entitlements |
| **UI** | Registration selection journey |
| **API** | Create account contract |
| **Data** | Account master fields |
| **Example** | Joint account requires two owners |

---

## 3) Funding (wires, checks, journals)

| | |
|--|--|
| **Risk** | Duplicate credit, wrong account credited, timing confusion |
| **UI** | Confirmation / status |
| **API** | Idempotent fund posting |
| **Data** | Cash ledger delta |
| **Example** | Same wire ID processed twice → still one +$100k |

---

## 4) Trading / orders / executions / settlement

| | |
|--|--|
| **Risk** | Partial fills mishandled, premature settled cash asserts, lost updates |
| **UI** | Order ticket + status |
| **API** | Order states; fills |
| **Data** | Transactions, positions, cash after settle |
| **Example** | Buy 100 filled as 60+40 → final qty 100 |

---

## 5) Positions & market value

| | |
|--|--|
| **Risk** | Missing symbols, stale prices, convention mismatches |
| **UI** | Grid totals |
| **API** | Positions payload |
| **Data** | Recon vs custody; price as-of |
| **Example** | Σ(qty × price) equals account MV within tolerance |

---

## 6) Cash balances (settled/available/buying power)

| | |
|--|--|
| **Risk** | Comparing different balance types |
| **UI** | Labels correct |
| **API** | Field-level asserts |
| **Data** | Ledger vs portfolio cash recon |
| **Example** | Withdrawal uses available cash, not pending |

---

## 7) Tax lots & realized gains

| | |
|--|--|
| **Risk** | Wrong lot method, wrong gain |
| **UI** | Lot selection display (if any) |
| **API** | Sell allocation result |
| **Data** | Lot closed flags; gain amount |
| **Example** | SpecID sell closes intended lot only |

---

## 8) Corporate actions (splits, dividends, mergers)

| | |
|--|--|
| **Risk** | Overnight qty wrong, MV jump, missing dividend cash |
| **UI** | Activity explanation |
| **API** | Post-action positions |
| **Data** | Pre/post snapshot recon; action file ETL |
| **Example** | 2-for-1 split doubles qty |

---

## 9) Transfers — ACATS / internal journals / external wires

| | |
|--|--|
| **Risk** | Lost assets, partial residuals, duplicate positions |
| **UI** | Transfer status journey |
| **API** | Transfer state machine |
| **Data** | Before/after positions & cash |
| **Example** | ACATS complete → source empty of moved CUSIPs |

---

## 10) Fees & billing

| | |
|--|--|
| **Risk** | Wrong AUM basis, breakpoints, household mix, proration |
| **UI** | Fee display / invoice view |
| **API** | Billing preview/finalize |
| **Data** | Expected vs actual fee SQL |
| **Example** | Breakpoint schedule produces expected $ amount |

---

## 11) Performance & benchmarks

| | |
|--|--|
| **Risk** | TWR/MWR mixup, gross/net mixup, period bounds |
| **UI** | Chart/numbers/labels |
| **API** | Metric endpoint |
| **Data** | Golden portfolio expected values |
| **Example** | Known flows → TWR within 0.01% policy |

---

## 12) Model portfolios & rebalances

| | |
|--|--|
| **Risk** | Bad drift math, constraint violations |
| **UI** | Proposed trades review |
| **API** | Rebalance proposal engine |
| **Data** | Post-exec weights |
| **Example** | Drift >5% proposes trades toward 60/40 |

---

## 13) Trust & estate servicing

| | |
|--|--|
| **Risk** | Unauthorized distribution, principal/income mispost |
| **UI** | Trustee workflows |
| **API** | Authz + distribution rules |
| **Data** | Transaction classification |
| **Example** | Non-trustee distribution attempt → 403 |

---

## 14) IRA contributions / distributions (product rules)

| | |
|--|--|
| **Risk** | Wrong tax year tags, blocked illegal paths (rules vary) |
| **UI** | Contribution flow |
| **API** | Validation errors |
| **Data** | Contribution records |
| **Example** | Contribution coded to correct tax year |

---

## 15) Statements / client reporting / tax extracts

| | |
|--|--|
| **Risk** | Missing accounts, wrong period, incomplete sections |
| **UI** | Portal download |
| **API/Jobs** | Generation triggers |
| **Data** | Completeness of statement batch |
| **Example** | All active accounts have statement row/PDF |

---

## 16) Household aggregation & reporting

| | |
|--|--|
| **Risk** | Double count, missing account, cross-household leak |
| **UI** | Household dashboard |
| **API** | Aggregation payload |
| **Data** | Membership table integrity |
| **Example** | Household MV = sum(account MV) |

---

## 17) Entitlements / authz / advisor book security

| | |
|--|--|
| **Risk** | Cross-client data exposure |
| **UI** | Empty/error states |
| **API** | Must deny |
| **Data** | Access audit |
| **Example** | Advisor A cannot GET Advisor B account |

---

## 18) Pricing / FX / valuations

| | |
|--|--|
| **Risk** | Stale FX/price, wrong as-of |
| **UI** | Warnings |
| **API** | Valuation service |
| **Data** | Price table joins |
| **Example** | Missing price flags MV provisional |

---

## 19) ETL / custody / warehouse pipelines

| | |
|--|--|
| **Risk** | Missing rows, bad transforms, late loads |
| **UI** | Usually none directly |
| **API** | Optional control APIs |
| **Data** | Core — completeness/accuracy/recon |
| **Example** | Source count = loaded + rejected |

---

## 20) UAT with business (ops/advisors/trust officers)

| | |
|--|--|
| **Risk** | Automating everything except judgment-heavy flows |
| **Approach** | Business executes real workflow charters; QE provides data+evidence |
| **Example** | Trust officer certifies distribution paperwork journey |

---

## Layer choice cheat (say this in interviews)

```text
Permissions & money movement rules  → API first
Financial truth after batches       → SQL / data recon
User journey & usability wiring     → UI (Playwright)
Business judgment / compliance feel → UAT
Release decision                    → Quality gates combining the above
```

---

## Sample “full stack” test for one feature

**Feature:** Advisor journals $5,000 from Brokerage to IRA (if allowed).

1. **API:** POST journal succeeds; second identical idempotent request doesn’t double.  
2. **Data:** Brokerage cash −5000; IRA cash +5000; transaction rows exist.  
3. **UI:** Activity shows journal; balances refresh.  
4. **Negative:** Journal exceeding cash rejected.  
5. **Authz:** Other advisor cannot initiate on this household.  
6. **Gate:** Include in `@smoke` or `@money` pack.
