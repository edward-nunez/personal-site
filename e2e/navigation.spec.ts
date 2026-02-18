import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate to archive', async ({ page }) => {
    await page.goto('/archive');
    await expect(page).toHaveURL(/\/archive/);
  });

  test('can navigate to consultation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /consult|CONSULT/i }).first().click();
    await expect(page).toHaveURL(/\/consultation/);
  });

  test('navbar links are present', async ({ page }) => {
    await page.goto('/');
    expect(await page.getByText('ABOUT').count()).toBeGreaterThan(0);
    expect(await page.getByText('CONTACT').count()).toBeGreaterThan(0);
  });
});
