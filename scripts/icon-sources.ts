import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

/**
 * The icon pack's SVG sources, `packages/icons/svg`: the upstream icons as published in `eva/`, and Lyra's own in
 * `lyra/`, each as the markup inside its file's `<svg>`, tidied. Both the pack, `scripts/icons.ts`, and core's
 * `essentials` pack, `scripts/essential-icons.ts`, are made from them.
 */
export const ICON_SOURCES = join(resolve(import.meta.dirname, '..'), 'packages/icons/svg')

export interface Icon {
    name: string
    markup: string
}

const svg = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/

/**
 * Leaves out what an icon doesn't draw with: ids (unless something refers to one; `smiling-face` repeated its own) and
 * empty `<defs>`, which would repeat on a page with the icon more than once, and the design tool's layer names and
 * the plain groups they named (`<g data-name="Layer 2"><g data-name="star">…`; some were copy-paste slips, like
 * `more-horizotnal`), which a page doesn't need either.
 */
function tidy(markup: string): string {
    let tidied = markup.replace(/\s+data-name="[^"]*"/g, '')
    if (!/url\(#|href="#/.test(tidied)) {
        tidied = tidied.replace(/\s+id="[^"]*"/g, '').replace(/<defs>\s*(?:<style\s*\/>|<style>\s*<\/style>)?\s*<\/defs>/g, '')
    }
    // Groups go only when none of them does anything (a transform, a fill), so their closing tags can't be mismatched.
    if (!/<g\s[^>]*>/.test(tidied)) {
        tidied = tidied.replace(/<\/?g>/g, '')
    }
    return tidied
}

function readIcons(set: 'eva' | 'lyra'): Icon[] {
    return (['fill', 'outline'] as const).flatMap((style) => {
        const folder = join(ICON_SOURCES, set, style)
        if (!existsSync(folder)) {
            return []
        }
        return readdirSync(folder)
            .filter((file) => file.endsWith('.svg'))
            .map((file) => {
                const name = file.slice(0, -'.svg'.length)
                if ((style === 'outline') !== name.endsWith('-outline')) {
                    throw new Error(`${set}/${style}/${file}: outline icons are named *-outline.svg, and only they are.`)
                }
                const match = svg.exec(readFileSync(join(folder, file), 'utf8'))
                if (!match) {
                    throw new Error(`${set}/${style}/${file} isn't a single <svg> element.`)
                }
                if (!/\bviewBox="0 0 24 24"/.test(match[1])) {
                    throw new Error(`${set}/${style}/${file} needs viewBox="0 0 24 24", as the pack draws every icon in it.`)
                }
                return { name, markup: tidy(match[2].trim()) }
            })
    })
}

/** Every icon, by name, checked: no name twice, and no drawing under two names. */
export function readIconSources(): Icon[] {
    const icons = [...readIcons('eva'), ...readIcons('lyra')].sort((a, b) => (a.name < b.name ? -1 : 1))
    const duplicates = icons.filter((icon, index) => icons.findIndex(({ name }) => name === icon.name) !== index)
    if (duplicates.length) {
        throw new Error(`Icons in both sets: ${duplicates.map(({ name }) => name).join(', ')}.`)
    }
    // One name per drawing: an icon whose fill and outline would look the same has only the name that describes it.
    const sameDrawing = icons.filter(
        (icon, index) => icons.findIndex(({ markup }) => markup.replace(/\s+/g, ' ') === icon.markup.replace(/\s+/g, ' ')) !== index
    )
    if (sameDrawing.length) {
        throw new Error(
            `Drawn the same as another icon: ${sameDrawing.map(({ name }) => name).join(', ')}. Keep one name: the outline's for a ` +
        'drawing with nothing to fill, the fill\'s for a solid one.'
        )
    }
    return icons
}
