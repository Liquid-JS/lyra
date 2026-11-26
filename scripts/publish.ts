import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

interface Manifest {
    name?: string
    version?: string
    private?: boolean
}

const shell = process.platform === 'win32'

const readManifests = (root: string) =>
    readdirSync(root)
        .map((dir) => ({ dir: join(root, dir), file: join(root, dir, 'package.json') }))
        .filter(({ file }) => existsSync(file))
        .map(({ dir, file }) => ({ dir, ...(JSON.parse(readFileSync(file, 'utf8')) as Manifest) }))

// Whether the registry already has this version. Packages the release didn't change keep a version that's published.
const isPublished = (name: string, version: string) => {
    const result = spawnSync('npm', ['view', `${name}@${version}`, 'version'], { encoding: 'utf8', shell })
    if (result.status === 0) {
        return result.stdout.trim() === version
    }
    // A package that was never published.
    if (result.stderr.includes('E404')) {
        return false
    }
    throw new Error(`Couldn't check ${name}@${version} on the registry:\n${result.stderr}`)
}

// Whether the registry has a stable version of the package; until it does, `latest` follows its prereleases.
const hasStableRelease = (name: string) => {
    const result = spawnSync('npm', ['view', name, 'versions', '--json'], { encoding: 'utf8', shell })
    if (result.status !== 0) {
        if (result.stderr.includes('E404')) {
            return false
        }
        throw new Error(`Couldn't read ${name}'s versions on the registry:\n${result.stderr}`)
    }
    const versions = JSON.parse(result.stdout) as string | string[]
    return (Array.isArray(versions) ? versions : [versions]).some((version) => !version.includes('-'))
}

/**
 * Publishes every built package under dist/ whose version isn't on the registry yet, so a release that changed only
 * some packages publishes those. Extra arguments are forwarded to `npm publish`, so `yarn publish -- --dry-run`
 * validates a release without uploading anything.
 *
 * A prerelease is tagged `prerelease`; while a package has no stable release, `latest` points at its newest
 * prerelease too, as npm installs `latest` wherever it fits the asked range: else `ng add` would add the first
 * prerelease of the other packages.
 *
 * Every build must have its package's current version, so a build from before the release isn't published.
 */
const sources = new Map(readManifests('packages').map((manifest) => [manifest.name, manifest.version]))
const builds = readManifests('dist').filter(({ name, private: isPrivate }) => !isPrivate && name?.startsWith('@liquid-js/'))

const stale = builds.filter(({ name, version }) => sources.get(name) !== version)
if (stale.length) {
    const list = stale.map(({ dir, name, version }) => `  ${dir}: ${name}@${version}, the package is at ${sources.get(name) ?? 'nothing'}`)
    console.error(`These builds don't match their packages; build them again before publishing:\n${list.join('\n')}`)
    process.exit(1)
}

for (const { dir, name, version } of builds) {
    if (!name || !version) {
        continue
    }
    if (isPublished(name, version)) {
        console.log(`Skipping ${name}@${version}, already published`)
        continue
    }
    const args = process.argv.slice(2)
    const prerelease = version.includes('-')
    console.log(`Publishing ${name}@${version} from ${dir}`)
    execFileSync('npm', ['publish', '--access', 'public', ...(prerelease && !args.includes('--tag') ? ['--tag', 'prerelease'] : []), ...args], { cwd: dir, stdio: 'inherit', shell })
    if (prerelease && !args.includes('--dry-run') && !hasStableRelease(name)) {
        execFileSync('npm', ['dist-tag', 'add', `${name}@${version}`, 'latest'], { stdio: 'inherit', shell })
    }
}
