import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import { remark } from 'remark';

import { remarkConfig } from './remark-config.ts';

/**
 * Formats the repository's markdown with `remark-config.ts`, as the markdown editor's Format button and VS Code's remark
 * extension do: the docs' articles, the READMEs and CONTRIBUTING.md (not the changelog, which its release tool
 * writes). With file names, as lint-staged gives them, only those of them; with `--check`, it lists the files that
 * aren't formatted and fails instead.
 *
 *   yarn format:md [--check] [file …]
 */
const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const named = args.filter((arg) => arg !== '--check').map((file) => relative(root, resolve(file)));

/** The markdown it formats: under version control, and one of these. */
const formatted = (file: string) =>
  file.endsWith('.md') &&
  !file.startsWith('archive/') &&
  (file.startsWith('packages/docs/public/articles/') || /(^|\/)README\.md$/.test(file) || file === 'CONTRIBUTING.md');

const tracked = execFileSync('git', ['ls-files', '*.md', '**/*.md'], { cwd: root, encoding: 'utf8' }).split('\n');
const files = (named.length ? named : tracked).filter(formatted);

const processor = remark().use(remarkConfig);

const unformatted = new Array<string>();
for (const file of files) {
  const path = resolve(root, file);
  const markdown = readFileSync(path, 'utf8');
  const result = String(await processor.process(markdown));
  if (result === markdown) {
    continue;
  }
  if (check) {
    unformatted.push(file);
  } else {
    writeFileSync(path, result);
    console.log(`Formatted ${file}`);
  }
}

if (unformatted.length) {
  console.error(`Not formatted, run \`yarn format:md\`:\n${unformatted.map((file) => `  ${file}`).join('\n')}`);
  process.exit(1);
}
