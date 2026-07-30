# 12. Cheat Sheet — 60-Second Answers

Use these as memory anchors the day before the interview.

---

## Playwright

- **Framework layers:** config → fixtures → thin POMs → domain API/DB services → tests → reporters → CI gates  
- **Auth:** setup project + `storageState`; don’t solve MFA every test  
- **Flakes:** no sleeps; unique data per worker; wait on responses; quarantine with owners  
- **Vs Selenium/Cypress:** Playwright for new enterprise TS frameworks; migrate via strangler  

## TypeScript

- Strict mode + Zod runtime validation for financial payloads  
- Factories for data; never silent `?? 0` on money  
- PR: lint + typecheck + smoke  

## API

- Contracts on PR; journeys thin; poll for eventual consistency  
- Authz negative tests mandatory in WM  
- Idempotency keys for money posts  

## Data / ETL / SQL

- Completeness, accuracy, consistency, timeliness  
- FULL OUTER JOIN recon for positions; fee expected vs actual  
- DECIMAL tolerances agreed with finance  
- Nightly post-ETL suite + release blocker severity  

## Azure DevOps

- PR smoke gate; nightly deep; release evidence  
- PublishTestResults + artifacts + Key Vault secrets  
- Quality gate = prevent promotion, not just report  

## AI

- Copilot accelerates boilerplate; humans own assertions  
- No PII in prompts; enterprise tools; PR checkbox  
- AI drafts SQL/tests; deterministic gates remain code  

## Wealth domain

- Lifecycle: onboard → fund → trade → fee → report → close  
- Identities: cash & positions reconcile to equity  
- Trust/advisory permissions & fee/performance pitfalls  
- Risk order: money movement & authz first  

## UAT strategy

- Workflow matrix with business; automate repetition  
- Entry/exit criteria; personas; sign-off in Azure Boards  
- 90-day plan: assess → standards+smoke+recon → UAT matrix+AI pilot  

## Principal leadership

- Metrics-first influence; ADRs; guild; mentorship matrix  
- Shared ownership with devs (unit/contract) vs QE (cross-cutting + DQ)  
- Speak risk to executives, workflows to business, testability to eng  

---

## Day-of checklist

- [ ] 90-second pitch memorized with **your** metrics  
- [ ] One Playwright architecture whiteboard ready  
- [ ] One SQL recon whiteboard ready  
- [ ] One Azure pipeline stage diagram ready  
- [ ] One AI governance paragraph ready  
- [ ] Two STAR mentoring/influence stories  
- [ ] Two STAR data-quality / incident stories  
- [ ] Questions for them prepared  
- [ ] Examples of frameworks you built (repo stories, even if private—describe structure)

---

## Sample whiteboard sketches (ASCII)

### Framework

```text
Test  →  Fixture(auth,api,db)  →  Page Object
                ↓
         Domain Services
                ↓
         App / API / DB
```

### Pipeline

```text
PR: lint → unit → api smoke → ui smoke → (block merge)
Main: deploy DEV → integration → 
Nightly: full UI + data recon
Release: gates (sev, recon, UAT signoff) → PROD
```

### Recon

```text
Custody → Staging → Transform → Warehouse
                \________________/
                   row/aggregate
                   compare → breaks
```
