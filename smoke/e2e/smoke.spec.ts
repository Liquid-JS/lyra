import { expect, test } from '@playwright/test';

test('renders the consumer application with a Lyra component', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('bs-root')).toBeAttached();
  await expect(page.locator('nb-card')).toContainText('Lyra works!');
});

test('renders a QR code from lyr-extras', async ({ page }) => {
  await page.goto('/');
  // Drawn on a canvas in the browser, in place of the SVG.
  await expect(page.locator('nb-qr-code canvas')).toBeVisible();
  await expect(page.locator('nb-qr-code svg')).toBeHidden();
  await expect(page.locator('nb-qr-code')).toHaveAttribute('aria-label', 'https://liquid-js.github.io/lyra/');
});

test('renders markdown and a markdown editor from lyr-extras', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nb-markdown-viewer h2')).toHaveText('Rendered markdown');
  await expect(page.locator('nb-markdown-viewer pre code .hljs-keyword')).toHaveText('const');
  await expect(page.locator('nb-markdown-editor [contenteditable="true"][aria-label="Notes"]').first()).toBeVisible();
});

test('renders a phone input from lyr-extras', async ({ page }) => {
  await page.goto('/');
  const phone = page.locator('nb-phone-input');
  await expect(phone.locator('input[type="tel"]')).toHaveValue('(201) 555-0123');
  await expect(phone.locator('button')).toHaveAttribute('aria-label', 'Country: United States of America');
  // The flag, from the app's assets.
  const flag = await phone.locator('nxt-flag').evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(flag).toContain('assets/flags/us.svg');

  await phone.locator('button').click();
  await page.keyboard.type('canada');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(phone.locator('button')).toHaveAttribute('aria-label', 'Country: Canada');
});

test('masks a field with lyr-extras', async ({ page }) => {
  await page.goto('/');
  const field = page.locator('input.masked');
  await expect(field).toHaveValue('(201) 555-0123');

  await field.fill('');
  await field.pressSequentially('4155550199');
  await expect(field).toHaveValue('(415) 555-0199');
});

test('picks a colour with lyr-extras', async ({ page }) => {
  await page.goto('/');
  const field = page.getByRole('textbox', { name: 'Brand color' });
  await expect(field).toHaveValue('#3366ff');

  // Focus opens the dialog.
  await field.focus();
  await expect(page.locator('.color-picker')).toBeVisible();
  await field.fill('rgb(0, 214, 143)');
  await page.locator('nb-card').first().click();
  await expect(field).toHaveValue('#00d68f');
});

test('opens a select from lyr-core and picks an option', async ({ page }) => {
  await page.goto('/');
  const select = page.locator('nb-select[aria-label="City"]');
  // Without a layout to set the theme class, the select has no size to click, so it opens from the keyboard.
  await select.locator('button').focus();
  await page.keyboard.press('ArrowDown');
  // The options open in an overlay, outside the select.
  const option = page.locator('.cdk-overlay-container nb-option', { hasText: 'London' });
  await expect(option).toBeAttached();
  await page.keyboard.press('Enter');
  await expect(select.locator('button')).toContainText('London');
});
