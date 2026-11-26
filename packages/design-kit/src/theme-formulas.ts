import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..', '..')
const prebuilt = join(root, 'dist', 'core', 'styles', 'prebuilt')

/** The themes Lyra builds, e.g. dark, which a theme can start from, as in the Theme Editor. */
export function builtThemes(): string[] {
    return readdirSync(prebuilt)
        .map((file) => /^(.+)-custom-properties\.css$/.exec(file)?.[1])
        .filter((theme): theme is string => !!theme && theme !== 'components')
}

/**
 * The theme's variables as it defines them, e.g. `calc(var(--border-radius) * 3)`, from its compiled CSS, for design
 * tools to work out a theme's values as the browser does.
 */
export function themeFormulas(theme: string): Record<string, string> {
    const file = join(prebuilt, `${theme}-custom-properties.css`)
    let css: string
    try {
        css = readFileSync(file, 'utf8')
    } catch {
        throw new Error(`No compiled theme at ${file}: run \`yarn build\` first`)
    }
    const block = new RegExp(`\\.nb-theme-${theme}\\{([^}]*)\\}`).exec(css)?.[1] ?? ''
    const found: Record<string, string> = {}
    for (const declaration of block.split(';')) {
        const at = declaration.indexOf(':')
        if (declaration.trim().startsWith('--') && at > 0) {
            found[declaration.slice(0, at).trim().slice(2)] = declaration.slice(at + 1).trim()
        }
    }
    return found
}
