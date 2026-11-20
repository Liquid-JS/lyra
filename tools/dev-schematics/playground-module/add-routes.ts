import * as ts from 'typescript';
import { dirname, Path } from '@angular-devkit/core';
import { DirEntry, SchematicContext, Tree } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import {
  addRoute,
  generateComponentRoute,
  importPath,
  getClassWithDecorator,
  removeExtension,
  getComponentsFromDir,
  getRoutesFileFromDir,
  generateLazyRoutesImport,
  routePredicatesFromPath,
  findRoutesFile,
  getPlaygroundDirs,
  findRoutesArray,
  addMissingChildRoutes,
  isInPlaygroundRoot,
  getRouteLoadChildren,
  addObjectProperty,
  findRouteWithPath,
  findRoute,
  componentRoutePredicate,
  isRootPlaygroundDir,
} from '../utils/index.js';

/**
 * Gives every component a lazy route in the routes file of its dir,
 * and lazy loads every routes file from the closest routes file above it.
 * Components in dirs without a routes file are helpers and don't get routes.
 */
export function addRoutes(tree: Tree, context: SchematicContext): Tree {
  processDirs(tree, context, getPlaygroundDirs(tree));
  return tree;
}

function processDirs(tree: Tree, context: SchematicContext, dirs: DirEntry[]) {
  for (const dir of dirs) {
    processDir(tree, context, dir);

    if (dir.subdirs.length) {
      processDirs(
        tree,
        context,
        dir.subdirs.map((d) => dir.dir(d)),
      );
    }
  }
}

function processDir(tree: Tree, context: SchematicContext, dir: DirEntry) {
  const routesPath = getRoutesFileFromDir(dir);
  if (!routesPath) {
    return;
  }

  getComponentsFromDir(dir).forEach((path) => addComponentRoute(tree, context, routesPath, path));
  addLazyRoutesRoute(tree, routesPath);
}

function addComponentRoute(tree: Tree, context: SchematicContext, routesPath: Path, componentPath: Path) {
  const componentDeclarations = getClassWithDecorator(tree, componentPath, 'Component');
  if (!componentDeclarations.length) {
    return;
  }
  if (componentDeclarations.length > 1) {
    context.logger.warn(
      `Found more than one component declaration in ${componentPath}. ` +
        'Route will be created only for the first one.\n' +
        "Move all helper components which don't need own routes to sub directory without routes file in it.",
    );
  }

  const componentClassName = (componentDeclarations[0].name as ts.Identifier).getText();
  const routes = findRoutesArray(tree, routesPath);

  if (findRoute(routes, componentRoutePredicate.bind(null, componentClassName))) {
    return;
  }

  const routingImport = importPath(routesPath, componentPath);
  const routePath = isInPlaygroundRoot(componentPath) ? '' : removeExtension(componentPath);
  const route = generateComponentRoute(routePath, componentClassName, routingImport);
  addRoute(tree, routesPath, routes, route);
}

/**
 * Adds a route that lazy loads the given routes file to the closest routes file above it.
 */
function addLazyRoutesRoute(tree: Tree, routesPath: Path) {
  const routesDir = dirname(routesPath);
  if (isRootPlaygroundDir(routesDir)) {
    return;
  }

  const parentRoutesPath = findRoutesFile(tree, dirname(routesDir));
  if (!parentRoutesPath) {
    return;
  }

  const routePredicates = routePredicatesFromPath(tree, parentRoutesPath, routesDir);
  let route = findRouteWithPath(findRoutesArray(tree, parentRoutesPath), routePredicates);
  if (!route) {
    addMissingChildRoutes(tree, parentRoutesPath, routesPath);
    route = findRouteWithPath(findRoutesArray(tree, parentRoutesPath), routePredicates) as ts.ObjectLiteralExpression;
  }

  if (getRouteLoadChildren(route)) {
    return;
  }

  const lazyRoutesImport = generateLazyRoutesImport(tree, parentRoutesPath, routesPath);
  const loadChildren = `loadChildren: ${lazyRoutesImport}`;
  addObjectProperty(tree, parseSourceFile(tree, parentRoutesPath), route, loadChildren);
}
