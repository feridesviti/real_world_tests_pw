import { Page, Locator, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class RegistrationPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly errorMessages: Locator;
  readonly haveAnAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.locator('input[placeholder="Username"]');
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.signUpButton = page.locator('button[type="submit"]');

    this.errorMessages = page.locator('.error-messages li');
    this.haveAnAccountLink = page.locator('a', { hasText: 'Have an account?' });
  }

  async goto() {
    await this.page.goto(this.registrationPageUrl());
  }

  async fillForm(username: string, email: string, password: string) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.signUpButton.click();
  }

  // Зареєструвати користувача (поєднання заповнення + submit)
  async register(username: string, email: string, password: string) {
    await this.fillForm(username, email, password);
    await this.submit();
  }

  // Очікування помилок
  async expectErrorMessage(message: string) {
    await expect(this.errorMessages).toContainText(message);
  }

  registrationPageUrl(): string {
    return process.env.BASE_URL + '/register';
  }
}
