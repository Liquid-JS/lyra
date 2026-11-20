import { chain, Rule, Tree } from '@angular-devkit/schematics';
import { addRootProvider } from '@schematics/angular/utility';
import { getRouterModuleDeclaration } from '@schematics/angular/utility/ast-utils';
import {
  addModuleImportToRootModule,
  getProjectMainFile,
  parseSourceFile,
} from '@angular/cdk/schematics';
import { normalize, workspaces } from '@angular-devkit/core';

import { Schema } from '../schema.js';
import {
  getAppModulePath,
  getProject,
  hasRootProvider,
  isImportedInMainModule,
  isStandaloneProject,
} from '../../util/index.js';
import { appRoutingModuleContent } from './app-routing-module-content.js';

export function registerModules(options: Schema): Rule {
  if (!options.theme) {
    options.theme = 'default';
  }

  return async (tree: Tree) => {
    const project = await getProject(tree, options.project);

    if (isStandaloneProject(tree, project)) {
      return registerStandaloneProviders(options, project, tree);
    }

    return chain([
      registerLyraModules(options),
      registerRouterIfNeeded(options),
    ]);
  };
}

/**
 * Adds the Lyra providers, and the router `NbLayoutComponent` needs if the app has none, to the providers of
 * a standalone app: its app config, or its `bootstrapApplication` call.
 * */
function registerStandaloneProviders(options: Schema, project: workspaces.ProjectDefinition, tree: Tree): Rule {
  const rules = new Array<Rule>();

  if (!hasRootProvider(tree, project, ['provideNbTheme', 'NbThemeModule'])) {
    rules.push(addRootProvider(options.project, ({ code, external }) =>
      code`${external('provideNbTheme', '@liquid-js/lyr-core')}({ name: '${options.theme}' })`));
  }
  if (!hasRootProvider(tree, project, ['provideNbIcons', 'provideNbIconSet', 'NbIconsModule'])) {
    rules.push(addRootProvider(options.project, ({ code, external }) =>
      code`${external('provideNbIcons', '@liquid-js/lyr-icons')}()`));
  }
  if (!hasRootProvider(tree, project, ['provideRouter', 'RouterModule'])) {
    rules.push(addRootProvider(options.project, ({ code, external }) =>
      code`${external('provideRouter', '@angular/router')}([])`));
  }

  return chain(rules);
}

function registerLyraModules(options: Schema): Rule {
  return async (tree: Tree) => {
    const project = await getProject(tree, options.project);
    const themeModule = `NbThemeModule.forRoot({ name: '${options.theme}' })`;

    addModuleImportToRootModule(tree, themeModule, '@liquid-js/lyr-core', project);
    addModuleImportToRootModule(tree, 'NbLayoutModule', '@liquid-js/lyr-core', project);
    addModuleImportToRootModule(tree, 'NbIconsModule', '@liquid-js/lyr-icons', project);
  };
}

/** Creates and imports `AppRoutingModule` unless `AppModule` imports it or `RouterModule` already. */
function registerRouterIfNeeded(options: Schema): Rule {
  return async (tree: Tree) => {
    const project = await getProject(tree, options.project);

    if (shouldRegisterRouter(tree, project)) {
      await registerRoutingModule(tree, options.project);
    }
  };
}

function shouldRegisterRouter(tree: Tree, project: workspaces.ProjectDefinition): boolean {
  const appRoutingModuleAlreadyImported = isImportedInMainModule(tree, project, 'AppRoutingModule');

  const appModulePath = getAppModulePath(tree, getProjectMainFile(project));
  const routerModuleAlreadyImported = !!getRouterModuleDeclaration(parseSourceFile(tree, appModulePath));

  return !(appRoutingModuleAlreadyImported || routerModuleAlreadyImported);
}

async function registerRoutingModule(tree: Tree, projectName: string) {
  await registerAppRoutingModule(tree, projectName);
  await createAppRoutingModule(tree, projectName);
}

// The file has nothing to fill in, so it's a plain string rather than a schematic template.
async function createAppRoutingModule(tree: Tree, projectName: string) {
  const project = await getProject(tree, projectName);
  const appRoutingModulePath = normalize(`${project.sourceRoot}/app/app-routing.module.ts`);

  tree.create(appRoutingModulePath, appRoutingModuleContent);
}

async function registerAppRoutingModule(tree: Tree, projectName: string) {
  const project = await getProject(tree, projectName);
  addModuleImportToRootModule(tree, 'AppRoutingModule', './app-routing.module', project);
}
