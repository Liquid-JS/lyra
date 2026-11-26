import sketch = require('sketch')

import type { FileColour, FileLayer } from './file-format.ts'

/**
 * A path as the same file has it however it's reached: Sketch gives a path encoded, e.g. spaces as `%20`, and macOS's
 * `/tmp`, `/var` and `/etc` are links to `/private/…`, which Sketch gives either way.
 */
export const samePath = (path: string): string => decodeURIComponent(path).replace(/^\/private\/(tmp|var|etc)\//, '/$1/')

/** An open document by its path, or by its ID: copies of a file share its ID, so a path finds the right one. */
export function openDocument(pathOrId: string): sketch.Document {
    const opened = sketch.getDocuments()
    const wanted = samePath(pathOrId)
    const found =
        opened.find((candidate) => candidate.path && samePath(String(candidate.path)) === wanted) ??
        opened.find((candidate) => candidate.id === pathOrId)
    if (!found) {
        throw new Error(`No open document ${pathOrId}`)
    }
    return found
}

/** How the scripts name a document: by its path, as copies of a file share its ID; by its ID before it's saved. */
export const documentName = (doc: sketch.Document): string => (doc.path ? decodeURIComponent(String(doc.path)) : doc.id)

/**
 * Gives Sketch a turn every quarter of a second, for a long script to await as it goes. Sketch frees what a script's
 * calls leave behind, such as the layouts a change works out, only between its turns: one long turn over the whole kit
 * holds gigabytes until it ends, enough to run a Mac out of memory.
 */
export function pacer(): () => Promise<void> {
    let turnStarted = Date.now()
    return async () => {
        if (Date.now() - turnStarted > 250) {
            await new Promise<void>((resolve) => setTimeout(resolve, 0))
            turnStarted = Date.now()
        }
    }
}

/** A layer and everything in it as the file format keeps it, in one call; see file-format.ts. */
export const fileFormatOf = (layer: sketch.Layer): FileLayer => sketch.export(layer, { formats: 'json', output: false }) as FileLayer

export const isStack = (data: FileLayer): boolean => data.groupLayout?._class === 'MSImmutableFlexGroupLayout'

/** A layer's setting as the file format keeps it: under the identifier of the plugin or script that wrote it. */
export function settingOf<T>(data: FileLayer, key: string): T | undefined {
    const info = data.userInfo ?? {}
    const owner = Object.keys(info).find((candidate) => info[candidate]?.[key] !== undefined)
    const value = owner ? info[owner]?.[key] : undefined
    return (typeof value === 'string' ? JSON.parse(value) : value) as T | undefined
}

/** A colour of the file format as `#rrggbbaa`, as the API gives colours. */
export const hexOf = (colour: FileColour): string => `#${[colour.red, colour.green, colour.blue, colour.alpha].map((channel) => Math.round(channel * 255).toString(16).padStart(2, '0')).join('')}`

/** A layer's children, for a layer that has any. */
export const childrenOf = (layer: sketch.Layer | sketch.Page): sketch.Layer[] => (layer as Partial<sketch.Group>).layers ?? []

/**
 * Whether a colour variable, style or symbol is the document's own, rather than a copy of a library's: a design that
 * uses the kit as a library has copies that follow the kit's.
 */
export const isLocal = (item: { getLibrary(): sketch.Library | null }): boolean => !item.getLibrary()
