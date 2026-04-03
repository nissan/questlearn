/**
 * Lumina OS — Desktop Shell tests
 *
 * Covers the core flows of the new Lumina OS UX introduced in PR #5.
 * Tests: boot sequence, login (student/teacher), desktop shell, app launcher, mobile.
 */
import { test, expect } from '@playwright/test';

const LUMINA_USER_STUDENT = {
  name: 'Demo Student',
  role: 'student',
  school_name: 'Sydney Grammar',
  school_location: 'Sydney NSW',
  year_level: 'Year 10',
};

/** Inject localStorage so the desktop skips boot/login and goes straight to the OS shell */
async function injectLuminaUser(page: import('@playwright/test').Page, user = LUMINA_USER_STUDENT) {
  await page.addInitScript((userData) => {
    localStorage.setItem('lumina_user', JSON.stringify(userData));
  }, user);
}

test.describe('Lumina OS — Desktop Shell', () => {
  // ---------------------------------------------------------------------------
  // Boot sequence
  // ---------------------------------------------------------------------------
  test('boot screen shows briefly then transitions to login', async ({ page }) => {
    await page.goto('/desktop');
    // Boot screen: shows "Lumina OS" text and progress bar — must appear before login
    // The boot completes in ~750ms; capture it early
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(50); // let React render initial state

    // Boot screen should be showing (phase === 'boot')
    const hasLuminaText = await page.getByText('Lumina OS').isVisible().catch(() => false);
    const hasPoweringUp = await page.getByText(/powering up/i).isVisible().catch(() => false);
    expect(hasLuminaText || hasPoweringUp).toBeTruthy();

    // After boot completes (~750ms + 150ms delay), login screen should appear
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 3000 });
  });

  // ---------------------------------------------------------------------------
  // Login — student
  // ---------------------------------------------------------------------------
  test('student can fill login form and reach desktop', async ({ page }) => {
    await page.goto('/desktop');

    // Wait for login screen
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 3000 });

    // Student tab should be selected by default
    await expect(page.getByRole('button', { name: /student/i })).toBeVisible();

    // Fill student form
    await page.getByPlaceholder('Your name').fill('Alice Tester');
    await page.getByRole('combobox').selectOption('Year 10');
    await page.getByPlaceholder('School name').fill('Sydney Grammar');
    await page.getByPlaceholder('School suburb or city').fill('Sydney NSW');

    // Mock the API response so we don't need a real DB
    await page.route('/api/auth/lumina-register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ name: 'Alice Tester', role: 'student' }),
      });
    });

    await page.getByRole('button', { name: /enter lumina os/i }).click();

    // Should transition to the desktop (menu bar becomes visible)
    await expect(page.getByText('🌟 Lumina')).toBeVisible({ timeout: 5000 });
  });

  // ---------------------------------------------------------------------------
  // Login — teacher tab
  // ---------------------------------------------------------------------------
  test('teacher tab switches form fields', async ({ page }) => {
    await page.goto('/desktop');
    await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 3000 });

    // Click teacher tab
    await page.getByRole('button', { name: /teacher/i }).click();

    // Teacher-specific fields should appear
    await expect(page.getByPlaceholder('Teacher ID')).toBeVisible();
    await expect(page.getByPlaceholder('Subject (e.g. Mathematics)')).toBeVisible();

    // Student-specific fields should disappear
    await expect(page.getByRole('combobox')).not.toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Desktop shell (with localStorage injected to skip boot/login)
  // ---------------------------------------------------------------------------
  test('desktop shows dock', async ({ page, browserName }) => {
    // Force desktop viewport for this test — MobileLauncher replaces dock at <768px
    await page.setViewportSize({ width: 1280, height: 800 });
    await injectLuminaUser(page);
    await page.goto('/desktop');
    await page.waitForLoadState('networkidle');

    // Dock is fixed at the bottom — should contain app icon buttons
    const dock = page.locator('.dock-icon');
    await expect(dock.first()).toBeVisible({ timeout: 5000 });
  });

  test('desktop shows menu bar', async ({ page }) => {
    // Force desktop viewport — MenuBar is only rendered in the desktop OS shell
    await page.setViewportSize({ width: 1280, height: 800 });
    await injectLuminaUser(page);
    await page.goto('/desktop');
    await page.waitForLoadState('networkidle');

    // MenuBar renders "🌟 Lumina" button in top-left
    await expect(page.getByText('🌟 Lumina')).toBeVisible({ timeout: 5000 });
  });

  test('desktop shows app icons for QuestLearn and Teacher Hub', async ({ page }) => {
    // Force desktop viewport — desktop icons are in the Desktop component (not MobileLauncher)
    await page.setViewportSize({ width: 1280, height: 800 });
    await injectLuminaUser(page);
    await page.goto('/desktop');
    await page.waitForLoadState('networkidle');

    // Desktop icons are rendered in the Desktop component
    await expect(page.getByText('QuestLearn')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Teacher Hub')).toBeVisible({ timeout: 5000 });
  });

  // ---------------------------------------------------------------------------
  // App launcher
  // ---------------------------------------------------------------------------
  test('launchpad shows v2 apps as dimmed', async ({ page }) => {
    // Force desktop viewport — the AppLauncher lives in the desktop OS shell, not MobileLauncher
    await page.setViewportSize({ width: 1280, height: 800 });
    await injectLuminaUser(page);
    await page.goto('/desktop');
    await page.waitForLoadState('networkidle');

    // Open the app launcher via the Lumina button in the menu bar
    await page.getByText('🌟 Lumina').click();

    // Launcher should be open — shows "Lumina OS Apps" heading
    await expect(page.getByText('🌟 Lumina OS Apps')).toBeVisible({ timeout: 3000 });

    // v2 apps should be present and marked "Coming soon"
    const comingSoonBadges = page.getByText('Coming soon');
    await expect(comingSoonBadges.first()).toBeVisible();

    // v2 app buttons should be disabled (opacity-40 / cursor-not-allowed)
    const studyRooms = page.getByRole('button', { name: /study rooms/i });
    await expect(studyRooms).toBeDisabled();
  });

  // ---------------------------------------------------------------------------
  // Mobile viewport
  // ---------------------------------------------------------------------------
  test('mobile viewport shows launcher grid not desktop', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await injectLuminaUser(page);
    await page.goto('/desktop');
    await page.waitForLoadState('networkidle');

    // Mobile launcher should show Lumina OS header and app grid
    await expect(page.getByText('🌟 Lumina OS')).toBeVisible({ timeout: 5000 });

    // Should see QuestLearn and Teacher Hub in the mobile grid
    await expect(page.getByText('QuestLearn')).toBeVisible();
    await expect(page.getByText('Teacher Hub')).toBeVisible();

    // Desktop-specific elements should NOT be visible
    // (MenuBar uses hidden md:inline and the desktop shell doesn't render at 375px)
    const menuBarLumina = page.getByRole('button', { name: '🌟 Lumina' });
    await expect(menuBarLumina).not.toBeVisible();
  });
});
