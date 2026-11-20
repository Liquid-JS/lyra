import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * Every package a workspace declares must be installed at exactly one version, so all workspaces share one
 * set of binaries and libraries. `yarn constraints` keeps the declared ranges equal, but it can't see what the
 * lockfile resolves transitively; this check covers that. Fix a reported duplicate with `resolutions` in the
 * root package.json.
 */
const root = resolve(import.meta.dirname, '..')
const packages = readdirSync(join(root, 'packages'), { withFileTypes: true }).filter((entry) => entry.isDirectory())
const manifests = ['package.json', ...packages.map((entry) => join('packages', entry.name, 'package.json'))]

const declared = new Set<string>()
for (const manifest of manifests) {
    let pkg: Record<string, Record<string, string> | undefined>
    try {
        pkg = JSON.parse(readFileSync(join(root, manifest), 'utf8'))
    } catch {
        continue
    }
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
        for (const [name, range] of Object.entries(pkg[field] ?? {})) {
            if (!range.startsWith('workspace:')) {
                declared.add(name)
            }
        }
    }
}

const output = execFileSync('yarn', ['info', '--all', '--recursive', '--name-only', '--json'], { cwd: root, encoding: 'utf8' })
const versions = new Map<string, Set<string>>()
for (const line of output.split('\n').filter(Boolean)) {
    const locator: string = JSON.parse(line)
    const match = /^(.+?)@npm:(.+)$/.exec(locator)
    if (match && declared.has(match[1])) {
        versions.set(match[1], (versions.get(match[1]) ?? new Set()).add(match[2]))
    }
}

const duplicates = [...versions].filter(([, found]) => found.size > 1)
for (const [name, found] of duplicates) {
    console.error(`${name} is installed at several versions: ${[...found].join(', ')}`)
}
if (duplicates.length) {
    console.error('Align them with "resolutions" in the root package.json.')
    process.exit(1)
}
