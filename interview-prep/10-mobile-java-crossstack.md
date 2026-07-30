# 10. Mobile, Java & Cross-Stack Automation

**Why this matters:** JD mentions strong overall SDET background including Java, mobile, and multi-layer automation—even though Playwright/TS is the focus.

---

## A. Mobile automation

## Q1. “How do you approach mobile testing for a wealth client app?”

### Answer

“Risk-based: auth, biometrics fallback, account summary, trade ticket, push disclosures. Prefer:

- **Appium** or **Playwright Android** (where applicable) for UI  
- API setup for accounts  
- Device farm (BrowserStack/App Center) in CI for smoke  

Keep mobile E2E thin; validate business rules at API/data layers.”

### Example Appium + Java sketch

```java
@Test
void accountSummaryShowsCash() {
  loginAs("advisor_mobile_user");
  AccountsScreen accounts = new AccountsScreen(driver);
  accounts.openAccount("ACC-100");
  assertEquals("$10,000.00", accounts.cashBalance());
}
```

### Example Playwright mobile project

```ts
projects: [
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 7'] },
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 14'] },
  },
]
```

---

## Q2. “Native vs hybrid vs responsive web?”

| Type | Approach |
|------|----------|
| Responsive web | Playwright device emulation + real device spot checks |
| Hybrid (WebView) | Context switching; prefer test IDs in WebView |
| Native | Appium / XCUITest / Espresso |

---

## Q3. “Mobile-specific flakes?”

- Animations → disable in test builds  
- System dialogs (notifications, FaceID) → prep state  
- Deep links → API + link test  
- OS permission popups → grant in capabilities  

---

## B. Java automation (still relevant)

## Q4. “When do you choose Java vs TypeScript?”

### Answer

“Match the engineering ecosystem. Java shops with Spring microservices often standardize RestAssured + JUnit + Selenium/Playwright Java. Greenfield UI automation with strong frontend teams → TypeScript + Playwright. Principal skill is transferring patterns across languages.”

### RestAssured example

```java
given()
  .auth().oauth2(token)
  .contentType(ContentType.JSON)
  .body(createAccountRequest)
.when()
  .post("/api/accounts")
.then()
  .statusCode(201)
  .body("id", notNullValue())
  .body("type", equalTo("IRA"));
```

### JUnit data recon sketch

```java
@Test
void positionsReconcile() throws Exception {
  List<Break> breaks = reconService.compare("2026-07-29");
  assertTrue(breaks.isEmpty(), () -> "Breaks: " + breaks);
}
```

---

## Q5. “Selenium → Playwright migration strategy?”

### Answer (strangler)

1. Freeze new Selenium for greenfield journeys  
2. Shared test data libraries callable from both  
3. Migrate P0 journeys first  
4. Parity dashboard  
5. Decommission Selenium module when coverage threshold met  

Don’t big-bang rewrite.

---

## C. Cross-stack quality

## Q6. “How do UI, API, data, and mobile relate in one strategy?”

```text
                ┌─────────────┐
                │  Business   │
                │  workflows  │
                └──────┬──────┘
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
      UI/Mobile       API         Data/ETL
     (Playwright)  (contracts)   (SQL recon)
         │             │             │
         └─────────────┴─────────────┘
                       ▼
                 Azure DevOps gates
```

**Rule:** Assert business truth at the lowest reliable layer; use UI for UX/permissions/integration glue.

---

## Q7. “Java + Playwright?”

Playwright has a Java binding—useful when org mandates Java. Patterns (fixtures analog = JUnit extensions) still apply.

```java
try (Playwright pw = Playwright.create()) {
  Browser browser = pw.chromium().launch();
  Page page = browser.newPage();
  page.navigate(baseUrl + "/login");
  // ...
}
```

---

## Q8. “Contract between mobile and backend?”

- Consumer-driven contracts for mobile clients  
- Minimum app version vs API version matrix tested in CI  
- Feature flags: test both flag states for release-impacting features  

---

## Q9. “Security testing awareness (non-pen-test)?”

- Token storage on mobile  
- Screenshot masking in test reports for PII  
- Certificate pinning breakages in test builds documented  
- Authz tests across channels (portal vs advisor vs mobile)
