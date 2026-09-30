import { Page, Locator } from '@playwright/test';

export class ArticlesGridComponent {
  readonly page: Page;

  readonly articlePreview: Locator;
  readonly articleTitle: Locator;
  readonly articleDescription: Locator;
  readonly articleAuthor: Locator;
  readonly likeButton: Locator;
  readonly pagination: Locator;
  readonly articleTags: Locator;
  readonly globalFeedTab: Locator;
  readonly youFeedTab: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;

    this.articlePreview = page.locator('.article-preview');
    this.articleTitle = page.locator('.article-preview h1');
    this.articleDescription = page.locator('.article-preview p');
    this.articleAuthor = page.locator('.article-meta a.author');
    this.likeButton = page.locator('.article-preview button.btn');
    this.pagination = page.locator('.pagination');
    this.articleTags = page.locator('.article-meta a.tag');
    this.globalFeedTab = page.getByText('Global Feed');
    this.youFeedTab = page.getByText('Your Feed');
    this.loadingIndicator = page.getByText('Loading articles...');
  }

  async openArticleByIndex(index: number) {
    await this.articleTitle.nth(index).click();
  }

  async getArticlesGrig(): Promise<Locator[]> {
    await this.articlePreview.first().waitFor({ state: 'visible' });
    return await this.articlePreview.all();
  }
}
