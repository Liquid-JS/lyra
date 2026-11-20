import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'

/**
 * Compiles the development schematics (playground generators, new-component)
 * and copies their JSON manifests and template files next to the compiled output.
 */
const root = join('tools', 'dev-schematics')
const out = join(root, 'dist')

rmSync(out, { recursive: true, force: true })
execFileSync(join('node_modules', '.bin', 'tsc'), ['-p', join(root, 'tsconfig.json')], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
})

for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) {
        continue
    }
    const source = join(entry.parentPath, entry.name)
    const rel = relative(root, source).split(sep).join('/')
    if (rel.startsWith('dist/') || !(rel.endsWith('.json') || rel.includes('/files/'))) {
        continue
    }
    const target = join(out, rel)
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(source, target)
}
