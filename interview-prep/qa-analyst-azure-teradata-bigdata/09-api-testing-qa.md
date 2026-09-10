# API Testing — Interview Questions & Answers (Basic → Lead)

REST/SOAP contracts, auth, negative testing, CI gates, security basics, performance, and API↔ETL/data validation for Senior QA interviews.

**Total questions:** 66

Levels: **B**=Basic, **P**=Practical, **S**=Senior, **L**=Lead/Architect

---

## Q1. [B] What is API testing?

**Answer:** Validating that application programming interfaces meet functional, contract, security, performance, and reliability expectations—usually without a UI.

**Say:** “I test the business rules and data contracts at the service boundary with clear request/response evidence.”

---

## Q2. [B] Why is API testing important for data/ETL roles?

**Answer:** Many pipelines ingest from REST/SOAP APIs or expose data APIs downstream. Broken contracts cause silent ETL gaps, schema drift, and bad gold tables.

---

## Q3. [B] What is REST?

**Answer:** Architectural style using HTTP methods on resources, typically JSON payloads, stateless calls, and standard status codes.

---

## Q4. [B] SOAP vs REST?

**Answer:** SOAP is XML/contract-heavy (WSDL), often enterprise. REST is lighter HTTP+JSON. Testing differs: XML schema/WS-Security vs JSON schema/OAuth.

---

## Q5. [B] What are common HTTP methods?

**Answer:** GET (read), POST (create/action), PUT (replace), PATCH (partial update), DELETE (remove). Idempotency expectations differ—PUT/DELETE often idempotent; POST usually not.

---

## Q6. [B] What are HTTP status codes you must know?

**Answer:** 2xx success (200/201/204), 3xx redirect, 4xx client errors (400/401/403/404/409/422), 5xx server errors (500/502/503). Never assert only “not 500.”

---

## Q7. [B] What is a request vs response?

**Answer:** Request = method + URL + headers + body. Response = status + headers + body. QA validates both sides against the contract.

---

## Q8. [B] What is an API endpoint?

**Answer:** Specific URL path representing a resource/action, e.g. `GET /api/v1/customers/{id}`.

---

## Q9. [B] What is JSON?

**Answer:** Lightweight data format of objects/arrays/scalars. Validate structure, types, nulls, and required fields.

---

## Q10. [B] What is an API contract?

**Answer:** Agreed request/response shape, status codes, auth, and error model—often OpenAPI/Swagger. Contract tests catch breaking changes early.

---

## Q11. [B] Authentication vs authorization?

**Answer:** Authentication proves identity (who). Authorization proves permissions (what). Test both: valid login still forbidden for wrong role.

---

## Q12. [B] What is a bearer token / JWT (high level)?

**Answer:** Token sent in `Authorization: Bearer <token>`. JWT carries claims/expiry. Test expiry, invalid signature, missing token.

---

## Q13. [B] What tools are commonly used?

**Answer:** Postman/Newman, RestAssured, Playwright/Supertest, Karate, pytest+requests, SoapUI, JMeter/k6 for load. Method > brand.

---

## Q14. [B] Positive vs negative API tests?

**Answer:** Positive = valid inputs succeed. Negative = invalid/missing/unauthorized inputs fail with correct status and error body.

---

## Q15. [B] What is idempotency in APIs?

**Answer:** Repeating the same request leaves the system in the same state (e.g., PUT). Test double-submit does not create duplicate records.

---

## Q16. [P] How do you design API test cases from a Swagger/OpenAPI?

**Answer:** Enumerate operations; for each: happy path, required-field missing, type mismatches, auth cases, boundary values, pagination, and documented error codes. Trace cases to operations.

---

## Q17. [P] How do you validate a JSON response?

**Answer:** Assert status, required fields present, data types, value rules, arrays length, nested objects, and no unexpected PII leakage. Prefer schema validation + business assertions.

---

## Q18. [P] Example: assert customer API with SQL backend.

**Answer:** Call `GET /customers/1001` → status 200 → `customerId=1001` → then SQL `SELECT * FROM customer WHERE id=1001` and compare name/status. Links API testing to data testing.

---

## Q19. [P] How do you test path vs query parameters?

**Answer:** Path identifies resource (`/orders/55`); query filters (`?status=OPEN&page=2`). Test missing path param (404), invalid query (400), and filter correctness vs DB.

---

## Q20. [P] How do you test headers?

**Answer:** Content-Type, Accept, Authorization, correlation IDs, caching headers. Negative: wrong Content-Type returns 415 if specified.

---

## Q21. [P] How do you test pagination?

**Answer:** page/size or cursor; assert total/count consistency; no overlap/duplicates across pages; last page behavior; invalid page returns clear error.

---

## Q22. [P] How do you test sorting and filtering?

**Answer:** Known dataset; assert order; combine filters; empty result 200 with []; SQL-injection-like filter strings rejected/safe.

---

## Q23. [P] PUT vs PATCH testing differences?

**Answer:** PUT sends full resource—omitted fields may reset. PATCH changes subset—omitted fields remain. Design cases proving each contract.

---

## Q24. [P] How do you test DELETE?

**Answer:** Delete existing → 200/204; GET afterward 404; delete again (idempotent 404/204 per contract); DB soft-delete flags if used.

---

## Q25. [P] How do you test error payloads?

**Answer:** Assert stable error schema: `code`, `message`, `traceId`. Don’t accept empty 500 bodies. Message should be actionable without leaking secrets.

---

## Q26. [P] What is schema validation?

**Answer:** Validate response against JSON Schema/OpenAPI. Catches field rename/type drift before business asserts fail mysteriously.

---

## Q27. [P] How do you manage test data for APIs?

**Answer:** Create via API/setup scripts; isolate with unique keys; cleanup; avoid depending on uncleared shared prod-like data; seed reference data.

---

## Q28. [P] Chained API tests (end-to-end flow)?

**Answer:** Create → Get → Update → Get → Delete. Store IDs from responses; assert final DB state. Good for critical journeys.

---

## Q29. [P] How do you test file upload/download APIs?

**Answer:** Valid file types/sizes; virus/empty/corrupt files; content-disposition; checksum of downloaded bytes; auth on download links.

---

## Q30. [P] Rate limiting tests?

**Answer:** Burst over limit → 429 + Retry-After if documented; ensure legitimate traffic still works; no security bypass.

---

## Q31. [P] CORS—do QA mention it?

**Answer:** Browser-security concern. For pure backend API QA, lower priority unless UI clients blocked; validate allowed origins if in scope.

---

## Q32. [S] How do you approach contract testing (consumer-driven)?

**Answer:** Consumers publish expectations; providers verify in CI (Pact-like). Prevents breaking mobile/ETL consumers. Pair with OpenAPI provider verification.

---

## Q33. [S] API testing in CI/CD—what do you run when?

**Answer:** PR: fast contract + smoke. Nightly: broader regression + negative packs. Pre-prod: full critical flows + light performance. Fail build on contract break.

---

## Q34. [S] How do you test APIs that feed ETL/Databricks pipelines?

**Answer:** Validate API pagination completeness, incremental `updated_since` correctness, schema stability, and that pipeline watermark matches API semantics. Reconcile landed rows to API counts for a window.

---

## Q35. [S] Flaky API tests—root causes and fixes?

**Answer:** Shared mutable data, eventual consistency, time dependencies, env instability. Fixes: unique data, waits on resources, deterministic clocks, isolate envs, retry only idempotent GETs carefully.

---

## Q36. [S] How do you test eventually consistent APIs?

**Answer:** Poll with timeout/backoff for read-after-write; assert consistency window documented; don’t hard-fail at T+0 if SLA is T+2s—assert within SLA.

---

## Q37. [S] Security tests you can do as QA (ethical/safe).

**Answer:** Authn/z matrix, expired tokens, IDOR (access other user’s resource IDs), mass assignment on PATCH, input validation, sensitive data in logs/responses. No destructive exploitation outside approved scope.

---

## Q38. [S] What is IDOR and how do you test it?

**Answer:** Insecure Direct Object Reference—change `orderId` to another user’s and expect 403/404, not 200 with their data.

---

## Q39. [S] How do you validate backward compatibility?

**Answer:** Run consumer suites against new provider; additive fields OK; removing/renaming/type changes are breaking unless versioned. Maintain v1 while v2 rolls out.

---

## Q40. [S] GraphQL testing differences?

**Answer:** Single endpoint; query shape decides payload; test required fields, depth limits, auth on fields, error extensions, and N+1 performance risks.

---

## Q41. [S] gRPC testing high level?

**Answer:** Binary protobuf contracts; use grpcurl/Postman; validate status codes, deadlines, streaming; schema compatibility via protobuf evolution rules.

---

## Q42. [S] How do you performance-test an API meaningfully?

**Answer:** Define SLA (p95 latency, error rate, throughput); realistic payloads/auth; ramp users; watch server saturation; compare against baseline; functional correctness under load (not only “200s”).

---

## Q43. [S] Correlate API defects to data defects.

**Answer:** Example: POST succeeds but DB transaction rolled back partially; or API rounds decimals differently than warehouse. Always dual-check critical writes in DB.

---

## Q44. [S] Versioning strategies and test impact.

**Answer:** URL (`/v1`) vs header versioning. Tests pin version; regression matrix across supported versions until deprecation date.

---

## Q45. [L] Build an API test strategy for a multi-service platform.

**Answer:** Risk-based critical journeys; contract tests per service; shared auth fixtures; env data management; non-functional pack; ownership RACI; quality gates in pipeline; observability of test results.

---

## Q46. [L] How do you set API quality gates?

**Answer:** Example: 0 Sev-1 functional; contract tests green; p95 < SLA; OWASP smoke pass; no open IDOR on critical resources; changelog reviewed for breaks.

---

## Q47. [L] API testing vs UI testing—allocation?

**Answer:** Push business rules to API layer (faster/stable); keep thin UI smoke for wiring. Most ROI is API + data validation for enterprise systems.

---

## Q48. [L] How do you lead triage when API and ETL teams disagree?

**Answer:** Reproduce with request logs + correlation ID + landed file/table evidence; decide layer by proof; publish joint contract fix; add paired regression (API + pipeline).

---

## Q49. [L] Estimate API automation effort.

**Answer:** # endpoints × complexity (auth, chaining, async) × env constraints + framework setup + CI + data factories + maintenance factor.

---

## Q50. [L] Define Definition of Done for an API change.

**Answer:** OpenAPI updated; unit+contract+integration tests; security checklist; performance smoke if hot path; consumer notify; monitor dashboards for error spikes post-release.

---

## Q51. [B] What is a base URL / environment?

**Answer:** Host root for an env (`https://api-test.company.com`). Tests switch env config without rewriting cases.

---

## Q52. [B] What is a collection in Postman terms?

**Answer:** Group of requests/tests/variables runnable together—often exported to Newman in CI.

---

## Q53. [P] How do you assert response time in functional suites?

**Answer:** Soft assert against a generous threshold to catch gross regressions; leave precise SLA to performance tests to avoid flaky CI.

---

## Q54. [P] Form-urlencoded vs multipart vs raw JSON?

**Answer:** Different body encodings. Wrong Content-Type is a common defect—test each content type the API claims to support.

---

## Q55. [S] Async APIs (202 + poll / webhooks)—how test?

**Answer:** Submit → receive 202/location → poll until terminal state within SLA → verify final resource/DB. For webhooks: signed payload, retry behavior, idempotent consumer handling.

---

## Q56. [S] How do you test retry-safe clients against your API?

**Answer:** Simulate client retries with Idempotency-Key header if supported; prove single business effect; document required keys for POST payments/orders.

---

## Q57. [L] Governance: preventing undocumented endpoints?

**Answer:** Lint OpenAPI in CI; fail if routes exist without spec; periodic inventory scan; treat spec as source of truth for QA coverage metrics.

---

## Q58. [P] SOAP fault testing.

**Answer:** Invalid XML, failed auth, business faults—assert faultcode/faultstring and that HTTP status matches platform standard.

---

## Q59. [S] mTLS and API testing challenges.

**Answer:** Client certs per env; automate cert install in CI runners; negative test with expired cert; never commit private keys to git.

---

## Q60. [L] Metrics for API quality program.

**Answer:** Escape defect rate by endpoint, contract break count, flaky test %, p95 trends, mean time to detect prod 5xx, automation coverage of critical operations.

---

## Q61. [B] What is payload?

**Answer:** Body data sent/received. Keep examples minimal but realistic in tests.

---

## Q62. [P] Boundary testing examples for APIs.

**Answer:** String length min/max, numeric limits, empty arrays, extremely large pages, Unicode names, leap-day dates, timezone offsets.

---

## Q63. [S] How do you test search APIs for data correctness?

**Answer:** Seed known docs; assert precision/recall style expectations for critical queries; reconcile hits against DB predicates—not only “200 OK.”

---

## Q64. [L] Coaching juniors on strong API defects.

**Answer:** Require expected vs actual JSON snippets, status, correlation ID, env, data setup steps, and business impact—not “API not working.”

---

## Q65. [P] Health/readiness endpoints—what to assert?

**Answer:** `/health` returns 200 when dependencies up; readiness fails when DB down; don’t expose stack traces or secrets.

---

## Q66. [S] Canary / shadow testing for APIs.

**Answer:** Compare canary responses to baseline for identical requests (diff status/body fields); useful during big refactors with ETL consumers.

---
