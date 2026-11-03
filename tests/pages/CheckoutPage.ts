import { Page, Locator } from '@playwright/test';
import { CartPage } from './CartPage';

export interface CheckoutFormData {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  zip?: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
}

/**
 * Lightweight Page Object for the TechShop Checkout and Confirmation screens.
 * Complies with test-authoring rules: user-facing locators (getByRole, getByPlaceholder)
 * and encapsulated composite flows.
 */
export class CheckoutPage {
  constructor(readonly page: Page) {}

  // ── Checkout View Locators (User-Facing) ───────────────────────────────────
  readonly checkoutSection: Locator = this.page.locator('#page-checkout');
  readonly checkoutHeading: Locator = this.page.getByRole('heading', { name: 'Checkout' });

  // Shipping Information (via user-facing placeholders)
  readonly firstNameInput: Locator = this.page.getByPlaceholder('John');
  readonly lastNameInput: Locator = this.page.getByPlaceholder('Doe');
  readonly addressInput: Locator = this.page.getByPlaceholder('123 Main Street');
  readonly cityInput: Locator = this.page.getByPlaceholder('New York');
  readonly zipInput: Locator = this.page.getByPlaceholder('10001');

  // Contact Details
  readonly emailInput: Locator = this.page.getByPlaceholder('john@example.com');
  readonly phoneInput: Locator = this.page.getByPlaceholder('555-0100');

  // Payment Details
  readonly cardInput: Locator = this.page.getByPlaceholder('1234 5678 9012 3456');
  readonly expiryInput: Locator = this.page.getByPlaceholder('MM/YY');
  readonly cvvInput: Locator = this.page.getByPlaceholder('123');
  readonly placeOrderButton: Locator = this.page.getByRole('button', { name: 'Place Order' });

  // Order Summary Sidebar
  readonly orderSummaryPanel: Locator = this.page.locator('.checkout-order-panel');

  // ── Confirmation View Locators ─────────────────────────────────────────────
  readonly confirmationSection: Locator = this.page.locator('#page-confirm');
  readonly confirmHeading: Locator = this.page.getByRole('heading', { name: 'Order Placed!' });
  readonly orderReference: Locator = this.page.locator('.order-reference, [data-testid="order-reference"]');
  readonly continueShoppingButton: Locator = this.page.getByRole('button', { name: 'Continue Shopping' });

  // ── Actions & Composite Helpers ────────────────────────────────────────────

  /**
   * Clicks 'Proceed to Checkout' from the cart page.
   * NOTE: Known blocker — the button does not navigate due to proceedToCheckoutBuggy().
   */
  async proceedFromCart() {
    await this.page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  }

  /**
   * Composite flow helper: Seeds the cart with an item and triggers the navigation to checkout.
   * Encapsulates repetitive pre-condition steps across all checkout tests.
   */
  async navigateToCheckout(cartPage: CartPage, productName = 'Wireless Headphones') {
    await cartPage.addToCart(productName);
    await cartPage.openCart();
    await this.proceedFromCart();
  }

  /**
   * Fills out checkout form fields using user-facing inputs.
   */
  async fillForm(data: CheckoutFormData) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.zip !== undefined) await this.zipInput.fill(data.zip);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.cardNumber !== undefined) await this.cardInput.fill(data.cardNumber);
    if (data.expiry !== undefined) await this.expiryInput.fill(data.expiry);
    if (data.cvv !== undefined) await this.cvvInput.fill(data.cvv);
  }

  /**
   * Submits the checkout form.
   */
  async placeOrder() {
    await this.placeOrderButton.click();
  }
}
