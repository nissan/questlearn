import { test, expect } from '@playwright/test'

test.describe('Flashcards BDD coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/questlearn/flashcards/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cards: [
            { question: 'What is photosynthesis?', answer: 'Plants convert light into chemical energy.' },
          ],
        }),
      })
    })
  })

  test('flip reveals answer side content', async ({ page }) => {
    await page.goto('/mini/flashcards?topic=Photosynthesis')
    await expect(page.getByText('Tap to reveal answer')).toBeVisible()

    await page.getByText('Tap to reveal answer').click()
    await expect(page.getByText(/Plants convert light into chemical energy\./i)).toBeVisible()
    await expect(page.getByText(/How well did you know this\?/i)).toBeVisible()
  })

  test('AI feedback requires explanation and sends expected payload', async ({ page }) => {
    let evalPayload: any = null
    await page.route('/api/questlearn/flashcards/evaluate-explanation', async route => {
      evalPayload = route.request().postDataJSON()
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ feedback: 'Good explanation.' }) })
    })

    await page.goto('/mini/flashcards?topic=Photosynthesis')
    await page.getByText('Tap to reveal answer').click()

    const feedbackBtn = page.getByRole('button', { name: /Get AI Feedback/i })
    await expect(feedbackBtn).toBeDisabled()

    await page.getByPlaceholder(/Type your explanation here/i).fill('Plants use sunlight to make food.')
    await expect(feedbackBtn).toBeEnabled()
    await feedbackBtn.click()

    expect(evalPayload?.topic).toBe('Photosynthesis')
    expect(evalPayload?.question).toContain('photosynthesis')
    await expect(page.getByText(/AI Feedback/i)).toBeVisible()
  })

  test('feedback API failure shows graceful fallback message', async ({ page }) => {
    await page.route('/api/questlearn/flashcards/evaluate-explanation', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await page.goto('/mini/flashcards?topic=Photosynthesis')
    await page.getByText('Tap to reveal answer').click()
    await page.getByPlaceholder(/Type your explanation here/i).fill('Attempted explanation')
    await page.getByRole('button', { name: /Get AI Feedback/i }).click()

    await expect(page.getByText(/couldn't process that right now/i)).toBeVisible()
  })

  test('completing cards shows completion and restart resets session', async ({ page }) => {
    await page.goto('/mini/flashcards?topic=Photosynthesis')
    await page.getByText('Tap to reveal answer').click()
    await page.getByRole('button', { name: /Good/i }).click()

    await expect(page.getByText(/Session Complete!/i)).toBeVisible()
    await page.getByRole('button', { name: /Try Again/i }).click()

    await expect(page.getByText(/1 \/ 1/i)).toBeVisible()
    await expect(page.getByText('Tap to reveal answer')).toBeVisible()
    await expect(page.getByText(/How well did you know this\?/i)).not.toBeVisible()
  })

  test('falls back to default cards when generate API fails', async ({ page }) => {
    await page.unroute('/api/questlearn/flashcards/generate')
    await page.route('/api/questlearn/flashcards/generate', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await page.goto('/mini/flashcards?topic=Photosynthesis')
    await expect(page.getByText(/What is photosynthesis\?/i)).toBeVisible()
    await expect(page.getByText('Tap to reveal answer')).toBeVisible()
  })
})
