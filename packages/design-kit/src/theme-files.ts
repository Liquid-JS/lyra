import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { inflateRawSync } from 'node:zlib'

/** The theme as the theme script records it in the document, `lyra-theme`. */
interface RecordedTheme {
    name: string
    id: string
    base: string
    variables: Record<string, string>
    css: string
    scss: string
}

/** A file in a ZIP archive, e.g. a `.sketch` document's `document.json`, read from its central directory. */
function readZipEntry(archive: Buffer, name: string): Buffer | undefined {
    // The end of the central directory: its signature, within the last 64 KiB and 22 bytes, its comment's room.
    let end = -1
    for (let candidate = archive.length - 22; candidate >= Math.max(0, archive.length - 65_557); candidate--) {
        if (archive.readUInt32LE(candidate) === 0x06054b50) {
            end = candidate
            break
        }
    }
    if (end < 0) {
        throw new Error('Not a ZIP archive, as a .sketch file is.')
    }
    const count = archive.readUInt16LE(end + 10)
    let at = archive.readUInt32LE(end + 16)
    for (let index = 0; index < count; index++) {
        const method = archive.readUInt16LE(at + 10)
        const compressed = archive.readUInt32LE(at + 20)
        const nameLength = archive.readUInt16LE(at + 28)
        const extraLength = archive.readUInt16LE(at + 30)
        const commentLength = archive.readUInt16LE(at + 32)
        const local = archive.readUInt32LE(at + 42)
        const entryName = archive.toString('utf8', at + 46, at + 46 + nameLength)
        if (entryName === name) {
            const dataAt = local + 30 + archive.readUInt16LE(local + 26) + archive.readUInt16LE(local + 28)
            const data = archive.subarray(dataAt, dataAt + compressed)
            return method === 8 ? inflateRawSync(data) : Buffer.from(data)
        }
        at += 46 + nameLength + extraLength + commentLength
    }
    return undefined
}

/** The theme a design records: its document's settings hold it under the plugin's identifier, or a script runner's. */
function recordedTheme(file: string): RecordedTheme {
    const document = readZipEntry(readFileSync(file), 'document.json')
    if (!document) {
        throw new Error(`${file} has no document.json, as a saved .sketch file has.`)
    }
    const { userInfo = {} } = JSON.parse(document.toString('utf8')) as { userInfo?: Record<string, Record<string, unknown>> }
    for (const settings of Object.values(userInfo)) {
        const value = settings['lyra-theme']
        if (value) {
            return (typeof value === 'string' ? JSON.parse(value) : value) as RecordedTheme
        }
    }
    throw new Error(`${file} records no theme: apply one with the kit's theme script, or Lyra › Apply theme, and save it.`)
}

/**
 * Writes the theme a design records, as the kit's theme script applied it, to files: the CSS over Lyra's prebuilt
 * theme, the Sass theme of its own and the variables as JSON, named by the theme's ID, e.g. `acme-theme.css`. It
 * reads the saved `.sketch` file, so Sketch needn't run, e.g. for a developer or an agent handed the design:
 *
 * ```sh
 * node theme-files.mjs "Design.sketch" src/theme
 * ```
 */
function main(file: string | undefined, outDir = '.') {
    if (!file) {
        console.error('Usage: node theme-files.mjs <design.sketch> [output folder]')
        process.exit(1)
    }
    const theme = recordedTheme(file)
    mkdirSync(outDir, { recursive: true })
    const written = {
        json: join(outDir, `${theme.id}-theme.json`),
        css: join(outDir, `${theme.id}-theme.css`),
        scss: join(outDir, `${theme.id}-theme.scss`)
    }
    writeFileSync(written.json, `${JSON.stringify({ name: theme.name, id: theme.id, base: theme.base, variables: theme.variables }, null, 2)}\n`)
    writeFileSync(written.css, theme.css.endsWith('\n') ? theme.css : `${theme.css}\n`)
    writeFileSync(written.scss, theme.scss.endsWith('\n') ? theme.scss : `${theme.scss}\n`)
    console.log(`${theme.name} from ${basename(file)}: ${Object.keys(theme.variables).length} variables → ${Object.values(written).join(', ')}`)
}

main(process.argv[2], process.argv[3])
