import { expect, test } from '@playwright/test';
import { openExample } from './e2e-helper';

test.describe('nb-layout', () => {
  test.beforeEach(({ page }) => openExample(page, '/layout/layout-test.component'));
  test('should render container', async ({ page }) => {
    await expect(page.locator('#layout-fluid > div')).toHaveClass(/scrollable-container/);
  });
});

test.describe('nb-layout withScroll', () => {
  test.beforeEach(({ page }) => openExample(page, '/scroll/scroll-window.component'));

  test('should scroll its own container instead of the page, and give the page back its scroll', async ({ page }) => {
    const bodyOverflow = () => page.evaluate(() => getComputedStyle(document.body).overflow);
    const layout = page.locator('nb-layout');
    // The example starts with the page scrolling.
    await expect(layout).not.toHaveClass(/with-scroll/);
    expect(await bodyOverflow()).toBe('visible');

    await page.getByRole('button', { name: 'Change Mode' }).click();
    await expect(layout).toHaveClass(/with-scroll/);
    expect(await bodyOverflow()).toBe('hidden');
    await expect(page.locator('nb-layout .scrollable-container')).toHaveCSS('overflow', 'auto');

    await page.getByRole('button', { name: 'Change Mode' }).click();
    await expect(layout).not.toHaveClass(/with-scroll/);
    expect(await bodyOverflow()).toBe('visible');
  });
});
