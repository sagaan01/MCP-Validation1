# 10. Mobile, Java & Cross-Stack Testing (Layman terms)

## Why this appears in the job description

They want a **broad SDET**, not only a Playwright specialist:
- web UI
- APIs
- data
- maybe mobile apps
- maybe Java ecosystems

Playwright + TypeScript is the focus, but breadth is a plus.

---

## Mobile testing in plain English

Many wealth clients use:
- responsive websites on phones
- native iOS/Android apps
- hybrid apps (website inside an app shell)

### What you typically check on mobile

- login / biometrics fallback
- account summary readability
- basic trade or money movement flows
- notifications/disclosures
- permission prompts (camera/notifications)

### Analogy

Desktop testing is checking a full kitchen.  
Mobile testing also checks whether the same meal works in a tiny food truck space (smaller screen, touch, OS dialogs).

---

## Tools you’ll hear

| Tool | Plain meaning |
|------|---------------|
| **Appium** | Popular robot for native mobile apps |
| **Playwright device projects** | Emulate phone browsers for web apps |
| **Device farm** | Cloud phones/devices to run smoke tests |

Strategy tip: keep mobile UI tests thin; still validate money rules via API/data.

---

## What is Java doing in an SDET conversation?

**Java** is a major enterprise programming language.

Many banks/financial firms have:
- Java backend services
- Java test stacks (JUnit, RestAssured, Selenium)

Even if this role highlights TypeScript/Playwright, knowing Java patterns shows you can work in mixed environments.

### Analogy

Being bilingual.  
Same testing ideas, different language accent.

---

## RestAssured in one sentence

A Java library for writing API tests in code.

Same idea as Playwright API tests, different syntax ecosystem.

---

## Selenium → Playwright migration (plain English)

Old robot scripts (Selenium) may still exist.

Principal approach is usually **not** “rewrite everything this month.”

Instead (strangler approach):
1. New critical journeys in Playwright  
2. Keep legacy Selenium for a while  
3. Move highest-risk paths first  
4. Share test data helpers  
5. Retire Selenium when coverage is safe  

### Analogy

Renovating a house room by room while still living in it.

---

## Cross-stack testing = testing all layers together as a strategy

```text
Business workflow (example: buy stock)
   ├── Mobile/Web UI checks (user can do it)
   ├── API checks (rules enforced)
   └── Data checks (position/cash correct in DB)
```

### Simple rule of thumb

> Check business truth at the lowest reliable layer.  
> Use UI to prove the user journey and permissions.  
> Use data recon to prove money correctness.

---

## Example: one feature, three layers

Feature: “Advisor transfers cash between two accounts.”

| Layer | Example check |
|-------|----------------|
| UI | Form validation, confirmation message |
| API | Transfer rejected if insufficient funds |
| Data | Account A cash down, Account B cash up by same amount |

That’s cross-stack thinking.

---

## Interview answer in layman words

> “I’m strongest in Playwright and data validation, and I can work across Java API stacks and mobile smoke coverage. I choose the lightest reliable layer for each risk and keep end-to-end UI journeys focused on what users actually do.”
