import { createRequire } from 'node:module'
import {
    getProjectFromWorkspace,
    getProjectTargetOptions,
    getAppModulePath,
    getProjectMainFile
} from '@angular/cdk/schematics'
import { Tree } from '@angular-devkit/schematics'
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing'

import { getWorkspace } from '@schematics/angular/utility/workspace'
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema'
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema'

import { lyraPackageRange } from '../util/package.js'
import { Schema as NgAddOptions } from './schema.js'

const require = createRequire(import.meta.url)

const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '7.0.0'
}

const defaultAppOptions: ApplicationOptions = {
    name: 'app',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: Style.Scss,
    skipTests: false,
    skipPackageJson: false,
    standalone: false
}

const EXPECTED_STYLES_SCSS = `@use 'themes' as *;

@use '@liquid-js/lyr-core/styles/globals' as *;

@include nb-install() {
  @include nb-theme-global();
};
`

const EXPECTED_THEME_SCSS = `@forward '@liquid-js/lyr-core/styles/theming';
@use '@liquid-js/lyr-core/styles/theming' as *;
@use '@liquid-js/lyr-core/styles/themes/default';

$nb-themes: nb-register-theme((

  // add your variables here like:

  // color-primary-100: #f2f5ff,
  // color-primary-200: #cedcfb,
  // color-primary-300: #a0baf5,
  // color-primary-400: #5c89e4,
  // color-primary-500: #3469d1,
  // color-primary-600: #2955b1,
  // color-primary-700: #1e4396,
  // color-primary-800: #16347a,
  // color-primary-900: #0c225b,

), default, default);
`

async function createTestWorkspace(runner: SchematicTestRunner, appOptions: Partial<ApplicationOptions> = {}) {
    const workspace: UnitTestTree = await runner.runExternalSchematic(
        '@schematics/angular',
        'workspace',
        workspaceOptions
    )
    const options = { ...defaultAppOptions, ...appOptions }
    return runner.runExternalSchematic('@schematics/angular', 'application', options, workspace)
}

function getPackageDependencies(tree: Tree): any {
    const packageJson = JSON.parse(tree.readText('/package.json'))
    return packageJson.dependencies
}

async function getAppModuleContent(tree: UnitTestTree): Promise<string> {
    const workspace = await getWorkspace(tree)
    const project = getProjectFromWorkspace(workspace, 'app')
    const appModulePath = getAppModulePath(tree, getProjectMainFile(project))
    return tree.readContent(appModulePath)
}

describe('lyraPackageRange', () => {
    it('should start at the version the package had in core\'s build', () => {
        const versions = require('../lyra-packages.json')
        expect(lyraPackageRange('@liquid-js/lyr-icons')).toBe(`^${versions['@liquid-js/lyr-icons']}`)
    })

    it('should give a packed build\'s tarball relative to the project', () => {
        // The build's versions, as `require` keeps them; a build packed to try it records its tarballs' paths.
        const versions = require('../lyra-packages.json')
        versions['@liquid-js/lyr-packed'] = `file:${process.cwd()}/../packages/lyr-packed.tgz`
        try {
            expect(lyraPackageRange('@liquid-js/lyr-packed')).toBe('file:../packages/lyr-packed.tgz')
        } finally {
            delete versions['@liquid-js/lyr-packed']
        }
    })

    it('should throw for a package the build has no version of', () => {
        expect(() => lyraPackageRange('@liquid-js/lyr-nothing')).toThrow()
    })
})

describe('ng-add', () => {
    let runner: SchematicTestRunner
    let appTree: Tree

    function runNgAddSchematic(options: Partial<NgAddOptions> = {}) {
        return runner.runSchematic('ng-add', { project: 'app', ...options }, appTree)
    }

    function runSetupSchematic(options: Partial<NgAddOptions> = {}) {
        return runner.runSchematic('setup', { project: 'app', ...options }, appTree)
    }

    function runPostInstallSchematic(options: Partial<NgAddOptions> = {}) {
        return runner.runSchematic('post-install', { project: 'app', ...options }, appTree)
    }

    beforeEach(async () => {
        const collectionPath = require.resolve('../collection.json')
        runner = new SchematicTestRunner('schematics', collectionPath)

        appTree = await createTestWorkspace(runner)
    })

    describe('ng-add', () => {
        let tree: UnitTestTree

        beforeEach(async () => {
            tree = await runNgAddSchematic()
        })

        it('should add @angular/cdk in package.json', () => {
            const dependencies = getPackageDependencies(tree)
            const angularCdkVersion = require('../../package.json').peerDependencies['@angular/cdk']

            expect(dependencies['@angular/cdk']).toBeDefined()
            expect(dependencies['@angular/cdk']).toBe(angularCdkVersion)
        })

        it('should add @liquid-js/lyr-core in package.json', () => {
            const dependencies = getPackageDependencies(tree)
            const lyraVersion = require('../../package.json').version

            expect(dependencies['@liquid-js/lyr-core']).toBeDefined()
            expect(dependencies['@liquid-js/lyr-core']).toBe(lyraVersion)
        })

        it('should add @liquid-js/lyr-icons in package.json, from the version it had in core\'s build', async () => {
            let dependencies = getPackageDependencies(tree)
            // A release only bumps the packages it changes, so the icons may not have core's version.
            const iconsVersion = `^${require('../../../../packages/icons/package.json').version}`

            expect(dependencies['@liquid-js/lyr-icons']).toBeDefined()
            expect(dependencies['@liquid-js/lyr-icons']).toBe(iconsVersion)

            const updatedTree = await runPostInstallSchematic()
            dependencies = getPackageDependencies(updatedTree)

            // The icons ship with @liquid-js/lyr-icons.
            expect(dependencies['eva-icons']).toBeUndefined()
        })
    })

    it('should register NbThemeModule.forRoot()', async () => {
        const tree = await runSetupSchematic()
        const appModuleContent = await getAppModuleContent(tree)
        expect(appModuleContent).toContain('NbThemeModule.forRoot({ name: \'default\' })')
    })

    it('should register NbThemeModule with specified theme', async () => {
        const tree = await runSetupSchematic({ theme: 'cosmic' })
        const appModuleContent = await getAppModuleContent(tree)

        expect(appModuleContent).toContain('NbThemeModule.forRoot({ name: \'cosmic\' })')
    })

    it('should register NbLayoutModule', async () => {
        const tree = await runSetupSchematic()
        const appModuleContent = await getAppModuleContent(tree)

        expect(appModuleContent).toContain('NbLayoutModule')
    })

    it('should create AppRoutingModule if no Router already registered', async () => {
        const tree = await runSetupSchematic()
        const appModuleContent = await getAppModuleContent(tree)

        expect(appModuleContent).toContain('AppRoutingModule')
        expect(tree.files).toContain('/projects/app/src/app/app-routing.module.ts')
    })

    it('should register inline theme if no theme already registered', async () => {
        const tree = await runSetupSchematic({ customization: false })
        const workspace = await getWorkspace(tree)
        const project = getProjectFromWorkspace(workspace, 'app')
        const styles = getProjectTargetOptions(project, 'build')['styles']

        expect(styles).toContain('./node_modules/@liquid-js/lyr-core/styles/prebuilt/default.css')
    })

    it('should raise the initial budget for the theme\'s CSS, keeping higher ones', async () => {
        const raised = JSON.parse((await runSetupSchematic()).readContent('/angular.json'))
        const budgets = raised.projects.app.architect.build.configurations.production.budgets
        expect(budgets.find((budget: { type: string }) => budget.type === 'initial')).toMatchObject({ maximumWarning: '2mb', maximumError: '3mb' })

        appTree = await createTestWorkspace(runner)
        const workspace = JSON.parse(appTree.readText('/angular.json'))
        workspace.projects.app.architect.build.configurations.production.budgets = [{ type: 'initial', maximumWarning: '4mb', maximumError: '1mb' }]
        appTree.overwrite('/angular.json', JSON.stringify(workspace))
        const kept = JSON.parse((await runSetupSchematic()).readContent('/angular.json'))
        expect(kept.projects.app.architect.build.configurations.production.budgets[0]).toMatchObject({ maximumWarning: '4mb', maximumError: '3mb' })
    })

    it('should create theme.scss and plug it into the project', async () => {
        appTree = await createTestWorkspace(runner, { style: Style.Scss })
        const tree = await runSetupSchematic({ customization: true })
        const styles = tree.readContent('/projects/app/src/styles.scss')
        const themes = tree.readContent('/projects/app/src/themes.scss')

        expect(styles).toContain(EXPECTED_STYLES_SCSS)
        expect(themes).toContain(EXPECTED_THEME_SCSS)
    })

    it('should throw error if adding scss themes in css project', async () => {
        appTree = await createTestWorkspace(runner, { style: Style.Css })

        await expect(runSetupSchematic({ customization: true })).rejects.toThrow()
    })

    it('should wrap the root component template in nb-layout', async () => {
        const tree = await runSetupSchematic()
        const template = tree.readContent('/projects/app/src/app/app.html')

        expect(template).toMatch(/^<nb-layout>/)
        expect(template).toContain('<nb-layout-column>')
    })

    describe('standalone app', () => {
        const appPath = '/projects/app/src/app/app.ts'
        const appConfigPath = '/projects/app/src/app/app.config.ts'
        const mainPath = '/projects/app/src/main.ts'

        beforeEach(async () => {
            appTree = await createTestWorkspace(runner, { standalone: true })
        })

        it('should provide the theme in the app config', async () => {
            const tree = await runSetupSchematic()
            const appConfig = tree.readContent(appConfigPath)

            expect(appConfig).toContain('provideNbTheme({ name: \'default\' })')
            expect(appConfig).toMatch(/import \{ provideNbTheme \} from '@liquid-js\/lyr-core';/)
        })

        it('should provide the specified theme', async () => {
            const tree = await runSetupSchematic({ theme: 'cosmic' })

            expect(tree.readContent(appConfigPath)).toContain('provideNbTheme({ name: \'cosmic\' })')
        })

        it('should provide the icons', async () => {
            const tree = await runSetupSchematic()
            const appConfig = tree.readContent(appConfigPath)

            expect(appConfig).toContain('provideNbIcons()')
            expect(appConfig).toMatch(/import \{ provideNbIcons \} from '@liquid-js\/lyr-icons';/)
        })

        it('should provide the router if the app has none', async () => {
            const tree = await runSetupSchematic()
            const appConfig = tree.readContent(appConfigPath)

            expect(appConfig).toContain('provideRouter([])')
            expect(appConfig).toMatch(/import \{ provideRouter \} from '@angular\/router';/)
        })

        it('should keep the router the app provides', async () => {
            appTree = await createTestWorkspace(runner, { standalone: true, routing: true })
            const tree = await runSetupSchematic()
            const appConfig = tree.readContent(appConfigPath)

            expect(appConfig).toContain('provideRouter(routes)')
            expect(appConfig).not.toContain('provideRouter([])')
        })

        it('should not register modules or create AppRoutingModule', async () => {
            const tree = await runSetupSchematic()

            expect(tree.readContent(appConfigPath)).not.toContain('Module')
            expect(tree.readContent(mainPath)).not.toContain('Module')
            expect(tree.files).not.toContain('/projects/app/src/app/app-routing.module.ts')
        })

        it('should add the providers to bootstrapApplication without an app config', async () => {
            appTree.overwrite(mainPath, `import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

bootstrapApplication(App)
  .catch((err) => console.error(err));
`)
            const tree = await runSetupSchematic()
            const main = tree.readContent(mainPath)

            expect(main).toContain('provideNbTheme({ name: \'default\' })')
            expect(main).toContain('provideNbIcons()')
            expect(main).toContain('provideRouter([])')
            expect(main).toContain('from \'@liquid-js/lyr-core\'')
        })

        it('should wrap the root component template in nb-layout', async () => {
            const tree = await runSetupSchematic()
            const template = tree.readContent('/projects/app/src/app/app.html')

            expect(template).toMatch(/^<nb-layout>/)
            expect(template).toContain('<nb-layout-header fixed>')
            expect(template).toContain('<nb-layout-column>')
            expect(template).toContain('<nb-layout-footer fixed>')
        })

        it('should wrap an inline template in nb-layout', async () => {
            appTree = await createTestWorkspace(runner, { standalone: true, inlineTemplate: true })
            const tree = await runSetupSchematic()
            const app = tree.readContent(appPath)

            expect(app).toMatch(/template: `\n {4}<nb-layout>/)
            expect(app).toContain('<h1>Hello, {{ title() }}</h1>')
            expect(app).toContain('NbLayoutComponent')
        })

        it('should import the layout components into the root component', async () => {
            const tree = await runSetupSchematic()
            const app = tree.readContent(appPath)

            expect(app).toContain(
                'imports: [NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbLayoutFooterComponent]'
            )
            expect(app).toMatch(new RegExp(
                'import \\{ NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbLayoutFooterComponent \\} ' +
        'from \'@liquid-js/lyr-core\';'
            ))
        })

        it('should keep the imports the root component has', async () => {
            appTree = await createTestWorkspace(runner, { standalone: true, routing: true })
            const tree = await runSetupSchematic()

            expect(tree.readContent(appPath)).toContain(
                'imports: [RouterOutlet, NbLayoutComponent, NbLayoutHeaderComponent, NbLayoutColumnComponent, NbLayoutFooterComponent]'
            )
        })

        it('should add an imports array to a root component without one', async () => {
            appTree.overwrite(appPath, appTree.readText(appPath).replace(/\n\s*imports: \[\],/, ''))
            const tree = await runSetupSchematic()

            expect(tree.readContent(appPath)).toMatch(/templateUrl: '\.\/app\.html',\n {2}imports: \[NbLayoutComponent, /)
        })

        it('should not add the providers or imports twice', async () => {
            appTree = await runSetupSchematic({ customization: false })
            const tree = await runSetupSchematic({ customization: false })
            const appConfig = tree.readContent(appConfigPath)
            const app = tree.readContent(appPath)

            expect(appConfig.match(/provideNbTheme\(/g)).toHaveLength(1)
            expect(appConfig.match(/provideNbIcons\(/g)).toHaveLength(1)
            expect(appConfig.match(/provideRouter\(/g)).toHaveLength(1)
            expect(app.match(/NbLayoutComponent/g)).toHaveLength(2)
        })

        it('should leave the root component as it is without the layout', async () => {
            const app = appTree.readText(appPath)
            const template = appTree.readText('/projects/app/src/app/app.html')
            const tree = await runSetupSchematic({ layout: false })

            expect(tree.readContent(appPath)).toBe(app)
            expect(tree.readContent('/projects/app/src/app/app.html')).toBe(template)
        })
    })

})
