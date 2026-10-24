import { Page, Locator } from '@playwright/test';

/**
 * Lightweight Page Object for the TechShop Login screen.
 * Encapsulates accessible locators and user actions.
 */
export class LoginPage {
  constructor(readonly page: Page) {}

  // Locators (preferring getByRole and getByLabel)
  readonly usernameInput: Locator = this.page.getByLabel('Username');
  readonly passwordInput: Locator = this.page.getByLabel('Password');
  readonly signInButton: Locator = this.page.getByRole('button', { name: 'Sign In' });
  readonly browseAsGuestButton: Locator = this.page.getByRole('button', { name: 'Browse as Guest' });
  readonly welcomeHeading: Locator = this.page.getByRole('heading', { name: 'Welcome back' });
  readonly productsHeading: Locator = this.page.getByRole('heading', { name: 'Our Products' });
  readonly errorMessage: Locator = this.page.locator('#toast');
  readonly navProductsLink: Locator = this.page.locator('.navbar').getByText('Products');

  /**
   * Navigate to the login page (base URL).
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Fill credentials and submit the login form.
   */
  async login(username: string, pass: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.signInButton.click();
  }
}
