import { expect, test } from '@playwright/test';

test('starts First Walk and continues to update at phone size', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('canvas')).toHaveAttribute('width', '390');
  await expect
    .poll(() => page.evaluate(() => Boolean(window.__pramPanicGame?.isRunning)))
    .toBe(true);

  await page.evaluate(() => window.__pramPanicGame?.scene.start('first-walk'));
  await expect
    .poll(() =>
      page.evaluate(() => ({
        ready: window.__pramPanicGame?.registry.get('firstWalkReady'),
        frames: window.__pramPanicGame?.registry.get('firstWalkFrameCount') ?? 0,
        active: window.__pramPanicGame?.scene.isActive('first-walk')
      }))
    )
    .toMatchObject({ ready: true, active: true });
  await page.waitForTimeout(300);
  await expect
    .poll(() => page.evaluate(() => window.__pramPanicGame?.registry.get('firstWalkFrameCount')))
    .toBeGreaterThan(5);
  expect(errors).toEqual([]);
});
