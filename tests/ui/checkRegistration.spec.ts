import { test, expect } from '@playwright/test';
import { createTestUser } from '../../utils/dataFactory';
import { HomePage } from '../../pages/home.page';
import { RegistrationPage } from '../../pages/registration.page';
import { LoginPage } from '../../pages/login.page';

test('check user registration', { tag: ['@smoke', '@regression', '@ui'] }, async ({ page }) => {
  const homePage = new HomePage(page);
  const registrationPage = new RegistrationPage(page);
  await homePage.goto();
  await homePage.navigation.signUpLink.click();

  const testUser = createTestUser();
  await registrationPage.register(testUser.user.username, testUser.user.email, testUser.password);
  await expect(page).toHaveURL(process.env.BASE_URL + '/');
  await expect(homePage.navigation.newArticleLink).toBeVisible();
  await expect(homePage.navigation.settingsLink).toBeVisible();
  await expect(homePage.navigation.signInLink).toBeHidden();
  await expect(homePage.navigation.signUpLink).toBeHidden();
  await expect(homePage.navigation.profileLink).toHaveText(testUser.user.username);
  await expect(homePage.articles.youFeedTab).toBeVisible();
});

test('check have an account link', { tag: ['@regression', '@ui'] }, async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  await registrationPage.goto();
  await expect(registrationPage.haveAnAccountLink).toBeVisible();
  await registrationPage.haveAnAccountLink.click();
  const loginPage = new LoginPage(page);
  await expect(page).toHaveURL(loginPage.loginPageUrl());
});
