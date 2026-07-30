# 3. Python Interview Scenarios — Data / ETL Testing

What interviewers want: **practical Python for validating files, DB results, and transforms**—not ML theory.

---

## Part A — Python concepts for SDET data testing

| Concept | Use in testing |
|---------|----------------|
| `pandas` | Load CSV/SQL, compare DataFrames |
| `pytest` | Assertions, fixtures, parametrize golden cases |
| DB drivers (`pyodbc`, `psycopg`, `sqlalchemy`) | Run recon SQL |
| `pathlib` / files | Inbound file presence & schema |
| `decimal.Decimal` | Exact money math |
| `json` / `pydantic`/`dict` checks | API payload validation |
| Virtual env / packaging | Reproducible test jobs in CI |

**Interview line:**  
> “I use Python as the glue: read sources, apply expected business rules, compare to target, fail with a clear break report.”

---

## Part B — Scenario Q&A with code

### Scenario 1 — Validate CSV schema and mandatory fields

**Prompt:** “Trades file landed. What Python checks do you run first?”

```python
import pandas as pd

REQUIRED = ["trade_id", "account_id", "symbol", "quantity", "side", "trade_date"]

df = pd.read_csv("inbound/trades_20260729.csv")
assert not df.empty, "Trades file is empty"

missing_cols = [c for c in REQUIRED if c not in df.columns]
assert not missing_cols, f"Missing columns: {missing_cols}"

for col in ["trade_id", "account_id", "symbol", "side"]:
    nulls = df[col].isna().sum()
    assert nulls == 0, f"{col} has {nulls} nulls"

assert df["side"].isin(["BUY", "SELL"]).all(), "Invalid side values"
assert (df["quantity"] > 0).all(), "Quantity must be > 0"
```

---

### Scenario 2 — Completeness: source vs target counts

**Prompt:** “Compare file rows vs database loaded rows.”

```python
import pandas as pd
from sqlalchemy import create_engine

src = pd.read_csv("inbound/trades_20260729.csv")
engine = create_engine(DB_URL)

tgt = pd.read_sql(
    """
    SELECT trade_id
    FROM dw.fact_trades
    WHERE trade_date = %(d)s
    """,
    engine,
    params={"d": "2026-07-29"},
)

src_ids = set(src["trade_id"].astype(str))
tgt_ids = set(tgt["trade_id"].astype(str))

missing = src_ids - tgt_ids
extra = tgt_ids - src_ids

assert not missing, f"Missing in target (sample): {list(missing)[:10]}"
assert not extra, f"Extra in target (sample): {list(extra)[:10]}"
```

---

### Scenario 3 — DataFrame reconciliation (positions)

**Prompt:** “Reconcile custody vs warehouse in pandas.”

```python
import pandas as pd

custody = pd.read_csv("custody_positions.csv")
warehouse = pd.read_sql("SELECT * FROM dw.fact_positions WHERE as_of_date=%(d)s",
                        engine, params={"d": as_of})

cust = custody.groupby(["account_id", "symbol"], as_index=False)["quantity"].sum()
wh = warehouse.groupby(["account_id", "symbol"], as_index=False)["quantity"].sum()

merged = cust.merge(
    wh,
    on=["account_id", "symbol"],
    how="outer",
    suffixes=("_custody", "_wh"),
    indicator=True,
)

merged["quantity_custody"] = merged["quantity_custody"].fillna(0)
merged["quantity_wh"] = merged["quantity_wh"].fillna(0)
merged["delta"] = merged["quantity_custody"] - merged["quantity_wh"]

breaks = merged[merged["delta"].abs() > 0]
assert breaks.empty, breaks.head(20).to_string()
```

---

### Scenario 4 — Money math with Decimal (not float)

**Prompt:** “Why not use float for fees? Show expected fee calc.”

```python
from decimal import Decimal, ROUND_HALF_UP

def monthly_fee(avg_aum: str, annual_rate: str) -> Decimal:
    aum = Decimal(avg_aum)
    rate = Decimal(annual_rate)
    fee = (aum * rate) / Decimal("12")
    return fee.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

expected = monthly_fee("1200000", "0.01")  # 1000.00
actual = Decimal("1000.00")
assert expected == actual
```

**Say:** “Float binary error can create false breaks or hide real ones.”

---

### Scenario 5 — pytest parametrize golden fee cases

**Prompt:** “How do you table-drive fee tests?”

```python
import pytest
from decimal import Decimal

@pytest.mark.parametrize(
    "avg_aum, rate, expected",
    [
        ("1000000", "0.01", "833.33"),
        ("1200000", "0.01", "1000.00"),
        ("500000", "0.008", "333.33"),
    ],
)
def test_monthly_fee(avg_aum, rate, expected):
    assert monthly_fee(avg_aum, rate) == Decimal(expected)
```

---

### Scenario 6 — Detect duplicates in a DataFrame

**Prompt:** “Find duplicate trade_ids in pandas.”

```python
dups = df[df.duplicated(subset=["trade_id"], keep=False)]
assert dups.empty, dups.sort_values("trade_id").head(20)
```

---

### Scenario 7 — Idempotent load test harness

**Prompt:** “How do you test re-running ETL doesn’t duplicate?”

```python
def test_rerun_idempotent(run_etl, fetch_trade_count):
    run_etl(business_date="2026-07-29")
    count1 = fetch_trade_count("2026-07-29")

    run_etl(business_date="2026-07-29")  # second run
    count2 = fetch_trade_count("2026-07-29")

    assert count1 == count2
    assert fetch_duplicate_trade_ids("2026-07-29") == []
```

---

### Scenario 8 — Compare API JSON to DB

**Prompt:** “API market value must match warehouse.”

```python
import requests

def test_mv_api_matches_db(account_id, as_of, db):
    api = requests.get(
        f"{BASE}/api/accounts/{account_id}/valuation",
        params={"asOf": as_of},
        headers=AUTH,
        timeout=30,
    )
    api.raise_for_status()
    api_mv = Decimal(str(api.json()["marketValue"]))

    row = db.execute(
        "SELECT market_value FROM dw.account_valuation WHERE account_id=:a AND as_of=:d",
        {"a": account_id, "d": as_of},
    ).fetchone()

    db_mv = Decimal(str(row[0]))
    assert abs(api_mv - db_mv) <= Decimal("0.01")
```

---

### Scenario 9 — Soft assertion report (collect all breaks)

**Prompt:** “Don’t fail on first break—return a report.”

```python
def reconcile(custody_df, warehouse_df):
    breaks = []
    merged = custody_df.merge(
        warehouse_df, on=["account_id", "symbol"], how="outer", indicator=True
    )
    for _, r in merged.iterrows():
        if r["_merge"] != "both":
            breaks.append({"type": "MISSING_SIDE", "row": r.to_dict()})
        elif r["qty_x"] != r["qty_y"]:
            breaks.append({"type": "QTY_MISMATCH", "row": r.to_dict()})
    return breaks

def test_positions_recon():
    breaks = reconcile(custody, warehouse)
    assert breaks == [], f"{len(breaks)} breaks; sample={breaks[:5]}"
```

---

### Scenario 10 — File arrival / SLA check

**Prompt:** “Python check that file arrived by cutoff.”

```python
from pathlib import Path
from datetime import datetime

def test_file_arrived_before_cutoff():
    path = Path("/inbound/custody_20260729.csv")
    assert path.exists(), "Custody file missing"
    # mtime timezone assumptions depend on env—call out in interview
    arrived = datetime.fromtimestamp(path.stat().st_mtime)
    cutoff = datetime(2026, 7, 29, 6, 0, 0)
    assert arrived <= cutoff, f"Late file: arrived {arrived}, cutoff {cutoff}"
```

---

## Part C — Classic Python interview questions (testing angle)

**Q: pandas `merge` how=`outer` vs `inner`?**  
Outer keeps mismatches (for recon). Inner hides missing keys—bad for completeness.

**Q: `assert` vs `pytest` raises?**  
`assert` fine in tests; for libraries raise specific exceptions with context.

**Q: How do you handle large files?**  
Chunked reads, SQL pushdown aggregates, sample + full nightly split, Spark if volume requires.

**Q: Mutable default args?**  
Avoid `def f(x=[])`; use `None` then create list—common Python gotcha question.

**Q: GIL relevance?**  
For I/O-bound DB/file tests, multiprocessing/async or just parallel pytest-xdist; CPU-bound pandas may need processes.

**Q: Why pytest fixtures?**  
Inject DB connection, as-of date, golden paths; teardown cleans temp tables.

---

## Part D — Mini whiteboard script they love

```python
# 1 read source & target
# 2 normalize keys/types
# 3 aggregate to business grain
# 4 outer-join compare
# 5 assert no breaks / write break CSV artifact
```

Narrate that flow even before coding.

---

## Part E — What NOT to oversell

If your experience is SDET validation:
- Say pandas + SQL + pytest confidently  
- Don’t claim deep ML/LLM engineering unless true  
- Tie Python to **data quality outcomes** (breaks caught, gates, faster triage)
