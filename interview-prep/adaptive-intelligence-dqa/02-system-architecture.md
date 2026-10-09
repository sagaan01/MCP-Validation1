# 2. System Architecture & Decision Loop

## Layman story

Imagine a city health inspector with **one day** and **200 restaurants**.

A naïve plan: inspect every kitchen for three hours — impossible.  
A lazy plan: inspect none — dangerous.  
A smart plan: use last year’s violations, recent complaints, new ownership, and “how unsure we are,” then decide:

- Quick walkthrough (shallow)  
- Sample of prep stations (medium)  
- Full deep audit (deep)  
- Or skip today and put on next week’s list  

After each visit, update the notebook: who failed, who was clean, which tips were false alarms. Next week’s schedule gets better.

**That notebook + schedule is Adaptive Intelligence for Data Quality Assurance.**  
Restaurants = tables/pipelines. Inspections = validation tests. Complaints = incidents. Notebook = learning store.

---

## Technical meaning

| Story element | System concept |
|---------------|----------------|
| Inspection budget | Compute + SLA window + analyst hours |
| Complaint / history | Prior failure rate, severity, blast radius |
| Uncertainty | Cold-start tables, recent schema change, sparse history |
| Inspection type | Validation method (profile, sample, reconcile, contract, anomaly) |
| Inspection depth | Row %, columns, join complexity, historical lookback |
| Notebook update | Posterior update from outcomes + human labels (FP/TP) |
| City manager | Quality lead / release owner with override rights |

---

## Architecture (text diagram)

```
Sources / APIs / Files
        │
        ▼
 Ingestion / ETL / ELT  ──────────────────────────────┐
        │                                             │
        ▼                                             │
 Staging / Lake / Warehouse / Marts                   │
        │                                             │
        ▼                                             │
┌───────────────────┐     ┌─────────────────────────┐ │
│ Context signals   │     │ Candidate test catalog  │ │
│ - schema diffs    │     │ - rules, SQL, contracts │ │
│ - volume spikes   │     │ - method + max depth    │ │
│ - deploy events   │     │ - cost model            │ │
│ - lineage blast   │     │ - business impact score │ │
│ - prior fail rates│     └───────────┬─────────────┘ │
└─────────┬─────────┘                 │               │
          │                           │               │
          ▼                           ▼               │
     ┌────────────────────────────────────┐           │
     │  Decision engine (adaptive)        │           │
     │  score = E[risk reduction] − cost  │           │
     │  + uncertainty bonus (explore)     │           │
     │  → select method + depth + budget  │           │
     └────────────────┬───────────────────┘           │
                      │                               │
                      ▼                               │
     ┌────────────────────────────────────┐           │
     │  Execution layer                   │◄──────────┘
     │  profile / sample / full / forensic│
     │  gates: warn | fail | quarantine   │
     └────────────────┬───────────────────┘
                      │
                      ▼
     ┌────────────────────────────────────┐
     │  Outcome store                     │
     │  pass/fail, severity, samples,     │
     │  human FP/TP labels, escape events │
     └────────────────┬───────────────────┘
                      │
                      └──► update priors / policy
                           (and optional LLM draft
                            rules → human approve)
```

**End-to-end flow:** Context + catalog → score tests → run chosen subset at chosen depth → record outcomes → update beliefs → next cycle.

---

## Decision loop (say this in interviews)

**I would approach this in four steps.**

1. **Estimate** — For each candidate test, estimate expected value:  
   `value ≈ P(finding issue) × Impact(issue) × UncertaintyWeight − Cost(method, depth)`  
2. **Select** — Fill the nightly/CI budget with highest marginal value; force P0 “must-run” floors.  
3. **Execute** — Run selected method/depth; emit structured results.  
4. **Update** — Adjust failure priors, cost estimates, and explore/exploit balance from outcomes and human feedback.

---

## Validation method ladder

| Depth | Method examples | When selected |
|-------|-----------------|---------------|
| L0 Signal | Schema/contract diff, rowcount vs control, freshness SLA | Cheap continuous monitors |
| L1 Profile | Null %, distinct, min/max, pattern drift | New datasets, cold-start, soft anomalies |
| L2 Sample | Stratified sample reconcile, hash sample | Stable tables, medium uncertainty |
| L3 Full | Full source-to-target, aggregates, RI | Money/identity tables, high uncertainty, incidents |
| L4 Forensic | Point-in-time reconstruct, lineage drill, replay | Sev-1 / audit / disputed numbers |

Adaptive intelligence = **moving tables up/down this ladder** as evidence changes — not deleting the ladder.

---

## Uncertainty (plain English)

Uncertainty is high when:

- Table is new or rarely tested  
- Schema or transform just changed  
- Volume/distribution shifted  
- Recent false negatives (escaped defects)  
- Conflicting outcomes (rule noisy)

**Policy idea:** High uncertainty → spend more (explore). Low uncertainty + stable green → spend less (exploit), keep a cheap canary.

Analogy: multi-armed bandit — each test is an arm; reward is “risk reduced per dollar,” with occasional exploration so you don’t starve rare failure modes.

---

## ETL testing master checklist (still required)

Adaptive scheduling does **not** replace fundamentals. The catalog still covers:

### Source
Schema, types, nulls, duplicates, missing/bad records, file/API contracts  

### Extraction
Full vs incremental vs CDC, watermarks, late data, batch completeness  

### Transformation
Mappings, joins, filters, aggregates, lookups, SCD1/2, cleansing, types  

### Target
Counts, columns, precision, nullability, RI, business rules, reconciliation  

### Data quality dimensions
Completeness, accuracy, consistency, uniqueness, timeliness, validity  

### Operational
Schedule, dependencies, restartability, logging, alerts, audit columns, control totals  

The adaptive layer **orders and deepens** these checks; it does not invent business truth.

---

## Where data fails (and what to test)

```
Source → Ingest → Transform → Store → Serve (BI/API)
  │        │          │         │         │
  │        │          │         │         └─ semantic / dashboard mismatch
  │        │          │         └─ load truncation, type coercion, partition miss
  │        │          └─ wrong join grain, SCD bug, silent filter
  │        └─ partial file, bad watermark, duplicate batch
  └─ upstream null spike, late feed, code-set change
```

Cheap sensors at left (contracts, freshness). Expensive oracles nearer to money metrics (full reconcile). Adaptive system spends expensive budget where uncertainty × impact is highest.

---

## Governance (say this to sound like a lead)

- **Must-run floors:** P0 rules never dropped (e.g., payment uniqueness).  
- **Overrides:** Humans can force deep runs; logged with reason.  
- **Skip is not ignore:** Skipped tests stay in backlog with next-eligible time.  
- **Explainability:** Every run records why selected/skipped (features that drove score).  
- **Escape feedback:** Production incidents automatically raise priors for related assets.  
- **Oracle ownership:** Business + QE own expected results; models only allocate effort.

---

## Comparison table (interview-ready)

| Approach | Idea | Strength | Weakness |
|----------|------|----------|----------|
| Run everything | Full suite nightly | Simple | Costly, slow, alert fatigue |
| Static risk tiers | Manual P0/P1/P2 | Predictable | Stale as systems change |
| Anomaly-only | Stats on metrics | Good drift catch | Weak semantic accuracy |
| **Adaptive intelligence** | Value × uncertainty − cost loop | Efficient, learning | Needs feedback quality + trust model |

**Interview line:** “Static tiers are a good bootstrap prior. Adaptive intelligence is how those tiers stay honest as the platform evolves.”

---

## Real project story (enterprise)

**Business problem:** Nightly DQ suite grew to 4,000 rules; window slipped past 06:00 SLA; analysts ignored 70% of warnings.

**Architecture:** Lakehouse + warehouse marts; Airflow/ADF-style orchestration; SQL DQ rules writing to `dq_results`.

**Testing strategy before:** Everything critical + everything “nice to have” at full depth.

**Adaptive change:**

1. Tagged each rule with impact, cost class, method/depth.  
2. Built priors from 90 days of outcomes + incident tickets.  
3. Decision job selected top budget slice + P0 floors.  
4. Human review labeled false positives weekly → prior update.  

**Defects found:** Schema-change week automatically promoted related tables to L3; caught join-grain bug before BI open.

**Result:** ~45% less DQ compute, fewer noisy alerts, same or better escape rate — with audit trail for auditors.

**Automation:** Decision job in orchestrator; results + explanations in dashboard; CI uses stricter floors for changed pipelines.

---

## Senior / leadership considerations

- Sell **risk reduction and trust**, not “ML for ML’s sake.”  
- Start with **one domain** (finance) before platform-wide.  
- Define success metrics: escaped defects, compute hours, FP rate, time-to-detect.  
- Keep a kill switch back to static tiers.  
- Never claim patentability in interviews unless counsel has cleared it.
