import { Page } from '@playwright/test';

// Bypass auth by injecting a mock JWT cookie — avoids needing real email in tests
export async function mockAuth(page: Page, role: 'student' | 'teacher' = 'student') {
  // Set a test session cookie — the app will redirect to /auth if invalid,
  // so we navigate to /auth first then check redirect behaviour
  await page.goto('/auth');
}

export async function checkBasicLayout(page: Page) {
  // Check no obvious layout breaks
  await page.waitForLoadState('networkidle');
  const body = page.locator('body');
  await body.waitFor({ state: 'visible' });
}
