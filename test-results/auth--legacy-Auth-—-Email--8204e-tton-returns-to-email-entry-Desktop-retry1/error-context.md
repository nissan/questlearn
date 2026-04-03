# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> @legacy Auth — Email OTC Flow (legacy) >> back button returns to email entry
- Location: tests/auth.spec.ts:67:7

# Error details

```
Test timeout of 20000ms exceeded.
```

```
Error: locator.fill: Test timeout of 20000ms exceeded.
Call log:
  - waiting for getByLabel('Email address')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "This page could not be found." [level=2] [ref=e6]
  - alert [ref=e7]
```

# Test source

```ts
  1  | /**
  2  |  * @legacy Legacy auth — superseded by Lumina OS login at /desktop
  3  |  *
  4  |  * The email OTC auth flow still exists at /auth but is no longer the
  5  |  * primary entry point. Lumina OS uses its own login at /desktop.
  6  |  * These tests are kept for regression coverage of the legacy flow.
  7  |  * Run with: npx playwright test --grep @legacy
  8  |  */
  9  | import { test, expect } from '@playwright/test';
  10 | 
  11 | test.describe('@legacy Auth — Email OTC Flow (legacy)', () => {
  12 |   test.beforeEach(async ({ page }) => {
  13 |     await page.goto('/auth');
  14 |   });
  15 | 
  16 |   test('renders email entry form', async ({ page }) => {
  17 |     await expect(page.getByText('QuestLearn')).toBeVisible();
  18 |     await expect(page.getByLabel('Email address')).toBeVisible();
  19 |     await expect(page.getByRole('button', { name: /send sign-in code/i })).toBeVisible();
  20 |   });
  21 | 
  22 |   test('send code button disabled with empty email', async ({ page }) => {
  23 |     const btn = page.getByRole('button', { name: /send sign-in code/i });
  24 |     await expect(btn).toBeDisabled();
  25 |   });
  26 | 
  27 |   test('send code button enabled with valid email', async ({ page }) => {
  28 |     const emailInput = page.getByLabel('Email address');
  29 |     await emailInput.fill('test@example.com');
  30 |     // Wait for value to settle (especially on WebKit mobile)
  31 |     await expect(emailInput).toHaveValue('test@example.com');
  32 |     await expect(page.getByRole('button', { name: /send sign-in code/i })).toBeEnabled();
  33 |   });
  34 | 
  35 |   test('transitions to code entry step after submit', async ({ page }) => {
  36 |     await page.getByLabel('Email address').fill('test@example.com');
  37 |     const btn = page.getByRole('button', { name: /send sign-in code/i });
  38 |     await btn.click();
  39 |     // Wait for the button to leave loading state (API responded) or for code input to appear
  40 |     await Promise.race([
  41 |       page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
  42 |       page.locator('.text-destructive').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
  43 |       page.locator('.text-muted-foreground').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
  44 |     ]);
  45 |     // Accept any outcome: code step shown, error shown, or cooldown shown — all are valid API responses
  46 |     const hasCodeInput = await page.getByLabel('6-digit code').isVisible().catch(() => false);
  47 |     const hasError = await page.locator('.text-destructive').isVisible().catch(() => false);
  48 |     const hasCooldown = await page.locator('.text-muted-foreground').isVisible().catch(() => false);
  49 |     expect(hasCodeInput || hasError || hasCooldown).toBeTruthy();
  50 |   });
  51 | 
  52 |   test('verify button disabled until 6 digits entered', async ({ page }) => {
  53 |     // Manually set step to code entry by triggering the flow
  54 |     await page.getByLabel('Email address').fill('test@example.com');
  55 |     await page.getByRole('button', { name: /send sign-in code/i }).click();
  56 |     await page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
  57 |     const codeInput = page.getByLabel('6-digit code');
  58 |     if (await codeInput.isVisible()) {
  59 |       await expect(page.getByRole('button', { name: /verify code/i })).toBeDisabled();
  60 |       await codeInput.fill('12345');
  61 |       await expect(page.getByRole('button', { name: /verify code/i })).toBeDisabled();
  62 |       await codeInput.fill('123456');
  63 |       await expect(page.getByRole('button', { name: /verify code/i })).toBeEnabled();
  64 |     }
  65 |   });
  66 | 
  67 |   test('back button returns to email entry', async ({ page }) => {
> 68 |     await page.getByLabel('Email address').fill('test@example.com');
     |                                            ^ Error: locator.fill: Test timeout of 20000ms exceeded.
  69 |     await page.getByRole('button', { name: /send sign-in code/i }).click();
  70 |     await page.getByLabel('6-digit code').waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
  71 |     const backBtn = page.getByRole('button', { name: /use a different email/i });
  72 |     if (await backBtn.isVisible()) {
  73 |       await backBtn.click();
  74 |       await expect(page.getByLabel('Email address')).toBeVisible();
  75 |     }
  76 |   });
  77 | });
  78 | 
```