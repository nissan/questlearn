/**
 * Responsive layout tests — updated for Lumina OS UX.
 *
 * As of the Lumina OS overhaul (PR #5):
 * - / redirects to /desktop, so layout content lives at /desktop
 * - /desktop is now the primary shell
 * - /auth still exists as the legacy OTC flow
 */
import { test, expect } from '@playwright/test';

const PAGES = [
  // Note: / redirects to /desktop — test /desktop for the home content
  { path: '/desktop', name: 'Desktop' },
  { path: '/auth', name: 'Auth' },
];

for (const { path, name } of PAGES) {
  test.describe(`${name} page layout`, () => {
    test(`${name} renders without horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Check no horizontal scrollbar (body width === viewport width)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()?.width ?? 375;
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
    });

    test(`${name} has visible content`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // At least something is visible
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.trim().length).toBeGreaterThan(0);
    });
  });
}

test.describe('Auth page responsive', () => {
  test('email input is accessible on all viewports', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByRole('button', { name: /send sign-in code/i })).toBeVisible();
  });
});

test.describe('Desktop page responsive', () => {
  test('shows boot screen or login or desktop on load', async ({ page }) => {
    await page.goto('/desktop');
    await page.waitForLoadState('domcontentloaded');
    // The boot screen, login, or desktop should be visible
    const hasBootOrLogin = await Promise.all([
      page.getByText('Lumina OS').isVisible().catch(() => false),
      page.getByText("Let's get started").isVisible().catch(() => false),
    ]);
    expect(hasBootOrLogin.some(Boolean)).toBeTruthy();
  });

  test('mobile viewport (375px) shows Lumina OS mobile launcher', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Inject localStorage to skip boot/login
    await page.addInitScript(() => {
      localStorage.setItem('lumina_user', JSON.stringify({
        name: 'Demo Student',
        role: 'student',
        school_name: 'Sydney Grammar',
        school_location: 'Sydney NSW',
        year_level: 'Year 10',
      }));
    });
    await page.goto('/desktop');
    await page.waitForLoadState('networkidle');
    // Mobile launcher should be visible (not the dock/menu bar desktop)
    await expect(page.getByText('🌟 Lumina OS')).toBeVisible();
    // Should NOT show the desktop dock (which is only for larger viewports)
    const hasDock = await page.locator('.dock-icon').first().isVisible().catch(() => false);
    // Mobile shows the grid — not the dock
    expect(hasDock).toBeFalsy();
  });
});
