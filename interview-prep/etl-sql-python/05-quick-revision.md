# 5. ETL / SQL / Python — Quick Revision

## 30-second definitions

| Term | Line |
|------|------|
| ETL | Extract → Transform → Load |
| ETL testing | Prove data not lost/wrong/duplicated across pipeline |
| Completeness | All expected rows present |
| Accuracy | Values match rules/source |
| Consistency | Systems agree |
| Recon | Compare two sources; list breaks |
| Idempotent | Re-run yields same result |
| Grain | Level of uniqueness (account+symbol+as_of) |

---

## SQL must-know patterns

```sql
-- duplicates
SELECT key, COUNT(*) FROM t GROUP BY key HAVING COUNT(*) > 1;

-- missing in target
SELECT s.key FROM src s LEFT JOIN tgt t ON s.key=t.key WHERE t.key IS NULL;

-- recon
FULL OUTER JOIN ... WHERE COALESCE(a.qty,0) <> COALESCE(b.qty,0);

-- money compare
ABS(a.amt - b.amt) > 0.01
```

---

## Python must-know patterns

```python
# schema + nulls on CSV
# set difference for IDs
# merge how="outer" for recon
# Decimal for money
# pytest.mark.parametrize golden cases
```

---

## Scenario answer skeleton

```text
1) Clarify as-of, grain, source of truth, tolerance
2) Check stage counts / rejects / watermark
3) SQL recon at business grain
4) Python report artifact if useful
5) Severity + gate + permanent rule
```

---

## Top 8 interview scenarios to rehearse aloud

1. Missing rows after overnight load  
2. Counts match, amounts don’t  
3. Re-run duplicates  
4. Late file / timeliness  
5. Positions custody vs warehouse  
6. Fee expected vs actual  
7. UI ≠ DB triage  
8. Incremental gap (skipped day)

---

## Principal-level closer

> “Counts aren’t enough—I reconcile at the business grain with agreed tolerances, prove idempotent loads, and block releases on blocker financial breaks.”
