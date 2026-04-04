import { test, expect } from '@playwright/test'

test.describe('Teacher dashboard - Cogniti Engagement', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/cogniti/telemetry', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
        topTopics: [{ topic: 'Photosynthesis', cardFlips: 2, sessions: 1 }],
        avgConfidence: [{ topic: 'Photosynthesis', avgRating: 3.0 }],
        answerAccuracy: [{ topic: 'Photosynthesis', correctCount: 1, totalCount: 1, pct: 100 }],
        fetchedAt: new Date().toISOString()
      }) })
    )
    // Block real Cogniti API calls
    await page.route('https://app.cogniti.ai/**', route => route.abort())
  })

  test('Cogniti Engagement section is visible', async ({ page }) => {
    await page.goto('/teacher')
    await expect(page.getByText('Cogniti Flashcard Engagement')).toBeVisible()
  })

  test('Top topic appears in engagement panel', async ({ page }) => {
    await page.goto('/teacher')
    await expect(page.getByText('Photosynthesis')).toBeVisible()
  })

  test('No real calls to app.cogniti.ai during test', async ({ page }) => {
    const cognitiCalls: string[] = []
    page.on('request', req => { if (req.url().includes('cogniti.ai')) cognitiCalls.push(req.url()) })
    await page.goto('/teacher')
    expect(cognitiCalls).toHaveLength(0)
  })
})
