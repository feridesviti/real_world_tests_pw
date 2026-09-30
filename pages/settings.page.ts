import { expect, Locator, Page } from '@playwright/test';
import { UserSettings } from '../types/user.types';
import { ProfilePage } from './profile.page';
import { LoginPage } from './login.page';
import { NavigationComponent } from './components/navigation.component';

export class SettingsPage {
  readonly page: Page;
  readonly title: Locator;
  readonly urlPictureInput: Locator;
  readonly nameInput: Locator;
  readonly bioInput: Locator;
  readonly emailInput: Locator;
  readonly newPasswordInput: Locator;
  readonly updateButton: Locator;
  readonly logoutButton: Locator;
  readonly url: string;
  readonly navigation: NavigationComponent;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.urlPictureInput = page.locator('input[placeholder="URL of profile picture"]');
    this.nameInput = page.locator('input[placeholder="Username"]');
    this.bioInput = page.locator('textarea[placeholder="Short bio about you"]');
    this.emailInput = page.locator('input[placeholder="Email"]');
    this.newPasswordInput = page.locator('input[placeholder="New Password"]');
    this.updateButton = page.locator('button:has-text("Update Settings")');
    this.logoutButton = page.locator('button:has-text("Or click here to logout.")');
    this.url = '/settings';
    this.navigation = new NavigationComponent(page);
  }

  async goto() {
    await this.page.goto('/settings');
  }

  async fillForm(data: UserSettings) {
    if (data.urlPicture !== undefined) {
      await this.urlPictureInput.fill(data.urlPicture);
    }

    if (data.name !== undefined) {
      await this.nameInput.fill(data.name);
    }

    if (data.bio !== undefined) {
      await this.bioInput.fill(data.bio);
    }

    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }

    if (data.newPassword !== undefined) {
      await this.newPasswordInput.fill(data.newPassword);
    }
  }

  async expectUrlOfPictureToBe(url: string) {
    await expect(this.urlPictureInput).toHaveValue(url);
  }

  async clickOnUpdateButton() {
    await this.updateButton.click();
    return new ProfilePage(this.page);
  }

  async clickOnLogoutButton() {
    await this.logoutButton.scrollIntoViewIfNeeded();
    await this.logoutButton.click();
    return new LoginPage(this.page);
  }

  async checkPageUrl() {
    await expect(this.page).toHaveURL(this.url);
  }
}
