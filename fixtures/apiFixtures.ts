import { test as base, request as playwrightRequest } from '@playwright/test';
import { ApiClient } from '../api/clients/apiClient';
import { createTestUser, TestUser } from '../utils/dataFactory';

type TestFixtures = {
  apiClient: ApiClient;
  testUser: TestUser;
};

export const test = base.extend<TestFixtures>({
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },

  testUser: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const context = await playwrightRequest.newContext({
        baseURL: process.env.API_URL
      });

      const apiClient = new ApiClient(context);
      const testUser = createTestUser();
      const registrationResponse = await apiClient.userRegistration(testUser);
      const createdUser: TestUser = {
        user: registrationResponse.user,
        password: testUser.password
      };
      await use(createdUser);
      await context.dispose();
    },
    { scope: 'test' }
  ]
});
