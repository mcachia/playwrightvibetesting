# Skill: Bug Reporting

## Purpose
Turn a failing test and its Playwright trace into a developer-ready, unambiguous bug report. Follow these instructions whenever asked to report a bug or document a test failure.

---

## Core Rules

### 1. Specific, Behavioral Titles
- State the exact observed symptom and user action, not a generic problem.
- **Good:** `Proceed to Checkout button does not respond to click`, `Cart subtotal fails to update when item quantity changes from 1 to 2`.
- **Bad:** `Checkout broken`, `Cart bug`, `Payment error`.

### 2. Complete Environment Details
Always capture:
- **App Version:** Target version/build (e.g., `broken-app` vs `fixed-app`, commit hash, or release tag).
- **Browser:** Browser engine and viewport (e.g., `Chromium 128.0 (desktop 1280x720)`).
- **URL:** The exact URL where the issue occurred.

### 3. Concrete, Numbered Steps to Reproduce
- Must be numbered, exact, and reproducible by someone who was not present and has no prior context.
- Include precise starting state, explicit inputs, and exact button clicks.
- Never summarize or skip intermediate steps (e.g., avoid "log in and checkout").

### 4. Separate Expected and Actual Results
- **Expected Result** and **Actual Result** must be kept as SEPARATE fields—never combined into one sentence or paragraph.
- Detail what should have occurred according to requirements vs what actually happened (e.g., error messages, UI state, lack of response).

### 5. Severity with Justification
Assign one of four levels, accompanied by a one-line justification:
- **Critical:** Complete loss of core business functionality, blocker with no workaround, data loss, or crash.
- **High:** Major feature malfunction with high user impact; workaround is difficult or painful.
- **Medium:** Non-critical feature malfunction or calculation error with an available workaround.
- **Low:** Minor visual glitch, cosmetic defect, or low-impact nuisance not blocking functionality.

### 6. Evidence
Always reference concrete diagnostic artifacts:
- Playwright trace file path (and trace viewer command).
- Screenshot(s), failure video, or relevant console and network logs.

---

## Required Bug Report Template

Every bug report must strictly follow this structure:

```markdown
## [BUG] <Specific and Behavioral Title>

- **Environment:**
  - **App Version:** <broken-app | fixed-app | commit/release tag>
  - **Browser:** <Chromium | Firefox | WebKit (version / viewport)>
  - **URL:** <Target URL>

- **Severity:** <Critical | High | Medium | Low> — <One-line justification explaining business/user impact>

- **Steps to Reproduce:**
  1. Navigate to `<URL>`.
  2. <Step with explicit action and input>.
  3. <Step with explicit action and input>.

- **Expected Result:**
  <What should happen according to expected behavior/requirements.>

- **Actual Result:**
  <What actually happened, including UI behavior, silent failure, or error message.>

- **Evidence:**
  - **Playwright Trace:** `<path/to/trace.zip>` (View: `npx playwright show-trace <path>`)
  - **Screenshots / Video:** `<path/to/screenshot.png>`
  - **Console / Network Errors:** <Error output or failed requests, if applicable>
```

---

## Final Self-Check Gate

Before finalizing any bug report, perform this self-check:

> **"Could a developer reproduce this from the steps alone?"**

If the answer is **no**, the report is not done. Revise the steps to ensure every click, input, starting condition, and URL is explicitly stated before publishing.
