import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { chromium, type Page } from 'playwright'

import { variableName } from '../../docs/src/design-kit-names.ts'
import { COMPONENTS, type ComponentSpec } from './components.ts'
import type { Binding } from './kit.ts'
import { themeFormulas } from './theme-formulas.ts'

/**
 * Captures the components the design kit is made of, as the playground renders them: each component on its
 * specimen page (packages/playground/src/design-kit) in every combination it lists, as a tree of boxes with their
 * fills, borders, corners, shadows, text, icons and flex layout. Run it against the playground (`yarn start`) after
 * `yarn design-kit:tokens`:
 *
 *   yarn design-kit:capture [component …] [--url http://localhost:4200] [--theme default] [--screenshots dir]
 *
 * Colours name the theme variable they come from: the page is rendered a second time with every colour variable of
 * the theme set to a colour of its own, so each colour read there names exactly one variable, even where the theme
 * gives several the same value. A colour that doesn't come from a variable keeps its value.
 */

const root = resolve(import.meta.dirname, '..', '..', '..')
const outputDir = join(root, 'dist', 'design-kit', 'components')

const args = process.argv.slice(2)
const option = (name: string, fallback: string) => {
    const at = args.indexOf(`--${name}`)
    return at >= 0 ? args.splice(at, 2)[1] : fallback
}
const base = option('url', 'http://localhost:4200')
const themeName = option('theme', 'default')
// A picture of each specimen page as it's read, to check the kit's boards against.
// A directory given relative to where the command was run, which Yarn passes on as INIT_CWD.
const screenshotsOption = option('screenshots', '')
const screenshots = screenshotsOption && resolve(process.env['INIT_CWD'] ?? process.cwd(), screenshotsOption)
const components = args.length ? args : Object.keys(COMPONENTS)

/** The components a captured one can hold, by key, as CSS selectors, e.g. an input in a form field. */
const kitSelectors = Object.fromEntries(
    Object.entries(COMPONENTS).flatMap(([key, spec]) => (spec.selector ? [[key, spec.selector]] : []))
)

/** How the components another holds read their inputs and texts, where their classes don't say, e.g. a calendar's cells. */
const kitRefs: Record<string, RefReading> = Object.fromEntries(
    Object.entries(COMPONENTS).flatMap(([key, spec]) => (spec.refInputs || spec.refTexts ? [[key, { inputs: spec.refInputs ?? {}, texts: !!spec.refTexts }]] : []))
)

interface RefReading {
    inputs: NonNullable<ComponentSpec['refInputs']>
    texts: boolean
}

/** The theme areas whose colours become the design tools' colour variables. */
const VARIABLE_GROUPS = ['color', 'background', 'border', 'text', 'outline', 'divider', 'scrollbar']

interface TokenNode {
    $type?: string
    [key: string]: unknown
}

const tokens = JSON.parse(readFileSync(join(root, 'dist', 'design-kit', 'tokens.json'), 'utf8')) as Record<string, TokenNode>
const variables = VARIABLE_GROUPS.flatMap((group) =>
    Object.entries(tokens[group] ?? {})
        .filter(([, token]) => (token as TokenNode).$type === 'color')
        .map(([name]) => `${group}-${name}`)
        .filter((name) => variableName(name))
)

/**
 * The probe colour of the variable at an index: a red of 17 and an alpha of 0.51 mark it, green and blue count. The
 * browser reports it back exactly, and the theme has no colour like it.
 */
const probe = (index: number) => `rgba(17, ${(index + 1) >> 8}, ${(index + 1) & 255}, 0.51)`

export interface Captured {
    component: string
    inputs: Record<string, unknown>
    node: CapturedNode
}

/** The computed styles read from each box. */
export const STYLES = [
    'display',
    'position',
    'flexDirection',
    'flexWrap',
    'justifyContent',
    'alignItems',
    'gap',
    'rowGap',
    'columnGap',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'backgroundColor',
    'backgroundImage',
    'backgroundSize',
    'backgroundRepeat',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
    'boxShadow',
    'outlineWidth',
    'outlineColor',
    'outlineStyle',
    'opacity',
    'zIndex',
    'maskImage',
    'color',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'lineHeight',
    'letterSpacing',
    'textTransform',
    'textAlign',
    'textDecorationLine',
    'textShadow',
    'overflow',
    'transform',
    'flexGrow'
] as const

export type StyleProperty = (typeof STYLES)[number]

/** A box as the browser lays it out, relative to the captured component. */
export interface CapturedNode {
    /** The element's tag, `#text` for text. */
    tag: string
    classes: string[]
    x: number
    y: number
    width: number
    height: number
    style: Partial<Record<StyleProperty, string>>
    text?: string
    /** How many lines the text takes. */
    lines?: number
    icon?: { name: string, pack?: string }
    /** What a picture element shows, e.g. a QR code's SVG or a chart's canvas: SVG markup or a PNG data URL. */
    picture?: string
    /** The URL an image shows, fetched with the page's images. */
    pictureUrl?: string
    /** A Lyra component inside the captured one, e.g. an alert's close button, with its inputs and text. */
    ref?: { component: string, inputs: Record<string, string>, text?: string, texts?: string[], icon?: string }
    /** How the box's measures follow the theme's variables that aren't colours, found by nudging each one. */
    bindings?: Partial<Record<BoundMeasure, Binding>>
    /** A component's width at its content's, which it's wider than where it takes its container's. */
    contentWidth?: number
    /**
     * The component colour variables the box's colours come from, e.g. `header-background-color`, where the theme's
     * colour variable they follow, e.g. `background-basic-color-1`, isn't the whole story: a theme can set them apart.
     */
    colourVariables?: Partial<Record<'fill' | 'border' | 'text', string>>
    children: CapturedNode[]
}

/**
 * The measures of a box that follow theme variables, as design tools set them: each side's padding with its border,
 * as a stack's padding; each border's width; each corner's radius; the gaps; and the text's font.
 */
export const BOUND_MEASURES = [
    'insetTop',
    'insetRight',
    'insetBottom',
    'insetLeft',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
    'columnGap',
    'rowGap',
    'fontSize',
    'lineHeight',
    'fontWeight',
    'letterSpacing',
    'textTransform',
    'fontFamily',
    'boxShadow',
    'width',
    'height'
] as const

export type BoundMeasure = (typeof BOUND_MEASURES)[number]

/** Reads the tagged components on the page as trees of boxes. Runs in the page. */
function read({ properties, selectors, refs }: { properties: ReadonlyArray<StyleProperty>, selectors: Record<string, string>, refs: Record<string, RefReading> }): Captured[] {
    const DEFAULTS: Record<string, string> = {
        flexWrap: 'nowrap',
        backgroundImage: 'none',
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        boxShadow: 'none',
        opacity: '1',
        textTransform: 'none',
        textDecorationLine: 'none',
        textShadow: 'none',
        overflow: 'visible',
        position: 'static',
        zIndex: 'auto',
        maskImage: 'none',
        fontStyle: 'normal',
        flexGrow: '0'
    }

    const styleOf = (element: Element, pseudo?: string) => {
        const computed = getComputedStyle(element, pseudo)
        const style: Partial<Record<StyleProperty, string>> = {}
        for (const property of properties) {
            const value = computed[property]
            if (value !== DEFAULTS[property] && value !== '') {
                style[property] = value
            }
        }
        return style
    }

    /** A Lyra component inside the captured one that the kits have symbols of, with the inputs its classes show. */
    // The inputs a component's classes show, e.g. `status-danger`.
    const classInputs = (element: Element) => {
        const inputs: Record<string, string> = {}
        for (const name of element.classList) {
            const match = /^(appearance|size|status|shape)-(.+)$/.exec(name)
            if (match) {
                inputs[match[1]] = match[2]
            }
        }
        return inputs
    }

    const refOf = (element: Element): CapturedNode['ref'] => {
        // A component of the kit: its inputs, the state it's in and, for a field, what it shows. A button is the kit's
        // button with text, its icon button without.
        const isButton = element.matches('[nbButton], [nbbutton]')
        const text = element.textContent?.trim() ?? ''
        // A button of more than text and icons, e.g. a flag, is drawn in place.
        const plain = !element.querySelector(':not(nb-icon, nb-icon *, span)')
        const buttonKey = isButton && plain ? (text ? 'button' : 'icon-button') : undefined
        const key = isButton ? (buttonKey && selectors[buttonKey] ? buttonKey : undefined) : Object.keys(selectors).find((candidate) => element.matches(selectors[candidate]))
        if (key) {
            const field = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element : undefined
            const disabled = (element as HTMLInputElement).disabled || element.classList.contains('disabled')
            const icon = element.querySelector('nb-icon')
            const inputs: Record<string, string> = {
                ...classInputs(element),
                state: element.getAttribute('data-kit-forced') ?? (disabled ? 'disabled' : 'default'),
                ...(field ? { content: field.value ? 'value' : 'placeholder' } : {}),
                ...(key === 'button' ? { icon: element.classList.contains('icon-start') ? 'start' : element.classList.contains('icon-end') ? 'end' : 'none' } : {})
            }
            // Inputs the component's spec reads from classes, its own or a container's, e.g. a calendar cell's state.
            const reading = refs[key]
            for (const [input, { from, classes = {}, has = {}, otherwise, count }] of Object.entries(reading?.inputs ?? {})) {
                const source = from ? element.closest(from) : element
                const found = Object.keys(classes).find((name) => source?.classList.contains(name))
                const holds = Object.keys(has).find((selector) => source?.querySelector(selector))
                const value = count ? String(element.querySelectorAll(count).length) : found ? classes[found] : holds ? has[holds] : otherwise
                if (value !== undefined) {
                    inputs[input] = value
                }
            }
            // Its texts, in order, e.g. a step's number and label, where its symbol shows others.
            const texts: string[] = []
            if (reading?.texts) {
                const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
                for (let node = walker.nextNode(); node; node = walker.nextNode()) {
                    const value = node.textContent?.trim()
                    if (value && node.parentElement?.checkVisibility()) {
                        texts.push(value)
                    }
                }
            }
            return {
                component: key,
                inputs,
                ...(field ? { text: field.value || field.placeholder } : key === 'button' ? { text } : {}),
                ...(texts.length ? { texts } : {}),
                ...(icon ? { icon: iconOf(icon).name } : {})
            }
        }
        // A button of an icon alone is the kit's icon button; one with text or more, e.g. a flag, is drawn in place,
        // as buttons aren't captured yet.
        if (element.matches('[nbButton], [nbbutton]') && !element.textContent?.trim() && !element.querySelector(':scope > :not(nb-icon)')) {
            return { component: 'icon-button', inputs: classInputs(element) }
        }
        return undefined
    }

    /**
     * An element's `::before` or `::after` as a box, if it draws one: positioned absolutely, as Lyra's are, e.g. a
     * card's accent; its place is worked out from its offsets, as the browser has no box for it.
     */
    const pseudoOf = (element: Element, pseudo: string, box: DOMRect, origin: DOMRect): CapturedNode | undefined => {
        const computed = getComputedStyle(element, pseudo)
        if (computed.content === 'none' || computed.display === 'none') {
            return undefined
        }
        const width = parseFloat(computed.width)
        const height = parseFloat(computed.height)
        const parent = getComputedStyle(element)
        let left = parseFloat(computed.left) + parseFloat(parent.borderLeftWidth)
        let top = parseFloat(computed.top) + parseFloat(parent.borderTopWidth)
        if (computed.position !== 'absolute') {
            // In the flow: placed as its element aligns its content, where it's all the element holds, e.g. a page
            // indicator's dot in its button; or in a flex box, in the room before or after the rest, e.g. a divider's
            // lines on either side of its label.
            const inset = (side: 'Left' | 'Top' | 'Right' | 'Bottom') => parseFloat(parent[`border${side}Width`]) + parseFloat(parent[`padding${side}`])
            const innerWidth = box.width - inset('Left') - inset('Right')
            const innerHeight = box.height - inset('Top') - inset('Bottom')
            const flex = parent.display.includes('flex')
            const along = (value: string, room: number) => (/center/.test(value) ? room / 2 : /end/.test(value) ? room : 0)
            const rest = Array.from(element.children).map((child) => child.getBoundingClientRect())
            if (!rest.length && !element.textContent?.trim()) {
                left = inset('Left') + (flex ? along(parent.justifyContent, innerWidth - width) : 0)
                top = inset('Top') + (flex ? along(parent.alignItems, innerHeight - height) : 0)
            } else if (flex && rest.length) {
                const row = !parent.flexDirection.startsWith('column')
                const gap = parseFloat(row ? parent.columnGap : parent.rowGap) || 0
                const start = row ? inset('Left') : inset('Top')
                const end = row ? box.width - inset('Right') : box.height - inset('Bottom')
                const first = row ? rest[0].left - box.left : rest[0].top - box.top
                const last = row ? rest[rest.length - 1].right - box.left : rest[rest.length - 1].bottom - box.top
                const [from, to] = pseudo === '::before' ? [start, first - gap] : [last + gap, end]
                if (to - from < 0.5) {
                    return undefined
                }
                if (row) {
                    return place(from, inset('Top') + along(parent.alignItems, innerHeight - height), to - from, height)
                }
                return place(inset('Left') + along(parent.alignItems, innerWidth - width), from, width, to - from)
            } else {
                return undefined
            }
        }
        return place(left, top, width, height)

        function place(x: number, y: number, w: number, h: number): CapturedNode | undefined {
            if (!(w > 0 && h > 0) || Number.isNaN(x) || Number.isNaN(y)) {
                return undefined
            }
            return { tag: pseudo, classes: [], x: box.x + x - origin.x, y: box.y + y - origin.y, width: w, height: h, style: styleOf(element, pseudo), children: [] }
        }
    }

    /** An icon's name and pack, from the component itself through Angular's debugging API, as the DOM has neither. */
    const iconOf = (element: Element) => {
        const debug = (window as unknown as { ng?: { getComponent: (element: Element) => unknown } }).ng
        const component = debug?.getComponent(element) as { icon?: () => string | undefined, pack?: () => string | undefined, config?: () => unknown } | null | undefined
        const config = component?.config?.()
        const fromConfig = typeof config === 'string' ? { icon: config } : (config as { icon?: string, pack?: string } | undefined)
        return {
            name: fromConfig?.icon ?? component?.icon?.() ?? element.getAttribute('icon') ?? '',
            pack: fromConfig?.pack ?? component?.pack?.() ?? element.getAttribute('pack') ?? undefined
        }
    }

    /** What an open component's overlay shows: its pane's content, e.g. a select's option list. */
    const overlayOf = (element: Element) => {
        // What the element opens (aria-controls), or what describes it, e.g. a tooltip (aria-describedby).
        const controller =
            [element, ...Array.from(element.querySelectorAll('[aria-controls], [aria-describedby]'))].find((candidate) =>
                candidate.matches('[aria-controls], [aria-describedby]')
            ) ?? null
        const id = (controller?.getAttribute('aria-controls') ?? controller?.getAttribute('aria-describedby'))?.split(/\s+/).pop()
        const controlled = id ? document.getElementById(id) : null
        return controlled?.closest('.cdk-overlay-pane')?.firstElementChild ?? controlled
    }

    const visit = (element: Element, origin: DOMRect, top: boolean): CapturedNode | undefined => {
        const computed = getComputedStyle(element)
        // Hidden, or there only for assistive technology, e.g. a file drop's native input. A transparent element
        // stays, as a layer that shows in some states only, e.g. a slider's value.
        if (computed.display === 'none' || computed.visibility === 'hidden' || element.matches('.visually-hidden, .cdk-visually-hidden')) {
            return undefined
        }
        const box = element.getBoundingClientRect()
        const node: CapturedNode = {
            tag: element.tagName.toLowerCase(),
            classes: Array.from(element.classList).filter((name) => !name.startsWith('ng-')),
            x: box.x - origin.x,
            y: box.y - origin.y,
            width: box.width,
            height: box.height,
            style: styleOf(element),
            children: []
        }
        const ref = top ? undefined : refOf(element)
        if (ref) {
            node.ref = ref
            // A button isn't a component of the kit yet: its look comes from the kit's buttons, so it's read no further.
            if (!selectors[ref.component]) {
                const icon = element.querySelector('nb-icon')
                if (icon) {
                    node.icon = iconOf(icon)
                }
                return node
            }
        }
        if (node.tag === 'nb-icon') {
            node.icon = iconOf(element)
            return node
        }
        // A picture is drawn as it shows: an SVG with its computed colours written in, a canvas's or a video's
        // frame as a PNG, an image by its URL.
        if (element instanceof SVGSVGElement) {
            const copy = element.cloneNode(true) as SVGSVGElement
            const originals = [element, ...Array.from(element.querySelectorAll('*'))]
            const copies = [copy, ...Array.from(copy.querySelectorAll('*'))]
            originals.forEach((original, index) => {
                const style = getComputedStyle(original)
                for (const property of ['fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'stroke-opacity', 'font-family', 'font-size', 'font-weight']) {
                    const value = style.getPropertyValue(property)
                    if (value && value !== 'none' && !(property === 'opacity' && value === '1')) {
                        copies[index].setAttribute(property, value)
                    }
                }
            })
            copy.setAttribute('width', String(box.width))
            copy.setAttribute('height', String(box.height))
            node.picture = new XMLSerializer().serializeToString(copy)
            return node
        }
        if (element instanceof HTMLCanvasElement || element instanceof HTMLVideoElement) {
            try {
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(box.width * 2)
                canvas.height = Math.round(box.height * 2)
                // A video that hasn't started shows its poster.
                const poster = element instanceof HTMLVideoElement && element.paused && element.currentTime === 0 ? (element as HTMLVideoElement & { kitPoster?: HTMLImageElement }).kitPoster : undefined
                canvas.getContext('2d')?.drawImage(poster ?? element, 0, 0, canvas.width, canvas.height)
                node.picture = canvas.toDataURL('image/png')
            } catch {
                // A canvas or video from another origin can't be read.
            }
            return node
        }
        if (element instanceof HTMLImageElement && element.currentSrc) {
            node.pictureUrl = element.currentSrc
            return node
        }
        // A field's value or placeholder isn't a text node: it's drawn in the field's content box.
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            const placeholder = !element.value
            const text = element.value || element.placeholder
            if (text) {
                const field = getComputedStyle(element)
                const left = parseFloat(field.borderLeftWidth) + parseFloat(field.paddingLeft)
                const right = parseFloat(field.borderRightWidth) + parseFloat(field.paddingRight)
                const lineHeight = parseFloat(field.lineHeight) || parseFloat(field.fontSize) * 1.2
                node.children.push({
                    tag: '#text',
                    classes: placeholder ? ['placeholder'] : [],
                    x: box.x + left - origin.x,
                    // An input's line is centred; a textarea's first line starts at its top.
                    y:
                        element instanceof HTMLTextAreaElement
                            ? box.y + parseFloat(field.borderTopWidth) + parseFloat(field.paddingTop) - origin.y
                            : box.y + (box.height - lineHeight) / 2 - origin.y,
                    width: box.width - left - right,
                    height: lineHeight,
                    lines: 1,
                    // A placeholder sits on the field's line, whatever line height ::placeholder reports.
                    style: placeholder ? { ...styleOf(element, '::placeholder'), lineHeight: field.lineHeight } : {},
                    text,
                    children: []
                })
            }
        }
        const before = pseudoOf(element, '::before', box, origin)
        if (before) {
            node.children.push(before)
        }
        for (const child of Array.from(element.childNodes)) {
            // Text drawn in a transparent colour doesn't show, e.g. a skeleton's placeholder words.
            if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim() && !/^rgba\(.*,\s*0\)$/.test(computed.color)) {
                const range = document.createRange()
                range.selectNodeContents(child)
                const rect = range.getBoundingClientRect()
                const lines = new Set(Array.from(range.getClientRects()).map((line) => Math.round(line.top))).size
                node.children.push({
                    lines,
                    tag: '#text',
                    classes: [],
                    x: rect.x - origin.x,
                    y: rect.y - origin.y,
                    width: rect.width,
                    height: rect.height,
                    style: {},
                    text: child.textContent.trim(),
                    children: []
                })
            } else if (child instanceof Element) {
                const visited = visit(child, origin, false)
                if (visited) {
                    node.children.push(visited)
                }
            }
        }
        const after = pseudoOf(element, '::after', box, origin)
        if (after) {
            node.children.push(after)
        }
        // An open component's overlay, e.g. a select's option list, is part of it, placed where it shows.
        if (top && element.hasAttribute('data-kit-open')) {
            const content = overlayOf(element)
            const overlay = content ? visit(content, origin, false) : undefined
            if (overlay) {
                overlay.style.position = 'absolute'
                node.children.push(overlay)
            }
        }
        return node
    }

    return Array.from(document.querySelectorAll('[data-kit]')).flatMap((element) => {
        const { component, ...inputs } = JSON.parse(element.getAttribute('data-kit') ?? '{}') as { component: string }
        // `data-kit-overlay-only`: the component is its overlay alone, e.g. a context menu without what opens it.
        const overlay = element.hasAttribute('data-kit-overlay-only') ? overlayOf(element) : undefined
        const node = overlay ? visit(overlay, overlay.getBoundingClientRect(), true) : visit(element, element.getBoundingClientRect(), true)
        // How wide its content is, which it's no wider than where it sizes to it, e.g. a button; one wider takes its
        // container's width, e.g. a list item.
        if (node && !overlay && element instanceof HTMLElement) {
            const width = element.style.width
            element.style.width = 'max-content'
            node.contentWidth = element.getBoundingClientRect().width
            element.style.width = width
        }
        return node ? [{ component, inputs, node }] : []
    })
}

/** The pseudo-classes a state forces: pressing is under the pointer too, keyboard focus is focus-visible too. */
const PSEUDO_CLASSES: Record<string, string[]> = {
    hover: ['hover'],
    focus: ['focus', 'focus-visible', 'focus-within'],
    active: ['hover', 'active']
}

async function open(page: Page, component: string, variant: string) {
    await page.goto(`${base}/design-kit/${component}?theme=${themeName}${variant ? `&${variant}` : ''}`)
    await page.waitForSelector('[data-kit]')
    await page.evaluate(() => document.fonts.ready)
    // Videos' posters, loaded to be drawn where a video shows one.
    await page.evaluate(() =>
        Promise.all(
            Array.from(document.querySelectorAll('video'))
                .filter((video) => video.poster)
                .map(
                    (video) =>
                        new Promise<void>((done) => {
                            const image = new Image()
                            image.onload = () => {
                                ;(video as HTMLVideoElement & { kitPoster?: HTMLImageElement }).kitPoster = image
                                done()
                            }
                            image.onerror = () => done()
                            image.src = video.poster
                        })
                )
        )
    )
    // Values forms write a moment after the first render, e.g. a colour picker's, show before anything is read.
    await page.waitForTimeout(1000)
    // No transitions, so a state or the probe colours show at once.
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' })
    // Nor the playground's toolbar, above the page: fixed parts, e.g. a layout's header, are placed against the window.
    await page.addStyleTag({ content: 'npg-app-root > .toolbar { display: none !important; }' })
    await forceStates(page)
    await openOverlays(page)
    // Let transitions finish, e.g. a theme's colours fading in, or a state's.
    await page.waitForTimeout(500)
}

/** Opens the components a specimen tags with `data-kit-open`, e.g. a select's option list, as a user would. */
async function openOverlays(page: Page) {
    await page.evaluate(() => {
        interface Opener {
            show?: () => void
            datepicker?: () => Opener
            overlay?: Opener
        }
        const debug = (window as unknown as { ng?: { getComponent: (element: Element) => unknown, getDirectives: (element: Element) => unknown[] } }).ng
        for (const tagged of Array.from(document.querySelectorAll('[data-kit-open]'))) {
            // `data-kit-open` can name the element inside to open, e.g. a datepicker's input.
            const element = (tagged.getAttribute('data-kit-open') && tagged.querySelector(tagged.getAttribute('data-kit-open') ?? '')) || tagged
            // The component itself, e.g. a select, or a directive on it, e.g. a timepicker's, or the picker a
            // directive opens, e.g. a datepicker's.
            const candidates = [debug?.getComponent(element), ...(debug?.getDirectives(element) ?? [])] as Array<Opener | null | undefined>
            // A show() that takes nothing opens; one that takes something does something else, e.g. a colour
            // picker's sets its field's text.
            const opener =
                candidates.find((candidate) => candidate?.show && candidate.show.length === 0) ?? candidates.find((candidate) => candidate?.datepicker)?.datepicker?.()
            if (opener) {
                opener.show?.()
            } else if (candidates.some((candidate) => candidate?.overlay)) {
                // …or a component that opens its overlay when the user focuses or clicks it, e.g. a colour picker,
                // clicked as a user would: a focus from a script doesn't open it.
                const field = element.querySelector('input') ?? (element as HTMLElement)
                field.focus()
                field.click()
            }
        }
    })
    // Once open, as they move focus a moment later: only the last one opened would keep focus and its keyboard
    // highlight, and look focused, so none does; forced states show focus.
    await page.waitForTimeout(300)
    await page.evaluate(() => {
        const debug = (window as unknown as { ng?: { getComponent: (element: Element) => unknown } }).ng
        // A select's list, not an overlay a component keeps open while it has focus, e.g. a colour picker's.
        if (document.activeElement?.closest('nb-option-list')) {
            ;(document.activeElement as HTMLElement).blur()
        }
        for (const highlighted of Array.from(document.querySelectorAll('nb-option.active'))) {
            ;(debug?.getComponent(highlighted) as { setInactiveStyles?: () => void } | null)?.setInactiveStyles?.()
        }
    })
}

/**
 * Puts the components a specimen tags with `data-kit-state` (hover, focus, active) in that state, as the browser's
 * developer tools do: on the component, or on the elements inside it `data-kit-target` selects, e.g. a slider's thumbs.
 */
async function forceStates(page: Page) {
    const session = await page.context().newCDPSession(page)
    await session.send('DOM.enable')
    await session.send('CSS.enable')
    const { root: documentNode } = await session.send('DOM.getDocument', { depth: 0 })
    const { nodeIds } = await session.send('DOM.querySelectorAll', { nodeId: documentNode.nodeId, selector: '[data-kit-state]' })
    for (const nodeId of nodeIds) {
        const { attributes } = await session.send('DOM.getAttributes', { nodeId })
        const attribute = (name: string) => {
            const at = attributes.indexOf(name)
            return at >= 0 ? attributes[at + 1] : undefined
        }
        const pseudoClasses = PSEUDO_CLASSES[attribute('data-kit-state') ?? '']
        if (!pseudoClasses) {
            continue
        }
        // Every element the target selects, e.g. both of a range slider's thumbs; a state can have a target of its
        // own, e.g. a checkbox's box under the pointer and its native input with focus.
        const selector = attribute(`data-kit-target-${attribute('data-kit-state')}`) ?? attribute('data-kit-target')
        const targets = selector ? (await session.send('DOM.querySelectorAll', { nodeId, selector })).nodeIds : [nodeId]
        for (const target of targets) {
            await session.send('CSS.forcePseudoState', { nodeId: target, forcedPseudoClasses: pseudoClasses })
            // So a component of the kit inside the captured one knows the state it's in.
            await session.send('DOM.setAttributeValue', { nodeId: target, name: 'data-kit-forced', value: attribute('data-kit-state') ?? '' })
        }
    }
}

/** Renders the page again with each colour variable set to its probe colour. */
async function probeVariables(page: Page) {
    const declarations = variables.map((name, index) => `--${name}: ${probe(index)} !important;`).join('\n')
    await page.addStyleTag({ content: `body, body[class] { ${declarations} }` })
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))))
}

/** The colours in a style value, as the variables they come from, e.g. `var(color-primary-500)`. */
function nameColours(real: string, probed: string): string {
    const colour = /rgba?\([^)]*\)/g
    const realColours = real.match(colour) ?? []
    let at = 0
    return probed.replace(colour, (found) => {
        const value = realColours[at++] ?? found
        const match = /^rgba\(17, (\d+), (\d+), 0\.51\)$/.exec(found)
        if (!match) {
            return value
        }
        const variable = variables[Number(match[1]) * 256 + Number(match[2]) - 1]
        return variable ? `var(${variable}, ${value})` : value
    })
}

const COLOUR_STYLES: StyleProperty[] = [
    'backgroundColor',
    'backgroundImage',
    'backgroundSize',
    'backgroundRepeat',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'boxShadow',
    'outlineColor',
    'color',
    'textShadow'
]

/** Puts the variable names the probed tree found into the real tree's colours. */
function merge(real: CapturedNode, probed: CapturedNode | undefined) {
    if (probed) {
        for (const property of COLOUR_STYLES) {
            const value = real.style[property]
            if (value !== undefined && probed.style[property] !== undefined) {
                real.style[property] = nameColours(value, probed.style[property])
            }
        }
    }
    real.children.forEach((child, index) => merge(child, probed?.children[index]))
}

/** Text colour: a text node takes its element's. */
function inheritText(node: CapturedNode, parent?: CapturedNode) {
    if (node.tag === '#text' && parent) {
        const textStyles: StyleProperty[] = ['color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'textAlign', 'textDecorationLine', 'textShadow']
        for (const property of textStyles) {
            // A placeholder keeps its own colour and font, read from ::placeholder.
            if (parent.style[property] !== undefined && node.style[property] === undefined) {
                node.style[property] = parent.style[property]
            }
        }
    }
    node.children.forEach((child) => inheritText(child, node))
}

/**
 * The theme variables the components on the page use, as the rules that style them name them, with their values.
 * Runs in the page.
 */
function themeVariablesInUse(): Array<{ name: string, value: string }> {
    // States are forced while reading, and pseudo-elements are their elements' parts, so a rule counts without them.
    const STATES = /::?(hover|focus|focus-visible|focus-within|active|checked|disabled|enabled|before|after|placeholder)\b/g
    const used = new Set<string>()
    // Inside a tagged component, or around one, whose fonts and colours it inherits, e.g. a table's header row around
    // a tagged header cell.
    const inKit = (element: Element) => !!element.closest('[data-kit], .cdk-overlay-container') || !!element.querySelector('[data-kit]')
    const visit = (rules: CSSRuleList) => {
        for (const rule of Array.from(rules)) {
            if ('cssRules' in rule && rule.cssRules) {
                visit(rule.cssRules as CSSRuleList)
            }
            if (!(rule instanceof CSSStyleRule) || !rule.style.cssText.includes('var(--') || rule.selectorText.startsWith('.nb-theme-')) {
                continue
            }
            let matches: Element[] = []
            try {
                matches = Array.from(document.querySelectorAll(rule.selectorText.replace(STATES, '')))
            } catch {
                continue
            }
            if (matches.some(inKit)) {
                for (const match of rule.style.cssText.matchAll(/var\(--([\w-]+)/g)) {
                    used.add(match[1])
                }
            }
        }
    }
    for (const sheet of Array.from(document.styleSheets)) {
        try {
            visit(sheet.cssRules)
        } catch {
            // A sheet from another origin can't be read, and isn't Lyra's.
        }
    }
    const body = getComputedStyle(document.body)
    return [...used].map((name) => ({ name, value: body.getPropertyValue(`--${name}`).trim() }))
}

/** How much a nudge moves a variable's part, e.g. 4 pixels; keywords and fonts are swapped, not moved. */
interface Nudge {
    variable: string
    part: number
    value: string
    by?: number
}

const NUDGE = 4

/** A value's parts, split at spaces outside brackets, e.g. a padding's vertical and horizontal parts. */
export function partsOf(value: string): string[] {
    const parts: string[] = []
    let depth = 0
    let current = ''
    for (const character of value.trim()) {
        depth += character === '(' ? 1 : character === ')' ? -1 : 0
        if (/\s/.test(character) && depth === 0) {
            if (current) {
                parts.push(current)
            }
            current = ''
        } else {
            current += character
        }
    }
    return current ? [...parts, current] : parts
}

const TEXT_CASES = ['none', 'uppercase', 'lowercase', 'capitalize']
const SHADOW_PROBE = '0 0 0 7px rgb(1, 2, 3)'
/** The probe shadow as the browser reports it, alone: a box with another shadow too, e.g. a focus ring, isn't bound. */
const SHADOW_PROBED = 'rgb(1, 2, 3) 0px 0px 0px 7px'

/**
 * The nudges that show what a variable sets: each length part moved by a few pixels; a number, e.g. a font weight,
 * by a step; a text case or a font swapped. Colours have probes of their own, and other values, e.g. shadows or
 * cursors, aren't measures of the kit's.
 */
function nudgesOf(name: string, value: string): Nudge[] {
    // A shadow is swapped for a probe of its own, e.g. a card's or a header's.
    if (name.endsWith('shadow') && value) {
        return [{ variable: name, part: 0, value: SHADOW_PROBE }]
    }
    if (/color|shadow|cursor|background/.test(name) || !value) {
        return []
    }
    if (name.endsWith('font-family')) {
        return [{ variable: name, part: 0, value: '"Lyra Probe"' }]
    }
    if (name.endsWith('text-transform')) {
        return [{ variable: name, part: 0, value: TEXT_CASES.find((textCase) => textCase !== value) ?? 'none' }]
    }
    // A bare 0 is a length, e.g. a menu item's radius; numbers are weights and the like.
    if (/^-?[\d.]+$/.test(value) && value !== '0') {
        const number = Number(value)
        const by = number >= 100 ? (number >= 900 ? -100 : 100) : 1
        return [{ variable: name, part: 0, value: String(number + by), by }]
    }
    const parts = partsOf(value)
    // Lengths in pixels or rems: an `em` or a percentage depends on where it's used.
    const isLength = (part: string) => part === '0' || (/^(-?[\d.]+(px|rem)|calc\(.*\))$/.test(part) && !/em\b|%|var\(/.test(part.replace(/rem/g, '')))
    if (!parts.length || !parts.every(isLength)) {
        return []
    }
    return parts.map((_, index) => ({
        variable: name,
        part: index,
        value: parts.map((part, at) => (at === index ? `calc(${part === '0' ? '0px' : part} + ${NUDGE}px)` : part)).join(' '),
        by: NUDGE
    }))
}

/** A box's measures, as design tools set them; a text's font is its element's. */
function measuresOf(node: CapturedNode, parent: CapturedNode | undefined): Partial<Record<BoundMeasure, string>> {
    const style = node.style
    const text = node.tag === '#text' && parent ? { ...parent.style, ...style } : style
    const inset = (side: 'Top' | 'Right' | 'Bottom' | 'Left') =>
        String(px(style[`padding${side}`]) + ((style[`border${side}Style`] ?? 'none') === 'none' ? 0 : px(style[`border${side}Width`])))
    return {
        insetTop: inset('Top'),
        insetRight: inset('Right'),
        insetBottom: inset('Bottom'),
        insetLeft: inset('Left'),
        borderTopWidth: style.borderTopWidth,
        borderRightWidth: style.borderRightWidth,
        borderBottomWidth: style.borderBottomWidth,
        borderLeftWidth: style.borderLeftWidth,
        borderTopLeftRadius: style.borderTopLeftRadius,
        borderTopRightRadius: style.borderTopRightRadius,
        borderBottomRightRadius: style.borderBottomRightRadius,
        borderBottomLeftRadius: style.borderBottomLeftRadius,
        columnGap: style.columnGap,
        rowGap: style.rowGap,
        fontSize: text.fontSize,
        lineHeight: text.lineHeight,
        fontWeight: text.fontWeight,
        letterSpacing: text.letterSpacing,
        textTransform: text.textTransform ?? 'none',
        fontFamily: text.fontFamily,
        boxShadow: style.boxShadow ?? 'none',
        // A size the styles set rather than the layout, e.g. a selected menu item's indicator or an alert's accent.
        ...(node.tag[0] === ':' || style.position === 'absolute' ? { width: String(node.width), height: String(node.height) } : {})
    }
}

const px = (value: string | undefined) => parseFloat(value ?? '') || 0

/** Records in the real tree how its measures moved in the nudged one: by how much, or to which variable's value. */
function bind(real: CapturedNode, nudged: CapturedNode, nudge: Nudge, parent?: CapturedNode, nudgedParent?: CapturedNode) {
    const before = measuresOf(real, parent)
    const after = measuresOf(nudged, nudgedParent)
    for (const measure of BOUND_MEASURES) {
        if (before[measure] === after[measure]) {
            continue
        }
        const bindings = (real.bindings ??= {})
        if (nudge.by === undefined) {
            // A font swapped can move other measures, e.g. a line height of `normal`; it sets only the font.
            if (measure === 'textTransform' || measure === 'fontFamily' || (measure === 'boxShadow' && after[measure] === SHADOW_PROBED)) {
                bindings[measure] = { variable: nudge.variable }
            }
            continue
        }
        const per = Math.round(((px(after[measure]) - px(before[measure])) / nudge.by) * 1000) / 1000
        if (per) {
            const binding = (bindings[measure] ??= {})
            binding.terms = [...(binding.terms ?? []), { variable: nudge.variable, part: nudge.part, per }]
        }
    }
    // Nudges don't change what's on the page; where they do, e.g. an overlay that closed, the rest isn't compared.
    if (real.children.length === nudged.children.length) {
        real.children.forEach((child, index) => bind(child, nudged.children[index], nudge, real, nudged))
    }
}

/**
 * Finds what each theme variable the components use sets, by nudging it and reading the page again: a few dozen
 * reads, each in milliseconds. The other variables keep their values meanwhile, so a nudge shows only what its
 * variable sets itself, not what the theme's formulas make of it, e.g. a rectangle button's radius follows
 * `button-rectangle-border-radius`, which follows `border-radius`: design tools work the formulas out as they apply a
 * theme.
 */
async function bindAll(page: Page, captured: Captured[], used: Array<{ name: string, value: string }>, readArgs: Parameters<typeof read>[0]) {
    const held = used.filter(({ value }) => value).map(({ name, value }) => `--${name}: ${value} !important;`)
    for (const { name, value } of used) {
        for (const nudge of nudgesOf(name, value)) {
            await page.evaluate((css) => {
                const style = document.createElement('style')
                style.id = 'kit-nudge'
                style.textContent = css
                document.head.append(style)
            }, `body, body[class] { ${held.join(' ')} --${nudge.variable}: ${nudge.value} !important; }`)
            const nudged = await page.evaluate(read, readArgs)
            await page.evaluate(() => document.getElementById('kit-nudge')?.remove())
            captured.forEach((entry, index) => {
                const other = nudged[index]?.node
                if (other) {
                    bind(entry.node, other, nudge)
                }
            })
        }
    }
}

/**
 * The probe colour of the component colour variable at an index: a red of 19 and an alpha of 0.53 mark it, unlike the
 * theme's colour variables' probes.
 */
const componentProbe = (index: number) => `rgba(19, ${(index + 1) >> 8}, ${(index + 1) & 255}, 0.53)`

/**
 * Finds the component colour variables the boxes' colours come from, e.g. a header's background from
 * `header-background-color`, in one read with each set to a probe colour of its own: the theme's colour variables
 * they follow by default are named by their own probes.
 */
async function bindColours(page: Page, captured: Captured[], used: Array<{ name: string, value: string }>, readArgs: Parameters<typeof read>[0]) {
    const colours = used.filter(({ name, value }) => /color/.test(name) && !variableName(name) && /^(#|rgba?\(|hsla?\(|transparent)/.test(value)).map(({ name }) => name)
    if (!colours.length) {
        return
    }
    await page.evaluate((css) => {
        const style = document.createElement('style')
        style.id = 'kit-colours'
        style.textContent = css
        document.head.append(style)
    }, `body, body[class] { ${colours.map((name, index) => `--${name}: ${componentProbe(index)} !important;`).join(' ')} }`)
    const probed = await page.evaluate(read, readArgs)
    await page.evaluate(() => document.getElementById('kit-colours')?.remove())
    const variableOf = (value: string | undefined) => {
        const match = /^rgba\(19, (\d+), (\d+), 0\.53\)$/.exec(value ?? '')
        return match ? colours[Number(match[1]) * 256 + Number(match[2]) - 1] : undefined
    }
    const visit = (real: CapturedNode, other: CapturedNode) => {
        const fill = variableOf(other.style.backgroundColor)
        // A border's colour where it's drawn; one that isn't, e.g. with no style, has the text's colour.
        const border = (['Top', 'Right', 'Bottom', 'Left'] as const)
            .filter((side) => (other.style[`border${side}Style`] ?? 'none') !== 'none' && px(other.style[`border${side}Width`]) > 0)
            .map((side) => variableOf(other.style[`border${side}Color`]))
            .find(Boolean)
        const text = variableOf(other.style.color)
        if (fill || border || text) {
            real.colourVariables = { ...(fill ? { fill } : {}), ...(border ? { border } : {}), ...(text ? { text } : {}) }
        }
        if (real.children.length === other.children.length) {
            real.children.forEach((child, index) => visit(child, other.children[index]))
        }
    }
    captured.forEach((entry, index) => {
        const other = probed[index]?.node
        if (other) {
            visit(entry.node, other)
        }
    })
}

/**
 * The images the captured components show, e.g. a flag as a background or an avatar as an image, by their URLs, as
 * the page loads them: SVG markup, or a raster image's data URL.
 */
async function imagesOf(page: Page, captured: Captured[]): Promise<Record<string, string>> {
    const urls = new Set<string>()
    const collect = (node: CapturedNode) => {
        for (const match of (node.style.backgroundImage ?? '').matchAll(/url\("([^"]+)"\)/g)) {
            urls.add(match[1])
        }
        if (node.pictureUrl) {
            urls.add(node.pictureUrl)
        }
        node.children.forEach(collect)
    }
    captured.forEach((entry) => collect(entry.node))
    return page.evaluate(async (list) => {
        const svgs: Record<string, string> = {}
        for (const url of list) {
            try {
                const response = await fetch(url)
                const blob = await response.blob()
                if (blob.type.includes('svg')) {
                    svgs[url] = await blob.text()
                } else if (blob.type.startsWith('image/')) {
                    // A raster image as a data URL, which design tools take.
                    svgs[url] = await new Promise<string>((done) => {
                        const reader = new FileReader()
                        reader.onload = () => done(String(reader.result))
                        reader.readAsDataURL(blob)
                    })
                }
            } catch {
                // An image that doesn't load isn't drawn.
            }
        }
        return svgs
    }, [...urls])
}

const browser = await chromium.launch()
// Tall, so overlays open below their components as they do with room, not flipped above them.
// Twice as dense as the screen, so pictures of rich content are sharp.
const tab = await browser.newPage({ viewport: { width: 1600, height: 8000 }, deviceScaleFactor: 2 })
mkdirSync(outputDir, { recursive: true })
for (const component of components) {
    // A component can need a viewport of its own, e.g. a layout's, and pages of its own, e.g. one per sidebar state.
    const spec = COMPONENTS[component]
    await tab.setViewportSize(spec?.viewport ?? { width: 1600, height: 8000 })
    const real: Captured[] = []
    const images: Record<string, string> = {}
    for (const variant of spec?.variants ?? ['']) {
        await tab.setViewportSize(spec?.viewports?.[variant] ?? spec?.viewport ?? { width: 1600, height: 8000 })
        await open(tab, component, variant)
        if (screenshots) {
            mkdirSync(screenshots, { recursive: true })
            // Just the specimens and their overlays, not the tall page around them.
            const clip = await tab.evaluate(() => {
                const boxes = Array.from(document.querySelectorAll('[data-kit], .cdk-overlay-pane'))
                    .map((element) => element.getBoundingClientRect())
                    .filter((box) => box.width && box.height)
                const left = Math.max(0, Math.min(...boxes.map((box) => box.left)) - 16)
                const top = Math.max(0, Math.min(...boxes.map((box) => box.top + scrollY)) - 16)
                return { x: left, y: top, width: Math.max(...boxes.map((box) => box.right)) + 16 - left, height: Math.max(...boxes.map((box) => box.bottom + scrollY)) + 16 - top }
            })
            await tab.screenshot({ path: join(screenshots, `${[component, variant].filter(Boolean).join('-').replace(/[^\w-]+/g, '-')}.png`), fullPage: true, clip, scale: 'css' })
        }
        const selectors = Object.fromEntries(Object.entries(kitSelectors).filter(([key]) => !spec?.inline?.includes(key)))
        const captured = await tab.evaluate(read, { properties: STYLES, selectors, refs: kitRefs })
        // What the theme's variables set, before the colour probes change the page.
        const inUse = await tab.evaluate(themeVariablesInUse)
        await bindAll(tab, captured, inUse, { properties: STYLES, selectors, refs: kitRefs })
        await bindColours(tab, captured, inUse, { properties: STYLES, selectors, refs: kitRefs })
        await probeVariables(tab)
        const probed = await tab.evaluate(read, { properties: STYLES, selectors, refs: kitRefs })
        captured.forEach((entry, index) => {
            merge(entry.node, probed[index]?.node)
            inheritText(entry.node)
        })
        // Rich content, e.g. markdown, whose text flows in ways layers can't follow: a picture of it as it shows.
        if (spec?.picture) {
            await tab.reload()
            await tab.waitForSelector('[data-kit]')
            await tab.waitForTimeout(1500)
            const elements = await tab.$$('[data-kit]')
            for (const [index, entry] of captured.entries()) {
                const element = elements[index]
                if (entry.component !== component || !element) {
                    continue
                }
                const png = await element.screenshot({ type: 'png' })
                const { width, height } = entry.node
                entry.node = { tag: 'picture', classes: [], x: 0, y: 0, width, height, style: {}, picture: `data:image/png;base64,${png.toString('base64')}`, children: [] }
            }
        }
        real.push(...captured)
        Object.assign(images, await imagesOf(tab, captured))
    }
    const file = join(outputDir, `${component}.json`)
    writeFileSync(file, JSON.stringify({ component, theme: themeName, captured: real, images }, null, 1))
    console.log(`${component}: ${real.length} captured → ${file}`)
}
await browser.close()
const formulas = themeFormulas(themeName)
const themeFile = join(root, 'dist', 'design-kit', 'theme.json')
writeFileSync(themeFile, JSON.stringify({ theme: themeName, formulas }, null, 1))
console.log(`${Object.keys(formulas).length} theme variables → ${themeFile}`)
