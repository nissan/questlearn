import { test, expect } from '@playwright/test';

test.describe('Onboarding — 4-Step Wizard', () => {
  test('redirects unauthenticated users from /onboarding to /auth', async ({ page }) => {
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/\/auth/);
  });

  test('auth page has correct heading', async ({ page }) => {
    await page.goto('/auth');
    // CardTitle renders as a div, not a heading element
    await expect(page.getByText('QuestLearn', { exact: true })).toBeVisible();
  });

  test('home page has get started link to /auth', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /get started/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/auth');
  });
});
