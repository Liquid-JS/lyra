import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { chromium, type Page } from 'playwright'

import { COMPONENTS } from './components.ts'

/**
 * Checks the components on a phone and right to left: opens each specimen page at a phone's width, left to right and
 * then right to left, and lists the page's errors, the parts that run out of their component, and the parts that
 * don't mirror. Run it against the served playground:
 *
 *   yarn design-kit:devices [component …] [--url http://localhost:4200] [--width 390]
 *
 * Some findings are expected, e.g. a step's label wider than its number, or a menu's chevron that's another icon right
 * to left: it's a list to look through, not a pass or fail.
 */

const args = process.argv.slice(2)
const option = (name: string, fallback: string) => {
    const at = args.indexOf(`--${name}`)
    return at >= 0 ? args.splice(at, 2)[1] : fallback
}
const base = option('url', 'http://localhost:4200')
const width = Number(option('width', '390'))
const components = args.length ? args : Object.keys(COMPONENTS)
const output = join(resolve(import.meta.dirname, '..', '..', '..'), 'dist', 'design-kit', 'devices.json')

interface Box {
    part: string
    x: number
    w: number
    shown: boolean
}

interface Specimen {
    kit: string
    width: number
    boxes: Box[]
}

/** Each specimen's elements, as boxes relative to it, in the order of the page. Runs in the page. */
function measure(): Specimen[] {
    return Array.from(document.querySelectorAll('[data-kit]')).map((root) => {
        const rootBox = root.getBoundingClientRect()
        // What scrolls in its own box, e.g. code, or is there for screen readers alone, isn't laid out on the page.
        const inScroller = (element: Element) => {
            for (let at = element.parentElement; at && at !== root; at = at.parentElement) {
                if (['auto', 'scroll'].includes(getComputedStyle(at).overflowX)) {
                    return true
                }
            }
            return false
        }
        const elements = [root, ...Array.from(root.querySelectorAll('*'))].filter((element) => !(element instanceof SVGElement) || element instanceof SVGSVGElement)
        return {
            kit: root.getAttribute('data-kit') ?? '',
            width: rootBox.width,
            boxes: elements.map((element) => {
                const box = element.getBoundingClientRect()
                const style = getComputedStyle(element)
                const classes = typeof element.className === 'string' ? element.className.split(' ').filter(Boolean).slice(0, 2) : []
                return {
                    part: [element.tagName.toLowerCase(), ...classes].join('.'),
                    x: box.x - rootBox.x,
                    w: box.width,
                    shown:
                        box.width > 0 &&
                        box.height > 0 &&
                        style.visibility !== 'hidden' &&
                        style.position !== 'fixed' &&
                        !element.closest('.visually-hidden, .cdk-visually-hidden') &&
                        !inScroller(element)
                }
            })
        }
    })
}

const round = (value: number) => Math.round(value)

async function check(page: Page, component: string) {
    const found = { errors: new Set<string>(), spills: new Set<string>(), unmirrored: new Set<string>() }
    page.on('pageerror', (error) => found.errors.add(String(error).slice(0, 300)))
    page.on('console', (message) => message.type() === 'error' && found.errors.add(message.text().slice(0, 300)))
    await page.goto(`${base}/design-kit/${component}`)
    await page.waitForSelector('[data-kit]')
    await page.waitForTimeout(1000)
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' })
    const ltr = await page.evaluate(measure)
    // The playground's direction switch, which an overlay may cover.
    await page.evaluate(() => document.querySelector<HTMLInputElement>('npg-layout-direction-toggle input')?.click())
    await page.waitForTimeout(600)
    const rtl = await page.evaluate(measure)
    ltr.forEach((specimen, index) => {
        for (const box of specimen.boxes.filter((candidate) => candidate.shown)) {
            if (box.x < -1.5 || box.x + box.w > specimen.width + 1.5) {
                found.spills.add(`${specimen.kit} ${box.part}: ${round(box.x)} to ${round(box.x + box.w)} of ${round(specimen.width)}`)
            }
        }
        const mirrored = rtl[index]
        if (!mirrored || mirrored.boxes.length !== specimen.boxes.length) {
            found.unmirrored.add(`${specimen.kit}: other elements right to left`)
            return
        }
        specimen.boxes.forEach((box, at) => {
            const other = mirrored.boxes[at]
            const expected = specimen.width - box.x - box.w
            if (box.shown && other?.shown && (Math.abs(other.x - expected) > 2.5 || Math.abs(other.w - box.w) > 2.5)) {
                found.unmirrored.add(`${specimen.kit} ${box.part}: at ${round(other.x)} right to left, ${round(expected)} mirrored`)
            }
        })
    })
    return { errors: [...found.errors], spills: [...found.spills], unmirrored: [...found.unmirrored] }
}

const browser = await chromium.launch()
const report: Record<string, Awaited<ReturnType<typeof check>>> = {}
for (const component of components) {
    const page = await browser.newPage({ viewport: { width, height: 2400 } })
    try {
        report[component] = await check(page, component)
    } catch (error) {
        report[component] = { errors: [`The check failed: ${String(error).slice(0, 300)}`], spills: [], unmirrored: [] }
    }
    await page.close()
    const { errors, spills, unmirrored } = report[component]
    if (errors.length || spills.length || unmirrored.length) {
        console.log(`${component}: ${errors.length} errors, ${spills.length} parts out of the component, ${unmirrored.length} not mirrored`)
    }
}
await browser.close()
mkdirSync(join(output, '..'), { recursive: true })
writeFileSync(output, JSON.stringify(report, null, 1))
console.log(`${components.length} components at ${width}px, left to right and right to left → ${output}`)
