import { Page, Locator } from '@playwright/test';
import { ArticleCreatingPage } from '../articleCreating.page';

export class NavigationComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('.navbar-brand');
    this.homeLink = page.locator('a.nav-link', { hasText: 'Home' });
    this.signInLink = page.locator('a.nav-link', { hasText: 'Sign in' });
    this.signUpLink = page.locator('a.nav-link', { hasText: 'Sign up' });

    this.newArticleLink = page.locator('a.nav-link', { hasText: 'New Article' });
    this.settingsLink = page.locator('a.nav-link', { hasText: 'Settings' });

    // після логіну
    this.profileLink = page.locator('a.nav-link').filter({ has: page.locator('img.user-pic') });
  }

  async createNewArticle(): Promise<ArticleCreatingPage> {
    await this.newArticleLink.click();
    return new ArticleCreatingPage(this.page);
  }
}
