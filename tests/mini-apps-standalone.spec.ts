import { test, expect } from '@playwright/test'

test.describe('Standalone mini apps (no desktop facade)', () => {
  test('Flashcards standalone loads and shows card UI', async ({ page }) => {
    await page.goto('/mini/flashcards?topic=Photosynthesis')
    await expect(page.getByRole('heading', { name: /Flashcards/i })).toBeVisible()
    await expect(page.getByText('Tap to reveal answer')).toBeVisible()
  })

  test('Concept map standalone loads', async ({ page }) => {
    await page.goto('/mini/concept-map?topic=Photosynthesis')
    await expect(page.getByRole('heading', { name: /^Concept Map ·/i })).toBeVisible()
    await expect(page.getByPlaceholder('Add concept…')).toBeVisible()
  })

  test('Debate standalone loads with motion', async ({ page }) => {
    await page.route('/api/questlearn/debate/generate-motion', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ motion: 'Schools should start later in the morning.' }),
      })
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await expect(page.getByRole('heading', { name: /^Debate ·/i })).toBeVisible()
    await expect(page.getByText('Debate Challenge')).toBeVisible()
    await expect(page.getByText('Debate Motion')).toBeVisible()
  })
})

test.describe('Mini app API contracts (basic)', () => {
  test('flashcards generate returns 400 on missing topic', async ({ request }) => {
    const res = await request.post('/api/questlearn/flashcards/generate', { data: {} })
    expect(res.status()).toBe(400)
  })

  test('concept-map generate returns 400 on missing topic', async ({ request }) => {
    const res = await request.post('/api/questlearn/concept-map/generate-concepts', { data: {} })
    expect(res.status()).toBe(400)
  })

  test('debate start returns 400 on missing fields', async ({ request }) => {
    const res = await request.post('/api/questlearn/debate/start-conversation', { data: {} })
    expect(res.status()).toBe(400)
  })
})
