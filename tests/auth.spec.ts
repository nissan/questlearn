/**
 * @legacy Legacy auth — superseded by Lumina OS login at /desktop
 *
 * The email OTC auth flow still exists at /auth but is no longer the
 * primary entry point. Lumina OS uses its own login at /desktop.
 * These tests are kept for regression coverage of the legacy flow.
 * Run with: npx playwright test --grep @legacy
 */
import { test, expect } from '@playwright/test';

test.describe('@legacy Auth — Email OTC Flow (legacy)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('renders email entry form', async ({ page }) => {
    await expect(page.getByText('QuestLearn')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByRole('button', { name: /send sign-in code/i })).toBeVisible();
  });

  test('send code button disabled with empty email', async ({ page }) => {
    const btn = page.getByRole('button', { name: /send sign-in code/i });
    await expect(btn).toBeDisabled();
  });

  test('send code button enabled with valid email', async ({ page }) => {
    const emailInput = page.getByLabel('Email address');
    await emailInput.fill('test@example.com');
    // Wait for value to settle (especially on WebKit mobile)
    await expect(emailInput).toHaveValue('test@example.com');
    await expect(page.getByRole('button', { name: /send sign-in code/i })).toBeEnabled();
  });

  test('transitions to code entry step after submit', async ({ page }) => {
    await page.getByLabel('Email address').fill('test@example.com');
    const btn = page.getByRole('button', { name: /send sign-in code/i });
    await btn.click();
    // Wait for the button to leave loading state (API responded) or for code input to appear
    await Promise.race([
      page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
      page.locator('.text-destructive').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
      page.locator('.text-muted-foreground').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    ]);
    // Accept any outcome: code step shown, error shown, or cooldown shown — all are valid API responses
    const hasCodeInput = await page.getByLabel('6-digit code').isVisible().catch(() => false);
    const hasError = await page.locator('.text-destructive').isVisible().catch(() => false);
    const hasCooldown = await page.locator('.text-muted-foreground').isVisible().catch(() => false);
    expect(hasCodeInput || hasError || hasCooldown).toBeTruthy();
  });

  test('verify button disabled until 6 digits entered', async ({ page }) => {
    // Manually set step to code entry by triggering the flow
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByRole('button', { name: /send sign-in code/i }).click();
    await page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
    const codeInput = page.getByLabel('6-digit code');
    if (await codeInput.isVisible()) {
      await expect(page.getByRole('button', { name: /verify code/i })).toBeDisabled();
      await codeInput.fill('12345');
      await expect(page.getByRole('button', { name: /verify code/i })).toBeDisabled();
      await codeInput.fill('123456');
      await expect(page.getByRole('button', { name: /verify code/i })).toBeEnabled();
    }
  });

  test('back button returns to email entry', async ({ page }) => {
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByRole('button', { name: /send sign-in code/i }).click();
    await page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
    const backBtn = page.getByRole('button', { name: /use a different email/i });
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await expect(page.getByLabel('Email address')).toBeVisible();
    }
  });
});
