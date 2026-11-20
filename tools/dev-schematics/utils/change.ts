import { Path } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';

export interface ReplaceChange {
  pos: number;
  oldText: string;
  newText: string;
}

export function applyReplaceChange(tree: Tree, path: Path, ...changes: ReplaceChange[]): Tree {
  const recorder = tree.beginUpdate(path);
  changes.forEach(({ pos, oldText, newText }) => {
    recorder.remove(pos, oldText.length);
    recorder.insertLeft(pos, newText);
  });
  tree.commitUpdate(recorder);

  return tree;
}
