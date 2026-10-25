import { expect, test } from '@playwright/test';

test('boots the portrait title screen without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => Boolean(window.__pramPanicGame?.isRunning)))
    .toBe(true);
  await expect(page.locator('canvas')).toHaveAttribute('width', '390');
  expect(errors).toEqual([]);
});
