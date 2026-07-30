# 6. AI-Driven Quality Engineering

**Why this matters:** JD explicitly wants Copilot, AI-assisted testing, GenAI adoption with **guardrails**—not hype.

---

## Core concepts

- Copilot for code acceleration vs hallucination risk
- AI for test generation, failure triage, log summarization
- Prompt patterns for deterministic outputs
- Human-in-the-loop review
- Data privacy: no prod PII in prompts
- Measuring productivity without sacrificing quality

---

## Q1. “How have you used GitHub Copilot as an SDET?”

### Answer

“Copilot is a force multiplier for boilerplate—Page Objects, factory functions, SQL drafts, pipeline YAML—**after** I define architecture. I never accept financial assertion logic blindly. Workflow:

1. I write the interface / fixture design  
2. Copilot fills repetitive implementations  
3. I run typecheck + tests  
4. Peer review focuses on assertions and data rules  

Net: faster scaffolding, same quality bar.”

### Example prompt you can mention

> “Generate a Playwright Page Object for a positions grid with getByRole locators, no waits with sleep, TypeScript strict.”

---

## Q2. “What is AI-assisted testing in practice?”

| Use case | Example | Guardrail |
|----------|---------|-----------|
| Generate test cases from AC | Story → Gherkin / test outline | BA/QE review |
| Generate Playwright code | From user flow recording notes | Locator strategy check |
| Failure analysis | Summarize trace/error clusters | Verify against raw log |
| Test data ideation | Edge cases for fees | Compliance review |
| Flaky classification | Cluster failures by error signature | Confirm not env outage |
| Doc generation | Framework README | Engineer edits |

---

## Q3. “How would you introduce AI to a QA org as Principal?”

### Answer (change program)

1. **Pilot** 2 teams, 4 weeks, clear metrics (time to automate story, PR cycle time, defect escape).  
2. **Standards** — approved tools, prompt library, secret/PII policy.  
3. **Training** — live sessions: good prompts, bad outputs.  
4. **Review checklist** — AI-generated code marked in PR template.  
5. **Expand** only if metrics move without flake/escape regressions.

### Sample PR template checkbox

```markdown
- [ ] AI-assisted code used (Copilot/ChatGPT/etc.)
- [ ] All assertions manually reviewed for business correctness
- [ ] No production data / PII pasted into AI tools
```

---

## Q4. “Risks of GenAI in financial QA?”

| Risk | Mitigation |
|------|------------|
| Wrong fee formula in test (false green) | Dual control: rule catalog + peer review |
| PII leakage to public LLM | Enterprise Copilot tenant; redact; local models for sensitive |
| Unmaintainable generated suites | Architecture templates first |
| Hallucinated APIs | Prefer OpenAPI-driven generation |
| Over-trust | AI never owns release gate alone |

---

## Q5. “Example: AI-generated tests you would reject.”

```ts
// BAD AI output — brittle, sleep, weak assertion
await page.waitForTimeout(5000);
await page.click('#btn1');
expect(await page.screenshot()).toBeTruthy();
```

**You say:** “I reject screenshot-as-assertion and CSS-id coupling. I’d regenerate with role locators and business expect on market value.”

---

## Q6. “AI for test failure triage — sample workflow.”

1. Collect last 50 failed job logs.  
2. Prompt: cluster by root cause categories (auth, selector, data, env).  
3. Engineer validates top cluster.  
4. Create tickets with owners.  
5. Feed recurring patterns into flake dashboard.

### Example prompt

> “Given these Playwright error messages, group into root-cause categories and propose the smallest code fix for the top cluster. Do not invent file paths not present in the log.”

---

## Q7. “Can AI replace data reconciliation tests?”

### Answer

“No. AI can **propose** SQL and spot anomalies in samples, but financial reconciliation must be deterministic, versioned, and auditable. AI assists authoring; the gate is code + SQL under source control with expected results.”

---

## Q8. “Responsible AI policy bullet points you’d publish.”

1. Use only company-approved AI tools.  
2. No client PII, account numbers, or production extracts in prompts.  
3. AI output is draft until human review.  
4. Security/authz tests require senior review.  
5. Track AI-assisted commits for retrospectives—not blame.  
6. Prefer retrieval from internal rule catalogs over free-form math.

---

## Q9. “Demo story: Copilot accelerating a Playwright fixture.”

**Before:** ½ day to hand-write auth + API seed fixtures.  
**After:** 1–2 hours with Copilot completing repetitive wiring; you spend time on isolation design and assertions.  
**Metric:** story automation lead time ↓ 30% in pilot; flake rate unchanged.

---

## Q10. “Self-healing locators — your stance?”

### Answer

“Cautious. Self-heal can hide product breakage or silently retarget wrong controls—dangerous for money movement UIs. I prefer resilient locators + design system test IDs. If self-heal used, require report of healed selectors and fail if heal confidence < threshold.”

---

## Q11. “Generate test cases from a user story (interview exercise).”

**Story:** “As an advisor, I can open a Trust account with successor trustee.”

**AI-assisted outline you refine:**

| ID | Case | Type |
|----|------|------|
| T1 | Happy path open Trust | UI+API |
| T2 | Missing successor trustee validation | UI |
| T3 | Unauthorized opener role | API |
| T4 | Account appears in custody feed T+0/T+1 | Data |
| T5 | Fee schedule assignment default | Data |
| T6 | Audit event written | Backend |

---

## Q12. “How do you measure AI adoption success?”

- % stories with automated tests in same sprint  
- PR cycle time for automation PRs  
- Review comments related to incorrect assertions (should not rise)  
- Engineer NPS on Copilot  
- Escape defects (must not worsen)
