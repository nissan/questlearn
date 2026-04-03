import { test, expect } from '@playwright/test';

test.describe('Learning Experience', () => {
  test('unauthenticated /learn redirects to /desktop (middleware active)', async ({ page }) => {
    await page.goto('/learn');
    await expect(page).toHaveURL(/\/desktop/, { timeout: 5000 });
  });

  test('unauthenticated /teacher redirects to /desktop (middleware active)', async ({ page }) => {
    await page.goto('/teacher');
    await expect(page).toHaveURL(/\/desktop/, { timeout: 5000 });
  });

  test.skip('/teacher shows class dashboard heading or loading state', async ({ page }) => {
    // Skipped: requires a real ql_session JWT cookie — inject auth before enabling
    await page.goto('/teacher');
    await page.waitForLoadState('networkidle');
    const hasDashboard = await page.getByText('Class Dashboard').isVisible().catch(() => false);
    const hasLoading = await page.getByText(/loading/i).isVisible().catch(() => false);
    expect(hasDashboard || hasLoading).toBeTruthy();
  });
});
