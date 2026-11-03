# TechShop Test Matrix

This document defines the complete behavior-driven test matrix for the TechShop application based on [exploration-notes.md](file:///e:/GitHub/playwrightvibetesting/exploration-notes.md), [requirements.md](file:///e:/GitHub/playwrightvibetesting/techshop/requirements.md), and the specifications defined in [skills/test-case-design.md](file:///e:/GitHub/playwrightvibetesting/skills/test-case-design.md).

---

## 1. Login

### Summary

| ID | Title | Category | Regression Status |
|---|---|---|---|
| TC-LOGIN-POS-01 | Login succeeds with valid email and password | Positive | No |
| TC-LOGIN-POS-02 | Password field masks entered characters | Positive | Yes (covers planted bug password rendered as plaintext input) |
| TC-LOGIN-POS-03 | Active user session persists across browser reload | Positive | Yes (covers planted bug session lost on reload) |
| TC-LOGIN-POS-04 | Guest user can browse catalog directly via Browse as Guest button | Positive | No |
| TC-LOGIN-NEG-01 | Login rejects submission with empty username and password | Negative | Yes (covers planted bug empty submission accepted) |
| TC-LOGIN-NEG-02 | Login rejects empty password when username is provided | Negative | Yes (covers planted bug empty fields accepted) |
| TC-LOGIN-NEG-03 | Login rejects empty username when password is provided | Negative | Yes (covers planted bug empty fields accepted) |
| TC-LOGIN-NEG-04 | Login rejects invalid password for valid user account | Negative | Yes (covers planted bug invalid credentials accepted) |
| TC-LOGIN-NEG-05 | Login rejects malformed email format missing domain or @ | Negative | Yes (covers planted bug malformed email accepted) |
| TC-LOGIN-NEG-06 | Unauthenticated user is restricted from accessing catalog via navigation bar | Negative | Yes (covers planted bug navbar visible before login) |
| TC-LOGIN-NEG-07 | Login rejects non-email username 'admin' to enforce email format requirement | Negative | Yes (covers planted bug hardcoded admin username accepted without email format) |
| TC-LOGIN-NEG-08 | Direct navigation to Cart or Checkout view without authentication is blocked | Negative | Yes (covers planted bug unauthenticated cart access via navbar) |
| TC-LOGIN-EDGE-01 | Login rejects whitespace-only inputs in credentials | Edge | Yes (covers planted bug unvalidated string inputs) |
| TC-LOGIN-EDGE-02 | Login email handles uppercase characters (case insensitivity) | Edge | No |
| TC-LOGIN-EDGE-03 | Login inputs handle maximum length boundary strings without UI breakage | Edge | No |
| TC-LOGIN-EDGE-04 | Login trims leading and trailing whitespace from email input | Edge | No |

---

### Positive Cases

#### [TC-LOGIN-POS-01] Login succeeds with valid email and password
- **Category:** Positive
- **Regression:** No
- **Preconditions:** Browser open at `http://localhost:3000`, user is unauthenticated, `#page-login` is visible with heading "Welcome back".
- **Steps:**
  1. Fill `demo@techshop.com` into the Username input (`#login-user` / `page.getByLabel('Username')`).
  2. Fill `password123` into the Password input (`#login-pass` / `page.getByLabel('Password')`).
  3. Click the "Sign In" button (`page.getByRole('button', { name: 'Sign In' })`).
- **Expected Result:** User is authenticated; `#page-login` is hidden, `#page-products` is visible displaying heading "Our Products", and the product catalog is rendered.

#### [TC-LOGIN-POS-02] Password field masks entered characters
- **Category:** Positive
- **Regression:** Yes (covers planted bug password rendered as plaintext input)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Locate the Password input field (`#login-pass` / `page.getByLabel('Password')`).
  2. Inspect the HTML `type` attribute of the element.
  3. Type characters into the Password field.
- **Expected Result:** The input element has attribute `type="password"`, and characters entered are masked as bullets/dots rather than exposed in plaintext.

#### [TC-LOGIN-POS-03] Active user session persists across browser reload
- **Category:** Positive
- **Regression:** Yes (covers planted bug session lost on reload)
- **Preconditions:** User is logged in with `demo@techshop.com` / `password123` and viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. Verify the user is authenticated on `#page-products` ("Our Products" heading is visible).
  2. Reload the page using the browser reload command (`page.reload()`).
- **Expected Result:** The session persists within the browser session; `#page-products` remains visible, the user is not kicked back to `#page-login`, and heading "Welcome back" is not visible.

#### [TC-LOGIN-POS-04] Guest user can browse catalog directly via Browse as Guest button
- **Category:** Positive
- **Regression:** No
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Click the "Browse as Guest" button (`page.getByRole('button', { name: 'Browse as Guest' })`).
- **Expected Result:** `#page-login` is hidden and `#page-products` becomes visible displaying the catalog items.

---

### Negative Cases

#### [TC-LOGIN-NEG-01] Login rejects submission with empty username and password
- **Category:** Negative
- **Regression:** Yes (covers planted bug empty submission accepted)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible, fields `#login-user` and `#login-pass` are empty.
- **Steps:**
  1. Click the "Sign In" button (`page.getByRole('button', { name: 'Sign In' })`).
- **Expected Result:** Submission is rejected; `#page-login` remains visible, `#page-products` is not visible, and a visible validation error message is shown (e.g. `#toast`).

#### [TC-LOGIN-NEG-02] Login rejects empty password when username is provided
- **Category:** Negative
- **Regression:** Yes (covers planted bug empty fields accepted)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `demo@techshop.com` into `#login-user`.
  2. Leave `#login-pass` blank.
  3. Click "Sign In".
- **Expected Result:** Submission is rejected; `#page-login` remains visible and a validation error message indicates password is required.

#### [TC-LOGIN-NEG-03] Login rejects empty username when password is provided
- **Category:** Negative
- **Regression:** Yes (covers planted bug empty fields accepted)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Leave `#login-user` blank.
  2. Fill `password123` into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Submission is rejected; user remains on `#page-login` and a validation error message indicates username/email is required.

#### [TC-LOGIN-NEG-04] Login rejects invalid password for valid user account
- **Category:** Negative
- **Regression:** Yes (covers planted bug invalid credentials accepted)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `demo@techshop.com` into `#login-user`.
  2. Fill `wrongpassword999` into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Submission is rejected; user remains on `#page-login`, `#page-products` is not shown, and an error message indicates invalid credentials.

#### [TC-LOGIN-NEG-05] Login rejects malformed email format missing domain or @
- **Category:** Negative
- **Regression:** Yes (covers planted bug malformed email accepted)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `not-an-email` into `#login-user`.
  2. Fill `password123` into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Submission is rejected with an error indicating an invalid email format; user remains on `#page-login`.

#### [TC-LOGIN-NEG-06] Unauthenticated user is restricted from accessing catalog via navigation bar
- **Category:** Negative
- **Regression:** Yes (covers planted bug navbar visible before login)
- **Preconditions:** Browser open at `http://localhost:3000`, user is unauthenticated on `#page-login`.
- **Steps:**
  1. Check top navigation bar visibility while unauthenticated.
  2. Attempt to click "Products" in the navbar without logging in.
- **Expected Result:** Navigation options are restricted or hidden for unauthenticated users, or clicking them prompts the user to log in rather than displaying private store views.

#### [TC-LOGIN-NEG-07] Login rejects non-email username 'admin' to enforce email format requirement
- **Category:** Negative
- **Regression:** Yes (covers planted bug hardcoded admin username accepted without email format)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `admin` into `#login-user`.
  2. Fill `password123` into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Submission is rejected because `admin` does not satisfy the requirement: *"Email must be valid format (contains @ and domain)"*; user remains on `#page-login`.

#### [TC-LOGIN-NEG-08] Direct navigation to Cart or Checkout view without authentication is blocked
- **Category:** Negative
- **Regression:** Yes (covers planted bug unauthenticated cart access via navbar)
- **Preconditions:** Browser open at `http://localhost:3000`, user is unauthenticated on `#page-login`.
- **Steps:**
  1. Click the "Cart" link/icon in the navigation bar while unauthenticated.
- **Expected Result:** User is prevented from accessing the Cart or Checkout flow without signing in or explicitly choosing guest browsing.

---

### Edge Cases

#### [TC-LOGIN-EDGE-01] Login rejects whitespace-only inputs in credentials
- **Category:** Edge
- **Regression:** Yes (covers planted bug unvalidated string inputs)
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `   ` (spaces only) into `#login-user`.
  2. Fill `   ` (spaces only) into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Submission is treated as empty; error message appears, `#page-login` remains visible, and redirect to `#page-products` is prevented.

#### [TC-LOGIN-EDGE-02] Login email handles uppercase characters (case insensitivity)
- **Category:** Edge
- **Regression:** No
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `DEMO@TECHSHOP.COM` into `#login-user`.
  2. Fill `password123` into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Login succeeds; email is evaluated case-insensitively, `#page-products` is displayed.

#### [TC-LOGIN-EDGE-03] Login inputs handle maximum length boundary strings without UI breakage
- **Category:** Edge
- **Regression:** No
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill a 256-character string into `#login-user`.
  2. Fill a 256-character string into `#login-pass`.
  3. Observe input field styling and click "Sign In".
- **Expected Result:** Inputs do not overflow or distort the `.login-card` layout; invalid submission is rejected gracefully with an error.

#### [TC-LOGIN-EDGE-04] Login trims leading and trailing whitespace from email input
- **Category:** Edge
- **Regression:** No
- **Preconditions:** Browser open at `http://localhost:3000`, `#page-login` is visible.
- **Steps:**
  1. Fill `  demo@techshop.com  ` (with leading and trailing spaces) into `#login-user`.
  2. Fill `password123` into `#login-pass`.
  3. Click "Sign In".
- **Expected Result:** Email input is automatically trimmed; login succeeds and user is redirected to `#page-products`.

---

## 2. Catalog / Product Listing

### Summary

| ID | Title | Category | Regression Status |
|---|---|---|---|
| TC-CATALOG-POS-01 | Catalog displays grid containing all available products with required card elements | Positive | No |
| TC-CATALOG-POS-02 | Catalog page sets document title to "TechShop — Products" | Positive | Yes (covers planted bug page title remains "Untitled") |
| TC-CATALOG-POS-03 | Product card displays accurate discounted price based on stated percentage | Positive | Yes (covers planted bug discount formula divides by 1000 instead of 100) |
| TC-CATALOG-POS-04 | Product card images load with valid image sources and descriptive alt text | Positive | Yes (covers planted bug broken image URL and missing alt text) |
| TC-CATALOG-NEG-01 | Out-of-stock product card displays badge and disables Add to Cart button | Negative | Yes (covers planted bug missing out-of-stock badges and disabled buttons) |
| TC-CATALOG-NEG-02 | Catalog rejects adding item with quantity of zero or negative number | Negative | Yes (covers planted bug catalog allows non-positive quantity inputs) |
| TC-CATALOG-NEG-03 | Catalog rejects adding product when quantity input is empty or cleared | Negative | Yes (covers planted bug where parseInt on empty string produces NaN badge and totals) |
| TC-CATALOG-NEG-04 | Catalog rejects fractional or decimal quantities for discrete physical items | Negative | No |
| TC-CATALOG-NEG-05 | Catalog displays image placeholder fallback when product image source fails to load | Negative | Yes (covers planted bug where 404 image shows broken browser icon instead of image placeholder) |
| TC-CATALOG-EDGE-01 | Long product descriptions wrap cleanly without horizontal clipping or overflow | Edge | Yes (covers planted bug overflow-bug with white-space: nowrap) |
| TC-CATALOG-EDGE-02 | Quantity input rejects non-numeric characters and enforces minimum value of 1 | Edge | No |
| TC-CATALOG-EDGE-03 | Catalog handles high quantity input (e.g., 99 items) without layout breakage | Edge | No |
| TC-CATALOG-EDGE-04 | Adding existing product multiple times aggregates quantity without overwriting cart item | Edge | No |

---

### Positive Cases

#### [TC-CATALOG-POS-01] Catalog displays grid containing all available products with required card elements
- **Category:** Positive
- **Regression:** No
- **Preconditions:** User is authenticated or browsing as guest on `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. Inspect the products grid (`#products-grid`).
  2. Verify all 4 product cards (`.product-card`) are rendered: "Wireless Headphones", "USB-C Hub 7-in-1", "Mechanical Keyboard", "Webcam HD 1080p".
  3. Inspect each card for product name (`.product-name`), description (`.product-desc`), prices (`.price-original`, `.price-discounted`), discount badge (`.badge-discount`), quantity selector (`.qty-input`), and "Add to Cart" button (`.btn-cart`).
- **Expected Result:** All 4 product cards are displayed in the grid with complete required metadata and interactive controls.

#### [TC-CATALOG-POS-02] Catalog page sets document title to "TechShop — Products"
- **Category:** Positive
- **Regression:** Yes (covers planted bug page title remains "Untitled")
- **Preconditions:** Browser open at `http://localhost:3000`, user navigates to `#page-products`.
- **Steps:**
  1. Check `document.title` of the web page.
- **Expected Result:** The document title equals `"TechShop — Products"` rather than default `"Untitled"`.

#### [TC-CATALOG-POS-03] Product card displays accurate discounted price based on stated percentage
- **Category:** Positive
- **Regression:** Yes (covers planted bug discount formula divides by 1000 instead of 100)
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. Inspect the "Wireless Headphones" card (Original price `$89.99`, discount badge `20% OFF`).
  2. Inspect the "USB-C Hub 7-in-1" card (Original price `$34.99`, discount badge `15% OFF`).
  3. Calculate expected discounted prices: `$89.99 * (1 - 0.20) = $71.99`; `$34.99 * (1 - 0.15) = $29.74`.
  4. Compare with the displayed `.price-discounted` text.
- **Expected Result:** Displayed discounted prices reflect the true mathematical discount (`$71.99` for headphones, `$29.74` for USB-C Hub), not the buggy 2% / 1.5% reduction (`$88.19` / `$34.47`).

#### [TC-CATALOG-POS-04] Product card images load with valid image sources and descriptive alt text
- **Category:** Positive
- **Regression:** Yes (covers planted bug broken image URL and missing alt text)
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. Inspect the image tag for "Wireless Headphones" (`.product-card:nth-child(1) img`).
  2. Inspect the image tag for "USB-C Hub 7-in-1" (`.product-card:nth-child(2) img`).
  3. Verify the `src` URL returns HTTP 200 and the element has a non-empty `alt` attribute.
- **Expected Result:** Every product image has a working image URL (no 404 or 500 errors) and descriptive `alt` text (e.g. `alt="Wireless Headphones"`).

---

### Negative Cases

#### [TC-CATALOG-NEG-01] Out-of-stock product card displays badge and disables Add to Cart button
- **Category:** Negative
- **Regression:** Yes (covers planted bug missing out-of-stock badges and disabled buttons)
- **Preconditions:** A product in the catalog is designated as out of stock (inventory = 0).
- **Steps:**
  1. Locate the out-of-stock product card in `#products-grid`.
  2. Check for the presence of an "Out of Stock" visual badge.
  3. Inspect the "Add to Cart" button on that card.
- **Expected Result:** The card clearly displays an "Out of Stock" badge and the "Add to Cart" button has attribute `disabled` (or prevents click action).

#### [TC-CATALOG-NEG-02] Catalog rejects adding item with quantity of zero or negative number
- **Category:** Negative
- **Regression:** Yes (covers planted bug catalog allows non-positive quantity inputs)
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. On the "Wireless Headphones" card, enter `0` into `.qty-input` (`#qty-1`).
  2. Click "Add to Cart".
  3. Enter `-3` into `.qty-input` (`#qty-1`) and click "Add to Cart".
- **Expected Result:** Adding to cart is blocked; the cart badge (`#cart-count`) does not decrease or remain 0, and an error prompt indicates quantity must be at least 1.

#### [TC-CATALOG-NEG-03] Catalog rejects adding product when quantity input is empty or cleared
- **Category:** Negative
- **Regression:** Yes (covers planted bug where parseInt on empty string produces NaN badge and totals)
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. On the "Wireless Headphones" card, clear the value in `#qty-1` so the field is empty (`""`).
  2. Click "Add to Cart".
  3. Inspect the cart badge `#cart-count`.
- **Expected Result:** Click is rejected; the cart badge does not display `NaN` or accept the empty quantity, and the input resets to the minimum quantity of `1`.

#### [TC-CATALOG-NEG-04] Catalog rejects fractional or decimal quantities for discrete physical items
- **Category:** Negative
- **Regression:** No
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. On the "USB-C Hub" card, enter `1.5` or `0.75` into `.qty-input`.
  2. Click "Add to Cart".
- **Expected Result:** Fractional quantities are rejected or rounded to whole integer units; fractional quantities are never added to the cart badge or line items.

#### [TC-CATALOG-NEG-05] Catalog displays image placeholder fallback when product image source fails to load
- **Category:** Negative
- **Regression:** Yes (covers planted bug where 404 image shows broken browser icon instead of image placeholder)
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`; a product image URL fails with HTTP 404/500 (e.g. `BROKEN_LINK_404/headphones.jpg`).
- **Steps:**
  1. Inspect the product image container (`.product-img-wrap`) for the failed image.
  2. Check whether a visual placeholder fallback element is rendered per requirement *"Each card: product name, price, image placeholder, Add to Cart button"*.
- **Expected Result:** Broken images trigger an `onerror` handler displaying a styled placeholder graphic/icon rather than a broken image link icon.

---

### Edge Cases

#### [TC-CATALOG-EDGE-01] Long product descriptions wrap cleanly without horizontal clipping or overflow
- **Category:** Edge
- **Regression:** Yes (covers planted bug overflow-bug with white-space: nowrap)
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. Locate the "Mechanical Keyboard" card which has a long description text.
  2. Inspect the computed CSS styling and bounding box of `.product-desc`.
  3. Check whether the element has `.overflow-bug` or `white-space: nowrap` applied.
- **Expected Result:** Description text wraps across multiple lines within the bounds of the product card without horizontal scrolling or text clipping.

#### [TC-CATALOG-EDGE-02] Quantity input rejects non-numeric characters and enforces minimum value of 1
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`.
- **Steps:**
  1. Type letters `abc` or special symbols `@#$` into `.qty-input`.
  2. Observe the field value and click "Add to Cart".
- **Expected Result:** Non-numeric characters are ignored or rejected, and input defaults to or enforces the minimum value of 1.

#### [TC-CATALOG-EDGE-03] Catalog handles high quantity input (e.g., 99 items) without layout breakage
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User is viewing `#page-products` at `http://localhost:3000`, cart count is 0.
- **Steps:**
  1. Enter `99` into `#qty-1` on the "Wireless Headphones" card.
  2. Click "Add to Cart".
- **Expected Result:** Cart badge `#cart-count` updates to `99` cleanly without badge styling overflow or NaN calculation.

#### [TC-CATALOG-EDGE-04] Adding existing product multiple times aggregates quantity without overwriting cart item
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User is on `#page-products`, cart has 0 items.
- **Steps:**
  1. On "Wireless Headphones", select quantity `2` and click "Add to Cart".
  2. Change quantity to `3` and click "Add to Cart" again on the same product.
  3. Navigate to `#page-cart`.
- **Expected Result:** The cart maintains a single aggregated line item for "Wireless Headphones" with quantity `5` (`2 + 3`) and badge `#cart-count` displaying `5`.

---

## 3. Cart (quantities, discount, totals)

### Summary

| ID | Title | Category | Regression Status |
|---|---|---|---|
| TC-CART-POS-01 | Adding product from catalog updates cart badge, displays toast, and creates cart entry | Positive | No |
| TC-CART-POS-02 | Cart summary calculates and displays subtotal, shipping, and grand total correctly | Positive | No |
| TC-CART-POS-03 | Increasing item quantity recalculates line total and order summary totals | Positive | Yes (covers planted bug cart totals frozen upon quantity change) |
| TC-CART-POS-04 | Removing an item removes row, decrements badge, and updates order totals | Positive | Yes (covers planted bug totals not recalculated when removing item) |
| TC-CART-POS-05 | Empty cart displays message "Your cart is empty" and "Shop Now" button | Positive | Yes (covers planted bug empty cart message punctuation mismatch) |
| TC-CART-POS-06 | Proceed to Checkout button navigates user to checkout form | Positive | Yes (covers planted bug proceedToCheckoutBuggy returning false) |
| TC-CART-NEG-01 | Cart rejects quantity input of 0 or negative numbers and enforces minimum of 1 | Negative | Yes (covers planted bug negative and zero quantities accepted) |
| TC-CART-NEG-02 | Checkout rejected when order value is under $10.00 minimum threshold | Negative | Yes (covers planted bug missing $10.00 minimum order threshold check) |
| TC-CART-NEG-03 | Cart rejects empty quantity input and prevents NaN calculation in line and order totals | Negative | Yes (covers planted bug where clearing quantity input produces NaN in cart) |
| TC-CART-NEG-04 | Cart rejects fractional or decimal quantity updates | Negative | No |
| TC-CART-NEG-05 | Proceed to Checkout is disabled or blocked when cart is empty | Negative | No |
| TC-CART-EDGE-01 | Cart updates totals accurately when order value is at the $10.00 threshold boundary | Edge | Yes (covers planted bug boundary handling at minimum order value) |
| TC-CART-EDGE-02 | Increment and decrement controls enforce bounds at boundary value 1 | Edge | Yes (covers planted bug missing increment/decrement controls and lower boundary enforcement) |
| TC-CART-EDGE-03 | Cart retains state across intra-session client navigation between products and cart views | Edge | No |
| TC-CART-EDGE-04 | Removing all items updates shipping from $4.99 to $0.00 and transitions to empty cart state | Edge | Yes (covers planted bug where removing items keeps frozen totals and shipping) |
| TC-CART-EDGE-05 | Cart calculation maintains exact two-decimal precision without floating-point rounding errors | Edge | No |

---

### Positive Cases

#### [TC-CART-POS-01] Adding product from catalog updates cart badge, displays toast, and creates cart entry
- **Category:** Positive
- **Regression:** No
- **Preconditions:** User is on `#page-products`, cart is empty (`#cart-count` is `0`).
- **Steps:**
  1. On product "Wireless Headphones", ensure quantity is 1 and click "Add to Cart".
  2. Verify toast message (`#toast`).
  3. Verify navbar cart badge (`#cart-count`).
  4. Click "Cart" icon (`.cart-icon`).
- **Expected Result:** Toast displays `"Wireless Headphones added to cart!"`, badge displays `1`, and cart page `#page-cart` displays one item row (`.cart-item`) for Wireless Headphones.

#### [TC-CART-POS-02] Cart summary calculates and displays subtotal, shipping, and grand total correctly
- **Category:** Positive
- **Regression:** No
- **Preconditions:** Cart contains 1 unit of Wireless Headphones (unit price $71.99).
- **Steps:**
  1. Open Shopping Cart (`#page-cart`).
  2. Inspect Subtotal (`#cart-subtotal`), Shipping ($4.99), and Total (`#cart-total`).
- **Expected Result:** Subtotal equals `$71.99`, shipping equals `$4.99`, and grand total equals `$76.98` (`$71.99 + $4.99`).

#### [TC-CART-POS-03] Increasing item quantity recalculates line total and order summary totals
- **Category:** Positive
- **Regression:** Yes (covers planted bug cart totals frozen upon quantity change)
- **Preconditions:** Cart contains 1 unit of Wireless Headphones ($71.99), currently on `#page-cart`.
- **Steps:**
  1. Locate the item quantity input (`.cart-item-qty`).
  2. Change quantity from `1` to `3`.
  3. Inspect the line subtotal (`.cart-item-subtotal`), order subtotal (`#cart-subtotal`), and grand total (`#cart-total`).
- **Expected Result:** Line subtotal updates to `$215.97` (`3 * $71.99`), order subtotal updates to `$215.97`, and grand total updates to `$220.96` (`$215.97 + $4.99`), rather than remaining frozen at initial amounts.

#### [TC-CART-POS-04] Removing an item removes row, decrements badge, and updates order totals
- **Category:** Positive
- **Regression:** Yes (covers planted bug totals not recalculated when removing item)
- **Preconditions:** Cart contains 2 distinct items (e.g. Wireless Headphones and USB-C Hub).
- **Steps:**
  1. Open `#page-cart` and note initial subtotal.
  2. Click the "Remove" button (`page.getByRole('button', { name: 'Remove' })`) on the USB-C Hub item row.
  3. Inspect DOM for the removed row, navbar badge `#cart-count`, and summary totals `#cart-subtotal` and `#cart-total`.
- **Expected Result:** The item row `#cart-item-2` is removed from DOM, `#cart-count` decrements by the removed item's quantity, and `#cart-subtotal` / `#cart-total` recalculate immediately to reflect only the remaining item.

#### [TC-CART-POS-05] Empty cart displays message "Your cart is empty" and "Shop Now" button
- **Category:** Positive
- **Regression:** Yes (covers planted bug empty cart message punctuation mismatch)
- **Preconditions:** Cart has 0 items.
- **Steps:**
  1. Navigate to `#page-cart` by clicking the Cart icon.
  2. Inspect the empty cart container (`.cart-empty`).
  3. Verify the paragraph text and presence of "Shop Now" button.
- **Expected Result:** The empty state renders with exact requirement text `"Your cart is empty"` (without an unwanted trailing period) and a clickable "Shop Now" button that routes to `#page-products`.

#### [TC-CART-POS-06] Proceed to Checkout button navigates user to checkout form
- **Category:** Positive
- **Regression:** Yes (covers planted bug proceedToCheckoutBuggy returning false)
- **Preconditions:** Cart contains at least 1 item; user is on `#page-cart`.
- **Steps:**
  1. Click the "Proceed to Checkout" button (`page.getByRole('button', { name: 'Proceed to Checkout' })`).
- **Expected Result:** `#page-cart` is hidden and `#page-checkout` is displayed showing the checkout form panels.

---

### Negative Cases

#### [TC-CART-NEG-01] Cart rejects quantity input of 0 or negative numbers and enforces minimum of 1
- **Category:** Negative
- **Regression:** Yes (covers planted bug negative and zero quantities accepted)
- **Preconditions:** Cart has 1 item; user is on `#page-cart`.
- **Steps:**
  1. Change `.cart-item-qty` to `0`.
  2. Observe behavior and totals.
  3. Change `.cart-item-qty` to `-2`.
  4. Check navbar `#cart-count`.
- **Expected Result:** Quantities `<= 0` are rejected; input resets to minimum `1` (or prompts for item deletion), and `#cart-count` is never set to a negative number or zero without removing the item.

#### [TC-CART-NEG-02] Checkout rejected when order value is under $10.00 minimum threshold
- **Category:** Negative
- **Regression:** Yes (covers planted bug missing $10.00 minimum order threshold check)
- **Preconditions:** Cart contains items whose subtotal is under $10.00 (e.g. an accessory or discounted item totaling $8.00).
- **Steps:**
  1. Navigate to `#page-cart` with an order subtotal under `$10.00`.
  2. Click "Proceed to Checkout".
- **Expected Result:** Checkout is blocked, user remains on `#page-cart`, and the exact requirement error message is displayed: `"Minimum order value is $10.00"`.

#### [TC-CART-NEG-03] Cart rejects empty quantity input and prevents NaN calculation in line and order totals
- **Category:** Negative
- **Regression:** Yes (covers planted bug where clearing quantity input produces NaN in cart)
- **Preconditions:** Cart contains 1 item; user is on `#page-cart`.
- **Steps:**
  1. Select the `.cart-item-qty` field on an item and backspace all digits so the field is empty.
  2. Trigger change event (press Enter or blur focus).
  3. Inspect `.cart-item-subtotal`, `#cart-subtotal`, and `#cart-total`.
- **Expected Result:** The field rejects empty value, resets to at least `1`, and summary totals do not display `$NaN`.

#### [TC-CART-NEG-04] Cart rejects fractional or decimal quantity updates
- **Category:** Negative
- **Regression:** No
- **Preconditions:** Cart contains 1 item; user is on `#page-cart`.
- **Steps:**
  1. Enter `2.75` into `.cart-item-qty`.
  2. Trigger change event.
- **Expected Result:** Decimal inputs are rejected or rounded to whole integers; totals recalculate based on whole units only.

#### [TC-CART-NEG-05] Proceed to Checkout is disabled or blocked when cart is empty
- **Category:** Negative
- **Regression:** No
- **Preconditions:** Cart contains 0 items (`#page-cart` displays empty state).
- **Steps:**
  1. Verify the empty cart view (`.cart-empty`).
  2. Attempt to trigger the checkout action.
- **Expected Result:** "Proceed to Checkout" button is not visible or disabled; user cannot initiate checkout on an empty cart.

---

### Edge Cases

#### [TC-CART-EDGE-01] Cart updates totals accurately when order value is at the $10.00 threshold boundary
- **Category:** Edge
- **Regression:** Yes (covers planted bug boundary handling at minimum order value)
- **Preconditions:** Cart items total exactly $10.00 in subtotal.
- **Steps:**
  1. Open `#page-cart` with subtotal exactly equal to `$10.00`.
  2. Click "Proceed to Checkout".
- **Expected Result:** The order meets the threshold; checkout is permitted and navigates to `#page-checkout`.

#### [TC-CART-EDGE-02] Increment and decrement controls enforce bounds at boundary value 1
- **Category:** Edge
- **Regression:** Yes (covers planted bug missing increment/decrement controls and lower boundary enforcement)
- **Preconditions:** Cart contains 1 item with quantity = 1.
- **Steps:**
  1. Inspect the quantity controls for increment (+) and decrement (-) buttons.
  2. Click the decrement control when quantity is 1.
- **Expected Result:** Decrement button is disabled or prevented from reducing quantity below 1, enforcing the lower boundary.

#### [TC-CART-EDGE-03] Cart retains state across intra-session client navigation between products and cart views
- **Category:** Edge
- **Regression:** No
- **Preconditions:** Cart contains 2 items; user is on `#page-cart`.
- **Steps:**
  1. Click "Continue Shopping" button to return to `#page-products`.
  2. Add another item or click "Cart" icon to return to `#page-cart`.
- **Expected Result:** Existing cart items and quantities remain intact across view transitions within the browser session.

#### [TC-CART-EDGE-04] Removing all items updates shipping from $4.99 to $0.00 and transitions to empty cart state
- **Category:** Edge
- **Regression:** Yes (covers planted bug where removing items keeps frozen totals and shipping)
- **Preconditions:** Cart contains 1 item; user is on `#page-cart`.
- **Steps:**
  1. Note that shipping is `$4.99`.
  2. Click "Remove" on the single cart item.
  3. Inspect the resulting view and shipping calculation.
- **Expected Result:** Shipping updates to `$0.00`, totals clear, and the empty cart panel with message `"Your cart is empty"` is immediately rendered.

#### [TC-CART-EDGE-05] Cart calculation maintains exact two-decimal precision without floating-point rounding errors
- **Category:** Edge
- **Regression:** No
- **Preconditions:** Cart contains items with uneven discount calculations (e.g. 3 different items).
- **Steps:**
  1. Add 1 Wireless Headphones ($71.99), 1 USB-C Hub ($29.74), and 1 Mechanical Keyboard ($116.99).
  2. Open `#page-cart`.
  3. Inspect Subtotal (`$218.72`), Shipping (`$4.99`), and Grand Total (`$223.71`).
- **Expected Result:** All calculations format to strictly two decimal places without floating-point artifacts (e.g. no `$223.71000000000004`).

---

## 4. Checkout (card validation, submission, confirmation)

### Summary

| ID | Title | Category | Regression Status |
|---|---|---|---|
| TC-CHECKOUT-POS-01 | Valid checkout submission navigates to confirmation page with complete order details | Positive | Yes (covers planted bug confirmation page missing order reference, items, and total) |
| TC-CHECKOUT-POS-02 | Order summary panel in checkout displays items, subtotal, shipping, and grand total | Positive | Yes (covers planted bug order summary panel displaying "Nothing to show here.") |
| TC-CHECKOUT-POS-03 | Successful checkout clears the cart state and resets cart badge to 0 | Positive | Yes (covers planted bug cart not cleared after order placement) |
| TC-CHECKOUT-NEG-01 | Empty checkout submission is rejected with validation error indicators on all required fields | Negative | Yes (covers planted bug empty submission accepted) |
| TC-CHECKOUT-NEG-02 | Checkout rejects malformed email address missing @ or domain | Negative | Yes (covers planted bug invalid email accepted) |
| TC-CHECKOUT-NEG-03 | Checkout rejects card number with fewer or more than 16 digits | Negative | Yes (covers planted bug card number format check absent) |
| TC-CHECKOUT-NEG-04 | Checkout rejects phone number that is not exactly 10 digits | Negative | Yes (covers planted bug phone number format check absent) |
| TC-CHECKOUT-NEG-05 | Checkout rejects card expiry date that is in the past | Negative | Yes (covers planted bug expired card date accepted) |
| TC-CHECKOUT-NEG-06 | Checkout rejects CVV with fewer or more than 3 digits | Negative | Yes (covers planted bug CVV check absent) |
| TC-CHECKOUT-NEG-07 | Checkout rejects CVV containing letters or special characters | Negative | Yes (covers planted bug CVV non-numeric input validation missing) |
| TC-CHECKOUT-NEG-08 | Checkout rejects card number containing non-numeric characters | Negative | Yes (covers planted bug card number non-numeric input validation missing) |
| TC-CHECKOUT-NEG-09 | Checkout rejects card expiry with invalid month or malformed date structure | Negative | Yes (covers planted bug card expiry format check missing) |
| TC-CHECKOUT-NEG-10 | Checkout rejects phone number containing alphabetic characters or symbols | Negative | Yes (covers planted bug phone number non-numeric input validation missing) |
| TC-CHECKOUT-EDGE-01 | Checkout accepts card expiry date set to the current month and current year | Edge | No |
| TC-CHECKOUT-EDGE-02 | Checkout accepts card number entered with spaces or dashes (16 digits formatted) | Edge | No |
| TC-CHECKOUT-EDGE-03 | Checkout handles international or maximum length characters in Name and Address fields | Edge | No |
| TC-CHECKOUT-EDGE-04 | Checkout rejects submission when accessed directly with an empty cart | Edge | Yes (covers planted bug unvalidated checkout with empty cart) |
| TC-CHECKOUT-EDGE-05 | ZIP code field accepts 5-digit US ZIP and 9-digit ZIP+4 formats while rejecting non-numeric strings | Edge | No |

---

### Positive Cases

#### [TC-CHECKOUT-POS-01] Valid checkout submission navigates to confirmation page with complete order details
- **Category:** Positive
- **Regression:** Yes (covers planted bug confirmation page missing order reference, items, and total)
- **Preconditions:** Cart contains items, user is on `#page-checkout`.
- **Steps:**
  1. Fill First Name `#co-firstname` (`Jane`) and Last Name `#co-lastname` (`Doe`).
  2. Fill Address `#co-address` (`123 Market St`), City `#co-city` (`Austin`), ZIP `#co-zip` (`78701`).
  3. Fill Email Address `#co-email` (`jane.doe@example.com`).
  4. Fill Phone Number `#co-phone` (`5551234567`).
  5. Fill Card Number `#co-card` (`4111111111111111`).
  6. Fill Expiry `#co-expiry` with a future date (`12/30`).
  7. Fill CVV `#co-cvv` (`123`).
  8. Click "Place Order" button (`page.getByRole('button', { name: 'Place Order' })`).
- **Expected Result:** `#page-checkout` is hidden, `#page-confirm` is displayed showing:
  - Success message ("Order Placed!")
  - Unique order reference identifier
  - List of purchased items and quantities
  - Final order total matching cart amount

#### [TC-CHECKOUT-POS-02] Order summary panel in checkout displays items, subtotal, shipping, and grand total
- **Category:** Positive
- **Regression:** Yes (covers planted bug order summary panel displaying "Nothing to show here.")
- **Preconditions:** Cart contains 1 unit of Wireless Headphones ($71.99) and 1 unit of USB-C Hub ($29.74); user navigates to `#page-checkout`.
- **Steps:**
  1. Inspect the `.checkout-order-panel` sidebar.
- **Expected Result:** The panel displays dynamic order details (items, subtotal $101.73, shipping $4.99, grand total $106.72) instead of static placeholder `"Nothing to show here."`.

#### [TC-CHECKOUT-POS-03] Successful checkout clears the cart state and resets cart badge to 0
- **Category:** Positive
- **Regression:** Yes (covers planted bug cart not cleared after order placement)
- **Preconditions:** Order placed successfully; user is on `#page-confirm`.
- **Steps:**
  1. Check navbar cart badge `#cart-count`.
  2. Click "Continue Shopping" or navigate to `#page-cart`.
- **Expected Result:** Navbar badge `#cart-count` displays `0`, and navigating to `#page-cart` shows the empty cart state ("Your cart is empty").

---

### Negative Cases

#### [TC-CHECKOUT-NEG-01] Empty checkout submission is rejected with validation error indicators on all required fields
- **Category:** Negative
- **Regression:** Yes (covers planted bug empty submission accepted)
- **Preconditions:** User on `#page-checkout` with all input fields empty.
- **Steps:**
  1. Click "Place Order" button without entering any values.
- **Expected Result:** Submission is blocked; user remains on `#page-checkout`, `#page-confirm` is not shown, and required field validation errors/styling appear on missing fields.

#### [TC-CHECKOUT-NEG-02] Checkout rejects malformed email address missing @ or domain
- **Category:** Negative
- **Regression:** Yes (covers planted bug invalid email accepted)
- **Preconditions:** User on `#page-checkout` with valid shipping and payment details filled.
- **Steps:**
  1. Fill `invalid-email-address` into `#co-email`.
  2. Click "Place Order".
- **Expected Result:** Submission is rejected; user remains on `#page-checkout` and an error specifies that email format is invalid.

#### [TC-CHECKOUT-NEG-03] Checkout rejects card number with fewer or more than 16 digits
- **Category:** Negative
- **Regression:** Yes (covers planted bug card number format check absent)
- **Preconditions:** User on `#page-checkout` with all valid fields except Card Number.
- **Steps:**
  1. Fill `999` (3 digits) into `#co-card` and click "Place Order".
  2. Fill `12345678901234567` (17 digits) into `#co-card` and click "Place Order".
- **Expected Result:** Submissions are rejected with an error message indicating card number must be exactly 16 digits.

#### [TC-CHECKOUT-NEG-04] Checkout rejects phone number that is not exactly 10 digits
- **Category:** Negative
- **Regression:** Yes (covers planted bug phone number format check absent)
- **Preconditions:** User on `#page-checkout` with all valid fields except Phone Number.
- **Steps:**
  1. Fill `12345` (5 digits) into `#co-phone`.
  2. Click "Place Order".
- **Expected Result:** Submission is rejected with an error indicating phone number must be exactly 10 digits.

#### [TC-CHECKOUT-NEG-05] Checkout rejects card expiry date that is in the past
- **Category:** Negative
- **Regression:** Yes (covers planted bug expired card date accepted)
- **Preconditions:** User on `#page-checkout` with all valid fields except Expiry Date.
- **Steps:**
  1. Fill `01/20` (past month/year) into `#co-expiry`.
  2. Click "Place Order".
- **Expected Result:** Submission is rejected with an error indicating card expiry date cannot be in the past.

#### [TC-CHECKOUT-NEG-06] Checkout rejects CVV with fewer or more than 3 digits
- **Category:** Negative
- **Regression:** Yes (covers planted bug CVV check absent)
- **Preconditions:** User on `#page-checkout` with all valid fields except CVV.
- **Steps:**
  1. Fill `1` (1 digit) into `#co-cvv` and click "Place Order".
  2. Fill `1234` (4 digits) into `#co-cvv` and click "Place Order".
- **Expected Result:** Submissions are rejected with an error indicating CVV must be exactly 3 digits.

#### [TC-CHECKOUT-NEG-07] Checkout rejects CVV containing letters or special characters
- **Category:** Negative
- **Regression:** Yes (covers planted bug CVV non-numeric input validation missing)
- **Preconditions:** User on `#page-checkout` with all valid fields except CVV.
- **Steps:**
  1. Fill `abc` into `#co-cvv` and click "Place Order".
  2. Fill `12#` into `#co-cvv` and click "Place Order".
- **Expected Result:** Submissions are rejected with an error indicating CVV must consist of exactly 3 numeric digits.

#### [TC-CHECKOUT-NEG-08] Checkout rejects card number containing non-numeric characters
- **Category:** Negative
- **Regression:** Yes (covers planted bug card number non-numeric input validation missing)
- **Preconditions:** User on `#page-checkout` with all valid fields except Card Number.
- **Steps:**
  1. Fill `4111abcd22223333` (containing letters) into `#co-card`.
  2. Click "Place Order".
- **Expected Result:** Submission is rejected with an error requiring 16 numeric digits.

#### [TC-CHECKOUT-NEG-09] Checkout rejects card expiry with invalid month or malformed date structure
- **Category:** Negative
- **Regression:** Yes (covers planted bug card expiry format check missing)
- **Preconditions:** User on `#page-checkout` with all valid fields except Expiry Date.
- **Steps:**
  1. Fill `13/28` (month 13) into `#co-expiry` and click "Place Order".
  2. Fill `00/27` (month 00) into `#co-expiry` and click "Place Order".
  3. Fill `1228` (missing `/` separator) into `#co-expiry` and click "Place Order".
- **Expected Result:** Submissions are rejected with an error indicating expiration must follow valid MM/YY format (months 01-12).

#### [TC-CHECKOUT-NEG-10] Checkout rejects phone number containing alphabetic characters or symbols
- **Category:** Negative
- **Regression:** Yes (covers planted bug phone number non-numeric input validation missing)
- **Preconditions:** User on `#page-checkout` with all valid fields except Phone Number.
- **Steps:**
  1. Fill `555-CALL-NOW` or `555123abcd` into `#co-phone`.
  2. Click "Place Order".
- **Expected Result:** Submission is rejected with an error indicating phone number must contain 10 numeric digits.

---

### Edge Cases

#### [TC-CHECKOUT-EDGE-01] Checkout accepts card expiry date set to the current month and current year
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User on `#page-checkout` with all other fields valid.
- **Steps:**
  1. Fill `#co-expiry` with the current month and year (e.g. current date is valid through end of month).
  2. Click "Place Order".
- **Expected Result:** Card is accepted as unexpired; order submission proceeds.

#### [TC-CHECKOUT-EDGE-02] Checkout accepts card number entered with spaces or dashes (16 digits formatted)
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User on `#page-checkout` with all other fields valid.
- **Steps:**
  1. Fill `4111 1111 1111 1111` or `4111-1111-1111-1111` into `#co-card`.
  2. Click "Place Order".
- **Expected Result:** Input sanitizes delimiters and verifies 16 digits, proceeding with successful order placement.

#### [TC-CHECKOUT-EDGE-03] Checkout handles international or maximum length characters in Name and Address fields
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User on `#page-checkout` with valid payment and contact details.
- **Steps:**
  1. Fill accented / international characters (e.g. `Renée`, `Müller-Straße`) in Name and Address fields.
  2. Click "Place Order".
- **Expected Result:** Form handles Unicode characters correctly and confirms order with correct name rendering on confirmation view.

#### [TC-CHECKOUT-EDGE-04] Checkout rejects submission when accessed directly with an empty cart
- **Category:** Edge
- **Regression:** Yes (covers planted bug unvalidated checkout with empty cart)
- **Preconditions:** Cart has 0 items; user navigates directly to `#page-checkout`.
- **Steps:**
  1. Fill valid shipping, contact, and payment details.
  2. Click "Place Order".
- **Expected Result:** Order submission is blocked; application warns that the cart is empty and redirects to `#page-products`.

#### [TC-CHECKOUT-EDGE-05] ZIP code field accepts 5-digit US ZIP and 9-digit ZIP+4 formats while rejecting non-numeric strings
- **Category:** Edge
- **Regression:** No
- **Preconditions:** User on `#page-checkout` with all other fields valid.
- **Steps:**
  1. Fill `78701` into `#co-zip` and verify acceptance.
  2. Fill `78701-1234` into `#co-zip` and verify acceptance.
  3. Fill `ABCDE` into `#co-zip` and click "Place Order".
- **Expected Result:** Valid 5-digit and 9-digit postal codes are accepted, while alphabetic inputs are rejected with a postal code validation error.
