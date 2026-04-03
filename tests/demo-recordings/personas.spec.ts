/**
 * QuestLearn — Demo Recording Scripts
 *
 * Runs headed Chrome with Playwright video recording.
 * Each test = one persona walkthrough for demo video collateral.
 *
 * Run with:
 *   cd /tmp/questlearn
 *   npx playwright test tests/demo-recordings/personas.spec.ts \
 *     --config=tests/demo-recordings/playwright.demo.config.ts
 *
 * Videos output to: tests/demo-recordings/videos/<test-name>/video.webm
 */
import { test, expect } from '@playwright/test';

const BASE = 'https://questlearn-nu.vercel.app';

/** Type like a human — character by character with slight variation */
async function humanType(
  page: import('@playwright/test').Page,
  selector: string,
  text: string,
  wpm = 45,
) {
  const el = page.locator(selector).first();
  await el.click();
  const baseDelay = Math.round(60000 / (wpm * 5));
  for (const char of text) {
    await el.pressSequentially(char, { delay: baseDelay + Math.random() * 40 - 20 });
  }
}

const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────────────────
// S1 — Zara Osei · Year 10 · Photosynthesis · Story
// ─────────────────────────────────────────────────────────────────────────────
test('S1 — Zara Osei · Photosynthesis · Story', async ({ page }) => {
  test.setTimeout(150_000);

  await page.goto(BASE + '/desktop');
  await pause(900);
  await page.waitForLoadState('networkidle');
  await pause(500);

  await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 6000 });
  await pause(700);

  await humanType(page, 'input[placeholder="Your name"]', 'Zara Osei');
  await pause(400);
  await page.getByRole('combobox').selectOption('Year 10');
  await pause(300);
  await humanType(page, 'input[placeholder="School name"]', 'Parramatta High School');
  await pause(300);
  await humanType(page, 'input[placeholder="School suburb or city"]', 'Parramatta NSW');
  await pause(700);

  await page.getByRole('button', { name: /enter questlearn/i }).click();
  await pause(1000);

  // Desktop — show it briefly
  await pause(1800);

  // Double-click QuestLearn icon
  const qlIcon = page.locator('span', { hasText: 'QuestLearn' }).first();
  await qlIcon.click();
  await pause(260);
  await qlIcon.click();
  await pause(1200);

  await page.waitForURL(/\/learn/, { timeout: 12_000 }).catch(() => null);
  await pause(600);

  // Topic + format
  const topicInput = page.locator('input[placeholder*="opic"]').first();
  if (await topicInput.isVisible()) {
    await humanType(page, 'input[placeholder*="opic"]', 'Photosynthesis');
    await pause(500);
  }

  const storyBtn = page.getByRole('button', { name: /^story$/i });
  if (await storyBtn.isVisible()) { await storyBtn.click(); await pause(400); }

  const generateBtn = page.getByRole('button', { name: /generate|start|go/i });
  if (await generateBtn.isVisible()) await generateBtn.click();

  await pause(8000); // API call
  await pause(3000); // reading pause

  const chatInput = page.locator('textarea').first();
  if (await chatInput.isVisible()) {
    await pause(2000);
    await humanType(
      page, 'textarea',
      'I think photosynthesis is how plants turn sunlight into food using carbon dioxide and water. The chlorophyll in leaves captures the light energy.',
      40,
    );
    await pause(800);
    await page.keyboard.press('Enter');
    await pause(6000); // AI responds
  }

  await pause(3500);
});

// ─────────────────────────────────────────────────────────────────────────────
// S2 — Kai Nguyen · Year 9 · Newton's Laws · Game
// ─────────────────────────────────────────────────────────────────────────────
test('S2 — Kai Nguyen · Newtons Laws · Game', async ({ page }) => {
  test.setTimeout(150_000);

  await page.goto(BASE + '/desktop');
  await pause(900);
  await page.waitForLoadState('networkidle');
  await pause(400);

  await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 6000 });
  await pause(500);

  await humanType(page, 'input[placeholder="Your name"]', 'Kai Nguyen');
  await pause(300);
  await page.getByRole('combobox').selectOption('Year 9');
  await pause(250);
  await humanType(page, 'input[placeholder="School name"]', 'Blacktown Boys High School');
  await pause(250);
  await humanType(page, 'input[placeholder="School suburb or city"]', 'Blacktown NSW');
  await pause(600);

  await page.getByRole('button', { name: /enter questlearn/i }).click();
  await pause(1000);
  await pause(1500);

  const qlIcon = page.locator('span', { hasText: 'QuestLearn' }).first();
  await qlIcon.click(); await pause(260); await qlIcon.click();
  await pause(1200);

  await page.waitForURL(/\/learn/, { timeout: 12_000 }).catch(() => null);
  await pause(500);

  const topicInput = page.locator('input[placeholder*="opic"]').first();
  if (await topicInput.isVisible()) {
    await humanType(page, 'input[placeholder*="opic"]', "Newton's Laws of Motion");
    await pause(400);
  }

  const gameBtn = page.getByRole('button', { name: /^game$/i });
  if (await gameBtn.isVisible()) { await gameBtn.click(); await pause(350); }

  const generateBtn = page.getByRole('button', { name: /generate|start|go/i });
  if (await generateBtn.isVisible()) await generateBtn.click();

  await pause(8000);
  await pause(2500);

  const chatInput = page.locator('textarea').first();
  if (await chatInput.isVisible()) {
    await pause(1500);
    await humanType(
      page, 'textarea',
      "Option B. An object stays still unless something pushes it — that's Newton's first law.",
      55,
    );
    await pause(700);
    await page.keyboard.press('Enter');
    await pause(5000);
  }

  await pause(3000);
});

// ─────────────────────────────────────────────────────────────────────────────
// S3 — Priya Sharma · Year 8 · Water Cycle · Meme
// ─────────────────────────────────────────────────────────────────────────────
test('S3 — Priya Sharma · Water Cycle · Meme', async ({ page }) => {
  test.setTimeout(150_000);

  await page.goto(BASE + '/desktop');
  await pause(900);
  await page.waitForLoadState('networkidle');
  await pause(400);

  await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 6000 });
  await pause(500);

  await humanType(page, 'input[placeholder="Your name"]', 'Priya Sharma');
  await pause(300);
  await page.getByRole('combobox').selectOption('Year 8');
  await pause(250);
  await humanType(page, 'input[placeholder="School name"]', 'Strathfield Girls High School');
  await pause(250);
  await humanType(page, 'input[placeholder="School suburb or city"]', 'Strathfield NSW');
  await pause(600);

  await page.getByRole('button', { name: /enter questlearn/i }).click();
  await pause(1000);
  await pause(1500);

  const qlIcon = page.locator('span', { hasText: 'QuestLearn' }).first();
  await qlIcon.click(); await pause(260); await qlIcon.click();
  await pause(1200);

  await page.waitForURL(/\/learn/, { timeout: 12_000 }).catch(() => null);
  await pause(500);

  const topicInput = page.locator('input[placeholder*="opic"]').first();
  if (await topicInput.isVisible()) {
    await humanType(page, 'input[placeholder*="opic"]', 'The Water Cycle');
    await pause(400);
  }

  const memeBtn = page.getByRole('button', { name: /^meme$/i });
  if (await memeBtn.isVisible()) { await memeBtn.click(); await pause(350); }

  const generateBtn = page.getByRole('button', { name: /generate|start|go/i });
  if (await generateBtn.isVisible()) await generateBtn.click();

  await pause(8000);
  await pause(3000);

  const chatInput = page.locator('textarea').first();
  if (await chatInput.isVisible()) {
    await pause(1800);
    await humanType(
      page, 'textarea',
      'lol ok so basically water goes up as vapour when it gets hot, turns into clouds, then falls as rain, and it just keeps looping forever?',
      50,
    );
    await pause(700);
    await page.keyboard.press('Enter');
    await pause(5000);
  }

  await pause(3000);
});

// ─────────────────────────────────────────────────────────────────────────────
// T1 — Ms. Rachel Chen · Teacher Dashboard
// ─────────────────────────────────────────────────────────────────────────────
test('T1 — Ms Rachel Chen · Teacher Dashboard', async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto(BASE + '/desktop');
  await pause(900);
  await page.waitForLoadState('networkidle');
  await pause(400);

  await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 6000 });
  await pause(500);

  await page.getByRole('button', { name: /📊 Teacher/ }).click();
  await pause(500);

  await humanType(page, 'input[placeholder="Your name"]', 'Ms. Rachel Chen');
  await pause(300);
  await humanType(page, 'input[placeholder="Teacher ID"]', 'TCH-2047');
  await pause(250);
  await humanType(page, 'input[placeholder="Subject (e.g. Mathematics)"]', 'Science');
  await pause(250);
  await humanType(page, 'input[placeholder="School name"]', 'Parramatta High School');
  await pause(250);
  await humanType(page, 'input[placeholder="School suburb or city"]', 'Parramatta NSW');
  await pause(700);

  await page.getByRole('button', { name: /enter questlearn/i }).click();
  await pause(1000);
  await pause(1500);

  const teacherIcon = page.locator('span', { hasText: 'Teacher Hub' });
  await teacherIcon.click(); await pause(260); await teacherIcon.click();
  await pause(1800);

  await page.waitForURL(/\/teacher/, { timeout: 12_000 }).catch(() => null);
  await pause(4000); // read the heatmap

  const filterInput = page.locator('input[placeholder*="ilter"]');
  if (await filterInput.isVisible()) {
    await filterInput.click();
    await pause(2500);
  }

  await pause(3500);
});

// ─────────────────────────────────────────────────────────────────────────────
// T2 — Mr. David Okafor · Teacher Dashboard
// ─────────────────────────────────────────────────────────────────────────────
test('T2 — Mr David Okafor · Teacher Dashboard', async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto(BASE + '/desktop');
  await pause(900);
  await page.waitForLoadState('networkidle');
  await pause(400);

  await expect(page.getByText("Let's get started")).toBeVisible({ timeout: 6000 });
  await pause(500);

  await page.getByRole('button', { name: /📊 Teacher/ }).click();
  await pause(500);

  await humanType(page, 'input[placeholder="Your name"]', 'Mr. David Okafor');
  await pause(300);
  await humanType(page, 'input[placeholder="Teacher ID"]', 'TCH-1893');
  await pause(250);
  await humanType(page, 'input[placeholder="Subject (e.g. Mathematics)"]', 'Mathematics');
  await pause(250);
  await humanType(page, 'input[placeholder="School name"]', 'Blacktown Boys High School');
  await pause(250);
  await humanType(page, 'input[placeholder="School suburb or city"]', 'Blacktown NSW');
  await pause(700);

  await page.getByRole('button', { name: /enter questlearn/i }).click();
  await pause(1000);
  await pause(1500);

  const teacherIcon = page.locator('span', { hasText: 'Teacher Hub' });
  await teacherIcon.click(); await pause(260); await teacherIcon.click();
  await pause(1800);

  await page.waitForURL(/\/teacher/, { timeout: 12_000 }).catch(() => null);
  await pause(4000);
  await pause(3500);
});
