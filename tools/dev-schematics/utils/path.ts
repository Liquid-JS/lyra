import { parse } from 'path';
import { NormalizedSep, Path, relative, dirname, join, normalize, basename } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';

export function removeExtension(filePath: Path): string {
  return parse(filePath).name;
}

/**
 * @param filePath part of the path relative to current directory
 */
export function generateCurrentDirImport(filePath: Path): string {
  const path = normalize(join(dirname(filePath), removeExtension(filePath)));

  return `.${NormalizedSep}${path}`;
}

/**
 * Returns import string for the 'to' parameter relative to 'from' parameter. Both paths must be absolute.
 * Removes file extension.
 * @param from path to file which should import 'to' file
 * @param to path to file which should be imported
 */
export function importPath(from: Path, to: Path): string {
  const relativePath = relative(dirname(from), dirname(to));

  if (relativePath.startsWith('.')) {
    return relativePath;
  }

  if (!relativePath) {
    return generateCurrentDirImport(basename(to));
  }

  return generateCurrentDirImport(join(relativePath, basename(to)));
}

/**
 * Returns the file a lazy `import('./x/x.routes')` loads, relative to the importing file.
 */
export function lazyImportToFilePath(lazyImport: string): Path {
  const matches = /import\('(.+)'\)/m.exec(lazyImport);
  if (matches) {
    return normalize(matches[1] + '.ts');
  }

  throw new SchematicsException(`Can't find lazy import in ${lazyImport}`);
}
