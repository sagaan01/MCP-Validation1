# 6. AI in Testing — Copilot, GenAI, AI-assisted QA (Layman terms)

## What people mean by “AI-assisted testing”

Using AI tools to help humans test faster and smarter — **not** replacing human judgment on money correctness.

Common tools/ideas:
- **GitHub Copilot** (AI pair-programmer in your editor)
- ChatGPT-style assistants
- AI that summarizes failures/logs
- AI that drafts test ideas from requirements

---

## What is GitHub Copilot? (plain English)

Copilot suggests code while you type — like autocomplete on steroids.

### Analogy

A junior assistant who drafts emails quickly.  
You still read and correct them before sending.

### Good uses for SDETs

- draft Page Object boilerplate  
- suggest test structure  
- write repetitive pipeline YAML  
- draft first-version SQL  

### Bad uses (especially finance)

- blindly trust AI fee formulas  
- paste real client PII into public AI tools  
- accept brittle tests with random waits and weak assertions  

---

## What is GenAI?

**GenAI (Generative AI)** = AI that creates new content (text, code, ideas).

In QA it can generate:
- test cases from a user story
- sample data ideas
- draft automation code
- failure summaries

### Analogy

A brainstorming partner that talks a lot.  
Sometimes brilliant, sometimes confidently wrong.

---

## “AI testing” vs “testing AI”

These are different:

| Phrase | Meaning |
|--------|---------|
| AI-assisted testing | Using AI to help test normal software |
| Testing AI systems | Checking an AI product’s behavior/safety |

This job mostly means **AI-assisted testing**.

---

## Why companies want this now

Pressure:
- deliver faster
- fewer people doing repetitive work
- improve productivity

Risk:
- wrong tests give false confidence (“green” but money is wrong)

So Principal SDETs must bring **guardrails**.

---

## Guardrails in plain English (rules of the road)

1. **Approved tools only** (company Copilot/tenant, not random websites for sensitive data)  
2. **No real customer data** in prompts  
3. **AI output is draft** until a human reviews  
4. **Money/security assertions need senior review**  
5. **Measure results** (faster delivery without more production bugs)

### Example PR checklist

```text
[ ] Used AI assistance?
[ ] Manually reviewed business assertions?
[ ] No PII pasted into AI tools?
```

---

## Concrete examples

### Example A — helpful

Story: “Advisor can filter positions by symbol.”  
AI drafts a Playwright test outline.  
You fix locators and assert the filtered row count/symbol.

### Example B — dangerous

AI writes:
```text
expected fee = aum * 0.01
```
But real rule has breakpoints/waivers/proration.  
Test passes while billing is wrong.  
**False safety.**

### Example C — failure triage

50 tests failed overnight.  
AI clusters errors into “login expired”, “selector changed”, “QA DB refresh”.  
You verify top cluster and assign owners faster.

---

## Self-healing tests (plain English)

Some tools try to auto-fix broken selectors (“button moved, I’ll click the new one”).

Sounds magical. Risk: it may click the **wrong** button and still pass.

For money movement screens, be cautious. Prefer stable test IDs and clear failures.

---

## How to talk about AI in the interview

Strong message:

> “I use AI to accelerate boilerplate and ideation, with strict guardrails. In wealth systems, deterministic data checks and human-reviewed assertions remain the release authority. AI helps speed; it doesn’t own financial truth.”

That sounds Principal-level and responsible.
