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

  test('starts debate and progresses through rounds to verdict with request contract checks', async ({ page }) => {
    const sendPayloads: any[] = []

    await page.route('/api/questlearn/debate/start-conversation', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ conversationId: 'c1', aiPosition: 'against' }) })
    })

    await page.route('/api/questlearn/debate/send-argument', async route => {
      const payload = route.request().postDataJSON()
      sendPayloads.push(payload)
      const call = sendPayloads.length

      if (call < 3) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ counterArgument: `Counter ${call}` }) })
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ counterArgument: 'Final counter', verdict: 'You made stronger evidence-based points.' }) })
      }
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await expect(page.getByText(/Debate Challenge/i)).toBeVisible()
    await expect(page.getByText(/Debate Motion/i)).toBeVisible()
    await expect(page.getByText(/Schools should start later in the morning\./i).first()).toBeVisible()

    await page.getByRole('button', { name: /I argue FOR/i }).click()
    await expect(page.getByText(/Round 1\/3/i)).toBeVisible()

    await page.getByPlaceholder(/Your Round 1 argument/i).fill('Schools should start later for better sleep and concentration.')
    await page.getByRole('button', { name: /Submit Round 1 Argument/i }).click()
    await expect(page.getByText(/Can you strengthen that\?/i)).toBeVisible()
    await expect(page.getByText(/Round 2\/3/i)).toBeVisible()

    await page.getByPlaceholder(/Your Round 2 argument/i).fill('Evidence links sleep to memory and learning outcomes.')
    await page.getByRole('button', { name: /Submit Round 2 Argument/i }).click()
    await expect(page.getByText(/Round 3\/3/i)).toBeVisible()

    await page.getByPlaceholder(/Your Round 3 argument/i).fill('A phased pilot could test attendance and outcomes safely.')
    await page.getByRole('button', { name: /Submit Round 3 Argument/i }).click()

    await expect(page.getByText(/VERDICT/i)).toBeVisible()
    await expect(page.getByText(/stronger evidence-based points/i)).toBeVisible()

    expect(sendPayloads.length).toBe(3)
    sendPayloads.forEach((p, idx) => {
      expect(p.conversationId).toBe('c1')
      expect(p.topic).toBe('Schools should start later in the morning.')
      expect(p.userPosition).toBe('for')
      expect(p.aiPosition).toBe('against')
      expect(p.round).toBe(idx + 1)
      expect(typeof p.argument).toBe('string')
      expect(p.argument.length).toBeGreaterThan(0)
    })
  })

  test('AGAINST path starts successfully', async ({ page }) => {
    await page.route('/api/questlearn/debate/start-conversation', async route => {
      const payload = route.request().postDataJSON()
      expect(payload.userPosition).toBe('against')
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ conversationId: 'c2', aiPosition: 'for' }) })
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await page.getByRole('button', { name: /I argue AGAINST/i }).click()
    await expect(page.getByText(/You: AGAINST/i)).toBeVisible()
  })

  test('shows graceful error when start conversation fails', async ({ page }) => {
    await page.route('/api/questlearn/debate/start-conversation', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await page.getByRole('button', { name: /I argue FOR/i }).click()
    await expect(page.getByText(/Failed to start the debate\. Please try again\./i)).toBeVisible()
  })

  test('send-argument failure restores input and rolls back optimistic user message', async ({ page }) => {
    await page.route('/api/questlearn/debate/start-conversation', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ conversationId: 'c3', aiPosition: 'against' }) })
    })

    await page.route('/api/questlearn/debate/send-argument', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await page.goto('/mini/debate?topic=Photosynthesis')
    await page.getByRole('button', { name: /I argue FOR/i }).click()

    const draft = 'My evidence-based argument'
    await page.getByPlaceholder(/Your Round 1 argument/i).fill(draft)
    await page.getByRole('button', { name: /Submit Round 1 Argument/i }).click()

    await expect(page.getByText(/Sorry, something went wrong\. Try again!/i)).toBeVisible()
    await expect(page.getByPlaceholder(/Your Round 1 argument/i)).toHaveValue(draft)
    await expect(page.locator('.rounded-tr-sm', { hasText: draft })).not.toBeVisible()
  })
})
