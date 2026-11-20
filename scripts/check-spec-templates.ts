import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Type-checks the templates of the specs' host components, as the libraries' builds check theirs: the specs run
 * compiled just in time (the overlay specs swap a directive's providers, which ahead-of-time code doesn't allow), so
 * a wrong binding there would otherwise only show as a failing or, worse, passing test.
 */
const root = resolve(import.meta.dirname, '..');
const ngc = join(root, 'node_modules/.bin/ngc');
const projects = readdirSync(join(root, 'packages'))
  .map((name) => join(root, 'packages', name, 'tsconfig.spec.json'))
  .filter((config) => existsSync(config));

let failed = false;
for (const config of projects) {
  const result = spawnSync(ngc, ['-p', config, '--noEmit'], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) {
    failed = true;
  }
}
if (failed) {
  process.exit(1);
}
