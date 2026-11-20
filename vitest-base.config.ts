import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Vite 8.3.6's optimizer resolves vfile's subpath imports to its Node files in browser tests; these are its browser
// ones, which it chose before.
const vfile = (file: string) => fileURLToPath(new URL(`./node_modules/vfile/lib/${file}.browser.js`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^#minpath$/, replacement: vfile('minpath') },
      { find: /^#minproc$/, replacement: vfile('minproc') },
      { find: /^#minurl$/, replacement: vfile('minurl') },
    ],
  },
  test: {
    // Spies are removed after each test, as Jasmine did, so a stub doesn't leak into the next test.
    restoreMocks: true,
  },
});
