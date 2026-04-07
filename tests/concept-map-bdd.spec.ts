import { test, expect } from '@playwright/test'

async function openConceptMap(page: import('@playwright/test').Page) {
  await page.goto('/mini/concept-map?topic=Photosynthesis')
  await expect(page.getByRole('heading', { name: /^Concept Map ·/i })).toBeVisible()
  await expect(page.locator('svg ellipse').first()).toBeVisible()
}

test.describe('Concept Map BDD coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/questlearn/concept-map/evaluate-connection', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ feedback: 'Solid connection.' }),
      })
    })

    await page.route('/api/questlearn/concept-map/evaluate-map', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ feedback: 'Great map. Add one deeper causal link.' }),
      })
    })

    await openConceptMap(page)
  })

  test('gates Connect and Evaluate until required actions exist', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Connect/i })).toBeDisabled()
    await expect(page.getByRole('button', { name: /Evaluate Map/i })).toBeDisabled()
  })

  test('selecting a node enables Connect and shows selected label', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await expect(page.getByRole('button', { name: /Connect/i })).toBeEnabled()
    await expect(page.getByText(/Selected:/i)).toBeVisible()
  })

  test('connect flow creates first relationship and enables Evaluate', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await page.getByRole('button', { name: /Connect/i }).click()
    await page.locator('svg ellipse').nth(1).click()

    const relationship = page.getByPlaceholder(/causes, produces, requires/i)
    await expect(relationship).toBeVisible()
    await expect(relationship).toHaveValue('related to')

    await page.getByRole('button', { name: /^Add$/ }).click()

    await expect(page.getByText(/1 connections/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Evaluate Map/i })).toBeEnabled()
  })

  test('Evaluate Map shows feedback panel after one connection', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await page.getByRole('button', { name: /Connect/i }).click()
    await page.locator('svg ellipse').nth(1).click()
    await page.getByRole('button', { name: /^Add$/ }).click()

    await page.getByRole('button', { name: /Evaluate Map/i }).click()
    await expect(page.getByText(/Map Evaluation/i)).toBeVisible()
  })

  test('selection stays stable when clicking empty canvas', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await expect(page.getByText(/Selected:/i)).toBeVisible()

    await page.locator('svg.cursor-default').click({ position: { x: 20, y: 20 } })
    await expect(page.getByText(/Selected:/i)).toBeVisible()
  })
})
