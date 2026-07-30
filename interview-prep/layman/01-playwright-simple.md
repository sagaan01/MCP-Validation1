# 1. Playwright & Test Frameworks (Layman terms)

## What is Playwright?

**Playwright** is a tool that lets your computer control a web browser like a human would.

It can:
- Open Chrome/Firefox/Safari
- Click buttons
- Type into forms
- Read text on the screen
- Say “PASS” or “FAIL”

### Everyday analogy

Playwright is like a **robot employee** that sits at a computer, opens the wealth website, and follows a checklist — thousands of times, without getting tired.

---

## What is UI automation?

**UI** = User Interface = what people see (buttons, menus, pages).

**UI automation** = scripts that test those screens automatically.

### Example (manual vs automated)

**Manual:**  
You open the site → login → open account ACC-100 → check if market value shows `$125,000`.

**Automated (Playwright):**  
A script does the exact same steps every night and emails “FAIL” if it sees `$0` or a blank page.

---

## What is a “framework”?

A **framework** is not one test. It’s the **organized toolkit** that makes writing many tests easy and consistent.

### Everyday analogy

| Without framework | With framework |
|-------------------|----------------|
| Every cook brings their own pots, recipes, and rules | A professional kitchen: shared tools, stations, recipes, cleaning rules |

If 10 SDETs write tests with no framework, you get chaos:
- Different login methods
- Different naming
- Hard-to-maintain scripts
- Random failures

A framework gives everyone the same structure.

---

## “Built Playwright frameworks from scratch” — what that means

It means you didn’t only write tests inside an existing project.  
You designed the whole kitchen:

1. Folder structure  
2. Shared login helper  
3. Page objects (see below)  
4. Test data creation  
5. Reporting  
6. Connection to CI/CD pipeline  
7. Coding rules for the team  

### Simple example structure

```text
tests/          ← the checklists (actual tests)
pages/          ← how to interact with each screen
fixtures/       ← ready-made setup (logged-in user, test account)
services/       ← helpers that talk to APIs/databases
config/         ← environments (QA, UAT URLs, secrets)
```

---

## What is a Page Object?

A **Page Object** is a reusable description of one screen.

### Analogy

Instead of every recipe saying “open the third drawer, pick the red-handled spatula…”,  
you write a card: **“Spatula tool”** and recipes just say “use Spatula”.

### Example

**Bad (repeated everywhere):**
- Click the thing with CSS `#abc > div:nth-child(2)`

**Good (page object):**
- `portfolioPage.openAccount("ACC-100")`
- `portfolioPage.getMarketValue()`

If the website HTML changes, you update **one place**, not 200 tests.

---

## What are fixtures? (Playwright idea)

A **fixture** is “stuff already prepared before the test starts.”

### Analogy

Before tasting soup, someone already:
- washed the bowl
- heated the soup
- gave you a spoon

In tests, fixtures might give you:
- a browser already logged in
- an account already created
- an API helper ready to use

So each test focuses on **what it’s checking**, not setup chores.

---

## Why login is special (storageState)

Logging in every test is slow (and MFA/security makes it painful).

Common pattern:
1. Login once
2. Save the “already logged in” cookie/session file
3. Reuse it for many tests

### Analogy

Instead of showing your ID at every store aisle, you get a wristband at the entrance and walk freely.

---

## What is a flaky test?

A **flaky test** sometimes passes, sometimes fails, even when the product didn’t change.

### Analogy

A smoke alarm that randomly beeps when there’s no smoke.  
People start ignoring alarms — dangerous.

### Common causes (plain English)

| Cause | Simple meaning |
|-------|----------------|
| Timing | Script clicked before page finished loading |
| Shared data | Two tests edited the same account at once |
| Bad selectors | Script looked for a button that moved |
| Unstable environment | QA server was down or slow |

### Good habit

Don’t use “wait 5 seconds and hope.”  
Wait for a real signal: “positions table is visible” or “API returned 200.”

---

## Parallel tests & sharding (simple)

**Parallel** = run many tests at the same time (like 4 cooks).  
**Sharding** = split the big suite across multiple machines (like 4 kitchens).

Goal: finish overnight checks faster.

---

## Playwright vs Selenium vs Cypress (plain English)

| Tool | Simple take |
|------|-------------|
| **Selenium** | Older popular robot; powerful but more manual waiting/setup |
| **Cypress** | Great for many JS web apps; historically more browser limits |
| **Playwright** | Modern robot; strong auto-wait, multi-browser, good traces/debug |

For this job: they want **Playwright architecture experience**.

---

## Tiny example in plain English (what a test is doing)

```text
GIVEN an advisor is logged in
AND account ACC-100 has $100,000 cash
WHEN the advisor opens Portfolio
THEN the screen shows cash = $100,000
AND it matches the API and database
```

That’s UI automation with a business purpose.
