# Skill: Test-Case Design

## Purpose
Given a feature and its exploration notes, design a comprehensive, behavior-driven test matrix. Follow these instructions whenever asked to design test cases.

## Core Rules

### 1. Three Required Categories per Feature
Every feature must include test cases across all three categories:
- **Positive:** Feature behaves as intended under valid inputs and expected user workflows (happy paths).
- **Negative:** Invalid input, missing values, empty fields, malformed formats, and unauthorized attempts are gracefully rejected with proper feedback.
- **Edge:** Boundary conditions, limits, extremes, and threshold behaviors (e.g., min/max values, 0 or negative numbers, just below minimum threshold, past or expired dates, character length limits).

### 2. Grounded in Real Application Data
- Base every test case on actual observed application behavior, real selectors, and actual UI elements captured in `exploration-notes.md`.
- Never make generic or hypothetical guesses about fields, buttons, or workflows that do not exist in the app.

### 3. Planned Regression Cases
- Cross-reference the "Surprises" / known bugs from exploration notes against the feature requirements.
- Any known bug or discrepancy MUST be explicitly flagged as a planned regression test case (e.g., `Regression: Yes (covers planted bug <description>)`).

### 4. Behavior-Driven Titles
- Write descriptive titles specifying the expected behavior under test.
- Good: `Login rejects empty password`, `Cart updates order total when item quantity increases`.
- Bad: `Test password`, `Cart test 2`.

---

## Required Test Case Format

Every test case must follow this exact structure:

```markdown
### [TC-<FEATURE>-<CATEGORY>-<NUMBER>] <Behavior-Driven Title>
- **Category:** Positive | Negative | Edge
- **Regression:** Yes (<Brief bug reference>) | No
- **Preconditions:** Initial application state, authentication status, and starting URL
- **Steps:**
  1. <Action 1>
  2. <Action 2>
  3. <Action 3>
- **Expected Result:** Clear, verifiable outcome (UI state change, message displayed, URL navigation)
```

---

## Output Standard
When generating a test matrix:
1. Group cases under the feature heading, ordered by **Positive**, then **Negative**, then **Edge**.
2. Include a summary table at the start of the feature listing `ID`, `Title`, `Category`, and `Regression Status`.
3. Provide the full details for each test case matching the required structure above.
