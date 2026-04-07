import { test, expect } from '@playwright/test'

test.describe('Debate BDD coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/questlearn/debate/generate-motion', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ motion: 'Schools should start later in the morning.' }),
      })
    })
  })

  test('starts debate and progresses through rounds to verdict', async ({ page }) => {
    let sendCalls = 0
    await page.route('/api/questlearn/debate/start-conversation', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ conversationId: 'c1', aiPosition: 'against' }) })
    })

    await page.route('/api/questlearn/debate/send-argument', async route => {
      sendCalls += 1
      if (sendCalls < 3) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ counterArgument: `Counter ${sendCalls}` }) })
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ counterArgument: 'Final counter', verdict: 'You made stronger evidence-based points.' }) })
      }
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await expect(page.getByText(/Debate Challenge/i)).toBeVisible()
    await expect(page.getByText(/Debate Motion/i)).toBeVisible()

    await page.getByRole('button', { name: /I argue FOR/i }).click()
    await expect(page.getByText(/Round 1\/3/i)).toBeVisible()

    await page.getByPlaceholder(/Your Round 1 argument/i).fill('Schools should start later for better sleep and concentration.')
    await page.getByRole('button', { name: /Submit Round 1 Argument/i }).click()
    await expect(page.getByText(/Can you strengthen that\?/i)).toBeVisible()

    await page.getByPlaceholder(/Your Round 2 argument/i).fill('Evidence links sleep to memory and learning outcomes.')
    await page.getByRole('button', { name: /Submit Round 2 Argument/i }).click()

    await page.getByPlaceholder(/Your Round 3 argument/i).fill('A phased pilot could test attendance and outcomes safely.')
    await page.getByRole('button', { name: /Submit Round 3 Argument/i }).click()

    await expect(page.getByText(/VERDICT/i)).toBeVisible()
    await expect(page.getByText(/stronger evidence-based points/i)).toBeVisible()
  })

  test('shows graceful error when start conversation fails', async ({ page }) => {
    await page.route('/api/questlearn/debate/start-conversation', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await page.getByRole('button', { name: /I argue FOR/i }).click()
    await expect(page.getByText(/Failed to start the debate\. Please try again\./i)).toBeVisible()
  })
})
