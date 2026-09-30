import { Page, Locator, expect } from '@playwright/test';
import { SettingsPage } from './settings.page';

export class ProfilePage {
  readonly page: Page;
  readonly settingsButton: Locator;
  readonly username: Locator;
  readonly bio: Locator;
  readonly followButton: Locator;
  readonly profilePicture: Locator;

  readonly myArticlesTab: Locator;
  readonly favoritedArticlesTab: Locator;

  readonly articles: Locator;
  readonly favoriteArticles: Locator;
  readonly url: string;

  constructor(page: Page) {
    this.page = page;

    this.username = page.locator('h4');
    this.bio = page.locator('.user-info p');
    this.followButton = page.getByRole('button', { name: /follow/i });
    this.profilePicture = page.locator('img.user-img');
    this.myArticlesTab = page.getByRole('link', { name: 'My Articles' });
    this.favoritedArticlesTab = page.getByRole('link', { name: 'Favorited Articles' });
    this.settingsButton = page.getByRole('link', { name: ' Edit Profile Settings' });
    this.articles = page.locator('.article-preview');
    this.favoriteArticles = page.locator('.article-preview');
    this.url = 'https://demo.realworld.show/profile/';
  }

  async goto(username: string) {
    await this.page.goto(`/profile/${username}`);
  }

  async gotoFavoritedArticles(username: string) {
    await this.page.goto(`/profile/${username}/favorites`);
  }

  async expectEmptyArticlesList() {
    await expect(this.articles).toHaveText('No articles are here... yet.');
  }

  async expectProfileLoaded(expectedUsername: string) {
    await expect(this.username).toHaveText(expectedUsername);
    await expect(this.bio).toBeVisible();
  }

  async followUser() {
    await this.followButton.click();
  }

  async expectFollowing() {
    await expect(this.followButton).toContainText(/unfollow/i);
  }

  async openMyArticles() {
    await this.myArticlesTab.click();
  }

  async openFavoritedArticles() {
    await this.favoritedArticlesTab.click();
  }

  async getArticlesCount() {
    return await this.articles.count();
  }

  async openFirstArticle() {
    await this.articles.first().click();
  }

  async openSettings() {
    await this.settingsButton.click();
    return new SettingsPage(this.page);
  }

  async expectPageUrlToBe(username: string) {
    await expect(this.page).toHaveURL(`this.url/${username}`);
  }
}
