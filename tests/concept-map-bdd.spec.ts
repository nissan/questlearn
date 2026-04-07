import { test, expect, type Page } from '@playwright/test'

async function openConceptMap(page: Page) {
  await page.goto('/mini/concept-map?topic=Photosynthesis')
  await expect(page.getByRole('heading', { name: /^Concept Map ·/i })).toBeVisible()
  await expect(page.locator('svg ellipse').first()).toBeVisible()
}

async function createConnection(page: Page) {
  await page.locator('svg ellipse').first().click()
  await page.getByRole('button', { name: /Connect/i }).click()
  await page.locator('svg ellipse').nth(1).click()
  await page.getByRole('button', { name: /^Add$/ }).click()
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
        body: JSON.stringify({ feedback: 'Great map. Add one deeper causal link.', suggestedConnection: { source: 'Photosynthesis', relationship: 'depends on', target: 'Sunlight' } }),
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

  test('clear selection disables Connect again', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await expect(page.getByRole('button', { name: /Connect/i })).toBeEnabled()

    await page.getByRole('button', { name: /Clear selection/i }).click()
    await expect(page.getByRole('button', { name: /Connect/i })).toBeDisabled()
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
    await expect(page.getByText(/Connection Feedback/i)).toBeVisible()
  })

  test('connect cancel path closes without creating connection', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await page.getByRole('button', { name: /Connect/i }).click()
    await page.locator('svg ellipse').nth(1).click()

    await page.getByRole('button', { name: /^Cancel$/ }).first().click()
    await expect(page.getByText(/0 connections/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Evaluate Map/i })).toBeDisabled()
  })

  test('Evaluate Map sends expected payload and renders suggested connection', async ({ page }) => {
    let mapPayload: any = null
    await page.unroute('/api/questlearn/concept-map/evaluate-map')
    await page.route('/api/questlearn/concept-map/evaluate-map', async route => {
      mapPayload = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ feedback: 'Great map.', suggestedConnection: { source: 'Photosynthesis', relationship: 'requires', target: 'Sunlight' } }),
      })
    })

    await createConnection(page)
    await page.getByRole('button', { name: /Evaluate Map/i }).click()

    expect(mapPayload?.topic).toBe('Photosynthesis')
    expect(Array.isArray(mapPayload?.concepts)).toBeTruthy()
    expect(Array.isArray(mapPayload?.connections)).toBeTruthy()
    expect(mapPayload?.connections?.[0]?.relationship).toBeTruthy()
    await expect(page.getByText(/Suggested connection/i)).toBeVisible()
  })

  test('evaluate handles API failure gracefully', async ({ page }) => {
    await page.unroute('/api/questlearn/concept-map/evaluate-map')
    await page.route('/api/questlearn/concept-map/evaluate-map', async route => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) })
    })

    await createConnection(page)
    await page.getByRole('button', { name: /Evaluate Map/i }).click()

    await expect(page.getByText(/Your map is looking great!/i)).toBeVisible()
  })

  test('selection stays stable when clicking empty canvas', async ({ page }) => {
    await page.locator('svg ellipse').first().click()
    await expect(page.getByText(/Selected:/i)).toBeVisible()

    await page.locator('svg.cursor-default').click({ position: { x: 20, y: 20 } })
    await expect(page.getByText(/Selected:/i)).toBeVisible()
  })
})
