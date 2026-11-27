import sketch = require('sketch')

import type { CalendarMonthOptions, ResizeOptions } from '../kit.ts'
import { childrenOf, openDocument } from './document.ts'

/**
 * Resizes a board or a frame without scaling what's in it, as Sketch does when a script sets its frame: its layers
 * keep their places and sizes, e.g. a screen made taller for a longer page.
 */
export function resizeLayer(options: ResizeOptions): string {
    const doc = openDocument(options.document)
    const layer = doc.getLayerWithID(options.layer)
    if (!layer || (layer.type !== 'Artboard' && layer.type !== 'Group')) {
        throw new Error(`No board or frame ${options.layer} in the document`)
    }
    // Everything in it, outermost first, but inside instances, which their symbols lay out.
    const kept = new Array<{ layer: sketch.Layer, frame: sketch.Rectangle }>()
    const keep = (container: sketch.Layer) => {
        for (const child of childrenOf(container)) {
            kept.push({ layer: child, frame: { ...child.frame } })
            if (child.type !== 'SymbolInstance') {
                keep(child)
            }
        }
    }
    keep(layer)
    layer.frame = { ...layer.frame, width: options.width ?? layer.frame.width, height: options.height ?? layer.frame.height }
    for (const { layer: child, frame } of kept) {
        child.frame = frame
    }
    return JSON.stringify({ layer: layer.name, width: layer.frame.width, height: layer.frame.height, kept: kept.length })
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/**
 * Sets a calendar instance to a month: its title, its weekdays from `firstDay`, and each cell's day, the days of the
 * months before and after as `Other Month`, with the days given as `selected`, `today` and `disabled` in those looks,
 * as the kit's cell symbols draw them. The kit's calendars show five weeks: a month that needs six is said in
 * `warnings`.
 */
export function setCalendarMonth(options: CalendarMonthOptions): string {
    const doc = openDocument(options.document)
    const instance = doc.getLayerWithID(options.layer) as sketch.SymbolInstance | undefined
    if (instance?.type !== 'SymbolInstance' || !instance.master?.name.startsWith('Calendar/')) {
        throw new Error(`${options.layer} isn't an instance of one of the kit's calendars`)
    }
    const [year, month] = options.month.split('-').map(Number)
    if (!year || !month) {
        throw new Error(`The month is a year and a month, e.g. 2026-11, not ${options.month}`)
    }
    const firstDay = options.firstDay ?? 0
    const warnings: string[] = []

    // The cells, in order, each a swap of its symbol: their symbols' names, e.g. Calendar Cell/Single/Medium/Today.
    const isCell = (override: sketch.Override) => override.property === 'symbolID' && !override.path.includes('/') && /Cell( \d+)?$/.test(override.affectedLayer.name)
    const cells = instance.overrides.filter(isCell)
    const current = cells[0] ? doc.getSymbolMasterWithID(String(cells[0].value)) : undefined
    if (!current) {
        throw new Error(`${instance.master.name} has no cells to set`)
    }
    const prefix = current.name.slice(0, current.name.lastIndexOf('/') + 1)
    const library = current.getLibrary()
    const symbols = new Map<string, sketch.SymbolMaster | undefined>()
    const symbolOf = (state: string) => {
        if (!symbols.has(state)) {
            const name = `${prefix}${state}`
            const found = doc.getSymbols().find((master) => master.name === name) ?? library?.getImportableSymbolReferencesForDocument(doc).find((reference) => reference.name === name)?.import()
            if (!found) {
                warnings.push(`No symbol ${name}`)
            }
            symbols.set(state, found)
        }
        return symbols.get(state)
    }

    const first = new Date(year, month - 1, 1)
    const offset = (first.getDay() - firstDay + 7) % 7
    const length = new Date(year, month, 0).getDate()
    if (offset + length > cells.length) {
        warnings.push(`${MONTHS[month - 1]} ${year} takes ${Math.ceil((offset + length) / 7)} weeks; the calendar shows ${cells.length / 7}, so its last days are left out.`)
    }
    const days = cells.map((_, index) => {
        const date = new Date(year, month - 1, 1 - offset + index)
        const inMonth = date.getMonth() === month - 1
        const day = date.getDate()
        const state = !inMonth ? 'Other Month' : options.selected?.includes(day) ? 'Selected' : options.today === day ? 'Today' : options.disabled?.includes(day) ? 'Disabled' : 'Default'
        return { day, state }
    })
    // The cells' looks first: swapping a cell's symbol changes the paths of the overrides inside it.
    cells.forEach((cell, index) => {
        const symbol = symbolOf(days[index]?.state ?? 'Default')
        if (symbol) {
            cell.value = symbol.symbolId
        }
    })
    const swapped = instance.overrides.filter(isCell)
    swapped.forEach((cell, index) => {
        const text = instance.overrides.find((override) => override.property === 'stringValue' && override.path.startsWith(`${cell.path}/`))
        if (text) {
            text.value = String(days[index]?.day ?? '')
        }
    })
    const title = instance.overrides.find((override) => override.property === 'stringValue' && override.affectedLayer.name === 'Calendar View Mode Text Text')
    if (title) {
        title.value = `${MONTHS[month - 1]} ${year}`
    }
    instance.overrides
        .filter((override) => override.property === 'stringValue' && /^Day Text( \d+)?$/.test(override.affectedLayer.name))
        .forEach((override, index) => {
            override.value = DAYS[(index + firstDay) % 7] ?? ''
        })
    return JSON.stringify({ calendar: instance.name, month: `${MONTHS[month - 1]} ${year}`, cells: days.length, warnings })
}
