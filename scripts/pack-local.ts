import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * Packs the built packages as tarballs to try a build before it's released, e.g. in a test app:
 * `node scripts/pack-local.ts <folder>`, after `yarn build`. Each gets a version of its own, the package's with
 * `.local.<time>` after it, so nothing of npm's is taken for it, and core's `ng add` adds the other packages from
 * their tarballs in the folder. It changes the builds in `dist`, so build again before publishing.
 */
const root = resolve(import.meta.dirname, '..')
const folder = resolve(process.argv[2] ?? '')
if (!process.argv[2]) {
    console.error('Name the folder to pack into: node scripts/pack-local.ts <folder>')
    process.exit(1)
}
mkdirSync(folder, { recursive: true })

const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 12)
const packages = ['core', 'icons', 'auth', 'extras', 'date-fns', 'moment'].filter((name) => existsSync(join(root, 'dist', name, 'package.json')))
const tarballs: Record<string, string> = {}
for (const name of packages) {
    const file = join(root, 'dist', name, 'package.json')
    const manifest = JSON.parse(readFileSync(file, 'utf8')) as { name: string, version: string }
    manifest.version = `${manifest.version.replace(/\.local\.\d+$/, '')}.local.${stamp}`
    writeFileSync(file, `${JSON.stringify(manifest, undefined, 2)}\n`)
    tarballs[manifest.name] = join(folder, `${manifest.name.replace('@', '').replace('/', '-')}-${manifest.version}.tgz`)
}

// Core's `ng add` adds the other packages from these tarballs, rather than the registry.
const versions = join(root, 'dist', 'core', 'schematics', 'lyra-packages.json')
writeFileSync(versions, `${JSON.stringify(Object.fromEntries(Object.entries(tarballs).map(([name, tarball]) => [name, `file:${tarball}`])), undefined, 4)}\n`)

for (const name of packages) {
    execFileSync('npm', ['pack', '--pack-destination', folder], { cwd: join(root, 'dist', name), stdio: 'ignore', shell: process.platform === 'win32' })
}
console.log(Object.values(tarballs).join('\n'))
