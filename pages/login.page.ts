import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessages: Locator;
  readonly needAnAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.getByPlaceholder('Password');
    this.signInButton = page.locator('button[type="submit"]');
    this.errorMessages = page.locator('.error-messages li');
    this.needAnAccountLink = page.locator('a', { hasText: 'Need an account?' });
  }

  async goto() {
    await this.page.goto(this.loginPageUrl());
  }

  async login(userEmail: string, userPassword: string) {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(userEmail);
    await this.passwordInput.fill(userPassword);
    await this.signInButton.click();
  }

  loginPageUrl(): string {
    return process.env.BASE_URL + '/login';
  }
}
