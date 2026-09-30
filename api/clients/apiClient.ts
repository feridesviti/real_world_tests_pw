// api/clients/apiClient.ts
import { APIRequestContext, expect } from '@playwright/test';
import { TestUser } from '../../utils/dataFactory';
import { CreateArticleRequest } from '../../types/article.types';
import { LoginResponse, UpdatedUser } from '../../types/user.types';
import { CreateArticleResponse } from '../../types/article.types';
import { Article, ArticlesFilters, CommentsResponse, CreatedCommentResponse } from '../../types/article.types';

export class ApiClient {
  constructor(protected request: APIRequestContext) {}

  async userRegistration(testUser: TestUser): Promise<LoginResponse> {
    const response = await this.request.post(`${process.env.API_URL}/users`, {
      data: {
        user: {
          username: testUser.user.username,
          email: testUser.user.email,
          password: testUser.password
        }
      }
    });
    return await response.json();
  }

  async loginUser(email: string, password: string) {
    const response = await this.request.post(`${process.env.API_URL}/users/login`, {
      data: {
        user: {
          email: email,
          password: password
        }
      }
    });

    return response;
  }

  async getCurrentUser(userToken: string) {
    const response = await this.request.get(`${process.env.API_URL}/user`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });

    return response;
  }

  async updateUser(userToken: string, payload: UpdatedUser) {
    const response = await this.request.put(`${process.env.API_URL}/user`, {
      data: payload,
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    return response;
  }

  async getListArticles(filters?: ArticlesFilters) {
    const params: Record<string, string | number> = {};
    if (filters?.tag !== undefined) params.tag = filters.tag;
    if (filters?.author !== undefined) params.author = filters.author;
    if (filters?.favorited !== undefined) params.favorited = filters.favorited;
    if (filters?.limit !== undefined) params.limit = filters.limit;
    if (filters?.offset !== undefined) params.offset = filters.offset;

    const response = await this.request.get(`${process.env.API_URL}/articles`, {
      params
    });
    return response;
  }

  async getArticle(slug: string): Promise<Article | null> {
    const response = await this.request.get(`${process.env.API_URL}/articles/${slug}`);
    if (response.status() === 404) return null;
    return (await response.json()) as Article;
  }

  async createArticle(article: CreateArticleRequest, userToken: string): Promise<Article> {
    const response = await this.request.post(`${process.env.API_URL}/articles`, {
      data: article,
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    expect(response.status(), 'Article creation response status should be 201').toBe(201);
    const json = (await response.json()) as CreateArticleResponse;
    return json.article;
  }

  async updateArticle(article: Article, userToken: string) {
    const articleId = article.slug;
    const response = await this.request.put(`${process.env.API_URL}/articles/${articleId}`, {
      data: { article },
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    return await response.json();
  }

  async deleteArticle(articleId: string, userToken: string) {
    const response = await this.request.delete(`${process.env.API_URL}/articles/${articleId}`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    return response;
  }

  async addArticleToUserFavorites(articleSlug: string, userToken: string): Promise<Article> {
    const response = await this.request.post(`${process.env.API_URL}/articles/${articleSlug}/favorite`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    return await response.json();
  }

  async addComments(articleSlug: string, comment: string, userToken: string): Promise<CreatedCommentResponse> {
    const response = await this.request.post(`${process.env.API_URL}/articles/${articleSlug}/comments`, {
      data: {
        comment: {
          body: comment
        }
      },
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    expect(response.status(), 'Comment creation response status should be 201').toBe(201);
    return (await response.json()) as CreatedCommentResponse;
  }

  async getComments(articleSlug: string, userToken: string): Promise<CommentsResponse> {
    const response = await this.request.get(`${process.env.API_URL}/articles/${articleSlug}/comments`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    return (await response.json()) as CommentsResponse;
  }

  async deleteComment(articleSlug: string, commentId: number, userToken: string) {
    const response = await this.request.delete(`${process.env.API_URL}/articles/${articleSlug}/comments/${commentId}`, {
      headers: {
        Authorization: `Token ${userToken}`
      }
    });
    expect(response.status(), 'Comment deletion response status should be 204').toBe(204);
    return response;
  }
}
