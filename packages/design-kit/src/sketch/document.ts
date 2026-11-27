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

/**
 * The page a design's symbols mirrored for right to left are on, and the prefix of their names, e.g.
 * `Right to left/Button/Medium/Rectangle`.
 */
export const MIRRORED = 'Right to left'

/** The setting of a mirrored copy, a symbol's or a screen's, that says what it mirrors, by its ID. */
export const MIRROR_OF = 'lyra-mirror-of'

/** The end of a mirrored screen's name, e.g. `Home · Phone · RTL`. */
export const MIRRORED_BOARD = ' · RTL'

/** Whether a screen is a mirrored copy of another, for checking right to left rather than a screen of the design. */
export const isMirroredBoard = (board: sketch.Layer): boolean => typeof sketch.Settings.layerSettingForKey(board, MIRROR_OF) === 'string' || board.name.endsWith(MIRRORED_BOARD)

/** The kit's symbol a symbol is, or mirrors. */
export const unmirrored = (name: string): string => (name.startsWith(`${MIRRORED}/`) ? name.slice(MIRRORED.length + 1) : name)

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

/** A layer in a container by its ID, however deep. */
export const findLayer = (container: sketch.Layer, id: string): sketch.Layer | undefined => {
    for (const child of childrenOf(container)) {
        const found = child.id === id ? child : findLayer(child, id)
        if (found) {
            return found
        }
    }
    return undefined
}

/**
 * Which layer an override changes, and what of it, by the names of the layers on its way there, e.g.
 * `Tab 2/Title_stringValue`: the same in a symbol and in a copy or another size of it, whose layers have IDs of their
 * own. Each nested instance's symbol is the one the instance's overrides swap in, if any.
 */
export function overrideKeyOf(doc: sketch.Document, instance: sketch.SymbolInstance, override: sketch.Override): string | undefined {
    const ids = override.path.split('/')
    const names: string[] = []
    let master = instance.master
    for (let depth = 0; depth < ids.length && master; depth++) {
        const found = findLayer(master, ids[depth])
        if (!found) {
            return undefined
        }
        names.push(found.name)
        const path = ids.slice(0, depth + 1).join('/')
        const swap = instance.overrides.find((candidate) => candidate.property === 'symbolID' && candidate.path === path && !candidate.isDefault)
        master = swap ? doc.getSymbolMasterWithID(String(swap.value)) : (found as sketch.SymbolInstance).master
    }
    return `${names.join('/')}_${override.property}`
}

/** An override as a key and its value, to set on another instance, e.g. one of a copy of its symbol. */
export interface SavedOverride {
    key: string
    property: string
    value: unknown
    swatch?: sketch.Swatch
    depth: number
}

/** An instance's overrides that aren't its symbol's own values, swaps first, outermost first. */
export function savedOverrides(doc: sketch.Document, instance: sketch.SymbolInstance): SavedOverride[] {
    return instance.overrides
        .filter((override) => !override.isDefault)
        .map((override) => ({ key: overrideKeyOf(doc, instance, override) ?? '', property: override.property, value: override.value, swatch: override.swatchValue, depth: override.path.split('/').length }))
        .filter((override) => override.key)
        .sort((a, b) => Number(b.property === 'symbolID') - Number(a.property === 'symbolID') || a.depth - b.depth)
}

/**
 * Sets saved overrides on an instance, where it has a layer by the same names, e.g. after its symbol was swapped; the
 * symbols they swap in through `swapIn`, e.g. mirrored copies.
 */
export function restoreOverrides(doc: sketch.Document, instance: sketch.SymbolInstance, saved: SavedOverride[], swapIn = (master: sketch.SymbolMaster) => master): void {
    for (const { key, property, value, swatch } of saved) {
        const target = instance.overrides.find((override) => override.property === property && overrideKeyOf(doc, instance, override) === key)
        if (!target) {
            continue
        }
        if (property === 'symbolID') {
            const swapped = doc.getSymbolMasterWithID(String(value))
            target.value = swapped ? swapIn(swapped).symbolId : value
        } else if (swatch) {
            target.swatchValue = swatch
        } else {
            target.value = value
        }
    }
}
