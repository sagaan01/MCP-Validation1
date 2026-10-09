# 5. SQL & Automation Examples

Explain every snippet: what it does, when the adaptive engine would choose it.

---

## A. Control totals (L0 / cheap)

```sql
-- Daily partition present + rowcount vs landing control table
SELECT
  t.business_date,
  t.row_cnt AS target_cnt,
  c.row_cnt AS control_cnt,
  t.row_cnt - c.row_cnt AS delta
FROM (
  SELECT business_date, COUNT(*) AS row_cnt
  FROM mart.fact_orders
  WHERE business_date = DATE '{run_date}'
  GROUP BY 1
) t
FULL OUTER JOIN (
  SELECT business_date, COUNT(*) AS row_cnt
  FROM staging.orders_control
  WHERE business_date = DATE '{run_date}'
  GROUP BY 1
) c USING (business_date);
```

**Use:** Fast signal before expensive joins. Adaptive engine often keeps this as must-run canary.

---

## B. Profile metrics (L1)

```sql
SELECT
  COUNT(*) AS row_cnt,
  COUNT(*) FILTER (WHERE order_id IS NULL) AS null_order_id,
  COUNT(*) FILTER (WHERE amount IS NULL) AS null_amount,
  COUNT(DISTINCT order_id) AS distinct_orders,
  MIN(amount) AS min_amount,
  MAX(amount) AS max_amount
FROM mart.fact_orders
WHERE business_date = DATE '{run_date}';
```

**Use:** Cold-start or drift. Compare to rolling baseline in the outcome store; spikes raise uncertainty → promote depth.

---

## C. Stratified sample reconcile (L2)

```sql
-- Hash-sample ~1% of keys, then compare amounts
WITH keys AS (
  SELECT order_id
  FROM staging.orders_clean
  WHERE business_date = DATE '{run_date}'
    AND MOD(ABS(HASH(order_id)), 100) = 0
),
src AS (
  SELECT o.order_id, o.amount
  FROM staging.orders_clean o
  JOIN keys k USING (order_id)
),
tgt AS (
  SELECT f.order_id, f.amount
  FROM mart.fact_orders f
  JOIN keys k USING (order_id)
)
SELECT
  COUNT(*) AS sample_keys,
  COUNT(*) FILTER (WHERE s.order_id IS NULL) AS missing_in_src,
  COUNT(*) FILTER (WHERE t.order_id IS NULL) AS missing_in_tgt,
  COUNT(*) FILTER (
    WHERE s.amount IS DISTINCT FROM t.amount
  ) AS amount_mismatches
FROM src s
FULL OUTER JOIN tgt t USING (order_id);
```

**Use:** Medium uncertainty, stable large facts. Mention stratification (here: hash) and that samples can miss sparse bad partitions — hence partition canaries.

---

## D. Full key reconcile (L3)

```sql
SELECT
  COALESCE(s.order_id, t.order_id) AS order_id,
  s.amount AS src_amount,
  t.amount AS tgt_amount
FROM (
  SELECT order_id, amount
  FROM staging.orders_clean
  WHERE business_date = DATE '{run_date}'
) s
FULL OUTER JOIN (
  SELECT order_id, amount
  FROM mart.fact_orders
  WHERE business_date = DATE '{run_date}'
) t USING (order_id)
WHERE s.order_id IS NULL
   OR t.order_id IS NULL
   OR s.amount IS DISTINCT FROM t.amount
LIMIT 1000;  -- sample of failures for triage
```

**Use:** Money paths, incidents, schema weeks. Pair with counts + aggregates (SUM/MIN/MAX) as dual oracles.

---

## E. Uniqueness / SCD current flag

```sql
SELECT customer_bk, COUNT(*) AS current_rows
FROM mart.dim_customer
WHERE is_current = TRUE
GROUP BY customer_bk
HAVING COUNT(*) > 1;
```

**Use:** Identity dims — strong must-run floor candidate.

---

## F. Duplicate / incremental batch check

```sql
SELECT order_id, COUNT(DISTINCT batch_id) AS batches
FROM mart.fact_orders
WHERE business_date = DATE '{run_date}'
GROUP BY order_id
HAVING COUNT(DISTINCT batch_id) > 1;
```

---

## G. Referential integrity

```sql
SELECT f.order_id, f.customer_bk
FROM mart.fact_orders f
LEFT JOIN mart.dim_customer d
  ON d.customer_bk = f.customer_bk
 AND d.is_current = TRUE
WHERE f.business_date = DATE '{run_date}'
  AND d.customer_bk IS NULL;
```

---

## H. Outcome store + simple scoring (Python sketch)

```python
"""
Toy decision step: rank rules by expected value and pick until budget is spent.
Not production ML — interview-clear illustration.
"""

from dataclasses import dataclass


@dataclass
class Rule:
    rule_id: str
    impact: float          # 0-1 business impact
    prior_fail: float      # historical fail rate
    uncertainty: float     # 0-1 (cold-start, recent change)
    cost: float            # relative cost units
    must_run: bool


def score(rule: Rule, explore_bonus: float = 0.15) -> float:
    # P(find) grows with prior fails and uncertainty
    p_find = min(1.0, rule.prior_fail + 0.5 * rule.uncertainty)
    value = p_find * rule.impact * (1.0 + explore_bonus * rule.uncertainty)
    return value - rule.cost


def select(rules: list[Rule], budget: float) -> list[Rule]:
    chosen = [r for r in rules if r.must_run]
    spent = sum(r.cost for r in chosen)
    remaining = sorted(
        (r for r in rules if not r.must_run),
        key=score,
        reverse=True,
    )
    for rule in remaining:
        if spent + rule.cost <= budget:
            chosen.append(rule)
            spent += rule.cost
    return chosen


# Example
catalog = [
    Rule("orders_pk", 1.0, 0.01, 0.2, 3.0, True),
    Rule("orders_sample_recon", 0.9, 0.05, 0.4, 5.0, False),
    Rule("orders_full_recon", 0.9, 0.05, 0.7, 20.0, False),
    Rule("marketing_profile", 0.3, 0.02, 0.1, 2.0, False),
]
picked = select(catalog, budget=15.0)
print([r.rule_id for r in picked])
```

**Line-by-line idea:** must-run first; score others; fill budget. Uncertainty both raises detection chance and explore bonus. After runs, update `prior_fail` and `uncertainty` from outcomes.

---

## I. Pytest-style gate (production-style shape)

```python
import pytest


def fetch_dq_status(run_id: str, rule_id: str) -> str:
    ...  # read dq_results


@pytest.mark.p0
def test_orders_pk_must_run(run_id):
    status = fetch_dq_status(run_id, "orders_pk")
    assert status in {"PASS", "FAIL"}, "must-run rule missing from execution"
    assert status == "PASS"


@pytest.mark.adaptive
def test_selection_has_explanation(run_id, rule_id):
    row = fetch_result_row(run_id, rule_id)
    assert row["selected_reason"], "skips/selections must be explainable"
```

**CI idea:** Changed lineage → force deeper marks; adaptive job still audited for explanations.

---

## J. Automation framework notes

| Concern | Practice |
|---------|----------|
| Structure | `catalog/`, `decision/`, `runners/`, `outcomes/`, `gates/` |
| Config | Impact tags + cost classes in YAML/DB, not hard-coded |
| Logging | Every selection/skip with feature vector snapshot |
| Error handling | Score failure → static fallback pack |
| Reporting | Portfolio dashboard: spent budget, escapes, FP rate |
| CI/CD | Unit-test scoring pure functions; integration test fallback |

---

## K. Interview SQL patterns checklist

Practice writing quickly:

- Count validation  
- Aggregate SUM compare  
- Null validation  
- Duplicate detection  
- Source-to-target anti-join  
- Incremental watermark sanity  
- Exception sampling (`LIMIT` with reasons)  
- Performance: predicate on partition columns first
