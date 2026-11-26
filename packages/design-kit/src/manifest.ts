import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { slug } from '../../docs/src/pages.ts'
import { structure } from '../../docs/src/structure.ts'
import { TYPOGRAPHY, TYPOGRAPHY_COLOURS, variableName } from '../../docs/src/design-kit-names.ts'
import { COMPONENTS } from './components.ts'
import type { Binding, Gradient, Kit, LayerStyle, Paint, TextStyle } from './kit.ts'

/**
 * The design kit's map to code, `lyra-kit.json`, for designers and agents turning a design made with the kit into an
 * Angular app: each symbol's component, its Angular class, selector, docs page and inputs; each style's component and
 * inputs, and the theme variables it uses; each colour variable's CSS variable. It's made from the kit's model, the
 * theme's tokens, the docs' API data (`yarn docs:prepare`) and the sources, and stops where a kit input has no way to
 * be set in code, so the map can't fall behind the components.
 *
 *   yarn design-kit:manifest
 */

const root = resolve(import.meta.dirname, '..', '..', '..')
const kitDir = join(root, 'dist', 'design-kit')
const DOCS = 'https://liquid-js.github.io/lyra/'

interface ApiClass {
    name: string
    props: Array<{ kind: string, name: string }>
}

const kit = JSON.parse(readFileSync(join(kitDir, 'kit.json'), 'utf8')) as Kit
const tokens = JSON.parse(readFileSync(join(kitDir, 'tokens.json'), 'utf8')) as Record<string, Record<string, { $type?: string, $value?: unknown }>>
const api = JSON.parse(readFileSync(join(root, 'packages', 'docs', 'public', 'output.json'), 'utf8')) as { classes: ApiClass[] }
const classes = new Map(api.classes.map((entry) => [entry.name, entry]))
const version = (JSON.parse(readFileSync(join(root, 'packages', 'core', 'package.json'), 'utf8')) as { version: string }).version

// ---- Colour variables: the theme variable each one is ----

// A token's colour, following aliases, e.g. `{color.primary-500}`.
const hexOf = (value: unknown, depth = 0): string | undefined => {
    if (typeof value === 'string') {
        const [group, name] = value.replace(/^\{|\}$/g, '').split('.')
        return depth < 10 ? hexOf(tokens[group]?.[name]?.$value, depth + 1) : undefined
    }
    // With its alpha, where it's see-through, e.g. a backdrop's: `#rrggbbaa`.
    const colour = value as { hex?: string, alpha?: number } | undefined
    const alpha = colour?.alpha ?? 1
    return colour?.hex && alpha < 1 ? `${colour.hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` : colour?.hex
}
const variables: Record<string, { css: string, value?: string, usedBy?: unknown[] }> = {}
for (const [group, entries] of Object.entries(tokens)) {
    for (const [name, token] of Object.entries(entries ?? {})) {
        const variable = token?.$type === 'color' ? variableName(`${group}-${name}`) : undefined
        const value = variable ? hexOf(token.$value) : undefined
        if (variable) {
            variables[variable] = { css: `--${group}-${name}`, ...(value ? { value } : {}) }
        }
    }
}
const cssOf = (paint: Paint) => (paint.variable ? variables[paint.variable]?.css : undefined)

// ---- Angular classes: their selectors, from the sources ----

const selectors = new Map<string, { selector: string, source: string }>()
const scan = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) {
            if (!['node_modules', 'dist'].includes(entry.name)) {
                scan(path)
            }
        } else if (path.endsWith('.ts') && !path.endsWith('.spec.ts')) {
            const text = readFileSync(path, 'utf8')
            // A class's selector is in the decorator right above it.
            for (const match of text.matchAll(/export (?:abstract )?class (\w+)/g)) {
                const before = text.slice(0, match.index)
                const decorator = before.slice(Math.max(before.lastIndexOf('@Component('), before.lastIndexOf('@Directive(')))
                const selector = decorator.startsWith('@') && !/\bclass\s/.test(decorator) ? /selector:\s*(["'`])([\s\S]*?)\1/.exec(decorator) : undefined
                if (selector) {
                    selectors.set(match[1], { selector: selector[2].replace(/\s+/g, ' '), source: relative(root, path) })
                }
            }
        }
    }
}
scan(join(root, 'packages', 'core', 'src'))
scan(join(root, 'packages', 'extras'))

// ---- Docs pages: where each class is documented ----

interface StructureEntry {
    type: string
    name: string
    path?: string
    source?: string[]
    children?: StructureEntry[]
}
const pages = new Map<string, string>()
const index = (entries: StructureEntry[], path: string) => {
    for (const entry of entries) {
        if (!['section', 'page', 'tabs'].includes(entry.type)) {
            continue
        }
        const here = `${path}/${slug(entry.name)}`
        for (const name of entry.type === 'tabs' ? entry.source ?? [] : []) {
            pages.set(name, `${DOCS}${here.slice(1)}/overview/`)
        }
        index(entry.children ?? [], here)
    }
}
for (const area of structure as unknown as StructureEntry[]) {
    index(area.children ?? [], `/${area.path ?? slug(area.name)}`)
}

// ---- Components ----

/** What the kit's states are in code; a component's own `code.inputs.state` says more where it differs. */
const STATES: Record<string, string> = {
    'default': 'At rest.',
    'hover': 'Under the pointer; it comes with interaction, there is nothing to set.',
    'focus': 'Focused, e.g. by the keyboard; it comes with interaction, there is nothing to set.',
    'active': 'Pressed; it comes with interaction, there is nothing to set.',
    'disabled': 'Its `disabled` input, or a disabled form control.',
    'open': 'Its overlay open, e.g. a select\'s options.',
    'selected': 'Its `selected` input.',
    'drag-over': 'While files are dragged over it.'
}

const components: Record<string, unknown> = {}
const styleUses = new Map<string, Array<{ component: string, inputs: Record<string, unknown> }>>()
const colourUses = new Map<string, Array<{ component: string, layer: string, inputs: Record<string, unknown> }>>()
const problems: string[] = []
/** The theme variables a binding follows, e.g. `button-filled-border-width`. */
const followedBy = (binding: Binding | undefined) => (binding?.variable ? [binding.variable] : binding?.terms?.map((term) => term.variable) ?? [])

for (const built of kit.components) {
    const spec = COMPONENTS[built.key]
    const pascal = built.key.replace(/(^|-)(\w)/g, (_, __, letter: string) => letter.toUpperCase())
    const className = spec.code?.class ?? [`Nb${pascal}Component`, `Nb${pascal}Directive`].find((name) => classes.has(name))
    if (!className || !classes.has(className)) {
        problems.push(`${built.key}: no Angular class ${className ?? `Nb${pascal}Component`} in the docs' API data; set code.class`)
        continue
    }
    const angularInputs = new Set(classes.get(className)?.props.filter((prop) => prop.kind === 'input').map((prop) => prop.name))
    const combinations = [...built.symbols, ...built.starters]
    const inputs: Record<string, { values: string[], code: string }> = {}
    for (const input of [...new Set(combinations.flatMap((entry) => Object.keys(entry.inputs)))]) {
        const values = [...new Set(combinations.map((entry) => entry.inputs[input]).filter((value) => value !== undefined).map(String))]
        const code =
            spec.code?.inputs?.[input] ??
            (input === 'state' && values.every((value) => STATES[value]) ? 'Not an input: see `states`.' : angularInputs.has(input) ? `\`${input}\`.` : undefined)
        if (!code) {
            problems.push(`${built.key}: kit input "${input}" isn't an input of ${className}; say how it's set in code.inputs`)
            continue
        }
        inputs[input] = { values, code }
    }
    // The styles each combination's layers have, so a style reads as the inputs it stands for.
    const record = (style: string | undefined, entryInputs: Record<string, unknown>) => {
        // Symbols draw parts in their starter's look; the starters say what each look stands for.
        if (style && spec.style.some((input) => entryInputs[input] !== undefined)) {
            const uses = styleUses.get(style) ?? []
            uses.push({ component: built.key, inputs: Object.fromEntries(spec.style.filter((input) => entryInputs[input] !== undefined).map((input) => [input, entryInputs[input]])) })
            styleUses.set(style, uses)
        }
    }
    for (const symbol of built.symbols) {
        const visit = (layer: { layerStyle?: string, textStyle?: string, children: Array<{ layerStyle?: string, textStyle?: string, children: unknown[] }> }) => {
            record(layer.layerStyle, symbol.inputs)
            record(layer.textStyle, symbol.inputs)
            layer.children.forEach((child) => visit(child as typeof layer))
        }
        visit(symbol.layer)
    }
    for (const starter of built.starters) {
        for (const [layer, override] of Object.entries(starter.overrides)) {
            record(override.layerStyle, starter.inputs)
            record(override.textStyle, starter.inputs)
            // A text's or an icon's colour, e.g. a button label's: the colour variable stands for the look's inputs.
            if (override.tint?.variable) {
                const uses = colourUses.get(override.tint.variable) ?? []
                uses.push({ component: built.key, layer, inputs: Object.fromEntries(spec.style.map((input) => [input, starter.inputs[input]])) })
                colourUses.set(override.tint.variable, uses)
            }
        }
    }
    const found = selectors.get(className)
    components[built.key] = {
        name: built.name,
        class: className,
        ...(found ? { selector: found.selector, source: found.source } : {}),
        ...(pages.get(className) ? { docs: pages.get(className) } : {}),
        inputs,
        follows: built.follows,
        ...(spec.code?.notes ? { notes: spec.code.notes } : {}),
        symbols: Object.fromEntries(built.symbols.map((symbol) => [symbol.name, symbol.inputs])),
        starters: Object.fromEntries(built.starters.map((starter) => [starter.name, { symbol: starter.symbol, inputs: starter.inputs }]))
    }
}
if (problems.length) {
    throw new Error(`The design kit's map to code is incomplete:\n  ${problems.join('\n  ')}`)
}

// ---- Styles: the inputs they stand for, and the theme variables they use ----

/** The theme variables a style's measures follow, by measure, e.g. a button style's border width. */
const followsOf = (name: string) => {
    const binding = kit.styleBindings[name]
    if (!binding) {
        return {}
    }
    const follows = Object.fromEntries(Object.entries(binding.follows).map(([measure, list]) => [measure, [...new Set((list ?? []).flatMap(followedBy))]]))
    return { follows }
}

const paintsOf = (style: LayerStyle) => {
    const paints: Paint[] = []
    const add = (fill: Paint | Gradient) => ('stops' in fill ? fill.stops.forEach((stop) => paints.push(stop.paint)) : paints.push(fill))
    style.fills.forEach(add)
    if (style.border) {
        paints.push(style.border.paint)
        style.border.gradient?.stops.forEach((stop) => paints.push(stop.paint))
    }
    style.shadows.forEach((shadow) => paints.push(shadow.paint))
    return paints
}
const usesOf = (name: string) => {
    const uses = styleUses.get(name) ?? []
    const unique = [...new Map(uses.map((use) => [JSON.stringify(use), use])).values()]
    return unique.length ? { usedBy: unique } : {}
}
// The styles the kit's symbols and starters use, and those of the components inside them: the ones the Sketch file
// keeps, as each build removes a component's styles that nothing uses.
const used = new Set<string>()
const collect = (choice: { layerStyle?: string, textStyle?: string }) => [choice.layerStyle, choice.textStyle].forEach((name) => name && used.add(name))
const visitLayer = (layer: Kit['components'][number]['symbols'][number]['layer']) => {
    collect(layer)
    Object.values(layer.ref?.overrides ?? {}).forEach(collect)
    layer.children.forEach(visitLayer)
}
for (const component of kit.components) {
    component.symbols.forEach((symbol) => visitLayer(symbol.layer))
    component.starters.forEach((starter) => Object.values(starter.overrides).forEach(collect))
}
const layerStyles = Object.fromEntries(
    Object.entries(kit.layerStyles)
        .filter(([name]) => used.has(name))
        .map(([name, style]) => [name, { variables: [...new Set(paintsOf(style).map(cssOf).filter(Boolean))], ...followsOf(name), ...usesOf(name) }])
)
/** Lyra's global class for a typography, e.g. `h4`; buttons' typography is the buttons' own. */
const typographyClass = (category: string) =>
    category.startsWith('heading-') ? `h${category.slice('heading-'.length)}` : category.startsWith('button-') ? undefined : category
/**
 * Lyra's global class for a text colour, by its name in a style's, e.g. `text-hint` for Hint: none for a typography's
 * own colour, e.g. a heading's or a paragraph's basic one, but `text-basic` for a caption's or a label's, which are
 * hints of their own.
 */
const colourClass = (category: string, colour: string) =>
    colour === 'Basic' ? (/^(caption|label)/.test(category) ? 'text-basic' : undefined) : colour === 'Hint' && /^(caption|label)/.test(category) ? undefined : `text-${colour.toLowerCase()}`
// A typography text style, e.g. `Heading/H1/Basic`: the theme's typography variables, in a text colour, and the
// classes that give a text both, e.g. `h4 text-hint`.
const typographyStyle = (category: string, colour: Paint | undefined, name: string) => ({
    typography: category,
    ...(typographyClass(category) ? { class: [typographyClass(category), colourClass(category, name.split('/').pop() ?? '')].filter(Boolean).join(' ') } : {}),
    css: Object.fromEntries(
        ['font-family', 'font-size', 'font-weight', 'line-height']
            .filter((property) => tokens['text']?.[`${category}-${property}`])
            .map((property) => [property, `--text-${category}-${property}`])
    ),
    ...(colour ? (cssOf(colour) ? { color: cssOf(colour) } : { colorValue: colour.color }) : {}),
    ...usesOf(name)
})
const headingVariable = (category: string, variable: string): Paint => {
    const own = category.startsWith('heading-') && variable === 'Text/Basic' ? 'Text/Heading' : variable
    return { color: variables[own]?.value ?? '', variable: own }
}
const categoryOf = (name: string) => Object.entries(TYPOGRAPHY).find(([, prefix]) => name.startsWith(`${prefix}/`))?.[0]
// Every typography style, made once for all components, in each text colour; then the kit's own.
const textStyles = Object.fromEntries([
    ...Object.entries(TYPOGRAPHY).flatMap(([category, prefix]) =>
        Object.entries(TYPOGRAPHY_COLOURS).map(([variable, colour]) => [
            `${prefix}/${colour}`,
            // Headings' basic colour is their own, as the theme has it.
            { ...typographyStyle(category, headingVariable(category, variable), `${prefix}/${colour}`), ...followsOf(`${prefix}/${colour}`) }
        ])
    ),
    ...Object.entries(kit.textStyles)
        .filter(([name]) => used.has(name))
        .map(([name, style]: [string, TextStyle]) => {
            const category = style.typography ? categoryOf(name) : undefined
            return [
                name,
                category
                    ? { ...typographyStyle(category, style.paint, name), ...followsOf(name) }
                    : { font: style.font, ...(cssOf(style.paint) ? { color: cssOf(style.paint) } : { colorValue: style.paint.color }), ...followsOf(name), ...usesOf(name) }
            ]
        })
])

// Where a look colours a text or an icon with a variable, e.g. a button label in Text/Danger/Default.
for (const [variable, uses] of colourUses) {
    if (variables[variable]) {
        Object.assign(variables[variable], { usedBy: [...new Map(uses.map((use) => [JSON.stringify(use), use])).values()] })
    }
}

const manifest = {
    $comment:
        'The Lyra design kit\'s map to code. A symbol is a component, named by its layout inputs; a starter is a symbol with a look chosen: layer styles, and text and icon colours. A style, or a colour on a layer, stands for the inputs in usedBy; styles use the theme\'s CSS variables, and a colour variable is a CSS variable. A typography text style\'s class gives a text its typography and colour, e.g. h4 text-hint. follows lists the theme variables a component\'s own parts, or a style, follow: corners, padding, gaps, sizes, borders, fonts and colours. A component\'s notes say what its drawings take for granted that code does otherwise unless it\'s set, e.g. a badge\'s position.',
    kit: 'Lyra design kit',
    version,
    theme: kit.theme,
    docs: DOCS,
    states: STATES,
    variables,
    components,
    layerStyles,
    textStyles
}
const file = join(kitDir, 'lyra-kit.json')
writeFileSync(file, `${JSON.stringify(manifest, null, 1)}\n`)
console.log(`${Object.keys(components).length} components, ${Object.keys(variables).length} variables, ${Object.keys(layerStyles).length + Object.keys(textStyles).length} styles → ${file}`)
