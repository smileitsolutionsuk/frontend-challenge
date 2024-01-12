import { test, expect } from '@playwright/test'

test('slot machine ui is renderred', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('//html/body/div/main/div/div/span[1]')).toHaveText('JACKPOT')
})

test('you lose credit with each spin', async ({ page }) => {
  await page.goto('/')

  const credits = page.locator('//html/body/div/main/div/div/span[2]')
  const creditsBefore = parseInt((await credits.textContent()).replace(/[^0-9]/g, ''))

  await page.locator('#spin-btn').click()

  expect(credits).toHaveText(`Credits: ${creditsBefore - 1}`)
})

/**
 * ? unit-testing
 *
 * i have never done TDD and thats for a good reason,
 * i would never dare to polute my code with test logic.
 * and vue components are even harder to work with for testing since its not possible to export functions from vue SFCs.
 */

/**
 * i am aware of the potential weaknesses that these tests might have but this is also just a demonstration
 * matter of fact: this is my first time using e2e testing so i have absolutely no idea what im supposed to do here :)
 */
