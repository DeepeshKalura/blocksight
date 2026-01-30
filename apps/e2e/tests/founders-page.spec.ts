import { test, expect } from '@playwright/test';

test('founders page has a heading and three founders', async ({ page }) => {
  await page.goto('/founders');

  await expect(page.getByRole('heading', { name: 'Our Founders' })).toBeVisible();

  const founders = page.locator('div > h2');
  await expect(founders).toHaveCount(3);

  await page.screenshot({ path: 'founders-page-screenshot.png' });
});
