# Exploration Notes

## Login

### Flows
1. **Normal Login**:
   1. Navigate to base URL (`http://localhost:3000`).
   2. Verify login card is visible with "Welcome back" heading.
   3. Fill in Username / Email field with valid credentials (`demo@techshop.com`).
   4. Fill in Password field with valid credentials (`password123`).
   5. Click "Sign In" button.
   6. Verify navigation to product catalog page ("Our Products").
2. **Empty Field Validation**:
   1. Navigate to `http://localhost:3000`.
   2. Leave both fields blank.
   3. Click "Sign In".
3. **Invalid Credentials**:
   1. Navigate to `http://localhost:3000`.
   2. Enter valid user `demo@techshop.com` with wrong password `wrongpassword999`.
   3. Click "Sign In".
4. **Invalid Email Format**:
   1. Navigate to `http://localhost:3000`.
   2. Enter malformed email `not-an-email` with password `password123`.
   3. Click "Sign In".
5. **Session Persistence**:
   1. Authenticate to reach the catalog view.
   2. Reload the browser page (`http://localhost:3000`).
   3. Observe whether user stays on catalog or is returned to login.

### Selectors
- **Username / Email field**: `page.getByLabel('Username')` (or `page.getByPlaceholder('Enter username')`)
- **Password field**: `page.getByLabel('Password')` (or `page.getByPlaceholder('Enter password')`)
- **Sign In button**: `page.getByRole('button', { name: 'Sign In' })`
- **Browse as Guest button**: `page.getByRole('button', { name: 'Browse as Guest' })`
- **Error message container**: `page.locator('#toast')` (or `page.getByRole('alert')` once implemented properly)

### Surprises
- **Password displayed in plaintext**  
  *[Breaks: "Password field must mask input characters"]*
  - *What was done*: Inspected `#login-pass` element and typed credentials.
  - *Expected*: Input characters masked with dots/bullets (`type="password"`).
  - *Actual*: Password field is rendered as `<input type="text">`, exposing the password in plaintext.
- **Empty submission accepted**  
  *[Breaks: "Empty fields must be rejected with an error message"]*
  - *What was done*: Clicked "Sign In" with both username and password fields left blank.
  - *Expected*: Submission rejected with a visible validation error message, remaining on login view.
  - *Actual*: Immediately bypassed authentication and redirected to product catalog with no error displayed.
- **Invalid credentials accepted**  
  *[Breaks: "Failed login shows error message, stays on login page"]*
  - *What was done*: Entered valid username `demo@techshop.com` with incorrect password `wrongpassword999`, then clicked "Sign In".
  - *Expected*: Submission rejected with an error message indicating invalid credentials, remaining on login view.
  - *Actual*: Immediately redirected to product catalog with no error displayed.
- **Malformed email format accepted**  
  *[Breaks: "Email must be valid format (contains @ and domain)"]*
  - *What was done*: Entered `not-an-email` and `password123`, then clicked "Sign In".
  - *Expected*: Rejection error indicating invalid email format.
  - *Actual*: Accepted without error and redirected to product catalog (`app.js` allows hardcoded `admin` and unvalidated strings).
- **Session lost on browser reload**  
  *[Breaks: "Session persists for the browser session"]*
  - *What was done*: Logged in to reach products, then reloaded the browser.
  - *Expected*: Session state persists within the browser session, keeping user on products view.
  - *Actual*: Page reset back to initial login screen because authentication state is not stored in session storage.
- **Missing user session indicators in UI**  
  *[Breaks: "Session persists for the browser session"]*
  - *What was done*: Logged in with valid credentials (`demo@techshop.com` / `password123`).
  - *Expected*: Visible indicator of active session (e.g. user email in navbar, logout button) and page title updated to `"TechShop — Products"`.
  - *Actual*: Navbar remained unchanged (no user profile or logout button), and page `<title>` remained `"Untitled"`.

## Catalog

### Flows
1. Reach the catalog page (by logging in, clicking "Browse as Guest", or clicking "Products" in the top navbar).
2. Verify page header "Our Products" and subtitle "Discover the latest tech gadgets at great prices".
3. Browse products in the grid (Wireless Headphones, USB-C Hub 7-in-1, Mechanical Keyboard, Webcam HD 1080p).
4. Review product details: image, title, description, original price, discounted price, discount percentage badge, quantity selector, and "Add to Cart" button.

### Selectors
- **Products navbar link**: `page.getByRole('link', { name: 'Products' })` (or `page.locator('nav').getByText('Products')`)
- **Product card container**: `page.locator('.product-card')`
- **Product card by name**: `page.locator('.product-card').filter({ hasText: 'Wireless Headphones' })`
- **Product title**: `card.locator('.product-name')`
- **Product description**: `card.locator('.product-desc')`
- **Original price**: `card.locator('.price-original')`
- **Discounted price**: `card.locator('.price-discounted')`
- **Discount badge**: `card.locator('.badge-discount')`
- **Quantity input**: `card.locator('.qty-input')` (or `card.getByLabel('Qty:')`)
- **Add to Cart button**: `card.getByRole('button', { name: 'Add to Cart' })`
- **Cart badge / counter**: `page.locator('#cart-count')`

### Surprises
- **Navbar visible before login**  
  *[Breaks: Access control expectation / "Users log in with email and password"]*
  - *What was done*: Inspected the login screen upon first load.
  - *Expected*: Top navigation should be hidden or restricted on unauthenticated login screen.
  - *Actual*: Navbar with "Products" and "Cart" is displayed immediately; clicking "Products" bypasses login entirely.
- **Page title not set**  
  *[Breaks: "Page title: \"TechShop — Products\""]*
  - *What was done*: Checked `document.title` on the catalog view.
  - *Expected*: `"TechShop — Products"` per requirements.
  - *Actual*: Document title is `"Untitled"`.
- **Broken product images**  
  *[Breaks: "Each card: product name, price, image placeholder, Add to Cart button"]*
  - *What was done*: Inspected product card images in browser and network log.
  - *Expected*: Valid placeholder or product images for all items with proper `alt` text.
  - *Actual*: Wireless Headphones has a broken 404 URL (`BROKEN_LINK_404/headphones.jpg`) and lacks an `alt` attribute; USB-C Hub image fails with HTTP 500.
- **Incorrect discount math**  
  *[Breaks: "Each card: product name, price, image placeholder, Add to Cart button" / Pricing accuracy]*
  - *What was done*: Compared stated discount badge to calculated price (e.g. Wireless Headphones: $89.99 with 20% OFF displayed as $88.19).
  - *Expected*: 20% discount should reduce price by $18.00 to $71.99.
  - *Actual*: Code divides discount by 1000 instead of 100 (`calcDiscountedBuggy`), giving only a 2% reduction ($1.80).
- **Description text clipped / overflow**  
  *[Breaks: "Each card: product name, price, image placeholder, Add to Cart button"]*
  - *What was done*: Inspected Mechanical Keyboard product card description.
  - *Expected*: Multi-line description wrapping cleanly within the card body.
  - *Actual*: Class `.overflow-bug` applies `white-space: nowrap`, truncating the text horizontally within the card.
- **Missing out-of-stock badges and disabled buttons**  
  *[Breaks: "Out of Stock products show badge and disabled button"]*
  - *What was done*: Checked for inventory / stock indicators across all products.
  - *Expected*: Out-of-stock items show a badge and disabled "Add to Cart" button per requirements.
  - *Actual*: No stock indicators or disabled button states exist in the catalog.

## Cart

### Flows
1. **Adding Items to Cart**:
   1. From catalog, set quantity on a product card and click "Add to Cart".
   2. Verify toast notification appears ("{Product Name} added to cart!") and cart badge increments.
2. **Viewing Cart**:
   1. Click "Cart" in the navbar to open Shopping Cart view (`#page-cart`).
   2. Verify item list (image, name, unit price, quantity, line total, remove button) and summary panel (Subtotal, Shipping, Total).
3. **Empty Cart Display**:
   1. Navigate to Cart before adding items (or after removing all items).
   2. Verify empty cart message and "Shop Now" button.
4. **Modifying Item Quantity**:
   1. Change quantity input value in cart.
   2. Check if line subtotal, order subtotal, and total update.
   3. Attempt to set quantity to 0 or negative values.
5. **Removing Items**:
   1. Click "Remove" button on a cart item.
   2. Verify row removal, cart badge decrement, and order totals recalculation.
6. **Proceeding to Checkout**:
   1. Click "Proceed to Checkout" button.
   2. Verify navigation to `#page-checkout`.

### Selectors
- **Cart navbar icon / link**: `page.locator('.cart-icon')` (or `page.locator('nav').getByText(/Cart/i)`)
- **Cart item row**: `page.locator('.cart-item')` (or `page.locator('#cart-item-1')`)
- **Cart item quantity input**: `page.locator('.cart-item-qty')`
- **Cart item subtotal**: `page.locator('.cart-item-subtotal')`
- **Remove button**: `page.getByRole('button', { name: 'Remove' })`
- **Order subtotal**: `page.locator('#cart-subtotal')`
- **Order total**: `page.locator('#cart-total')`
- **Proceed to Checkout button**: `page.getByRole('button', { name: 'Proceed to Checkout' })`
- **Continue Shopping button**: `page.getByRole('button', { name: 'Continue Shopping' })`
- **Empty cart container**: `page.locator('.cart-empty')`
- **Empty cart message**: `page.locator('.cart-empty p')`

### Surprises
- **Cart totals are frozen upon quantity change**  
  *[Breaks: "Cart shows: name, unit price, quantity, line total, order total"]*
  - *What was done*: Changed item quantity from 1 to 3 in the cart.
  - *Expected*: Line subtotal, order subtotal, and order total recalculate dynamically.
  - *Actual*: The cart badge updated to 3, but the item subtotal, order subtotal, and order total remained frozen at their initial 1-item amounts (`_frozenTotal`).
- **No minimum quantity validation / negative quantities allowed**  
  *[Breaks: "Increment/decrement quantity controls — minimum 1"]*
  - *What was done*: Entered 0 and negative numbers (`-2`) into `.cart-item-qty`.
  - *Expected*: Minimum quantity enforced at 1 with increment/decrement controls; values < 1 rejected or prompt removal.
  - *Actual*: Accepted `0` and `-2`, setting the navbar cart badge to `-2` without updating totals or removing the item.
- **Totals do not recalculate when removing an item**  
  *[Breaks: "Remove individual items" and "Cart shows: name, unit price, quantity, line total, order total"]*
  - *What was done*: Added two items to cart ($122.66 subtotal), then clicked "Remove" on one item.
  - *Expected*: Item row removed, badge decremented, and order totals recalculate to reflect only remaining items.
  - *Actual*: Item row was removed and badge decremented, but order subtotal and total stayed frozen at $122.66 and $127.65.
- **Proceed to Checkout button is completely non-functional**  
  *[Breaks: "Accessible via \"Proceed to Checkout\" button in cart"]*
  - *What was done*: Clicked "Proceed to Checkout" button.
  - *Expected*: Navigates to the Checkout form (`#page-checkout`).
  - *Actual*: Nothing happens; `proceedToCheckoutBuggy()` simply returns `false` without transitioning views.
- **No minimum order threshold ($10.00) enforcement**  
  *[Breaks: "Orders under $10.00 rejected with message: \"Minimum order value is $10.00\""]*
  - *What was done*: Evaluated cart logic for orders under $10.00.
  - *Expected*: Checkout blocked with message *"Minimum order value is $10.00"*.
  - *Actual*: No minimum order check is implemented in the application logic.
- **Empty cart message punctuation mismatch**  
  *[Breaks: "Empty cart message: \"Your cart is empty\""]*
  - *What was done*: Inspected empty cart view.
  - *Expected*: Text matches exact string: `"Your cart is empty"`.
  - *Actual*: Displays `"Your cart is empty."` (with trailing period).

## Checkout

### Flows
1. **Navigating to Checkout**:
   1. Access `#page-checkout` (currently requires `showPage('checkout')` due to broken cart button).
   2. Verify form panels: Shipping Information, Contact Details, Payment, and Order Summary.
2. **Empty Submission Check**:
   1. Click "Place Order" with all fields empty.
3. **Contact & Payment Field Validation**:
   1. Enter invalid email (`not-an-email`), short phone (`12345`), short card number (`999`), expired date (`01/20`), short CVV (`1`).
   2. Click "Place Order".
4. **Valid Order Submission**:
   1. Fill valid shipping, contact, and 16-digit card / future expiry / 3-digit CVV.
   2. Click "Place Order".
   3. Verify confirmation screen details.

### Selectors
- **First Name field**: `page.getByLabel('First Name')` (or `page.locator('#co-firstname')`)
- **Last Name field**: `page.getByLabel('Last Name')` (or `page.locator('#co-lastname')`)
- **Address field**: `page.getByLabel('Address')` (or `page.locator('#co-address')`)
- **City field**: `page.getByLabel('City')` (or `page.locator('#co-city')`)
- **ZIP Code field**: `page.getByLabel('ZIP Code')` (or `page.locator('#co-zip')`)
- **Email Address field**: `page.getByLabel('Email Address')` (or `page.locator('#co-email')`)
- **Phone Number field**: `page.getByLabel('Phone Number')` (or `page.locator('#co-phone')`)
- **Card Number field**: `page.getByLabel('Card Number')` (or `page.locator('#co-card')`)
- **Expiry Date field**: `page.getByLabel('Expiry')` (or `page.locator('#co-expiry')`)
- **CVV field**: `page.getByLabel('CVV')` (or `page.locator('#co-cvv')`)
- **Place Order button**: `page.getByRole('button', { name: 'Place Order' })`
- **Continue Shopping button (Confirmation)**: `page.getByRole('button', { name: 'Continue Shopping' })`

### Surprises
- **Checkout unreachable from standard UI flow**  
  *[Breaks: "Accessible via \"Proceed to Checkout\" button in cart"]*
  - *What was done*: Attempted to click "Proceed to Checkout" in cart.
  - *Expected*: Smooth transition from cart to checkout.
  - *Actual*: Blocked by broken checkout button; view only reachable by manually invoking `showPage('checkout')`.
- **Order summary panel is completely empty**  
  *[Breaks: Requirement to show cart items and order total during checkout]*
  - *What was done*: Inspected the checkout page's "Order Summary" sidebar.
  - *Expected*: Summary of cart items, quantities, shipping, and grand total.
  - *Actual*: Displays static placeholder text: *"Nothing to show here."* (`renderCheckoutSummary()` is a no-op).
- **Empty submission accepted with no validation**  
  *[Breaks: "All fields required — empty submission rejected"]*
  - *What was done*: Clicked "Place Order" with all shipping, contact, and payment fields blank.
  - *Expected*: Submission blocked with required field error indicators.
  - *Actual*: Form submitted immediately and navigated to the confirmation view.
- **Invalid email accepted**  
  *[Breaks: "Email: valid format"]*
  - *What was done*: Entered `invalid-email` and submitted checkout.
  - *Expected*: Rejection with email format validation error.
  - *Actual*: Accepted with zero validation.
- **Card number format check absent**  
  *[Breaks: "Card Number: exactly 16 digits"]*
  - *What was done*: Entered 3-digit card number `999` and submitted.
  - *Expected*: Rejection error requiring exactly 16 digits.
  - *Actual*: Accepted without validation.
- **Phone number format check absent**  
  *[Breaks: "Phone: 10 digits"]*
  - *What was done*: Entered 5-digit phone `12345` and submitted.
  - *Expected*: Rejection error requiring 10 digits.
  - *Actual*: Accepted without validation.
- **Card expiry date check absent**  
  *[Breaks: "Expiry: MM/YY format, not in the past"]*
  - *What was done*: Entered past date `01/20` and submitted.
  - *Expected*: Rejection error indicating expired card.
  - *Actual*: Accepted without validation.
- **CVV check absent**  
  *[Breaks: "CVV: 3 digits"]*
  - *What was done*: Entered 1-digit CVV `1` and submitted.
  - *Expected*: Rejection error requiring 3 digits.
  - *Actual*: Accepted without validation.
- **Confirmation page lacks order reference, items, and total**  
  *[Breaks: "Success: confirmation page with order reference, items, total"]*
  - *What was done*: Landed on the order confirmation view (`#page-confirm`).
  - *Expected*: Confirmation screen displaying unique order reference ID, purchased items list, and final order total per requirements.
  - *Actual*: Displays only a generic checkmark and text: *"Order Placed! Your order has been placed successfully."* Cart is also not cleared.

---

## Requirements Coverage & Compliance Summary

| # | Requirement | Section | Status | Notes / Violated Behavior |
|---|---|---|---|---|
| 1 | Users log in with email and password | Login Page | **FAIL** | Navbar on login screen allows navigating directly to catalog/cart without logging in. |
| 2 | Email must be valid format (contains @ and domain) | Login Page | **FAIL** | Accepts `not-an-email` and `admin` without format validation. |
| 3 | Password field must mask input characters | Login Page | **FAIL** | Field uses `<input type="text">`, rendering passwords in plaintext. |
| 4 | Empty fields must be rejected with an error message | Login Page | **FAIL** | Empty submission accepted and transitions to product catalog. |
| 5 | Valid credentials: demo@techshop.com / password123 | Login Page | **PASS** | Valid credentials allow entry (though invalid credentials also allow entry). |
| 6 | Successful login redirects to product catalog | Login Page | **PASS** | Transitions to `#page-products`. |
| 7 | Failed login shows error message, stays on login page | Login Page | **FAIL** | Failed login transitions to product catalog with no error message. |
| 8 | Session persists for the browser session | Login Page | **FAIL** | Reloading page loses session and resets to login screen; no user state in navbar. |
| 9 | Grid of available products | Product Catalog | **PASS** | 4-item product grid rendered via CSS grid. |
| 10 | Each card: product name, price, image placeholder, Add to Cart button | Product Catalog | **FAIL** | Discount math formula divides by 1000 instead of 100; image 1 has 404 URL and no alt; description 3 overflow-bug. |
| 11 | Out of Stock products show badge and disabled button | Product Catalog | **FAIL** | No out-of-stock badges or disabled button states exist in the catalog. |
| 12 | Page title: "TechShop — Products" | Product Catalog | **FAIL** | Document `<title>` remains `"Untitled"`. |
| 13 | Add products from catalog | Shopping Cart | **PASS** | Clicking "Add to Cart" increments badge and adds item to cart array. |
| 14 | Cart shows: name, unit price, quantity, line total, order total | Shopping Cart | **FAIL** | Changing item quantity or removing item leaves line/order totals completely frozen (`_frozenTotal`). |
| 15 | Increment/decrement quantity controls — minimum 1 | Shopping Cart | **FAIL** | No +/- controls (only number input); allows 0 and negative values (e.g. -2). |
| 16 | Remove individual items | Shopping Cart | **FAIL** | Removes row from DOM, but summary subtotal and total do not recalculate. |
| 17 | Empty cart message: "Your cart is empty" | Shopping Cart | **FAIL** | Renders `"Your cart is empty."` (includes a trailing period). |
| 18 | Cart state persists within session only | Shopping Cart | **PASS** | Cart state persists across client-side view changes (lost on reload). |
| 19 | Orders under $10.00 rejected with message: "Minimum order value is $10.00" | Shopping Cart | **FAIL** | No validation or rejection message implemented for orders < $10.00. |
| 20 | Accessible via "Proceed to Checkout" button in cart | Checkout Form | **FAIL** | Button calls `proceedToCheckoutBuggy()` which returns `false` (dead button). |
| 21 | Fields: First Name, Last Name, Email, Phone, Card Number, Expiry Date, CVV | Checkout Form | **PASS** | All 7 specified fields exist in `#page-checkout` (along with Address, City, ZIP). |
| 22 | All fields required — empty submission rejected | Checkout Form | **FAIL** | Submitting empty form immediately navigates to order confirmation. |
| 23 | Email: valid format | Checkout Form | **FAIL** | Malformed email accepted with zero validation. |
| 24 | Card Number: exactly 16 digits | Checkout Form | **FAIL** | Non-16-digit values (e.g. "999") accepted without error. |
| 25 | Phone: 10 digits | Checkout Form | **FAIL** | Non-10-digit values (e.g. "12345") accepted without error. |
| 26 | Expiry: MM/YY format, not in the past | Checkout Form | **FAIL** | Past dates (e.g. "01/20") accepted without error. |
| 27 | CVV: 3 digits | Checkout Form | **FAIL** | Single-digit CVV (e.g. "1") accepted without error. |
| 28 | Success: confirmation page with order reference, items, total | Checkout Form | **FAIL** | Only displays generic checkmark and "Order Placed!"; missing reference, items, and total. |

### Summary Statistics
- **Total Requirements**: 28
- **Requirements Checked**: 28 (100% coverage)
- **Passed**: 6 (21.4%)
- **Failed**: 22 (78.6%)
- **Untestable via standard UI**: Requirement 20 blocks normal navigation to Checkout; reaching the Checkout form required calling `showPage('checkout')`. Requirement 19 ($10 minimum order) cannot be triggered via catalog products as all items exceed $10.
