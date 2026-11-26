import { normalize, workspaces } from '@angular-devkit/core'
import { SchematicsException, Tree } from '@angular-devkit/schematics'
import { getWorkspace } from '@schematics/angular/utility/workspace'

/*
 * Workspace helpers the schematics use, here rather than from `@angular/cdk/schematics`: `ng add` installs the CDK
 * while it runs, and Node, having looked for the CDK before it was there, then can't import it.
 */

/** The project's definition from the workspace (`angular.json`); throws when there's no such project. */
export async function getProject(tree: Tree, projectName: string): Promise<workspaces.ProjectDefinition> {
    return projectOf(await getWorkspace(tree), projectName)
}

/** The named project of a workspace; throws when there's no such project. */
export function projectOf(workspace: workspaces.WorkspaceDefinition, projectName: string): workspaces.ProjectDefinition {
    const project = projectName ? workspace.projects.get(projectName) : undefined
    if (!project) {
        throw new SchematicsException(projectName ? `Could not find project in workspace: ${projectName}` : 'Project name is required.')
    }
    return project
}

/** The options of a target of the project, e.g. its `build`, to read or change; throws when it has none. */
export function getProjectTargetOptions(project: workspaces.ProjectDefinition, targetName: string): Record<string, unknown> {
    const options = project.targets.get(targetName)?.options
    if (!options) {
        throw new SchematicsException(`Cannot determine project target configuration for: ${targetName}.`)
    }
    return options
}

/** The project's main file: its build's `browser` with the application builder, `main` with the older ones. */
export function getProjectMainFile(project: workspaces.ProjectDefinition): string {
    const options = getProjectTargetOptions(project, 'build')
    const main = options['browser'] ?? options['main']
    if (typeof main !== 'string') {
        throw new SchematicsException(`Could not find the project main file inside of the workspace config (${project.sourceRoot})`)
    }
    return main
}

/** The project's global styles file with the extension: `styles.<extension>` if it has one, else the first such file. */
export function getProjectStyleFile(project: workspaces.ProjectDefinition, extension: string): string | undefined {
    const styles = getProjectTargetOptions(project, 'build')['styles']
    const files = (Array.isArray(styles) ? styles : [])
        .map((style: unknown) => (typeof style === 'string' ? style : (style as { input?: unknown } | null)?.input))
        .filter((path): path is string => typeof path === 'string')
    const found = files.find((path) => path === `styles.${extension}` || path.endsWith(`/styles.${extension}`)) ?? files.find((path) => path.endsWith(`.${extension}`))
    return found === undefined ? undefined : normalize(found)
}
