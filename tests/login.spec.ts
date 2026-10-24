import { test, expect } from './fixtures';

test.describe('Login Feature', () => {
  const validEmail = process.env.TEST_EMAIL;
  const validPassword = process.env.TEST_PASSWORD;

  test.beforeEach(async () => {
    if (!validEmail || !validPassword) {
      throw new Error('TEST_EMAIL and TEST_PASSWORD environment variables are required.');
    }
  });

  // ── Positive Cases ─────────────────────────────────────────────────────────

  test('TC-LOGIN-POS-01: Login succeeds with valid email and password', async ({ loginPage }) => {
    await loginPage.login(validEmail!, validPassword!);
    await expect(loginPage.productsHeading).toBeVisible();
    await expect(loginPage.welcomeHeading).not.toBeVisible();
  });

  test('TC-LOGIN-POS-02: Password field masks entered characters', async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC-LOGIN-POS-03: Active user session persists across browser reload', async ({ loginPage }) => {
    await loginPage.login(validEmail!, validPassword!);
    await expect(loginPage.productsHeading).toBeVisible();

    await loginPage.page.reload();
    await expect(loginPage.productsHeading).toBeVisible();
    await expect(loginPage.welcomeHeading).not.toBeVisible();
  });

  // ── Negative Cases ─────────────────────────────────────────────────────────

  test('TC-LOGIN-NEG-01: Login rejects submission with empty username and password', async ({ loginPage }) => {
    await loginPage.signInButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
    await expect(loginPage.productsHeading).not.toBeVisible();
  });

  test('TC-LOGIN-NEG-02: Login rejects empty password when username is provided', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(validEmail!);
    await loginPage.signInButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
  });

  test('TC-LOGIN-NEG-03: Login rejects empty username when password is provided', async ({ loginPage }) => {
    await loginPage.passwordInput.fill(validPassword!);
    await loginPage.signInButton.click();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
  });

  test('TC-LOGIN-NEG-04: Login rejects invalid password for valid user account', async ({ loginPage }) => {
    await loginPage.login(validEmail!, 'wrong-password-999');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
    await expect(loginPage.productsHeading).not.toBeVisible();
  });

  test('TC-LOGIN-NEG-05: Login rejects malformed email format missing domain or @', async ({ loginPage }) => {
    await loginPage.login('not-an-email', validPassword!);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
  });

  // ── Edge Cases ─────────────────────────────────────────────────────────────

  test('TC-LOGIN-EDGE-01: Login rejects whitespace-only inputs in credentials', async ({ loginPage }) => {
    await loginPage.login('   ', '   ');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.welcomeHeading).toBeVisible();
  });

  test('TC-LOGIN-EDGE-02: Login email handles uppercase characters (case insensitivity)', async ({ loginPage }) => {
    await loginPage.login(validEmail!.toUpperCase(), validPassword!);
    await expect(loginPage.productsHeading).toBeVisible();
  });
});
