import { Page, Locator } from '@playwright/test';

export class FooterComponent {
  readonly page: Page;

  readonly logo: Locator;
  readonly attributions: Locator;
  readonly githubLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('footer .logo-font');
    this.attributions = page.locator('footer span.attribution');
    this.githubLink = page.locator('footer a[href*="github"]');
  }
}
