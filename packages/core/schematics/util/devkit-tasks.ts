import { createRequire } from 'node:module'
import type * as Tasks from '@angular-devkit/schematics/tasks'

const require = createRequire(import.meta.url)

/**
 * The devkit's tasks, loaded as CommonJS: its `tasks` entry point is an export from devkit 22.3, and a directory
 * before, which an ES module can't import. The app's devkit may be either.
 */
export const { NodePackageInstallTask, RunSchematicTask } = require('@angular-devkit/schematics/tasks') as typeof Tasks
