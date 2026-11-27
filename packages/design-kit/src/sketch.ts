import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { buildSync } from 'esbuild'

import { TYPOGRAPHY, TYPOGRAPHY_COLOURS, variableName } from '../../docs/src/design-kit-names.ts'
import { COMPONENTS } from './components.ts'
import { builtThemes, themeFormulas } from './theme-formulas.ts'
import type { Binding, ComponentData, Kit, KitCheck, KitTheme, Layer, Starter, ThemedSymbol, ThemeKnob, TypographyData } from './kit.ts'
import { firstFamily, numberOf, valuesOf } from './sketch/theme/values.ts'

/**
 * Writes a Sketch script per component of the design kit's model: the component builder (sketch/component.ts) with
 * the component's symbols, starters and the styles they use, for the document with the given path or ID, as a module Sketch
 * can `require` from disk. Each build's file is named by its content, as Sketch keeps a module it has loaded. It
 * prints the line to run in Sketch, e.g. with the Sketch MCP server's `run_code`. It also writes the kit's theme script
 * (sketch/theme/apply.ts), which applies a theme to a document made with the kit, the design check
 * (sketch/check.ts), and the kit's Sketch plugin with both:
 *
 *   yarn design-kit:sketch <document path or ID> [component …]
 */

const root = resolve(import.meta.dirname, '..', '..', '..')
const kitDir = join(root, 'dist', 'design-kit')
const [documentId, ...only] = process.argv.slice(2)
if (!documentId) {
    throw new Error('Pass the Sketch document\'s path, or its ID before it\'s saved')
}
const kit = JSON.parse(readFileSync(join(kitDir, 'kit.json'), 'utf8')) as Kit
const outputDir = join(kitDir, 'sketch')
mkdirSync(outputDir, { recursive: true })

/**
 * A script for Sketch's JavaScriptCore: a CommonJS module with the given entry, which requires the kit's TypeScript
 * from `sketch/` and Sketch's API, bundled.
 */
function bundle(entry: string): string {
    const result = buildSync({
        stdin: { contents: entry, resolveDir: join(import.meta.dirname, 'sketch'), sourcefile: 'entry.js', loader: 'js' },
        bundle: true,
        write: false,
        format: 'cjs',
        platform: 'neutral',
        target: 'es2020',
        // Sketch's API, and the theme script, the design check and the mirror that the plugin's commands load from beside
        // them.
        external: ['sketch', './theme.js', './check.js', './mirror.js', './unwrap.js', './update.js'],
        legalComments: 'none',
        logLevel: 'warning'
    })
    return result.outputFiles[0]?.text ?? ''
}

/** The images a component's symbols show. */
function imagesOf(component: Kit['components'][number]): Set<string> {
    const keys = new Set<string>()
    const collect = (layer: Layer) => {
        if (layer.image) {
            keys.add(layer.image)
        }
        layer.children.forEach(collect)
    }
    component.symbols.forEach((symbol) => collect(symbol.layer))
    return keys
}

for (const component of kit.components.filter((candidate) => !only.length || only.includes(candidate.key))) {
    const spec = COMPONENTS[component.key]
    const layerStyles = new Set<string>()
    const textStyles = new Set<string>()
    const collect = (layer: Layer) => {
        if (layer.layerStyle) {
            layerStyles.add(layer.layerStyle)
        }
        if (layer.textStyle) {
            textStyles.add(layer.textStyle)
        }
        layer.children.forEach(collect)
    }
    component.symbols.forEach((symbol) => collect(symbol.layer))
    for (const starter of component.starters) {
        for (const choice of Object.values(starter.overrides)) {
            if (choice.layerStyle) {
                layerStyles.add(choice.layerStyle)
            }
            if (choice.textStyle) {
                textStyles.add(choice.textStyle)
            }
        }
    }
    const data: ComponentData = {
        component: component.name,
        page: spec.page,
        board: spec.board,
        style: spec.style,
        symbols: component.symbols,
        starters: component.starters,
        layerStyles: Object.fromEntries([...layerStyles].map((name) => [name, kit.layerStyles[name]])),
        textStyles: Object.fromEntries([...textStyles].map((name) => [name, kit.textStyles[name]])),
        allStyles: [...Object.keys(kit.layerStyles), ...Object.keys(kit.textStyles)],
        images: Object.fromEntries([...imagesOf(component)].map((key) => [key, kit.images[key]]))
    }
    const script = bundle(`const { buildComponent } = require('./component.ts')\nmodule.exports = () => buildComponent(${JSON.stringify(documentId)}, ${JSON.stringify(data)})\n`)
    const file = writeModule(component.key, script)
    console.log(`${component.name} (${Math.round(script.length / 1024)} kB): require(${JSON.stringify(file)})()`)
}

/** A module's text, written under a name made of its content, replacing the module's earlier builds. */
function writeModule(key: string, script: string): string {
    const hash = createHash('sha256').update(script).digest('hex').slice(0, 10)
    for (const old of readdirSync(outputDir).filter((name) => name.startsWith(`${key}.`))) {
        rmSync(join(outputDir, old))
    }
    const file = join(outputDir, `${key}.${hash}.js`)
    writeFileSync(file, script)
    return file
}

/** The colours a theme starts from: the statuses' and the greys', and the surfaces the Theme Editor sets. */
const THEME_COLOURS = [
    'color-primary-500',
    'color-success-500',
    'color-info-500',
    'color-warning-500',
    'color-danger-500',
    'color-basic-600',
    'layout-background-color',
    'background-basic-color-1',
    'header-background-color',
    'sidebar-background-color',
    'text-basic-color',
    'text-heading-color',
    'text-hint-color',
    // Text on filled controls, e.g. a filled button's, also each status's own, e.g. dark text on a light warning fill;
    // and in the primary colour, e.g. a link's or an active tab's.
    'text-control-color',
    'text-control-primary-color',
    'text-control-success-color',
    'text-control-info-color',
    'text-control-warning-color',
    'text-control-danger-color',
    'text-primary-color',
    // Fields' and cards' borders.
    'border-basic-color-3',
    'border-basic-color-4'
]

/** Variables' prefixes that aren't a component's key, by the group they go in on the Theme board. */
const PREFIXES: Record<string, string> = {
    'header': 'Layout',
    'footer': 'Layout',
    'option': 'Select',
    'datepicker': 'Picker',
    'timepicker': 'Picker',
    'toastr': 'Toast',
    'validation-errors': 'Field'
}

/**
 * The variables the Theme board shows: the colours a theme starts from; each component's variables the kit follows;
 * and the foundations those follow in turn, e.g. `border-radius`, which a theme changes for every component at once.
 */
function knobsOf(formulas: Record<string, string>): ThemeKnob[] {
    // Each variable once, with the component its name starts with, e.g. `button-ghost-border-width` with Button, even
    // where a calendar follows it too; else as a foundation.
    const keys = kit.components.map((component) => ({ key: component.key, name: component.name })).sort((a, b) => b.key.length - a.key.length)
    const groups = new Map<string, Set<string>>()
    const placed = new Set<string>()
    const add = (variable: string) => {
        // The typographies' variables have a section of their own.
        if (!placed.has(variable) && !variable.startsWith('text-')) {
            placed.add(variable)
            const alias = Object.keys(PREFIXES).find((prefix) => variable.startsWith(`${prefix}-`))
            // One no component's name starts, e.g. `border-radius`, is a foundation, whichever component follows it.
            const own = (alias ? PREFIXES[alias] : undefined) ?? keys.find(({ key }) => variable.startsWith(`${key}-`))?.name ?? 'Foundations'
            groups.set(own, (groups.get(own) ?? new Set()).add(variable))
        }
    }
    const variablesOf = (binding: Binding | undefined) => (binding?.variable ? [binding.variable] : binding?.terms?.map((term) => term.variable) ?? [])
    for (const component of kit.components) {
        const visit = (layer: Layer) => {
            const bindings = layer.bindings
            for (const binding of [...Object.values(bindings?.radius ?? {}), ...Object.values(bindings?.padding ?? {}), bindings?.gap]) {
                variablesOf(binding).forEach(add)
            }
            layer.children.forEach(visit)
        }
        component.symbols.forEach((symbol) => visit(symbol.layer))
    }
    for (const binding of Object.values(kit.styleBindings)) {
        Object.values(binding.follows).flat().forEach((one) => variablesOf(one).forEach(add))
    }
    const bound = new Set([...groups.values()].flatMap((set) => [...set]))
    const foundations = new Set<string>()
    const follow = (variable: string) => {
        for (const match of (formulas[variable] ?? '').matchAll(/var\(--([\w-]+)/g)) {
            if (!bound.has(match[1]) && !foundations.has(match[1]) && !/color/.test(match[1])) {
                foundations.add(match[1])
                follow(match[1])
            }
        }
    }
    bound.forEach(follow)
    // A component's own variable that others follow goes with the component, e.g. a slider's track height.
    for (const variable of [...foundations]) {
        if (Object.keys(PREFIXES).some((prefix) => variable.startsWith(`${prefix}-`)) || keys.some(({ key }) => variable.startsWith(`${key}-`))) {
            foundations.delete(variable)
            add(variable)
        }
    }
    const sorted = (set: Set<string>) => [...set].sort()
    // The typographies' fonts, sizes, weights and line heights, which the text styles follow.
    const typography = Object.keys(TYPOGRAPHY)
        .flatMap((category) => ['font-family', 'font-size', 'font-weight', 'line-height'].map((suffix) => `text-${category}-${suffix}`))
        .filter((variable) => formulas[variable] !== undefined)
    typography.forEach((variable) => foundations.delete(variable))
    // Every text case together, e.g. buttons' and tabs', which the Theme Editor sets at once.
    const textCases = Object.keys(formulas).filter((variable) => variable.endsWith('-text-transform')).sort()
    for (const set of [foundations, ...groups.values()]) {
        textCases.forEach((variable) => set.delete(variable))
    }
    return [
        ...THEME_COLOURS.filter((variable) => formulas[variable] !== undefined).map((variable) => ({ group: 'Colours', variable, colour: true })),
        ...sorted(new Set([...foundations, ...(groups.get('Foundations') ?? [])])).map((variable) => ({ group: 'Foundations', variable })),
        ...typography.map((variable) => ({ group: 'Typography', variable })),
        ...textCases.map((variable) => ({ group: 'Text case', variable })),
        ...[...kit.components.map((component) => component.name), 'Text'].flatMap((group) => sorted(groups.get(group) ?? new Set()).map((variable) => ({ group, variable })))
    ]
}

/** What each symbol depends on, for the theme script to change only what a theme moves. */
function themedSymbols(): Record<string, ThemedSymbol> {
    const variablesOf = (binding: Binding | undefined) => (binding?.variable ? [binding.variable] : binding?.terms?.map((term) => term.variable) ?? [])
    const listed = (set: Set<string>) => (set.size ? [...set].sort() : undefined)
    const symbols: Record<string, ThemedSymbol> = {}
    for (const component of kit.components) {
        const board = `${COMPONENTS[component.key].board} / Starters`
        for (const symbol of component.symbols) {
            const uses = new Set<string>()
            const textStyles = new Set<string>()
            const layerStyles = new Set<string>()
            const layout = new Set<string>()
            const corners = new Set<string>()
            const choose = (choices: Starter['overrides']) => {
                for (const choice of Object.values(choices)) {
                    if (choice.textStyle) {
                        textStyles.add(choice.textStyle)
                    }
                    if (choice.layerStyle) {
                        layerStyles.add(choice.layerStyle)
                    }
                    if (choice.symbol) {
                        uses.add(choice.symbol)
                    }
                }
            }
            const visit = (layer: Layer) => {
                if (layer.textStyle) {
                    textStyles.add(layer.textStyle)
                }
                if (layer.layerStyle) {
                    layerStyles.add(layer.layerStyle)
                }
                if (layer.ref?.symbol) {
                    uses.add(layer.ref.symbol)
                    choose(layer.ref.overrides ?? {})
                } else if (layer.ref) {
                    // A button placed by its inputs takes the size nearest to how tall it's drawn: any of them.
                    const prefix = layer.ref.component === 'icon-button' ? 'Icon Button' : 'Button'
                    const shape = layer.ref.inputs['shape'] ?? 'rectangle'
                    for (const size of ['Tiny', 'Small', 'Medium', 'Large', 'Giant']) {
                        uses.add(`${prefix}/${size}/${shape.charAt(0).toUpperCase()}${shape.slice(1)}`)
                    }
                }
                const bindings = layer.bindings
                Object.values(bindings?.radius ?? {}).forEach((binding) => variablesOf(binding).forEach((variable) => corners.add(variable)))
                for (const binding of [...Object.values(bindings?.padding ?? {}), bindings?.gap, bindings?.width, bindings?.height]) {
                    variablesOf(binding).forEach((variable) => layout.add(variable))
                }
                layer.children.forEach(visit)
            }
            visit(symbol.layer)
            symbols[symbol.name] = { board, uses: listed(uses), textStyles: listed(textStyles), layerStyles: listed(layerStyles), layout: listed(layout), corners: listed(corners) }
        }
        for (const starter of component.starters) {
            const textStyles = new Set<string>()
            const layerStyles = new Set<string>()
            const uses = new Set([starter.symbol])
            const tints: NonNullable<ThemedSymbol['tints']> = {}
            for (const [layer, choice] of Object.entries(starter.overrides)) {
                if (choice.tint && choice.follows) {
                    tints[layer] = { variable: choice.follows, ...(choice.tint.variable ? { swatch: choice.tint.variable } : {}) }
                }
                if (choice.textStyle) {
                    textStyles.add(choice.textStyle)
                }
                if (choice.layerStyle) {
                    layerStyles.add(choice.layerStyle)
                }
                if (choice.symbol) {
                    uses.add(choice.symbol)
                }
            }
            symbols[starter.name] = { board, uses: listed(uses), textStyles: listed(textStyles), layerStyles: listed(layerStyles), ...(Object.keys(tints).length ? { tints } : {}) }
        }
    }
    return symbols
}

// The theme script: the base theme's formulas and the colour variables' theme variables, with the Theme Editor's
// palettes, so a theme's shades come out as the editor makes them, and the Theme board's variables. A theme can start
// from Lyra's other themes, e.g. dark, as in the editor: their formulas where they differ from the kit's.
if (!only.length || only.includes('theme')) {
    const { theme, formulas } = JSON.parse(readFileSync(join(kitDir, 'theme.json'), 'utf8')) as { theme: string, formulas: Record<string, string> }
    const bases = Object.fromEntries(
        builtThemes()
            .filter((base) => base !== theme)
            .map((base) => {
                const own = themeFormulas(base)
                return [base, Object.fromEntries(Object.entries(own).filter(([variable, formula]) => formulas[variable] !== formula))]
            })
    )
    const swatches = Object.fromEntries(
        Object.keys(formulas).flatMap((key) => {
            const name = variableName(key)
            return name ? [[name, key]] : []
        })
    )
    // The typography text styles' prefixes, e.g. Heading/H1, by their typography, e.g. heading-1.
    const typography = Object.fromEntries(Object.entries(TYPOGRAPHY).map(([category, prefix]) => [prefix, category]))
    const contents: Omit<KitTheme, 'stamp'> = { theme, formulas, bases, swatches, styles: kit.styleBindings, typography, symbols: themedSymbols(), knobs: knobsOf(formulas) }
    const data: KitTheme = { ...contents, stamp: createHash('sha256').update(JSON.stringify(contents)).digest('hex').slice(0, 12) }
    // The apply gives Sketch turns as it goes, so it returns a promise.
    const script = bundle(`const { applyTheme } = require('./theme/apply.ts')\nmodule.exports = (options) => applyTheme(${JSON.stringify(data)}, options)\n`)
    const file = writeModule('theme', script)
    console.log(`Theme (${Math.round(script.length / 1024)} kB): require(${JSON.stringify(file)})({ document: '<path>', theme: { … } })`)
    const checkScript = bundle(`const { checkDesign } = require('./check.ts')\nmodule.exports = (options) => checkDesign(${JSON.stringify(checkData(swatches))}, options)\n`)
    const checkFile = writeModule('check', checkScript)
    console.log(`Check (${Math.round(checkScript.length / 1024)} kB): require(${JSON.stringify(checkFile)})({ document: '<path>' })`)
    const components = JSON.stringify(kit.components.map((component) => component.name))
    const mirrorScript = bundle(`const { mirrorDesign } = require('./mirror.ts')\nmodule.exports = (options) => mirrorDesign(${components}, options)\n`)
    const mirrorFile = writeModule('mirror', mirrorScript)
    console.log(`Mirror (${Math.round(mirrorScript.length / 1024)} kB): require(${JSON.stringify(mirrorFile)})({ document: '<path>', boards: ['<screen>'] })`)
    const updateScript = bundle('const { updateFromKit } = require(\'./update.ts\')\nmodule.exports = (options) => updateFromKit(options)\n')
    const updateFile = writeModule('update', updateScript)
    console.log(`Update (${Math.round(updateScript.length / 1024)} kB): require(${JSON.stringify(updateFile)})({ document: '<path>' })`)
    const unwrapScript = bundle(`const { unwrapStarters } = require('./unwrap.ts')\nmodule.exports = (options) => unwrapStarters(${components}, options)\n`)
    const unwrapFile = writeModule('unwrap', unwrapScript)
    console.log(`Unwrap (${Math.round(unwrapScript.length / 1024)} kB): require(${JSON.stringify(unwrapFile)})({ document: '<path>', layers: ['<starter ID>'], symbol: '<symbol>' })`)
    // The kit's typography text styles and Typography page, for typographies the theme adds, e.g. a display size.
    const value = valuesOf(formulas)
    const typographyData: TypographyData = {
        template: TYPOGRAPHY['paragraph'] ?? 'Paragraph/P1',
        colours: Object.values(TYPOGRAPHY_COLOURS),
        categories: Object.entries(TYPOGRAPHY)
            .filter(([category]) => !category.startsWith('button-'))
            .map(([category, prefix]) => ({
                category,
                prefix,
                label: category.replace(/(^|-)(\w)/g, (_, dash: string, letter: string) => `${dash ? ' ' : ''}${letter.toUpperCase()}`),
                family: firstFamily(value(`text-${category}-font-family`) ?? ''),
                size: numberOf(value(`text-${category}-font-size`) ?? '') ?? 16,
                lineHeight: numberOf(value(`text-${category}-line-height`) ?? '') ?? 24,
                weight: Number(value(`text-${category}-font-weight`) ?? 400)
            }))
    }
    const typographyScript = bundle(`const { addTypography } = require('./typography.ts')\nmodule.exports = (options) => addTypography(${JSON.stringify(typographyData)}, options)\n`)
    const typographyFile = writeModule('typography', typographyScript)
    console.log(`Typography (${Math.round(typographyScript.length / 1024)} kB): require(${JSON.stringify(typographyFile)})({ document: '<kit path>' })`)
    const inspectScript = bundle(`const { inspectDesign } = require('./inspect.ts')\nmodule.exports = (options) => inspectDesign(${components}, options)\n`)
    const inspectFile = writeModule('inspect', inspectScript)
    console.log(`Inspect (${Math.round(inspectScript.length / 1024)} kB): require(${JSON.stringify(inspectFile)})({ document: '<path>' })`)
    const helpersScript = bundle('module.exports = require(\'./helpers.ts\')\n')
    const helpersFile = writeModule('helpers', helpersScript)
    console.log(`Helpers (${Math.round(helpersScript.length / 1024)} kB): require(${JSON.stringify(helpersFile)}).resizeLayer({ document: '<path>', layer: '<ID>', height: 1800 })`)
    writePlugin(script, checkScript, mirrorScript, unwrapScript, updateScript, inspectScript, helpersScript)
}

/**
 * What the design check knows of the kit: its symbols and starters, and its styles, by the component they're of, a
 * typography style as the theme's; its colour variables' theme variables; its own pages, which it doesn't check; and
 * each symbol's top layers, by which it tells a detached copy from a frame of that name.
 */
function checkData(swatches: Record<string, string>): KitCheck {
    const symbols = Object.fromEntries(
        kit.components.flatMap((component) => [...component.symbols, ...component.starters].map((symbol) => [symbol.name, component.name]))
    )
    const names = kit.components.map((component) => component.name).sort((a, b) => b.length - a.length)
    const prefixes = Object.values(TYPOGRAPHY)
    const styles = Object.fromEntries(
        [...Object.keys(kit.layerStyles), ...Object.keys(kit.textStyles), ...Object.keys(kit.styleBindings)].map((name) => [
            name,
            prefixes.some((prefix) => name.startsWith(`${prefix}/`))
                ? 'typography'
                : names.find((candidate) => name === candidate || name.startsWith(`${candidate}/`) || name.startsWith(`${candidate} `)) ?? 'the kit'
        ])
    )
    // The components whose symbols and starters draw each style, e.g. a form field its input's, drawn in place.
    const users = new Map<string, Set<string>>()
    const use = (style: string | undefined, component: string) => {
        if (style && styles[style] !== component) {
            users.set(style, new Set([...(users.get(style) ?? []), component]))
        }
    }
    for (const component of kit.components) {
        const visit = (layer: Layer) => {
            use(layer.layerStyle, component.name)
            use(layer.textStyle, component.name)
            layer.children.forEach(visit)
        }
        component.symbols.forEach((symbol) => visit(symbol.layer))
        component.starters.forEach((starter) => Object.values(starter.overrides).forEach((choice) => [choice.layerStyle, choice.textStyle].forEach((style) => use(style, component.name))))
    }
    const usedBy = Object.fromEntries([...users].map(([style, drawnBy]) => [style, [...drawnBy].sort()]))
    // A design's symbols mirrored for right to left are on a page of their own, as the kit's.
    const pages = [...new Set(['Cover', 'Colors', 'Typography', 'Effects', 'Icons', 'Symbols', 'Theme', 'Check', 'Right to left', ...Object.values(COMPONENTS).map((spec) => spec.page)])]
    const parts = Object.fromEntries(kit.components.flatMap((component) => component.symbols.map((symbol) => [symbol.name, symbol.layer.children.map((child) => child.name)])))
    return { symbols, styles, usedBy, swatches, pages, parts, typography: prefixes }
}

/**
 * The kit's Sketch plugin, for designers: Lyra › Apply theme applies the theme on the front document's Theme board,
 * or the one it recorded, to the document, Lyra › Check design lists what the design does beyond the kit and its
 * theme, Lyra › Mirror for right to left makes right-to-left copies of the selected screens, and Lyra › Unwrap
 * starters turns the selected starters into their symbols with their looks, to swap for another size, and Lyra ›
 * Update from kit brings a design's symbols and styles up to date with the kit; double-click the
 * bundle to install it. Beside them, `helpers.js` has `resizeLayer` and `setCalendarMonth` for scripts that make a
 * design, `inspect.js` reads a design's screens as JSON, for whoever builds them, and
 * `theme-files.mjs`, run with Node, writes the theme a saved design records to CSS, Sass and JSON files.
 */
function writePlugin(themeScript: string, checkScript: string, mirrorScript: string, unwrapScript: string, updateScript: string, inspectScript: string, helpersScript: string) {
    const plugin = join(kitDir, 'Lyra design kit.sketchplugin')
    const scripts = join(plugin, 'Contents', 'Sketch')
    rmSync(plugin, { recursive: true, force: true })
    mkdirSync(scripts, { recursive: true })
    const { version } = JSON.parse(readFileSync(join(root, 'packages', 'core', 'package.json'), 'utf8')) as { version: string }
    const manifest = {
        name: 'Lyra design kit',
        description: 'Applies a theme to the Lyra design kit, and to designs made with it, as the app applies it.',
        author: 'Lyra',
        homepage: 'https://liquid-js.github.io/lyra/docs/guides/design-kit',
        identifier: 'io.github.liquid-js.lyra.design-kit',
        version,
        bundleVersion: 1,
        commands: [
            {
                name: 'Apply theme',
                identifier: 'apply-theme',
                description: 'Applies the theme on the Theme board, or the one the document recorded.',
                script: 'commands.js',
                handler: 'applyTheme'
            },
            {
                name: 'Check design',
                identifier: 'check-design',
                description: 'Lists what the design does beyond the kit and its theme, and what each takes in the app.',
                script: 'commands.js',
                handler: 'checkDesign'
            },
            {
                name: 'Mirror for right to left',
                identifier: 'mirror-design',
                description: 'Makes a right-to-left copy of each selected screen, as the app lays it out with dir="rtl".',
                script: 'commands.js',
                handler: 'mirrorDesign'
            },
            {
                name: 'Unwrap starters',
                identifier: 'unwrap-starters',
                description: 'Turns the selected starters into the symbols they hold, with their looks, so another size keeps the look.',
                script: 'commands.js',
                handler: 'unwrapStarters'
            },
            {
                name: 'Update from kit',
                identifier: 'update-from-kit',
                description: 'Brings the design\'s symbols and styles up to date with the kit it uses as a library.',
                script: 'commands.js',
                handler: 'updateFromKit'
            }
        ],
        menu: { title: 'Lyra', items: ['apply-theme', 'check-design', 'mirror-design', 'unwrap-starters', 'update-from-kit'] }
    }
    writeFileSync(join(scripts, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
    writeFileSync(join(scripts, 'theme.js'), themeScript)
    writeFileSync(join(scripts, 'check.js'), checkScript)
    writeFileSync(join(scripts, 'mirror.js'), mirrorScript)
    writeFileSync(join(scripts, 'unwrap.js'), unwrapScript)
    writeFileSync(join(scripts, 'update.js'), updateScript)
    // For whoever builds the design, e.g. an agent: the screens as JSON, and, with Node, the theme it records as files.
    writeFileSync(join(scripts, 'inspect.js'), inspectScript)
    // For scripts that make a design: resizing a board without scaling it, and setting a calendar's month.
    writeFileSync(join(scripts, 'helpers.js'), helpersScript)
    const themeFiles = buildSync({
        entryPoints: [join(import.meta.dirname, 'theme-files.ts')],
        bundle: true,
        write: false,
        format: 'esm',
        platform: 'node',
        target: 'node20',
        legalComments: 'none',
        logLevel: 'warning'
    })
    writeFileSync(join(scripts, 'theme-files.mjs'), themeFiles.outputFiles[0]?.text ?? '')
    writeFileSync(join(scripts, 'commands.js'), bundle('module.exports = require("./commands.ts")\n'))
    console.log(`Plugin: ${plugin}`)
}
