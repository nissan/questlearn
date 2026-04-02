import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'tests', 'screenshots');

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test.describe('Screenshot capture for demo video', () => {
  test('capture home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `home-${page.viewportSize()?.width}w.png`),
      fullPage: true,
    });
  });

  test('capture auth page', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `auth-${page.viewportSize()?.width}w.png`),
      fullPage: true,
    });
  });

  test('capture auth page — code entry state', async ({ page }) => {
    await page.goto('/auth');
    await page.getByLabel('Email address').fill('demo@questlearn.app');
    await page.getByRole('button', { name: /send sign-in code/i }).click();
    // Wait for response — code step, error, or cooldown
    await Promise.race([
      page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 8000 }).catch(() => null),
      page.locator('.text-destructive').waitFor({ state: 'visible', timeout: 8000 }).catch(() => null),
      page.locator('.text-muted-foreground').waitFor({ state: 'visible', timeout: 8000 }).catch(() => null),
    ]);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `auth-code-entry-${page.viewportSize()?.width}w.png`),
      fullPage: true,
    });
  });
});
