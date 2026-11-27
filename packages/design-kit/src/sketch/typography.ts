import sketch = require('sketch')

import type { TypographyData, TypographyOptions } from '../kit.ts'
import { openDocument } from './document.ts'
import { weightOf } from './theme/values.ts'

/**
 * Adds the theme's typographies the kit doesn't have yet, e.g. a display size: a text style in each text colour, made
 * from the paragraph's in that colour with the typography's font, and a row on the Typography page's scale, in the
 * typographies' order. The theme script then keeps them as the theme sets them.
 */

const BOARD = 'Typography / Scale'
const SAMPLE = 'The quick brown fox'
const WEIGHT_NAMES: Record<number, string> = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' }

export function addTypography(data: TypographyData, options: TypographyOptions): string {
    const doc = openDocument(options.document)
    const styleNamed = (name: string) => doc.sharedTextStyles.find((shared) => shared.name === name)
    const scratch = doc.pages[0]

    // The text styles, in every text colour.
    const made: string[] = []
    for (const typography of data.categories) {
        for (const colour of data.colours) {
            const name = `${typography.prefix}/${colour}`
            const template = styleNamed(`${data.template}/${colour}`)
            if (styleNamed(name) || !template) {
                continue
            }
            // A text style's font is read and written through a text that has it.
            const text = new sketch.Text({ parent: scratch, text: 'Aa', frame: { x: -9999, y: -9999, width: 100, height: 40 } })
            text.sharedStyle = template
            text.style.syncWithSharedStyle(template)
            text.style.fontFamily = typography.family
            text.style.fontSize = typography.size
            text.style.lineHeight = typography.lineHeight
            text.style.fontWeight = weightOf(typography.weight)
            sketch.SharedStyle.fromStyle({ name, style: text.style, document: doc })
            text.remove()
            made.push(name)
        }
    }

    // The scale's rows, each a name, a sample, its font over its variables' label, and a divider under it, found by
    // where they are. A new row's layers go last, in that order: the theme script reads a label's font as the text
    // before it.
    const board = doc.pages.find((page) => page.name === 'Typography')?.layers.find((layer) => layer.name === BOARD) as sketch.Artboard | undefined
    const rows = new Array<string>()
    if (board) {
        const rowOf = (layers: sketch.Layer[], category: string) => {
            const label = layers.find((layer) => layer.type === 'Text' && (layer as sketch.Text).text === `--text-${category}-*`)
            if (!label) {
                return undefined
            }
            const middle = label.frame.y
            const samples = layers.filter((layer) => layer.type === 'Text' && Math.abs(layer.frame.x - 280) < 1)
            const sample = samples.sort((a, b) => Math.abs(a.frame.y + a.frame.height / 2 - middle) - Math.abs(b.frame.y + b.frame.height / 2 - middle))[0]
            const bottom = sample ? sample.frame.y + sample.frame.height : middle
            const dividers = layers.filter((layer) => layer.name === 'Divider' && layer.frame.y >= bottom - 1).sort((a, b) => a.frame.y - b.frame.y)
            return sample ? { top: sample.frame.y, end: (dividers[0]?.frame.y ?? bottom + 15) + 17 } : undefined
        }
        const divider = board.layers.find((layer) => layer.name === 'Divider')
        data.categories.forEach((typography, order) => {
            const layers = board.layers
            if (rowOf(layers, typography.category)) {
                return
            }
            const next = data.categories.slice(order + 1).map((later) => rowOf(layers, later.category)).find(Boolean)
            const last = data.categories.slice(0, order).reverse().map((earlier) => rowOf(layers, earlier.category)).find(Boolean)
            const top = next ? next.top : last ? last.end : 144
            const height = typography.lineHeight + 32
            // Room for the row: what's below it moves down. Resizing the board scales its layers, so each is put back
            // where it was, or below the row.
            const frames = layers.map((layer) => ({ ...layer.frame }))
            board.frame = { ...board.frame, height: board.frame.height + height }
            layers.forEach((layer, index) => {
                const frame = frames[index]
                layer.frame = { ...frame, y: frame.y >= top ? frame.y + height : frame.y }
            })
            const write = (text: string, style: string, x: number, y: number) => {
                const layer = new sketch.Text({ parent: board, text })
                const shared = styleNamed(style)
                // The style first: Sketch keeps a text's baseline as its style changes, which would move it.
                if (shared) {
                    layer.sharedStyle = shared
                    layer.style.syncWithSharedStyle(shared)
                }
                layer.frame = { ...layer.frame, x, y }
            }
            const font = `${typography.family} ${WEIGHT_NAMES[Math.round(typography.weight / 100) * 100] ?? ''} · ${typography.size} / ${typography.lineHeight}`
            write(typography.label, 'Subtitle/S2/Basic', 40, top + (typography.lineHeight - 24) / 2)
            write(SAMPLE, `${typography.prefix}/Basic`, 280, top)
            write(font, 'Caption/C2/Basic', 1000, top + typography.lineHeight / 2 - 16)
            write(`--text-${typography.category}-*`, 'Caption/C1/Hint', 1000, top + typography.lineHeight / 2)
            if (divider) {
                const line = divider.duplicate()
                line.frame = { ...line.frame, y: top + typography.lineHeight + 15 }
            }
            rows.push(typography.category)
        })
    }
    doc.processPendingChanges()
    return JSON.stringify({ styles: made.length, rows })
}
