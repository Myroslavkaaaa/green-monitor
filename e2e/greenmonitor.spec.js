const { test, expect } = require('@playwright/test');

test('E2E #1: Критичний шлях "Зони"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('GreenMonitor');
    await page.click('text=Зони');
    await expect(page.locator('h2')).toContainText('Зони теплиць');
});

test('E2E #2: Навігація', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Сенсори');
    await page.click('text=Алерти');
    await page.click('text=Зони');  // Повернення
});