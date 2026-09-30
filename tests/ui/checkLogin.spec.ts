import { expect } from '@playwright/test';
import { test as base } from '../../fixtures/authFixtures';
import { HomePage } from '../../pages/home.page';
import { LoginPage } from '../../pages/login.page';
import { createTestUser } from '../../utils/dataFactory';
import { RegistrationPage } from '../../pages/registration.page';

base('check positive user login', { tag: ['@smoke', '@regression', '@ui'] }, async ({ page, registrationHelper }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  const loginPage = await homePage.login();
  await loginPage.login(registrationHelper.user.email, registrationHelper.password);
  await expect(loginPage.page).toHaveURL(process.env.BASE_URL + '/');
  await expect(homePage.navigation.profileLink).toHaveText(registrationHelper.user.username);
});

base('check negative user login', { tag: ['@regression', '@ui'] }, async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  const loginPage = await homePage.login();
  const userData = createTestUser();
  await loginPage.login(userData.user.email, userData.password);
  await expect(page).toHaveURL(loginPage.loginPageUrl());
  await expect(loginPage.errorMessages).toHaveText('credentials invalid');
});

base('check Need an account? link', { tag: ['@regression', '@ui'] }, async ({ page }) => {
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(loginPage.needAnAccountLink).toBeVisible();
  await loginPage.needAnAccountLink.click();
  await expect(page).toHaveURL(registrationPage.registrationPageUrl());
});
