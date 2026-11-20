import { Tree } from '@angular-devkit/schematics'
import { dirname, join, normalize, workspaces } from '@angular-devkit/core'
import { getProjectMainFile, hasNgModuleImport } from '@angular/cdk/schematics'
import { getAppModulePath as getAngularAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils'
import { findAppConfig } from '@schematics/angular/utility/standalone/app_config'
import { resolveBootstrappedComponentData } from '@schematics/angular/utility/standalone/app_component'
import { findBootstrapApplicationCall } from '@schematics/angular/utility/standalone/util'

export function isImportedInMainModule(tree: Tree, project: workspaces.ProjectDefinition, moduleName: string): boolean {
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project))

    return hasNgModuleImport(tree, appModulePath, moduleName)
}

export function getAppModulePath(host: Tree, mainPath: string): string {
    return getAngularAppModulePath(host, mainPath)
}

/** Whether the project bootstraps a standalone component with `bootstrapApplication`, rather than an NgModule. */
export function isStandaloneProject(tree: Tree, project: workspaces.ProjectDefinition): boolean {
    return isStandaloneApp(tree, getProjectMainFile(project))
}

/**
 * Whether the root providers of a standalone app, in its app config or its `bootstrapApplication` call, mention any
 * of the given names.
 */
export function hasRootProvider(tree: Tree, project: workspaces.ProjectDefinition, names: string[]): boolean {
    const mainPath = getProjectMainFile(project)
    const bootstrapCall = findBootstrapApplicationCall(tree, mainPath)
    const appConfig = findAppConfig(bootstrapCall, tree, mainPath)
    const text = (appConfig?.node ?? bootstrapCall).getText()

    return names.some((name) => new RegExp(`\\b${name}\\b`).test(text))
}

/** The path of the component a standalone app bootstraps, if it's imported from a relative path that exists. */
export function getBootstrappedComponentPath(tree: Tree, project: workspaces.ProjectDefinition): string | undefined {
    const mainPath = getProjectMainFile(project)
    const importPath = resolveBootstrappedComponentData(tree, mainPath)?.componentImportPathInSameFile
    if (!importPath?.startsWith('.')) {
        return undefined
    }

    const componentPath = join(dirname(normalize(mainPath)), `${importPath}.ts`)
    return tree.exists(componentPath) ? componentPath : undefined
}
