import { expect } from '@playwright/test';
import { test as base } from '../../fixtures/authFixtures';
import { ProfilePage } from '../../pages/profile.page';
import { ApiHelper } from '../../helpers/api.helper';

base('check new user profile', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.goto(uiAuth.user.username);

  await expect(profilePage.username).toHaveText(uiAuth.user.username);
  await expect(profilePage.profilePicture).toBeVisible();
  await expect(profilePage.bio).toBeEmpty();
  await profilePage.expectEmptyArticlesList();
});

base('check user articles list', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const profilePage = new ProfilePage(page);
  const apiHelper = new ApiHelper(page.request);

  const article1 = await apiHelper.userCreatesArticle(uiAuth.user.token);
  const article2 = await apiHelper.userCreatesArticle(uiAuth.user.token);

  await profilePage.goto(uiAuth.user.username);
  await expect(profilePage.articles).toHaveCount(2);

  const expectedTitles = [article2.title, article1.title];
  const articleElements = await profilePage.articles.all();
  for (let i = 0; i < articleElements.length; i++) {
    await expect(articleElements[i]).toContainText(expectedTitles[i]);
  }
});

base('add to user favorite articles', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const profilePage = new ProfilePage(page);
  const apiHelper = new ApiHelper(page.request);

  const choosenArtickles = await apiHelper.getArticles({ tag: 'javascript', limit: 3 });

  await apiHelper.addToUserFavoritesArticles(choosenArtickles, uiAuth.user.token);

  await profilePage.gotoFavoritedArticles(uiAuth.user.username);
  await expect(profilePage.favoriteArticles).toHaveCount(choosenArtickles.length);

  const articleElements = await profilePage.favoriteArticles.all();
  for (let i = 0; i < articleElements.length; i++) {
    const titleText = await articleElements[i].locator('h1').textContent();
    const expectedArticle = choosenArtickles.find((article) => article.title === titleText);

    expect(expectedArticle).toBeDefined();
    await expect(articleElements[i]).toContainText(expectedArticle!.title);
    await expect(articleElements[i]).toContainText(expectedArticle!.author.username);
  }
});

base('check user settings button redirect to settings page', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const profilePage = new ProfilePage(page);
  await profilePage.goto(uiAuth.user.username);
  const settingsPage = await profilePage.openSettings();
  await settingsPage.checkPageUrl();
});
