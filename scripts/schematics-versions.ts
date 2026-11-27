import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Writes the version each Lyra package has in this build beside core's compiled schematics, for `ng add` to add the
 * other packages at it. A release only bumps the packages it changes, so they don't share core's version; and a range
 * of the whole major line would let npm install whatever its `latest` tag points at.
 */
const versions: Record<string, string> = {}
for (const dir of readdirSync('packages')) {
    const file = join('packages', dir, 'package.json')
    if (!existsSync(file)) {
        continue
    }
    const { name, version, private: isPrivate } = JSON.parse(readFileSync(file, 'utf8')) as { name?: string, version?: string, private?: boolean }
    if (name?.startsWith('@liquid-js/lyr-') && version && !isPrivate) {
        versions[name] = version
    }
}
writeFileSync(join('dist', 'core', 'schematics', 'lyra-packages.json'), `${JSON.stringify(versions, undefined, 4)}\n`)
