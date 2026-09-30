import { expect } from '@playwright/test';
import { test as base } from '../../fixtures/apiFixtures';
import { ArticleSchema } from '../../schemas/article.schema';
import { createArticleData } from '../../utils/article.factory';
import { UserSchema } from '../../schemas/user.schemas';
import { createTestUser } from '../../utils/dataFactory';

base('check user schema', { tag: ['@regression', '@api'] }, async ({ apiClient }) => {
  const testUser = createTestUser();
  const response = await apiClient.userRegistration(testUser);
  const parsed = UserSchema.parse(response);
  expect(parsed.user.email).toBe(testUser.user.email);
  expect(parsed.user.username).toBe(testUser.user.username);
});

base('check article schema', { tag: ['@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const articleData = createArticleData();
  const articleResponse = await apiClient.createArticle(articleData, testUser.user.token);
  const parsed = ArticleSchema.parse(articleResponse);
  expect(parsed.title).toBe(articleData.article.title);
});
