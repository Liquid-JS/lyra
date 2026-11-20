import * as ts from 'typescript';
import { dirname, join, normalize, Path } from '@angular-devkit/core';
import { SchematicsException, Tree, Rule } from '@angular-devkit/schematics';
import { parseSourceFile } from '@angular/cdk/schematics';
import {
  addTrailingCommas,
  applyReplaceChange,
  findDeclarationByIdentifier,
  findRoutesArray,
  getRouteChildren,
  getRouteComponentClass,
  getRouteLoadChildren,
  getRoutePath,
  getRoutesFromArray,
  isComponentRoute,
  isLazyRoute,
  lazyImportToFilePath,
  PLAYGROUND_ROUTES_PATH,
  removePropsQuotes,
  singleQuotes,
  splitClassName,
  trimQuotes,
} from '../utils/index.js';

const COMPONENTS_LIST_FILE_PATH = normalize('/packages/playground/src/app/playground-components.ts');
const COMPONENTS_VARIABLE_NAME = 'PLAYGROUND_COMPONENTS';

interface ComponentLink {
  path: string;
  name?: string;
  component?: string;
  link?: string;
  children?: ComponentLink[];
}

export function playgroundComponents(): Rule {
  return generateComponentsList;
}

function generateComponentsList(tree: Tree) {
  const componentsListFile = parseSourceFile(tree, COMPONENTS_LIST_FILE_PATH);
  const componentsListArray = getComponentsListArray(componentsListFile);
  const routes = removeRoutesWithoutPath(findRoutesInFile(tree, PLAYGROUND_ROUTES_PATH));
  updateComponentsFile(tree, componentsListFile, componentsListArray, routes);
}

function getComponentsListArray(fileSource: ts.SourceFile): ts.ArrayLiteralExpression {
  const listDeclaration = findDeclarationByIdentifier(fileSource, COMPONENTS_VARIABLE_NAME);
  if (!listDeclaration) {
    throw new SchematicsException(`Error in ${COMPONENTS_LIST_FILE_PATH}. Can't find components list variable.`);
  }
  const initializer = (listDeclaration as ts.VariableDeclaration).initializer;
  if (!initializer || initializer.kind !== ts.SyntaxKind.ArrayLiteralExpression) {
    throw new SchematicsException(`Error in ${COMPONENTS_LIST_FILE_PATH}. List should be initialized with array.`);
  }

  return initializer as ts.ArrayLiteralExpression;
}

function findRoutesInFile(tree: Tree, routesPath: Path): ComponentLink[] {
  const routes = getRoutesFromArray(findRoutesArray(tree, routesPath));
  return parseRoutes(tree, routesPath, routes);
}

function parseRoutes(tree: Tree, routesPath: Path, routeEntries: ts.ObjectLiteralExpression[]): ComponentLink[] {
  const foundRoutes = new Array<ComponentLink>();
  const routesWithPath = routeEntries
    .filter((r) => r.properties.length > 0)
    .filter((r) => !!getRoutePath(r))
    .filter((r) => isLazyRoute(r) || isComponentRoute(r));

  for (const route of routesWithPath) {
    const component = getComponentRoute(route);
    const routeChildren = getChildRoutes(tree, routesPath, route);
    const lazyChildren = getLazyRoutes(tree, routesPath, route);
    const children = routeChildren.concat(lazyChildren);
    const routePath = trimQuotes((getRoutePath(route) as ts.PropertyAssignment).initializer.getText());
    foundRoutes.push({ path: routePath, component, children });
  }

  return foundRoutes;
}

function getComponentRoute(route: ts.ObjectLiteralExpression): string | undefined {
  return getRouteComponentClass(route);
}

function getChildRoutes(tree: Tree, routesPath: Path, route: ts.ObjectLiteralExpression): ComponentLink[] {
  const childrenProp = getRouteChildren(route);
  if (childrenProp) {
    return parseRoutes(tree, routesPath, getRoutesFromArray(childrenProp));
  }
  return [];
}

function getLazyRoutes(tree: Tree, routesPath: Path, route: ts.ObjectLiteralExpression): ComponentLink[] {
  const loadChildren = getRouteLoadChildren(route);
  if (loadChildren) {
    const lazyRoutesPath = join(dirname(routesPath), lazyImportToFilePath(loadChildren.initializer.getText()));
    return findRoutesInFile(tree, lazyRoutesPath);
  }
  return [];
}

function removeRoutesWithoutPath(routes: ComponentLink[], startPath: string = ''): ComponentLink[] {
  const routesWithPath = new Array<ComponentLink>();

  for (const { path, component, children } of routes) {
    const fullPath = path ? startPath + '/' + path : startPath;
    let routeChildren;
    if (children) {
      routeChildren = removeRoutesWithoutPath(children, fullPath);
    }

    const toAdd = new Array<ComponentLink>();
    if (path) {
      const link = component ? fullPath : undefined;
      const name = component ? splitClassName(component) : undefined;
      const childRoutes = routeChildren && routeChildren.length ? routeChildren : undefined;
      toAdd.push({ path, link, component, name, children: childRoutes });
    } else if (routeChildren) {
      toAdd.push(...routeChildren);
    }

    routesWithPath.push(...toAdd);
  }

  return routesWithPath;
}

function updateComponentsFile(
  tree: Tree,
  componentsListFile: ts.SourceFile,
  list: ts.ArrayLiteralExpression,
  routes: ComponentLink[],
) {
  const pos = list.getFullStart();
  const endPos = pos + list.getFullText().length;
  const oldText = componentsListFile.getFullText().slice(pos, endPos);
  const newText = generateRoutesString(routes);

  applyReplaceChange(tree, COMPONENTS_LIST_FILE_PATH, { pos, oldText, newText });
}

function generateRoutesString(routes: ComponentLink[]): string {
  const jsonRoutes = JSON.stringify(routes, null, 2);

  return ` ${addTrailingCommas(removePropsQuotes(singleQuotes(jsonRoutes)))}`;
}
