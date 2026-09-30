import { expect } from '@playwright/test';
import { test as base } from '../../fixtures/authFixtures';
import { SettingsPage } from '../../pages/settings.page';
import { ProfilePage } from '../../pages/profile.page';
import { ApiClient } from '../../api/clients/apiClient';

base('check settings page', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth: _uiAuth }) => {
  const settingsPage = new SettingsPage(page);
  await settingsPage.goto();
  await expect(settingsPage.title).toHaveText('Your Settings');
  await settingsPage.checkPageUrl();
});

base('check settings page components', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth }) => {
  const settingsPage = new SettingsPage(page);
  await settingsPage.goto();
  await expect(settingsPage.urlPictureInput).toBeVisible();
  await expect(settingsPage.nameInput).toHaveValue(uiAuth.user.username);
  await expect(settingsPage.bioInput).toBeVisible();
  await expect(settingsPage.emailInput).toHaveValue(uiAuth.user.email);
  await expect(settingsPage.newPasswordInput).toBeVisible();
  await expect(settingsPage.newPasswordInput).toBeEmpty();
  await expect(settingsPage.updateButton).toBeVisible();
  await expect(settingsPage.updateButton).toBeEnabled();
  await expect(settingsPage.logoutButton).toBeVisible();
});

base('check settings changes', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth: _uiAuth }) => {
  const settingsPage = new SettingsPage(page);
  await settingsPage.goto();
  const newData = {
    urlPicture: 'https://mockmind-api.uifaces.co/content/cartoon/22.jpg',
    name: 'Cartoon avatar',
    bio: 'I am a cartoon avatar',
    email: `cartoon_${Date.now()}@example.com`
  };
  await settingsPage.fillForm(newData);
  const profilePage = await settingsPage.clickOnUpdateButton();

  await expect(profilePage.profilePicture).toHaveAttribute('src', newData.urlPicture);
  await expect(profilePage.username).toHaveText(newData.name);
  await expect(profilePage.bio).toHaveText(newData.bio);

  await profilePage.settingsButton.click();
  await expect(settingsPage.emailInput).toHaveValue(newData.email);
});

base('check password change', { tag: ['@regression', '@ui'] }, async ({ page, uiAuth, request }) => {
  const newPassword = process.env.TEST_USER_NEW_PASSWORD || 'NewPass12345';

  const profilePage: ProfilePage = await base.step('change user password', async () => {
    const settingsPage = new SettingsPage(page);
    await settingsPage.goto();
    await settingsPage.fillForm({ newPassword: newPassword });
    return await settingsPage.clickOnUpdateButton();
  });

  await base.step('logout user', async () => {
    const settingsPage = await profilePage.openSettings();
    await expect(settingsPage.newPasswordInput).toBeEmpty();
    await settingsPage.clickOnLogoutButton();
    await expect(settingsPage.navigation.profileLink).not.toBeVisible();
  });

  const apiClient = new ApiClient(request);

  await base.step('user should not be logged in with old password', async () => {
    const response = await apiClient.loginUser(uiAuth.user.email, uiAuth.password);
    expect(response.status()).toBe(401);
  });

  await base.step('login user with new password', async () => {
    const response = await apiClient.loginUser(uiAuth.user.email, newPassword);
    await expect(response).toBeOK();
    const body = await response.json();
    expect(body.user.email).toBe(uiAuth.user.email);
    expect(body.user.username).toBe(uiAuth.user.username);
  });
});
