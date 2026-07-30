# 3. API & Backend Testing (Layman terms)

## What is an API?

**API** = Application Programming Interface.

In plain English:

> An API is how two computer systems talk to each other politely using messages.

When you click “Buy 10 AAPL” on a website:
1. The screen (UI) sends a message to a server API  
2. The server checks rules, saves the order  
3. The server sends back “success” or “error”  
4. The screen shows a confirmation  

### Everyday analogy

| UI (screen) | API | Backend systems |
|-------------|-----|-----------------|
| Restaurant dining room | Waiter | Kitchen |

Customers talk to the waiter (API). The waiter talks to the kitchen (backend).  
You can test the dining room, the waiter, or the kitchen separately.

---

## What is backend testing?

**Backend** = the hidden systems behind the screen (services, databases, jobs).

Backend testing checks:
- Did the order save correctly?
- Are permissions enforced?
- Does a failed payment return the right error?
- After a trade settles, does the position update?

Often you test this **without opening a browser**, by sending API messages directly.

---

## Why API testing matters in this job

UI tests are slower and more fragile.  
API tests are faster and closer to business logic.

### Practical strategy (simple)

| Layer | What you check | Speed |
|-------|----------------|-------|
| Many API tests | Rules, calculations, permissions | Fast |
| Fewer UI tests | User journey and screen wiring | Slower |
| Data tests | Final numbers in DB / warehouse | Critical for finance |

---

## REST API in plain English

**REST** is a common style of API using URLs and actions like:
- GET = read
- POST = create
- PUT/PATCH = update
- DELETE = remove

### Example

```text
POST /api/accounts
  body: { type: "IRA", ownerName: "Pat" }

Response: { id: "ACC-55", status: "OPEN" }
```

Then:

```text
GET /api/accounts/ACC-55/positions
Response: { positions: [...] }
```

---

## GraphQL in plain English

**GraphQL** is another API style where the client asks for exactly the fields it needs in one query.

### Analogy

REST: “Give me the whole binder.”  
GraphQL: “Give me only page 3 and the chart on page 7.”

You still test: correct data, errors, and permission rules.

---

## What is contract testing?

A **contract** is an agreement: “If I call you this way, you respond in this shape.”

### Analogy

A plug and socket standard.  
If one side changes hole sizes, devices break.

Contract tests catch “team A changed response fields and team B’s app broke.”

---

## Eventual consistency (very important)

Sometimes the API says “order accepted,” but positions update a few seconds/minutes later.

That’s **eventual consistency**: correct at the end, not instantly.

### Analogy

You transfer money in a banking app:
- Immediate message: “Transfer submitted”
- Balance updates after processing

### How testers handle it

Don’t fail immediately.  
Retry/poll for a limited time:
- “Wait until MSFT quantity becomes 5, timeout 60 seconds.”

---

## Security-style API checks (simple examples)

In wealth systems, this is huge:

> Advisor A must not read Advisor B’s accounts.

### Example test idea

```text
Login as Advisor A
Try GET /accounts/BELONGS-TO-B
Expect: 403 Forbidden (not 200 with data)
```

Also test:
- negative quantities rejected
- duplicate submit doesn’t double-charge (idempotency)
- missing auth token rejected

---

## API testing tools (plain English)

| Approach | Meaning |
|----------|---------|
| Playwright `request` | Same project can do UI + API |
| Postman | Handy manual/exploration collections |
| RestAssured (Java) | Code-based API tests in Java shops |
| Code-first in CI | Best for Principal-level gates and reuse |

For interviews: say you explore in Postman, then harden into code in the pipeline.

---

## Mini end-to-end backend story

```text
1) API creates brokerage account
2) API funds $100,000
3) API places buy order
4) Wait until position appears
5) SQL confirms quantity and cash reduced
6) (Optional) UI shows same numbers
```

That’s API + data thinking — exactly what this role wants.
