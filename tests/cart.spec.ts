import { test, expect } from './fixtures';

test.describe('Cart Feature', () => {
  // ── Positive Cases ─────────────────────────────────────────────────────────

  test('TC-CART-POS-01: Adding product from catalog updates cart badge, displays toast, and creates cart entry', async ({ cartPage }) => {
    // 1. Add Wireless Headphones to cart from the catalog
    await cartPage.addToCart('Wireless Headphones');

    // 2. Assert toast confirmation appears
    await expect(cartPage.toast).toBeVisible();
    await expect(cartPage.toast).toHaveText(/Wireless Headphones added to cart!/);

    // 3. Assert cart badge increments to 1
    await expect(cartPage.cartBadge).toHaveText('1');

    // 4. Open cart and assert line item is present
    await cartPage.openCart();
    await expect(cartPage.cartHeading).toBeVisible();
    await expect(cartPage.getCartItem('Wireless Headphones')).toBeVisible();
  });

  test('TC-CART-POS-02: Cart summary calculates and displays subtotal, shipping, and grand total correctly', async ({ cartPage }) => {
    // 1. Add item and navigate to cart
    await cartPage.addToCart('Wireless Headphones');
    await cartPage.openCart();

    // 2. Verify order summary structure and shipping charge
    await expect(cartPage.cartSubtotal).toBeVisible();
    await expect(cartPage.cartTotal).toBeVisible();

    // 3. Verify shipping is displayed as $4.99 for non-empty cart
    const subtotalText = await cartPage.cartSubtotal.innerText();
    const subtotalValue = parseFloat(subtotalText.replace('$', ''));
    const expectedGrandTotal = `$${(subtotalValue + 4.99).toFixed(2)}`;

    await expect(cartPage.cartTotal).toHaveText(expectedGrandTotal);
  });

  test('TC-CART-POS-03: Cart item unit price and line subtotal reflect accurate discount percentage', async ({ cartPage }) => {
    // Wireless Headphones: Original $89.99 with 20% discount.
    // Accurate discount math: $89.99 * (1 - 0.20) = $71.99
    await cartPage.addToCart('Wireless Headphones');
    await cartPage.openCart();

    const unitPrice = cartPage.getItemUnitPrice('Wireless Headphones');
    const lineSubtotal = cartPage.getItemSubtotal('Wireless Headphones');

    // Verifies the true discount formula (fails if bug divides by 1000 instead of 100)
    await expect(unitPrice).toHaveText('$71.99 each');
    await expect(lineSubtotal).toHaveText('$71.99');
  });

  test('TC-CART-POS-04: Increasing item quantity recalculates line total and order summary totals', async ({ cartPage }) => {
    await cartPage.addToCart('Wireless Headphones', 1);
    await cartPage.openCart();

    // Change quantity from 1 to 3
    await cartPage.updateQuantity('Wireless Headphones', 3);

    // Cart badge should reflect updated total quantity
    await expect(cartPage.cartBadge).toHaveText('3');

    // Line subtotal and order totals must recalculate dynamically (fails if totals remain frozen)
    const unitPriceText = await cartPage.getItemUnitPrice('Wireless Headphones').innerText();
    const unitPrice = parseFloat(unitPriceText.replace('$', '').replace(' each', ''));
    const expectedSubtotal = `$${(unitPrice * 3).toFixed(2)}`;
    const expectedTotal = `$${(unitPrice * 3 + 4.99).toFixed(2)}`;

    await expect(cartPage.getItemSubtotal('Wireless Headphones')).toHaveText(expectedSubtotal);
    await expect(cartPage.cartSubtotal).toHaveText(expectedSubtotal);
    await expect(cartPage.cartTotal).toHaveText(expectedTotal);
  });

  // ── Negative / Boundary Cases ──────────────────────────────────────────────

  test('TC-CART-NEG-01: Cart rejects quantity input below 1 and enforces minimum quantity of 1', async ({ cartPage }) => {
    await cartPage.addToCart('Wireless Headphones', 1);
    await cartPage.openCart();

    const qtyInput = cartPage.getItemQtyInput('Wireless Headphones');

    // Attempt to set non-positive quantity (0 or below)
    await cartPage.updateQuantity('Wireless Headphones', 0);

    // The field should reject values < 1, reset to at least 1, and not reduce badge to 0 or negative
    await expect(qtyInput).not.toHaveValue('0');
    await expect(qtyInput).toHaveValue('1');
    await expect(cartPage.cartBadge).toHaveText('1');
  });
});

