import { basename } from '@angular-devkit/core';
import { apply, chain, DirEntry, mergeWith, Rule, template, Tree, url } from '@angular-devkit/schematics';
import {
  generateRoutesConstName,
  generateRoutesFileName,
  getRoutesDirs,
  hasComponentsInDir,
  hasRoutesFileInDir,
} from '../utils/index.js';

interface RoutesOptions {
  path: string;
  routesFileName: string;
  routesConstName: string;
}

/**
 * Creates an empty routes file in every routes dir that has components but no routes file yet.
 */
export function generateMissingRoutes(tree: Tree): Rule {
  const routesRules = getRoutesDirs(tree)
    .filter((dir) => hasComponentsInDir(dir) && !hasRoutesFileInDir(dir))
    .map((dir) => fromTemplate(optionsFromDir(dir)));

  return chain(routesRules);
}

function fromTemplate(options: RoutesOptions): Rule {
  return mergeWith(apply(url('./files'), [template(options)]));
}

function optionsFromDir(dir: DirEntry): RoutesOptions {
  const dirName = basename(dir.path);

  return {
    path: dir.path,
    routesFileName: generateRoutesFileName(dirName),
    routesConstName: generateRoutesConstName(dirName),
  };
}
