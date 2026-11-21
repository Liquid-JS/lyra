import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { NodePackageInstallTask, RunSchematicTask } from '../util/devkit-tasks.js'

import {
    addDependencyToPackageJson,
    addDevDependencyToPackageJson,
    getDevDependencyVersionFromPackageJson,
    getLyraPeerDependencyVersion,
    getLyraVersion,
    lyraVersionRange
} from '../util/package.js'
import { Schema } from './schema.js'
// Imported from `util/package` directly, not from `util`: the other utilities use `@angular/cdk/schematics` and
// `@schematics/angular`, which aren't installed yet at this step.

/** The `ng add` entry: adds the dependencies to `package.json`, installs them, then sets the project up. */
export function ngAdd(options: Schema): Rule {
    return runSetupSchematics(options)
}

function installMainPeerDependencies(tree: Tree) {
    const angularCliVersion = getDevDependencyVersionFromPackageJson(tree, '@angular/cli')
    const lyraVersion = getLyraVersion()
    const angularCdkVersion = getLyraPeerDependencyVersion('@angular/cdk')

    addDependencyToPackageJson(tree, '@angular/cdk', angularCdkVersion, true)
    addDependencyToPackageJson(tree, '@liquid-js/lyr-core', lyraVersion)
    addDependencyToPackageJson(tree, '@liquid-js/lyr-icons', lyraVersionRange(lyraVersion))

    addDevDependencyToPackageJson(tree, '@schematics/angular', angularCliVersion)
}

/**
 * Queues the package install, then the `post-install` schematic, then `setup`. The setup uses
 * `@angular/cdk/schematics` and `@schematics/angular`, which must be installed first, and tasks that depend on the
 * install task are the only way to run a schematic after it.
 */
function runSetupSchematics(options: Schema) {
    return (tree: Tree, context: SchematicContext) => {
        installMainPeerDependencies(tree)

        const installTaskId = context.addTask(new NodePackageInstallTask())
        const postInstallTaskId = context.addTask(new RunSchematicTask('post-install', options), [installTaskId])
        context.addTask(new RunSchematicTask('setup', options), [postInstallTaskId])
    }
}
