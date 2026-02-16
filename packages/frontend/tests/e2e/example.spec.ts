import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Personal Site v2/);
});

test('homepage is accessible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
