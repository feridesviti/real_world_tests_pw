import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../api/clients/apiClient';
import { createArticleData } from '../utils/article.factory';
import { Article, ArticlesFilters, ArticlesResponse } from '../types/article.types';

export class ApiHelper {
  private apiClient: ApiClient;

  constructor(request: APIRequestContext) {
    this.apiClient = new ApiClient(request);
  }

  async userCreatesArticle(userToken: string) {
    const articleData = createArticleData();
    const response = await this.apiClient.createArticle(articleData, userToken);
    return response;
  }

  async getArticles(filters?: ArticlesFilters): Promise<Article[]> {
    const response = await this.apiClient.getListArticles(filters);
    const body = (await response.json()) as ArticlesResponse;
    return body.articles;
  }

  async addToUserFavoritesArticles(articles: Article[], userToken: string) {
    for (const article of articles) {
      await this.apiClient.addArticleToUserFavorites(article.slug, userToken);
    }
  }
}
