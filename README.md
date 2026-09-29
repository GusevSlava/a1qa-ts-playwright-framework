# a1qa JavaScript Playwright Framework

This repository contains a test automation framework built with **Playwright** and **JavaScript**. It is designed for scalability, stability, and strict test isolation, utilizing a custom **Browser Wrapper**, **Fixture-based** architecture, and a highly rigorous implementation of the **Page Object Model (POM)**.

---

## 🚀 Features

* **Playwright Native:** Fast, reliable parallel execution on Chromium, Firefox, and WebKit managed natively via `playwright.config.js`.
* **Strict Page Object Model:** Enforces absolute encapsulation of locators and state.
* **Element Wrappers:** Custom classes (`Button`, `TextBox`, `Label`, `Checkbox`, `Dropdown`, `FileInput`) that encapsulate **Playwright native reporting steps (`test.step`)**, reliable waits, and strict-mode error handling. An `ElementsList` utility is also provided for managing collections of identical elements.
* **Smart Isolation:** Uses **Test-Scoped Fixtures** to guarantee every test runs in a completely fresh environment (clean context, downloads, and optional Basic Auth injection).
* **Secure Secrets Management:** Centralized environment variable validation via `utils/EnvProvider.js` prevents hardcoded credentials and silent failures.
* **Lazy-Loaded Configuration:** Safe test data is loaded lazily via `utils/ConfigReader.js` that evaluates at runtime and memoizes results to prevent I/O bottlenecks.
* **Code Quality & Consistency:** Pre-configured with **ESLint v10 (Flat Config)** enforcing standard JavaScript style (single quotes, 2 spaces) and Playwright-specific rules.

---

## 🏗️ Project Structure

The project strictly separates the reusable technical core (`framework/`) from the business logic and tests (`tests/`).

```text
a1qa-js-playwright-framework/
├── .vscode/                 # Editor settings for automatic linting on save
├── framework/               # Core Technical Framework
│   ├── config/              # testdata.json (Non-sensitive structural data)
│   ├── ui/
│   │   ├── browser/         # Browser.js wrapper (Single state manager)
│   │   ├── constants/       # ElementType.js, Timeouts.js
│   │   ├── elements/        # UI Element wrappers (Button, Label, ElementsList, etc.)
│   │   ├── fixtures/        # Playwright test extensions (browser.fixture.js)
│   │   └── page/            # BasePage.js
│   └── utils/               # ConfigReader.js, EnvProvider.js, FileUtils.js, FrameUtils.js
├── tests/                   # Application-Specific Specs
│   ├── pages/               # Page Objects (LoginPage, MainPage, etc.)
│   └── demo.spec.js         # Test Specifications
├── .env.example             # Template for required environment variables
├── eslint.config.js         # ESLint v10 Flat Config rules
└── playwright.config.js     # Playwright engine and multi-browser configuration
```

---

## 🔒 Environment Setup (Secrets Management)

This framework strictly prohibits committing sensitive passwords or credentials to the repository. Instead, it relies on local environment variables.

Before running the tests for the first time, every developer/student must configure their local environment:

1. Locate the `.env.example` file in the root directory.
2. Duplicate this file and rename the copy to `.env` (this file is ignored by Git and will remain safely on your local machine).
3. Open your new `.env` file and populate it with the actual credentials required for the test environments:

```env
TEST_USER=tomsmith
TEST_PASSWORD=SuperSecretPassword!

BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=admin
```

If you forget to set this up or miss a variable, the framework's `EnvProvider` will explicitly halt test execution and warn you to check your `.env` file.

---

## GitHub Actions Email Reports

The workflow uploads the Playwright HTML report as an artifact and emails it as a ZIP attachment when SMTP is configured. Add these repository secrets under **Settings → Secrets and variables → Actions**:

* `SMTP_SERVER` — SMTP server hostname (for Gmail, `smtp.gmail.com`).
* `SMTP_PORT` — SMTP port, usually `465` or `587`.
* `SMTP_USERNAME` — SMTP account username and sender address.
* `SMTP_PASSWORD` — SMTP password or provider-specific app password.
* `REPORT_EMAIL_TO` — recipient email address.

The email step is skipped if any mail secret is missing or no HTML report was generated. GitHub does not expose repository secrets to workflows triggered by pull requests from forks.

---

## 📜 Strict Page Object Rules

This framework mandates a strict, classic approach to the Page Object pattern to ensure maximum stability and zero "flakiness". All contributors must adhere to the following rules:

1. **Selector Isolation:** All interactions with locators and selectors must happen exclusively inside Page classes. Tests (`.spec.js` files) must never contain `page.locator()` or `page.getBy...`.
2. **Inheritance:** Every application page class must inherit directly from `BasePage`.
3. **Unique Page Elements:** A unique element (`BaseElement` instance) must be passed to the `super()` constructor of every Page class. This element is used internally by `isPageOpened()` to robustly verify the page state via a fast, non-blocking check.
4. **Encapsulated Locators:** Locators must never be exposed directly as class properties. They must be wrapped inside custom Element classes (e.g., `this.loginBtn = new Button(...)`).
5. **Action-Oriented Methods:** Page classes should expose methods that represent user actions (e.g., `typeUsername(name)`, `clickLogin()`).
6. **No Chaining (No Page Returns):** Page methods must never return an instance of a page (`return this` or `return new NextPage()`). Test flow and navigation are strictly controlled inside the `.spec.js` files.
7. **No Assertions in Pages:** Page methods must never contain test assertions (no `expect(...)` inside Page classes). All assertions belong in the test file.
8. **Explicit Waits for Text:** If a test needs to verify text, the Page must provide a method that returns the text string. This method must utilize the element wrapper's `getText()` method, which explicitly waits for the element to be visible before reading its value.

---

## 📚 Developer Guide

### 1. Creating a Page Object
Follow the strict rules above when creating a new page.

```javascript
import { Button, TextBox, Label } from '#framework/ui/elements/index.js';
import BasePage from '#framework/ui/page/BasePage.js';

// Rule 2: Inherit from BasePage
export default class LoginPage extends BasePage {
  constructor(page) {
    // Rule 3: Pass a unique wrapped element to super() to identify the page.
    // Tip: Use Regex for partial text matches to avoid brittle locators.
    super(new Label(page.getByRole('heading', { name: /Login/i }), 'Unique header'), 'Login Page');

    // Rule 1 & 4: Keep locators isolated in the class and encapsulated in wrappers
    this.usernameInput = new TextBox(page.getByLabel('Username'), 'Username input');
    this.loginButton = new Button(page.getByRole('button', { name: 'Login' }), 'Login button');
    this.errorMessage = new Label(page.locator('.error'), 'Error message');
  }

  // Rule 5: Methods represent clear user actions
  // Rule 6: The method returns Promise<void>, NOT an instance of another page
  async login(username, password) {
    await this.usernameInput.setText(username);
    // Password input logic here...
    await this.loginButton.click();
  }

  // Rule 7: No assertions (expect) here. We only return the value.
  // Rule 8: Using the wrapper's getText() ensures an explicit wait before reading.
  async getErrorText() {
    return await this.errorMessage.getText();
  }
}
```

### 2. Writing a Test
Tests manage the flow and hold all assertions. Safe structural data is loaded via `ConfigReader`, while sensitive credentials must be accessed via `EnvProvider`.

```javascript
// Thanks to our JSDoc updates in the fixture, IntelliSense works automatically
import { test, expect } from '#framework/ui/fixtures/browser.fixture.js';
import LoginPage from './pages/LoginPage.js';
import ConfigReader from '#framework/utils/ConfigReader.js';
import EnvProvider from '#framework/utils/EnvProvider.js';

// Inject the isolated custom browser fixture
test('User can see error on invalid login', async ({ customBrowser: browser }) => {
  const testData = ConfigReader.getTestData();

  // Rule 1: No locators here. We interact only with the Page Object.
  const loginPage = new LoginPage(browser.page);

  // Always wait for the page to load before asserting visibility.
  // isPageOpened() is a fast non-blocking snapshot — it does NOT auto-wait.
  await loginPage.waitForPageToLoad();
  expect(await loginPage.isPageOpened()).toBe(true);

  // Rule 5: Call action-oriented methods to interact with the UI.
  // Use EnvProvider for sensitive data injected from .env
  await loginPage.login(EnvProvider.testUser, EnvProvider.testPassword);

  // Rule 7 & 8: Assertions are kept in the test, verifying the returned data explicitly
  const errorText = await loginPage.getErrorText();
  expect(errorText).toEqual(testData.invalidCredentialsMessage);
});
```

### 3. Working with iFrames
To maintain strict encapsulation (Rule 4), never extract text or interact with frames directly using raw Playwright commands. Instead, use `FrameUtils` to build a locator, and pass that locator into standard Element wrappers.

```javascript
import FrameUtils from '#framework/utils/FrameUtils.js';
import { Button } from '#framework/ui/elements/index.js';

export default class PaymentPage extends BasePage {
  constructor(page) {
    super(...);

    // 1. Generate the iframe locator chain using FrameUtils
    const frameLocator = new FrameUtils(page).locatorInFrames(
      ['#payment-gateway-iframe'], // Array of outer -> inner frame selectors
      'button#submit-payment'      // Target element inside the deepest frame
    );

    // 2. Wrap it in a standard Element class
    this.submitPaymentBtn = new Button(frameLocator, 'Submit Payment Frame Button');
  }

  async submitPayment() {
    await this.submitPaymentBtn.click(); // Standard waits and logs apply automatically
  }
}
```

### 4. File Downloads
Downloads are automatically isolated per-test to avoid race conditions during parallel execution. Download logic must route through `Browser.js` so it saves into the dedicated worker directory.

```javascript
// In your test:
const filePath = await browser.downloadAndSave(
  () => invoicePage.clickDownloadPdf(), // Pass the page object action as a callback
  'invoice.pdf'                         // Desired filename
);

// Files are safely retained on test failure and deleted on success to save disk space
```

---

## ⚙️ Test Execution & Linting

**Run all tests in headless mode across all browsers (default for CI):**
```bash
npm run test
```

**Run tests on a specific browser:**
```bash
BROWSER=firefox npm run test
```

**Run tests locally with a maximized browser window (Headed mode):**
```bash
BROWSER=local-headed npm run test
```

**Open the interactive UI debug mode:**
```bash
npx playwright test --ui
```

**Check code for style and syntax errors:**
```bash
npm run lint
```

*(Tip: If using VS Code, formatting and ESLint rules are automatically applied on save).*
