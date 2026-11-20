import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { NodePackageInstallTask } from '../util/devkit-tasks.js'

/** Runs between the install and `setup`, for dependencies the installed packages turn out to need. */
export function postInstall(): Rule {
    return runPostInstallSchematics()
}

function runPostInstallSchematics() {
    // The icons ship with @liquid-js/lyr-icons, which ng-add adds; there's nothing more to add, only to install.
    return (_tree: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask())
    }
}
