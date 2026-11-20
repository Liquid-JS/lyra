import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { Browser, chromium, expect, Page, test } from '@playwright/test';

/**
 * Safari's default Tab order leaves out buttons, links, checkboxes, radios and file inputs without an explicit
 * `tabindex`, so a Lyra control that Chrome reaches can be out of reach in Safari. This tabs through every playground
 * page in WebKit and in Chromium and fails for a Lyra control only Chromium reaches.
 *
 * Playwright's WebKit follows Safari's rule only on macOS with keyboard navigation off (System Settings → Keyboard), so
 * the spec checks that first and skips elsewhere. Plain links are left out: Safari users reach them with Option+Tab, as
 * on every site.
 */

const playground = readFileSync(resolve(import.meta.dirname, '../../packages/playground/src/app/playground-components.ts'), 'utf8');
// The examples, and the showcase's app and site pages.
const routes = [...playground.matchAll(/link: '(\/[a-z0-9-]+\/[a-z0-9-]+\.component|\/showcase\/[a-z0-9/-]+)'/g)].map(
  (match) => match[1],
);
const MAX_STOPS = 60;

// The libraries' own component elements, from their sources: the examples' components use the `nb-` prefix too.
const libraries = ['core', 'auth', 'extras', 'security'].map((name) => resolve(import.meta.dirname, '../../packages', name));
const sources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === 'node_modules' || entry.name === 'schematics' ? [] : sources(path);
    }
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts') ? [path] : [];
  });
const elements = new Set(
  libraries
    .flatMap(sources)
    .flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/selector:\s*['`]([^'`]+)['`]/g)])
    .flatMap((match) => match[1].split(','))
    .map((selector) => selector.trim())
    .filter((selector) => /^nb-[a-z-]+$/.test(selector)),
);
// Containers whose own focusable children are the example's content, not the container's.
const containers = new Set(
  ['layout', 'layout-column', 'layout-header', 'layout-footer', 'card', 'card-body', 'card-header', 'card-footer',
    'sidebar', 'tab', 'tabset', 'stepper', 'step', 'accordion-item-body', 'list', 'list-item', 'flip-card', 'reveal-card',
    'card-front', 'card-back', 'dialog-container', 'window', 'overlay-container', 'toastr-container'].map((name) => `nb-${name}`),
);
const owners = [...elements].filter((element) => !containers.has(element));
// Directives that make an element a Lyra control; others, such as nbTooltip on an example's button, only add to it.
const CONTROL_DIRECTIVES = [
  'nbbutton', 'nbbuttontoggle', 'nbinput', 'nbnumberinput', 'nbtaginput', 'nbtreegridrowtoggle', 'nbsortheader',
  'nbfilterinput', 'nbsteppernext', 'nbstepperprevious', 'nbcardlink', 'nblistitemlink',
];

/** The Tab stops inside Lyra components, in order, as `component > element "label"`. */
async function lyraStops(page: Page, url: string): Promise<string[]> {
  await page.goto(url);
  await expect(page.locator('npg-app-root')).toBeAttached();
  // The example's lazy code and data, e.g. country names or the editor, then its fonts and a rendered frame.
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
  await page.evaluate(() => {
    document.querySelectorAll('.toolbar, .toolbar-toggle-fixed').forEach((element) => element.remove());
    (document.activeElement as HTMLElement | null)?.blur();
  });
  const stops = new Array<string>();
  for (let i = 0; i < MAX_STOPS; i++) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(([lyraElements, controls]) => {
      const element = document.activeElement;
      // Back at the start, or at an element already visited: the order has wrapped around.
      if (!element || element === document.body || element.hasAttribute('data-tab-order')) {
        return null;
      }
      element.setAttribute('data-tab-order', '');
      let owner: Element | null = element;
      while (owner && !lyraElements.includes(owner.tagName.toLowerCase())) {
        owner = owner.parentElement;
      }
      const directive = [...element.attributes]
        .map((attribute) => attribute.name)
        .find((name) => controls.includes(name));
      // The example's own content, and plain links, which Safari leaves to Option+Tab.
      const plainLink = element.tagName === 'A' && !element.hasAttribute('tabindex');
      if ((!owner && !directive) || plainLink) {
        return '';
      }
      const label = (element.getAttribute('aria-label') || element.textContent || '').trim().slice(0, 24);
      const role = element.getAttribute('role');
      return `${owner ? owner.tagName.toLowerCase() : `[${directive}]`} > ${element.tagName.toLowerCase()}${role ? `[role=${role}]` : ''} "${label}"`;
    }, [owners, CONTROL_DIRECTIVES] as const);
    if (stop === null) {
      break;
    }
    if (stop) {
      stops.push(stop);
    }
  }
  return stops;
}

test.describe('Safari Tab order', () => {
  let chrome: Browser;

  test.beforeAll(async () => {
    chrome = await chromium.launch();
  });

  test.afterAll(async () => {
    await chrome.close();
  });

  test.beforeEach(async ({ page }) => {
    // Without an explicit tabindex, Safari doesn't tab to a button.
    await page.setContent('<input aria-label="Start"><button>Plain button</button>');
    await page.focus('input');
    await page.keyboard.press('Tab');
    const reachesButton = await page.evaluate(() => document.activeElement?.tagName === 'BUTTON');
    test.skip(
      reachesButton,
      'This WebKit tabs to plain buttons, so it does not follow Safari: run it on macOS with keyboard navigation off.',
    );
  });

  for (const route of routes) {
    test(route, async ({ page, baseURL }) => {
      const url = `${baseURL}/#${route}`;
      const reference = await chrome.newPage({ viewport: page.viewportSize() ?? undefined });
      try {
        const expected = await lyraStops(reference, url);
        const reached = await lyraStops(page, url);
        const left = [...reached];
        const missing = expected.filter((stop) => {
          const index = left.indexOf(stop);
          if (index < 0) {
            return true;
          }
          left.splice(index, 1);
          return false;
        });
        expect(missing, 'Lyra controls Safari can\'t reach with Tab').toEqual([]);
      } finally {
        await reference.close();
      }
    });
  }
});
