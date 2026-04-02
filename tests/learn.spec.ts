import { test, expect } from '@playwright/test';

test.describe('Learning Experience', () => {
  test('redirects unauthenticated users from /learn to /auth', async ({ page }) => {
    await page.goto('/learn');
    await expect(page).toHaveURL(/\/auth/);
  });

  test('redirects unauthenticated users from /teacher to /auth', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page).toHaveURL(/\/auth/);
  });
});
