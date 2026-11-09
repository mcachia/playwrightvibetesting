## Prompt serve: Serve Booknow Locally
*Used in: Section 3, Clip 5 — "Running Booknow Locally"*

```
Serve Booknow app so Playwright has a stable URL to target.
Run this in the terminal and keep it running:

   cd playwrightvibetesting/capstone/booknow-broken && npx serve . -l 3000

Then confirm it is reachable:
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

A 200 means it is up. Tell me the result. Leave the serve process running
in this terminal for the rest of the course.

```
## Prompt 2 : Explore Login Flow

Using the Playwright MCP browser on http://localhost:3000, walk through the
LOGIN flow only. For each step:
- describe what you did
- describe what you saw
- state what you expected to happen
- flag anything that does not match your expectation

Try a normal login (guest@booknow.com / stay2026), then try submitting the
form with empty fields, then try a wrong password. Watch the password field
specifically. Do not fix anything and do not write tests — just observe and report.

## Prompt 3 - Capture the login exploration notes

Based on the LOGIN exploration you just did, create a file at
playwrightvibetesting/capstone/exploration-notes.md with a "## Login" section containing
three parts:

### Flows
The exact steps to log in, as a numbered list.

### Selectors
For each element you interacted with (email field, password field, sign-in
button, error message), the recommended locator. Prefer role-based or
label-based locators (getByRole, getByLabel) over brittle CSS chains.

### Surprises
Every place login behaviour did not match expectation — what you did, what you
expected, what actually happened. These are login bug candidates for Section 7.

Keep it factual and concise. Cover login only for now — we add the other flows next.

## Prompt 4 - explore & capture the remaining flows
Repeat the exploration-and-capture loop for each of these flows, one at a time,
using the Playwright MCP browser on http://localhost:3000:

1. Catalog — browse rooms, prices, descriptions, status
2. Complete Booking — select room, fill guest details with 
First Name: Mark
Last Name: Test
email: testbooknow@yopmail.com
phone number: +55 12345678
check-in date: 11/11/2026, 
check-out date: 12/12/2026

For each flow: explore it the same way you explored login (what you did / saw /
expected / anything wrong), then APPEND a new "## Available room", "## Booking", or
"## Book" section to playwrightvibetesting/exploration-notes.md with the same
Flows / Selectors / Surprises structure.

Pay attention fill guest details, book   
Still exploration only — do not write test files.