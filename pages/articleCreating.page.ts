// editor.page.js
import { Locator, Page } from '@playwright/test';
import { CreateArticleRequest } from '../types/article.types';
import { ArticlePage } from './article.page';

export class ArticleCreatingPage {
  readonly page: Page;

  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly bodyTextArea: Locator;
  readonly tagInput: Locator;
  readonly publishBtn: Locator;
  readonly editUrl = '/editor';

  constructor(page: Page) {
    this.page = page;

    this.titleInput = page.locator('input[placeholder="Article Title"]');
    this.descriptionInput = page.locator('input[placeholder="What\'s this article about?"]');
    this.bodyTextArea = page.locator('textarea[placeholder="Write your article (in markdown)"]');
    this.tagInput = page.locator('input[placeholder="Enter tags"]');
    this.publishBtn = page.locator('button:has-text("Publish Article")');
  }

  async goto() {
    await this.page.goto(this.editUrl);
  }
  createArticlePageUrl(): string {
    return process.env.BASE_URL + this.editUrl;
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    await this.descriptionInput.fill(desc);
  }

  async fillBody(content: string) {
    await this.bodyTextArea.fill(content);
  }

  async addTags(tags: string[]) {
    await this.tagInput.fill(tags.join(', '));
    await this.tagInput.press('Enter');
  }

  async publish(): Promise<ArticlePage> {
    await this.publishBtn.click();
    return new ArticlePage(this.page);
  }

  async fillInArticle(article: CreateArticleRequest) {
    await this.fillTitle(article.article.title);
    await this.fillDescription(article.article.description);
    await this.fillBody(article.article.body);
    await this.addTags(article.article.tagList || []);
  }
}
