/**
 * Onboarding tests — updated for Lumina OS UX.
 *
 * As of the Lumina OS overhaul (PR #5):
 * - / now redirects to /desktop (not a home page with a "Get Started" link)
 * - The primary auth/registration flow is now the Lumina OS login at /desktop
 *
 * NOTE: The Next.js middleware in src/proxy.ts still guards /onboarding with JWT cookie
 * auth (legacy ql_session cookie). This was NOT updated as part of the Lumina OS overhaul.
 * Unauthenticated access to /onboarding still redirects to /auth.
 */
import { test, expect } from '@playwright/test';

test.describe('Onboarding', () => {
  test('/ redirects to /desktop', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/desktop/);
  });

  test('/onboarding redirects unauthenticated users to /auth (middleware still active)', async ({ page }) => {
    // src/proxy.ts middleware guards /onboarding with JWT cookie auth.
    // Without a valid ql_session cookie, the redirect to /auth is expected.
    // The primary entry point is now /desktop (Lumina OS login), not /onboarding.
    await page.goto('/onboarding');
    await expect(page).toHaveURL(/\/auth/);
  });

  test('auth page has correct heading', async ({ page }) => {
    await page.goto('/auth');
    // CardTitle renders as a div, not a heading element
    await expect(page.getByText('QuestLearn', { exact: true })).toBeVisible();
  });

  // Removed: 'home page has get started link to /auth'
  // The root route (/) now redirects to /desktop — there is no home page with a "Get Started" link.
});
