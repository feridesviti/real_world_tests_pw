import { test as base } from '../../fixtures/authFixtures';
import { createArticleData } from '../../utils/article.factory';
import { expect } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { ApiClient } from '../../api/clients/apiClient';
import { ArticlePage } from '../../pages/article.page';
import { LoginPage } from '../../pages/login.page';

base('check article creation', { tag: ['@smoke', '@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const articleData = createArticleData();
  const homePage = new HomePage(page);

  const articlePage = await base.step('Create new article', async () => {
    const articleCreatingPage = await homePage.navigation.createNewArticle();
    expect(page).toHaveURL(articleCreatingPage.createArticlePageUrl());
    await articleCreatingPage.fillInArticle(articleData);
    return await articleCreatingPage.publish();
  });

  await base.step('Check created article data', async () => {
    await articlePage.expectArticleTitleToContain(articleData.article.title);
    await expect(articlePage.authorName).toHaveText(uiAuth.user.username);
    await articlePage.expectPublishDateEqualTo(new Date());
    await articlePage.expectContentToContain(articleData.article.body);
    await articlePage.expectTags(articleData.article.tagList || []);
    await expect(articlePage.favoriteButton).not.toBeVisible();
    await expect(articlePage.editButton).toBeVisible();
    await expect(articlePage.deleteButton).toBeVisible();
    await expect(articlePage.commentInput).toBeVisible();
    await expect(articlePage.postCommentBtn).toBeVisible();
  });
});

base('Check article delete by author', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const articleData = createArticleData();
  const apiClient = new ApiClient(page.request);

  const createdArticle = await base.step('create new article through api', async () => {
    return await apiClient.createArticle(articleData, uiAuth.user.token);
  });

  await base.step('find and delete article through ui', async () => {
    const articlePage = new ArticlePage(page);
    await articlePage.goto(createdArticle.slug);
    await articlePage.deleteButton.click();
    await expect(page).toHaveURL(process.env.BASE_URL || '');
    const article = await apiClient.getArticle(createdArticle.slug);
    expect(article).toBeNull();
  });
});

base('Check article delete by non-author', { tag: ['@regression', '@ui'] }, async ({ page, registrationHelper }) => {
  const articleData = createArticleData();
  const loginPage = new LoginPage(page);

  const createdArticle = await base.step('login and create article as authorized user', async () => {
    const apiClient = new ApiClient(page.request);
    await loginPage.goto();
    await loginPage.login(registrationHelper.user.email, registrationHelper.password);
    await page.waitForFunction(() => Boolean(localStorage.getItem('jwtToken')));
    const token = await page.evaluate(() => localStorage.getItem('jwtToken'));
    expect(token).toBeTruthy();
    registrationHelper.user.token = token!;
    return await apiClient.createArticle(articleData, registrationHelper.user.token);
  });

  const articlePage = new ArticlePage(page);
  await articlePage.goto(createdArticle.slug);

  await base.step('Chack that unautorithed user cant delete the article', async () => {
    await page.evaluate(() => {
      localStorage.clear();
    });
    const articlePage = new ArticlePage(page);
    await articlePage.goto(createdArticle.slug);
    await expect(articlePage.deleteButton).not.toBeVisible();
  });
});
