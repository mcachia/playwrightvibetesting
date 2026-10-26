# Skill: Flake Triage

## Purpose
Determine whether a test failure is caused by an actual defect in the application under test (**REAL BUG**) or by test implementation flaws, timing issues, or environment instability (**FLAKY TEST**). Follow these instructions whenever triaging a test failure.

---

## Triage Checklist

Work systematically through all five steps before reaching a conclusion:

### 1. Consistency
- **Question:** Does the test fail every single run, or only sometimes?
- **Guideline:** Consistent failure (fails 100% of runs) strongly indicates a **REAL BUG**. Intermittent or non-deterministic failure strongly indicates a **FLAKY TEST**.
- **Rule on Ambiguity:** If consistency is unknown or unclear from a single run, **you must request to re-run (or re-run) the test 3–5 times** before drawing a conclusion.

### 2. Cause
- **Question:** Does the failure show the **APP** behaving incorrectly, or the **TEST** timing out, racing, or using a fragile locator?
- **App Bug Indicators:** Explicit application error messages, calculation errors, server 500s, broken redirects, or UI violating functional specifications.
- **Flaky Test Indicators:** Action timeouts (`Timeout 30000ms exceeded`), strict mode violations (locator resolved to multiple elements), race conditions against animations/render cycles, or brittle selector chains.

### 3. Evidence
- **Question:** In the Playwright trace, was the application genuinely in a broken state, or was the test just confused / looking too early?
- **Trace Inspection Points:**
  - **DOM & Visual Snapshots:** Was the element present on screen when the action fired, or did it appear moments later?
  - **Network Calls:** Were background requests still pending when the assertion ran?
  - **Console Logs:** Are there unhandled application exceptions vs Playwright driver timeout errors?

### 4. Classification
State the final verdict clearly without ambiguity:
- **`REAL BUG`**: The application code violates functional requirements or crashes under valid user actions.
- **`FLAKY TEST`**: The application functions correctly, but the test code fails due to race conditions, fragile locators, or improper test isolation.

### 5. Recommendation
- **If REAL BUG:** Hand off to the **Bug Reporting Skill** (`skills/bug-reporting.md`) to create a developer-ready bug report. Do not modify the test to mask the defect.
- **If FLAKY TEST:** **Do NOT file a bug report.** Propose the specific test remediation:
  - **Better Locator:** Switch to user-facing, accessible locators (`page.getByRole()`, `page.getByLabel()`).
  - **Remove Sleep / Fix Timing:** Replace arbitrary delays with auto-retrying web-first assertions (`expect(locator).toBeVisible()`).
  - **Fix Test Isolation:** Eliminate state dependencies between tests using isolated browser contexts or dedicated fixtures.

---

## Required Triage Output Format

Every triage evaluation must follow this concise format:

```markdown
### Triage Analysis: `<Test Name or File>`

1. **Consistency:** <Consistent (fails every run) | Intermittent (failed X of Y runs) | Unclear — re-run requested>
2. **Cause:** <App defect vs Test timing / locator / isolation issue>
3. **Evidence:** <Key observations from Playwright trace, snapshots, and network/console logs>
4. **Classification:** **REAL BUG** | **FLAKY TEST**
5. **Recommendation:**
   - <If REAL BUG: Invoke skills/bug-reporting.md with specific details.>
   - <If FLAKY TEST: Specific code-level fix (locator, web-first assertion, fixture isolation).>
```
