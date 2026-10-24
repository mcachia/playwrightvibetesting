# Skill: Test Authoring

## Purpose
Turn test cases into reliable, maintainable Playwright tests to a consistent standard. Follow these instructions whenever asked to write or refactor automated tests.

---

## Core Rules

### 1. Locators
- **User-Facing First:** Prioritize accessible, intent-revealing locators: `page.getByRole()`, `page.getByLabel()`, and `page.getByPlaceholder()`.
- **No Brittle Chains:** Never use fragile CSS selectors, DOM hierarchies, or index chains (e.g., `div > div:nth-child(2) > span`, `table tr td:first-child`).
- **Missing Locators:** If an element lacks accessible hooks or clean locators, recommend adding a stable accessible attribute or `data-testid` rather than writing fragile queries.

### 2. Assertions
- **Assert Real Outcomes:** Every test must assert actual state changes, values, URL transitions, or element visibility changes.
- **Web-First Assertions:** Always use auto-retrying Playwright assertions (`await expect(locator).toBeVisible()`, `await expect(locator).toHaveValue(...)`, `await expect(locator).toHaveText(...)`).
- **No Trivial Checks:** Never assert merely that "the page did not crash" or test elements that never change.

### 3. Structure & Page Objects
- **File Organization:** One `.spec.ts` file per feature area in `tests/` (e.g., `login.spec.ts`, `catalog.spec.ts`, `cart.spec.ts`, `checkout.spec.ts`).
- **Lightweight Page Objects:** Use a clean, focused Page Object class per feature area (stored in `tests/pages/`) to encapsulate locators and core actions. Tests should read as user intent, not low-level DOM mechanics.

### 4. Fixtures
- **Shared Setup in Fixtures:** Common prerequisites (such as logging in or bootstrapping state) belong in a reusable Playwright test fixture (e.g., `tests/fixtures.ts` exporting an `authedPage` fixture).
- **Zero Copy-Paste:** Never duplicate authentication or setup sequences across test blocks.

### 5. Isolation & Independence
- **Strict Isolation:** Every test must be completely independent and runnable in any order, alone, or in parallel (`fullyParallel`).
- **Own State:** Each test sets up its own preconditions and cleans up as needed. Never rely on state left behind by a previous test.

### 6. Secrets & Environment Configuration
- **No Hardcoded Secrets:** Credentials and sensitive test data must always be loaded via environment variables:
  ```ts
  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;
  ```
- Use safe fallbacks or clear errors when required environment variables are undefined.

---

## Forbidden List

1. **NO Manual Sleeps:** Never call `page.waitForTimeout()` or arbitrary delays. Rely on Playwright's built-in auto-waiting and web-first `expect` assertions.
2. **NO Hardcoded Credentials:** Never write usernames, passwords, or tokens directly in test files or page objects.
3. **NO Brittle Selectors:** Never use XPath, class name tag soup, or positional DOM selectors.
4. **NO Static Ineffective Assertions:** Never assert on constants or static layout elements that provide zero validation value for the test's intent.

---

## Output Standard
When generating tests:
1. Provide the Page Object (if creating/updating one) and the spec file.
2. Ensure imports, fixtures, and TypeScript typings are clean and compilable.
3. Accompany the code with a brief explanation highlighting how each rule in this skill is satisfied.
