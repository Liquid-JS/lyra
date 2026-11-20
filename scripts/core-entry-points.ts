import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';

/**
 * Keeps `@liquid-js/lyr-core`'s entry points in order. Each component folder is an entry point of its own
 * (`@liquid-js/lyr-core/card`), so an app's bundler can put a component's code in the chunk of the route that uses it;
 * the package root re-exports them all.
 *
 * Writes what follows from the list below: each entry point's `ng-package.json` (in `packages/core/<name>`, which names
 * it), its paths in `tsconfig.json` and `tsconfig.dist.json`, and the root `public-api.ts`. With `--check`, it fails
 * instead when one isn't up to date, and in both modes when a file imports another entry point's file by a relative
 * path (the code would be copied into both), or imports the package root from inside it.
 *
 * Code another entry point needs but apps don't is exported from its entry file with a `ɵ` prefix.
 */
const root = resolve(import.meta.dirname, '..');
const src = join(root, 'packages/core/src');
const PACKAGE = '@liquid-js/lyr-core';

/** Folders that share an entry point with another, because they import each other. */
const MERGED: Record<string, string> = { 'button-group': 'button', option: 'select', autocomplete: 'select', tag: 'select' };

/** Entry points besides the component folders: their entry file, and the files they hold (folders end with `/`). */
const SPECIAL: Record<string, { entry: string; include: string[] }> = {
  base: {
    entry: 'base.public-api.ts',
    include: [
      'services/',
      'theme.options.ts',
      'components/shared/',
      'components/cdk/bidi/',
      'components/cdk/collections/',
      'components/cdk/keycodes/',
      'components/cdk/platform/',
    ],
  },
  theme: { entry: 'theme.public-api.ts', include: ['theme.module.ts'] },
  cdk: {
    entry: 'components/cdk/public-api.ts',
    include: ['components/cdk/a11y/', 'components/cdk/adapter/', 'components/cdk/overlay/'],
  },
  'cdk-table': { entry: 'components/cdk/table/public-api.ts', include: ['components/cdk/table/'] },
};

function entryPoints(): Map<string, { entry: string; include: string[] }> {
  const result = new Map(
    Object.entries(SPECIAL).map(([name, value]) => [name, { ...value, include: [...value.include] }]),
  );
  const folders = readdirSync(join(src, 'components'))
    .filter((name) => !['cdk', 'shared'].includes(name))
    .filter((name) => statSync(join(src, 'components', name)).isDirectory())
    .sort();
  for (const folder of folders) {
    const name = MERGED[folder] ?? folder;
    const existing = result.get(name);
    if (existing) {
      existing.include.push(`components/${folder}/`);
    } else {
      const merged = Object.values(MERGED).includes(name);
      result.set(name, {
        entry: merged ? `components/${name}.public-api.ts` : `components/${folder}/public-api.ts`,
        include: [`components/${folder}/`],
      });
    }
  }
  return result;
}

const eps = entryPoints();

/** The entry point a file belongs to, by its path in `src`; shared files in `components` are in `base`. */
function entryPointOf(file: string): string | undefined {
  if (/^components\/[^/]+\.ts$/.test(file) && !file.endsWith('.public-api.ts')) {
    return 'base';
  }
  let best: [string, number] | undefined;
  for (const [name, { entry, include }] of eps) {
    if (file === entry) {
      return name;
    }
    for (const prefix of include) {
      if ((file === prefix || (prefix.endsWith('/') && file.startsWith(prefix))) && (!best || prefix.length > best[1])) {
        best = [name, prefix.length];
      }
    }
  }
  return best?.[0];
}

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return sources(path);
    }
    return name.endsWith('.ts') && !name.endsWith('.spec.ts') ? [path] : [];
  });
}

function resolveImport(from: string, specifier: string): string | undefined {
  const target = normalize(join(dirname(from), specifier));
  return [`${target}.ts`, join(target, 'index.ts')].find((candidate) => existsSync(candidate));
}

const problems = new Array<string>();
const check = process.argv.includes('--check');

// Imports stay inside their entry point, or go through another's package name.
for (const path of sources(src)) {
  const file = relative(src, path);
  if (file === 'public-api.ts') {
    continue;
  }
  const own = entryPointOf(file);
  if (!own) {
    problems.push(`packages/core/src/${file}: belongs to no entry point.`);
    continue;
  }
  const text = readFileSync(path, 'utf8');
  for (const [, specifier] of text.matchAll(/(?:from|import\()\s*'([^']+)'/g)) {
    if (specifier === PACKAGE) {
      problems.push(`packages/core/src/${file}: imports ${PACKAGE} from inside it; import the entry point instead.`);
    } else if (specifier.startsWith('.')) {
      const target = resolveImport(path, specifier);
      const other = target && entryPointOf(relative(src, target));
      if (other && other !== own) {
        problems.push(`packages/core/src/${file}: imports ${specifier}, of ${PACKAGE}/${other}, by its path; import ${PACKAGE}/${other}.`);
      }
    } else if (specifier === `${PACKAGE}/${own}`) {
      problems.push(`packages/core/src/${file}: imports its own entry point, ${specifier}; import the file.`);
    }
  }
}

// Generated files: written, or with --check compared.
const outputs = new Map<string, string>();
for (const [name, { entry }] of eps) {
  if (!existsSync(join(src, entry))) {
    problems.push(`packages/core/src/${entry}: the entry file of ${PACKAGE}/${name} is missing.`);
  }
  const config = {
    $schema: '../../../node_modules/ng-packagr/ng-package.schema.json',
    lib: { entryFile: `../src/${entry}` },
  };
  outputs.set(join(root, 'packages/core', name, 'ng-package.json'), `${JSON.stringify(config, null, 2)}\n`);
}
outputs.set(join(src, 'public-api.ts'), [...eps.keys()].map((name) => `export * from '${PACKAGE}/${name}';\n`).join(''));

/** A tsconfig with its `@liquid-js/lyr-core/*` paths replaced by the entry points'. */
function withPaths(file: string, target: (name: string, entry: string) => string): string {
  const text = readFileSync(file, 'utf8');
  const rootPath = text.indexOf(`"${PACKAGE}": [`);
  const start = text.indexOf('],', rootPath) + 2;
  const others = new RegExp(`\\n\\s*"${PACKAGE}/[^"]+": \\[\\n[^\\]]*\\],`, 'g');
  const rest = text.slice(start).replace(others, '');
  const indent = ' '.repeat(6);
  const paths = [...eps]
    .map(([name, { entry }]) => `\n${indent}"${PACKAGE}/${name}": [\n${indent}  "${target(name, entry)}"\n${indent}],`)
    .join('');
  return text.slice(0, start) + paths + rest;
}
outputs.set(join(root, 'tsconfig.json'), withPaths(join(root, 'tsconfig.json'), (_, entry) => `./packages/core/src/${entry}`));
outputs.set(join(root, 'tsconfig.dist.json'), withPaths(join(root, 'tsconfig.dist.json'), (name) => `./dist/core/${name}`));

for (const [file, content] of outputs) {
  const current = existsSync(file) ? readFileSync(file, 'utf8') : undefined;
  if (current === content) {
    continue;
  }
  if (check) {
    problems.push(`${relative(root, file)}: not up to date; run node scripts/core-entry-points.ts.`);
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
}

// Folders of entry points that are gone.
for (const name of readdirSync(join(root, 'packages/core'))) {
  if (existsSync(join(root, 'packages/core', name, 'ng-package.json')) && !eps.has(name)) {
    problems.push(`packages/core/${name}: an entry point that no longer exists; remove the folder.`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
