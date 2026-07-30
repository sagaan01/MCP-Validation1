# 4. Advanced Q&A (Principal-level Wealth & Finance)

These answers should sound strategic: risk, architecture, data truth, and release confidence.

---

## Q1. Design a data-quality strategy for a wealth platform.

**Answer:**  
1. Catalog money rules (positions, cash, fees, corporate actions, transfers)  
2. Define sources of truth per domain (e.g., custody for holdings)  
3. Automate recon with severity model  
4. Run post-ETL nightly + pre-release gates  
5. Owner + SLA for breaks  
6. Feed chronic breaks into upstream contract tests  

**Example gate:**  
Block release if cash breaks > $0.01 for in-scope accounts, or any cross-client permission defect.

**Testing artifacts:**  
SQL rule pack, break report CSV, Azure DevOps stage `DataQuality`.

---

## Q2. How do you reconcile UI, API, and DB without triple maintenance?

**Answer:**  
Compute expected truth once (API or DB service), assert UI against that. Separate pure data recon (custody vs warehouse) from UI cosmetic checks.

**Example:**  
`expectedMv = portfolioApi.getMv(accountId, asOf)`  
UI test only checks displayed MV equals `expectedMv` with money matcher.

---

## Q3. What’s your approach to eventual consistency after trade → position?

**Answer:**  
Poll with timeout/interval; assert correlation IDs; distinguish “not yet settled” from “lost message.” For Principal strategy: SLAs per environment and alerting when lag exceeds threshold.

**Example:**  
Wait up to 60s for position qty; on timeout dump order status + outbox/event table.

---

## Q4. How do you test fee engines that household-aggregate AUM?

**Answer:**  
Seed multi-account household with known valuations; run billing; validate:
- aggregation set membership  
- breakpoint tier application  
- exclusions (e.g., some account types not billable)  
- proration  
- invoice split display  

**Advanced trap:**  
Account moved households mid-period — confirm policy with BA; automate that edge once defined.

---

## Q5. Performance engine validation at advanced level?

**Answer:**  
Maintain golden portfolios with hand-calculated (or independently scripted) expected TWR/MWR. Include:
- large mid-period flows  
- zero/negative cash edge cases  
- inception boundaries  
- gross vs net  
- benchmark alignment  

**Reject:**  
Only screenshot comparisons of performance charts.

---

## Q6. How do you handle price feed failures?

**Answer:**  
Define product behavior: stale price flag, exclude from MV, block trading, etc. Tests should force missing/stale quotes and assert warning + calculation policy.

**Example:**  
If price missing, MV line shows “NA” and account total excludes or marks provisional — according to spec.

---

## Q7. Cross-system transfer (wire) advanced checks?

**Answer:**  
Validate idempotency (duplicate submissions), cutoff times, beneficiary validation, ledger posting, AML hold states, reverse/cancel paths, and statement representation.

**Example:**  
Same Idempotency-Key twice → one money movement, not two.

---

## Q8. How do you prioritize automation in a huge WM estate?

**Answer:**  
Risk catalog signed by Product/Risk:
1. Authz leakage / wrong-account  
2. Cash movement correctness  
3. Position/cash recon after batch  
4. Fee billing  
5. Onboarding completion integrity  
6. Statements books-and-records  
Then UX polish later.

---

## Q9. Trust accounting advanced angle?

**Answer:**  
Principal vs income, mandatory vs discretionary distributions, trustee powers matrix, court reporting extracts. Defects often in misclassified transactions.

**Testing:**  
Transaction type taxonomy fixtures; distribution source assertions; role negatives.

---

## Q10. Model drift + tax-aware rebalance?

**Answer:**  
When platform supports tax awareness: prefer selling lots with losses/gains per policy; wash-sale warnings. Tests need lot-level fixtures, not only aggregate weights.

---

## Q11. How do you prove release readiness to auditors/business?

**Answer:**  
Evidence pack:
- requirement ↔ test links  
- pipeline run IDs  
- recon summary (zero blockers)  
- UAT sign-off  
- known waivers with expiry owners  

Principal SDET owns the **quality story**, not only green checkmarks.

---

## Q12. Production incident: clients see wrong positions. Your first 2 hours?

**Answer:**  
1. Scope: which accounts/as-of/product  
2. Compare custody vs API vs UI instantly with emergency SQL  
3. Determine if display bug or books bug  
4. Communicate severity  
5. Patch + permanent automated recon rule  
6. Add gate so this class can’t silently ship again  

---

## Q13. How does AI fit advanced WM quality without creating false greens?

**Answer:**  
AI drafts cases/SQL/boilerplate. Deterministic fee/position assertions stay human-reviewed and versioned. No PII in prompts. Self-healing locators avoided on money actions.

---

## Q14. Microservices in wealth — testing challenges?

**Answer:**  
Order service, position service, pricing, fees, reporting each own data. Journey tests need correlation IDs; contract tests prevent schema drift; data recon is the cross-service truth net.

---

## Q15. Advanced closing statement for interview

> “At Principal level I treat wealth quality as control of financial truth across event-driven services and batches. UI automation proves journeys; API proves rules; recon proves books. Azure gates enforce that truth before production.”
