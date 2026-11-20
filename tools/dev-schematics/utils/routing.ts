import * as ts from 'typescript';
import { basename, dirname, join, normalize, NormalizedSep, Path } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import {
  addArrayElement,
  addObjectProperty,
  importPath,
  isBasePlaygroundDir,
  isLayoutPath,
  isNodeExported,
  isRootPlaygroundDir,
  LAYOUT_COMPONENT_CLASS,
  LAYOUT_COMPONENT_IMPORT,
  LAYOUT_ROUTES_PATH,
  NO_LAYOUT_COMPONENT_CLASS,
  NO_LAYOUT_COMPONENT_IMPORT,
  NO_LAYOUT_ROUTES_PATH,
  PLAYGROUND_ROUTES_PATH,
} from '../utils/index.js';

/**
 * Returns the exported `Routes` constant of a routes file.
 */
export function findRoutesDeclaration(tree: Tree, routesPath: Path): ts.VariableDeclaration {
  const source = parseSourceFile(tree, routesPath);
  const declaration = source.statements
    .filter((statement): statement is ts.VariableStatement => ts.isVariableStatement(statement))
    .flatMap((statement) => statement.declarationList.declarations)
    .find((node) => isNodeExported(node) && node.type?.getText() === 'Routes');

  if (declaration == null) {
    throw new SchematicsException(`Error in ${routesPath}. Can't find exported Routes constant.`);
  }
  if (declaration.initializer == null || !ts.isArrayLiteralExpression(declaration.initializer)) {
    throw new SchematicsException(`Error in ${routesPath}. Routes should be initialized with array.`);
  }

  return declaration;
}

/**
 * Returns the routes of a routes file. When the file wraps its routes in a single pathless route
 * that only adds providers, returns that route's children, which is where routes get added.
 */
export function findRoutesArray(tree: Tree, routesPath: Path): ts.ArrayLiteralExpression {
  const routes = findRoutesDeclaration(tree, routesPath).initializer as ts.ArrayLiteralExpression;
  const [route, ...rest] = getRoutesFromArray(routes);
  if (route && !rest.length && isProvidersRoute(route)) {
    return getRouteChildren(route) as ts.ArrayLiteralExpression;
  }
  return routes;
}

function isProvidersRoute(route: ts.ObjectLiteralExpression): boolean {
  const props = getRouteProps(route).map((prop) => prop.name.getText());
  const isPathless = getRoutePath(route)?.initializer.getText() === `''`;
  return isPathless && props.length === 3 && props.includes('providers') && props.includes('children');
}

/**
 * A route that lazy loads the component from the file it's imported from.
 */
export function generateComponentRoute(
  path: string,
  component: string,
  componentImport: string,
  ...routeFields: string[]
): string {
  const loadComponent = `loadComponent: () => import('${componentImport}').then((m) => m.${component})`;
  return generatePathRoute(path, loadComponent, ...routeFields);
}

export function generatePathRoute(path: string, ...routeFields: string[]): string {
  return generateRoute(`path: '${path}'`, ...routeFields);
}

export function generateRoute(...routeFields: string[]) {
  return `{
  ${routeFields.join(',\n  ')},
}`;
}

export type RoutePredicate = (route: ts.ObjectLiteralExpression) => boolean;

/**
 * Lazy loads the routes constant of the `to` routes file.
 */
export function generateLazyRoutesImport(tree: Tree, from: Path, to: Path): string {
  const path = normalize(importPath(from, to));
  const routesConst = findRoutesDeclaration(tree, to).name.getText();
  return `() => import('./${dirname(path)}/${basename(path)}').then((m) => m.${routesConst})`;
}

/**
 * @param routesPath full path to routes file
 * @param targetFile full path to file containing component or routes for the route
 */
export function addMissingChildRoutes(tree: Tree, routesPath: Path, targetFile: Path) {
  const routesDir = dirname(routesPath);
  if (isRootPlaygroundDir(routesDir)) {
    addRootRoute(tree, targetFile);
    return;
  }

  if (isBasePlaygroundDir(routesDir)) {
    addBaseRoute(tree, targetFile);
  }

  addMissingPaths(tree, routesPath, targetFile);
}

function addMissingPaths(tree: Tree, routesPath: Path, targetFile: Path) {
  const targetDir = dirname(targetFile);
  const relativePath = targetDir.replace(dirname(routesPath), '');
  const existingPathEnd = targetDir.indexOf(relativePath);
  let existingPath = normalize(targetDir.slice(0, existingPathEnd));
  const pathsToCheck = dirsToRoutePaths(relativePath);

  for (let i = 0; i < pathsToCheck.length; i++) {
    const routePathToCheck = pathsToCheck[i];
    const fullPathToCheck = join(existingPath, routePathToCheck);
    const pathPredicates = routePredicatesFromPath(tree, routesPath, fullPathToCheck);
    let routesArray = findRoutesArray(tree, routesPath);

    let route = findRouteWithPath(routesArray, pathPredicates);
    if (!route) {
      const routesArrayToAddTo = getParentRouteChildren(tree, routesArray, routesPath, fullPathToCheck);
      addRoute(tree, routesPath, routesArrayToAddTo, generatePathRoute(routePathToCheck));
      routesArray = findRoutesArray(tree, routesPath);
      route = findRouteWithPath(routesArray, pathPredicates) as ts.ObjectLiteralExpression;
    }

    const allChecked = i === pathsToCheck.length - 1;
    if (allChecked) {
      return;
    }

    existingPath = fullPathToCheck;
    if (!getRouteChildren(route)) {
      addObjectProperty(tree, parseSourceFile(tree, routesPath), route, 'children: []');
    }
  }
}

function getParentRouteChildren(
  tree: Tree,
  routesArray: ts.ArrayLiteralExpression,
  routesPath: Path,
  targetDir: Path,
): ts.ArrayLiteralExpression {
  const predicates = routePredicatesFromPath(tree, routesPath, dirname(targetDir));
  const route = findRouteWithPath(routesArray, predicates) as ts.ObjectLiteralExpression;
  return getRouteChildren(route) as ts.ArrayLiteralExpression;
}

export function addRootRoute(tree: Tree, targetFile: Path) {
  const routesArray = findRoutesArray(tree, PLAYGROUND_ROUTES_PATH);
  if (findRouteWithPath(routesArray, [rootRoutePredicate(tree, targetFile)])) {
    return;
  }

  const lazyRoutesImport = generateLazyRoutesImport(tree, PLAYGROUND_ROUTES_PATH, getBaseRoutesPath(targetFile));
  const routeString = generatePathRoute('', `loadChildren: ${lazyRoutesImport}`);
  addRoute(tree, PLAYGROUND_ROUTES_PATH, routesArray, routeString);
}

export function addBaseRoute(tree: Tree, targetFile: Path) {
  const isLayout = isLayoutPath(targetFile);
  const baseRoutesPath = getBaseRoutesPath(targetFile);
  const routesArray = findRoutesArray(tree, baseRoutesPath);
  const baseRoute = findRouteWithPath(routesArray, [baseComponentPredicate(targetFile)]);
  if (baseRoute) {
    if (!getRouteChildren(baseRoute)) {
      addObjectProperty(tree, parseSourceFile(tree, baseRoutesPath), baseRoute, 'children: []');
    }
    return;
  }

  const baseComponent = isLayout ? LAYOUT_COMPONENT_CLASS : NO_LAYOUT_COMPONENT_CLASS;
  const baseComponentImport = isLayout ? LAYOUT_COMPONENT_IMPORT : NO_LAYOUT_COMPONENT_IMPORT;
  const routeString = generateComponentRoute('', baseComponent, baseComponentImport, `children: []`);
  addRoute(tree, baseRoutesPath, routesArray, routeString);
}

function getBaseRoutesPath(targetFile: Path): Path {
  return isLayoutPath(targetFile) ? LAYOUT_ROUTES_PATH : NO_LAYOUT_ROUTES_PATH;
}

export function addRoute(tree: Tree, routesPath: Path, routes: ts.ArrayLiteralExpression, route: string) {
  const source = parseSourceFile(tree, routesPath);
  const alreadyInRoutes = routes.getFullText().includes(route);
  if (alreadyInRoutes) {
    return;
  }

  addArrayElement(tree, source, routes, route);
}

export function findRoute(
  routesArray: ts.ArrayLiteralExpression,
  predicate: RoutePredicate,
): ts.ObjectLiteralExpression | undefined {
  const queue: ts.ObjectLiteralExpression[] = getRoutesFromArray(routesArray);

  while (queue.length > 0) {
    const route = queue.shift() as ts.ObjectLiteralExpression;
    if (predicate(route)) {
      return route;
    }

    const routeChildren = getRouteChildren(route);
    if (routeChildren) {
      queue.push(...getRoutesFromArray(routeChildren));
    }
  }

  return undefined;
}

/**
 * @param routesArray array to search in
 * @param predicates predicate for each level
 */
export function findRouteWithPath(
  routesArray: ts.ArrayLiteralExpression,
  predicates: RoutePredicate[],
): ts.ObjectLiteralExpression | undefined {
  const routes = getRoutesFromArray(routesArray);
  for (const route of routes) {
    const isMatch = predicates[0](route);
    const isLastMatch = isMatch && predicates.length === 1;
    if (!isMatch) {
      continue;
    }
    if (isLastMatch) {
      return route;
    }

    const children = getRouteChildren(route);
    const foundRoute = children && findRouteWithPath(children, predicates.slice(1));
    if (foundRoute) {
      return foundRoute;
    }
  }

  return undefined;
}

export function getRoutesFromArray(routesArray: ts.ArrayLiteralExpression): ts.ObjectLiteralExpression[] {
  return routesArray.elements.filter(
    (node) => node.kind === ts.SyntaxKind.ObjectLiteralExpression,
  ) as ts.ObjectLiteralExpression[];
}

export function getRouteChildren(route: ts.ObjectLiteralExpression): ts.ArrayLiteralExpression | undefined {
  const children = findRouteProp(route, 'children');

  if (children == null) {
    return undefined;
  }
  if (children.initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    throw new SchematicsException(`Expecting children to be an array.`);
  }

  return children.initializer as ts.ArrayLiteralExpression;
}

export function getRouteProps(route: ts.ObjectLiteralExpression): ts.PropertyAssignment[] {
  return route.properties.filter((prop) => prop.kind === ts.SyntaxKind.PropertyAssignment) as ts.PropertyAssignment[];
}

export function findRouteProp(route: ts.ObjectLiteralExpression, propName: string): ts.PropertyAssignment | undefined {
  return getRouteProps(route).find((prop) => prop.name.getText() === propName);
}

export function getRouteLoadChildren(route: ts.ObjectLiteralExpression): ts.PropertyAssignment | undefined {
  return findRouteProp(route, 'loadChildren');
}

export function getRouteComponent(route: ts.ObjectLiteralExpression): ts.PropertyAssignment | undefined {
  return findRouteProp(route, 'component') ?? findRouteProp(route, 'loadComponent');
}

/**
 * The class a route renders, from `component: X` or `loadComponent: () => import(...).then((m) => m.X)`.
 */
export function getRouteComponentClass(route: ts.ObjectLiteralExpression): string | undefined {
  const component = getRouteComponent(route);
  if (!component) {
    return undefined;
  }
  const text = component.initializer.getText();
  if (component.name.getText() === 'component') {
    return text;
  }
  return /\.then\(\(?\w+\)?\s*=>\s*\w+\.(\w+)\)\s*$/.exec(text)?.[1];
}

export function getRoutePath(route: ts.ObjectLiteralExpression): ts.PropertyAssignment | undefined {
  return findRouteProp(route, 'path');
}

/**
 * Returns array of route paths relative to playground.
 */
export function dirsToRoutePaths(dirPath: string): string[] {
  return dirPath.split(NormalizedSep).filter((dir) => dir);
}

/**
 * Returns predicate bound to array of predicates which will check route and it's children to conform routing path
 * for a given file path.
 * @param tree
 * @param routesPath full path to routes file
 * @param targetDirPath full path to directory containing component or routes file for the route
 */
export function routePredicatesFromPath(tree: Tree, routesPath: Path, targetDirPath: Path): RoutePredicate[] {
  const routesDir = dirname(routesPath);
  if (isRootPlaygroundDir(routesDir)) {
    return [rootRoutePredicate(tree, targetDirPath)];
  }

  const predicates = new Array<RoutePredicate>();
  if (isBasePlaygroundDir(routesDir)) {
    predicates.push(baseComponentPredicate(targetDirPath));
  }
  const relativeToRoutesFile = targetDirPath.replace(routesDir, '');
  const routePaths = dirsToRoutePaths(relativeToRoutesFile);
  for (const path of routePaths) {
    predicates.push((route: ts.ObjectLiteralExpression) => pathRoutePredicate(path, route));
  }

  return predicates;
}

export function pathRoutePredicate(routePath: string, route: ts.ObjectLiteralExpression): boolean {
  const path = getRoutePath(route);
  return !!path && path.initializer.getText() === `'${routePath}'`;
}

export function componentRoutePredicate(componentClass: string, route: ts.ObjectLiteralExpression): boolean {
  return getRouteComponentClass(route) === componentClass;
}

export function lazyRoutesPredicate(lazyRoutesImport: string, route: ts.ObjectLiteralExpression): boolean {
  const loadChildren = getRouteLoadChildren(route);
  return !!loadChildren && normalizeCode(loadChildren.initializer.getText()) === normalizeCode(lazyRoutesImport);
}

/**
 * Formatting-insensitive comparison of generated code: ignores whitespace and
 * the optional parentheses around a single arrow function parameter.
 */
function normalizeCode(code: string): string {
  return code.replace(/\s+/g, '').replace(/\((\w+)\)=>/g, '$1=>');
}

export function baseComponentPredicate(path: Path): RoutePredicate {
  const rootComponentClass = isLayoutPath(path) ? LAYOUT_COMPONENT_CLASS : NO_LAYOUT_COMPONENT_CLASS;
  return (route: ts.ObjectLiteralExpression) => componentRoutePredicate(rootComponentClass, route);
}

export function rootRoutePredicate(tree: Tree, path: Path): RoutePredicate {
  const lazyRoutesImport = generateLazyRoutesImport(tree, PLAYGROUND_ROUTES_PATH, getBaseRoutesPath(path));

  return (route: ts.ObjectLiteralExpression) => lazyRoutesPredicate(lazyRoutesImport, route);
}

export function isLazyRoute(route: ts.ObjectLiteralExpression): boolean {
  return !!getRouteLoadChildren(route);
}

export function isComponentRoute(route: ts.ObjectLiteralExpression): boolean {
  return !!getRouteComponent(route);
}
