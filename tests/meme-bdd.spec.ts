import { test, expect } from '@playwright/test'

test.describe('Meme mini app BDD coverage', () => {
  test('renders meme from API response and shows share action', async ({ page }) => {
    let memePayload: any = null
    await page.route('/api/generate/meme-text', async route => {
      memePayload = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          topText: 'WHEN THE SUN HITS',
          bottomText: 'GLUCOSE FACTORY ONLINE',
          imageUrl: '/memes/181913649.jpg',
        }),
      })
    })

    await page.goto('/mini/meme?topic=Photosynthesis')
    await expect(page.getByRole('heading', { name: /^Meme ·/i })).toBeVisible()
    await expect(page.getByText(/WHEN THE SUN HITS/i)).toBeVisible()
    await expect(page.getByText(/GLUCOSE FACTORY ONLINE/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Share meme/i })).toBeVisible()

    expect(memePayload?.topic).toBe('Photosynthesis')
  })

  test('falls back to parsed meme body when API fails', async ({ page }) => {
    await page.route('/api/generate/meme-text', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await page.goto('/mini/meme?topic=Photosynthesis')
    await expect(page.getByText(/Photosynthesis when the sunlight hits/i)).toBeVisible()
    await expect(page.getByText(/Time to turn light into learning/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Share meme/i })).toBeVisible()
  })

  test('malformed success payload falls back safely', async ({ page }) => {
    await page.route('/api/generate/meme-text', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ topText: '', bottomText: '' }) })
    })

    await page.goto('/mini/meme?topic=Photosynthesis')
    await expect(page.getByText(/Photosynthesis when the sunlight hits/i)).toBeVisible()
    await expect(page.getByText(/Time to turn light into learning/i)).toBeVisible()
  })
})
