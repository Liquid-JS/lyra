import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * A theme value that names another variable, e.g. `tag-filled-primary-selected-background-color: color-primary-active`,
 * must name one a theme has: one that doesn't exists stays as its text, which browsers ignore, so a typo silently
 * drops the style (tags lost their selected background to `color-primary-actove`).
 */
const root = resolve(import.meta.dirname, '..')
const themes = join(root, 'packages/core/src/styles/themes')
const files = readdirSync(themes).filter((file) => /^_.*\.scss$/.test(file))

// `name: value` lines of the theme maps.
const entry = /^\s+([a-z0-9-]+):\s*(.+?),?\s*$/
// Words in values that look like variable names but are CSS.
const cssWords = new Set(['sans-serif', 'ui-monospace'])

const entries = files.flatMap((file) =>
    readFileSync(join(themes, file), 'utf8')
        .split('\n')
        .flatMap((line, index) => {
            const match = entry.exec(line)
            return match ? [{ file, line: index + 1, name: match[1], value: match[2] }] : []
        })
)
const names = new Set(entries.map(({ name }) => name))

const unknown = entries.flatMap(({ file, line, name, value }) =>
    (value.match(/(?<![\w#.(-])[a-z][a-z0-9]*(?:-[a-z0-9]+)+(?![\w(])/g) ?? [])
        .filter((reference) => !names.has(reference) && !cssWords.has(reference))
        .map((reference) => `${file}:${line} ${name}: ${reference} isn't a theme variable`)
)
for (const problem of unknown) {
    console.error(problem)
}
if (unknown.length) {
    process.exit(1)
}
