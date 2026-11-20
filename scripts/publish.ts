import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Publishes every built package under dist/. Extra arguments are forwarded to `npm publish`,
 * so `yarn publish -- --dry-run` validates a release without uploading anything.
 */
for (const dir of readdirSync('dist')) {
    const manifest = join('dist', dir, 'package.json')
    if (!existsSync(manifest)) {
        continue
    }
    const { name, private: isPrivate } = JSON.parse(readFileSync(manifest, 'utf8'))
    if (isPrivate || !name?.startsWith('@liquid-js/')) {
        continue
    }
    console.log(`Publishing ${name} from dist/${dir}`)
    execFileSync('npm', ['publish', '--access', 'public', ...process.argv.slice(2)], {
        cwd: join('dist', dir),
        stdio: 'inherit',
        shell: process.platform === 'win32'
    })
}
