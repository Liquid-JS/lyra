import { expect, Locator, Page } from '@playwright/test';

/** The element's box, failing the test when the element isn't visible. */
export const boxOf = async (locator: Locator): Promise<{ x: number; y: number; width: number; height: number }> => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error(`${locator} has no bounding box`);
  }
  return box;
};

export const hasClass = async (locator: Locator, cls: string): Promise<boolean> => {
  const classes = (await locator.getAttribute('class')) || '';
  return classes.split(/\s+/).includes(cls);
};

export const hexToRgbA = (hex: string, alpha = 1): string => {
  let c: string[] | string;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    const value = Number(`0x${c.join('')}`);
    const channels = `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
    return alpha === 1 ? `rgb(${channels})` : `rgba(${channels}, ${alpha})`;
  }
  throw new Error('Bad Hex');
};

export async function openExample(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await expect(page.locator('npg-app-root')).toBeAttached();
  // The playground theme is a separate stylesheet linked on demand; layout and colour checks need it applied.
  await page.waitForFunction(() => {
    const link = document.getElementById('playground-theme') as HTMLLinkElement | null;
    return !!link?.sheet;
  });
  // Text is laid out again when its web font arrives, which changes controls' heights by a pixel or two.
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}
