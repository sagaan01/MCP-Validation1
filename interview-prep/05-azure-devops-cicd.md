# 5. Azure DevOps, CI/CD & Quality Gates

**Why this matters:** Role explicitly wants Azure DevOps pipeline design, test stages, quality gates, and traceability.

---

## Core concepts

- YAML pipelines vs classic
- Stages: Build → Unit → UI Smoke → Deploy DEV → Integration → QA → Gates → PROD
- Test results publishing (JUnit / TRX / Playwright)
- Environments + approvals
- Branch policies + PR builds
- Variable groups, Key Vault, service connections
- Parallel jobs / matrix / sharding
- Traceability: Work items ↔ Test cases ↔ Builds ↔ Releases

---

## Q1. “Design a CI/CD quality strategy for a wealth platform.”

### Answer (architecture narrative)

“PR pipeline is fast and blocking; nightly is deep; release is evidence-based.

**PR (≤15–20 min):** compile, unit, lint, contract diff, Playwright `@smoke` (Chromium), API smoke.  
**Merge to main:** deploy to DEV, integration suite, critical UI.  
**Nightly:** full UI matrix, `@data` reconciliation post-ETL, performance smoke.  
**Release candidate:** quality gate dashboard—open Sev1/Sev2, flake rate, coverage of regulatory journeys, data recon break count = 0.

Gates fail the release, not just email a report.”

---

## Q2. “Sample Azure Pipeline for Playwright?”

```yaml
# azure-pipelines-playwright.yml
trigger:
  branches:
    include: [main, develop]
pr:
  branches:
    include: [main, develop]

pool:
  vmImage: ubuntu-latest

variables:
  - group: qa-secrets
  - name: NODE_VERSION
    value: '20.x'

stages:
  - stage: Validate
    jobs:
      - job: Smoke
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)

          - script: npm ci
            displayName: Install dependencies

          - script: npx playwright install --with-deps chromium
            displayName: Install browsers

          - script: npm run typecheck && npm run lint
            displayName: Typecheck and lint

          - script: npx playwright test --grep @smoke --reporter=junit
            displayName: Playwright smoke
            env:
              BASE_URL: $(BASE_URL)
              WM_USER: $(WM_USER)
              WM_PASS: $(WM_PASS)

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: JUnit
              testResultsFiles: '**/junit.xml'
              failTaskOnFailedTests: true
            condition: always()

          - task: PublishPipelineArtifact@1
            inputs:
              targetPath: playwright-report
              artifact: playwright-report
            condition: always()
```

---

## Q3. “What is a quality gate? Give examples.”

### Answer

“A quality gate is an automated or manual checkpoint that **prevents promotion** unless criteria pass.”

| Gate | Criteria example |
|------|------------------|
| Build | No compile errors; unit pass ≥ 100% of suite |
| PR | Smoke UI + API green; no new lint errors |
| QA deploy | Integration pass; data recon blockers = 0 |
| Release | Zero open Sev1; flake rate < 2%; UAT sign-off work item Done |
| Hotfix | Accelerated checklist + mandatory post-deploy recon |

### Azure DevOps gate ideas

- Query work items: `Severity=1 AND State<>Closed` must be 0  
- Invoke REST check: data-quality API returns `status=PASS`  
- Manual approval by QA lead + Product for production  

---

## Q4. “How do you publish Playwright results into Azure Test Plans?”

### Answer

“Map automated tests to Test Plan cases via IDs in titles/annotations, publish with `PublishTestResults`, and optionally use Azure DevOps REST to update outcomes. Traceability: each requirement has acceptance tests linked; pipeline run shows requirement coverage.”

```ts
test('TC-1045: display YTD performance @smoke', async ({ page }) => {
  // title embeds Test Case ID for reporting parsers
});
```

---

## Q5. “Secrets management?”

### Answer

“Never commit secrets. Use Variable Groups + Azure Key Vault integration. Rotate service principals. Mask logs. Separate secrets per environment. Locally use `.env` gitignored + dotenv.”

```yaml
variables:
  - group: wm-qa-keyvault # linked to Key Vault
```

---

## Q6. “Flaky test policy in pipeline?”

### Answer

1. Retry once on CI only for UI.  
2. Quarantine tag `@flaky` excluded from PR gate but reported.  
3. Dashboard: top flaky tests weekly; owner SLA 5 days.  
4. If flake rate > threshold, freeze new feature test merges until cleanup.

```yaml
# PR excludes flaky
- script: npx playwright test --grep @smoke --grep-invert @flaky
```

---

## Q7. “Multi-stage deploy with environment approvals?”

```yaml
stages:
  - stage: DeployQA
    jobs:
      - deployment: Deploy
        environment: WM-QA
        strategy:
          runOnce:
            deploy:
              steps:
                - script: ./deploy.sh qa

  - stage: DataQuality
    dependsOn: DeployQA
    jobs:
      - job: Recon
        steps:
          - script: npm run test:data

  - stage: DeployUAT
    dependsOn: DataQuality
    jobs:
      - deployment: Deploy
        environment: WM-UAT # requires approvers
        strategy:
          runOnce:
            deploy:
              steps:
                - script: ./deploy.sh uat
```

---

## Q8. “Branch policies you recommend?”

- Require PR build success  
- Require 1–2 reviewers (CODEOWNERS for `/automation`)  
- Enforce linked work items  
- Deny force push on main  
- Optional: required status checks for contract + smoke  

---

## Q9. “How do you optimize pipeline time?”

- Cache `node_modules` / Playwright browsers  
- Shard Playwright across agents  
- Run changed-path tests on PR (`git diff` → impacted packs)  
- Containerized runners with pre-baked browsers  
- Fail fast: lint/typecheck before heavy E2E  

```yaml
- task: Cache@2
  inputs:
    key: 'npm | "$(Agent.OS)" | package-lock.json'
    path: node_modules
```

---

## Q10. “Traceability story for auditors / compliance?”

### Answer

“Requirement (Azure Board) → Test cases / automated tests → Pipeline run ID → Evidence artifacts (report, recon CSV) → Release work item. For wealth/regulatory changes I keep an evidence pack per release: what tested, what waived, who approved.”

---

## Q11. “Classic vs YAML pipelines?”

“YAML-as-code for reviewability and reuse (templates). Classic only for legacy. Shared templates for Node install, Playwright, publish results.”

```yaml
# templates/playwright-smoke.yml
parameters:
  grep: '@smoke'
steps:
  - script: npx playwright test --grep ${{ parameters.grep }}
```

---

## Q12. “Quality metrics you report to leadership?”

| Metric | Target example |
|--------|----------------|
| PR smoke pass rate | ≥ 98% |
| Escape defects (prod Sev1/2) | Trend down QoQ |
| Flake rate | < 2% |
| Mean time to detect data break | < 1 hour after ETL |
| Automation coverage of critical journeys | Explicit % of risk catalog |
| Lead time for new automated scenario | Continuous improvement |
