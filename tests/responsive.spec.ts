import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'Home' },
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
