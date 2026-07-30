# 2. TypeScript / JavaScript (Layman terms)

## What is JavaScript?

**JavaScript (JS)** is a programming language that commonly runs:
- in websites (frontend)
- and also on servers / test tools (with Node.js)

Playwright tests are often written in JavaScript.

### Analogy

JavaScript is the **language** the robot understands for browser instructions.

---

## What is TypeScript?

**TypeScript (TS)** is JavaScript **with seatbelts**.

You declare what kind of data you expect:
- this field is a number
- that field is text
- this status can only be `"OPEN"` or `"CLOSED"`

If you accidentally treat a money amount like a name, TypeScript warns you **before** the test runs.

### Analogy

| JavaScript | TypeScript |
|------------|------------|
| Packing a suitcase with no labels | Packing with labels: “fragile”, “this side up” |
| Easy to put shoes in the laptop slot | Harder to make that mistake |

---

## Why SDETs care (especially in finance)

Money bugs are expensive.

If an API returns:

```json
{ "marketValue": "125000.00" }
```

and your test assumes it’s a number, JavaScript may behave weirdly.

TypeScript + validation helps catch “shape mismatches” early.

### Simple example of the idea

```text
Expected: marketValue is a number
Received: marketValue is missing
→ Fail fast with a clear message
```

Better than a mysterious UI failure 20 steps later.

---

## What is async / await? (plain English)

Computers often wait for slow things:
- page loading
- API response
- database query

**async/await** means: “wait until this finishes, then continue.”

### Analogy

Ordering food:
- Bad: walk away before your number is called, then complain food isn’t ready  
- Good: wait until your number is called, then pick up the tray

### In tests

If you forget to wait:
- you check the balance before it appears
- test fails randomly (flake)

---

## What is a test data factory?

A **factory** builds fake-but-realistic test data quickly.

### Analogy

A sandwich shop “make me a standard turkey sandwich, but no onions.”  
Defaults + small custom changes.

### Example

```text
Create account:
  type = IRA
  owner = Auto User 17
  currency = USD
  reference = QA-171234-17
```

You don’t hand-type new data every time.

---

## Config and secrets (plain English)

Tests need:
- website URL
- username/password
- database connection

These should **not** be hardcoded in code that gets shared publicly.

### Analogy

You don’t write your ATM PIN on a sticky note stuck to the ATM.

Use environment settings / secret stores (like Azure Key Vault).

---

## Money values: a critical layman warning

In normal coding, people write:

```text
if fee is missing, use 0
```

In finance testing, that can hide a bug.

Missing fee is not “zero fee.”  
Missing fee is “something is wrong — fail the test.”

### Simple rule

> For money fields, silence is dangerous. Missing data should scream.

---

## What interviewers want to hear

- You write clean, readable TypeScript tests  
- You use types to prevent silly mistakes  
- You wait properly (async)  
- You build reusable helpers/factories  
- You treat financial data carefully  

You don’t need to be a pure frontend architect — you need **strong practical coding for quality**.
