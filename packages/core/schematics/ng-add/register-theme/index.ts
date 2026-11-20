import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { isJsonObject, join, JsonArray, JsonValue, normalize, Path, workspaces } from '@angular-devkit/core';

import { createThemeContent, stylesContent } from './theme-content.js';
import { Schema } from '../schema.js';
import { getProject } from '../../util/index.js';
import { getProjectFromWorkspace, getProjectStyleFile, getProjectTargetOptions } from '@angular/cdk/schematics';
import { updateWorkspace, WorkspaceDefinition } from '@schematics/angular/utility';

/**
 * Creates `themes.scss`, where the chosen theme is registered with the project's own variables, and makes
 * `styles.scss` use it and install the theme globally. Throws when the project has no `styles.scss`: an SCSS theme
 * needs SCSS styles.
 */
export function registerCustomizableTheme(options: Schema) {
  return async (tree: Tree) => {
    const project = await getProject(tree, options.project);
    const stylesPath: string = getProjectStyleFile(project, 'scss') as string;

    if (!tree.exists(stylesPath)) {
      throwSCSSRequiredForCustomizableThemes();
    }

    createThemeSCSS(tree, options.theme, project.sourceRoot as string);
    insertThemeImportInStyles(tree, stylesPath);
  };
}

/** Adds the chosen theme's prebuilt CSS to the build target's styles in `angular.json`. */
export function registerPrebuiltTheme(options: Schema) {
  return updateWorkspace(async (workspace: WorkspaceDefinition) => {
    const project = getProjectFromWorkspace(workspace, options.project);

    const themePath = `./node_modules/@liquid-js/lyr-core/styles/prebuilt/${options.theme}.css`;

    addStyleToTarget(project, 'build', themePath);
  });
}

function createThemeSCSS(tree: Tree, theme: string, sourceRoot: string) {
  const themeContent: string = createThemeContent(theme);

  const customThemePath: Path = normalize(join(sourceRoot as Path, 'themes.scss'));
  tree.create(customThemePath, themeContent);
}

/** Puts the `@use` of `themes.scss` and the global install at the top of `styles.scss`. */
function insertThemeImportInStyles(tree: Tree, stylesPath: string) {
  const recorder = tree.beginUpdate(stylesPath).insertLeft(0, stylesContent);

  tree.commitUpdate(recorder);
}

/** Puts the style first in the target's styles, unless a Lyra theme is there already. */
function addStyleToTarget(project: workspaces.ProjectDefinition, targetName: string, stylesPath: string) {
  const targetOptions = getProjectTargetOptions(project, targetName);
  const styles = targetOptions['styles'];

  if (!styles) {
    targetOptions['styles'] = [stylesPath];
  } else if (Array.isArray(styles) && noLyraThemeIncluded(styles, stylesPath)) {
    styles.unshift(stylesPath);
  }
}

/** The path of a style entry: a string, or an object with the path as `input`; empty otherwise. */
function stylePath(style: JsonValue): string {
  if (typeof style === 'string') {
    return style;
  }
  return isJsonObject(style) && typeof style['input'] === 'string' ? style['input'] : '';
}

/** Whether the styles hold neither the given theme nor any other prebuilt Lyra theme. */
function noLyraThemeIncluded(styles: JsonArray, stylesPath: string): boolean {
  const existingStyles = styles.map(stylePath);
  const hasGivenTheme = existingStyles.some((s) => s.includes(stylesPath));
  const hasOtherTheme = existingStyles.some((s) => s.includes('@liquid-js/lyr-core/styles/prebuilt'));

  return !hasGivenTheme && !hasOtherTheme;
}

function throwSCSSRequiredForCustomizableThemes() {
  throw new SchematicsException('No scss root found. Customizable theme requires scss to be enabled in the project.');
}
