import { expect, test } from '@playwright/test';
import { NavigationComponent } from '../../pages/components/navigation.component';
import * as dotenv from 'dotenv';
dotenv.config();

test('check navigation', { tag: ['@smoke', '@regression', '@ui'] }, async ({ page }) => {
  const navigation = new NavigationComponent(page);
  await page.goto(process.env.BASE_URL || '');
  await expect(navigation.logo).toBeVisible();
  await expect(navigation.homeLink).toBeVisible();
  await expect(navigation.signInLink).toBeVisible();
  await expect(navigation.signUpLink).toBeVisible();
  await expect(navigation.profileLink).toBeHidden();
  await expect(navigation.settingsLink).toBeHidden();
  await expect(navigation.newArticleLink).toBeHidden();
});
