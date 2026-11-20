import { mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

/**
 * Libraries import each other's Sass by package name (`@liquid-js/lyr-core/styles/theming`), which
 * resolves through the package `exports` once published. Inside the workspace the sources live under
 * `src/`, so this links them into `node_modules/.lyra-styles`, which the builds use as a style include path.
 */
const root = resolve(import.meta.dirname, '..');
const links: Record<string, string> = {
  '@liquid-js/lyr-core': 'packages/core/src',
};

const base = join(root, 'node_modules', '.lyra-styles');
for (const [name, target] of Object.entries(links)) {
  const link = join(base, name);
  rmSync(link, { recursive: true, force: true });
  mkdirSync(dirname(link), { recursive: true });
  symlinkSync(relative(dirname(link), join(root, target)), link, process.platform === 'win32' ? 'junction' : 'dir');
}
