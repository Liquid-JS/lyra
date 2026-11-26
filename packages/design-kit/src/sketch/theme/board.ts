import sketch = require('sketch')

import type { KitTheme, ThemeKnob } from '../../kit.ts'
import { hexOf } from '../document.ts'
import type { FileLayer } from '../file-format.ts'
import { colourIn, display, pixels, type Variables } from './values.ts'

/** What the Theme board shows of a theme. */
export interface BoardValues {
    themeName: string
    baseTheme: string
    given: Variables
    baseFormulas: Variables
    themed: (name: string) => string | undefined
}

const PADDING = 64
const COLUMN = 760
const ROW = 28
const HEADING = 56
const INTRO = 120
const DARK = '#222b45ff'
const VALUE = '#2e3a59ff'
const HINT = '#8f9bb3ff'

/** A row of the board as it shows a variable: its value, whether it's the theme's own, its colour and its pixels. */
function rowOf(knob: ThemeKnob, values: BoardValues) {
    const own = values.given[knob.variable]
    return {
        value: display(own ?? values.baseFormulas[knob.variable] ?? ''),
        own: own !== undefined,
        colour: knob.colour ? colourIn(values.themed(knob.variable)) ?? '#00000000' : undefined,
        pixels: pixels(values.themed(knob.variable))
    }
}

const titleOf = (values: BoardValues) => `Theme: ${values.themeName}, over Lyra's ${values.baseTheme} theme`
const introductionOf = (values: BoardValues) =>
    `Every value the kit follows, by what it's for: a value of the theme's own, or the formula it follows from others, as Lyra's ${values.baseTheme} theme sets it. Change a value, or a colour's chip, then run Lyra › Apply theme: everything that follows it changes with it, as it does in the app. Clear a value for the ${values.baseTheme} theme's again.`

/**
 * What the theme sets, and what the kit follows, on a board of its own, to change and apply again: each variable's own
 * value or the formula it follows, e.g. `border-radius` for a rectangle button's radius, by what it's for. A board
 * that shows the kit's variables already is updated where what it shows changed, as it has thousands of layers;
 * otherwise it's made again.
 */
export async function writeThemeBoard(page: sketch.Page, board: sketch.Artboard | undefined, boardData: FileLayer | undefined, kit: KitTheme, values: BoardValues, pace: () => Promise<void>): Promise<void> {
    if (board && boardData && (await updateThemeBoard(board, boardData, kit, values, pace))) {
        return
    }
    page.layers.filter((layer) => layer.name === 'Theme').forEach((layer) => layer.remove())
    const groups = groupsOf(kit)
    // Groups in columns, a column as long as the board's tallest allows, so a long group gets a column of its own.
    const height = (group: (typeof groups)[number]) => HEADING + group.knobs.length * ROW + 32
    // Four columns or so, each as tall as a quarter of the groups, or the tallest group.
    const tallest = Math.max(1200, ...groups.map(height), Math.ceil(groups.reduce((total, group) => total + height(group), 0) / 4))
    const places: Array<{ group: (typeof groups)[number], x: number, y: number }> = []
    let x = PADDING
    let y = PADDING + INTRO
    for (const group of groups) {
        if (y > PADDING + INTRO && y + height(group) > PADDING + INTRO + tallest) {
            x += COLUMN
            y = PADDING + INTRO
        }
        places.push({ group, x, y })
        y += height(group)
    }
    const width = x + COLUMN + PADDING
    const boardHeight = PADDING + INTRO + tallest + PADDING
    const sheet = new sketch.Artboard({ parent: page, name: 'Theme', frame: { x: 0, y: 0, width, height: boardHeight } })
    sheet.background = { enabled: true, includedInExport: true, color: '#ffffffff' }
    const write = (text: string, frame: { x: number, y: number, width: number }, size: number, weight: number, colour: string, name?: string) => {
        const made = new sketch.Text({ parent: sheet, text, name: name ?? text.slice(0, 40) })
        made.style.fontFamily = 'Inter'
        made.style.fontSize = size
        made.style.fontWeight = weight
        made.style.lineHeight = Math.round(size * 1.5)
        made.style.textColor = colour
        made.fixedWidth = true
        made.frame = { x: frame.x, y: frame.y, width: frame.width, height: made.frame.height }
        return made
    }
    write(titleOf(values), { x: PADDING, y: PADDING, width: 1200 }, 28, 8, DARK, 'Title')
    write(introductionOf(values), { x: PADDING, y: PADDING + 48, width: 1200 }, 14, 5, HINT, 'Introduction')
    for (const { group, x: left, y: top } of places) {
        write(group.name, { x: left, y: top + 16, width: COLUMN - 32 }, 16, 8, DARK, group.name)
        group.knobs.forEach((knob, index) => {
            const rowTop = top + HEADING + index * ROW
            const row = rowOf(knob, values)
            write(knob.variable, { x: left, y: rowTop, width: 300 }, 12, 5, HINT, knob.variable)
            let valueLeft = left + 308
            if (row.colour) {
                const chip = new sketch.ShapePath({ parent: sheet, name: `--${knob.variable} colour`, frame: { x: valueLeft, y: rowTop, width: 18, height: 18 } })
                chip.style.fills = [{ fillType: sketch.Style.FillType.Color, color: row.colour }]
                chip.style.borders = [{ fillType: sketch.Style.FillType.Color, color: '#00000026', thickness: 1 }]
                chip.style.corners.radii = [4, 4, 4, 4]
                valueLeft += 26
            }
            write(row.value, { x: valueLeft, y: rowTop, width: left + COLUMN - 112 - valueLeft }, 12, row.own ? 8 : 5, row.own ? DARK : VALUE, `--${knob.variable}`)
            // What it comes to, for a length.
            write(row.pixels, { x: left + COLUMN - 104, y: rowTop, width: 72 }, 12, 5, HINT, `${knob.variable} in pixels`)
        })
        await pace()
    }
}

/** The board's variables in their groups, in the order the kit lists them. */
function groupsOf(kit: KitTheme) {
    const groups: Array<{ name: string, knobs: ThemeKnob[] }> = []
    for (const knob of kit.knobs) {
        let group = groups.find((candidate) => candidate.name === knob.group)
        if (!group) {
            group = { name: knob.group, knobs: [] }
            groups.push(group)
        }
        group.knobs.push(knob)
    }
    return groups
}

/**
 * Updates a Theme board that has a row for each of the kit's variables, and nothing else: each text and chip that
 * shows something else now. Whether it did; a board made for other variables, e.g. an older kit's, is made again.
 */
async function updateThemeBoard(board: sketch.Artboard, boardData: FileLayer, kit: KitTheme, values: BoardValues, pace: () => Promise<void>): Promise<boolean> {
    const shown = boardData.layers ?? []
    const byName = new Map(shown.map((data, index) => [data.name, { data, index }]))
    const groups = groupsOf(kit)
    const expected = 2 + groups.length + kit.knobs.reduce((total, knob) => total + (knob.colour ? 4 : 3), 0)
    const complete =
        shown.length === expected &&
        byName.has('Title') &&
        byName.has('Introduction') &&
        kit.knobs.every((knob) => byName.has(`--${knob.variable}`) && byName.has(`${knob.variable} in pixels`) && (!knob.colour || byName.has(`--${knob.variable} colour`)))
    if (!complete) {
        return false
    }
    // The board's layers, read once, in the file format's order.
    const layers = board.layers
    const layerOf = (name: string) => {
        const found = byName.get(name)
        const layer = found ? layers[found.index] : undefined
        return layer?.id === found?.data.do_objectID ? layer : layers.find((candidate) => candidate.id === found?.data.do_objectID)
    }
    const textOf = (name: string) => byName.get(name)?.data.attributedString?.string ?? ''
    const textColourOf = (name: string) => {
        const colour = byName.get(name)?.data.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute
        return colour ? hexOf(colour) : undefined
    }
    const setText = (name: string, text: string, own?: boolean) => {
        const layer = layerOf(name) as sketch.Text | undefined
        if (!layer) {
            return
        }
        layer.text = text
        if (own !== undefined) {
            layer.style.fontWeight = own ? 8 : 5
            layer.style.textColor = own ? DARK : VALUE
        }
    }
    if (textOf('Title') !== titleOf(values)) {
        setText('Title', titleOf(values))
    }
    if (textOf('Introduction') !== introductionOf(values)) {
        setText('Introduction', introductionOf(values))
    }
    let rows = 0
    for (const knob of kit.knobs) {
        const row = rowOf(knob, values)
        const valueName = `--${knob.variable}`
        const ownNow = textColourOf(valueName) === DARK
        if (textOf(valueName) !== row.value || ownNow !== row.own) {
            setText(valueName, row.value, row.own)
        }
        const pixelsName = `${knob.variable} in pixels`
        if (textOf(pixelsName) !== row.pixels) {
            setText(pixelsName, row.pixels)
        }
        if (row.colour) {
            const chipName = `--${knob.variable} colour`
            const fill = byName.get(chipName)?.data.style?.fills?.[0]?.color
            if (!fill || hexOf(fill) !== row.colour) {
                const chip = layerOf(chipName)
                if (chip) {
                    chip.style.fills = [{ fillType: sketch.Style.FillType.Color, color: row.colour }]
                }
            }
        }
        if (++rows % 50 === 0) {
            await pace()
        }
    }
    return true
}

/** The theme's Sass and CSS on a board beside the Theme board, to copy: a script can't write files. */
export function writeThemeCode(doc: sketch.Document, css: string, scss: string): void {
    const page = doc.pages.find((candidate) => candidate.name === 'Theme')
    const sheet = page?.layers.find((layer) => layer.name === 'Theme')
    if (!page || !sheet) {
        return
    }
    page.layers.filter((layer) => layer.name === 'Theme code' || layer.name === 'Theme code draft').forEach((layer) => layer.remove())
    // Written on a draft, then moved to a board made at their height: resizing a board scales what's on it.
    const draft = new sketch.Artboard({ parent: page, name: 'Theme code draft', frame: { x: 0, y: -100000, width: 1000, height: 20000 } })
    let y = 64
    const write = (text: string, size: number, weight: number, font: string, colour: string, gap: number) => {
        const made = new sketch.Text({ parent: draft, text, name: text.slice(0, 40) })
        made.style.fontFamily = font
        made.style.fontSize = size
        made.style.fontWeight = weight
        made.style.lineHeight = Math.round(size * 1.5)
        made.style.textColor = colour
        made.fixedWidth = true
        made.frame = { x: 64, y, width: 872, height: made.frame.height }
        made.adjustToFit()
        y += made.frame.height + gap
    }
    write('For the app', 28, 8, 'Inter', DARK, 12)
    write('The theme as Sass, for the app\'s themes.scss (it registers the theme by its name; provide it with provideNbTheme), then as CSS variables over the base theme. The document\'s settings keep both, as lyra-theme.', 14, 5, 'Inter', HINT, 32)
    write(scss, 12, 5, 'Menlo', DARK, 32)
    write(css, 12, 5, 'Menlo', DARK, 32)
    const codeBoard = new sketch.Artboard({ parent: page, name: 'Theme code', frame: { x: sheet.frame.x + sheet.frame.width + 200, y: sheet.frame.y, width: 1000, height: Math.ceil(y + 32) } })
    codeBoard.background = { enabled: true, includedInExport: true, color: '#ffffffff' }
    for (const layer of draft.layers.slice()) {
        const frame = { ...layer.frame }
        layer.parent = codeBoard
        layer.frame = frame
    }
    draft.remove()
}
