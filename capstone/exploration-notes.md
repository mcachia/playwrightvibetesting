# BookNow Exploration Notes

## Login

### Flows
1. Navigate to the base URL (`/` or `http://localhost:3000`).
2. Fill the Email Address field with user credentials (e.g., `guest@booknow.com`).
3. Fill the Password field with user credentials (e.g., `stay2026`).
4. Click the "Sign In" button.
5. Verify redirection to the Available Rooms page and confirmation of user session in the navbar.

### Selectors
- **Email field**: `page.getByLabel('Email Address')` (or `page.getByRole('textbox', { name: 'Email Address' })`)
- **Password field**: `page.getByLabel('Password')` (matches current `type="text"` and future `type="password"`)
- **Sign-in button**: `page.getByRole('button', { name: 'Sign In' })`
- **Error message**: `page.locator('#login-error')` (plain `div.error-msg` in DOM; ideal future locator is `page.getByRole('alert')`)

### Surprises
1. **Password field in plain text**:
   - *Did*: Inspected DOM and typed into `#login-pass`.
   - *Expected*: Input has `type="password"` to mask entered characters.
   - *Actual*: Field is defined as `<input type="text" id="login-pass">`, exposing the password in plain text on screen and in DOM.

2. **Empty form bypasses authentication**:
   - *Did*: Left email and password fields blank and clicked "Sign In".
   - *Expected*: Form prevents submission, keeps user on login page, and displays required field errors.
   - *Actual*: Application navigated immediately to `#page-rooms` ("Available Rooms") with no validation error.

3. **Wrong password grants full access**:
   - *Did*: Entered valid email (`guest@booknow.com`) and invalid password (`wrongpass123`), then clicked "Sign In".
   - *Expected*: Login blocked, user remains on login page, `#login-error` displayed.
   - *Actual*: Application redirected to `#page-rooms` because `buggyLogin()` explicitly executes `showPage('rooms')` inside the credential mismatch condition.

4. **Session state and user badge never updated**:
   - *Did*: Submitted valid credentials (`guest@booknow.com` / `stay2026`).
   - *Expected*: Global state `isLoggedIn` set to `true`, and `#nav-user` displays user identity.
   - *Actual*: `isLoggedIn` remains `false`, and `#nav-user` remains hidden with class `.hidden`.

5. **Page title is uninitialized**:
   - *Did*: Loaded the application in the browser.
   - *Expected*: HTML `<title>` set to "BookNow" or similar application branding.
   - *Actual*: HTML `<title>` is `"Untitled"`.


## Available Rooms

### Flows
1. From the login page, sign in (or click the "Rooms" link in the navigation header).
2. Browse the grid of available rooms (`#rooms-grid`).
3. For each room card, inspect:
   - Room title and descriptive overview
   - Image loading and alt accessibility attributes
   - Availability badge status
   - Original price, discounted price, and discount percentage badge
4. Click the "Select Room" button on a chosen room to proceed to the booking flow.

### Selectors
- **Page heading**: `page.getByRole('heading', { name: 'Available Rooms', level: 2 })`
- **Room cards**: `page.locator('.room-card')`
- **Room title / heading**: `card.locator('.room-name')` (or `page.getByRole('heading', { name: '<Room Name>' })` once semantic heading tags are used)
- **Room description**: `card.locator('.room-desc')`
- **Original price**: `card.locator('.price-original')`
- **Discounted price**: `card.locator('.price-discounted')`
- **Discount badge**: `card.locator('.badge-discount')`
- **Availability badge**: `card.locator('.availability-badge')`
- **Room image**: `card.locator('img')` (or `card.getByRole('img')`)
- **Select Room button**: `card.getByRole('button', { name: 'Select Room' })`

### Surprises
1. **Broken image on Deluxe Room**:
   - *Did*: Inspected the image in the Deluxe Room card (`ROOMS[0]`).
   - *Expected*: A valid room photograph loads successfully.
   - *Actual*: Image URL is `https://images.unsplash.com/BROKEN_LINK_404/hotel-deluxe.jpg`, returning HTTP 404 with `naturalWidth === 0`.
2. **Missing image `alt` attributes**:
   - *Did*: Checked image elements across all room cards.
   - *Expected*: Every image provides descriptive alternative text for accessibility (e.g. `alt="Deluxe Room"`).
   - *Actual*: Deluxe Room has no `alt` attribute at all, and Family Suite has an empty string `alt=""`.
3. **Availability badge styled with unavailable error styling**:
   - *Did*: Checked the availability badge indicator on room cards.
   - *Expected*: Rooms with "Available" status render with a green/success indicator.
   - *Actual*: The badge has CSS class `availability-badge badge-unavailable`, applying red text (`#dc2626`) and pinkish-red background (`#fee2e2`), visually signaling an error/unavailable state despite the label text "Available".
4. **Description text overflow and truncation on Family Suite**:
   - *Did*: Inspected the description for Family Suite (`ROOMS[2]`).
   - *Expected*: Multi-sentence description wraps naturally across multiple lines within the card.
   - *Actual*: Element contains class `overflow-bug` with `white-space: nowrap; overflow: hidden;`, truncating the text horizontally and preventing multi-line display.
5. **Discount math calculation error**:
   - *Did*: Verified discounted price against base price and discount percentage across all rooms.
   - *Expected*: Standard percentage discount calculation `price * (1 - discount / 100)`:
     - Deluxe Room: \$129 - 20% = **\$103.20/night**
     - Superior Room: \$89 - 10% = **\$80.10/night**
     - Family Suite: \$199 - 15% = **\$169.15/night**
     - Penthouse Suite: \$299 - 5% = **\$284.05/night**
   - *Actual*: `calcDiscountedBuggy` divides by 1000 instead of 100 (`price * (1 - discount / 1000)`):
     - Deluxe Room: displays **\$126.42/night** (overcharge of \$23.22)
     - Superior Room: displays **\$88.11/night** (overcharge of \$8.01)
     - Family Suite: displays **\$196.01/night** (overcharge of \$26.86)
     - Penthouse Suite: displays **\$297.50/night** (overcharge of \$13.45)

## Complete Booking

### Flows
1. Click "Select Room" on any room from the catalog to load the booking view (`#page-booking`).
2. Verify the selected room name, price per night, initial nights (1), and initial total in the "Booking Summary" panel.
3. Fill in guest details:
   - First Name: `Mark`
   - Last Name: `Test`
   - Email Address: `testbooknow@yopmail.com`
   - Phone Number: `+55 12345678`
4. Fill in stay details:
   - Check-in Date: `2026-11-11` (11/11/2026)
   - Check-out Date: `2026-12-12` (12/12/2026)
   - Number of Guests: `1`
5. Observe whether the summary updates to reflect 31 nights and the recalculated total.
6. Click the "Book Now" button (`.btn-book-buggy`).
7. Verify whether the app validates fields and redirects to the confirmation view (`#page-confirm`).

### Selectors
- **Page heading**: `page.getByRole('heading', { name: 'Complete Your Booking', level: 2 })`
- **Guest Details fields** (Labels lack `for` attributes; fallback hierarchy applied):
  - **First Name**: `page.getByPlaceholder('John')` (or `page.locator('#book-fname')`; `<label>First Name</label>` lacks `for`)
  - **Last Name**: `page.getByPlaceholder('Smith')` (or `page.locator('#book-lname')`; `<label>Last Name</label>` lacks `for`)
  - **Email Address**: `page.getByPlaceholder('john@example.com')` (or `page.locator('#book-email')`; `<label>Email Address</label>` lacks `for`)
  - **Phone Number**: `page.getByPlaceholder('+1 234 567 8900')` (or `page.locator('#book-phone')`; `<label>Phone Number</label>` lacks `for`)
- **Stay Details fields**:
  - **Check-in Date**: `page.locator('#book-checkin')`
  - **Check-out Date**: `page.locator('#book-checkout')`
  - **Number of Guests**: `page.getByRole('spinbutton')` (or `page.locator('#book-guests')`)
- **Submit button**: `page.getByRole('button', { name: 'Book Now' })` (or `page.locator('.btn-book-buggy')`)
- **Booking Summary panel**:
  - **Summary container**: `page.locator('#booking-summary')`
  - **Selected room name**: `page.locator('.summary-room-name')`
  - **Nights count**: `page.locator('#summary-nights')`
  - **Estimated total**: `page.locator('#summary-total')`
- **Confirmation page elements**:
  - **Confirmation heading**: `page.getByRole('heading', { name: 'Booking Confirmed!', level: 2 })`
  - **Browse More Rooms button**: `page.getByRole('button', { name: 'Browse More Rooms' })`

### Surprises
1. **Unassociated form labels in booking form**:
   - *Did*: Attempted to target inputs using accessible labels (`getByLabel('First Name')`, `getByLabel('Email Address')`, etc.).
   - *Expected*: All `<label>` elements have `for="<input-id>"` or wrap their input, enabling full accessibility and web-first `getByLabel` locators.
   - *Actual*: Labels inside `#page-booking` are unassociated plain `<label>` tags (`<label>First Name</label>`), forcing locators to fall back to `getByPlaceholder` or element IDs (`#book-fname`).
2. **Nights and Total remain frozen on date changes**:
   - *Did*: Set check-in date to `2026-11-11` and check-out date to `2026-12-12` (duration of 31 nights).
   - *Expected*: The Booking Summary recalculates: Nights displays `31` and Estimated Total displays 31 × nightly rate.
   - *Actual*: Nights count remains frozen at `1` (`#summary-nights`), and Estimated Total remains frozen at `$126.42` (`#summary-total`). The event handler `buggyUpdateTotal()` is an empty stub function that performs no calculations.
3. **Summary displays incorrect nightly rate**:
   - *Did*: Inspected the Price per night and Estimated Total in the Booking Summary for Deluxe Room.
   - *Expected*: Price per night should be \$103.20 (20% off \$129).
   - *Actual*: Summary uses the buggy discounted price (\$126.42), compounding the catalog discount calculation defect.
4. **Form submission bypasses all validation**:
   - *Did*: Submitted the booking form both with empty fields and with invalid inputs.
   - *Expected*: Form submission is prevented, and field-level error messages (`#err-fname`, `#err-email`, `#err-checkin`, `#err-checkout`) are displayed.
   - *Actual*: `buggyPlaceBooking()` unconditionally executes `showPage('confirm')`, completely ignoring validation checks and pre-existing error containers.
5. **Confirmation screen lacks booking reference number and reservation summary**:
   - *Did*: Completed booking with guest details (Mark Test, testbooknow@yopmail.com, +55 12345678, dates).
   - *Expected*: Confirmation screen displays a unique booking reference code, reserved room details, dates, guest summary, and total cost.
   - *Actual*: View only displays a generic static message ("Booking Confirmed! Your reservation has been placed. Check your email for details.") without any booking reference code or reservation data.
