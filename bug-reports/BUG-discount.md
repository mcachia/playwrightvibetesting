## [BUG] Cart item unit price and line subtotal calculate discount by dividing by 1000 instead of 100

- **Environment:**
  - **App Version:** `techshop/broken-app`
  - **Browser:** `Chromium (Desktop 1280x720)`
  - **URL:** `http://localhost:3000`

- **Severity:** Critical — Overcharges customers on every discounted product by applying only 1/10th of the advertised discount, causing direct financial discrepancies and loss of customer trust.

- **Steps to Reproduce:**
  1. Navigate to `http://localhost:3000`.
  2. Sign in with valid credentials (`demo@techshop.com` / `password123`) by clicking "Sign In".
  3. On the products catalog page, locate the product card for "Wireless Headphones" (Base price: $89.99, Discount badge: 20% OFF).
  4. Ensure quantity is set to 1 and click the "Add to Cart" button.
  5. Click the "Cart" icon in the navigation bar to open the Shopping Cart (`#page-cart`).
  6. Inspect the unit price text (`.cart-item-price`) and line subtotal (`.cart-item-subtotal`) displayed for Wireless Headphones.

- **Expected Result:**
  The unit price and line subtotal reflect the advertised 20% discount:
  $$\$89.99 \times (1 - 0.20) = \$71.99$$
  Unit price displays `$71.99 each` and line subtotal displays `$71.99`.

- **Actual Result:**
  The unit price displays `$88.19 each` and line subtotal displays `$88.19`.
  The discount formula in `techshop/broken-app/app.js` (`calcDiscountedBuggy`) divided the discount percentage by 1000 instead of 100:
  $$\$89.99 \times (1 - 20 / 1000) = \$89.99 \times 0.98 = \$88.19$$
  This yields an actual discount of only 2% instead of the stated 20%.

- **Evidence:**
  - **Playwright Test:** `tests/cart.spec.ts` $\rightarrow$ `TC-CART-POS-03: Cart item unit price and line subtotal reflect accurate discount percentage`
  - **Playwright Trace:** `test-results/cart-Cart-Feature-TC-CART--d7c57-ccurate-discount-percentage-chromium/trace.zip`
    - View command: `npx playwright show-trace test-results/cart-Cart-Feature-TC-CART--d7c57-ccurate-discount-percentage-chromium/trace.zip`
  - **Diagnostic Context:** `test-results/cart-Cart-Feature-TC-CART--d7c57-ccurate-discount-percentage-chromium/error-context.md`
  - **Code Location:** `techshop/broken-app/app.js` line 92:
    ```javascript
    function calcDiscountedBuggy(price, discountPct) {
      return (price * (1 - discountPct / 1000)).toFixed(2);
    }
    ```

