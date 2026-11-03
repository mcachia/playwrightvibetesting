import { test as base, Page } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

// Ensure .env is loaded if running via Node/Playwright
try {
  process.loadEnvFile?.();
} catch {
  // Ignore error if .env does not exist or environment variables are already set
}

type Fixtures = {
  loginPage: LoginPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authedPage: Page;
  authenticatedPage: Page;
};

/**
 * Custom Playwright test fixture providing:
 * - `authedPage` / `authenticatedPage`: An isolated Playwright Page already logged into TechShop.
 * - `loginPage`: A lightweight LoginPage page object initialized and navigated to the login screen.
 * - `cartPage`: A lightweight CartPage page object backed by the authenticated page.
 * - `checkoutPage`: A lightweight CheckoutPage page object backed by the authenticated page.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  authedPage: async ({ page }, use) => {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'TEST_EMAIL and TEST_PASSWORD environment variables are required. ' +
        'Please define them in your environment or a .env file (see .env.example).'
      );
    }

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);

    // Provide the authenticated page to the test
    await use(page);
  },

  authenticatedPage: async ({ authedPage }, use) => {
    await use(authedPage);
  },

  cartPage: async ({ authedPage }, use) => {
    const cartPage = new CartPage(authedPage);
    await use(cartPage);
  },

  checkoutPage: async ({ authedPage }, use) => {
    const checkoutPage = new CheckoutPage(authedPage);
    await use(checkoutPage);
  },
});

export { expect } from '@playwright/test';
