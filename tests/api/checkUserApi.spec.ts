import { expect } from '@playwright/test';
import { test as base } from '../../fixtures/apiFixtures';
import { updateUserData } from '../../utils/dataFactory';

base('check user login', { tag: ['@smoke', '@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const response = await apiClient.loginUser(testUser.user.email, testUser.password);
  await expect(response).toBeOK();
  const responseJson = await response.json();
  expect(responseJson.user.email).toBe(testUser.user.email);
  expect(responseJson.user.token).toBeDefined();
});

base('check negative user password', { tag: ['@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const response = await apiClient.loginUser(testUser.user.email, 'wrong_password');
  expect(response.status()).toBe(401);
});

base('check negative user email', { tag: ['@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const response = await apiClient.loginUser('wrong_email@test.com', testUser.password);
  expect(response.status()).toBe(401);
});

base('get current user', { tag: ['@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const response = await apiClient.getCurrentUser(testUser.user.token);

  expect(response.status()).toBe(200);
  const responseJson = await response.json();
  expect(responseJson.user.email).toBe(testUser.user.email);
  expect(responseJson.user.username).toBe(testUser.user.username);
  expect(responseJson.user.token).toBe(testUser.user.token);
});

base('get current user with wrong token', { tag: ['@regression', '@api'] }, async ({ apiClient }) => {
  const response = await apiClient.getCurrentUser('wrong_token');
  expect(response.status()).toBe(401);
});

base('update user data', { tag: ['@regression', '@api'] }, async ({ apiClient, testUser }) => {
  const updatedUserPayload = updateUserData();

  const response = await apiClient.updateUser(testUser.user.token, updatedUserPayload);
  expect(response.status()).toBe(200);
  const responseJson = await response.json();
  expect(responseJson.user.email).toBe(updatedUserPayload.user.email);
  expect(responseJson.user.username).toBe(updatedUserPayload.user.username);
  expect(responseJson.user.bio).toBe(updatedUserPayload.user.bio);
  expect(responseJson.user.image).toBe(updatedUserPayload.user.image);
});
