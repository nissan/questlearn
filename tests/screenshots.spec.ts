/**
 * Screenshot capture for demo/marketing — QuestLearn UX overhaul.
 *
 * Captures key states of the QuestLearn desktop shell and standalone routes.
 * Screenshots are saved to tests/screenshots/.
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'tests', 'screenshots');

const LUMINA_USER = JSON.stringify({
  name: 'Demo Student',
  role: 'student',
  school_name: 'Sydney Grammar',
  school_location: 'Sydney NSW',
  year_level: 'Year 10',
});

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test.describe('Screenshot capture — QuestLearn', () => {
  test('1. /desktop — boot screen (early capture)', async ({ page }) => {
    // Navigate and capture immediately — boot completes in ~750ms
    await page.goto('/desktop');
    // Don't wait for networkidle; capture early to catch the boot screen
    await page.waitForLoadState('domcontentloaded');
    // Small delay to let React render the initial boot state
    await page.waitForTimeout(100);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-1-boot-screen.png'),
      fullPage: true,
    });
  });

  test('2. /desktop — login screen visible after boot', async ({ page }) => {
    await page.goto('/desktop');
    // Wait for the login form to appear (boot completes ~750ms, then login shows)
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 5000 });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-2-login-screen.png'),
      fullPage: true,
    });
  });

  test('3. /desktop — desktop with dock and menu bar (logged in via localStorage)', async ({ page }) => {
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
    // Wait for the desktop to render (menu bar + dock)
    await expect(page.getByText('🌟 QuestLearn')).toBeVisible({ timeout: 5000 });
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-3-desktop.png'),
      fullPage: true,
    });
  });

  test('4. /desktop — QuestLearn app window open', async ({ page }) => {
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
    await expect(page.getByText('🌟 QuestLearn')).toBeVisible({ timeout: 5000 });
    // Double-click on the QuestLearn desktop icon to open the window
    const questlearnIcon = page.getByText('QuestLearn').first();
    await questlearnIcon.dblclick().catch(() => {
      // Fallback: click the dock icon
    });
    // Wait briefly for window to open
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-4-questlearn-window.png'),
      fullPage: true,
    });
  });

  test('5. /learn — standalone', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-5-learn-standalone.png'),
      fullPage: true,
    });
  });

  test('6. /teacher — standalone', async ({ page }) => {
    await page.goto('/teacher');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-6-teacher-standalone.png'),
      fullPage: true,
    });
  });

  test('7. /pitch', async ({ page }) => {
    await page.goto('/pitch');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-7-pitch.png'),
      fullPage: true,
    });
  });

  test('8. /desktop — mobile viewport (375px) showing mobile launcher', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
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
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'lumina-8-mobile-launcher.png'),
      fullPage: true,
    });
  });
});
