import { test, expect } from '@playwright/test';

// const BASE_URL = "http://localhost:3000";
const BASE_URL = "http://web.genvidea.com";

test.describe('UI Tests', () => {
  // Assuming your app is served on localhost:3000, adjust if necessary
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should switch to dark mode', async ({ page }) => {
    await page.getByTestId('mode-toggle-btn').click();
    await page.getByTestId('mode-toggle-dark-btn').click();
    await expect(page.locator('html')).toHaveClass('dark');
  });

  test('should switch to light mode', async ({ page }) => {
    await page.getByTestId('mode-toggle-btn').click();
    await page.getByTestId('mode-toggle-light-btn').click();
    // fix this line
    await expect(page.locator('html')).not.toHaveClass('dark');
  });
});