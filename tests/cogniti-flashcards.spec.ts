import { test, expect } from '@playwright/test'

test.describe('Cogniti Flashcards tab', () => {
  test('Flashcards tab appears in format selector', async ({ page }) => {
    // Mock session cookie — student role
    await page.goto('/learn?topic=Photosynthesis&format=story')
    await expect(page.getByText('🃏')).toBeVisible()
    await expect(page.getByText('Flashcards')).toBeVisible()
  })

  test('Clicking Flashcards tab renders iframe', async ({ page }) => {
    // Route Cogniti iframe to avoid real network call
    await page.route('https://app.cogniti.ai/**', route => route.fulfill({ status: 200, body: '<html><body>Cogniti Mock</body></html>' }))
    await page.goto('/learn?topic=Photosynthesis&format=flashcards')
    const iframe = page.locator('iframe[title="Cogniti Flashcards"]')
    await expect(iframe).toBeVisible()
    const src = await iframe.getAttribute('src')
    expect(src).toContain('Photosynthesis')
  })
})
