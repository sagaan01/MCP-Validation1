# 4. End-to-End Interview Scenarios (ETL + SQL + Python)

Use these as mock interviews. Speak **approach first**, then **SQL/Python**, then **gate/impact**.

---

## Case 1 — New custody-to-warehouse pipeline

**Prompt:**  
“We’re building ETL from nightly custody positions file to warehouse. How do you test it?”

### Answer (interview flow)

**1. Clarify**
- Grain? (`account_id + cusip/symbol + as_of`)
- Source of truth? (custody)
- Tolerances? (qty exact; MV maybe $0.01)
- Reject rules?

**2. Test layers**
| Layer | Examples |
|-------|----------|
| File | name, arrival SLA, schema, not empty |
| Staging | count vs file, null checks |
| Transform | security ID mapping, account status filters |
| Load | upsert idempotency, partition by as_of |
| Recon | FULL OUTER JOIN qty breaks |
| Regression | golden account set |

**3. Show SQL recon** (positions FULL OUTER JOIN — see SQL doc)

**4. Show Python** (pandas outer merge → break CSV artifact in CI)

**5. Gate**  
Nightly: blocker if any qty break for in-scope book.

**Closing line:**  
> “I’d deliver a rule pack, not a one-off query—owned, scheduled, and release-blocking.”

---

## Case 2 — Fee invoice wrong for 200 households

**Prompt:**  
“Ops says fees look high this month. Walk me through validation.”

### Answer

1. Get fee schedule + breakpoint rules from BA (source of truth for math)  
2. Build expected fee in SQL or Python Decimal for sample + full population  
3. Compare expected vs `invoice_line`  
4. Segment breaks: wrong AUM basis, wrong household membership, wrong rate tier, proration  
5. Confirm statement feed uses same invoice IDs  
6. Add golden parametrized pytest cases for tiers  
7. Make variance > $0.01 a blocker for billing release  

**Python snippet angle:** parametrize tiers; **SQL angle:** join AUM basis × rate schedule.

---

## Case 3 — Job re-run after failure → client sees double dividends

**Prompt:**  
“Pipeline crashed after partial load; re-run caused duplicate dividend postings. What tests were missing?”

### Answer

Missing **idempotency tests**.

Design:
1. Load once → checksum by `account_id+ex_date+symbol`  
2. Re-run → same counts  
3. SQL `HAVING COUNT(*)>1` must be empty  
4. Prefer merge on natural key or delete-by-partition then load  

**Principal point:**  
> “Recovery path is part of the product—tests must include failure/retry.”

---

## Case 4 — UI shows MV $1,000,000; DB shows $1,000,050

**Prompt:**  
“Is this an ETL bug?”

### Answer

Not sure yet—triage definitions:
- Same **as-of**?
- Accrued interest included?
- Same account mask (household vs account)?
- Pending trades in one system?
- Price source difference?

Steps:
1. API valuation vs DB  
2. DB vs custody  
3. UI vs API  
Isolate layer; only then call it ETL vs app vs pricing.

**SQL:** valuation compare; **Python:** call API + DB assert.

---

## Case 5 — Incremental trades load skipped a business day

**Prompt:**  
“Monday and Wednesday present; Tuesday missing. Design detection.”

### Answer

- Calendar of expected business days  
- `load_control` table must record success per source/date  
- Gap query (SQL doc Scenario 6 style)  
- Alert + auto ticket  
- Backfill job tested in UAT  

**Python:** read control table into DataFrame; diff against expected date range.

---

## Case 6 — Transform maps account types wrong (`TRUST` → `BROKERAGE`)

**Prompt:**  
“How do you catch mapping defects?”

### Answer

1. Mapping reference table under version control  
2. Golden rows for each account type  
3. Assert `source_type` → `target_type` matrix  

```python
MAPPING = {"TR": "TRUST", "BR": "BROKERAGE", "IR": "IRA"}

def test_account_type_mapping(staging_df, target_df):
    m = staging_df.merge(target_df, on="account_id")
    m["expected"] = m["src_type_code"].map(MAPPING)
    bad = m[m["expected"] != m["target_type"]]
    assert bad.empty, bad.head()
```

Also SQL distinct counts by type before/after transform.

---

## Case 7 — Whiteboard: “Write a data quality framework”

**Prompt:**  
“Boxes and arrows—go.”

### Draw / say

```text
Sources → Validators (schema/sla)
       → Rule engine (SQL/Python rules)
       → Break store (type, severity, keys, sample)
       → Reporter (ADO/email/dashboard)
       → Gates (CI nightly / release)
Config: rules.yml + ownership + tolerance
```

Mention: severity model, idempotent runs, as-of parameters, evidence artifacts.

---

## Case 8 — Behavioral + technical combo

**Prompt:**  
“Tell me about a time ETL testing found a serious issue.”

### STAR template (fill with your story)

**S:** Nightly wealth positions feed  
**T:** Ensure custody vs warehouse match before statements  
**A:** Built SQL FULL OUTER recon + Python break report; added Azure gate  
**R:** Caught N breaks before client statements; reduced fire-drill; rule still runs  

If no real story: describe a **realistic hypothetical** and label it as design approach—not fake experience.

---

## Case 9 — SQL + Python together live coding

**Prompt:**  
“Here’s a sample trades CSV and a table DDL. Find amount mismatches.”

### Approach to narrate while coding

1. Profile columns (`dtypes`, nulls)  
2. Normalize types (`Decimal`/numeric)  
3. Aggregate if grain requires  
4. Outer merge on `trade_id`  
5. Filter `abs(delta) > 0.01`  
6. Print top 10 breaks  

Interviewers watch **method**, not perfection.

---

## Case 10 — What do you automate in first 30 days?

**Answer suitable for Principal SDET**

1. Inventory critical feeds (positions, cash, trades, fees)  
2. Implement top 3 blocker recon rules  
3. Publish break dashboard  
4. Wire nightly ADO stage  
5. Document source-of-truth + tolerances with business  
6. Mentor team on SQL/Python rule pattern  

---

## Scoring yourself after mock practice

| Signal | Good |
|--------|------|
| Asks clarifying questions | as-of, grain, tolerance, SoT |
| Separates count vs amount checks | yes |
| Writes FULL OUTER / duplicate SQL | yes |
| Mentions idempotent re-run | yes |
| Uses Decimal for money | yes |
| Ties to pipeline gate | yes |
| Speaks wealth impact | client statements, fees, books |
