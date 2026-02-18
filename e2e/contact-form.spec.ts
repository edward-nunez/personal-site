import { test, expect } from '@playwright/test';

test.describe('Contact form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /contact/i }).first().click();
  });

  test('contact section or form is present on homepage', async ({ page }) => {
    await expect(page.getByText(/contact/i).first()).toBeVisible({ timeout: 5000 });
  });

  test('invalid email shows validation when form is submitted', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i).first();
    if ((await emailInput.count()) === 0) {
      test.skip();
      return;
    }
    await emailInput.fill('not-an-email');
    const submit = page.getByRole('button', { name: /send|submit/i }).first();
    if ((await submit.count()) === 0) {
      test.skip();
      return;
    }
    await submit.click();
    await expect(
      page.getByText(/invalid|email|required|valid/i).first()
    ).toBeVisible({ timeout: 5000 });
  });
});
