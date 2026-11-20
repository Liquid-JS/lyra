import { workspaces } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { getProjectFromWorkspace } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

/** The project's definition from the workspace (`angular.json`); throws when there's no such project. */
export async function getProject(tree: Tree, projectName: string): Promise<workspaces.ProjectDefinition> {
  const workspace = await getWorkspace(tree);
  return getProjectFromWorkspace(workspace, projectName);
}
