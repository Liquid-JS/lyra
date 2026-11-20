// The examples' text is English in either direction, where a real app's would be in its page's language, so right to
// left would misplace its punctuation, e.g. a full stop or a leading number. Marked here, by what holds it, it reads
// left to right where the page puts it; the docs mark it, so the examples' code, which apps copy, needn't.

// Components whose items lay out controls or icons around their text the page's way, and mark their text themselves.
const SKIPPED = 'nb-menu, nb-tabset, nb-route-tabset, nb-pagination, nb-chat, svg, script, style, textarea'

/** How an element's text is marked: as a row's, or between left-to-right marks at both ends, its start or its end. */
type NgdTextMark = 'row' | 'text' | 'start' | 'end'

/**
 * Marks each element under `root` that holds English text of its own: `row` for a row, e.g. of an icon and its label,
 * whose text then takes its own direction, which leaves the row's layout alone; otherwise, its text keeps the page's
 * alignment between left-to-right marks, on the sides where the text, not e.g. a dot or swatch before it, ends the
 * element, so as not to take those along, and ends in a number or punctuation. Elements no longer holding text lose
 * their mark.
 */
export function markExampleText(root: Element) {
    for (const element of root.querySelectorAll('*')) {
        const mark = element.closest(SKIPPED) ? undefined : textMark(element)
        if (mark && element.getAttribute('data-ngd-text') !== mark) {
            element.setAttribute('data-ngd-text', mark)
        } else if (!mark && element.hasAttribute('data-ngd-text')) {
            element.removeAttribute('data-ngd-text')
        }
    }
}

function textMark(element: Element): NgdTextMark | undefined {
    // What it holds, without blank text or comments.
    const nodes = [...element.childNodes].filter(
        (node) => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
    )
    const isText = (node?: Node) => node?.nodeType === Node.TEXT_NODE && /[a-z0-9]/i.test(node.textContent ?? '')
    if (!nodes.some(isText)) {
        return undefined
    }
    if (/flex|grid/.test(getComputedStyle(element).display)) {
        return 'row'
    }
    // Only where it starts or ends with what right to left misplaces, a number or punctuation: a mark after a space
    // would show the space.
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const starts = isText(first) && /^[^\sa-z]/i.test(first.textContent ?? '')
    const ends = isText(last) && /[^\sa-z]$/i.test(last.textContent ?? '')
    return starts && ends ? 'text' : starts ? 'start' : ends ? 'end' : undefined
}
