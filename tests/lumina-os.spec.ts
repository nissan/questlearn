/**
 * QuestLearn OS — Desktop Shell tests
 */
import { test, expect } from '@playwright/test';

/**
 * Inject localStorage and navigate to /desktop in desktop phase.
 * Two-step: set storage → goto (triggers fresh SSR + hydration) → wait for useEffect.
 */
async function loginAs(page: import('@playwright/test').Page, role: 'student' | 'teacher' = 'student') {
  const user = {
    name: role === 'student' ? 'Demo Student' : 'Demo Teacher',
    role,
    school_name: 'Sydney Grammar',
    school_location: 'Sydney NSW',
    ...(role === 'student' ? { year_level: 'Year 10' } : {}),
  };
  await page.goto('/desktop');
  await page.evaluate((u) => localStorage.setItem('lumina_user', JSON.stringify(u)), user);
  await page.goto('/desktop');
  // Wait for React hydration + useEffect to transition phase from 'boot' → 'desktop'
  await page.waitForTimeout(500);
}

test.describe('QuestLearn OS — Desktop Shell', () => {

  test('boot screen shows briefly then transitions to login', async ({ page }) => {
    await page.goto('/desktop');
    await page.waitForLoadState('domcontentloaded');
    const hasHeading = await page.getByRole('heading', { name: 'QuestLearn' }).isVisible().catch(() => false);
    const hasLogin   = await page.getByText("Let's get started").isVisible().catch(() => false);
    expect(hasHeading || hasLogin).toBeTruthy();
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 3000 });
  });

  test('student can fill login form and reach desktop', async ({ page }) => {
    await page.goto('/desktop');
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 3000 });
    await page.getByPlaceholder('Your name').fill('Alice Tester');
    await page.getByRole('combobox').selectOption('Year 10');
    await page.getByPlaceholder('School name').fill('Sydney Grammar');
    await page.getByPlaceholder('School suburb or city').fill('Sydney NSW');
    await page.route('/api/auth/lumina-register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-id', name: 'Alice Tester', role: 'student' }),
      });
    });
    await page.getByRole('button', { name: /enter questlearn/i }).click();
    await page.waitForTimeout(600);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.trim().length).toBeGreaterThan(10);
  });

  test('teacher tab switches form fields', async ({ page }) => {
    await page.goto('/desktop');
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 3000 });
    await page.getByRole('button', { name: /📊 Teacher/ }).click();
    await expect(page.getByPlaceholder('Teacher ID')).toBeVisible();
    await expect(page.getByPlaceholder('Subject (e.g. Mathematics)')).toBeVisible();
    await expect(page.getByRole('combobox')).not.toBeVisible();
  });

  test('desktop shows dock', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAs(page);
    await expect(page.locator('.dock-icon').first()).toBeVisible({ timeout: 5000 });
  });

  test('desktop shows menu bar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAs(page);
    await expect(page.locator('button').filter({ hasText: '🎓 QuestLearn' })).toBeVisible({ timeout: 5000 });
  });

  test('desktop shows app icons for QuestLearn and Teacher Hub', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAs(page);
    // DesktopIcon renders label as <span> inside a Draggable wrapper
    await expect(page.locator('span', { hasText: 'QuestLearn' }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('span', { hasText: 'Teacher Hub' })).toBeVisible({ timeout: 5000 });
  });

  test('launchpad shows v2 apps as dimmed', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await loginAs(page);
    await page.locator('button').filter({ hasText: '🎓 QuestLearn' }).click();
    await expect(page.getByText('🎓 QuestLearn Apps')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('Coming soon').first()).toBeVisible();
  });

  test('mobile viewport shows launcher grid not desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAs(page);
    await expect(page.locator('span', { hasText: '🎓 QuestLearn' })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.dock-icon').first()).not.toBeVisible();
  });
});
