import { test, expect } from './fixtures';

/**
 * Checkout Feature Test Suite
 *
 * Implements the improved Test Authoring skill rules:
 * - User-facing locators (page.getByPlaceholder / page.getByRole) instead of technical CSS IDs.
 * - Composite flow helpers (checkoutPage.navigateToCheckout) avoiding copy-pasted multi-step setup.
 * - Explicit blocker documentation on the known "Proceed to Checkout" bug.
 */
test.describe('Checkout Feature', () => {
  const validData = {
    firstName: 'Jane',
    lastName: 'Doe',
    address: '123 Market St',
    city: 'Austin',
    zip: '78701',
    email: 'jane.doe@example.com',
    phone: '5551234567',
    cardNumber: '4111111111111111',
    expiry: '12/30',
    cvv: '123',
  };

  test('TC-CHECKOUT-NEG-01: Empty checkout submission is rejected with validation error indicators', async ({ cartPage, checkoutPage }) => {
    // 1. Navigate to checkout using the composite flow helper
    // BLOCKER DEPENDENCY: Blocked by 'Proceed to Checkout' bug (proceedToCheckoutBuggy returns false).
    await checkoutPage.navigateToCheckout(cartPage);
    await expect(checkoutPage.checkoutHeading).toBeVisible();

    // 2. Submit empty checkout form
    await checkoutPage.placeOrder();

    // 3. Assert rejection: confirmation view is not shown and user remains on checkout
    await expect(checkoutPage.confirmationSection).not.toBeVisible();
    await expect(checkoutPage.checkoutHeading).toBeVisible();
  });

  test('TC-CHECKOUT-NEG-05: Checkout rejects card expiry date that is in the past', async ({ cartPage, checkoutPage }) => {
    // 1. Navigate to checkout using the composite flow helper
    // BLOCKER DEPENDENCY: Blocked by 'Proceed to Checkout' bug (proceedToCheckoutBuggy returns false).
    await checkoutPage.navigateToCheckout(cartPage);
    await expect(checkoutPage.checkoutHeading).toBeVisible();

    // 2. Fill form with an expired card date (01/20)
    await checkoutPage.fillForm({
      ...validData,
      expiry: '01/20',
    });
    await checkoutPage.placeOrder();

    // 3. Assert rejection
    await expect(checkoutPage.confirmationSection).not.toBeVisible();
    await expect(checkoutPage.checkoutHeading).toBeVisible();
  });

  test('TC-CHECKOUT-NEG-06: Checkout rejects CVV with invalid length (fewer than 3 digits)', async ({ cartPage, checkoutPage }) => {
    // 1. Navigate to checkout using the composite flow helper
    // BLOCKER DEPENDENCY: Blocked by 'Proceed to Checkout' bug (proceedToCheckoutBuggy returns false).
    await checkoutPage.navigateToCheckout(cartPage);
    await expect(checkoutPage.checkoutHeading).toBeVisible();

    // 2. Fill form with a 1-digit CVV
    await checkoutPage.fillForm({
      ...validData,
      cvv: '1',
    });
    await checkoutPage.placeOrder();

    // 3. Assert rejection
    await expect(checkoutPage.confirmationSection).not.toBeVisible();
    await expect(checkoutPage.checkoutHeading).toBeVisible();
  });

  test('TC-CHECKOUT-POS-01: Valid checkout submission navigates to confirmation page with complete order reference details', async ({ cartPage, checkoutPage }) => {
    // 1. Navigate to checkout using the composite flow helper
    // BLOCKER DEPENDENCY: Blocked by 'Proceed to Checkout' bug (proceedToCheckoutBuggy returns false).
    await checkoutPage.navigateToCheckout(cartPage);
    await expect(checkoutPage.checkoutHeading).toBeVisible();

    // 2. Complete valid order submission
    await checkoutPage.fillForm(validData);
    await checkoutPage.placeOrder();

    // 3. Assert confirmation and unique order reference
    await expect(checkoutPage.confirmHeading).toBeVisible();
    await expect(checkoutPage.orderReference).toBeVisible();
  });
});
