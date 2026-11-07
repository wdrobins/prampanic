import { expect, test, type Page } from '@playwright/test';

function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function startCanonicalFirstWalk(page: Page): Promise<void> {
  await page.goto('/?e2e=1');
  await expect(page.getByTestId('title-screen')).toBeVisible();
  await page.getByTestId('title-start').click();
  await expect(page.getByTestId('first-walk-screen')).toBeVisible();
  await expect(page.getByTestId('first-walk-hud')).toContainText('LULU:');
}

test.describe('First Walk player path', () => {
  test('takes the title CTA into the canonical First Walk at 390×844 without console errors', async ({
    page
  }) => {
    const errors = captureConsoleErrors(page);

    await startCanonicalFirstWalk(page);
    await expect(page.locator('canvas')).toHaveAttribute('width', '390');
    await expect(page.locator('canvas')).toHaveAttribute('height', '844');
    await page.keyboard.down('a');
    await page.keyboard.up('a');
    await page.keyboard.press('s');
    await page.keyboard.press('Space');
    await page.keyboard.press('w');
    await expect(page.getByTestId('first-walk-hud')).toContainText('Next feed');
    expect(errors).toEqual([]);
  });

  test('exposes two-thumb controls and prevents a second shush during cooldown', async ({
    page
  }) => {
    const errors = captureConsoleErrors(page);

    await startCanonicalFirstWalk(page);
    await expect(page.getByTestId('control-steer-left')).toBeVisible();
    await expect(page.getByTestId('control-steer-right')).toBeVisible();
    const shush = page.getByTestId('shush-button');
    await expect(shush).toHaveAttribute('data-shush-ready', 'true');
    await shush.click();
    await expect(shush).toHaveAttribute('data-shush-ready', 'false');
    await expect(shush).toHaveAttribute('aria-disabled', 'true');
    await shush.click({ force: true });
    await expect(shush).toHaveAttribute('data-shush-ready', 'false');
    expect(errors).toEqual([]);
  });

  test('shows the win result from the public test control', async ({ page }) => {
    const errors = captureConsoleErrors(page);

    await startCanonicalFirstWalk(page);
    await page.getByTestId('e2e-finish-win').click();
    await expect(page.getByTestId('result-screen')).toContainText('Home before the feed');
    await expect(page.getByTestId('result-next')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('shows loss and returns to a fresh First Walk through retry', async ({ page }) => {
    const errors = captureConsoleErrors(page);

    await startCanonicalFirstWalk(page);
    await page.getByTestId('e2e-finish-loss').click();
    await expect(page.getByTestId('result-screen')).toContainText('Lulu woke up');
    await page.getByTestId('result-retry').click();
    await expect(page.getByTestId('first-walk-screen')).toBeVisible();
    await expect(page.getByTestId('first-walk-hud')).toContainText('LULU: Sleeping');
    expect(errors).toEqual([]);
  });
});
