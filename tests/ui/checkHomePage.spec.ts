import { expect } from '@playwright/test';
import { test as base } from '../../fixtures/authFixtures';
import { HomePage } from '../../pages/home.page';

base('check home page components', { tag: ['@smoke', '@regression', '@ui'] }, async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await expect(page).toHaveTitle('Conduit');
  await expect(homePage.navigation.logo).toBeVisible();
  await expect(homePage.articles.articleTitle).toHaveCount(4);
  await expect(homePage.footer.logo).toBeVisible();
  await expect(homePage.articles.youFeedTab).toBeHidden();
});

base('check user login', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const homePage = new HomePage(page);
  await expect(homePage.navigation.newArticleLink).toBeVisible();
  await expect(homePage.navigation.settingsLink).toBeVisible();
  await expect(homePage.navigation.signInLink).toBeHidden();
  await expect(homePage.navigation.signUpLink).toBeHidden();
  await expect(homePage.navigation.profileLink).toHaveText(uiAuth.user.username);
  await expect(homePage.articles.youFeedTab).toBeVisible();
});
