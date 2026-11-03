import { Page, Locator } from '@playwright/test';

/**
 * Lightweight Page Object for the TechShop Cart and Catalog.
 * Encapsulates accessible locators and user actions.
 */
export class CartPage {
  constructor(readonly page: Page) {}

  // ── Global / Navigation Locators ───────────────────────────────────────────
  readonly cartIcon: Locator = this.page.locator('.cart-icon');
  readonly cartBadge: Locator = this.page.locator('#cart-count');
  readonly toast: Locator = this.page.locator('#toast');

  // ── Product Catalog Locators ───────────────────────────────────────────────
  readonly productsHeading: Locator = this.page.getByRole('heading', { name: 'Our Products' });
  readonly productsGrid: Locator = this.page.locator('#products-grid');

  // ── Shopping Cart Locators ─────────────────────────────────────────────────
  readonly cartHeading: Locator = this.page.getByRole('heading', { name: 'Shopping Cart' });
  readonly cartItems: Locator = this.page.locator('.cart-item');
  readonly cartSubtotal: Locator = this.page.locator('#cart-subtotal');
  readonly cartShipping: Locator = this.page.locator('.cart-summary-panel').getByText('Shipping').locator('+ span');
  readonly cartTotal: Locator = this.page.locator('#cart-total');
  readonly proceedToCheckoutButton: Locator = this.page.getByRole('button', { name: 'Proceed to Checkout' });
  readonly continueShoppingButton: Locator = this.page.getByRole('button', { name: 'Continue Shopping' });
  readonly emptyCartMessage: Locator = this.page.locator('.cart-empty p');
  readonly shopNowButton: Locator = this.page.getByRole('button', { name: 'Shop Now' });

  // ── Helpers & Action Locators ──────────────────────────────────────────────

  /**
   * Locate a product card container by product name.
   */
  getProductCard(productName: string): Locator {
    return this.page.locator('.product-card').filter({ hasText: productName });
  }

  /**
   * Locate a cart line item container by product name.
   */
  getCartItem(productName: string): Locator {
    return this.page.locator('.cart-item').filter({ hasText: productName });
  }

  /**
   * Locate the quantity input for a given item in the cart.
   */
  getItemQtyInput(productName: string): Locator {
    return this.getCartItem(productName).locator('.cart-item-qty');
  }

  /**
   * Locate the line subtotal for a given item in the cart.
   */
  getItemSubtotal(productName: string): Locator {
    return this.getCartItem(productName).locator('.cart-item-subtotal');
  }

  /**
   * Locate the unit price text for a given item in the cart.
   */
  getItemUnitPrice(productName: string): Locator {
    return this.getCartItem(productName).locator('.cart-item-price');
  }

  // ── User Actions ───────────────────────────────────────────────────────────

  /**
   * Add a product to the cart from the catalog view.
   */
  async addToCart(productName: string, quantity = 1) {
    const card = this.getProductCard(productName);
    if (quantity !== 1) {
      const qtyInput = card.locator('.qty-input');
      await qtyInput.fill(quantity.toString());
    }
    await card.getByRole('button', { name: 'Add to Cart' }).click();
  }

  /**
   * Navigate to the Cart view using the navbar Cart button.
   */
  async openCart() {
    await this.cartIcon.click();
  }

  /**
   * Update the quantity of an item directly in the cart view.
   */
  async updateQuantity(productName: string, quantity: number | string) {
    const qtyInput = this.getItemQtyInput(productName);
    await qtyInput.fill(quantity.toString());
    await qtyInput.press('Enter');
  }

  /**
   * Click Remove button on a specific line item in the cart.
   */
  async removeItem(productName: string) {
    const item = this.getCartItem(productName);
    await item.getByRole('button', { name: 'Remove' }).click();
  }
}

