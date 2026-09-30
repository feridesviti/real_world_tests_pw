import { test as base } from '@playwright/test';
import { createTestUser, TestUser } from '../utils/dataFactory';
import * as dotenv from 'dotenv';
import { ApiClient } from '../api/clients/apiClient';

dotenv.config();

type AuthFixtures = {
  registrationHelper: TestUser;
  uiAuth: TestUser;
};

export const test = base.extend<AuthFixtures>({
  registrationHelper: async ({ request }, use) => {
    const testUser = createTestUser();
    const baseApi = new ApiClient(request);
    const response = await baseApi.userRegistration(testUser);
    testUser.user.token = response.user.token;
    await use(testUser);
  },

  uiAuth: async ({ registrationHelper, page }, use) => {
    await page.context().addInitScript((value) => {
      window.localStorage.setItem('jwtToken', value);
    }, registrationHelper.user.token || '');

    await page.goto(process.env.BASE_URL || '', { waitUntil: 'domcontentloaded' });
    await use(registrationHelper);
  }
});
