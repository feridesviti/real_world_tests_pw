import { test } from '@playwright/test';
import { expect } from '@playwright/test';
import { ArticlesGridComponent } from '../../pages/components/articlesGrid.component';

test('grid not empty', { tag: ['@smoke', '@regression', '@ui'] }, async ({ page }) => {
  const articlesGrid = new ArticlesGridComponent(page);
  await page.goto('/');
  page.waitForLoadState('domcontentloaded');
  await expect(articlesGrid.loadingIndicator).toBeHidden();
  const articles = await articlesGrid.getArticlesGrig();
  await expect(articles.length).toBeGreaterThanOrEqual(4);
});
