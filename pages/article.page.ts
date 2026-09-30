import { Page, Locator, expect } from '@playwright/test';

export class ArticlePage {
  readonly page: Page;

  readonly title: Locator;
  readonly authorName: Locator;
  readonly publishDate: Locator;
  readonly content: Locator;
  readonly favoriteButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly commentSection: Locator;
  readonly commentInput: Locator;
  readonly postCommentBtn: Locator;
  readonly tags: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.locator('h1');
    this.authorName = page.locator('.banner a.author');
    this.publishDate = page.locator('.banner span.date');
    this.content = page.locator('div.article-content');
    this.tags = page.locator('li.tag-pill');
    this.favoriteButton = page.locator('button:has-text("Favorite")');
    this.editButton = page.locator('.banner .btn', { hasText: 'Edit Article' });
    this.deleteButton = page.locator('.banner .btn', { hasText: 'Delete Article' });

    this.commentSection = page.locator('div.comment-list');
    this.commentInput = page.locator('textarea[placeholder="Write a comment..."]');
    this.postCommentBtn = page.locator('button:has-text("Post Comment")');
  }

  async goto(slug: string) {
    await this.page.goto(`/article/${slug}`);
  }

  async favoriteArticle() {
    await this.favoriteButton.click();
  }

  async addComment(text: string) {
    await this.commentInput.fill(text);
    await this.postCommentBtn.click();
  }

  async expectTags(expectedTags: string[]) {
    const tagElements = await this.tags.all();
    for (let i = 0; i < tagElements.length; i++) {
      await expect(tagElements[i]).toContainText(expectedTags[i]);
    }
  }

  async expectArticleTitleToContain(expectedName: string) {
    await this.title.waitFor({ state: 'visible' });
    await expect(this.title).toHaveText(expectedName);
  }

  async expectPublishDateEqualTo(expectedDate: Date) {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formatted = expectedDate.toLocaleString('en-US', options);
    await expect(this.publishDate).toHaveText(formatted);
  }

  async expectContentToContain(expectedContent: string) {
    await expect(this.content).toContainText(expectedContent);
  }
}
