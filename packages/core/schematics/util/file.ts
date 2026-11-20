import { JsonValue } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';

function throwFileNotFoundError(fileName: string): never {
  throw new Error(`${fileName} file not found in the tree.`);
}

/** The file's text; throws when the tree has no such file. */
export function readText(tree: Tree, fileName: string, encoding: BufferEncoding = 'utf8'): string {
  const file = tree.read(fileName);

  if (!file) {
    throwFileNotFoundError(fileName);
  }

  return file.toString(encoding);
}

/** The file parsed as JSON; throws when the tree has no such file. */
export function readJSON(tree: Tree, fileName: string, encoding: BufferEncoding = 'utf8'): JsonValue {
  return JSON.parse(readText(tree, fileName, encoding)) as JsonValue;
}

/** Overwrites an existing file. */
export function writeText(tree: Tree, fileName: string, content: string) {
  tree.overwrite(fileName, content);
}

/** Overwrites an existing file with the JSON, indented by two spaces. */
export function writeJSON(tree: Tree, fileName: string, content: JsonValue) {
  writeText(tree, fileName, JSON.stringify(content, null, 2));
}
